---
sidebar: auto
title: Java의 ThreadPoolExecutor, Spring의 ThreadPoolTaskExecutor
date: 2020-09-20 16:55
img: java.png
tags: 
    - JAVA
    - Spring
---
- Java의 ThreadPoolExecutor를 통해 ThreadPool을 설정하는 방법과 Spring의 ThreadPoolTaskExecutor가 ThreadPoolExecutor를 어떻게 활용하는지 알아보겠습니다.

## Java의 ThreadPoolExecutor
- ThreadPool은 애플리케이션의 특징 및 JVM을 구동시키는 하드웨어 사양에 따라 세밀하게 조정이 필요합니다.
- 자바 1.5이후 ExecutorService의 구현체인 ThreadPoolExecutor를 통해 스레드 풀을 직접 설정하여 사용할 수 있습니다.

### ThreadPoolExecutor 생성자
```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
}
```
- corePoolSize
    - 스레드 풀에 계속해서 유지시킬 스레드 개수입니다.
- maximumPoolSize
    - 스레드 풀에 최대한으로 가질 수 있는 스레드 개수입니다.
    - **workQueue가 가득찼을 때 여기서 지정된 숫자로 스레드가 증가하며 workQueue가 가득차지 않으면 스레드 개수는 증가하지 않습니다.**
- keepAliveTime
    - workQueue가 가득차 maximumPoolSize까지 스레드가 개수가 증가한 후 증가된 스레드를 유지시킬 시간을 정의합니다.
- unit
    - keepAliveTime에서 사용한 TimeUnit 타입을 정의합니다.
- workQueue
    - 작업이 corePoolSize를 초과할 때 나머지 작업들을 보관할 BlockingQueue를 정의합니다.
- threadFactory (생략 가능)
    - 스레드 풀에서 스레드를 생성할 때 사용할 threadFactory를 정의합니다.
- handler (생략 가능)
    - 스레드 풀이 가득차 더 이상 작업을 수용할 수 없을 때 사용되는 핸들러를 정의합니다.

> 스레드 풀의 스레드 개수의 증가 절차는 `corePoolSize 증가 -> workQueue가 가득찰 때 까지 queue에 추가 -> maximumPoolSize 증가`입니다.
 
### Executors 팩토리를 활용하여 ThreadPoolExecutor 생성하기
- Java에서 제공하는 Executors 팩토리에는 ThreadPoolExecutor를 이용한 팩토리 메서드들을 제공합니다.

#### Executors.newFixedThreadPool
```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```
- newFixedThreadPool은 메서드 명와 동일하게 고정된 크기의 스레드 풀을 생성할 수 있습니다.
- 해당 메서드는 작업 큐를 크기가 제한되지 않은 LinkedBlokingQueue로 지정했기 때문에 위의 사실상 maximumPoolSize는 사용되지 않습니다.
- 즉 작업이 계속해서 들어오더라도 지정된 스레드 개수만큼 스레드가 증가하고 그 이후에 작업 큐에 계속해서 작업이 쌓이게 됩니다.

#### 동작 확인
```java
// 100ms 만큼 block되는 작업
private Runnable getTask() {
    return () -> {
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    };
}

// threadPool를 종료하고 모든 작업이 끝날 때 까지 기다린다.
private void shutDownAndWaitUntilTerminated(ExecutorService executorService) {
    try {
        executorService.shutdown();
        executorService.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}

@Test
void testFixedThreadPool() throws Exception {
    ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(5);

    // 100개의 작업을 수행
    IntStream.range(0, 100).forEach(i -> threadPoolExecutor.execute(getTask()));

    int poolSize = threadPoolExecutor.getPoolSize();
    int queueSize = threadPoolExecutor.getQueue().size();

    assertThat(poolSize).isEqualTo(5);
    assertThat(queueSize).isEqualTo(95);

    String message = String.format("CurrentPoolSize: %s, WorkQueueSize: %s", poolSize, queueSize);
    System.out.println(message);

    shutDownAndWaitUntilTerminated(threadPoolExecutor);
}

// 촐력결과 -> CurrentPoolSize: 5, WorkQueueSize: 95
```
- 5개의 고정된 스레드 풀을 할당하였으므로 100개의 작업을 동시에 실행하더라도 나머지 95개의 작업은 작업 큐에 쌓이는 것을 확인할 수 있습니다.

