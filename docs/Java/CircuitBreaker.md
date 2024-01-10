---
title: Circuit Breaker 패턴, resilience4j Circuit Breaker 살펴보기
date: 2021-04-06 22:09 
img:
  - circuit_breaker.png 
tags:
  - Design
  - Java
---

## Circuit Breaker Pattern
Circuit Breaker 패턴은 애플리케이션이 실패할 가능성이 있는 작업을 반복적으로 수행하지 않도록 방지하여 시스템의 다른 부분까지 장애가 전파되는 것을 막는데 도움을 주는 패턴이다.   

### Circuit Breaker가 필요한 이유
- 분산 환경에서 외부 서비스에 대한 호출은 다양한 원인(네트워크, 타임아웃, 리소스 부족 등)으로 인해 짧은 시간 동안 일시적으로 실패할 수 있다. 일시적인 실패의 경우 보통 재시도를 통해 해결할 수 있다.
- 하지만, **예상치 못한 결함으로 인해 서비스가 중단되어 복구가 오래걸리는 경우 호출을 재시도 하거나 해당 서비스를 계속해서 호출하도록 둔다면 해당 호출들은 타임아웃이 발생할 때까지 리소스를 점유하게 되어 시스템의 다른 부분에 영향을 줄 가능성이 있다.**
  - 이 경우 서비스가 복구되어 호출이 성공할 가능성이 있기 전까지는 호출을 하지 않고 실패로 처리하고 특정 시간이 지난 후에 다시 외부 서비스가 정상 동작하는지 판단하는 것이 필요하다.

### Circuit Breaker의 3가지 상태
Circuit Breaker는 애플리케이션과 외부 요청에 대한 프록시 역할을 하며 `3가지 상태(Closed, Open, Half-Open)`를 기반으로 한 상태 머신으로 구성된다.

#### # Closed
- 애플리케이션의 요청이 정상적으로 라우팅되는 상태
- CircuitBreaker 프록시는 설정된 기간동안 실패들을 집계하여 설정된 값에 따라 Open 상태로 전환할 지 모니터링 한다.   

#### # Open
- 애플리케이션의 요청이 라우팅되지 않고 CircuitBreaker에서 즉시 실패시켜 예외를 반환하는 상태
- 설정된 기간동안 Open 상태에 머물러 있다가 Half-Open 상태로 전환한다.

#### # Half-Open
- 애플리케이션의 요청 중 일부분만 라우팅하여 Open 상태로 머무를 지 Closed 상태로 전환해도 되는지 판단하는 상태
  - 요청들이 성공한다면 결함이 복구되었다고 가정하고 Closed로 전환한다.
  - 요청들이 실패하여 결함이 여전히 존재한다고 판단되면 다시 Open상태로 전환한다.
- Half-Open 상태는 복구된 서비스에 갑자기 많은 요청이 들어오는 것을 방지하는데 유용하다. 

### 고려 사항
#### Exception Handling
- circuit이 열려 예외가 발생했을 때 해당 예외를 어떻게 핸들링 할지 고려가 필요
- 애플리케이션에 따라 다르겠지만 대체 가능한 다른 서비스를 호출하거나, 기본값을 제공하는 등의 방식을 취할 수 있다.

#### Recoverability
- 복구 패턴과 일치하도록 Circuit Breaker를 설정해야 한다.
- 설정 값이 적절하지 않으면 장애가 복구되었는데도 circuit이 열려 있어 예외가 발생하거나 장애가 복구되지 않았는데도 자주 요청하여 시스템에 영향을 줄 수 있다.

#### Resource Differentiation
- 동일한 종류의 리소스라도 분산 시스템인 경우 단일 Circuit Breaker를 사용하는데 주의가 필요하다.
  - 특정 노드의 결함으로 인해 circuit이 열러 문제가 없는 노드에 대한 요청까지 차단될 수 있다.


## resilience4j Circuit Breaker

![CircuitBreaker](./resilience4j/circuit-breaker.jpeg)

- CircuitBreaker는 3개의 normal states(`CLOSE`, `OPEN`, `HALF_OPEN`)과 두개의 special states(`DISABLED`, `FORCED_OPEN`)을
  가지는 유한 상태 머신으로 구현된다.
- CircuitBreaker는 호출 결과를 저장하고 집계하기 위해서 sliding window를 사용하고 sliding window는 count-based와 time-based가 있다.
- count-based는 마지막 N개의 호출 결과를 집계하고, time-based는 지정된 N초만큼의 호출 결과를 집계한다.

