---
title: 비동기 호출 시 ThreadLocal 값 유지하기 
date: 2021-05-19 14:12 
img:
    - java.png 
tags:
    - JAVA
---

웹 애플리케이션을 개발하다 보면 하나의 클라이언트 요청에 대해 `애플리케이션 전반에 걸친 특정 Context를 유지`해야 할 필요성이 생긴다. 대표적으로 로깅 정보나 사용자 정보가 있다.

`스프링을 사용하면 request scope 빈`을 사용하면 편리하게 Context를 관리할 수 있지만 구조에 따라 `request scope 빈을 주입하기 어려운 경우`들이 있다.

이때 흔히 사용하는 방안은 `ThreadLocal을 활용`하는 것이다. 하지만 `ThreadLocal은 이름 그대로 Thread별로 값을 유지하기 때문에 비동기 호출 시 해당 값이 유지되지 않는다.`

`데코레이터 패턴을 활용하여` ThreadPoolExecutor.execute에 적용하면 해당 문제를 간단히 해결할 수 있다.

## UserIdHolder 정의

```java

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserIdHolder {
    private final static ThreadLocal<Long> USER_ID_HOLDER = new ThreadLocal<>();

    public static Long getUserId() {
        return USER_ID_HOLDER.get();
    }

    public static void setUserId(Long userId) {
        USER_ID_HOLDER.set(userId);
    }

    public static void clear() {
        USER_ID_HOLDER.remove();
    }
}
```

- 테스트를 위해 ThreadLocald을 통해 UserId 정보를 가지고 있는 UserIdHolder를 정의하였다.

## UserIdHolder 테스트

```java
class UserIdHolderTest {
    @Test
    void UserIdHolder_shouldNotHoldUserId_whenAsyncCall() throws Exception {
        // given
        ThreadPoolExecutor executor = new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>());
        long userId = 1L;

        // when
        UserIdHolder.setUserId(userId);

        // then
        assertThat(UserIdHolder.getUserId()).isEqualTo(userId);
        executor.submit(() -> assertThat(UserIdHolder.getUserId()).isNull()) // 다른 Thread에서 수행되므로 userId는 null이다.
                .get();
    }
}
```
- UserIdHolder는 동일 Thread에서는 userId 값을 유지하고 있으나 ThreadPoolExecutor의 Thread에선 userId 값을 유지하지 않는다. 

## 비동기 호출 시 ThreadLocal 값 유지하기
### 1. RunnableDecorator 정의
```java
interface RunnableDecorator {
    Runnable decorate(Runnable runnable);

    RunnableDecorator USER_ID_HOLDER_RUNNABLE_DECORATOR = (runnable) -> {
        long userId = UserIdHolder.getUserId(); // 기존 thread에서 userId를 가져온다.
        return () -> {
            try {
                UserIdHolder.setUserId(userId); // 새로운 thread에서 가져온 userId를 세팅한다.
                runnable.run();
            } finally {
                UserIdHolder.clear(); // 새로운 thread 작업이 완료되면 ThreadLocal 값을 초기화한다.
            }
        };
    };
}
```
- RunnableDecorator는 Runnable을 파라미터로 받아 Runnable을 반환한다.
- USER_ID_HOLDER_RUNNABLE_DECORATOR는 runnable.run() 전 후에 UserIdHolder값을 세팅 및 초기화 한다.

### 2. 테스트
```java
class UserIdHolderTest {
    @Test
    void UserIdHolder_shouldHoldUserId_whenAsyncCallWithDecorator() throws Exception {
        // given
        ThreadPoolExecutor executor = new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>()) {
            // ThreadPoolExecutor의 모든 비동기 호출 메서드는 execute를 호출하므로 execute만 오버라이드하여 decorator를 적용시켜준다. 
            @Override
            public void execute(Runnable command) { 
                super.execute(USER_ID_HOLDER_RUNNABLE_DECORATOR.decorate(command));
            }
        };

        long userId = 1L;

        // when
        UserIdHolder.setUserId(userId);

        // then
        assertThat(UserIdHolder.getUserId()).isEqualTo(userId);
        // decorator에 의해 userId값이 전파되므로 executor의 thread의 threadLocal도 userId값을 정상적으로 가진다.  
        executor.submit(() -> assertThat(UserIdHolder.getUserId()).isEqualTo(userId)) 
                .get();
    }
}
```
- Decorator를 적용하기 위해 ThreadPoolExecutor의 execute를 오버라이드 한다. 
- ThreadPoolExecutor의 모든 비동기 호출 메서드는 execute를 통하므로 해당 메서드만 오버라이드 하면 Decorator를 적용할 수 있다.
- USER_ID_HOLDER_RUNNABLE_DECORATOR에 의해 userId 값이 전파되므로 테스트는 성공한다.

## Spring ThreadPoolTaskExecutor에 Decorator 적용하기
```java
@Test
void UserIdHolder_shouldHoldUserId_whenAsyncCallWithDecorator2() throws Exception {
    // given
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setTaskDecorator((runnable) -> {
        long userId = UserIdHolder.getUserId();
        return () -> {
            try {
                UserIdHolder.setUserId(userId);
                runnable.run();
            } finally {
                UserIdHolder.clear();
            }
        };
    });
    executor.initialize();

    long userId = 1L;

    // when
    UserIdHolder.setUserId(userId);

    // then
    assertThat(UserIdHolder.getUserId()).isEqualTo(userId);
    executor.submit(() -> assertThat(UserIdHolder.getUserId()).isEqualTo(userId))
            .get();
}
```
- Spring의 ThreadPoolTaskExecutor도 동일한 방식으로 TaskDecorator를 구현하여 Decorator를 적용할 수 있다.
- TaskDecorator는 위에서 정의한 RunnableDecorator와 동일하다.
- ThreadPoolTaskExecutor를 생성한 후 taskDecorator를 설정하면 아래와 같이 내부적으로 ThreadPoolExecutor를 생성할 때 decorate해준다.

```java
// org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
@Override
protected ExecutorService initializeExecutor(
        ThreadFactory threadFactory, RejectedExecutionHandler rejectedExecutionHandler) {

    BlockingQueue<Runnable> queue = createQueue(this.queueCapacity);

    ThreadPoolExecutor executor;
    if (this.taskDecorator != null) {
        executor = new ThreadPoolExecutor(
                this.corePoolSize, this.maxPoolSize, this.keepAliveSeconds, TimeUnit.SECONDS,
                queue, threadFactory, rejectedExecutionHandler) {
            @Override
            public void execute(Runnable command) {
                Runnable decorated = taskDecorator.decorate(command);
                if (decorated != command) {
                    decoratedTaskMap.put(decorated, command);
                }
                super.execute(decorated);
            }
        };
    }
}
```

