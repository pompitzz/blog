---
title: 코틀린 코루틴(Coroutine)
date: 2021-10-31 21:44
img: 
    - kotlin.png
tags: 
    - Kotlin
---


## Coroutines basics
코루틴은 일시 중단 가능한 계산 인스턴스로 코드 블럭을 실행하는 스레드와 개념적으로 비슷하다.

하지만 코루틴은 특정 스레드에 바운딩되는게 아니며, 코루틴은 한 스레드에서 실행을 일시 중단하고 다른 스레드에서 재개할 수 있다.

코루틴을 경량 스레드로 생각할 수 있으나, 몇 가지 중요한 차이점이 있다.

```kotlin
fun main() {
    // runBlocking: 코루틴이 아닌 코드들과의 연결점이 되는 코루틴 빌더로 코드 블럭 내부가 코루틴 스코프가 된다.
    runBlocking {
        //  launch: 블럭 내부의 코드를 새로운 코루틴으로 생성하여 동시에 실행시키는 코루틴 빌더로 코루틴 스코프내에서만 실행될 수 있다.
        launch {
            // delay: 일시 중단하지만 스레드를 차단 시키지 않아, 다른 코루틴이 해당 스레드를 사용할 수 있다.
            delay(1000L)
            println("World!")
        }
        println("Hello")
    }
}
// Hello
// World!
```
- `runBlocking`의 이름이 의미하는 바는 runBlocking 내부의 코루틴들의 실행이 종료 될 때 까지 현재 스레드가(위 기준 메인 스레드) 차단된다는 것을 의미한다.
    - 해당 메서드는 대부분 최상위 애플리케이션에서 코루틴 시작을 위한 어댑터로 사용되거나 테스트로 사용된다.
    
### Structured concurrency
- 코루틴은 structred concurrency 정책을 따르기 때문에 새로운 코루틴은 오직 `CoroutineScope` 내부에서만 실행될 수 있다.
- structred concurrency는 수많은 코루틴이 실행될 때 해당 코루틴들이 손실되거나 누출되지 않음을 보장한다.
    - 외부 스코프는 내부의 모든 코루틴이 완료될 때 까지 완료될 수 없다.
    

### Suspending function
```kotlin
fun main() {
    runBlocking {
        launch {
            doWorld()
        }
        println("Hello")
    }
}

private suspend fun doWorld() {
    delay(1000L) // suspend가 없다면 delay는 실행될 수 없다.
    println("World!")
}
```
- suspend function은 일반 함수 처럼 코루틴 내부에서 사용될 수 있는 함수로 `delay`와 같은 추가적인 기능을 제공한다.

### Scope builder
```kotlin
fun main() {
    runBlocking {
        doWorld()
        println("Done") // 가자 마지막에 출력(doWorld가 종료된 후에 실행되므로)
    }
}

private suspend fun doWorld() {
    coroutineScope {
        launch {
            delay(1000L)
            println("World 1") // 1초 딜레이 후 출력 
        }
        launch {
            delay(2000L)
            println("World 2") // 2초 딜레이 후 출력
        }
        println("Hello") // 가장 먼저 출력(launch 블럭은 새로운 코루틴에 의해 실행되므로)
    }
}
```
- 코루틴 스코프를 만들기 위해 `runBlokcing`이 아닌 `coroutinScope`를 사용할 수 있다.
- `runBlokcing`은 현재 스레드를 차단(block)하지만, **`coroutinScope`는 단지 중단(suspend)되기 때문에 현재 스레드를 차단하지 않는다.**

### Coroutines ARE light-weight
```kotlin
fun main() {
    runBlocking {
        repeat(100_000) {
            launch {
                delay(5000L)
                print(".")
            }
        }
    }
    println("done")
}
```
- 해당 코드는 코루틴을 100k개 만들어서 5초 딜레이 후 점을 찍는다. 코루틴은 가볍기 때문에 정상 실행된다.
- 만약 스레드를 사용한다면 Out of Memory가 발생할 것이다.
    - `runBlocking`를 제거하고 `launch` -> `thread`, `delay` -> `Thread.sleep`로 변경하면 스레드로 테스트가 가능하다.