### Sliding window

#### 1. Count-based sliding window

- count-based sliding window는 N개의 measurements로 구성된 원형 배열로 구현된다.
    - count window size가 10일 때 원형 배열은 항상 10개의 measurements를 가진다.
- total aggregation은 새로운 호출 결과가 기록될 때 마다 업데이트된다.
    - 가장 오래된 measurements가 원형 배열에서 빠지면 해당 measurement는 total aggregation에서 차감되고 버킷이 재설정 된다.
- 집계 데이터는 호출 결과가 기록될 때 마다 매번 업데이트되므로 집계된 스냅샷을 가져오는 연산의 시간 복잡도는 `O(1)`
- N개의 measurement를 저장해야하므로 공간 복잡도는 `O(N)`

#### 2. Time-based sliding window

- time-based sliding window는 N개의 partial aggregation로 구성된 원형 배열로 구현된다.
    - time window size가 10초라면 원형 배열은 항상 10개의 partial aggregations(`bucket`)를 가진다.
- 모든 bucket은 특정 epoch second에 발생한 모든 호출 결과를 집계한다.
    - head bucket은 현재 epoch second의 모든 호출 결과를 저장하고 있고 다른 bucket들은 이전 seconds의 모든 호출 결과를 저장한다.
    - 각 bucket의 호출 결과들을 `tuples`라고 한다.
- total aggregation이 업데이트되고 차감되는 방식은 count-based와 동일하므로 스냅샷 가져오는 시간 복잡도 또한 동일하다.
- N개의 bucket을 가지고 해당 bucket에 tuples이 존재하므로 공간복잡도는 조금 다를 수 있으나 tuples은 개별적으로 저장되지 않게 구성되어 있으므로 무시할 수 있어 거의 O(N)으로 봐도 무방하다.
- bucket은 실패한 호출 수, 느린 호출 수, 총 호출 수를 저장하기 위한 3개의 integer와 전체 기간을 저장하기 위한 1개의 long으로 구성된다.

### Failure rate and slow call rate thresholds

- CircuitBreaker의 상태는 `failure rate`가 `configurable threshold(failureRateThreshold)` 값보다 크거나 같을 때 `CLOSED`에서 `OPEN`으로 변경
- 기존적으로 모든 예외는 실패로 카운트
    - 특정 예외를 정의하면 지정된 예외만 실패로 카운트
- CircuitBreaker의 상태는 `slow call rate`가 `configurable threshold(slowCallRateThreshold)` 값보다 크거나 같을 때 `CLOSED`에서 `OPEN`으로 변경
    - 이 방식은 외부 시스템이 실제로 다운되기 전에 부하를 줄이데 유용하다.
- **failure rate와 slow call rate을 계산하기 위해선 최소한의 호출 기록이 저장되어야 한다.**
    - 모든 호출이 실패하더라도 `최소 호출 수(minimumNumberOfCalls)`가 기록되지 않으면 CircuitBreaker는 동작하지 않는다.
- CircuitBreaker는 상태가 **`OPEN`일 때 CallNotPermittedException로 호출을 거부한다.**
    - 대기 시간이 지난 후(waitDurationInOpenState)에 `OPEN`에서 `HALF_OPEN`으로 변경되고 설정된 수(permittedNumberOfCallsInHalfOpenState) 만큼 외부 시스템에 호출이 다시 가능해진다.
    - 만약 여전히 외부 시스템이 failure rate or slow call rate가 threshold값보다 크거나 같다면 `OPEN` 상태가 되고 그렇지 않으면 `CLOSED` 상태가 된다.
- CircuitBreaker의 두개의 special states는 `DISABLED(always allow access)` and `FORCED_OPEN(always deny access)`로 구성되어 있고 해당 상태에서는 이벤트가 생성되지 않고 메트릭이 기록되지 않는다.

**CircuitBreaker는 thread-safe하다.**
- CircuitBreaker의 상태는 AutomicReference를 활용하므로 side-effect가 없다.
- 호출을 기록하고 스냅샷을 읽어들이는 동작은 Sliding Window에서 동기화된다.

> thread-safe하므로 특정 시점에 하나의 스레드에서만 CircuitBreaker의 상태 및 sliding window를 업데이트 할 수 있다.

