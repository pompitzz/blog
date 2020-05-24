---
title: 아이템 43. 람다보다는 메서드 참조를 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 자바에서는 함수 객체를 람다보다도 더 간결하게 만드는 메서드 참조를 제공한다.
- 매개변수 수가 늘어날 수록 메서드 참조로 제거할 수 있는 코드양도 늘어난다.
- 하지만 어떤 람다에서는 매개변수의 이름 자체가 프로그래머에게 좋은 가이드가 되기도 한다.

#### 메서드 참조 유형
- 정적
    - Integer::parseInt <-> str -> Integer.parseInt(str)
- 한정적(인스턴스)
    - Instant.now()::isAfter <-> Instant then = Instant.now; t -> then.isAfter(t)
- 비한정적(인스턴스)
    - String::toLowerCase <-> str -> str.toLowerCase()
- 클래스 생성자
    - TreeMap<K,v>::new <-> () -> new TreeMap<K,V>()
- 배열 생성자
    - int[]::new <-> len -> new int\[len]

#### 람다식은 불가능하나 메서드 참조는 가능한 경우
```java
public class Main {
  public static void main(String[] args) {
    G g = Main::methodRefer;

    // G g2 = () -> "Hello";  //에러 발생
    // <F extends Exception> () -> String throws F
    // 이 형태로 표현되어야 하지만 제네릭 람다식이라는 문법이 존재하지 않는다.
  }

  private static String methodRefer() {
    return "Hello";
  }
}

interface G {
  <E extends Exception> String m() throws E;
}
```
- 위와 같이 제네릭 람다식은 사용이 불가능하지만 메서드 참조로는 구현할 수 있다.    

#### 핵심 정리
- 메서드 참조는 람다의 간단명료한 대안이 될 수 있다.
- **메서드 참조 쪽이 짧고 명화가하다면 메서드 참조를 쓰고, 그렇지 않을 때만 람다를 사용하라.**
