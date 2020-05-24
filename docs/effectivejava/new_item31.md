---
title: 아이템 31. 한정적 와일드카드를 사용해 API 유연성을 높이라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 매개변수화 타입(parameterized type)은 불공변이다.
- 즉 List\<String>은 List\<Object>의 하위 타입이 아니다.
- 하지만 때론 불공변 방식보다 유연한 무언가가 필요하다.
- 이런 상황에 대처할 수 있는 방법으로 자바에서는 한정적 와일드카드를 제공한다.

```java
// 생산자
public <E> void pushAll(Iterable<? extends E> src) {
  for (E e : src) {
    push(e);
  }
}
```

```java
// 소비자
public <E> void popAll(Collection<? super E> dst) {
  while (!isEmpty()) {
    dst.add(pop());
  }
}
```
- 보통 원소를 생산할 때는 매개변수에 <? extend E>를 이용하고 원소를 소비할 때는 매개변수에 <? super E>를 사용한다.
- **유연성을 극대화하려면 원소의 생산자나 소비자용 입력 매개변수에 와일드카드를 사용하면된다.**
- 만약 입력 매개변수가 생상자, 소비자 역할을 동시에하면 타입을 정확히 지정해야 하므로 와일드카드가 필요없다.
- PECS(producer-extends, consumer-super) 공식을 외워두자.
- **매개변수화 타입 T가 생성자라면 \<? extends T\>, 소비자라면 \<? super T\>를 사용하라.**
- pushAll은 stack이 사용할 E 인스턴스를 생산하므로 생산자이며 popAll은 stack으로 부터 e 인스턴스를 소비하므로 소비자다.
- pushAll은 입력 파라미터로부터 해당 컬렉션으로 원소를 옮겨 생산자라 할 수 있고 popAll은 입력 파라미터로 해당 컬렉션의 원소를 옮겨 담으니 소비자라고 할 수 있다.
- **반환 타입에는 한정적 와일드 카드 타입을 사용하면 오히려 클라이언트에서 와일드카드를 써야하므로 유연성이 떨어지기때문에 사용하지 말.**

> 클래스 사용자가 와일드카드 타입을 신경 써야한다면 그 API에 무슨 문제가 있을 가능성이 크다.

```java
public class Main {
  public static void main(String[] args) {
    Set<Integer> integers = Set.of(1, 2, 3);
    Set<Double> doubles = Set.of(2.0, 3.0);
    Set<Number> numbers = Main.union(integers, doubles);
  }

  static <E> Set<E> union(Set<? extends E> set1, Set<? extends E> set2) {
    Set<E> ret = new HashSet<>();
    ret.addAll(set1);
    ret.addAll(set2);
    return ret;
  }
}
```
- 이 코드는 자바 8에서는 제대로 동작하나 그 이하에서는 오류가 나타난다.
- 컴파일러가 올바른 타입을 추론하지 못해서이다. 이럴때는 명시적 타입 인수(explicit type argument)를 사용해 타입을 알려주면 된다.

```java
Set<Number> numbers = Main.<Number>union(integers, doubles);
```

#### parameter와 argument
```java
void add(int value) {}
add(10)
```
- value는 parameter, 10은 argument이다.
- 제네릭을 살펴보자.

```java
class Set<T> {}
Set<Integer> = ...;
```
- T는 Type Parameter이고 Integer는 Type Argument가 된다.


#### 생산자, 소비자 두 번 적용
```java
public static <E extends Comparable<? super E>> E max(List<? extends E> list)
```
- 먼저 쉬운 List\<? extends E>를 보자. list parameter는 E 인스턴스를 생산하므로 extends를 이용한다.
- 두번째로 E extend Comparable\<E>에서 Comparable\<E>는 E 인스턴스를 소비하여 순서를 나타내는 정수를 생산하게 된다.
- E 인스턴스를 소비하기 때문에 ? super E가 사용된다.
- **Comparable은 언제나 소비자이므로 ? super E를 이용하는게 좋다.**

#### 이렇게 복합한 메서드가 필요할까?
- List\<ScheduledFuture\<?\>\> scheduledFuture는 위와같이 max를 구현하지 않으면 사용할 수 없다.
- Furture은 Comparable을 직접 구현하지 않고 상위 인터페이스인 Delayed가 확장한 Comparable<Delayed>를 구현한다.
- 그러므로 Future은 Delayed와도 순서를 비교할 수 있기 때문에 max를 위와같이 설정하지 않으면 파라미터로 사용될 수 없다.
 
#### 와일드 카드와 타입 파라미터
- 타입 파라미터와 와일드 카드에는 공통되는 부분이 있어서 둘 중 어느것을 사용해도 괜찮을 때가 있다.

```java
static <E> void swap(List<E> list, int a, int b);
static void swap(List<?> list, int a, int b);
``` 
- 이 둘은 동일하다. public API라면 간단한 두 번째가 좋다.
- 기본 규칙은 **메서드 선언에 타입 매개변수가 한 번만 나오면 와일드 카드로 대체하라.**
- 단 두번째 메서드는 와일드 카드를 사용했기 때문에 null외에는 어떤 값도 넣을 수 없기 때문에 구현 방식에 따라 컴파일이 되지 않을 수도 있다.
- 그럴땐 아래와 같이 헬퍼 메서드를 이용하자.

```java
static void swap (List<?> list, int a, int b) {
  // list.set(a, list.set(b, list.get(a))); 사용 불가
  swapHelper(list, a, b)
}

static <E> void swapHelper(List<E> list, int a, int b){
  list.set(a, list.set(b, list.get(a)));
}
```

#### 핵심 정리
- 조금 복잡하더라도 와일드카드 타입을 적용하면 API가 훨씬 유연해진다.
- producer extends, consumer super를 기억하자.
- Comparable, Comparator는 모두 소비자라는걸 잊지 말자.
