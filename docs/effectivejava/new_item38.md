---
title: 아이템 38. 확장할 수 있는 열거 타입이 필요하면 인터페이스를 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 열거 타입은 확장이 불가능하다.
- 이는 의도된 설계로 대부분 상황에서 열거 타입을 확장하는건 좋지 않다.
- 그런데 확장할 수 있는 열거 타입이 어울리는 쓰임이 하나 있다.
- 바로 연산 코드(operation code)이다.
- 연산 코드의 각 원소는 특정 기계가 수행하는 연산을 뜻한다.
- 열거타입은 인터페이스를 구현할 수 있으므로 이를 이용하여 열거타입들이 인터페이스를 구현하도록 하면 된다.

```java
public interface Operation {
  double apply(double x, double y);
}

public enum BasicOperation implements Operation {
  PLUS("+") {
    @Override
    public double apply(double x, double y) {
      return x + y;
    }
  },
  MINUS("-") {
    @Override
    public double apply(double x, double y) {
      return x - y;
    }
  };

  private final String symbol;

  BasicOperation(String symbol) {
    this.symbol = symbol;
  }
}

public enum ExtendedOperation implements Operation {
  EXP("^") {
    @Override
    public double apply(double x, double y) {
      return Math.pow(x, y);
    }
  },
  REMAINDER("%") {
    @Override
    public double apply(double x, double y) {
      return x % y ;
    }
  }
  ;

  private final String symbol;

  ExtendedOperation(String symbol) {
    this.symbol = symbol;
  }
}
```
- 인터페이스를 활용하여 연산 기능을 새로운 Enum을 이용하여 확장할 수 있다.

```java
public class Main {
  public static void main(String[] args) {
    test(BasicOperation.class, 10, 20);
    test(ExtendedOperation.class, 10, 20);

    test2(Arrays.asList(BasicOperation.values()), 10, 20);
    test2(Arrays.asList(ExtendedOperation.values()), 10, 20);
  }

  private static <T extends Enum<T> & Operation> void test(Class<T> opEnumType, double x, double y) {
    for (Operation op : opEnumType.getEnumConstants()) {
      System.out.printf("%f %s %f = %f\n", x, op, y, op.apply(x, y));
    }
  }

  private static void test2(Collection<? extends Operation> opSet, double x, double y) {
    for (Operation op : opSet) {
      System.out.printf("%f %s %f = %f\n", x, op, y, op.apply(x, y));
    }
  }
}
```
- 구현된 기능을 테스트하는 메서드들이다.
- 첫 번째 방식은 Enum class 리터럴을 이용하여 테스트한다. 제네릭 매개변수를 이용하여 Enum, Operation으 히위 객체만 받도록한다.
- 두 번째 방식은 Collection을 이용하여 Operation을 구현한 Collection만 받도록하여 테스트를 진행한다.
- 인터페이스를 활용하는 방식에 한가지 사소한 문제가 있다. 열거 타입끼리는 구현 상속을 할 수 없다.
- 아무 상태에도 의존하지 않는다면 디폴트 구현을 이용해 인터페이스에 추가하는 방법이 있다.
- 자바 라이브러리에서 java.nio.file.LinkOption 열거 타입은 CopyOptio과 OpenOption 인터페이스를 구현했다.

#### 핵심 정리
- 열거 타입 자체는 확장할 수 없지만, 인터페이스와 그 인터페이스를 구현하는 기본 열거타입을 함께 사용해 같은 효과를 낼 수 있다.

 
