---
title: Effective Java 3/E 정리
date: 2021-07-24 13:03
img:
    - java.png
tags:
    - Java 
---

실무를 하면서 참고하면 좋다고 생각이 드는 아이템들만 정리하였습니다.

## ITEM 1. 생성자 대신 정적 팩터리 메서드를 고려하라.
#### 장점
1. 생성자와 달리 명시적인 이름을 가질 수 있다.
2. 인스턴스를 캐싱하여 재활용할 수 있다.
3. 반환 타입의 하위 타입 객체를 반환할 수 있어 유연성이 좋다.
    - 자바 8전에는 인터페이스에 static 메서드를 선언할 수 없어 주로 동반 클래스를 만들어서 정적 팩터리를 제공함.(List -> Lists)
    - 자바 8부터는 인터페이스에 static 메서드를 선언할 수 있으므로 동반 클래스를 만들 필요가 별로 없음. 
    - > static 메서드를 선언할 수 있다고 하더라도 static 메서드가 많아진다면 인터페이스는 인터페이스 메서드만 표현하고 동반 클래스를 제공하는게 깔끔하다고 생각한다. 
4. 매개변수 값에 따라 서로 다른 객체를 반환할 수 있다.
    - 매개변수에 따라 최적화된 객체를 제공할 수 있음.
5. 코드를 작성하는 시점에 반환할 객체의 클래스가 존재하지 않아도 된다.
    - JDBC에서 Driver를 등록하고 Connection을 가져올 때 활용하는 방식이다.
    - JDBC를 사용할 때 `Class.forName(Driver)` 혹은 `DriverManager.registerDrivers(Driver)`으로 Driver를 등록하고 `DriverManager.getConnection()`을 통해 Connection을 가져온다.
    - `DriverManager.getConnection()`를 작성하는 시점엔 반환할 특정 Driver의 Connection 클래스를 모른채로 코드를 작성할 수 있다.
    
#### 단점
1. 정적 팩터리 메서드만 제공하면 상속이 불가능하다.
    - 정적 팩터리 메서드만 제공하기 위해 생성자를 private로 만들면 상속 불가능
2. 코드 상으로 정적 팩터리 메서드를 찾기 어려울 수 있다.
    - Naming convention 지키면 문제를 완화할 수 있음.
    
#### 정적 패터리 메서드 Naming Convention
**from**
- 하나의 매개변수를 받아 인스턴스를 생성
- `Date d = Date.from(instant);`

**of**
- 여러 매개변수를 받아 인스턴스를 생성
- `Set<String> stringSet = Set.of("1", "2")`

**type**
- 생성할 클래스가 아닌 다른 클래스에 팩터리 메서드를 정의할 때 반환할 객체를 명시하기 위해 사용
- `List<String> stringList = Collections.list()`

**instance, getInstance**
- 매개변수로 명시한 인스턴스를 반환 하지만 같은 인스턴스임을 보장하진 않는다.

**create, newInstance**
- 메번 새로운 인스턴스를 반환함을 보장한다.

## ITEM 3. private 생성자나 열거 타입으로 싱글턴임을 보증하라.
#### private 생성자 방식
```java
// #1 public static final 이용
public class Elvis {
    public static final Elvis INSTANCE = new Elvis();
    private Elvis() {}
}

// #2 정적 팩터리 이용
public class Elvis {
    private static final Elvis INSTANCE = new Elvis();
    private Elvis() {}
    public static Elvis getInstance() { return INSTANCE; }
}

// #3 지연 초기화 홀더 클래스 이용(ITEM 82)
// - getInstance가 호출될 때 Holder 클래스가 초기화되어 지연 초기화가 가능해진다. 
public class Elvis {
    private static class Holder {
        static final Elvis INSTANCE = new Elvis();
    }
    private Elvis() {}
    public static Elvis getInstance() { return Holder.INSTANCE; }
}
```
- 정적 팩터리 방식은 원할 때 클라이언트 변경없이 싱글턴을 반환하지 않도록 수정이 가능하다. 이런 장점이 필요 없다면 public가 간결하다.

> 생성자 방식은 직렬화나 리플렉션에 의해 싱글턴 보장이 되지 않을 수 있는데 실무에서 이를 고려해야하는 경우는 아직 보지 못했다.

#### enum 방식
```java
public enum Elvis {
    INSTANCE
}
```
- 간결하게 싱글턴을 보장할 수 있고 직렬화나 리플렉션 문제도 없다.
- **저자는 이 방식을 추천한다.**

## ITEM 6. 불필요한 객체 생성을 피하라.
- 불필요한 객체 생성은 피하기 위해 객체 재사용은 효율적이지만 **방어적 복사가 필요한 상황에서 객체를 재사용 했을 때의 피해가, 불필요한 객체를 반복 생성한 경우보다 훨씬 크다는 것을 인지하자.**
- 불필요한 객체 생성으로 인한 피해는 그저 코드 형태와 성능에만 영향을 준다.

## ITEM 10. equals는 일반 규약을 지켜 재정의 하라
equals는 객체의 식별성(object identity)이 아닌 논리적 동치성(logical equality)을 확인해야 할 때 재정의 해야 한다.
- 주로 Value Object에서 재정의된다.

#### equals 규약
**컬렉션 클래스들을 포함해 수 많은 클래스들이 전달받은 객체가 equals 규약을 지킨다고 가정하고 동작하므로 규약은 중요하다.**

**1) 반사성(reflexivity)**
- null이 아닌 모든 참조 값 x에 대해 `x.equals(x) == true`다.

**2) 대칭성(symmetry)**
- null이 아닌 모든 참조 값 x, y에 대해 `x.equals(y) == true`라면 `y.equals(x) == true`다.

**대칭성 위반 사례**
```java
public final class CaseInsensitiveString {
    private final String s;

    @Override
    public boolean equals(Object o) {
        if (o instanceof CaseInsentitiveString) return s.equalsIgnoreCase((CaseInsentitiveString o).s);
        if (o instanceof String) return s.equalsIgnoreCase((String) o);
        return false;
    }

    public static void main(String[] args) {
        var cis = new CaseInsentitiveString("Hello");
        var s = "hello";
        assertThat(cis.equals(s)).isTrue();
        assertThat(s.equals(cis)).isFalse(); // 대칭성을 위반한다.
    }
}
```
- 이 문제를 해결하려면 equals를 String과도 연동하려는 꿈을 버려야 한다.

