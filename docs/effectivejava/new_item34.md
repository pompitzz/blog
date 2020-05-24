---
title: 아이템 34. int 상수대신 열거타입을 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 열거타입은 일정 개수의 상수 값을 정의한 다음, 그 외의 값은 허용하지 않는 타입이다.
- 자바의 열거타입은 클래스이므로 다른 언어의 열거 타입보다 훨씬 강력하다.
- 열거 타입 자체는 클래스이며, 상수 하나당 자신의 인스턴스를 하나씩 만들어 public static final 필드로 공개한다.
- 열거 타입은 임의의 메서드나 필드를 추가할 수 있고 인터페이스를 구현할 수 도 있다.
- **열거 타입 상수 각각을 특정 데이터와 연결지으려면 생성자에서 데이터를 받아 인스턴스 필드에 저장하면 된다.**

```java
public enum Operation {
  PLUS, MINUS, TIMES, DIVIDE;

  public double oper(double x, double y) {
    switch (this) {
      case PLUS:
        return x + y;
      case MINUS:
        return x - y;
      case TIMES:
        return x * y;
      case DIVIDE:
        return x / y;
      default:
        throw new AssertionError("알 수 없는 연산: " + this);
    }
  }
}
```
- enum을 활용하여 계산기를 구현할 때 위와같이 구현할 수 있다.
- 하지만 이 방식은 안전하지 못하다.
- enum 상수가 추가될 때 oper에 변경이 필요하므로 깨지기 쉬운 코드이다.

```java
public enum Operation {
  PLUS {
    @Override
    public double oper(double x, double y) {
      return x + y;
    }
  },
  MINUS {
    @Override
    public double oper(double x, double y) {
      return x - y;
    }
  },
  TIMES {
    @Override
    public double oper(double x, double y) {
      return x * y;
    }
  },
  DIVIDE {
    @Override
    public double oper(double x, double y) {
      return x / y;
    }
  };

  public abstract double oper(double x, double y);
  
}
```
- 추상 메서드를 제공하면 상수별 메서드를 구현하게 할 수 있다.
- 하지만 추상 메서드는 열거 타입 상수끼리 코드를 공유하기 어려워 상황에 따라선 비효율적이다.

```java
public enum  PayrollDay {
  MONDAY, WEDNESDAY, FRIDAY, SUNDAY;
  
  private static final int MINS_PRT_SHIFT = 8 * 60;
  
  public int pay(int minutesWorked, int payRate) {
    int basePay = minutesWorked * payRate;
    
    int overtimePay;
    
    switch (this) {
      case SUNDAY: // 주말
        overtimePay = basePay / 2;
        break;
      default: // 주중
        overtimePay = minutesWorked <= MINS_PRT_SHIFT ? 0 : (minutesWorked - MINS_PRT_SHIFT) * payRate / 2;
    }
    return basePay + overtimePay;
  }
}

```
- 이런 경우는 추상메서드보다 switch로 구현하느게 좋다.
- 하지만 만약 상수에 Holiday와 같은 값이 추가되면 어떻게 될까?
- 해당 상수에도 평일의 임금적용법이 적용될 것이다.
- 그렇다고 추상 메서드를 통해 모든 상수에 메서드를 구현하기는 매우 비효율적이며 중복이다.
- 혹은 두개의 enum으로 나누는 것도 같은 성격이므로 맞지 않다.
- 이럴땐 새로운 열거 타입을 inner에 추가하여 이를 이용하면 된다.

```java
@RequiredArgsConstructor
public enum PayrollDay {
  MONDAY, WEDNESDAY, FRIDAY,
  SUNDAY(PayType.WEEKEND);

  private final PayType payType;

  PayrollDay() {
    this.payType = PayType.WEEKEND;
  }

  int pay(int mins, int payRate) {
    return payType.pay(mins, payRate);
  }
  enum PayType {
    WEEKDAY {
      @Override
      int overtimePay(int mins, int payRate) {
        return mins <= MINS_PRT_SHIFT ? 0 : (mins - MINS_PRT_SHIFT) * payRate / 2;
      }
    },
    WEEKEND {
      @Override
      int overtimePay(int mins, int payRate) {
        return mins * payRate / 2;
      }
    };

    private static final int MINS_PRT_SHIFT = 8 * 60;
    abstract int overtimePay(int mins, int payRate);


    public int pay(int minutesWorked, int payRate) {
      int basePay = minutesWorked * payRate;
      return basePay + overtimePay(minutesWorked, payRate);
    }
  }
}
```
