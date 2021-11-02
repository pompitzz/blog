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

## 참고자료
[Coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html)