**3) 추이성(transitivity)**
- null이 아닌 모든 참조 값 x, y, z에 대해 `x.equals(y) == true`이고 `y.equals(z) == true`라면 `x.equals(z) == true`다.

**추이성 위반 사례**
```java
public class Point {
    private final int x;
    private final int y;
    
    @Override
    public boolean equals(Object o) {
        if (!(i instanceof Point)) {
            return false;
        }
        Point p = (Point) o;
        return p.x == x && p.y == y;
    }
}

public class ColorPoint extends Point {
    private final Color color;
    
    @Override
    public boolean equals(Object o) {
        if (!(i instanceof Point)) {
            return false;
        }
        // o가 Point라면 color 무시
        if (!(i instanceof ColorPoint)) {
            return o.equals(this);
        }
        // o가 ColorPoint라면 color까지 비교
        return super.equals(o) && ((ColorPoint) o).color == color;
    }

    public static void main(String[] args) {
        ColorPoint x = new ColorPoint(1, 2,, Color.RED);
        Point y = new Point(1, 2);
        ColorPoint z = new ColorPoint(1, 2,, Color.BLUE);
        assertThat(x.equals(y)).isTrue();
        assertThat(y.equals(z)).isTrue();
        assertThat(x.equals(z)).isFalse(); // 추이성 위반한다.
    }
}
```
- 구체 클래스를 확장해 새로운 값을 추가하면서 equals 규약을 만족시킬 방법은 없다.
- 컴포지션을 활용하면 우회는 가능하다.

**4) 일관성(consistency)**
- 동일한 참조 값에 대한 equals 호출의 결과는 반드시 동일해야 한다.

**5) null-아님**
- null이 아닌 모든 참조 값 x에 대해 `x.equals(null) == false`다.

## ITEM 11. equals를 재정의하려면 hashCode도 재정의하라.
equals를 재정의한 클래스에서 hashCode를 재정의하지 않으면 규약을 어기게 되어 Hash 관련 컬렉션을 사용할 때 문제가 생긴다.
- **HashMap의 경우 hashCode가 다르다면 equals비교를 시도 조차 하지 않도록 최적화 되어 있다.**

#### hashCode 규약
1. 애플리케이션 범위 내에서 equals 비교에 사용되는 정보가 변경되지 않는 한 hashCode의 결과는 항상 같다.
2. `x.equals(y) == true`라면 `x.hashCode() == y.hashCode()`다. 
3. `x.equals(y) == false`라도 `x.hashCode() == y.hashCode()`일 수 있다.

## ITEM 12. toString을 항상 재정의하라.
toString의 일반 규약에 따르면 `간결하면서 사람이 읽기 쉬운 형태의 유익한 정보`를 반환해야 한다.
toString을 잘 구현한 클래스는 로깅 추적등의 디버깅을 수월하게 해준다.

> 실무에서 종종 객체의 정보를 로깅하게 되는데 toString이 재정의 되어 있지 않으면 데이터 추적이 힘들어진다.

## ITEM 13. clone 재정의는 주의해서 진행하라
clone 메서드의 가장 큰 문제는 `Cloneable` 구현을 요구하는 믹스인 인터페이스이지만 `clone 메서드` 자체는 Object에 protected로 선언되어 있다.
- protected이므로 Cloneable을 구현했다 하더라도 클라이언트는 cloen 메서드를 호출할 수 없다.

#### Object.clone 동작 방식
- Cloneable을 구현한 클래스에서 clone을 호출하면 그 객체의 필드를 하나씩 복사하여 반환
- 그렇지 않으면 CloneNotSupportedException 발생

#### 요약
- Cloenable을 구현한 모든 클래스는 clone을 재정의해야 하고 접근 제한자를 public으로, 반환 타입을 클래스 자신으로 변경해야 한다.
- 가장 먼저 super.clone()하고 필요한 필드를 전부 적절히 수정해야 한다.
- Cloneable을 이미 구현한 클래스를 확장한다면 어쩔 수 없이 clone이 잘 작동 되도록 구현해야 한다.
- **새로운 클래스에서 Cloneable을 구현하지 말고 복사 생성자나 복사 팩터리를 활용하자.**
- **배열만은 clone 메서드을 제대로 지원하므로 활용하는게 좋다.**

## ITEM 14. Comparable을 구현할지 고려하라.
compareTo는 순서를 비교하여 인스턴스들 간의 순서를 정할 수 있는 점을 제외하고 equals와 성격이 동일하다.
그러므로 순서가 명확한 값 클래스들은 Comparable 인터페이스를 구현하는 것이 좋다.

#### compareTo 일반 규약
**compareTo 메서드는 현재 객체가 주어진 객체보다 작으면 음의 정수, 같으면 0, 크면 양의 정수를 반환해야 한다.**
compareTo 또한 equals와 동일하게 확장한 구체 클래스에서 새로운 필드를 추가한 경우 compareTo 규약을 지킬 수 없다.

- `x.compareTo(y) == -y.compareTo(x)` (-1, 0, 1을 반환한다고 가정)
- `x.compareTo(y) > 0 && y.compareTo(z) > 0`라면 `x.compareTo(z) > 0`이다.
- `x.compareTo(y) == 0`라면 `x.compareTo(z) == y.compareTo(z)`다 (-1, 0, 1을 반환한다고 가정)
- `x.compareTo(y) == 0`라면 `x.equals(y) == true`여야 한다.
    - 이 방법은 필수는 아니지만 정렬 관련 컬렉션에선 equals 대신 compareTo로 동치성을 비교하기도 하므로 반드시 지키는게 좋다. 아니라면 문서화하자. 

