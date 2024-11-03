(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{584:function(t,a,n){"use strict";n.r(a);var s=n(31),e=Object(s.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("div",{staticClass:"language-java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RestTemplate")]),t._v(" restTemplate "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RestTemplateBuilder")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setConnectTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Duration")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("ofSeconds")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setReadTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Duration")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("ofSeconds")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br")])]),n("ul",[n("li",[t._v("스프링 부트에서 제공해주는 "),n("code",[t._v("RestTemplateBuilder")]),t._v("로 "),n("code",[t._v("RestTemplate")]),t._v(" 생성 시 설정할 수 있는 Timeout에는 "),n("code",[t._v("ConnectionTimeout")]),t._v(", "),n("code",[t._v("ReadTimeout")]),t._v("이 있다.")]),t._v(" "),n("li",[t._v("이름만으로도 "),n("code",[t._v("ConnectionTimeout")]),t._v("은 커넥션을 맺을 때 사용되고 "),n("code",[t._v("ReadTimeout")]),t._v("은 데이터를 읽을 때 사용되는 것으로 충분히 유추할 수 있다.")]),t._v(" "),n("li",[t._v("내부적으로 이 타임아웃 값들이 어디서 어떻게 사용되는지 살펴보자.")])]),t._v(" "),n("h2",{attrs:{id:"clienthttprequestfactory-선택"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#clienthttprequestfactory-선택"}},[t._v("#")]),t._v(" ClientHttpRequestFactory 선택")]),t._v(" "),n("ul",[n("li",[n("code",[t._v("RestTemplateBuilder.build")]),t._v(" 시점에 실제 HTTP 통신을 위한 HTTP Client 구현체를 선택하게 된다.")]),t._v(" "),n("li",[t._v("스프링 부트에서는 기본적으로 3개의 구현체를 기반으로 선택해준다.")]),t._v(" "),n("li",[t._v("구현체 선택 규칙은 "),n("code",[t._v("ClientHttpRequestFactories.java")]),t._v("에 정의되어 있다.")])]),t._v(" "),n("div",{staticClass:"language-java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ClientHttpRequestFactories.java")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ClientHttpRequestFactory")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ClientHttpRequestFactorySettings")]),t._v(" settings"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Assert")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("notNull")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("settings"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Settings must not be null"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("APACHE_HTTP_CLIENT_PRESENT"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpComponents")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("settings"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// HttpComponentsClientHttpRequestFactory")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("OKHTTP_CLIENT_PRESENT"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("OkHttp")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("settings"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// OkHttp3ClientHttpRequestFactory")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Simple")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("settings"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// SimpleClientHttpRequestFactory")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br")])]),n("ol",[n("li",[t._v("만약 프로젝트에 Apache Http Client가 존재한다면 Apache Http Client를 사용한다.")]),t._v(" "),n("li",[t._v("만약 프로젝트에 OkHttp Client가 존재한다면 OkHttp Client를 사용한다.")]),t._v(" "),n("li",[t._v("마지막으로 표준 JDK가 제공하는 "),n("code",[t._v("java.net.HttpURLConnection")]),t._v("를 사용한다.\n"),n("ul",[n("li",[t._v("RestTemplate를 일반 생성자로 만드는 경우 디폴트로 "),n("code",[t._v("java.net.HttpURLConnection")]),t._v("를 사용한다.")])])])]),t._v(" "),n("p",[t._v("필요하다면 ClientHttpRequestFactory를 직접 구현해서 새로운 Http Client 구현체를 사용할 수 있다.")]),t._v(" "),n("h2",{attrs:{id:"모든-http-client-구현체들은-결국-socket을-사용한다"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#모든-http-client-구현체들은-결국-socket을-사용한다"}},[t._v("#")]),t._v(" 모든 HTTP Client 구현체들은 결국 Socket을 사용한다.")]),t._v(" "),n("ul",[n("li",[t._v("세 구현체 모두 최종적으로 JDK가 제공하는 "),n("code",[t._v("java.net.Socket")]),t._v(" 클래스를 사용한다.\n"),n("ul",[n("li",[t._v("해당 클래스는 네트워크 통신을 위해 제공하는 클라이언트 소켓 구현체이다.")])])]),t._v(" "),n("li",[t._v("그러므로 "),n("code",[t._v("RestTemplateBuilder")]),t._v("에서 설정한 Timeout 설정 값들은 "),n("code",[t._v("Socket")]),t._v("에서 사용된다.")])]),t._v(" "),n("h2",{attrs:{id:"connectiontimeout은-socket-connect에서-사용된다"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#connectiontimeout은-socket-connect에서-사용된다"}},[t._v("#")]),t._v(" ConnectionTimeout은 socket.connect에서 사용된다.")]),t._v(" "),n("div",{staticClass:"language-java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[t._v("socket"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("connect")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InetSocketAddress")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("server"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" port"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" connectTimeout"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br")])]),n("ul",[n("li",[t._v("TCP 네트워크 통신을 위해서는 먼저 상대방(서버)과 커넥션을 맺기위한 TCP 3-Way Handshake가 수행되어야 한다.")]),t._v(" "),n("li",[t._v("커넥션을 맺기 위해 "),n("code",[t._v("Socket")]),t._v(" 인스턴스에서 "),n("code",[t._v("socket.connect")]),t._v(" 함수를 호출하게 되는데 이때 설정한 "),n("code",[t._v("ConnectionTimeout")]),t._v(" 값을 사용하게 된다.")]),t._v(" "),n("li",[t._v("만약 커넥션을 맺는 시간이 "),n("code",[t._v("ConnectionTimeout")]),t._v("을 초과하게 되면 "),n("code",[t._v("SocketTimeoutExcpetion(Connect timed out)")]),t._v("이 발생한다.")])]),t._v(" "),n("h2",{attrs:{id:"readtimeout은-socket-setsotimeout에서-사용된다"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#readtimeout은-socket-setsotimeout에서-사용된다"}},[t._v("#")]),t._v(" ReadTimeout은 socket.setSoTimeout에서 사용된다.")]),t._v(" "),n("div",{staticClass:"language-java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[t._v("socket"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setSoTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("readTimeout"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br")])]),n("ul",[n("li",[n("code",[t._v("setSoTimeout")]),t._v("은 서버의 응답 데이터를 읽을 때의 타임아웃을 지정하기 위해 사용된다.")]),t._v(" "),n("li",[t._v("서버가 데이터를 반환하면 해당 데이터는 "),n("code",[t._v("Socket")]),t._v(" 내부의 "),n("code",[t._v("SocketInputStream.read()")]),t._v("를 통해서 바이트 형태로 읽을 수 있다.")]),t._v(" "),n("li",[t._v("각 HTTP Client 구현체들은 요청을 보내고 응답 데이터를 읽기 위해 "),n("code",[t._v("SocketInputStream.read()")]),t._v("를 호출하게 되는데 "),n("code",[t._v("ReadTimeout")]),t._v("이 지날 때 동안 서버가 응답을 하지 않아 "),n("code",[t._v("SocketInputStream")]),t._v("에 아무런 데이터도 쌓이지 않는다면 "),n("code",[t._v("SocketTimeoutException(Read timed out)")]),t._v("이 발생한다.")])]),t._v(" "),n("h2",{attrs:{id:"각-구현체별-stack-trace-살펴보기"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#각-구현체별-stack-trace-살펴보기"}},[t._v("#")]),t._v(" 각 구현체별 Stack Trace 살펴보기")]),t._v(" "),n("ul",[n("li",[t._v("실제 "),n("code",[t._v("RestTemplate")]),t._v("을 통해 각각의 Timeout 에러를 발생시켜서 출력되는 stack trace를 살펴보면 모든 구현체가 최종적으로 "),n("code",[t._v("Socket")]),t._v("을 사용하는 것을 쉽게 알 수 있다.")]),t._v(" "),n("li",[n("code",[t._v("ConnectionTimeout")]),t._v("의 경우 'Connect timed out' 예외가 발생하고 세 구현체 모두 "),n("code",[t._v("java.net.Socket.connect(Socket.java:633)")]),t._v("에서 stack trace가 찍히는 걸 볼 수 있다.")]),t._v(" "),n("li",[n("code",[t._v("ReadTimeout")]),t._v("의 경우 'Read timed out' 예외가 발생하고 세 구현체 모두 "),n("code",[t._v("java.net.Socket$SocketInputStream.read(Socket.java:966)")]),t._v("에서 stack trace가 찍히는 걸 볼 수 있다.")])]),t._v(" "),n("div",{staticClass:"language-java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("main")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" args"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RestTemplate")]),t._v(" restTemplate "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RestTemplateBuilder")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setConnectTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Duration")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("ofMillis")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// connection timeout 에러를 유발시키기 위해서 값을 10 이하로 조정 ")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setReadTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Duration")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("ofMillis")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// read timeout 에러를 유발시키기 위해서 값을 10 이하로 조정")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// https 요청 시 내부적으로 SSLSocket을 사용해 stack trace가 더 복잡하므로 http으로 요청을 보낸다.")]),t._v("\n    restTemplate"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getForEntity")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"http://naver.com"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBody")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br")])]),n("h3",{attrs:{id:"apache-http-client-구현체-사용"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#apache-http-client-구현체-사용"}},[t._v("#")]),t._v(" Apache Http Client 구현체 사용")]),t._v(" "),n("ul",[n("li",[t._v("Apache Http Client를 추가하면 자동으로 Apache Http Client가 사용된다.")]),t._v(" "),n("li",[n("code",[t._v("implementation 'org.apache.httpcomponents.client5:httpclient5:5.2.1'")])])]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("// Connect timed out \nCaused by: org.apache.hc.client5.http.ConnectTimeoutException: Connect to http://naver.com:80 [naver.com/223.130.200.107, naver.com/223.130.195.200, naver.com/223.130.195.95, naver.com/223.130.200.104] failed: Connect timed out\n\tat java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)\n\tat java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)\nCaused by: org.apache.hc.client5.http.ConnectTimeoutException: Connect to http://naver.com:80 [naver.com/223.130.200.107, naver.com/223.130.195.200, naver.com/223.130.195.95, naver.com/223.130.200.104] failed: Connect timed out\n\tat java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327)\n\tat java.base/java.net.Socket.connect(Socket.java:633)\n\tat org.apache.hc.client5.http.socket.PlainConnectionSocketFactory.lambda$connectSocket$0(PlainConnectionSocketFactory.java:85)\n\tat java.base/java.security.AccessController.doPrivileged(AccessController.java:569)\n\tat org.apache.hc.client5.http.socket.PlainConnectionSocketFactory.connectSocket(PlainConnectionSocketFactory.java:84)\n\tat org.apache.hc.client5.http.socket.ConnectionSocketFactory.connectSocket(ConnectionSocketFactory.java:113)\n\n--------------------------------------------------------------------------------------------------------------------------------\n\n// Read timed out\nCaused by: java.net.SocketTimeoutException: Read timed out\n\tat java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)\n\tat java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)\n\tat java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)\n\tat java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)\n\tat java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)\nCaused by: java.net.SocketTimeoutException: Read timed out\n\tat org.apache.hc.core5.http.impl.io.SessionInputBufferImpl.fillBuffer(SessionInputBufferImpl.java:149)\n\tat org.apache.hc.core5.http.impl.io.SessionInputBufferImpl.readLine(SessionInputBufferImpl.java:280)\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br"),n("span",{staticClass:"line-number"},[t._v("22")]),n("br"),n("span",{staticClass:"line-number"},[t._v("23")]),n("br"),n("span",{staticClass:"line-number"},[t._v("24")]),n("br")])]),n("h3",{attrs:{id:"okhttp-client-구현체-사용"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#okhttp-client-구현체-사용"}},[t._v("#")]),t._v(" OkHttp Client 구현체 사용")]),t._v(" "),n("ul",[n("li",[t._v("OkHttp Client를 사용하기 위해선 Apache Http Client 라이브러리는 제거해야 한다.")]),t._v(" "),n("li",[n("code",[t._v("implementation 'com.squareup.okhttp3:okhttp:4.11.0'")])])]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("// Connect timed out\nCaused by: java.net.SocketTimeoutException: Connect timed out\n        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)\n        at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)\n        at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327)\n        at java.base/java.net.Socket.connect(Socket.java:633)\n        at okhttp3.internal.platform.Platform.connectSocket(Platform.kt:128)\n        at okhttp3.internal.connection.RealConnection.connectSocket(RealConnection.kt:295)\n        at okhttp3.internal.connection.RealConnection.connect(RealConnection.kt:207)\n        at okhttp3.internal.connection.ExchangeFinder.findConnection(ExchangeFinder.kt:226)\n        Caused by: java.net.SocketTimeoutException: Connect timed out\n        at okhttp3.internal.connection.ExchangeFinder.findHealthyConnection(ExchangeFinder.kt:106)\n        at okhttp3.internal.connection.ExchangeFinder.find(ExchangeFinder.kt:74)\n\n--------------------------------------------------------------------------------------------------------------------------------\n\n// Read timed out\nCaused by: java.net.SocketTimeoutException: Read timed out\n\tat java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)\n\tat java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)\n\tat java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)\n\tat java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)\nCaused by: java.net.SocketTimeoutException: Read timed out\n\tat java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)\n\tat okio.InputStreamSource.read(JvmOkio.kt:94)\n\tat okio.AsyncTimeout$source$1.read(AsyncTimeout.kt:125)\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br"),n("span",{staticClass:"line-number"},[t._v("22")]),n("br"),n("span",{staticClass:"line-number"},[t._v("23")]),n("br"),n("span",{staticClass:"line-number"},[t._v("24")]),n("br"),n("span",{staticClass:"line-number"},[t._v("25")]),n("br"),n("span",{staticClass:"line-number"},[t._v("26")]),n("br")])]),n("h3",{attrs:{id:"java-net-httpurlconnection-구현체-사용"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#java-net-httpurlconnection-구현체-사용"}},[t._v("#")]),t._v(" java.net.HttpURLConnection 구현체 사용")]),t._v(" "),n("ul",[n("li",[t._v("Apache Http Client, OkHttp Client 라이브러리를 모두 제거하면 JDK의 HttpURLConnection를 사용하게 된다.")])]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("// Connect timed out\nCaused by: java.net.SocketTimeoutException: Connect timed out\n\tat java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:546)\n\tat java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)\nCaused by: java.net.SocketTimeoutException: Connect timed out\n\tat java.base/java.net.Socket.connect(Socket.java:633)\n\tat java.base/sun.net.NetworkClient.doConnect(NetworkClient.java:178)\n\tat java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:498)\n\n--------------------------------------------------------------------------------------------------------------------------------\n\n// Read timed out\nCaused by: java.net.SocketTimeoutException: Read timed out\n    at java.base/sun.nio.ch.NioSocketImpl.timedRead(NioSocketImpl.java:283)\n    at java.base/sun.nio.ch.NioSocketImpl.implRead(NioSocketImpl.java:309)\n    at java.base/sun.nio.ch.NioSocketImpl.read(NioSocketImpl.java:350)\n    at java.base/sun.nio.ch.NioSocketImpl$1.read(NioSocketImpl.java:803)\nCaused by: java.net.SocketTimeoutException: Read timed out\n    at java.base/java.net.Socket$SocketInputStream.read(Socket.java:966)\n    at java.base/java.io.BufferedInputStream.fill(BufferedInputStream.java:244)\n    at java.base/java.io.BufferedInputStream.read1(BufferedInputStream.java:284)\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br")])])])}),[],!1,null,null,null);a.default=e.exports}}]);