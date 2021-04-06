---
title: resilience4j Circuit Breaker 
date: 2021-04-06 22:09 
img:
  - java.png 
tags:
  - JAVA

---

## Introducion

- Resilience4j는 Netflix Hystrix의 영감을 받았고 자바 함수형 프로그래밍을 위해 설계된 경량 fault tolerance 라이브러리입니다.
- 여러 외부 라이러리에 의존성을 가지는 Netflix Hystrix와 다르게 Resilience4j는 Vavr 라이브러리외에 다른 의존성을 가지지 않습니다.
- Resilience4j는 higher-order functions(decorators)을 제공하므로 상황에 맞게 원하는 기능들만 선택하여 확장할 수 있습니다.

## Circuit Breaker

![CircuitBreaker](./circuit-breaker.jpeg)

- CircuitBreaker는 3개의 normal states(`CLOSE`, `OPEN` and `HALF_OPEN`)과 두개의 special states(`DISABLED` and `FORCED_OPEN`)을
  가지는 유한 상태 머신으로 구현되어 있습니다.
- CircuitBreaker는 호출 결과를 저장하고 집계하기 위해서 sliding window를 사용합니다. sliding window는 count-based와 time-based가 있습니다.
- count-based는 마지막 N개의 호출 결과를 집계하고, time-based는 지정된 N 시간만큼의 호출 결과를 집계합니다.

### sliding window

#### 1. Count-based sliding window

- count-based sliding window는 N개의 measurements로 구성된 원형 배열로 구현됩니다.
    - count window size가 10일 때 원형 배열은 항상 10개의 measurements를 가집니다.
- total aggregation은 새로운 호출 결과가 기록될 때 마다 업데이트됩니다.
    - 가장 오래된 measurements가 원형 배열에서 빠지면 해당 measurement는 total aggregation에서 차감되고 버킷이 재설정 됩니다.
- 집계 데이터는 호출 결과가 기록될 때 마다 매번 업데이트되므로 집계된 스냅샷을 가져오는 연산의 시간 복잡도는 `O(1)`입니다.
- N개의 measurement를 저장해야하므로 공간 복잡도는 `O(N)`입니다.

#### 2. Time-based sliding window

- time-based sliding window는 N개의 partial aggregation로 구성된 원형 배열로 구현됩니다.
    - time window size가 10초라면 원형 배열은 항상 10개의 partial aggregations(`bucket`)를 가집니다.
- 모든 bucket은 특정 epoch second에 발생한 모든 호출 결과를 집계합니다.
    - head bucket은 현재 epoch second의 모든 호출 결과를 저장하고 있고 다른 bucket들은 이전 seconds의 모든 호출 결과를 저장하고 있습니다.
    - 각 bucket의 호출 결과들을 `tuples`이라고 합니다.
- total aggregation이 업데이트되고 차감되는 방식은 count-based와 동일합니다. 그러므로 스냅샵을 가져오는 시간 복잡도 또한 동일합니다.
- N개의 bucket을 가지고 해당 bucket에 tuples이 존재하므로 공간복잡도는 조금 다를 수 있습니다.
    - 하지만 tuples은 개별적으로 저장되지 않게 구성되어 있으므로 무시할 수 있어 거의 O(N)으로 봐도 무방합니다.
- bucket은 실패한 호출 수, 느린 호출 수, 총 호출 수를 저장하기 위한 3개의 integer와 전체 기간을 저장하기 위한 1개의 long으로 구성됩니다.

### Failure rate and slow call rate thresholds

- CircuitBreaker의 상태는 failure rate가 configurable threshold 값보다 크거나 같을 때 `CLOSED`에서 `OPEN`으로 변경됩니다.
- 기존적으로 모든 예외는 실패로 카운트됩니다.
    - 특정 예외를 정의하면 지정된 예외만 실패로 카운트됩니다.
- CircuitBreaker의 상태는 slow call rate가 configurable threshold 값보다 크거나 같을 때 `CLOSED`에서 `OPEN`으로 변경됩니다.
    - 이 방식은 외부 시스템이 실제로 다운되기 전에 부하를 줄이는데 도움을 줍니다.