#### compareTo에서 비교연산자(\<, \>) 대신 Comparator를 활용하자.
```java
public class Item implements Comparable<Item>{
    private final String name;
    private final int price;
    private final int quantity;
    
    private static final Comparator<Item> COMPARATOR = 
            comparingInt((Item i) -> i.price)
            .thenComparingInt(i -> i.quantity);
    
    public int compareTo(Item item) {
        return COMPARATOR.compare(this, item);
    }   
}
```
- compareTo에서 Comparator를 활용하여 깔끔하게 구현할 수 있다. 혹은 필드 클래스가 정적 compare 메서드를 제공한다면 이를 활용하면 좋다.



## ITEM 15. 클래스와 멤버의 접근 권한을 최소화하라.
어설프게 설계된 컴포넌트와 잘 설계된 컴포넌트의 가장 큰 차이는 내부 구현 정보를 외부로부터 얼마나 잘 숨겼느냐다.

#### 정보 은닉의 장점
- 시스템 개발 속도 증가
    - 정보 은닉으로 여러 컴포넌트를 병렬적으로 개발 가능
- 시스템 관리 비용 감소
    - 정보 은닉으로 디버깅이 용이해짐
- 복잡도 감소
    - 정보 은닉으로 관심사가 분리됨
- 재사용성 증가
- 성능 최적화에 도움
    - 정보 은닉으로 특정 컴포넌트의 최적화에 집중 가능

#### 접근 권한은 가능한 한 좁혀야 한다.
**패키지 외부에서 쓸 이유가 없으면 package-private으로 선언해야 한다.**
- package-private은 내부 구현이므로 외부에 의존성을 가지지 않아 언제든지 수정 가능하다.

> 시스템이 복잡해질수록 class를 최대한 package-private으로 만드는 것이 의존성 관리에 중요한 역할을 한다고 생각한다. 

## ITEM 17. 변경 가능성을 최소화하라.(불변 클래스)
불변 클래스란 인스턴스의 내부 값을 수정할 수 없는 클래스이다. 
- 내부 값은 객체가 파괴되는 순간까지 절대 달라지지 않는다.

#### 불변 클래스 규칙
1. 변경자 메서드를 제공하지 않는다.
    - 변경이 필요하면 변경된 값을 기반으로 새로운 불변 객체를 리턴하는 메서드를 제공하는데 상태가 변경되는 것이 아니므로 `동사(add)`가 아닌 `전치사(plus)`를 메서드 이름으로 사용한다. 
2. 클래스를 확장할 수 없도록 한다.
    - final class로 만들어야 한다. 
3. 모든 필드를 private final로 선언한다.
4. 자신 외에는 내부 가변 컴포넌트에 접근할 수 없도록 한다.
    - List를 필드로 가진다면 이를 클라이언트에 제공할 땐 반드시 복사된 List를 제공해야 한다. 

> 실무에서 2번을 위반하면 코드리뷰에서 걸러지니 final을 잘 붙이지 않는 것 같고 4번은 대부분 lombok을 사용하므로 잘 지켜지지 않는 것 같다.

#### 불변 객체의 장점
- 스레드 안전하므로 동기화가 필요 없다.
- 실패 원자성을 제공한다.(ITEM 76)
    - 중간에 상태가 변하지 않으므로 데이터 불일치 상태에 빠지지 않는다.
  
> 코드분석이 쉬워지는 것도 큰 장점이라고 생각한다.
> - 인스턴스 내부 값이 변경되지 않기 때문에 객체를 생성하는 코드만 파악하면 된다.

## ITEM 18. 상속보다는 컴포지션을 사용하라.
같은 프로그래머가 통제하는 패키지 안에서라면 상속도 안전한 방법이지만 패키지 경계를 넘어 다른 구체 클래스를 상속하는 일은 위험하다.
- 상속은 캡슐화를 깨뜨리고 상위 클래스의 내부 구현 변경에 직접적인 영향을 받는다.
- 상속은 오버라이드한 메서드가 상위 클래스에서 어떻게 사용될지 예측이 불가능하다.
- 상위 클래스에서 새롭게 추가한 메서드에 의해 컴파일 에러를 일으킬 수 있다.

**구체 클래스 상속없이 추상 클래스과 인터페이스 상속만으로도 개발하는 데 아무런 어려움이 없다.**

#### 컴포지션
- 컴포지션은 상속의 단점을 모두 해결할 수 있다.
- 컴포지션을 사용하면 인스턴스 메서드에서 의존하는 객체의 메서드만을 호출하는 경우가 있는데 이를 `전달 메서드(forwarding method)`라고 한다.  
- 컴포지션과 전달의 조합은 넓은 의미로 위임(delegation)이라고 부른다.
    - 엄밀히 따지면 래퍼 객체가 내부 객체에 자기 자신의 참조를 넘기는 경우에만 위임에 해당한다.

## ITEM 20. 추상 클래스보다는 인터페이스를 우선하라
자바는 단일 상속만 지원하므로 가능하면 인터페이스를 우선하는게 좋다.
인터페이스는 다중 구현이 가능하므로 믹스인으로 활용할 수 있다.

#### 인터페이스와 추상 골격 구현(sceletal implementation) 클래스
- 인터페이스가 복잡한 경우에 인터페이스에서 타입 및 디폴트 메서드를 정의하고 추상 골격 구현 클래스에서 구현체들의 공통 메서드를 정의하는 패턴이 많이 사용된다.
    - Collection의 List와 AbstractList 구조가 이 방식을 따른다.
- 가능하면 인터페이스의 디폴트 메서드를 통해 골격 구현을 제공하고, 디폴트 메서드로만 제공이 불가능한 경우 혹은 protected 추상 메서드가 필요한 경우 추상 골격 구현을 제공하자.

## ITEM 24. 멤버 클래스는 되도록 static으로 만들라.
#### 중첩 클래스
**1. 정적 멤버 클래스**
- 멤버 클래스에서 바깥 인스턴스에 접근할 일이 없는 경우엔 무조건 정적 멤버 클래스로 만들자.

**2. 비정적 멤버 클래스**
- 비정적 멤버 클래스의 인스턴스는 바깥 클래스의 숨은 외부 참조를 가지게 된다.
- 참조가 명시적이지 않으니 메모리 누수가 생기기 쉽고 바깥 인스턴스에 접근할 일이 없는 경우 낭비이므로 특별한 이유가 없다면 비정적으로 만들 이유는 없다.
- 내부에 Iterator 구현체를 만드는 경우에 비정적 멤버 클래스를 활용할 수 있음. 

