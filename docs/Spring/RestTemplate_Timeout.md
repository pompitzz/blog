---
title: Spring RestTemplate의 ConnectionTimout vs ReadTimoeut
date: 2023-09-13 23:04
img:
  - spring.png
tags:
  - Java
  - Spring
---

```java
RestTemplate restTemplate = new RestTemplateBuilder()
        .setConnectTimeout(Duration.ofSeconds(3))
        .setReadTimeout(Duration.ofSeconds(3))
        .build();
```

- 스프링 부트에서 제공해주는 `RestTemplateBuilder`로 `RestTemplate` 생성 시 설정할 수 있는 Timeout에는 `ConnectionTimeout`, `ReadTimeout`이 있다. 
- 이름만으로도 `ConnectionTimeout`은 커넥션을 맺을 때 사용되고 `ReadTimeout`은 데이터를 읽을 때 사용되는 것으로 충분히 유추할 수 있다. 
- 내부적으로 이 타임아웃 값들이 어디서 어떻게 사용되는지 살펴보자.

### ClientHttpRequestFactory 선택
- `RestTemplateBuilder.build` 시점에 실제 HTTP 통신을 위한 HTTP Client 구현체를 선택하게 된다.
- 스프링 부트에서는 기본적으로 3개의 구현체를 기반으로 선택해준다.
- 구현체 선택 규칙은 `ClientHttpRequestFactories.java`에 정의되어 있다.

```java
// ClientHttpRequestFactories.java
public static ClientHttpRequestFactory get(ClientHttpRequestFactorySettings settings) {
    Assert.notNull(settings, "Settings must not be null");
    if (APACHE_HTTP_CLIENT_PRESENT) {
        return HttpComponents.get(settings); // HttpComponentsClientHttpRequestFactory
    }
    if (OKHTTP_CLIENT_PRESENT) {
        return OkHttp.get(settings); // OkHttp3ClientHttpRequestFactory
    }
    return Simple.get(settings); // SimpleClientHttpRequestFactory
}
```
1. 만약 프로젝트에 Apache Http Client가 존재한다면 Apache Http Client를 사용한다.   
2. 만약 프로젝트에 OkHttp Client가 존재한다면 OkHttp Client를 사용한다.
3. 마지막으로 표준 JDK가 제공하는 `java.net.HttpURLConnection`를 사용한다.
   - RestTemplate를 일반 생성자로 만드는 경우 디폴트로 `java.net.HttpURLConnection`를 사용한다.

필요하다면 ClientHttpRequestFactory를 직접 구현해서 새로운 Http Client 구현체를 사용할 수 있다.

### 모든 HTTP Client 구현체들은 결국 Socket을 사용한다.
- 세 구현체 모두 최종적으로 JDK가 제공하는 `java.net.Socket` 클래스를 사용한다. 
  - 해당 클래스는 네트워크 통신을 위해 제공하는 클라이언트 소켓 구현체이다.
- 그러므로 `RestTemplateBuilder`에서 설정한 Timeout 설정 값들은 `Socket`에서 사용된다.

### ConnectionTimeout은 socket.connect에서 사용된다.
```java
socket.connect(new InetSocketAddress(server, port), connectTimeout);
```

- TCP 네트워크 통신을 위해서는 먼저 상대방(서버)과 커넥션을 맺기위한 TCP 3-Way Handshake가 수행되어야 한다.
- 커넥션을 맺기 위해 `Socket` 인스턴스에서 `socket.connect` 함수를 호출하게 되는데 이때 설정한 `ConnectionTimeout` 값을 사용하게 된다.
- 만약 커넥션을 맺는 시간이 `ConnectionTimeout`을 초과하게 되면 `SocketTimeoutExcpetion(Connect timed out)`이 발생한다.

### ReadTimeout은 socket.setSoTimeout에서 사용된다.
```java
socket.setSoTimeout(readTimeout);
```
- `setSoTimeout`은 서버의 응답 데이터를 읽을 때의 타임아웃을 지정하기 위해 사용된다.
- 서버가 데이터를 반환하면 해당 데이터는 `Socket` 내부의 `SocketInputStream.read()`를 통해서 바이트 형태로 읽을 수 있다.
- 각 HTTP Client 구현체들은 요청을 보내고 응답 데이터를 읽기 위해 `SocketInputStream.read()`를 호출하게 되는데 `ReadTimeout`이 지날 때 동안 서버가 응답을 하지 않아 `SocketInputStream`에 아무런 데이터도 쌓이지 않는다면 `SocketTimeoutException(Read timed out)`이 발생한다.

### 각 구현체별 Stack Trace 살펴보기
- 실제 `RestTemplate`을 통해 각각의 Timeout 에러를 발생시켜서 출력되는 stack trace를 살펴보면 모든 구현체가 최종적으로 `Socket`을 사용하는 것을 쉽게 알 수 있다.
- `ConnectionTimeout`의 경우 'Connect timed out' 예외가 발생하고 세 구현체 모두 `java.net.Socket.connect(Socket.java:633)`에서 stack trace가 찍히는 걸 볼 수 있다.
- `ReadTimeout`의 경우 'Read timed out' 예외가 발생하고 세 구현체 모두 `java.net.Socket$SocketInputStream.read(Socket.java:966)`에서 stack trace가 찍히는 걸 볼 수 있다.