- failure rate와 slow call rate을 계산하기 위해선 최소한의 호출 기록이 저장되어야 합니다.
    - 모든 호출이 실패하더라도 최소 호출 수가 기록되지 않으면 CircuitBreaker는 동작하지 않습니다.
- CircuitBreaker는 상태가 `OPEN`일 때 `CallNotPermittedException`로 호출을 거부합니다.
    - 대기 시간이 지난 후에 `OPEN`에서 `HALF_OPEN`으로 변경되고 설정된 수 만큼 외부 시스템에 호출이 다시 가능해집니다.
    - 만약 여전히 외부 시스템이 failure rate or slow call rate가 threshold값보다 크거나 같다면 `OPEN` 상태가 되고 그렇지 않으면 `CLOSED` 상태가 됩니다.
- CircuitBreaker의 두개의 special states는 `DISABLED(always allow access)` and `FORCED_OPEN(always deny access)`로 구성되어 있고 해당
  상태에서는 이벤트가 생성되지 않고 메트릭이 기록되지 않습니다.

**CircuitBreaker는 thread-safe하다.**

- CircuitBreaker의 상태는 AutomicReference로 저장되어 있습니다.
- CircuitBreaker는 automic operations를 사용하여 상태를 업데이트하므로 side-effect가 없습니다.
- 호출을 기록하고 스냅샷을 읽어들이는 동작은 Sliding Window에서 동기화됩니다.

> thread-safe하므로 특정 시점에 하나의 스레드에서만 CircuitBreaker의 상태 및 sliding window를 업데이트 할 수 있습니다.

**CircuitBreaker는 함수 호출을 동기화하지 않는다.**

- CircuitBreaker는 thread-safe하지만 함수 호출을 동기화 하진 않습니다.
    - 함수 호출을 동기화하게 되면 심각한 성능 저하가 발생 할 수 있기 때문입니다.
    - 만약 3개의 스레드가 동시에 CircuitBreaker 상태 변경을 시도하게 되면 모든 요청은 허용됩니다.(Bulkhead를 활용하면 스레드 제어가 가능)

**Example with 3 Threads**

![circuitbreadker-flow](./circuitbreadker-flow-with-3threds.png)

## 학습 테스트

- CircuitBreaker가 예상한대로 잘 동작하는지 몇가지 학습 테스트를 작성해보겠습니다.

```java
public class SimpleCaller {
    public String getHello() {
        return "hello";
    }

    public String throwNPE() {
        throw new NullPointerException();
    }

    public String throwIRE() {
        throw new IllegalArgumentException();
    }
}

@ExtendWith(MockitoExtension.class)
public class CircuitBreakerTest {
    private final SimpleCaller simpleCaller = Mockito.spy(SimpleCaller.class);
    private static final CircuitBreakerConfig CIRCUIT_BREAKER_CONFIG = CircuitBreakerConfig.custom()
            .minimumNumberOfCalls(10) // 최소 10번은 호출되어야 CircuitBreaker가 작동
            .failureRateThreshold(30) // failure rate는 30%로 설정
            .build();
    private CircuitBreaker circuitBreaker;

    @BeforeEach
    void init() {
        circuitBreaker = CircuitBreaker.of("custom", CIRCUIT_BREAKER_CONFIG);
    }
}
```

### minimumNumberOfCalls 테스트