**3. 익명 클래스**
- 단일 함수 객체용으로는 람다가 생겨 더 이상 사용되지 않고 주로 팩터리 메서드에서 클래스를 즉시 구현할 떄 주로 사용된다. 

**4. 지역 클래스**
```java
public class Main {
    public static void main(String[] args) {
        class Item {
            private String name;
        }
    }
}
```
- 지역변수처럼 클래스를 정의할 수 있고 정적 멤버를 가질 수 없다.


## ITEM 31. 한정적 와일드카드를 사용해 API 유연성을 높이라
#### PECS
- 생산자 역할의 매개변수에는 `extends`, 소비자 역할의 매개변수에는 `super`를 사용하여 유연성을 높일 수 있다.
- 매개변수가 생산자와 소비자 역할을 모두하면 한정적 와일드카드는 아무런 도움이 되지 않는다. 

**producer-extends**
```java
public interface Stack<E> {
    void push(E e);

    // elements는 stack에 push하기 위한 element를 생산하는 생산자이다. 
    // E의 하위 타입은 E가 될 수 있으므로 extends를 활용할 수 있다.
    default void pushAll(Iterable<? extends E> elements) {
        for (E element : elements) {
            push(element);
        }
    }
}
```
- 생산자 역할의 매개변수에는 `extends`를 사용하여 유연성을 높일 수 있다.

**consumer-super**
```java
public interface Stack<E> {
    E pop();
    
    boolean isEmpty();

    // collection은 stack의 element를 사용하는 소비자이다.
    // E의 상위 타입은 E를 가질 수 있으므로(E는 E의 상위 타입이 될 수 있음) super를 활용할 수 있다.
    default void popAll(Collection<? super E> collection) {
        while (!isEmpty()) {
            collection.add(pop());
        }
    }
}
```
- 소비자 역할의 매개변수에는 `super`를 사용하여 유연성을 높일 수 있다.

**Comparable\<E>(Comparator\<E>)는 언제나 소비자**
- Comparable\<E>, Comparator\<E>는 언제나 E 인스턴스를 `소비`하여 순서를 결정하므로 `? super E`를 사용하는게 좋다.

> E는 E의 상위 타입이 될 수 있으므로 E의 순서를 비교하기 위해 E의 상위 타입을 사용해도 문제가 되지 않는다.

#### 와일드카드 타입을 위한 헬퍼 메서드
```java
public static void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j);
}

private static <E> void swapHelper(List<E> list, int i, int j) {
    list.set(i, list.set(j, list.get(i)));
}
```
- public API를 깔끔하게 유지하기 위해 와일드 카드를 사용할 때 실제 타입이 필요한 경우 헬퍼 메서드를 이용하여 실제 타입을 활용할 수 있다.


## ITEM 32. 제네릭과 가변인수를 함께 쓸 때는 신중하라.
가변인수 메서드는 호출 시 가변인수를 담기 위한 배열을 자동으로 생성한다.

제네릭 배열을 직접 생성하는건 불가능하지만 제네릭과 가변인수를 함께 사용하여 제네릭 배열이 생성되게 할 수 있다.
- 제네릭 가변인수가 실무에서 유용하므로 이러한 모순이 수용되었다.
    - 예시로 `Arrays.asList(T... a)`가 있다. 

#### 제네릭 가변인수를 안전하게 사용하기 위한 규칙
제네릭 가변인수를 안전하게 사용하기 위해선 반드시 다음 규칙을 지켜야 하며 `@SafeVarargs`를 선언하자.
1. 메서드에서 varargs 매개변수 배열에 아무것도 저장하지 않는다.
2. 배열(혹은 복제본)을 신뢰할 수 없는 코드에 노출하지 않는다.

**첫 번째 규칙을 어겼을 때**
```java
static String dangerous(List<String> ... stringLists) {
    List<Integer> integers = List.of(12);
    Object[] objects = stringLists;
    objects[0] = integers; // 힙 오염
    return stringLists[0].get(0); // ClassCastException
}
```
- 제네릭 배열은 타입 안전성을 보장하지 않으므로 제네릭 배열에 값을 저장하는건 위험하다.

**두 번째 규칙을 어겼을 때**
```java
public class Main {
    public static void main(String[] args) {
        // pickTwo는 Integer[]를 반환하지만 내부에서 사용되는 toArray는 Object[]를 반환하므로 ClassCashException 발생
        Integer[] integers = pickTwo(1, 2, 3);
    }

    static <T> T[] pickTwo(T a, T b, T c) {
        switch (ThreadLocalRandom.current().nextInt(3)) {
            case 0:
                return toArray(a, b);
            case 1:
                return toArray(a, c);
            case 2:
                return toArray(b, b);
        }
        throw new RuntimeException();
    }

    static <T> T[] toArray(T... args) {
        // 배열의 타입은 컴파일 타임에 결정되므로 모든 객체를 담을 수 있는 Object[]가 반환된다.
        return args; 
    }
}
```
- 제네릭 가변인수를 그대로 노출하는 것은 위험하다.

> 규칙을 지킬 수 있다면 제네릭 가변인수를 활용하고 그렇지 않으면 List를 활용하자.

## ITEM 33. 타입 안전 이종 컨테이너를 고려하라.
일반적인 제네릭 형태에서는 한 컨테이너에 다룰 수 있는 타입의 수가 고정되어 있다.

**하지만 컨테이너 자체가 아닌 키를 타입 매개변수로 바꾸면 이런 제약이 없는 타입 안전 이종 컨테이너를 만들 수 있다.**
- 타입 안전 이종 컨테이너를 Class를 키로 쓰며, 이때 쓰이는 Class 객체를 `타입 토큰`이라고 한다.