## Cancellation and timeouts
### Cancelling coroutin execution
```kotlin
fun main() {
    runBlocking {
        val job = launch {
            repeat(1000) { i ->
                println("job: sleeping $i")
                delay(500L)
            }
        }
        delay(1000L)
        println("main: cancel job")
        job.cancel() // cancel job
        job.join() // wait for job's completion
        println("main: quit")
    }
}
```
- `cancel` 호출 시 해당 코루틴은 작업은 취소된다. 

### Cancellation is cooperative
```kotlin
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (i < 5) {
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1000)
    println("main: cancel job")
    job.cancelAndJoin()
    println("main: quit")
}
```
- `cancel`을 호출한다고 해서 즉시 해당 코루틴 작업이 취소되는건 아니다.
    - 코루틴이 계산중이고 취소 시그널을 확인하지 못하는 경우엔 취소가 되지 않을 수 있다.
- 위 코드를 실행시켜보면 cancel job이 호출되어도 job이 계속 동작하는 걸 확인할 수 있다.

### Making Computation code cancellable
- 계산중인 코루틴을 중단시키기 위해 2가지 방법이 존재한다.
    - `yield`를 주기적으로 호출하여 취소를 확인할 수 있다.
        - 위 코드에서 while문 안에 해당 함수를 호출하도록 하면 됨.
    - `isActive` flag를 활용하여 취소를 확인할 수 있다.
        - 위 코드에서 `while(i < 5)` -> `while(isActive)`로 변경하면 됨.
    
### Closing resources with finally
```kotlin
fun main() = runBlocking {
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: $i")
                delay(500L)
            }
        } catch (e: CancellationException) {
            println("cancel exception")
        } finally {
            println("finally")
        }

    }
    delay(1000)
    println("main: cancel job")
    job.cancelAndJoin()
    println("main: quit")
}
```
- 코루틴이 취소되면 `CancellationException`이 발생하므로 리소스 해제와 같은 작업이 필요한 경우 `finally` 표현식을 활용할 수 있다.

### Run non-cancellable block
```kotlin
fun main() = runBlocking {
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: $i")
                delay(500L)
            }
        } catch (e: CancellationException) {
            println("cancel exception")
        } finally {
            withContext(NonCancellable) {
                println("start finally")
                // delay 호출 시 withContext(NonCancellable) 내부가 아니라면 예외가 발생 
                delay(1000L)
                println("end finally")
            }
        }

    }
    delay(1000)
    println("main: cancel job")
    job.cancelAndJoin()
    println("main: quit")
}
```
- 코루틴 작업이 취소된 상태에서 `finally` 내부에서 `delay`와 같은 suspending function을 사용하게 되면 예외가 발생하여 finally 코드가 중간에 취소될 수 있다.
    - 만약 suspending function 사용이 필요하다면 `withContext(NonCancellable)`을 사용하면 된다.
    
### Timeout
```kotlin
fun main() = runBlocking {
    withTimeout(1300) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500)
        }
    }
}

fun main() = runBlocking {
    val result = withTimeoutOrNull(1300) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500)
        }
        "Done"
    }
    println(result)
}
```
- `withTimeout`을 사용하면 타임아웃을 걸 수 있다. `withTimeout`은 타임아웃이 발생하면 예외가 발생한다.
- `withTimeoutOrNull`은 타임아웃을 발생하면 예외대신 아닌 null을 반환한다.

### Asynchronous timeout and resources
```kotlin
var acquired = 0

class Resource {
    init {
        acquired++
    }

    fun close() {
        acquired--
    }
}

fun main() {
    runBlocking {
        repeat(1_000_000) {
            launch {
                var resource = withTimeout(60) {
                    delay(50)
                    Resource()
                }
                resource.close()
            }
        }
    }
    println(acquired)
}
```
- `withTimeout`에서 타임아웃 이벤트는 비동기이기 때문에 언제든지 발생할 수 있다. 심지어 결과를 리턴하기 직전에도 타임아웃이 발생할 수 있다.
- 참고로 생성되는 모든 코루틴 100k개의 계산작업은 항상 동일한 메인 스레드에서 수행되기 때문에 스레드 세이프하다. 
- 그렇기 때문에 위 코드에서 프린트된 acquired는 0이 아닐 가능성이 존재한다.
    - `Resource()`로 인해 인스턴스가 생성되었지만 해당 인스턴스가 반환되기 직전에 타임아웃이 발생하여 `close()`가 호출되지 않을 수 있다.
