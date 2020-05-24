---
title: 아이템 48. 스트림 병렬화는 주의해서 적용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 자바는 처음 릴리즈된 1996년부터 스레드, 동기화, wait/notify 등을 지원했다.
- 자바 5부터는 동시성 컬렉션인 java.util.concurrent 라이브러리와 Executor 프레임워크를 지원했다.
- 자바 7부터는 고성능 별렬 분해 프레임워크인 포크-조인 패키지를 추가했다.
- 그리고 자바 8부터는 parallel 메서드만 한 번 호출하면 파이프라인을 병렬 실행할 수 있는 스트림을 지원한다.
- **이처럼 자바로 동시성 프로그램을 작성하는건 점점 더 쉬워지고 있지만, 이를 올바르고 빠르게 작성하는 일은 여전히 어려운 작업이다.**
- 동시성 프로그래밍을 할 때는 안전성과 응답 가능 상태를 유지하기 위해 애써야 한다.

```java
public class Main {
  public static void main(String[] args) {
    primes().map(p -> BigInteger.TWO.pow(p.intValueExact()).subtract(BigInteger.ONE))
        .filter(mersenne -> mersenne.isProbablePrime(50))
        .limit(20)
        .forEach(System.out::println);
  }

  static Stream<BigInteger> primes() {
    return Stream.iterate(BigInteger.TWO, BigInteger::nextProbablePrime);
  }
}
```
- 해당 함수를 그냥 실행시키면 약 5~6초의 시간이 걸린다.
- 만약 여기서 parallel을 이용하면 어떻게 될까?
- 프로그램은 아무것도 출력하지 못하면서 무한히 반복된다.
- 스트림 라이브러리는 이 파이프라인을 병렬화하는 방법을 찾아내지 못한다.
- **데이터 소스가 Stream.iterate이거나, 중간 연산으로 limit을 쓰면 파이프라인 병렬화 성능 개선을 기대할 수 없다.**
- 이 프로그램은 두 문제를 모두 지니고 있다.
- 그리고 문제의 각 데이터를 계산할 때 이전 계산시간보다 2배나 더 걸린다. 만약 19번째까지 계산 후 20번째 계산을 할때 나머지 코어들은 한가하게 된다.
- 그래서 21, 22, 23... 번째 값을 찾게되는 병렬이 수행되고 이 계산은 20번째 값의 계산이 끝나도 결코 끝나지 않게 된다.

#### 병렬화 하기 좋은 데이터
- 대체로 **스트림의 소스가 ArrayList, HashMap, HashSet, ConcurrentHashMap등의 인스턴스거나, 배열등일 때 병렬화가 가장 효과가 좋다.**
- 이들은 추가적으로 참조 지역성이 뛰어난 특성이 가지고 있다. 참조지역성이란 이웃한 원소의 참조들이 메모리에 연속해서 저장되어 있다는 뜻이다.
- 만약 참조들이 가리키는 실제 객체의 메모리주소가 서로 떨어져 있다면 참조 지역성이 나빠지고, 스레드는 데이터가 주 메모리에서 캐시 메모리로 전송되어 오기를 기다려야 한다.
- 그러므로 참조 지역성은 다량의 데이터를 처리하는 벌크 연산을 병렬화할 때 아주 중요한 요소로 작용한다.
- 참조 지역성이 가장 뛰어난 자료구조는 기본타입의 배열로, 기본 타입 배열에서는 데이터 자체가 메모리에 연속해서 저장되기 때문이다.

#### 종단 연산의 영향
- 스트림 파이프라인의 종단 연상의 동작 방식 역시 병렬 수행 효율에 영향을 준다.
- 종단 연산에서 수행하는 작업량이 파이프라인 전체 작업에서 상당 비중을 차지하면서 순차적인 연산이라면 파이프라인 병렬 수행의 효과는 제한될 수 밖에 없다.
- 종단 연산 중 병렬화에 가장 적합한 것은 축소를 통해 모든 원소를 하나로 합치는 것이다.
- 즉 min, max, count, sum와 anyMatch, allMatch, noneMatch같이 조건에 따라 즉시 반환되는 메서드들은 병렬화에 적합하다.
- 하지만 collect는 컬렉션을 합치는 부담이 크기때문에 병렬화에 적합하지 않다.
- **스트림을 잘못 병렬화하면 성능이 나빠질 뿐만아니라 결과 자체가 잘못되거나 예상못한 동작이 발생할 수 있다.**
- 스트림 병렬화는 오직 성능 최적화 수단이며 다른 최적화와 마찬가지로 변경 전후로 반드시 성능을 테스트하여 가치를 확인해야 한다.
- **조건이 잘 갖춰진다면 parallel 메서드 호출하나로 거의 프로세서 코어 수에 비례하는 성능 향상을 만끽할 수 있다.**

```java
public class Test {
  public static void main(String[] args) {
    long n = 10000000;
    final long start = System.currentTimeMillis();
    System.out.println(pi(n));
    final long end = System.currentTimeMillis();
    System.out.println(((end - start) / 1000) + "s");
  }

  static long pi(long n) {
    return LongStream.rangeClosed(2, n)
        .parallel()
        .mapToObj(BigInteger::valueOf)
        .filter(i -> i.isProbablePrime(50))
        .count();
  }
}
```
- 해당 코드는 병렬화를 수행할때와 아닐때 4배 이상의 시간 차이가 발생한다.

#### 핵심 정리
- 계산도 올바로 수행하고 성능도 빨라질 거라는 확신 없이는 스트림 파이프라인 병렬화는 시도조차 하지 말자.
- 계산도 정확하고 성능이 좋아졌음을 확실해졌을 때 오직 그럴때만 병렬화 버전 코드를 운영 코드에 반영하라.
