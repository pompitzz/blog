---
title: 코틀린 Scope functions(let, with, run, apply, also)
date: 2021-11-05 19:30
img:
    - kotlin.png
tags:
    - Kotlin 
---

객체의 컨텍스트 내부에서 코드 블럭을 실행시켜 주기 위한 몇가지 함수들이 존재한다.

이러한 함수들은 대상 객체에 대한 임시적인 스코프를 형성하여 해당 객체에 접근할 수 있다.

이러한 역할을 하는 5가지 함수(`let`, `run`, `with`, `apply`, `also`)가 존재하며 이 함수들을 활용하면 코드를 더 간결하고 읽기 쉽게 만들 수 있다.

이들은 공통적으로 해당 코드 블럭을 실행시키는 역할을 하며 해당 객체를 블럭 내부에서 어떻게 참조하는지, 결과 값이 무엇인지에 따라 나뉜다.



## Functions
| Function | Object reference | Return value | Is extension function
|:---:|:---:|:---:|:---:|
| let | it | Lambda result | O |
| run | this | Lambda result | O |
| with | this | Lambda result | X |
| apply | this | Context object | O |
| also  | it | Context object | O |

### let
- 컨텍스트 객체 참조 방식: `it`
- 반환 값: `lambda result`

#### 1) 컨텍스트 객체를 전달 인자로 사용할 때
```kotlin
fun main() {
    listOf(1, 2, 3, 4, 5)
        .filter { it > 3 }
        .let { print(it) }
}
```
  
#### 2) non-null object만 수행할 때
```kotlin
fun main() {
    var nullableStr: String? = "Hello"
    val length = nullableStr?.let {
        println(it)
        it.length
    }
}
```
- `?.let`를 활용하여 해당 객체가 null이 아닐때에만 코드 블럭을 실행시키도록 할 수 있다.
  
#### 3) 제한된 스코프를 활용한 지역변수 도입할 때
```kotlin
fun main() {
    val modifiedFirstNumber = listOf(1, 2, 3, 4, 5)
        .first()
        .let { if (it > 5) it + 5 else it + 10 }
}
```
- `lamnda result`를 반환하므로 해당 객체에서 새로운 지역 변수를 도출해낼 때 let으로 스코프를 제한하여 코드를 읽기 쉽게 만들 수 있다.

### with
- 컨텍스트 객체 참조 방식: `this`
- 반환 값: `lambda result`
- `with`는 확장 함수가 아니므로 컨텍스트 객체를 전달 인자로 넘겨야 한다.

#### 1) 컨텍스트 객체의 함수를 호출할 때
```kotlin
fun main() {
    with("hello") {
        println("$length")
    }
}
```
- this로 객체를 참조하기 때문에 함수를 호출할 때 적절하다.

### run
- 컨텍스트 객체 참조 방식: `this`
- 반환 값: `lambda result`
- `with`와 동일하지만 확장 함수이다.

#### 1) 객체 초기화와 반환 값 계산이 동시에 수행될 때
```kotlin
class MultiPortService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

val service = MultiPortService("https://example.kotlinlang.org", 80)

val result = service.run {
    port = 8080
    query(prepareRequest() + " to port $port")
}

// the same code written with let() function:
val letResult = service.let {
    it.port = 8080
    it.query(it.prepareRequest() + " to port ${it.port}")
}
```

#### 2) 표현식이 필요한 명령문 블럭을 실행할 때
```kotlin
val hexNumberRegex = run {
    val digits = "0-9"
    val hexDigits = "A-Fa-f"
    val sign = "+-"

    Regex("[$sign]?[$digits$hexDigits]+")
}

for (match in hexNumberRegex.findAll("+1234 -FFFF not-a-number")) {
    println(match.value)
}
```
- `run`은 확장함수로 사용하지 않고 명령문 블럭을 정의하여 사용할 수 있다.

### apply
- 컨텍스트 객체 참조 방식: `this`
- 반환 값: `context object`

#### 1) 객체를 구성할 때
```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
}
```

### also
- 컨텍스트 객체 참조 방식: `it`
- 반환 값: `context object`

#### 1) 호출 체인에서 컨텍스트 객체를 전달 인자로 사용할 때
```kotlin
fun main() {
    val stringNumbers = listOf(1, 2, 3)
        .also { println(it) }
        .map { it.toString() }
}
```

> scope function들이 코드를 간결하고 읽기 쉽게해주지만 과도하게 사용하면 코드가 더 읽기 어려워지고 에러가 발생할 수 있다.
> 기본적으로 scope function들을 중첩해서 사용하지 말자. 현재 컨텍스트 객체가 무엇인지 파악하기 어려워져 `it` or `this` 사용에 혼동이 생길 수 있다.

## this vs it
스코프 함수들은 크게 객체 참조를 `it` or `this`로 하냐, 결과 값이 `lambda result` or `context object`로 나눌 수 있다.

결과 값은 사용처를 파악하기 쉽지만 `it`과 `this`의 차이점은 단번에 이해하기 힘들다. 어느 상황에 무엇을 사용하면 좋은지 알아보자.

### this
- `this`는 해당 클래스 내부에서 객체를 사용하는 것 처럼 상태에 접근하거나 상태를 호출할 수 있다.
- `this`는 생략이 가능하므로 외부 변수나 함수와 헷갈릴 수 있으니 주로 해당 객체의 함수를 호출하거나, 해당 객체의 상태를 할당할 떄 사용하기 적합하다.

### it
- it은 this보다 짧긴하지만 생략이 불가능하다. 그러므로 it은 해당 객체 필드를 함수 호출 시 아규먼트로 사용하거나, 외부 변수 및 함수와 함께 사용될 때 사용하는 것이 적합하다.


## takeIf and takeUnless
- 추가적인 스코프 함수로 `takeIf`, `takeUnless`가 제공되며 이는 위에서 설명된 스코프 함수와 함께 사용할 때 유용하다.
 
```kotlin
fun main() {
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
}
```
- `takeIf`는 람다 식이 `true`면 객체를 반환하고 그렇지 않으면 null을 반환한다.
- `takeUnless`는 람다 식이 `false`면 객체를 반환하고 그렇지 않으면 null을 반환한다.

### 사용 예시
```kotlin
// takeIf를 사용할 때
fun printFirstElement1(numbers: List<Int>) {
    numbers.first()
        .takeIf { it >= 3 }
        ?.let { println("number is greater than 3. number: $it") }
}

// 일반적인 방식
fun printFirstElement2(numbers: List<Int>) {
    val firstNumber = numbers.first()
    if (firstNumber >= 3) {
        println("number is greater than 3. number: $firstNumber")
    }
}
```

## 참고 자료
[Kotlin Docs](https://kotlinlang.org/docs/scope-functions.html)

[Kotlin Play](https://play.kotlinlang.org/byExample/06_scope_functions/01_let)
