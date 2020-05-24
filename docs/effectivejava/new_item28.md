---
title: 아이템 28. 배열보다는 리스트를 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 배열과 제네릭 타입에는 중요한 차이가 두 가지 있다.

#### 첫 번째 차이
- 첫째는 배열은 공변(covariant)이라는 것이다.
  - Sub가 Super의 하위 타입이라면 배열 Sub[]는 배열Super[]의 하위 타입이 된다.
- 반면 제네릭은 불공변이다.
  - List<Sub>는 List<Super>의 하위 타입이 아니다.
- 제네릭이 이상한거 같지만 사실 배열이 문제가 있는 것이다.

```java
public class Main {
  public static void main(String[] args) {
    Object[] objects = new Long[1];
    objects[0] = "타입이 달라 넣을 수 없지만 컴파일은 된다";
  }
}
```
- 해당 코드는 컴파일은 되지만 런타임시 문제가 발생한다.

```java
public class Main {
  public static void main(String[] args) {
    List<Object> ol = new ArrayList<Long>();
    ol.add("String"_);
  }
}
```
- 해당 코드는 컴파일조차 되지 않는다.

> - 어느쪽이든 Long에 String을 담을 수는 없다.
> - 다만 배열은 런타임시 이 상황을 인지한다. 하지만 제네릭은 컴파일 시 체크할 수 있다.

#### 두 번째 차이
- 배열은 실체화(reify)된다.
  - 배열은 런타임에도 자신이 담기로 한 원소의 타입을 인지하고 확인한다.
  - 위에 코드에서 런타임시 타입을 확인하여 예외를 발생시키는 것이 이에 해당한다.
- 제네릭은 타입 정보가 런타임 시에 소거(erasure)된다.
  - 원소 타입을 컴파일타임에만 검사하며 런타임에는 알수조차 없다는 것이다.
  - erasure는 제네릭 지원 전 레거시 코드와 제네릭 타입을 함께 사용할 수 있게 해주는 매커니즘이다.
- 이러한 차이로 인해 배열과 제네릭은 잘 어우러지지 못한다. 
- 배열은 제네릭 타입, 매개변수화 타입, 타입 매개변수로 사용할 수 없다.
- 즉 new List<E>[], new List<String>[], new E[] 식으로 작성하면 컴파일 시 제네릭 배열 생성 오류를 일으킨다.
- **제네릭 배열을 만들지 못하게 막는 이유는 타입 안전성이 보장되지 않기 때문이다.**
- 배열 제네릭이 허용되면 런타임시 ClassCastExcpetion이 발생할 수 있다. 하지만 이는 제네릭이 컴파일 시점에 ClassCastExcpetion 발생을 막아주는 취지와 맞지 않다.

```java
public class Main {
  public static void main(String[] args) {
    List<String>[] stringLists = new List<String>[1]; // 1 -> 에러
    List<Integer> intList = List.of(123);             // 2
    Object[] objects = stringLists;                   // 3
    objects[0] = intList;                             // 4
    String s = stringLists[0].get(0);                 // 5
  }
}
```
- 만약 제네릭 배열이 허용되어 1번 코드가 허용된다고 가정해보자
- 3번에서 배열은 공변이므로 List<String> 배열이 Object[]에 할당될 것이다.
- 4번에도 제네릭은 erasure되어 Object의 첫번째 원소로 저장될 것이다.
- 5번에서 String만 담겠다고 선언한 stringLists에는 intList가 저장되어있고 이를 꺼내려고 하면 String으로 형변환 시 ClassCastException이 발생하게 될 것이다.
- 이를 예방하기 위해서 제네릭 배열을 생성할 수 없도록 1번에서 컴파일 에러가 발생하는 것이다.

#### 실체화 불가 타입
- E, List\<E>, List\<String> 같은 타입을 실체화 불가 타입이라고 한다.
- 즉 실체화되지 않아 런타임에는 컴파일타임보다 타입 정보를 적게 가지는 타입이다.
- Erasure 메커니즘 때문에 매개변수화 타입 가운데 실체화될 수 있는 타입은 List<?>와 Map<?, ?>같은 비한정적 와일드카드 타입 뿐이다.
- 그래서 배열을 비한정적 와일드카드 타입으로 만들 수는 있지만 유용하게 쓰일 일은 거의 없다.
- 배열을 제네릭으로 만들 수 없어 귀찮을 떄도 있다.
- 제네릭 컬렉션에서는 자신의 원소 타입을 담은 배열을 반환하는게 보통은 불가능하다. (item 33에서 방법 설명)
- 배열로 형변환할 때 제네릭 배열 생성 오류나 비검사 형변환 경고가 뜨는 경우 대부분은 배열인 E[] 대신 컬렉션 List<E>를 사용하면 해결된다.
- 코드가 복잡해지고 성능이 조금 나빠질 순 있어도 그 대신 타입 안정성과 상호 운용성이 좋아진다.

#### Chooser
- 컬렉션 안의 원소 중 무작위로 선택해 반환하는 기능을 가진 클래스를 살펴본다.

**제네릭 없는 버전**
```java
public class Chooser {
  private final Object[] choiceArray;

  public Chooser(Collection choices) {
    this.choiceArray = choices.toArray();
  }

  public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceArray[rnd.nextInt(choiceArray.length)];
  }
}
```


**제네릭 1단계**
```java
public class Chooser<T> {
  private final T[] choiceArray;

  public Chooser(Collection choices) {
    // 형변환을 해주지 않으면 T는 T extends Object가 아닌 이상 Object를 담을 수 없다.
    // 형변환을 해주더라도 이 방식은 런타임 시 안정성을 보장해주지 못해 경고가 발생한다.
    this.choiceArray = (T[])choices.toArray();
  }

  public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceArray[rnd.nextInt(choiceArray.length)];
  }
}
```

**제네릭 2단게(배열 -> 리스트)**
```java
public class Chooser<T> {
  private final List<T> choiceList;

  public Chooser(Collection<T> choices) {
    // 비검사 형변환 경고를 제거하기 위해선 배열 -> 리스트로 변경하면 된다.
    this.choiceList = new ArrayList<>(choices);
  }

  public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceList.get(rnd.nextInt(choiceList.size()));
  }
}
```
- 성능은 약간 느릴 수도 있지만 런타임에 ClassCastException 에러를 방지해주므로 그만한 가치가 있다.

#### 핵심 정리
- 배열과 제네릭은 매우 다른 타입 규칙이 적용된다.
- 배열은 공변이고 실체화되지만 제네릭 불공변이고 타입 정보가 소거된다.
- 그 결과 배열은 런타임시 타입을 검증을하고 컴파일에선 그러지 않는다.
- 제네릭은 반대로 수행되기 때문에 이 둘은 섞어 쓰기 쉽지 않다.
- 컴파일 시점에 타입을 검증해주는 제네릭이 더 안정적이므로 배열을 만나면 리스트로 변경을 고려하자.