#### 타입 안전 이종 컨테이너 패턴
```java
/** 이 클래스엔 두 가지 제약이 있다.
 *  1. raw 타입을 사용하면 타입 안전성이 깨지므로 예외가 발생한다.
 *  2. List<String>과 같은 실체와 불가 타입에서는 활용할 수 없다.
 *      - 슈퍼 타입 토큰으로 우회할 수 있다. 
 */
public class Favorites {
    private Map<Class<?>, Object> favorites = new HashMap<>();

    public <T> void putFavorite(Class<T> type, T instance) {
        // put에서 type.cast를 쓰는 이유는 raw 타입이 들어와 타입 안정성이 깨지지 않도록 하기 위함이다.
        favorites.put(Objects.requireNonNull(type), type.cast(instance));
    }

    public <T> T getFavorite(Class<T> type) {
        return type.cast(favorites.get(type));
    }

    public static void main(String[] args) {
        Favorites favorites = new Favorites();
        favorites.putFavorite(Integer.class, 1);
        favorites.putFavorite(String.class, "2");
        Assert.isTrue(favorites.getFavorite(Integer.class) == 1);
        Assert.isTrue(favorites.getFavorite(String.class).equals("2"));
    }
}
```
- Favorites 내부적으로 쓰이는 Map은 명시적인 타입을 보장하지 않지만 제네릭 메서드를 통해 타입 안전함을 보장할 수 있다.

## ITEM 34. int 상수 대신 열거 타입을 사용하라.
int 상수는 타입 안전성을 보장할 수 없고 표현력도 좋지 않다. **컴파일타임에 알 수 있는 상수 집합이라면 항상 열거 타입을 사용하라.**

자바의 열거 타입은 클래스이므로 다른 언어의 열거 타입보다 훨씬 강력하다.
- 자바는 열거 타입에 대해 싱글톤을 보장한다.
- 열거 타입은 근본적으로 불변이라 모든 필드는 final이어야 한다.

#### 상수별 메서드 구현
```java
public enum Operation {
    PLUS {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS {
        public double apply(double x, double y) { return x - y; }
    },
    TIMES {
        public double apply(double x, double y) { return x * y; }
    },
    DIVIDE {
        public double apply(double x, double y) { return x / y; }
    };

    public abstract double apply(double x, double y);
}
```
- 열거 타입에서 상수별로 다른 동작을 수행해야 한다면 switch문 대신 상수별 메서드 구현을 이용하는 것이 좋다.

#### 전략 열거 타입 패턴
```java
@RequiredArgsConstructor
public enum PayrollDay {
    MON(WEEKDAY), TUES(WEEKDAY), WED(WEEKDAY), THUR(WEEKDAY), FRI(WEEKDAY), SAT(WEEKEND), SUN(WEEKEND);

    private final PayType payType;

    int pay(int minutesWorked, int payRate) {
        return payType.pay(minutesWorked, payRate);
    }

    enum PayType {
        WEEKDAY {
            int overtimePay(int minutesWorked, int payRate) {
                return minutesWorked <= MINS_PER_SHIFT ? 0 :
                        (minutesWorked - MINS_PER_SHIFT) * payRate / 2;
            }
        },
        WEEKEND {
            int overtimePay(int minutesWorked, int payRate) {
                return minutesWorked * payRate / 2;
            }
        };

        abstract int overtimePay(int minutesWorked, int payRate);
        private static final int MINS_PER_SHIFT = 8 * 60;

        int pay(int minutesWorked, int payRate) {
            int basePay = minutesWorked * payRate;
            return basePay + overtimePay(minutesWorked, payRate);
        }
    }
}
```
- 열거 타입에서 상수별로 다른 동작을 수행하지만 일부 같은 동작을 공유해야 한다면 전략 열거 타입 패턴을 활용하자.


## ITEM 41. 정의하려는 것이 타입이라면 마커 인터페이스를 사용하라.
아무 메서드도 담고 있지 않고, 단지 자신을 구현하는 클래스가 특정 속성을 가짐을 표시해주는 인터페이스를 `마커 인터페이스`라 한다.
- ObjectOutputStream을 통해 직렬화 가능함을 알려주는 Serializable 인터페이스가 대표 예다.

#### 마커 애너테이션이 아닌 마커 인터페이스를 사용해야 하는 경우
1. 마킹된 객체를 매개변수로 받는 메서드를 작성해야 할 때
2. 적용 대상을 더 정밀하게 지정해야 할 때
    - 특정 인터페이스를 구현한 클래스에만 적용하고 싶은 마커가 있을 땐 마커 인터페이스가 적합하다. 

## ITEM 42. 익명 클래스보다는 람다를 사용하라.
대부분의 경우에 익명 클래스보다 람다를 사용하는게 코드를 간결하게 만들 수 있다. 하지만 몇몇 경우엔 익명 클래스를 사용해야 한다.

#### 람다를 쓰지 말아야 할 때
1. 람다는 이름이 없고 문서화를 하지 못한다. 코드 자체로 동작이 명확히 설명되지 않거나 코드 줄 수가 많아지면 리팩터링 하자.
2. 람다는 자신을 참조할 수 없으므로 this는 바깥 인스턴스를 가리킨다. this 참조가 필요하다면 람다를 사용할 수 없다.

## ITEM 43. 람다보다는 메서드 참조를 사용하라.
람다가 익명 클래스보다 나은 점 중 가장 큰 하나는 `간결함`이다. 상황에 따라 `메서드 참조`를 통해 람다보다 더 간결하게 만들 수 있다.

#### 메서드 참조의 좋은 점
1. 기능을 잘 드러내는 이름을 지어줄 수 있고 문서화할 수 있다.
2. 디버깅이 쉽다. 

**람다가 더 간결할 땐 람다를 사용하자.**
- 메서드 참조가 더 짧지도, 더 명확하지 않는 경우가 있을 땐 람다를 사용하는게 바람직하다.
    - `Function.identity()`보단 `(x -> x)`가 더 명확하고 간결하다.
    - `service.execute(SomeClassName::action)`보단 `service.execute(() -> action())`이 더 명확하고 간결하다.

## ITEM 44. 표준 함수형 인터페이스를 사용하라.
java.util.function 패키지에는 다양한 표준 함수형 인터페이스를 제공한다.

**필요한 용도에 맞는 게 있다면 표준 함수형 인터페이스를 사용하자.**