**CircuitBreaker는 함수 호출을 동기화하지 않는다.**
- 함수 호출을 동기화하게 되면 심각한 성능 저하가 발생 할 수 있기 때문에 CircuitBreaker는 thread-safe하지만 함수 호출을 동기화 하진 않는다.
    - 만약 3개의 스레드가 동시에 CircuitBreaker 상태 변경을 시도하게 되면 모든 요청은 허용된다.(아래 flow 참고)
    - Bulkhead를 활용하면 스레드를 제어할 수 있다.

**Example with 3 Threads**

![circuitbreadker-flow](./resilience4j/circuitbreadker-flow-with-3threds.png)

### CircuitBreakerConfig Examples
```java
CircuitBreakerConfig.custom()
                    .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                    .slidingWindowSize(100) // 최대 100개의 호출을 기록하여 집계
                    .minimumNumberOfCalls(10) // 최소 10번은 호출되어야 CircuitBreaker가 작동
                    .failureRateThreshold(30) // 기록된 호출 중 30%가 실패하면 circuit open
                    .recordExceptions(RuntimeException.class) // RunTimeException만 기록
                    .ignoreExceptions(NullPointerException.class) // NullPointerException은 무시
                    .waitDurationInOpenState(Duration.ofSeconds(30)) // circuit이 open되면 30초 동안 유지 후 half-open으로 전환
                    .build();
```
- 호출 수가 minimumNumberOfCalls(10)에 도달한 순간 부터 failureRate를 계산하여 circuit을 전환할 지 판단하고 slidingWindowSize만큼의 호출 수만 기록하여 집계.

```java
CircuitBreakerConfig.custom()
                    .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.TIME_BASED)
                    .slidingWindowSize(10) // 최근 10초 동안 발생한 호출을 기록하여 집계
                    .minimumNumberOfCalls(50) // 최소 50번은 호출되어야 CircuitBreaker가 작동
                    .failureRateThreshold(30) // 기록된 호출 중 30%가 실패하면 circuit open
                    .slowCallRateThreshold(20) // 기록된 호출 중 20%가 slow call이면 circuit open
                    .slowCallDurationThreshold(Duration.ofSeconds(3)) // 호출이 3초 이상 걸리면 slow call
                    .build();
```
- TIME_BASED의 경우 slidingWindowSize초 동안 발생한 호출을 기록하여 집계하기 때문에 위 예시에서 만약 10초 동안 발생하는 호출 수가 minimumNumberOfCalls(50)보다 작다면 minimumNumberOfCalls가 만족되지 않아 모든 호출이 실패해도 circuit은 열리지 않음.

### 학습 테스트

```java
@ExtendWith(MockitoExtension.class)
public class CircuitBreakerTest {

  public static class SimpleCaller {
    public String getHello() {
      return "hello";
    }

    public String throwNPE() {
      throw new NullPointerException();
    }
  }

  private final SimpleCaller simpleCaller = Mockito.spy(SimpleCaller.class);
  private final CircuitBreakerConfig circuitBreakerConfig = CircuitBreakerConfig.custom()
          .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
          .slidingWindowSize(100) // 최대 100개의 호출을 기록하여 failureRate를 계산
          .minimumNumberOfCalls(10) // 최소 10번은 호출되어야 CircuitBreaker가 작동
          .failureRateThreshold(30) // failure rate는 30%로 설정
          .build();
  private final CircuitBreaker circuitBreaker = CircuitBreaker.of("custom", circuitBreakerConfig);

  @Test
  @DisplayName("CircuitBreaker는 호출 수가 minimumNumberOfCalls가 넘은 경우에만 동작해야 한다.")
  void minimumNumberOfCallsTest() throws Exception {
    // when & then
    int minimumCallSize = 10;
    for (int i = 0; i < minimumCallSize; i++) {
      try {
        circuitBreaker.decorateSupplier(simpleCaller::throwNPE).get();
      } catch (Exception e) {
        assertThat(e)
                .as("minimumCallSize 까지는 NPE 발생")
                .isInstanceOf(NullPointerException.class);
      }
    }

    for (int i = 0; i < 5; i++) {
      try {
        circuitBreaker.decorateSupplier(simpleCaller::throwNPE).get();
      } catch (Exception e) {
        assertThat(e)
                .as("CircuitBreaker가 작동되어 CallNotPermittedException 발생")
                .isInstanceOf(CallNotPermittedException.class);
      }
    }

    // circuit breaker가 작동되어 operator.throwNPE()는 10번만 호출되어야 한다.
    verify(simpleCaller, times(10)).throwNPE();
  }

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

## 참고 자료
[Circuit Breaker Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
[resilience4j CircuitBreaker docs](https://resilience4j.readme.io/docs/circuitbreaker)