> newFixedThreadPool는 workQueue 사이즈가 제한되지 않기 때문에 작업이 계속해서 들어온다면 메모리 초과가 발생할 수 있으므로 상용에서 사용하기엔 무리가 있습니다.

#### Executors.newCachedThreadPool
```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```
- newCachedThreadPool은 corePoolSize를 0개로 지정하고, maximumPoolSize를 Integer.MAX_VALUE입니다.
- 즉 작업이 계속 추가되면 Integer.MAX_VALUE까지 스레드는 계속해서 늘어날 수 있습니다.
    - 늘어난 스레드는 keepAliveTime에 지정된 만큼 60초동안 유지된 후 제거됩니다.
- 그리고 workQueue는 SynchronousQueue로 지정된 것을 알 수 있는데 SynchronousQueue는 이름을 Queue이지만 기존 Queue와는 다르게 들어오는 작업을 즉시 작업 스레드에게 넘겨줍니다.
- 그러므로 작업이 계속해서 추가되면 SynchronousQueue는 스레드에게 작업을 즉시 넘겨주게 되므로 스레드 풀의 스레드는 계속해서 늘어나게 됩니다.

#### 동작 확인
```java
@Test
void testCachedThreadPool() throws Exception {
    ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newCachedThreadPool();

    IntStream.range(0, 1000).forEach(i -> threadPoolExecutor.execute(getTask()));

    int poolSize = threadPoolExecutor.getPoolSize();
    int queueSize = threadPoolExecutor.getQueue().size();

    assertThat(poolSize).isEqualTo(1000);
    assertThat(queueSize).isEqualTo(0);

    TimeUnit.SECONDS.sleep(65);

    // keepAlive 시간이후엔 스레드들이 제거된다.
    assertThat(threadPoolExecutor.getPoolSize()).isEqualTo(0);

    shutDownAndWaitUntilTerminated(threadPoolExecutor);
}
```
- newCachedThreadPool를 활용하여 1000개의 작업을 동시에 수행시키면 즉시 poolSize는 1000개까지 증가하여 작업을 수행합니다.
- 그리고 keepAliveTime이 60초이므로 그 이후엔 추가기된 스레드는 제거됩니다.

> newCachedThreadPool은 작업이 계속해서 들어온다면 스레드 풀의 스레드 개수를 거의 무제한으로 증가시키기 때문에 상용에서 사용하기엔 무리가 있습니다.  

### ThreadPoolExecutor 직접 생성하기
```java
ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 15, 5, TimeUnit.SECONDS, new LinkedBlockingDeque<>(5));
```
- corePoolSize 5개, maximumPoolSize 15개, queueSize 5개로 제한된 ThreadPoolExecutor를 이용하여 ThreadPoolExecutor가 어떻게 동작하는지 확인해보겠습니다.
- 그리고 keepAliveTime은 5초로 주겠습니다.

#### 10개의 작업이 동시에 수행될 때
```java
@Test
void testCustomThreadPoolWithTenTasks() throws Exception {
    ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 15, 5, TimeUnit.SECONDS, new LinkedBlockingDeque<>(5));

    IntStream.range(0, 10).forEach(i -> threadPoolExecutor.execute(getTask()));

    int poolSize = threadPoolExecutor.getPoolSize();
    int queueSize = threadPoolExecutor.getQueue().size();

    assertThat(poolSize).isEqualTo(5);
    assertThat(queueSize).isEqualTo(5);

    shutDownAndWaitUntilTerminated(threadPoolExecutor);
}
```
- 10개의 작업이 동시에 수행되면 corePoolSize(5)만큼 작업이 동시에 수행되고, 나머지 5개는 workQueue에 쌓이게 됩니다.

