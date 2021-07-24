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
#### 장점
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