```java
public static void main(String[] args) {
    RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofMillis(3000)) // connection timeout 에러를 유발시키기 위해서 값을 10 이하로 조정 
            .setReadTimeout(Duration.ofMillis(3000)) // read timeout 에러를 유발시키기 위해서 값을 10 이하로 조정
            .build();

    // https 요청 시 내부적으로 SSLSocket을 사용해 stack trace가 더 복잡하므로 http으로 요청을 보낸다.
    restTemplate.getForEntity("http://naver.com", String.class).getBody();
}
```

**Apache Http Client 구현체 사용**
- Apache Http Client를 추가하면 자동으로 Apache Http Client가 사용된다. 
- `implementation 'org.apache.httpcomponents.client5:httpclient5:5.2.1'`

```
// Connect timed out 
Caused by: org.apache.hc.client5.http.ConnectTimeoutException: Connect to http://naver.com:80 [naver.com/223.130.200.107, naver.com/223.130.195.200, naver.com/223.130.195.95, naver.com/223.130.200.104] failed: Connect timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)
	at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)
Caused by: org.apache.hc.client5.http.ConnectTimeoutException: Connect to http://naver.com:80 [naver.com/223.130.200.107, naver.com/223.130.195.200, naver.com/223.130.195.95, naver.com/223.130.200.104] failed: Connect timed out
	at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327)
	at java.base/java.net.Socket.connect(Socket.java:633)
	at org.apache.hc.client5.http.socket.PlainConnectionSocketFactory.lambda$connectSocket$0(PlainConnectionSocketFactory.java:85)
	at java.base/java.security.AccessController.doPrivileged(AccessController.java:569)
	at org.apache.hc.client5.http.socket.PlainConnectionSocketFactory.connectSocket(PlainConnectionSocketFactory.java:84)
	at org.apache.hc.client5.http.socket.ConnectionSocketFactory.connectSocket(ConnectionSocketFactory.java:113)

--------------------------------------------------------------------------------------------------------------------------------

// Read timed out
Caused by: java.net.SocketTimeoutException: Read timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)
	at java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)
	at java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)
	at java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)
	at java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)
Caused by: java.net.SocketTimeoutException: Read timed out
	at org.apache.hc.core5.http.impl.io.SessionInputBufferImpl.fillBuffer(SessionInputBufferImpl.java:149)
	at org.apache.hc.core5.http.impl.io.SessionInputBufferImpl.readLine(SessionInputBufferImpl.java:280)
```

**OkHttp Client 구현체 사용**
- OkHttp Client를 사용하기 위해선 Apache Http Client 라이브러리는 제거해야 한다.
- `implementation 'com.squareup.okhttp3:okhttp:4.11.0'`

```
// Connect timed out
Caused by: java.net.SocketTimeoutException: Connect timed out
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)
        at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)
        at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327)
        at java.base/java.net.Socket.connect(Socket.java:633)
        at okhttp3.internal.platform.Platform.connectSocket(Platform.kt:128)
        at okhttp3.internal.connection.RealConnection.connectSocket(RealConnection.kt:295)
        at okhttp3.internal.connection.RealConnection.connect(RealConnection.kt:207)
        at okhttp3.internal.connection.ExchangeFinder.findConnection(ExchangeFinder.kt:226)
        Caused by: java.net.SocketTimeoutException: Connect timed out
        at okhttp3.internal.connection.ExchangeFinder.findHealthyConnection(ExchangeFinder.kt:106)
        at okhttp3.internal.connection.ExchangeFinder.find(ExchangeFinder.kt:74)

--------------------------------------------------------------------------------------------------------------------------------

// Read timed out
Caused by: java.net.SocketTimeoutException: Read timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)
	at java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)
	at java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)
	at java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)
Caused by: java.net.SocketTimeoutException: Read timed out
	at java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)
	at okio.InputStreamSource.read(JvmOkio.kt:94)
	at okio.AsyncTimeout$source$1.read(AsyncTimeout.kt:125)
```

**java.net.HttpURLConnection 구현체 사용**
- Apache Http Client, OkHttp Client 라이브러리를 모두 제거하면 JDK의 HttpURLConnection를 사용하게 된다. 
```
// Connect timed out
Caused by: java.net.SocketTimeoutException: Connect timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)
	at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)
Caused by: java.net.SocketTimeoutException: Connect timed out
	at java.base/java.net.Socket.connect(Socket.java:633)
	at java.base/sun.net.NetworkClient.doConnect(NetworkClient.java:178)
	at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:498)

--------------------------------------------------------------------------------------------------------------------------------

// Read timed out
Caused by: java.net.SocketTimeoutException: Read timed out
    at java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)
    at java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)
    at java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)
    at java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)
Caused by: java.net.SocketTimeoutException: Read timed out
    at java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)
    at java.base/java.io.BufferedInputStream.fill(BufferedInputStream.java:244)
    at java.base/java.io.BufferedInputStream.read1(BufferedInputStream.java:284)
```


