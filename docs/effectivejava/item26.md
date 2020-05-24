---
title: 아이템 26. raw 타입은 사용하지 말라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
# 아이템 26. raw 타입은 사용하지 말라
- 클래스와 인터페이스 선언에 타입 매개변수가 쓰이면, 이를 제네릭 클래스, 인터페이스라고 한다.
- 제네릭 클래스와 제네릭 인터페이스를 통틀어 제네릭 타입이라고 한다.
- 각각의 제네릭 타입은 일련의 매개변수화 타입(parameterized type)을 정의한다.
- List\<String\>는 원소 타입이 String인 리스트를 뜻하는 parameterized type이다.
- 그리고 제네릭 타입을 정의하면 그에 딸린 **raw 타입**도 함께 정의된다.
- **raw 타입이란 제네릭 타입에서 타입 매개변수를 전혀 사용하지 않는 때를 말한다.**

> - 오류는 가능한 한 발생 즉시, 이상적으로는 컴파일 때 발견하는게 가장 좋지만 raw 타입은 잘못된 타입을 넣어도 런타입 시점에 알아차릴 수 있다.

- 제네릭을 활용하면 컴파일러는 컬렉션에서 원소를 꺼내는 모든 곳에 보이지 않는 형변환을 추가하여 절대 실패하지 않음을 보장한다.
- **raw 타입을 쓰면 제네릭이 안겨주는 안정성과 표현력 모두를 잃게 될 것이다.**

#### raw 타입이 계속 남아있는 이유
- raw 타입이 나오기 전의 자바 코드와 호환성을 맞추기 위해 raw 타입은 여전히 존재한다.
- 이러한 마이그레이션 호환성을 위해 JAVA는 raw 타입을 지원하고 제네릭 구현에는 erasure 방식을 사용하게 되었다.

#### List\<Object\>
- raw 타입은 사용하면 안되지만 임의 객체를 허용하는 List\<Ojbect\>같은 매개변수 타입은 괜찮다.
- List\<Object\>는 List와 다르게 제네릭 하위 타입 규칙으로 인해 Object외 다른 타입을 넘길 수 없다.

```java
public class Main {
  public static void main(String[] args) {
    List<String> strings = new ArrayList<>();
    unsafeAdd(strings, Integer.valueOf(42));
    System.out.println(strings.get(0));
  }

  private static void unsafeAdd(List list, Object o) {
    list.add(o);
  }
}
```
- unsafeAdd에서 raw type을 파라미터로 사용할 경우 해당 코드는 컴파일이 되고 런타임 시점에 에러가 발생한다.

```java
public class Main {
  public static void main(String[] args) {
    List<String> strings = new ArrayList<>();
    unsafeAdd(strings, Integer.valueOf(42));
    System.out.println(strings.get(0));
  }

  private static void unsafeAdd(List<Object> list, Object o) {
    list.add(o);
  }
}
```
- List\<Object\>를 파라미터로 사용하면 strings를 넘겨주는거 조차 불가능 하므로 컴파일타임에 에러가 발생한다.

#### 와일드 카드
- 제네릭 타입을 쓰고 싶지만 실제 타입 매개변수가 무엇인지 신경쓰고 싶지 않을 때는 와일드 카드를 사용하자.
- 와일드 카드 타입은 안전하고 raw 타입은 안전하지 않다.
- raw 타입 컬렉션에는 아무 원소나 넣을 수 있어 타입 불변식을 훼손하기 쉽지만 와일드카드 타입은 null외에는 어떤 원소도 넣을 수 없다.

#### 추가 규칙
- class 리터럴에는 raw 타입을 써야한다.
- 자바 명세에는 class 리터럴에 매개변수화 타입을 사용하지 못하게 했다.(배열과 기본타입은 허용)
- 즉 List.class, String[].class, int.class는 가능하지만 List<String>.class는 허용되지 않는다.
- 두 번째로 런타임에는 제네릭 타입 정보가 지워지므로 instanceof 연산자는 비한정적 와일드카드 타입 이외의 매개변수화 타입에는 적용할 수 없다.

#### 핵심 정리
- raw 타입을 사용하면 런타임 예외가 일어나기 쉬우며 사용하면 안된다.
- raw 타입은 제네릭이 생기기전의 하위 호환성을 위해 제공될 뿐이다.
- raw 타입은 안전하지 않지만 <Object>, <?>는 안전하다.