- 해당 문제는 아래와 같이 `withTimeout`에서 인스턴스를 반환하지 않고 참조를 바인딩하고 finally에서 해제하도록 하여 해결할 수 있다.

```kotlin
fun main() {
    runBlocking {
        repeat(1_000_000) {
            launch {
                var resource: Resource? = null
                try {
                    withTimeout(60) {
                        delay(50)
                        resource = Resource()
                    }
                } finally {
                    resource?.close()
                }
            }
        }
    }
    println(acquired)
}
```

## Composing suspending functions
### Sequential by default
```kotlin
fun main() {
    runBlocking {
        val time = measureTimeMillis {
            val one = doSomethingUsefulOne()
            val two = doSomethingUsefulTwo()
            println("answer: $one + $two")
        }
        println("take: $time")
    }
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
- 코루틴 코드는 기본적으로 순차적이기 순차적 호출이 필요할 때 일반 코드와 같이 순서대로 호출하면 된다.

### Concurrent using async
```kotlin
fun main() {
    runBlocking {
        val time = measureTimeMillis {
            val one = async { doSomethingUsefulOne() }
            val two = async { doSomethingUsefulTwo() }
            println("answer: ${one.await()} + ${two.await()}")
        }
        println("take: $time")
    }
}
```
- 위 코드에서 두 함수를 동시에 호출하고 싶을 땐 `async` 함수를 활용하면 된다.
- `async`는 `launch`와 비슷하게 개별적인 코루틴을 생성하여 계산을 수행하지만 `launch`는 **반환 값을 가지고 있지 않은 Job을 반환**하는 반면 `async`는 **반환 값을 가지는 Deferred를 반환**한다.
    - Deferred는 await을 호출하여 최종적으로 값을 얻을 수 있고 Job과 동일하게 cancel이 가능하다.
- `async(start = CoroutineStart.LAZY){ }`와 같이 LAZY 옵션을 명시하면 `start` 함수를 호출하거나 `await`을 호출할 때 실제 계산이 시작되도록 지연시킬 수 있다.

### Async-style functions(권장하지 않는 방법)
```kotlin
fun main() {
    val time = measureTimeMillis {
        // 이 Aync 함수들은 suspending 함수가 아니므로 코루틴 스코프 내부가 아니여도 Async 함수를 호출할 수 있다.
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
    println("Completed in $time ms")
}

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync(): Deferred<Int> = GlobalScope.async {
    doSomethingUsefulOne()
}

// The result type of somethingUsefulTwoAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync(): Deferred<Int> = GlobalScope.async {
    doSomethingUsefulTwo()
}
```
- 다른 프로그래밍 언어에서 인기있는 방식처럼 GlobalScope를 통해 async 함수를 정의하고 이를 사용하도록 할 수 있지만 이 방식은 권장되지 않는다.
    - 이 방식은 어떤 async 함수 로직 중간에 에러가 있어 작업을 중단하여도 다른 async 함수는 백그라운드에서 계속 작업이 수행된다.  
    - 구조화된 코루틴을 활용하면 이를 해결할 수 있다.
    
### Structured concurrency with async
```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```
- 계산 과정을 하나의 함수로 추출하고 `coroutineScope`를 활용하여 스코프를 제한하면 해당 함수에서 예외가 발생하여 작업이 중단될 때 해당 스코프 내부의 모든 코루틴도 취소된다.

```kotlin
fun main() = runBlocking<Unit> {
    try {
        failedConcurrentSum()
    } catch(e: ArithmeticException) {
        println("Computation failed with ArithmeticException")
    }
}

suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> {
        try {
            delay(Long.MAX_VALUE)
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> {
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
-  await 함수가 호출될 때 `two` 코루틴은 예외 발생으로 작업이 중단되면서 `one` 코루틴도 함께 중단되고 예외가 전파된다.

## Coroutine context and dispatchers
코루틴은 항상 `CoroutineContext`에서 실행된다. 코루틴 컨텍스트는 다양한 요소로 구성되고 주요요소로는 Job`과 `Dispatcher`가 있다.

### Dispatchers and threads
```kotlin
fun main() = runBlocking<Unit> {
    launch { // 상위의 runBlocking 컨텍스트에서 사용되는 main thread가 사용됨.
        println("main runBlocking: ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Dispatchers.Unconfined: ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // DefaultDispatcher 스레드 사용
        println("Dispatchers.Default: ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // 커스텀 스레드를 사용하여 사용
        println("newSingleThreadContext(\"MyOwnThread\"): ${Thread.currentThread().name}")
    }
}
```
- `CoroutinDispatcher`는 코루틴 실행 시 어떤 스레드를 사용할 지 결정하는 역할을 한다.
- `launch`나 `async`같은 모든 코루틴 빌더는 필요 시 파라미터를 전달하여 어떤 디스패처를 사용할 지정할 수 있다.

### Unconfined vs confined dispatcher
```kotlin
fun main() = runBlocking<Unit> {
    launch(Dispatchers.Unconfined) { 
        println("Dispatchers.Unconfined ${Thread.currentThread().name}") // main 스레드
        delay(500)
        println("Dispatchers.Unconfined ${Thread.currentThread().name}") // DefaultExecutor
    }
    launch {
        println("main runBlocking: ${Thread.currentThread().name}") // main 스레드
        delay(1000)
        println("main runBlocking: ${Thread.currentThread().name}") // main 스레드
    }
}
```
- `Dispatchers.Unconfined`를 사용하면 해당 코루틴이 첫번째 중단(suspension)전 까지만 호출자 스레드에서 수행되고 작업이 재개될 땐 사용할 스레드가 suspending function에 따라 결정된다.
    - 이러한 특징때문에 unconfined dispatcher는 특정 스레드에 공유되어야 할 데이터가 없거나, CPU 시간을 소비하지 않는 케이스에 적절히 사용할 수 있다.
- 그와반대로 기본적으로 dispatcher는 호출자 스레드로 제한하기 때문에 작업이 중단되고 다시 재개되어도 호출자 스레드를 사용한다.

### Children of a coroutine
- 코투틴이 다른 코루틴의 CoroutineScope에서 수행될 때 코루틴 컨텍스트를 상속하고 새로운 코루틴의 `Job`은 부모 코루틴의 `Job`의 자식이 된다.
- 이렇게 부모-자식 관계가 맺어지면 부모 코루틴의 작업이 중단될 때 자식 코루틴의 작업도 함께 중단되며 자식 코루틴들의 작업이 완료되기 전까지 기다린다. 
- 이렇나 부모-자식 관계를 명시적으로 오버라이딩할 수 있는 방법이 있다.
    - `GlobalScope.launch`와 같이 다른 스코프에서 코루틴을 수행하도록 하면 부모 스코프의 `Job`을 상속하지 않는다.
    - `launch(Job())`과 같이 다른 `Job`을 명시적으로 지정하면 해당 `Job`을 상속하게 된다.
    
### Naming coroutines for debugging
```kotlin
async(CoroutineName("someName")){ }
```
- 효율적인 디버깅을 위해 코루틴 생성 시 CoroutineName context를 전달하여 코루틴 이름을 명시적으로 지정할 수 있다.

### Combining context elements
```kotlin
launch(Dispatchers.Default + CoroutineName("test")) { }
```
- 코루틴 생성시 `CoroutineName, Dispatcher`등의 컨텍스트들을 여러개 지정하고 싶은 경우 `+` 오퍼레이터를 이용하면 된다.

### Thread-local data
- 종종 스레드 로컬 데이터를 사용해야할 때가 있는데 코루틴은 특정 스레드에 바인딩 되지 않기 때문에 불필요하게 반복되는 코드가 필요해질 수 있다.
- `ThreadLocal.asContextElement` 확장 함수를 활용하면 손쉽게 바인딩되는 스레드가 변경되어도 값을 유지하도록 할 수 있다.

```kotlin

```
- 코루틴 내부에서 스레드 로컬 값을 변경하면 해당 값은 전파되지 않는다. 그리고 변경된 값은 다음 중단에서 잃게 된다. 그러므로 값을 변경하기 위해서 `withContext`를 사용하여 `asContextElement`로 값을 변경하도록 하자. 
- 쓰레드 로컬 컨텍스트를 세팅하는걸 놓칠 가능성을 대비하여 `ThreadLocal.ensurePresent`를 활용하여 사전 검증을 하는 것이 좋다.
- MDC와 같은 스레드 로컬을 활용하는 라이브러리와의 통합과 같은 향상된 사용을 위해 [ThreadContextElement](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-thread-context-element/index.html) 를 직접 구현할 수 있다.



## 참고자료
[Coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html)