#### 함수형 인터페이스를 직접 작성해야 할 때 
용도에 맞는 표준 함수형 인터페이스가 존재하더라도 함수형 인터페이스를 직접 만드는게 좋은 경우들이 있다.
1. 자주 쓰이며, 이름 자체가 용도를 명확히 설명해준다.
2. 유용한 디폴트 메서드를 제공할 수 있다.
3. 반드시 따라야 하는 규약이 있다.

## ITEM 46. 반환 타입으로는 스트림보다 컬렉션이 낫다.
Collection 인터페이스는 Iterable의 하위 타입이고, stream 메서드도 제공하므로 반환 타입으로는 Collection이 낫다.
- 컬렉션의 크기가 매우 큰 경우 전용 컬력션을 구현하도록 하자.
    - AbstractCollection을 활용하면 전용 컬렉션을 쉽게 구현할 수 있다.
    
## ITEM 48. 스트림 병렬화는 주의해서 적용하라.
스트림을 잘못 병렬화하면 성능이 더 나빠질 뿐만 아니라 결과 자체가 잘못되거나 예상치 못한 동작이 발생할 수 있다. 그러므로 꼭 사용해야 할 이유가 없다면 쓰지 말자.
- 데이터 소스 스트림이 효율적으로 나눠지고, 병렬화에 적절하더라도 병렬화에 드는 추가 비용이 크다면 성능 향상은 미미할 수 있다.
- 스트림 원소 수가 최소 수십만은 되어야 성능 향상을 맛볼 수 있다.


#### 스트림 병렬화가 적합한 케이스
1. 스트림의 소스가 ArrayList, HashMap, Array, IntStream, LongStream일 때 
    - 해당 자료 구조들은 크기가 정확해 손쉽게 나눌 수 있고 참조 지역성이 뛰어나다.
    - 단 자바 특성상 참조 타입의 경우 참조 지역성이 나빠질 수 있다. 
    - 참조 지역성이 가장 뛰어난 자료구조는 기본 타입 배열이다. (기본 타입은 참조 타입이 아니므로)
2. 사용하는 종단 연산이 `reduce, min, max, count, anyMatch`와 같은 연산일 때

#### 스트림 병렬화가 부적합한 케이스
1. 데이터 소스가 `Stream.iterate`이거나 중간 연산으로 `limit`이 사용되는 경우
    - 파이프라인 병렬화는 limit을 다룰 때 CPU코어가 남으면 원소 몇개를 더 처리하고 limit 이후의 결과를 버릴 수도 있다. 
    - 만약 추가 처리하는 원소에 대한 연산의 비용이 크다면 성능이 더 나빠질 수 있다.
2. 사용하는 종단 연사이 `collect`일 때
    - 컬렉션을 합치는 부담이 더 클 수 있다.

## ITEM 50. 적시에 방어적 복사본을 만들라.
내부의 가변 객체를 클라이언트에게 반환할 때 신뢰할 수 없다면 **방어적 복사본을 반환해야 한다.**
- 되도록 불변 객체들을 조합해 객체를 구성해야 방어적 복사를 줄일 수 있다.

