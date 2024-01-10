---
title: resilience4j CircuitBreaker의 COUNT_BASED, TIME_BASED 동작 방식 살펴보기
date: 2024-01-09 22:08 
img:
  - circuit_breaker.png 
tags:
  - Design
  - Java
---

resilience4j CircuitBreaker에는 Sliding window를 COUNT_BASED 혹은 TIME_BASED로 Circuit을 구성할 수 있다. ([resilience4j Circuit Breaker 살펴보기](https://pompitzz.github.io/blog/Java/CircuitBreaker.html#resilience4j-circuit-breaker))

시스템에서 기존에 사용중이던 COUNT_BASED CircuitBreaker를 TIME_BASED로 개선하면서 두 방식에 성능 차이가 있는지 궁금증이 생겼다.

공식 문서에 두 방식 모두 시간 복잡도는 O(1)이고 공간 복잡도는 O(windowSize)라고 나와있지만 직접 구현 코드를 분석하면서 이해해보자.

우선 resilience4j CircuitBreakers는 StateMachine([CircuitBreakerStateMachine](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-circuitbreaker/src/main/java/io/github/resilience4j/circuitbreaker/internal/CircuitBreakerStateMachine.java#L55)) 패턴으로 구현되어 있다. 

`CircuitBreakerStateMachine` 내부에 각 State들이 inner class로 구현되어 있고 해당 State들은 실제 Circuit이 임계치를 초과했는지 계산을 담당하는 `CircuitBreakerMetrics`를 의존한다. `CircuitBreakerMetrics`부터 살펴보자.

## CircuitBreakerMetrics
```java
class CircuitBreakerMetrics implements CircuitBreaker.Metrics {

    private final Metrics metrics;
    private final float failureRateThreshold;
    private final float slowCallRateThreshold;
    private final long slowCallDurationThresholdInNanos;
    private final LongAdder numberOfNotPermittedCalls;
    private int minimumNumberOfCalls;

    private CircuitBreakerMetrics(int slidingWindowSize,
                                  CircuitBreakerConfig.SlidingWindowType slidingWindowType,
                                  CircuitBreakerConfig circuitBreakerConfig,
                                  Clock clock) {
        if (slidingWindowType == CircuitBreakerConfig.SlidingWindowType.COUNT_BASED) {
            this.metrics = new FixedSizeSlidingWindowMetrics(slidingWindowSize);
            this.minimumNumberOfCalls = Math
                    .min(circuitBreakerConfig.getMinimumNumberOfCalls(), slidingWindowSize);
        } else {
            this.metrics = new SlidingTimeWindowMetrics(slidingWindowSize, clock);
            this.minimumNumberOfCalls = circuitBreakerConfig.getMinimumNumberOfCalls();
        }
        this.failureRateThreshold = circuitBreakerConfig.getFailureRateThreshold();
        this.slowCallRateThreshold = circuitBreakerConfig.getSlowCallRateThreshold();
        this.slowCallDurationThresholdInNanos = circuitBreakerConfig.getSlowCallDurationThreshold()
                .toNanos();
        this.numberOfNotPermittedCalls = new LongAdder();
    }
}
```
- [CircuitBreakerMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-circuitbreaker/src/main/java/io/github/resilience4j/circuitbreaker/internal/CircuitBreakerMetrics.java#L48-L55)
- `14~21` 라인의 생성자 코드를 보면 `slidingWindowType` 타입에 따라 적합한 `Metrics` 구현체를 생성한다. 
- COUNT_BASED의 경우 `FixedSizeSlidingWindowMetrics`를 TIME_BASED의 경우 `SlidingTimeWindowMetrics`를 사용하며 해당 구현체들에서 `slidingWindowType`에 따라 호출 정보를 집계하는 로직을 가지고 있다. 

```java
class CircuitBreakerMetrics implements CircuitBreaker.Metrics {

    public Result onSuccess(long duration, TimeUnit durationUnit) {
        Snapshot snapshot;
        if (durationUnit.toNanos(duration) > slowCallDurationThresholdInNanos) {
            snapshot = metrics.record(duration, durationUnit, Outcome.SLOW_SUCCESS);
        } else {
            snapshot = metrics.record(duration, durationUnit, Outcome.SUCCESS);
        }
        return checkIfThresholdsExceeded(snapshot);
    }
    
    public Result onError(long duration, TimeUnit durationUnit) {
        Snapshot snapshot;
        if (durationUnit.toNanos(duration) > slowCallDurationThresholdInNanos) {
            snapshot = metrics.record(duration, durationUnit, Outcome.SLOW_ERROR);
        } else {
            snapshot = metrics.record(duration, durationUnit, Outcome.ERROR);
        }
        return checkIfThresholdsExceeded(snapshot);
    }
    
    private Result checkIfThresholdsExceeded(Snapshot snapshot) {
        float failureRateInPercentage = getFailureRate(snapshot);
        float slowCallsInPercentage = getSlowCallRate(snapshot);
    
        if (failureRateInPercentage == -1 || slowCallsInPercentage == -1) {
            return Result.BELOW_MINIMUM_CALLS_THRESHOLD;
        }
        if (failureRateInPercentage >= failureRateThreshold
                && slowCallsInPercentage >= slowCallRateThreshold) {
            return Result.ABOVE_THRESHOLDS;
        }
        if (failureRateInPercentage >= failureRateThreshold) {
            return Result.FAILURE_RATE_ABOVE_THRESHOLDS;
        }
    
        if (slowCallsInPercentage >= slowCallRateThreshold) {
            return Result.SLOW_CALL_RATE_ABOVE_THRESHOLDS;
        }
        return Result.BELOW_THRESHOLDS;
    }
}
```
- [CircuitBreakerMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-circuitbreaker/src/main/java/io/github/resilience4j/circuitbreaker/internal/CircuitBreakerMetrics.java#L105-L156)
- `CircuitBreakerMetrics`에는 CircuitBreaker에서 호출되는 함수가 성공, 실패할 때마다 호출되는 `onSuccess`, `onError`메서드가 있다. 
- 해당 메서드에서 `Metrics`의 `record`메서드를 호출하여 `Snapshot` 정보를 얻는다. 그리고 `Snapshot`으로 현재 Circuit이 Threshold를 초과했는지에 대한 결과를 구한다.
  - 해당 `Snapshot`에는 총 호출 수, 실패 비율, 느린 호출 비율 등 Circuit의 상태를 결정하기 위해 필요한 다양한 호출정보를 가지고 있다. 
- 먼저 COUNT_BASED에서 사용되는 `FixedSizeSlidingWindowMetrics`를 살펴보자.

## FixedSizeSlidingWindowMetrics(COUNT_BASED)
```java
public class FixedSizeSlidingWindowMetrics implements Metrics {

    private final int windowSize;
    private final TotalAggregation totalAggregation;
    private final Measurement[] measurements;
    int headIndex;

    /**
     * Creates a new {@link FixedSizeSlidingWindowMetrics} with the given window size.
     *
     * @param windowSize the window size
     */
    public FixedSizeSlidingWindowMetrics(int windowSize) {
        this.windowSize = windowSize;
        this.measurements = new Measurement[this.windowSize];
        this.headIndex = 0;
        for (int i = 0; i < this.windowSize; i++) {
            measurements[i] = new Measurement();
        }
        this.totalAggregation = new TotalAggregation();
    }
}
```
- [FixedSizeSlidingWindowMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/FixedSizeSlidingWindowMetrics.java#L39-L59)
- `FixedSizeSlidingWindowMetrics`생성자에서 `slidingWindowSize`를 파라미터로 받아 windowSize 만큼의 `Measurement` 배열과 `TotalAggreation`을 생성한다.
  - 여기서 COUNT_BASED의 공간 복잡도는 windowSize의 배열을 가지므로 `O(windowSize)`인 것을 알 수 있다.
- 그리고 `headIndex`는 `Measurement` 배열을 조회하기 위한 인덱스로 사용된다. 추후 구현 로직을 살펴볼때 자세히 볼 수 있다. 
- 측정 값들와 집계 정보를 표현하기 위해 사용되는 `Measurement`, `TotalAggreation`를 살펴보자.

```java
class AbstractAggregation {

  long totalDurationInMillis = 0;
  int numberOfSlowCalls = 0;
  int numberOfSlowFailedCalls = 0;
  int numberOfFailedCalls = 0;
  int numberOfCalls = 0;

  void record(long duration, TimeUnit durationUnit, Metrics.Outcome outcome) {
    this.numberOfCalls++;
    this.totalDurationInMillis += durationUnit.toMillis(duration);
    switch (outcome) {
      case SLOW_SUCCESS:
        numberOfSlowCalls++;
        break;

      case SLOW_ERROR:
        numberOfSlowCalls++;
        numberOfFailedCalls++;
        numberOfSlowFailedCalls++;
        break;

      case ERROR:
        numberOfFailedCalls++;
        break;

      default:
        break;
    }
  }
}

class Measurement extends AbstractAggregation {

  void reset() {
    this.totalDurationInMillis = 0;
    this.numberOfSlowCalls = 0;
    this.numberOfFailedCalls = 0;
    this.numberOfSlowFailedCalls = 0;
    this.numberOfCalls = 0;
  }

}

class TotalAggregation extends AbstractAggregation {

  void removeBucket(AbstractAggregation bucket) {
    this.totalDurationInMillis -= bucket.totalDurationInMillis;
    this.numberOfSlowCalls -= bucket.numberOfSlowCalls;
    this.numberOfSlowFailedCalls -= bucket.numberOfSlowFailedCalls;
    this.numberOfFailedCalls -= bucket.numberOfFailedCalls;
    this.numberOfCalls -= bucket.numberOfCalls;
  }
}
```
- [AbstractAggregation git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/AbstractAggregation.java#L23-L30), [Measurement git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/Measurement.java#L21C6-L21C6), [TotalAggregation git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/TotalAggregation.java#L21C6-L21C6)
- `Measurement`, `TotalAggreation`는 다양한 호출 정보를 가진 `AbstractAggregation`를 상속하고 있다. 그리고 `record`메서드를 통해 입력에 따라 호출 정보를 업데이트하고 있다.
- 그럼 `FixedSizeSlidingWindowMetrics`는 어떻게 Aggregation들을 업데이트할까? 

```java
public class FixedSizeSlidingWindowMetrics implements Metrics {

  @Override
  public synchronized Snapshot record(long duration, TimeUnit durationUnit, Outcome outcome) {
    totalAggregation.record(duration, durationUnit, outcome);
    moveWindowByOne().record(duration, durationUnit, outcome);
    return new SnapshotImpl(totalAggregation);
  }

  private Measurement moveWindowByOne() {
    moveHeadIndexByOne();
    Measurement latestMeasurement = getLatestMeasurement();
    totalAggregation.removeBucket(latestMeasurement);
    latestMeasurement.reset();
    return latestMeasurement;
  }

  private Measurement getLatestMeasurement() {
    return measurements[headIndex];
  }

  void moveHeadIndexByOne() {
    this.headIndex = (headIndex + 1) % windowSize;
  }
}
```
- [FixedSizeSlidingWindowMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/FixedSizeSlidingWindowMetrics.java#L62-L78)
- `FixedSizeSlidingWindowMetrics.record`메서드에서 먼저 `totalAggreation`을 업데이트한다. 
- 그 다음 `moveWindowByOne`메서드에서 `headIndex`를 앞으로 한칸 옮겨 배열에서 가장 최신의 `Measurement`를 가져온다. 
  - 배열은 원형 배열로 사용되기 때문에 가져온 `Measurement`에는 이전에 사용된 값이 들어 있을 수 있다. 
  - 그러므로 우선 `totalAggregation`에서 이전 측정값을 제거하여 `totalAggration`이 최신의 데이터를 가지고 있음을 보장하고 또한 `measurement.reset`을 호출하여 값을 초기화한다.
- 가져온 `Measurement`도 `totalAggreation`와 동일하게 `record`를 호출하여 업데이트하고 `TotalAggregation`을 기반으로 `Snapshot`을 생성하여 `CircuitBreakerMetrics`에게 전달해준다.
- 이를 통해 COUNTED_BASED에서 `Snaoshot`을 계산하는 코드의 시간 복잡도가 `O(1)`것을 알 수 있다. 
  - 그리고 해당 함수는 `synchronized` 메서드이므로 동시성 이슈가 발생하지 않을 것이다.
- COUNTED_BASED에서 사용되는 `FixedSizeSlidingWindowMetrics`는 시간 복잡도가 `O(1)`, 공간 복잡도가 `O(windowSize)`인 것을 확인했다.
- TIME_BASED에서 사용되는 `SlidingTimeWindowMetrics`는 어떨까?

## SlidingTimeWindowMetrics(TIME_BASED)
```java
public class SlidingTimeWindowMetrics implements Metrics {

  final PartialAggregation[] partialAggregations;
  private final int timeWindowSizeInSeconds;
  private final TotalAggregation totalAggregation;
  private final Clock clock;
  int headIndex;

  public SlidingTimeWindowMetrics(int timeWindowSizeInSeconds, Clock clock) {
    this.clock = clock;
    this.timeWindowSizeInSeconds = timeWindowSizeInSeconds;
    this.partialAggregations = new PartialAggregation[timeWindowSizeInSeconds];
    this.headIndex = 0;
    long epochSecond = clock.instant().getEpochSecond();
    for (int i = 0; i < timeWindowSizeInSeconds; i++) {
      partialAggregations[i] = new PartialAggregation(epochSecond);
      epochSecond++;
    }
    this.totalAggregation = new TotalAggregation();
  }
}

public class PartialAggregation extends AbstractAggregation {

  private long epochSecond;

  PartialAggregation(long epochSecond) {
    this.epochSecond = epochSecond;
  }

  void reset(long epochSecond) {
    this.epochSecond = epochSecond;
    this.totalDurationInMillis = 0;
    this.numberOfSlowCalls = 0;
    this.numberOfFailedCalls = 0;
    this.numberOfSlowFailedCalls = 0;
    this.numberOfCalls = 0;
  }
}
```
- [SlidingTimeWindowMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/SlidingTimeWindowMetrics.java#L46-L71)
- `SlidingTimeWindowMetrics`생성자는 `slidingWindowSize`를 파라미터로 받아서 windowSize 만큼의 `PartialAggregation` 배열과 `TotalAggreation`을 생성한다.
  - 배열에서 사용되는 구현체가 `PartialAggregation`인것을 제외하면 `FixedSizeSlidingWindowMetrics`와 유사하다.
  - `PartialAggregation`는 `TotalAggreation`, `Measurement`과 동일하게 `AbstractAggregation`를 상속하고 있다.
  - TIME_BASED에서는 시간 기반으로 집계를 해야하므로 `epochSecond` 필드가 필요하기 때문에 `Measurement`대신 `PartialAggregation`를 사용하는 것으로 파악된다. 
- 이를 통해 TIME_BASED 또한 공간 복잡도는 `O(windowSize)`인 것을 알 수 있다.
- 그리고 시간 계산을 위한 `Clock`은 기본적으로 `Clock.systemUTC()`를 사용한다.
- 그럼 `SlidingTimeWindowMetrics`의 구현 로직을 살펴보자.

```java
public class SlidingTimeWindowMetrics implements Metrics {

  @Override
  public synchronized Snapshot record(long duration, TimeUnit durationUnit, Outcome outcome) {
    totalAggregation.record(duration, durationUnit, outcome);
    moveWindowToCurrentEpochSecond(getLatestPartialAggregation())
            .record(duration, durationUnit, outcome);
    return new SnapshotImpl(totalAggregation);
  }

  private PartialAggregation moveWindowToCurrentEpochSecond(
          PartialAggregation latestPartialAggregation) {
    long currentEpochSecond = clock.instant().getEpochSecond();
    long differenceInSeconds = currentEpochSecond - latestPartialAggregation.getEpochSecond();
    if (differenceInSeconds == 0) {
      return latestPartialAggregation;
    }
    long secondsToMoveTheWindow = Math.min(differenceInSeconds, timeWindowSizeInSeconds);
    PartialAggregation currentPartialAggregation;
    do {
      secondsToMoveTheWindow--;
      moveHeadIndexByOne();
      currentPartialAggregation = getLatestPartialAggregation();
      totalAggregation.removeBucket(currentPartialAggregation);
      currentPartialAggregation.reset(currentEpochSecond - secondsToMoveTheWindow);
    } while (secondsToMoveTheWindow > 0);
    return currentPartialAggregation;
  }

  private PartialAggregation getLatestPartialAggregation() {
    return partialAggregations[headIndex];
  }
  
  void moveHeadIndexByOne() {
    this.headIndex = (headIndex + 1) % timeWindowSizeInSeconds;
  }
}
```
- [SlidingTimeWindowMetrics git](https://github.com/resilience4j/resilience4j/blob/e77f3536ac9b6c4764b1b8ac3dae0bca540768e4/resilience4j-core/src/main/java/io/github/resilience4j/core/metrics/SlidingTimeWindowMetrics.java#L74-L128)
- `SlidingTimeWindowMetrics`의 구현 로직은 단순히 COUNT 기반이 아닌 현재 시간을 기준으로 계산을 해야하기 때문에 `FixedSizeSlidingWindowMetrics`보다 약간 더 복잡하다.  
- 우선 `totalAggregation`를 업데이트하고 배열의 index를 최신으로 이동시킨 후 최신의 `PartialAggregation`를 가져와서 업데이트하는 큰 흐름은 `FixedSizeSlidingWindowMetrics`와 동일하다.
- `moveWindowToCurrentEpochSecond`메서드에서 먼저 가장 최신의 `PartialAggregation.getEpochSecond()`와 `currentEpochSecond`의 `diffSeconds`를 구한다. 이는 마지막으로 호출을 하고나서 몇초가 흘렀는지 확인하기 위함이다.
- diff가 0이라면:
  - 해당 `PartialAggregation`가 현재 '초'를 위한 Aggregation이므로 이를 바로 반환한다.
- diff가 0보다 크다면:
  - 마지막 호출이후 diff초만큼 시간이 흘렀다는 뜻이다. 그러므로 지나간 '초'들에 대한 집계 데이터를 `reset`해줘야 한다.
  - '초'가 아무리 흘렀어도 최대 `windowSize`의 '초'만큼만 집계하므로 `secondsToMoveTheWindow=min(diffSeconds, windowSize)` 값을 기반으로 배열을 순회하여 하나씩 `totalAggregation`에서 제거하고 `partialAggregation.reset`을 호출하여 값을 초기화한다.
  - 예를들어 `windowSize`가 10이고 `diffSeconds`가 15라면 최근 10(windowSize)초에 대해서만 `PartialAggregation` 정보를 가지고 있기 때문에 최대 10번만 `PartialAggregation`를 `reset`해주면 된다.
- 이 메서드는 CiruitBreaker에서 실제 수행되는 함수가 호출된 후에 항상 호출(실패하더라도)되기 때문에 함수의 호출 텀이 1초보다 크지 않는 이상 `diffSeconds`가 1보다 클 가능성은 없다. 그리고 애초에 이런 케이스라면 성능 걱정은 필요없을 것이다.
- 그러므로 TIME_BASED에서도 시간 복잡도가 `O(1)`것을 알 수 있다. 

