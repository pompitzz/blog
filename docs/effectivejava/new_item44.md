---
title: 아이템 44. 표준 함수형 인터페이스를 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 자바가 람다를 지원하면서 API를 작성하는 모범 사례도 크게 바뀌었다.
- 상위 클래스의 기본 메서드를 재정의해 원하는 동작을 구현하는 템플릿 메서드 패턴의 매력이 크게 줄었다.
- 이를 대체하는 현대적인 해법은 같은 효과의 함수 객체를 받는 정적 팩터리나 생성자를 제공하는 것이다.
- 즉 함수형 매개변수를 많이 받아야 하므로 함수형 매개변수 타입을 올바르게 선택해야 한다.

```java
protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
  return size() > 100;
}
```
- LinkedHashMap에서는 위의 메서드 조건이 맞으면 새로운 키가 추가될 때 가장 오래된 키를 제거하는 메서드를 제공한다.
- 현재 이를 다시 구현한다면 함수객체를 정적 팩터리나 생성자로 받아 이를 구현하였을 것이다.

```java
@FunctionalInterface
interface EldestEntryRemovalFunction<K,V> {
  boolean remove(Map<K,V> map, Map.Entry<K,V> eldest);
} 
``` 
- 이러한 함수형 인터페이스를 매개변수로 받으면 될 것이다.
- 이렇게 직접 구현하여도 되지만 자바 표준에는 약 40여개의 함수형 인터페이스를 제공하므로 **필요한 용도에 맞는게 있다면 직접 구현하지말고 표준 함수형 인터페이스를 활용하자.**
- 제공해주는 인터페이스를 사용하면 API를 다루는 개념의 수도 줄어들고 default 메서드로 제공해주는 기능들을 사용할 수 있기 때문에 상호 운용성이 더 좋아질 것이다.

```java
import java.util.Map;
import java.util.function.BiPredicate;

public class Main {
  BiPredicate<Map<K, V>, Map.Entry<K,V>> biPredicate;
}
```
- BiPredicate를 이용하면 위의 인터페이스와 동일한 기능을 구현할 수 있다.
- 40여개의 함수형 인터페이스를 모두 기억하진 말고 기본 인터페이스 6개만 기억후 나머지는 이를 통해 유추할 수 있다.

#### Operator
- Operator 인터페이스는 인수가 1개인 UnaryOperator, 인수가 2개인 BinaryOperator로 나뉘며 **반환값과 인수가 같은 함수를 뜻한다.**

#### Predicate
- 인수를 받아 boolean을 반환하는 함수이다.

#### Function
- 인스와 반환 타입이 다른 함수이다.

#### Supplier
- 인수를 받지 않고 오직 반환만을 제공하는 함수이다.

#### Consumer
- 인수를 하나 받고 반환값이 없는 함수를 뜻한다.

#### 기본타입 함수형 인터페이스
- int, double, long에 대한 기본타입 인터페이스를 제공한다.
- IntPredicate, LongBinaryOperator 등이 있다.
- Function 인터페이스는 LongToIntFunction, ToLongFunction\<T>, ToIntBiFunction\<T, U> 등을 제공한다.
- Supplier를 제외한 기본 함수형 인터페이스는 BiFunction, BiPredicate, BiConsumer를 제공한다.
- Consumer는 ObjDoubleConsumer\<T>, ObjIntConsumer\<T>등도 제공한다.
- **기본 함수형 인터페이스에 박싱된 기본 타입을 사용하지 말자. 성능의 문제가 발생하기 쉽다.**

#### 직접 정의가 필요할 때
- 대부분의 상황에서는 직접 작성하는 것보다 표준 함수형 인터페이스를 사용하는 편이 낫다.
- 하지만 기본 함수형인터페이스에서 제공해주지 않을 경우는 직접 구현이 필요하다.
- 그리고 Comparator\<T>는 사실 ToIntBiFunction\<T, U>와 동일하다.
- 하지만 Comparator는 독자적인 인터페이스로 살아남아야 한다.
- 먼저 API에서 굉장히 자주사용되는데 해당 클래스 이름은 용도를 잘 설명해주고 있다.
- 두 번째, 구현하는 쪽에서 반드시 지켜야할 규약을 담고 있다.
- 세 번째, 비교자들을 변환하고 조합해주는 유용한 디폴트 메서드들을 듬뿍 담고 있다.

#### 표준 함수형 인터페이스가 존재하더라도 직접 구현이 필요한 경우
- 자주 쓰이며, 이름 자체가 용도를 명확히 설명해준다.
- 반드시 따라야 하는 규약이 존재한다.
- 유용한 디폴트 메서드를 제공할 수 있다.

#### @FunctionalInterface 애너테이션을 사용하라
- 해당 애노테이션은 람다용을 설계된 것임을 명시적으로 알려준다.
- 추상 메서드를 오직하나만 존재하여야 컴파일이 되므로 누군가 실수로 추상 메서드를 추가하는걸 막아준다.

#### 주의 사항
- **서로 다른 함수형 인터페이스를 같은 위치의 인수로 받는 메서드들을 다중 정의해서는 안된다.**
- ExecutorService의 submit 메서드는 Callable\<ㅅT>를 받는 것과 Runnable을 받는 것을 다중 정의했다.
- 그래서 올바른 메서드를 알려주기 위하여 형변호나을 해야할 때가 종종 생긴다.
- 이를 피하기 위해서는 서로 다른 함수형 인터페이스를 같은 위치의 인수로 사용하는 다중정의를 피하자.

#### 핵심 정리
- 함수형 인터페이스를 사용할 때 보통은 java.util.function 패키지의 표준 함수형 인터페이스를 활용하자.
- 상황에 따라 직접 구현이 필요할 때 직접 만들어 사용하자.