## ITEM 52. 다중정의(오버로딩)는 신중히 사용하라.
오버로딩 메서드는 컴파일 타임에 결정되고, 오버라이딩 메서드는 런타임에 결정된다. 이러한 차이가 개발자의 직관을 헷갈리게 만들 수 있다. 
- 자세한건 [따로 작성한 게시글](https://pompitzz.github.io/blog/Java/javaOverloadingParameter.html)을 보자.

## ITEM 55. Optional 반환은 신중히 하라.
결과가 없을 수도 있으며, 클라이언트가 이 상황을 인지해야 하는 경우에 Optional은 반환 타입으로 지정하라.

Optional을 반환값 이외에 사용하는 경우는 거의 없다. 컬렉션의 원소, 객체의 필드에 Optional을 사용하는건 대부분의 경우 좋지 않다.

## ITEM 57. 지역변수의 범위를 최소화하라.
지역변수의 유효 범위를 최소로 줄일 수록 코드 가독성과 유지보수성이 높아지고 오류 가능성은 낮아진다.

#### 지역 변수의 범위를 줄이는 방법
1. 가장 처음 쓰일 때 선언 하기.
2. 메서드를 작게 유지하고 한 가지 기능에 집중하도록 만들기.

## ITEM 60. 정확한 답이 필요하다면 float와 double은 파하라.
`float`, `double`은 과학과 공학 계산용으로 넓은 범위의 수를 `근사치`로 계산하도록 설계되었다.

정확한 답이 필요한 계산에는 BigDecimal을 사용하자.
- 성능이 중요하고, 반올림이 필요없고, 소수점을 직접 추적할 수 있다면 int, long을 사용하여도 된다.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(1.03 - 0.42);     // 0.6100000000000001
        System.out.println(1.00 - 9 * 0.10); // 0.09999999999999998
    }
}
```
- `float`, `double`로는 정확한 계산이 불가능하다.

## ITEM 61. 박싱된 기본 타입보다는 기본 타입을 사용하라.
#### 기본 타입 vs 박싱된 기본 타입
1. `기본 타입`은 값만 가지지만, `박싱된 기본 타입`은 값에 더해 **식별성**을 가진다.
2. `박싱된 기본 타입`은 null을 가질 수 있다.
3. `기본 타입`이 `박싱된 기본 타입`보다 시간과 메모리 사용면에서 더 효율적이다.
    - 기본 타입은 스택 영역에 값이 바로 저장되므로 캐시 활용면에서 훨씬 뛰어나다.
    
## ITEM 67. 최적화는 신중히 하라.
**성능 때문에 견고한 구조를 희생하지 말자. 빠른 프로그램보다는 좋은 프로그램을 작성하라.**
- 일반적으로 프로그램의 `90%의 시간을 단 10%의 코드에서 사용`한다는 사실을 기억하자.

구현상의 문제는 나중에 최적화할 수 있지만, 아키텍처의 결함으로 성능이 제한되는 상황에는 시스템 전체를 다시 작성해야 할 수 있다. **따라서 설계 단계에서 성능을 반드시 염두에 두어야 한다.**
- API, 네트워크 프로토콜, DB 설계시에는 성능을 염두에 두어야 한다.

## ITEM 68. 일반적으로 통용되는 명명 규칙을 따르라.
여러 단어의 첫 글자만 딴 약자나 max, min 같이 널리 통용되는 줄임말을 제외하고는 단어를 줄여 쓰지 않도록 한다.

객체를 생성할 수 없는 클래스 이름은 보통 복수형 명사로 짓는다.

boolean 타입의 필드 이름은 보통 boolean 접근자 메서드에서 앞 단어를 뺀 형태다.(initialized)

#### 타입 매개변수 명명 규칙
- 임의의 타입: T(Type)
- 컬렉션 원소의 타입: E(Element)
- 맵의 키와 값: K, V
- 예외: X(eXception)
- 메서드 반환 타입: R(Return)

#### toType, asList
- 객체의 타입을 바꿔서 다른 객체를 반환하는 인스턴스 메서드 이름은 보통 `toType` 형태로 짓는다(toString, toArray).
- 객체의 내용을 다른 뷰로 보여주는 메서드의 이름은 보통 `asType`형태로 짓는다.(asList).


## ITEM 70. 복구할 수 있는 상황에는 검사 예외를, 프로그래밍 오류에는 런타임 예외를 사용하라.
자바는 throwable 타입으로 `검사 예외`, `비검사 예외`, `에러` 세가지를 제공한다.

`검사 예외`는 클라이언트가 복구할 수 있는 상황에만 사용하자.

`비검사 예외`는 복구가 불가능한 상황(전제조건 불만족)이나 확실치 않는 상황에서 사용하자.

`에러`는 `AssertionError`를 제외하고는 직접 던지는 일이 없어야 한다.

## ITEM 71. 필요 없는 검사 예외 사용은 피하라.
검사 예외는 많은 자바 개발자가 싫어하지만 제대로 활용하면 API와 프로그램의 질을 높일 수 있다. 하지만 너무 과하게 사용하면 쓰기 불편한 API가 된다.
- 검사 예외를 던지는 메서드를 스트림 안에서 직접 사용하지 못해 자바 8부터는 부담이 더 커졌다.

검사 예외를 회피하는 가장 쉬운 방법은 적절한 결과 타입을 담은 옵셔녈을 반환하는 것이다.
- 검사 예외를 던지는 대신 빈 옵셔널을 반환하면 된다.

**복구가 가능하고 클라이언트가 그 처리를 해주기 바라는데 옵셔널로도 상황을 처리하기에 충분한 정보를 제공할 수 없는 경우에만 검사 예외를 던지자.**

## ITEM 72. 표준 예외를 사용하라.
코드를 재사용하듯이 예외도 재사용하는 것이 좋으며, 자바 라이브러리는 대부분 API에서 쓰기에 충분한 수의 예외를 제공한다.
- 표준 예외를 재사용하면 API를 다른 사람이 익히고 사용하기 쉬워진다.

#### 자주 재사용되는 예외들
**IllegalArgumentException**
- 호출자가 아규먼트에 부적절한 값을 넘길 때 사용하는 예외다.
- 아규먼트 값이 부적절하다고 항상 해당 예외를 던지는 것은 아니다.
    - 보통 값이 null인 경우엔 `NullPointerException`을, 인덱스 초과인 경우엔 `IndexOutOfBoundsException`을 던진다.

**IllegalStateException**
- 대상 객체의 상태가 호출된 메서드를 수행하기에 적합하지 않을 때 주로 사용된다.
    - 제대로 초기화되지 않은 객체를 사용할 때 던질 수 있다.

> **IllegalArgumentException vs IllegalStateException**
> - 카드 덱을 표현하는 객체가 있고 인수로 건넨 수 만큼의 카드를 뽑아주는 메서드가 있을 때, 덱에 남아있는 카드 수 보다 많은 수를 뽑도록 요청하면 어떤 예외를 던져야할까?
>    - 인수 값이 무엇이었든 어차피 실패했다면 `IllegalStateException`, 그렇지 않으면 `IllegalArgumentException`를 던지는게 일반적인 규칙이다.
    
**ConcurrentModificationException**
- 단일 스레드에서 사용하려고 설계한 객체를 여러 스레드가 동시에 수정하려 할 때 던진다.

**UnsupportedOperationException**
- 요청한 동작을 대상 객체가 지원하지 않을 때 던진다.

`Exception`, `RuntimeException`, `Throwable`, `Error`는 추상 클래스라고 생각하고 직접 재사용하지 말자.

## ITEM 73. 추상화 수준에 맞는 예외를 던지라.
메서드가 저수준 예외를 처리하지 않고 바깥으로 전파하면 내부 구현을 드러내게 된다.

**상위 계층에서는 저수준 예외를 잡아 자신의 추상화 수준에 맞는 예외로 바꿔 던져야 한다.**

## ITEM 74. 가능한 한 실패 원자적으로 만들라.
호출된 메서드가 실패하더라도 해당 객체는 메서드 호출 전 상태를 유지하도록 하면 해당 객체를 여전히 정상적으로 사용할 수 있게 된다.
- 이러한 특성을 `실패 원자적`이라고 한다.

#### 실패 원자적으로 만드는 법
**1) 불변 객체를 사용하도록 설계한다.**
- 불변 객체는 태생적으로 실패 원자적이다.

**2) 작업 수행전에 매개변수의 유효성을 검사한다.**
- 객체의 내부 상태를 변경하기 전에 잠재적으로 발생할 수 있는 예외들을 대부분 걸러내도록 한다.

**3) 임시 복사본으로 작업을 수행하고, 마지막에 기존 객체와 교체한다.**
- 정렬 메서드에서 정렬 전 리스트의 원소들의 임시 복사본을 만들도 정렬 후에 교체하도록 하여 실패 원자적으로 만들 수 있다.

## ITEM 78. 공유 중인 가변 데이터는 동기화해 사용하라.
대부분 동기화를 한 스레드에서만 실행할 수 있도록 해주는 배타적 실행에 대한 기능만 제공하는 것으로 생각한다. 추가적으로 동기화에는 중요한 기능이 하나 더 있다.

**동기화는 일관성이 깨진 상태를 볼 수 없도록 하는 스레드 간의 안정적인 통신기능을 제공한다.**
- **동기화 없이는 한 스레드가 만든 변화를 다른 스레드에서 확인하지 못할 수 있다.**

#### 원자적 데이터는 동기화 하지 않아도 된다?
- `int, boolean`와 같은 원자적 동작을 제공하는 데이터를 사용할 땐 동기화를 하지 않아도 된다고 생각하지만 **매우 위험한 발상이다.**
- 자바는 스레드가 필드를 읽을 때 항상 수정이 반영된 값을 얻는다곤 보장하지만, **한 스레드가 저장한 값이 다른 스레드에게 보이는지는 보장하지 않는다.**
    - **즉 동기화 없이는 스레드 간의 안정적인 통신을 보장할 수 없다.**

**그러므로 공유 중인 가변 데이터는 원자적 동작을 제공하더라도 최소한 스레드 간의 통신에 대한 동기화는 해야 한다.**  
    
#### 예시
```java
public class Main {
    private static boolean stopRequested;

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            int i = 0;
            while (!stopRequested) {
                i++;
            }
        })
                .start();
        Thread.sleep(1000);
        stopRequested = true;
    }
}
```
- 이 코드는 1초 뒤에 종료되어야 할 것 같지만 동기화를 하지 않아 스레드 간의 안정적 통신을 보장할 수 없어 영원히 수행될 수 있다.
    - > 동기화가 없으면 JVM이 해당 코드 자체를 최적화 하거나, CPU 캐시로 인해 다른 스레드에서 변경된 값을 메모리에서 불러오지 않을 수 있다.

**volatile으로 스레드 통신 보장**
- `volatile`키워드는 값을 CPU 캐시가 아닌 `메인 메모리`에서 읽어올 수 있도록 보장해주므로 스레드간의 안전한 통신을 보장할 수 있다.
    - `volatile`는 스레드 간의 안전한 통신을 보장하므로 `한 스레드에서만 write`를 수행하고, `다중 스레드에서 read`를 수행할 때 사용하기 적절하다. 
    - **배타적 실행에 대한 보장은 되지 않으므로 동시 쓰기에 대한 동기화는 되지 않는다.**

```java
private static volatile boolean stopRequested;
```
- `volatile`을 붙이고 위 예시를 다시 수행하면 1초뒤에 정상 종료된다.

**Atomic 클래스를 사용하여 배타적 실행까지 보장**
- 일반적으로 배타적 실행을 보장받기 위해서 `synchronized`를 사용한다.
- `synchronized`가 꼭 필요한 경우가 아니라면 성능이 더 뛰어난 Atomic 클래스로 배타적 실행까지 제공받을 수 있다.

## ITEM 79. 과도한 동기화는 피하라.
데드락, 예측 불가능한 예외, 데이터 훼손을 피하려면 동기화 메서드나 블록 안에서는 절대로 제어를 클라이언트에 양도하면 안된다.
- 즉, 동기화 메서드나 블록에서 통제할 수 없는 오버라이딩 메서드, 클라이언트의 콜백 함수등을 호출하면 안된다.

## ITEM 81. wait, notify보다는 동시성 유틸리티를 애용하라.
스레드간 서로 작업을 조율하기 위해선 `CountDownLatch`, `Semaphore`, `CyclicBarrier`등의 유틸리티를 사용하는게 좋다.

`Collections.synchronizedMap`보다는 `ConcurrentHashMap`을 사용하는게 훨씬 좋다.

## ITEM 82. 지연 초기화는 신중히 사용하라.
지연초기화는 인스턴스 생성 시 초기화 비용은 줄지만, 필드에 접근하는 비용은 크다. 반드시 필요한 시점에 적용해야 하고 적용 전후 성능 측정을 해야한다.
- **대부분 상황에서 일반적인 초기화가 지연 초기화보다 낫다.**
- 인스턴스 접근 비율이 적으면서 초기화 비용이 매우 큰 경우에만 지연 초기화가 제 역할을 한다.

#### 지연 초기화 홀더 클래스
성능 때문에 `정적 필드를 지연 초기화해야 한다면` 지연 초기화 홀더 클래스클래스를 활용하자.

```java
public class Main {
    private static class FieldHolder {
        static final FieldType field = computeFieldValue();
    }
    private static FieldType getField() {
        return FieldHolder.field;
    }
}
```
- `getField`가 처음 호출될 때 `FieldHolder.field`가 처음 읽히면서 클래스가 초기화 된다. 동기화를 전혀하지 않으니 성능에 전혀 영향을 주지 않는다.

#### 이중검사
성능 때문에 `인스턴스 필드를 지연 초기화`해야 한다면 이중검사를 활용하자.
```java
public class Main {
    // 필드가 초기화 된 이후로는 동기화하지 않으므로 반드시 volatile을 붙여야 한다. (붙이지 않으면 스레드간 안전한 통신이 보장되지 않는다.[ITEM78])
    private volatile FieldType field;
    
    private FieldType getField() {
        // 지역변수를 사용하는 이유는 필드를 딱 한번만 읽도록 보장하여 성능을 높이는 역할을 한다.
        FieldType result = field;
        if (result != null) return result;
        synchronized (this) {
            if (field == null) {
                field = computeFieldValue();
            } 
            return field;
        }
    } 
}
```
- long, double을 제외한 기본 타입이라면 `volatile`을 생략할 수 있다.

```java
public class Main {
    // 필드가 초기화 된 이후로는 동기화하지 않으므로 반드시 volatile을 붙여야 한다. (붙이지 않으면 스레드간 안전한 통신이 보장되지 않는다.[ITEM78])
    private volatile FieldType field;
    
    private FieldType getField() {
        // 지역변수를 사용하는 이유는 필드를 딱 한번만 읽도록 보장하여 성능을 높이는 역할을 한다.
        FieldType result = field;
        if (result == null) {
            field = result = computeFieldValue();
        } 
        return result;
    } 
}
```
- 반복해서 초기화되어도 된다면 두 번째 검사를 생략할 수 있다.