```java
@ExtendWith(MockitoExtension.class)
public class CircuitBreakerTest {
    @Test
    @DisplayName("CircuitBreaker는 호출 수가 minimumNumberOfCalls가 넘은 경우에만 동작해야 한다.")
    void minimumNumberOfCallsTest() throws Exception {
        // when & then
        int minimumCallSize = 10;
        for (int i = 0; i < minimumCallSize; i++) {
            try {
                CIRCUIT_BREAKER.decorateSupplier(simpleCaller::throwNPE).get();
            } catch (Exception e) {
                assertThat(e)
                        .as("minimumCallSize 까지는 NPE 발생")
                        .isInstanceOf(NullPointerException.class);
            }
        }

        for (int i = 0; i < 5; i++) {
            try {
                CIRCUIT_BREAKER.decorateSupplier(simpleCaller::throwNPE).get();
            } catch (Exception e) {
                assertThat(e)
                        .as("CircuitBreaker가 작동되어 CallNotPermittedException 발생")
                        .isInstanceOf(CallNotPermittedException.class);
            }
        }

        // circuit breaker가 작동되어 operator.throwNPE()는 10번만 호출되어야 한다.
        verify(simpleCaller, times(10)).throwNPE();
    }
}
```

- 호출 수가 설정된 minimumNumberOfCalls보다 작은 경우엔 circuitBreaker가 동작하지 않는 것을 확인할 수 있습니다.

### failureRateThreshold 테스트

```java
@ExtendWith(MockitoExtension.class)
public class CircuitBreakerTest {
    @Test
    @DisplayName("CircuitBreaker는 failureRate가 failureRateThreshold와 같아지면 다음 호출들을 차단해야 한다.")
    void when_failureRate_same_with_failureRateThreshold() throws Exception {
        // given
        int normalCallSize = 14;
        int exceptionCallSize = 6;

        // when & then
        for (int i = 0; i < normalCallSize; i++) {
            circuitBreaker.decorateSupplier(simpleCaller::getHello).get();
        }

        for (int i = 0; i < exceptionCallSize; i++) {
            try {
                circuitBreaker.decorateSupplier(simpleCaller::throwNPE).get();
            } catch (Exception e) {
                assertThat(e)
                        .as("failureRateThreshold가 되기 전까진 NPE 발생")
                        .isInstanceOf(NullPointerException.class);
            }
        }

        for (int i = 0; i < normalCallSize; i++) {
            try {
                circuitBreaker.decorateSupplier(simpleCaller::getHello).get();
                fail("호출이 차단되므로 예외가 발생해야 한다.");
            } catch (Exception e) {
                assertThat(e)
                        .as("failureRateThreshold가 되어서 CallNotPermittedException 발생")
                        .isInstanceOf(CallNotPermittedException.class);
            }
        }

        verify(simpleCaller, times(normalCallSize)).getHello();
        verify(simpleCaller, times(exceptionCallSize)).throwNPE();
    }

    @Test
    @DisplayName("CircuitBreaker는 failureRate가 failureRateThreshold보다 작으면 다음 호출들을 차단하지 않아야 한다.")
    void when_failureRate_lower_than_failureRateThreshold() throws Exception {
        // given
        int normalCallSize = 15;
        int exceptionCallSize = 5;

        // when & then
        for (int i = 0; i < normalCallSize; i++) {
            circuitBreaker.decorateSupplier(simpleCaller::getHello).get();
        }

        for (int i = 0; i < exceptionCallSize; i++) {
            try {
                circuitBreaker.decorateSupplier(simpleCaller::throwNPE).get();
            } catch (Exception e) {
                assertThat(e)
                        .as("failureRateThreshold가 되기 전까진 NPE 발생")
                        .isInstanceOf(NullPointerException.class);
            }
        }

        for (int i = 0; i < normalCallSize; i++) {
            try {
                circuitBreaker.decorateSupplier(simpleCaller::getHello).get();
            } catch (Exception e) {
                fail("호출이 차단되지 않으므로 예외가 발생하면 안된다.");
            }
        }

        verify(simpleCaller, times(2 * normalCallSize)).getHello();
        verify(simpleCaller, times(exceptionCallSize)).throwNPE();
    }
}
```

- failureRate가 failureRateThreshold보다 작은 경우엔 circuitBreaker가 호출을 차단하지 않고 같아진 이후에만 호출을 차단하는 것을 확인할 수 있습니다.

## 참고 자료
[resilience4j docs](https://resilience4j.readme.io/docs/circuitbreaker)
