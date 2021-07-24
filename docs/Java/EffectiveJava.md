---
title: Effective Java 3/E 정리
date: 2021-07-24 13:03
img:
    - java.png
tags:
    - JAVA 
---

실무를 하면서 참고하면 좋다고 생각이 드는 아이템들만 정리하였습니다.

## ITEM 1. 생성자 대신 정적 팩터리 메서드를 고려하라.
### 장점
1. 생성자와 달리 명시적인 이름을 가질 수 있다.
2. 인스턴스를 캐싱하여 재활용할 수 있다.
3. 반환 타입의 하위 타입 객체를 반환할 수 있어 유연성이 좋다.
    - 자바 8 전에는 인터페이스에 static 메서드를 선언할 수 없어 주로 동반 클래스를 만들어서 정적 팩터리를 제공함.(List -> Lists)
    - 자바 8부터는 인터페이스에 static 메서드를 선언할 수 있으므로 동반 클래스를 만들 필요가 별로 없음.
4. 매개변수 값에 따라 서로 다른 객체를 반환할 수 있다.
    - 매개변수에 따라 최적화된 객체를 제공할 수 있음.
5. 코드를 작성하는 시점에 반환할 객체의 클래스가 존재하지 않아도 된다.
    - JDBC에서 Driver를 등록하고 Connection을 가져올 때 활용하는 방식이다.
    - JDBC를 사용할 때 `Class.forName(Driver)` 혹은 `DriverManager.registerDrivers(Driver)`으로 Driver를 등록하고 `DriverManager.getConnection()`을 통해 Connection을 가져온다.
    - `DriverManager.getConnection()`를 작성하는 시점엔 반환할 특정 Driver의 Connection 클래스를 모른채로 코드를 작성할 수 있다.
    
### 단점
1. 정적 팩터리 메서드만 제공하면 상속이 불가능하다.
    - 정적 팩터리 메서드만 제공하기 위해 생성자를 private로 만들면 상속 불가능
2. 코드 상으로 정적 팩터리 메서드를 찾기 어려울 수 있다.
    - Naming convention 지키면 문제를 완화할 수 있음.
    
### 정적 패터리 메서드 Naming Convention
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
### private 생성자 방식
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
```
- 정적 팩터리 방식은 원할 때 클라이언트 변경없이 싱글턴을 반환하지 않도록 수정이 가능하다. 이런 장점이 필요 없다면 public가 간결하다.

> 직렬화나 리플렉션에 의해 싱글턴 보장이 되지 않을 수 있는데 실무에서 이를 고려해야하는 경우는 아직 보지 못했다.

### enum 방식
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

### equals 규약
**컬렉션 클래스들을 포함해 수 많은 클래스들이 전달받은 객체가 equals 규약을 지킨다고 가정하고 동작하므로 규약은 중요하다.**

#### 1) 반사성(reflexivity)
- null이 아닌 모든 참조 값 x에 대해 `x.equals(x) == true`다.

#### 2) 대칭성(symmetry)
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

#### 3) 추이성(transitivity)
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

#### 4) 일관성(consistency)
- 동일한 참조 값에 대한 equals 호출의 결과는 반드시 동일해야 한다.

#### 5) null-아님
- null이 아닌 모든 참조 값 x에 대해 `x.equals(null) == false`다.

## ITEM 11. equals를 재정의하려면 hashCode도 재정의하라.
equals를 재정의한 클래스에서 hashCode를 재정의하지 않으면 규약을 어기게 되어 Hash 관련 컬렉션을 사용할 때 문제가 생긴다.
- HashMap의 경우 hashCode가 다르다면 equals비교를 시도 조차 하지 않도록 최적화 되어 있다.

### hashCode 규약
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

### Object.clone 동작 방식
- Cloneable을 구현한 클래스에서 clone을 호출하면 그 객체의 필드를 하나씩 복사하여 반환
- 그렇지 않으면 CloneNotSupportedException 발생

### 요약
- Cloenable을 구현한 모든 클래스는 clone을 재정의해야 하고 접근 제한자를 public으로, 반환 타입을 클래스 자신으로 변경해야 한다.
- 가장 먼저 super.clone()하고 필요한 필드를 전부 적절히 수정해야 한다.
- Cloneable을 이미 구현한 클래스를 확장한다면 어쩔 수 없이 clone이 잘 작동 되도록 구현해야 한다.
- 새로운 클래스에서 Cloneable을 구현하지 말고 복사 생성자나 복사 팩터리를 활용하자.
- 배열은 clone 메서드을 제대로 지원하므로 활용하는게 좋다.

## ITEM 14. Comparable을 구현할지 고려하라.
compareTo는 순서를 비교하여 인스턴스들 간의 순서를 정할 수 있는 점을 제외하고 equals와 성격이 동일하다.
그러므로 순서가 명확한 값 클래스들은 Comparable 인터페이스를 구현하는 것이 좋다.

### compareTo 일반 규약
compareTo 메서드는 이 객체가 주어진 객체보다 작으면 음의 정수, 같으면 0, 크면 양의 정수를 반환해야 한다.
compareTo 또한 equals와 동일하게 확장한 구체 클래스에서 새로운 필드를 추가한 경우 compareTo 규약을 지킬 수 없다.

- `x.compareTo(y) == -y.compareTo(x)` (-1, 0, 1을 반환한다고 가정)
- `x.compareTo(y) > 0 && y.compareTo(z) > 0`라면 `x.compareTo(z) > 0`이다.
- `x.compareTo(y) == 0`라면 `x.compareTo(z) == y.compareTo(z)`다 (-1, 0, 1을 반환한다고 가정)
- `x.compareTo(y) == 0`라면 `x.equals(y) == true`여야 한다.
    - 이 방법은 필수는 아니지만 정렬 관련 컬렉션에선 equals 대신 compareTo로 동치성을 비교하기도 하므로 반드시 지키는게 좋다. 아니라면 문서화하자. 

### compareTodㅔ서 \<, \> 대신 Comparator를 활용하자.
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
