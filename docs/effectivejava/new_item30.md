---
title: 아이템 30. 이왕이면 제네릭 메서드로 만들라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- **타입 매개 변수 목록은 메서드의 제한자와 반환 타입 사이에 온다.**
- 타입 매개 변수 명명 규칙은 제네릭 메서드나 제네릭 타입이나 똑같다.


#### 항등함수
- 항등함수는 Function.identity를 사용하면 되지만 직접 한번 작성해보자.
- 항등함수는 객체의 상태가 없으니 요청할 때 마다 새로 생성하기 보다 캐싱해두면 좋다.
- 자바 제네릭의 erasure의 특징을 활용하여 아래와 같이 구현할 수 있다.

```java
public class Main {
  private static UnaryOperator<Object> IDENTITY_FN = (t) -> t;

  @SuppressWarnings("unchecked")
  public static <T> UnaryOperator<T> identityFunctioN() {
    return (UnaryOperator<T>) IDENTITY_FN;
  }
}
```
- 입력값을 그대로 반환하는 항등함수는 이렇게 구현해도 타입 문제가 발생하지 않는다.
- 그러므로 경고 메시지를 숨겨도 된다.
 
 #### 재귀적 타입 한정
 - 자기 자신이 들어간 표현식을 사용하여 타입 매개변수의 허용 범위를 제한
 - 주로 자연적 순서를 정하는 Comparable 인터페이스와 함께 쓰인다.
 - public static \<E extends Comparable\<E\>\>
 - 이 표현은 "모든 타입 E는 자신과 비교할 수 있다"라는 뜻을 담고 있다. 즉 상호 비교가능하다.
 
 #### 정리
 - 제네릭 타입과 마찬가지로, 클라이언트에서 입력 매개변수와 반환값을 명시적으로 형변환해야 하는 메서드보다 제네릭 메서드가 더 안전하며 사용하기 쉽다.
 - 타입과 마찬가지로, 메서드도 형변환 없이 사용할 수 있는 편이 좋으며, 많은 경우 그렇게 하려면 제네릭 메서드가 되어야 한다.
 - 역시 타입과 마찬가지로, 형변환이 필요한 메서드는 제네릭하게 만들자.
 
 