#### 20개의 작업이 동시에 수행될 때
```java
@Test
void testCustomThreadPoolWithTwentyTasks() throws Exception {
    ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 15, 5, TimeUnit.SECONDS, new LinkedBlockingDeque<>(5));

    IntStream.range(0, 20).forEach(i -> threadPoolExecutor.execute(getTask()));

    int poolSize = threadPoolExecutor.getPoolSize();
    int queueSize = threadPoolExecutor.getQueue().size();

    assertThat(poolSize).isEqualTo(15);
    assertThat(queueSize).isEqualTo(5);

    TimeUnit.SECONDS.sleep(6);

    // keepAlive 시간이후엔 corePoolSize만큼 돌아온다.
    assertThat(threadPoolExecutor.getPoolSize()).isEqualTo(5);

    shutDownAndWaitUntilTerminated(threadPoolExecutor);
}
```
- 20개의 작업을 동시에 수행하면 corePoolSize(5)만큼 작업이 동시에 수행되고 나머지 15개는 workQueue에 쌓으려고 하지만 queueSize는 5이므로 maximumPoolSize까지 threadPool이 증가됩니다.
- 그리고 keepAliveTime(5초)이 지나면 poolSize는 corePoolSize만큼 돌아오게 됩니다.

#### 30개의 작업이 동시에 수행될 때
```java
@Test
void testCustomThreadPoolWithThirtyTasks() throws Exception {
    ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 15, 5, TimeUnit.SECONDS, new LinkedBlockingDeque<>(5));

    // RejectedExecutionException 발생
    Assertions.assertThrows(RejectedExecutionException.class, () -> {
        IntStream.range(0, 30).forEach(i -> threadPoolExecutor.execute(getTask()));
    });
}
```
- 30개의 작업이 동시에 수행되면 maximumPoolSize + queueSize = 20개이므로 스레드 풀이 수용할 수 있는 최대 작업수를 초과하게되어 RejectedExecutionHandler가 동작하게 됩니다.
- ThreadPoolExecutor 생성 시 따로 RejectedExecutionHandler를 정의하지 않으면 DefaultHandler로 ThreadPoolExecutor.AbortPolicy가 사용되며 해당 핸들러는 RejectedExecutionException를 발생시킵니다. 


## Spring의 ThreadPoolTaskExecutor
```java
public class ThreadPoolTaskExecutor extends ExecutorConfigurationSupport
		implements AsyncListenableTaskExecutor, SchedulingTaskExecutor {

    private int corePoolSize = 1;
    private int maxPoolSize = Integer.MAX_VALUE;
    private int keepAliveSeconds = 60;
    private int queueCapacity = Integer.MAX_VALUE;

    @Override
    protected ExecutorService initializeExecutor(ThreadFactory threadFactory, RejectedExecutionHandler rejectedExecutionHandler) {
        // BlockingQueue 생성
        BlockingQueue<Runnable> queue = createQueue(this.queueCapacity);

        // 생략 ...
    
        // ThreadPoolExecutor 생성
        executor = new ThreadPoolExecutor(
                this.corePoolSize, this.maxPoolSize, this.keepAliveSeconds, TimeUnit.SECONDS,
                queue, threadFactory, rejectedExecutionHandler);

        // 생략 ...
        return executor;
    }
}
```
- ThreadPoolExecutor에 더하여 모니터링 등 다양한 기능을 제공하는 Spring ThreadPoolTaskExecutor도 내부적으로 ThreadPoolExecutor를 생성하여 사용하고 있습니다.

```java
@Test
void testThreadPoolTaskExecutor()throws Exception {
    ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
    threadPoolTaskExecutor.setCorePoolSize(5);
    threadPoolTaskExecutor.setQueueCapacity(5);
    threadPoolTaskExecutor.setMaxPoolSize(15);
    threadPoolTaskExecutor.setKeepAliveSeconds(5);
}
```
- 이렇게 ThreadPoolTaskExecutor를 생성한다면 위에서 생성한 ThreadPoolExecutor와 동일하게 설정할 수 있습니다.
- ThreadPoolExecutor와 다른점은 Queue을 직접 생성하지 않고 QueueCapacity만 지정하는 것인데요.


```java
// ThreadPoolTaskExecutor의 createQueue
protected BlockingQueue<Runnable> createQueue(int queueCapacity) {
    if (queueCapacity > 0) {
        return new LinkedBlockingQueue<>(queueCapacity);
    }
    else {
        return new SynchronousQueue<>();
    }
}
```
- 큐를 생성하는 메서드를 확인해보면 지정된 QueueCapacity가 0보다 크다면 LinkedBlokingQueue를 사용하고, 그렇지 않으면 작업을 즉시 작업 스레드에게 넘겨주는 SynchronousQueue를 사용하는 것을 알 수 있습니다. 
