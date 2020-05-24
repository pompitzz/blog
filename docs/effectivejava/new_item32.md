---
title: 아이템 32. 제네릭과 가변인수를 함께 쓸 때는 신중하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 가변인수는 메서드에 넘기는 인수의 개수를 클라이언트가 조절할 수 있게 해주는데, 구현 방식에 허점이 존재한다.
- 가변인수 메서드를 호출하면 가변 인수를 담기 위한 배열이 자동으로 하나 만들어진다.
- 그런데 내부로 감춰야 했을 이 배열이 클라이언트에 노출하는 문제가 생겨 제네릭과 함께 사용하면 컴파일 경고가 발생한다.
- 아이템28에서 실체화 불가 타입은 런타임에 컴파일타임보다 타입 정보를 적게 담고 있음을 알게 되었다.
- 그리고 거의 모든 제네릭의 매개변수화 타입은 실체화되지 않는다.
- 그러므로 메서드를 선언할 때 실체화 불가 타입으로 가변인수 파라미터를 선언하면 컴파일 경고가 발생한다.

```java
public class Main {
  static void danger(List<String> ...stringLists) {
    List<Integer> intList = List.of(1, 2);
    Object[] objects = stringLists;
    objects[0] = intList;

    // 타입 에러 발생
    String s = stringLists[0].get(0);
  }
}
```
- 이렇게 매개변수화 타입의 변수가 다른 타입의 객체를 참조하게 될 수 있어 힙 오염이 발생하게 된다.
- 이는 제네릭 타입 시스템의 약속이 깨지게 된다.
- 그러므로 제네릭 가변인수 배열 파라미터에 값을 저장하는 건 안전하지 않다. 
- 제네릭 배열을 프로그래머가 직접 생성하는건 되지 않으면서 **제네릭 가변인수 매개변수를 받는 메서드를 선언할 수 있게 한 이유는 유용하기 때문이다.**
- 유용함을 포기할 수 없어 언어 설계자는 이 모순을 수용하게 되었다.
- **자바 7이후부터는 @SafeVarargs 애너테이션을 통해 메서드 작성자가 그 메서드의 타입 안정함을 보장하는 장치를 두었다.**
- 해당 메서드에서 가변인자 매개변수가 아무것도 저장하지 않고 해당 배열의 참조가 밖으로 노출되지 않으면 즉, 호출자로부터 그 메서드로 순수하게 인수들을 전달하는 일만한다면 그 메서드는 안전하다.
   
#### 가변인수 배열의 참조가 밖으로 노출될 때
```java
public class Main {
  static <T> T[] toArray(T... args){
    return args;
  }

  static <T> T[] pickTwo(T a, T b) {
    return toArray(a, b);
  }

  public static void main(String[] args) {
    String[] strings = pickTwo("a", "b");
  }
}
```
- 해당 기능은 얼핏보면 별 문제가 없어보이지만 실행 시 에러가 발생한다.
- 컴파일러가 toArray의 가변인자를 위해 배열을 만들 때 Object[]로 생성된다. 왜냐하면 어떤 타입의 객체를 넘기더라도 가장 구체적인 타입이기 때문이다.
- Object[]가 반환되고 그대로 pickTwo가 이를 또 반환하게되는데 String[]로 받게되니 classcastExcpetion이 발생하는 것이다. 
- 가변인자 배열을 넘겨도 안전한 두 가지가 있다. 첫 째로 @SafeVarargs 애노테이션이 붙은 메서드와 배열의 일부 함수를 호출만하는 일반 메서드에서이다.

```java
@SafeVarargs
static <T> List<T> flatten(List<? extends T>... lists) {
  List<T> result = new ArrayList<>();
  for (List<? extends T> list : lists) {
    result.addAll(list);
  }
  return result;
}
```
- 해당 메서드는 리스트를 하나씩 옮겨담기 때문에 안전하므로 SafeVarargs가 붙어도 된다.
- SafeVarargs는 재정의할 수 없는 메서드에만 달아야 하며 그렇게만 달수 있도록 설정되어 있다.


#### 핵심 정리
- 가변인수와 제네릭은 궁합이 좋지않다.
- 가변인수 기능은 배열을 노출하여 추상화가 완벽하지 못하고, 배열과 제네릭의 타입 규칙이 서로 다르기 때문이다.
- 제네릭 가변인수는 안전하지 않지만 허용되는 이유는 유용한면이 많기 때문이다.
- 제네릭 가변인수를 썼을 때 안전성을 보장할 수 있다면 @SafeVarargs를 사용하자.
