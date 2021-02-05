---
title: 코틀린 인 액션 정리 
date: 2021-01-29 22:06
img: 
    - kotlin.png
tags: 
    - Kotlin
---

## 1장 코틀린이란 무엇이며, 왜 필요한가?
- 코틀린은 자바 코드와의 상호운용성을 중시한다.
- 코틀린은 정적 타입 지정 언어이다.

### 정적 타입 언어의 장점
::: details 자세히
- **성능**
    - 런타임에 어떤 메서드를 호출해야할 지 알아내지 않아도되므로 성능이 더 우수
- **신뢰성**
    - 컴파일러를 통한 검증으로 신뢰성 향상
- **유지보수성**
- **강력한 도구 지원**
:::
  
### 코틀린의 철학
::: details 자세히
- **실용성**
    - 연구를 위한 언어가 아닌 실무에 사용할 수 있도록 증명된 해법과 기능을 바탕으로 만듬
- **간결성**
    - 간결한 코드는 코드 가독성을 높여 더 빠르고 효율적인 개발 가능
- **안전성**
    - JVM 기반으로 동작하므로 JVM의 지원을 받을 수 있다.
    - 타입 지정 언어이므로 안전한 코딩이 가능하다.
- **상호운용성**
    - 자바와 매우 높은 호환성을 가짐
:::

## 2장 코틀린 기초
- 코틀린은 루프를 제외하고 대부분 `식(expression)`으로 구성됨
- expression은 값을 만들지만 statement는 블럭의 최상위 요소로 존재할 뿐 값을 만들지 않는다.

### 함수와 변수
::: details 자세히
```kotlin
// 함수는 fun으로 정의하며 블럭문이 아닌 식으로도 정의 가능
fun hello() = println("Hello")

// val은 java final과 동일하게 재할당이 불가능
val name1: String = "Dexter"

// var는 재할당 가능
var name2: String = "Dexter" 
```

```kotlin
// if문도 expression으로 사용 가능
fun max(a: Int, b: Int) = if (a > b) a else b
```
- expression을 함수의 본문으로 구성하여 간결하게 표현가능

#### 굳이 변수를 뒤에 선언하는 이유?
- 변수를 뒤에 지정하게 되면 `타입 지정을 생략할 수 있게 해준다.`
:::


### 문자열 템플릿
::: details 자세히
```kotlin
val name = "Dexter"
println("Hello $name")
println("Hello ${name}")
```
- 자바에 비해 훨씬 더 간편하게 문자열을 다룰 수 있다.
:::

### 클래스
::: details 자세히
```kotlin
class Person(
    // val은 읽기 전용으로 비공개 필드와 getter 제공
    val name: String,
    // var은 변경 가능하므로 비공개 필드와 getter, setter 제공
    var age: Integer,
)

val person = Person("Dexter", 26)
println(person.name) // 프로퍼티로 직접 접근하면 게터가 호출된다.
println(person.age)
```
:::

### 커스텀 접근자
::: details 자세히
```kotlin
class Rectangle(val height: Int, val width: Int) {
    // 커스텀 접근자를 지정할 수 있다.
    val isSquare: Boolean 
        get() = height == width
}
```
:::

### enum과 when
::: details 자세히
```kotlin
enum class Color {
    RED,
    ORANGE,
    YELLOW
    ;
}

// java 스위치랑 비슷
fun getStringColor(color: Color) =
        when (color) {
            Color.RED -> "RED" 
            Color.ORANGE -> "ORANGE" 
            Color.YELLOW -> "YELLOW" 
        }

fun getStringColor2(color: Color) =
        when (color) {
            Color.RED, Color.ORANGE, Color.YELLOW -> "COLOR"
        }

fun getStringColor3(color1: Color, color2: Color) = 
        when {
            (color1 == Color.RED || color2 == Color.ORANGE) -> "RED ORANGE"
            else -> throw RuntimeException()
        }
```
:::

### 스마트 캐스팅
::: details 자세히
```kotlin
interface Expr
class Num(val value: Int) : Expr
class Sum(var left: Expr, val right: Expr) : Expr

// 스마트 캐스팅을 지원한다.
fun eval(e: Expr): Int =
        when (e) {
          is Num -> e.value
          is Sum -> eval(e.left) + eval(e.right)
          else -> throw IllegalArgumentException()
        }

/**
 *  클래스의 프로퍼티를 스마트 캐스팅하고 싶다면 val이면서 커스텀 접근자가 정의되어 있지 않아야 한다.
 *  - var거나 커스텀 접근자가 있으면 언제나 같은 타입을 반환해준다는 것을 확신할 수 없기 때문에..
 */
fun main() {
  val sum = Sum(Num(1), Num(2))
  if (sum.left is Num) {
    //  println(sum.left.value) 컴파일 에러 (left는 var이다)
  }
  // 스마트 캐스팅 가능(rifht는 val이기 때문)
  if (sum.right is Num) {
    println(sum.right.value)
  }
}
```
- 타입검사와 동시에 형변환을 하도록하여 스마트 캐스팅 지원
:::

### expression when, if
::: details 자세히
```kotlin
fun expressionWhen(e: Expr): Int =
        when(e) {
            is Num -> {
                println(e.value)
                e.value // 표현식의 블럭문은 마지막 값이 리턴 값이 된다.
            }
            is Sum -> {
                println("${e.left} + ${e.right}")
                expressionWhen(e.left) + expressionWhen(e.right)
            }
            else -> throw IllegalArgumentException()
        }

// if절도 가능하지만 when이 더 깔끔해보인다.
fun expressionIf(e: Expr): Int =
        if (e is Num) {
            println(e.value)
            e.value // 표현식의 블럭문은 마지막 값이 리턴 값이 된다.
        } else if (e is Sum) {
            println("${e.left} + ${e.right}")
            expressionIf(e.left) + expressionIf(e.right)
        } else {
            throw IllegalArgumentException()
        }
```
:::

### 이터레이션
::: details 자세히
```kotlin
fun iterationEx() {
    // 1~10 출력
    for (i in 1..10) {
    }

    for (i in 1..10 step 2) {
    }

    // 10에서 1까지 2 칸씩
    for (i in 10 downTo 1 step 2) {
        print("$i, ")
    }

    // map의 key, value를 for문으로 풀어낼 수 있다.
    for ((key, value) in mutableMapOf(Pair("A", 1))) {

    }

    // withIndex를 활용하면 리스트의 index도 간편히 가져올 수 있다.
    for ((index, value) in mutableListOf(1, 2, 3).withIndex()) {

    }
}
```
:::

### in으로 범위 검사
::: details 자세히
```kotlin

fun isSmallLetter(c: Char) = c in 'a'..'z' // 컴파일 -> 'a'<= c && c <= 'z'
fun isNotSmallLetter(c: Char) = c !in 'a'..'z'

fun regognize(c: Char): String =
        when (c) { // when절에서도 in 검증 방식 사용 가능
            in 'a'..'z' -> "is small letter"
            else -> "is not small letter"
        }
```
:::

### 예외
- 코틀린은 모두 언체크 예외로 이루어져 있다.


## 3장 함수 정의와 호출
### Default and Named Argument
::: details 자세히
```kotlin
fun <T> joinToString(collection: Collection<T>, separator: String = ","): String {
    val builder = StringBuilder()
    for ((index, element) in collection.withIndex()) {
      if (index > 0) builder.append(separator)
      builder.append(element)
    }
  return builder.toString()
}

fun main() {
  joinToString(separator = "|", collection = listOf(1, 2, 3))
}
```

- 아규먼트에 디폴트 값을 지정할 수 있고 호출 시 네이밍이 가능하다.
- named argument로 자바의 빌더를 대체할 수 있다.

#### Default Argument를 자바에도 지원하려면?

- @JvmOverloads를 붙이면 각각의 아규먼트에 맞는 오버로딩 메서드를 만들어준다.
  :::

### 최상위 함수와 최상위 프로퍼티

::: details 자세히

#### 최상위 함수는 어떻게 생성될까?

- 바이트코드로 변환 후 자바로 디컴파일해보면 해당 코드가 작성된 파일명Kt라는 클래스의 static 메서드로 정의된다.

#### 최상위 프로퍼티 val? const?

- 최상위 프로퍼티에 val, var 모두 사용 가능하다.
- val은 재할당이 불가능한건 맞지만 실제 호출 시 내부의 getter를 호출한다.
- 상수를 선언할 때 getter를 호출하는건 자연스럽지 못하므로 `const val NAME = "Dexter"`와 같이 const를 붙여주자.
  :::

### 확장 함수

::: details 자세히

- 기존에 만들어져 있던 클래스의 함수를 외부에서 추가하여 확장시키는 기법

```kotlin
// String의 확장 함수 정의. 확장이 될 대상을 **수신 객체 타입**이라고 칭하며 호출된 수신 객체는 해당 함수에서 this로 참조가능
fun String.lastChar(): Char = this[this.length - 1]
```

> 확장 함수는 캡슐화를 지키므로 수신 객체를 this로 참조하더라도 확장 함수에서는 확장할 클래스 내부로 접근이 제한된 대상은 접근이 불가능

#### 자바에서 확장 함수 호출하기
- 확장함수는 내부적으로 수신 객체를 첫번째 인자로 갖는 static method로 정의된다.
- 그러므로 자바에서도 정적 메서드 호출로 호출할 수 있으며, static method이므로 런타임에 부가 비용이 없다.

> **확장 함수는 정적 메서드 호출에 대한 syntatic sugar일 뿐 대단한 것이 아니다**

#### 확장함수는 오버라이딩 불가
```kotlin
open class Parent
class Child : Parent()

fun Parent.hi() = println("Parent.hi")
fun Child.hi() = println("Child.hi")

fun main() {
    Child().hi() // child 호출
    val parent: Parent = Child()
    parent.hi() // parent 호출
}
```
- 내부적으로 정적 메서드로 구현되므로 오버라이딩은 불가능하기 때문에 실제 인스턴스는 Child이나 Parent의 hi가 호출된다.
:::
  
### 확장 프로퍼티
::: details 자세히
```kotlin
val String.lastChar: Char
    get() = get(length - 1)

var StringBuilder.lastChar : Char
    get() = get(this.length - 1)
    set(value: Char) {
        this.setCharAt(this.length - 1, value)
    }

fun main() {
    val sb = StringBuilder("Hello World")
    println(sb.lastChar)
    sb.lastChar = 'k' // lastChar의 set 프로퍼티 호출
    println(sb.lastChar)
}
```
- 기존 클래스 객체에 필드를 추가하는게 아니라 상태를 가질 순 없고 접근자 프로퍼티를 정의하여 사용 가능
:::
  
### 가변 인자 함수
::: details 자세히
```kotlin
fun print(vararg args: String) {
    for (arg in args) {
        println(arg)
    }
}

fun printArray(args: Array<String>) {
    // Array 객체를 넘길때도 *를 반드시 붙여줘야 한다.
    print(*args)
}

fun main() {
    printArray(arrayOf("1", "2"))
}
```
:::

### 중위 함수
::: details 자세히
```kotlin
val map = hashMapOf(1 to "one", 2 to "two")
```
- 인자가 하나뿐인 일반 메서드나 확장 함수는 중위 호출이 가능하다.
:::

### 구조 분해
::: details 자세히
```kotlin
for ((key, value) in mutableMapOf(Pair("A", 1))) {

    }

    // withIndex를 활용하면 리스트의 index도 간편히 가져올 수 있다.
    for ((index, value) in mutableListOf(1, 2, 3).withIndex()) {

    }
}
```
- map을 key, value로 구조분해, list를 withIndex로 호출하여 index, value로 구조분해 하는등의 방식을 활용 가능.
:::

### 문자열 및 정규식 다루기
::: details 자세히

```kotlin
fun regex() {
  // 명시적으로 정규 표현식을 표현
  val regex = "\\d\\d".toRegex()

  // 삼중 따옴표는 역슬래쉬를 한번만 사용할 수 있다.
  val regex2 = """\d\d""".toRegex()
}
```
:::

## 4장. 클래스, 객체, 인터페이스

### 인터페이스와 클래스
::: details 자세히
```kotlin
interface Clickable {
    fun click()

    // 자바 디폴트 메서드 같이 구현 정의 가능. (상태를 가질 순 없다.)
    fun showOff() = println("Clickable Interface")
}

// 구현, 상속은 :로 표현한다.
class Button : Clickable {
    override fun click() {
        TODO("Not yet implemented")
    }
}
```

#### 자바에서 코틀린 인터페이스의 디폴트 메서드 구현
- 자바는 8부터 디폴트 메서드를 제공하지만 코틀린은 자바6부터 호환성을 제공해야 한다.
- 그래서 코틀린에서는 디폴트 메서드가 각 구현의클래스의 정적 메서드로 들어가게 된다.

#### open, final, abstract 변경자
- 코틀린은 기본이 `final`이기 때문에 상속이 불가능하다.
- 상속을 위해서 `open` 변경자를 명시해줘야 한다.
    - 이는 메서드, 필드변수 모두 적용된다.
- override 메서드는 자동으로 open이 적용되는데 명시적으로 final을 붙여 상속을 막을 수 있다.
- `abstract`는 자바와 동일하게 추상 메서드를 의미한다.

#### 스마트 캐스트와 상속

- 이전에 스마트 캐스팅을 위해선 클래스의 프로퍼티가 val이면서 커스텀 접근자를 구현하지 않아야 가능하다고 했다.
- 이는 클래스에도 적용되기 때문에 만약 클래스가 open되어 있다면 스마트 캐스트는 불가하다.
  :::

### 가시성 변경자

::: details 자세히

- 코틀린은 기본 가시성변경자가 public이며 default 접근자는 따로 존재하지 않는다.
- 모듈 내부에서만 사용할 수 있는 internal 접근자를 따로
  제공한다. [(모듈 범위 문서 참고)](https://kotlinlang.org/docs/reference/visibility-modifiers.html#modules)
- public, internal, private, protected의 가시성 변경자가 존재하며 protected를 제외하곤 최상위에 선언도 가능하다.

```kotlin
interface Focusable {
  fun showOff() = println("I`m Focusable showOff")
}

internal open class TalkativeButton : Focusable {
  private fun yell() = println("yell")
  protected fun whisper() = println("whisper")
}

// 확장하려는 클래스가 internal이므로 가시성이 수준이 같거나 더 낮아야 한다.
internal fun TalkativeButton.giveSpeech() {
//    yell()  private이므로 호출 불가
//    whisper()  자바와 다르게 protected는 오직 하위 클래스에서만 사용 가능 
}
```

#### 코틀린과 자바의 가시성 변경자
- public, protected, private은 자바의 바이트코드 안에서 그대로 유지
- 하지만 private class같이 자바에서 구현이 불가능한 것들은 private 클래스를 패키지-전용 클래스로 컴파일한다.
- internal 변경자도 자바에서 지원되지 않는 변경자이므로 바이트코드상으론 public이 된다.
    - 그러므로 자바에서 접근이 가능하지만 internal 멤버의 이름을 의도적으로 바꾸어 외부에서 사용을 하기 어렵게 컴파일한다.

#### 프로퍼티 접근자 가시성 변경
```kotlin
class LengthCounter {
    var counter: Int = 0
        private set // set은 클래스 내부에서만 사용할 수 있게 함.
}
```
:::

### 내부 클래스와 중첩 클래스
::: details 자세히
- 코틀린은 외부 클래스가 내부 클래스의 private 멤버에 접근이 불가능하다.

```kotlin
class Outer {
    class Inner1 {
        // 코틀린은 기본이 자바의 static 클래스처럼 외부의 참조가 없는 중첩 클래스이다.
        // fun test() = this@Outer 외부 참조가 없으니 불가능 
    }
    
    // 내부 클래스를 위해 inner를 명시적으로 붙여줘야 한다.
    inner class Inner2 {
        fun test() = this@Outer
    }
}
```

#### 코틀린 중첩 클래스를 유용하게 사용할 수 있는 방법
```kotlin
// 계층 확장 제한을 가능하게 해주는 봉인 클래스 (자신의 외부에 자신을 상속한 클래스를 둘 수 없음)
sealed class Expr2 {
    class Num(val value: Int) : Expr2()
    class Sum(val left: Expr2, val right: Expr2) : Expr2()
}

// 봉인 클래스를 활용하면 when절에서 else를 사용하지 않아도 된다.
// 새로운 중첩 클래스가 생겼을 때 해당 클래스에 대해 when절을 구현하지 않으면 컴파일 에러가 발생한다.
fun eval2(e: Expr2): Int =
        when (e) {
            is Expr2.Num -> TODO()
            is Expr2.Sum -> TODO()
        }
```
:::

### 코틀린의 생성자
::: details 자세히
- 코틀린 클래스의 생성자는 크게 주 생성자와, 부 생성자로 구분할 수 있다.
    - 주 생성자는 클래스 본문이 아닌 괄호 안에서 정의
    - 부 생성자는 클래스 본문 안에서 정의

```kotlin
// 주 생성자
open class User (val name: String) {}

// 위를 풀어쓰면 아래와 같다.
class User2 constructor(_name: String) {
    val name: String
    init {
        name = _name
    }
}

// 부모의 생성자 호출은 아래와같이 가능하며 괄호를 붙여 부모 클래스 생성자를 호출해줘야 한다.
class SubUser(name: String) : User(name)
```

> 코틀린은 모든 생성자 프로퍼티에 디폴트 값을 부여하면 자동으로 디폴트 생성자를 만들어준다.
> - 코틀린은 디폴트 파라미터가 있기 때문에 대부분의 부 생성자 오버로딩이 필요 없다.
:::

### 인터페이스 프로퍼티와 Backing Field
::: details 자세히
- 인터페이스에서 상태를 가질 순 없지만 `추상 프로퍼티 정의`가 가능하다.

```kotlin
interface Member {
  val name: String

  // 다른 프로퍼티를 활용하여 커스텀 접근자를 가지는 프로퍼티를 구현할 수는 있다.(상태를 가지면 안되므로 Backing Field가 존재 안함)
  val listCharName: Char
    get() = name.lastChar
}

// 추상 프로퍼티는 반드시 구현되어야 한다.
class PrivateMember(override val name: String) : Member {}
```

#### 커스텀 접근자의 Backing field
- 프로퍼티는 값을 직접 저장하는 프로퍼티와 커스텀 접근자를 활용해 매번 새로운 값을 계산하는 프로퍼티가 존재한다.
- 이 두가지 방법을 조합하여 값이 변경할 때 이전 값과 현재 저장할 값을 이용하여 원하는 로직을 수행하도록 할 수 있다.
- 이를 위해 접근자 안에서 해당 프로퍼티의 Backing field에 접근할 수 있어야 한다.

```kotlin
class AUser(val name: String) {
  var address: String = "unselected"
    set(value: String) {
      // backing field는 `field`로 접근가능 (get에서는 field를 참조할 수 있지만 읽기만 가능하다.)
      print("백킹 필드값(이전값): $field, 새로운 값: $value")
      field = value
    }
}

fun main() {
  val aUser = AUser("name")
  aUser.address = "서울시" // setter 호출
  aUser.address = "부산시" // setter 호출
//    ## 출력 ##
//    백킹 필드값(이전값): unselected, 새로운 값: 서울시
//    백킹 필드값(이전값): 서울시, 새로운 값: 부산시
}
``` 

#### 클라이언트 입장에서의 Backing Field
- 해당 프로퍼티를 사용하는 클라이언트 입장에서는 Backing Field에 대해 알 필요가 없다.
- 디폴트 접근자로 구현을 하더라도 코틀린 내부적으로 Backing Field를 생성해주기 때문이다.
- 단, 직접 커스텀 접근자를 구현하였는데 거기서 Backing Field를 사용하지 않으면 Backing Field는 존재하지 않게 된다.
:::

### data class
::: details 자세히
- JVM언어에서는 hash 컬렉션의 사용 방식으로 인해 equals, hashCode를 반드시 동시에 알맞게 구현해줘야 하는 규칙이 있다.
    - 최적화를 위해 hashCode로 비교 후 equals로 한번 더 비교하기 때문이다.
- 이런 보일러 플레이트 같은 메서드들을 자동 구현해주는 data class가 존재한다. -> `data class User(val name: String)`
:::

### 클래스 위임: by
::: details 자세히
- 상속을 하지 않고 클래스에 새로운 동작을 추가하기 위해선 주로 **데코레이터 패턴**을 활용한다.
- 데코레이터 패턴을 위해선 동일한 인터페이스를 구현해야하고, 관련되지 않은 모든 동작도 하나씩 위임해줘야 한다.
- 코틀린은 언어적으로 이러한 위임을 간편히 할 수 있도록 제공해준다.

```kotlin
// 직접 구현하지 않으면 innerList로 전부 위임하도록 해준다.
class DelegatingCollection<T>(innerList: Collection<T> = ArrayList<T>()) : Collection<T> by innerList {
    override fun isEmpty(): Boolean {
        TODO("Not yet implemented")
    }

```
:::

### object 키워드: 클래스 선언과 동시에 인스턴스 생성(싱글톤 보장)
::: details 자세히
- object 키워드는 클래스 선언과 동시에 인스턴스를 생성하여 싱글톤을 보장해준다.
    - 주로 싱글톤, 익명 내부 클래스, 동반 객체에서 사용된다.

```kotlin
// 싱글톤이면 충분한 것들에서 유용하게 사용된다.
object StringComparator : Comparator<String> {
    override fun compare(o1: String?, o2: String?): Int {
        TODO("Not yet implemented")
    }
}

data class Person(val name: String) {
    //  중접 객체로도 사용하며 외부에서 정적 메서드를 호출하는 거처럼 접근이 가능해진다.
    object NameComparator : Comparator<String> {
        override fun compare(o1: String?, o2: String?): Int {
            TODO("Not yet implemented")
        }

    }
}
```
:::

### 동반 객체
::: details 자세히
- 코틀린은 클래스 내부에서 static 메서드를 제공해주지 않는다.(최상위 함수와, 객체 선언이 가능해서)
- 하지만 상황에 따라 클래스 내부에 private 접근자로 접근하기 위해 클래스 내부에 구현되어야 할 필요가 있다.
- 이런경우 동반 객체를 활용하여 private 접근자에 접근이 가능하도록 할 수 있다.

```kotlin
class BUser private constructor(val name: String) {
    companion object {
        // private 생성자로 접근가능, 사용처에선 static 메서드처럼 호출 가능
        fun newUser(name: String) = BUser(name)
    }
}

// 동반객체도 인터페이스를 구현하여 다형성을 활용할 수 있다.
interface JSONFactory<T> {
    fun fromJSON(jsonText: String): T
}

class CUser(val name: String) {
    // 동반 객체도 인터페이스를 구현할 수 있다.
    companion object : JSONFactory<CUser> {
        override fun fromJSON(jsonText: String): CUser {
            TODO("Not yet implemented")
        }
    }
}

fun <T> loadFromJSON(factory: JSONFactory<T>): T {
    TODO()
}

fun main() {
    // 동반 객체가 구현한 인터페이스를 파라미터로 가지는 메서드에 CUser를 넘겨 다형성 활용 가능
    loadFromJSON(CUser)
}
```

#### 동반 객체 확장
```kotlin
class DUser(val name: String) {
    // 확장 함수를 사용하기 위해서 빈 동반 객체 정의가 필요
    companion object
}


// 외부에서 동반 객체의 확장 함수를 구현해 관심사를 분리할 수 있다.
fun DUser.Companion.fromJSON(json: String): DUser {
    TODO()
} 
```
:::

### 객체 식: 익명 내부 클래스
::: details 자세히
```kotlin
interface Sender {
    fun send()
}

fun sendSend(sender: Sender) = sender.send()

fun main() {
    sendSend(object : Sender {
        override fun send() {
          TODO("Not yet implemented")
        }
    })
}
```

- `object : className() {}` 로 익명 내부 클래스를 정의할 수 있다.
- 주로 메서드에 넘겨줄 객체를 즉시 생성할 때 사용된다.
  - 이 경우 object는 싱글톤을 보장하지 않는다. 호출될 때 마다 새로운 object를 생성한다.
    :::

## 5장. 람다로 프로그래밍

### 람다와 컬렉션

::: details 자세히

```kotlin
fun main() {
  val items = listOf(Item("item1", 10000), Item("item2", 20000))
  println(items.maxByOrNull { it.price }) // 스트림 원소를 it으로 바로 참조 가능하다.
  println(items.maxByOrNull(Item::price)) // 메서드 참조도 가능

  // 람다를 변수에 직접 할당할 수 있다.
  val sum = { x: Int, y: Int -> x + y }

  // { println("Hello World") }()
  //  람다를 위와 같이 호출할 수도 있지만 더 간단하게 run 함수를 활용하면 람다 본문을 호출할 수 있다.
  run { println("Hello World") }
}
```

- 자바와 다르게 코틀린은 람다에서 final이 아닌 변수에 접근이 가능하다.
  - 컴파일러가 특별한 wrapper로 감싸서 참조는 그대로두고 내부의 값을 변경할 수 있도록 해준다.
    :::

### 컬렉션 함수형 API

::: details 자세히

```kotlin
fun main() {
  val items = listOf(Item("item1", 10000), Item("item2", 20000))
  items.all { it.price < 10000 } // 모두 만족
  items.any { it.price < 10000 } // 하나라도 만족하는지?
  items.count { it.price < 10000 } // 키운팅

  val itemsList = listOf(items, items)
  val flattedItems = itemsList.flatten() // 단순히 펼치려면 flatten 쓰면된다.

  val maps = mapOf(1 to "1", 2 to "2")
  maps.mapValues { it + it } // mapValues 가능 
  maps.mapKeys { it + 1 } // mapKeys 가능
}
```

- 기본적인 자바 스트림에서 제공하는 filter, map 등등을 제공한다.
  :::

### 지연 계산을 위한 시퀀스

::: details 자세히

```kotlin
fun main() {
  val items = listOf(Item("item1", 10000), Item("item2", 20000))

  // 기본 확장 함수는 지연 계산을 하지 않는다.
  items.filter { it.price < 1000 }
          .map { it.price }

  // 지연 계산을 위해 asSequence를 이용하면된다.
  // - 자바 스트림과 동일하므로 stream을 써도된다. 자바 8 이전의 호환성을 위해 asSequence가 생김
  items.asSequence()
          .filter { it.price < 1000 }
          .map { it.price }
          .toList()

  // 무한 시퀀스를 만들 수 있다.
  generateSequence(0) { it + 1 }
          .takeWhile { it <= 100 }
          .forEach { println(it) }


  // 확장함수와 무한 시퀀스를 활용하여 부모 파일이 hidden일 때 까지 계속 탐색하도록 함수를 만듬
  fun File.isInsideHiddenDirectory() =
          generateSequence(this) { it.parentFile }
                  // hidden file을 찾으면 멈춘다.
                  .any { it.isHidden }

  File("/Users/dongmyeonglee/Projects/simple-summary/java-sample/src/main/java/com/example/demo/kotlin/lambda.kt")
          .isInsideHiddenDirectory()
}
```

- 기본 함수형 API는 지연 계산을 하지 않으므로 지연 계산이 필요하다면 `asSequence()` or `stream()`를 사용하면 된다.
  :::

### 람다 vs 익명 클래스

::: details 자세히

- 람다와 익명 클래스는 간결성에서도 차이가 나지만, 재사용에서도 차이가 있다.
- 익명 클래스는 생성마다 새로운 인스턴스를 만들지만 람다는 재사용한다.

> 책 기준으로 inline 되지 않은 람다식은 구버전 호환을 위해 익명 클래스로 만들어짐.
> - 자바 8부터 제공하는 람다를 사용하도록 변경될 예정이다.
> - 대부분 기본 확장함수는 inline을 활용하므로 익명 클래스를 만들진 않는다.
    :::

### SAM 생성자: 람다를 함수형 인터페이스로 명시적 변경

::: details 자세히

```kotlin
// Runnable 같은 함수형 인터페이스는 SAM 생성자를 활용하자
fun createRunable() = Runnable { println("RUN!") }
val runnable = Runnable { println("RUN!") }
```

- 함수형 인터페이스의 인스턴스를 반환하는 메서드가 있으면 람다로 반환이 불가능하고 SAM 생성자로 감싸주어야 한다.
-

:::

### 수신 객체 지정 람다: with, apply

::: details 자세히

#### with 함수(수신 객체 지정 람다)

```kotlin
fun buildString(): String {
  return with(StringBuilder()) { // with 활용
    append("Hello")
    append(" ")
    append("World")
    return toString()
  }
}

fun buildString2(): String =
        with(StringBuilder()) { // with 활용
          append("Hello")
          append(" ")
          append("World")
          toString() // 반환 값
        }
```

- 어떤 객체를 람다식에서 사용할 때 객체의 이름을 계속해서 반복하지 않도록 할 수 있다.

#### apply 함수(수신 객체 반환 람다)

```kotlin
fun buildString3(): String =
        StringBuilder().apply {
          append("Hello")
          append(" ")
          append("World")
        }.toString() // 수신 객체를 반환하므로 toString을 호출


class User4() {
  var name: String = ""
    get() {
      TODO()
    }
  var age: Int = 0
    get() {
      TODO()
    }
}


// apply를 통해 빌더처럼 사용 가능(굳이?)
fun main() {
  User4().apply {
    name = "DEXTER"
    age = 13
  }
}
```

:::

## 6장. 코틀린 타입 시스템

- 코틀린은 nullable 타입, 읽기 전용 컬렉션등 새로운 타입 시스템을 도입했다.
- 배열과 같이 자바 타입 시스템에서 불필요한 부분들을 제거하였다.

### Nullability

::: details 자세히

- NPE를 피할 수 있게 돕기 위한 코틀린 타입 시스템의 특성으로 컴파일 시점에 null 에러를 파악할 수 있도록 해준다.
- 코틀린은 기본 타입이 null이 불가능하며, nullable 타입을 위해 ?를 붙이면 됨.
  :::

### 앨비스 연산자 ?:

::: details 자세히

```kotlin
data class Address(val city: String, val country: String)

data class Company(val name: String, val address: Address?)

data class Employee(val name: String, val company: Company?)

fun print(employee: Employee) {
  // 엘비스 연산자로 throw도 가능
  val address = employee?.company?.address ?: throw IllegalArgumentException("Need Address")
  with(address) {
    print("city: $city, countyL $country")
  }
}
```

- 어떤 값이 null일 떄 그 값대신 사용할 기본 값을 지정할 수 있다.
- `val t: String = str ?: "Default`
  :::

### 안전한 캐스팅 as?

::: details 자세히

```kotlin
fun findAddressCity(any: Any): String {
  val address = any as? Address ?: throw IllegalArgumentException("It is not address")
  return address.city
}
```

- 코틀린은 as?를 통해 ClassCastException이 발생하지 않도록 할 수 있다.
  :::

### null 아님 단언: !!

- !!는 null이 아님을 확신할 떄 사용하는 것으로 NPE를 감수할 수 있을 때 사용한다.

### let 함수

::: details 자세히

```kotlin
fun sendEmail(message: String) = print(message)

fun main() {
  var email: String? = "email"

  // null 아니므로 함수 호출 O
  email?.let { sendEmail(it) }

  email = null

  // null 이므로 함수 호출 X
  email?.let { sendEmail(it) }
}
```

- nullable한 타입의 값일 때 null이 불가능한 함수의 파라미터로 넘기려고 할 때 let을 활용하면 된다.
  :::

### null 불가능 타입의 지연 초기화

::: details 자세히

```kotlin
class LateInit {
  private lateinit var kotlinService: Any
}
```

- null이 불가능한 타입을 사용하지만 상황에 따라 지연 초기화가 필요할 때가 존재한다.
- 그럴땐 lateinit을 활용하면 null이 불가능한 타입을 사용할 수 있다.
  - `프로퍼티 초기화전에 접근 시 예외가 발생한다.`
    :::

### 타입 파라미터와 nullable

::: details 자세히

```kotlin
// 타입 파라미터는 유일하게 Any?로 추론되므로 nullable하다.
fun <T> some1(): T = TODO()

// 상한을 두어 null이 불가능하게 할 수도 있다.
fun <T : Any> some2(): T = TODO()
```

:::

### 플랫폼 타입

::: details 자세히

- 코틀린이 null에 대한 정보를 알수 없는 타입으로 처리를 개발자에게 전적으로 맡긴다.
- **오직 자바에서 가져온 타입만 플랫폼 타입이 될 수 있다.**
  - 즉 자바에서 가져온 타입을 쓸 땐 null에 대해 주의를 기울여야 한다.

#### 왜 플랫폼 타입이 생겼나?

- 만약 자바타입을 모두 Nullable 타입으로 취급했다면 컬렉션을 사용할 때 ArrayList\<String?>? 이런식으로 ?를 남발해야 한다.
- 모든 자바타입에 null 검사를 하는건 null 안정성보다 비용이 더 크기 때문에 플랫폼 타입을 두어 개발자가 처리할 수 있도록 하였다.

> 실제로 null인 플랫폼 타입을 null 불가능한 타입으로 변환을 시도하면 런타임 에러가 발생할 수 있다.

#### 자바 메서드 오버라이드

- 자바 메서드를 오버라이드하고, 메서드 변수가 null 불가능한 타입으로 선언된다면 null 아님을 단언하는 validation을 자동으로 추가해준다.
  :::

### 코틀린의 원시타입

::: details 자세히

- 코틀린은 원시 타입과 래퍼 타입의 구분이 없다. 코틀린 내부적으로 런타임에 가장 효율적인 방식으로 처리한다.
  - 대부분의 Int 타입은 자바 int로 컴파일되며, 컬렉션이나 제네릭 같은곳에서만 래퍼 객체를 사용한다.
    :::

### Any, Any?: 최상위 타입

- 자바의 Object와 비슷하다. 즉 Any는 자바에서 Object로 컴파일 된다.

### Unit

- 자바의 void와 같은 기능을 한다.

### Nothing

::: details 자세히

```kotlin
// 정상적으로 끝날 수 없는 함수
fun fail(message: String): Nothing {
  throw RuntimeException(message)
}

fun main() {
  // fail은 정상적으로 끝나지 않는 함수임을 알수 있으므로 country가 null이 아님을 확신할 수 있다.
  val country = Address("city", "country").country ?: fail("No City")
}
```

- Nothing 타입은 오직 반환 타입으로만 쓸 수 있으며 `Nothing을 반환하는 함수는 정상적으로 끝나지 않음을 의미한다.`
  :::

### 코틀린과 자바 컬렉션

::: details 자세히

- 코틀린의 모든 컬렉션은 자바 컬렉션 인터페이스의 구현체이므로 언제든지 서로 오갈 수 있다.
- 코틀린은 자바 컬렉션을 구현했지만 읽기 전용 클래스와 변경 가능 컬렉션(MutableCollection)을 분리했다.
  :::

### 배열

::: details 자세히

```kotlin
fun main(args: Array<String>) {
  // array index for
  for (index in args.indices) {
  }

  // list -> array
  listOf(1).toIntArray()

  // array도 람다식으로 생성 가능
  val array: Array<String> = Array(12) { it.toString() }
  IntArray(5)
  intArrayOf(1, 2, 3, 4, 5)

  // array map도 가능하며 결과를 List가 됨
  val map: List<String> = array.map { it + 1 }

  // index, element for문도 가능하다.
  array.forEachIndexed { index, element -> println("index: $index, value: $element") }
}
```

- 코틀린은 배열에 대해서도 다양한 api를 제공해준다.
  :::

## 7장. 연산자 오버로딩과 기타 관례

### 산술 연산자 오버로딩

::: details 자세히

```kotlin
/**
 * a * b = times
 * a / b = div
 * a % b = mod(rem)
 * a + b = plus
 * a - b = minus
 *
 * 연산자 우선순위는 숫자 형태와 동일하게 적용된다.
 */
data class Point(val x: Int, val y: Int) {
  // 연산자 오버로딩은 opertator를 붙여줘야 한다.
  operator fun plus(other: Point): Point = Point(x + other.x, y + other.y)

  // 연산자 오버로딩도 오버로딩이 가능하므로 다양하게 만들 수 있다.
  operator fun plus(number: Int) = Point(x + number, y + number)
}

// 확장 함수로도 가능하다.
operator fun Point.minus(other: Point) = Point(x - other.x, y - other.y)

// 연산자 오버로딩 파라미터가 꼭 같을 필요가 없다.
operator fun Point.times(scale: Double) = Point((x * scale).toInt(), (y * scale).toInt())

// 교환 법칙은 성립되지 않으므로 이렇게 반대로 사용하기 위해 직접 정의해줘아 한다.
operator fun Double.times(p: Point) = Point((p.x * this).toInt(), (p.y * this).toInt())

fun main() {
  val p1 = Point(10, 20)
  val p2 = Point(30, 70)
  println(p1 + p2)
  println(p2 - p1)
  println((p2 + p1) * 0.3)
  println(0.3 * (p2 + p1))
}
```

:::

### 복합 대입 연산자 오버로딩

::: details 자세히

```kotlin
// 현재 리스트를 그대로 유지하면서 복합 연산자 오버로딩을 수행한다.
operator fun <T> MutableCollection<T>.plusAssign(element: T) {
  this.add(element)
}

fun main() {
  val numbers = arrayListOf<Int>()
  numbers += 1
  println(numbers[0])
  // 사실 +=는 plus, plusAssign 모두 컴파일 가능하다. 그러므로 둘 중하나만 정의해야 한다.
  // 빌더와 같이 변경 가능한 클래스라면 plusAssign, 그렇지 않고 불변 객체라면 plus를 제공해주자.
  numbers += 2
  println(numbers[1])
}
```

- +=와 같은 복합 대입 연산자는 연산 후 참조를 그대로 유지하고 싶을때 유용하다.

#### 코틀린 표준 라이브러리의 연산자 오버로딩 규칙

- +, -는 항상 새로운 컬렉션을 반환한다.
- 변경 가능한 컬렉션에서의 +=, -=는 메모리에 있는 객체 상태를 변경시킨다.
- 읽기 전용 컬렉션의 경우 복사본을 반환한다.
  :::

### 단항 연산자 오버로딩

::: details 자세히

```kotlin
/** 단항 연산자 (함수 파라미터가 없다)
 *  +a = unaryPlus
 *  -a = unaryMinus
 *  !a = not
 *  ++a, a++ = inc (표현은 같지만 실행 시점이 다름)
 *  --a, a-- = dec (표현은 같지만 실행 시점이 다름)
 */
operator fun Point.unaryMinus() = Point(-x, -y)

fun main() {
  val p1 = Point(10, 20)
  println(-p1)
}
```

:::

### 비교 연산자 오버로딩

::: details 자세히

```kotlin
/** 동등 비교 연산자
 * a == b -> a?.equals(b) ?: (b == null)
 * - 동등성 검사는 null 검사도 하기때문에 null도 동등성 검사가 가능해진다.
 * - != 는 ==의 반대 결과 값을 반환해준다.
 * - equals도 Any를 확인해보면 연산자 오버로딩을 활용한 것이다.
 */


/** 순서 연산자
 *  자바의 Comparable에 들어있는 메서드를 관례로 사용한다.
 *  a >= b -> a.compareTo(b) >= 0
 */

class Person(
        val firstName: String, val lastName: String
) : Comparable<Person> {
  override fun compareTo(other: Person): Int {
    // 인자로 받은 함수를 차례로 호출하면서 값을 비교해줌
    return compareValuesBy(this, other, Person::lastName, Person::firstName)
  }
}

fun main() {
  // Comparable을 연산자 오버로딩으로 사용하기 때문에 기본 JAVA 클래스가 Comparable을 구현했다면 연산자 오버로딩을 사용할 수 있다.
  println("asd" < "csd")
}
```

:::

### get, set 관례

::: details 자세히

```kotlin
// get 관례는 [index or key]와 같이 접근을 가능하게 해준다.
operator fun Point.get(index: Int): Int {
  return when (index) {
    0 -> x
    1 -> y
    else -> throw IndexOutOfBoundsException("Invalid")
  }
}

data class MutablePoint(var x: Int, var y: Int)

// set 또한 관례가 존재하며 p[index] = value로 값을 세팅할 수 있다.
// 마지막 파라미터만 연산자의 우항, 나머지는 연산자의 좌항의 []안에 들어가게 된다.
// 즉 x[a, b] = c -> x.set(a, b, c) 이런식으로 사용할 수 있다.
operator fun MutablePoint.set(index: Int, value: Int) {
  when (index) {
    0 -> x = value
    1 -> y = value
    else -> throw IndexOutOfBoundsException("Invalid")
  }
}

fun main() {
  val point = Point(10, 20)
  println(point[0])
  println(point[1])

  val mutablePoint = MutablePoint(10, 20)
  println(mutablePoint)
  mutablePoint[0] = 30
  println(mutablePoint)
}
```

:::

### in 관례

::: details 자세히

```kotlin
data class Rectangle(val upperLeft: Point, val lowerRight: Point)

// in 연산자는 comtains와 대응된다.
operator fun Rectangle.contains(p: Point): Boolean =
// until은 x <= value < y 인 범위를 의미한다.
        // ..은 x  <= value <= y를 의미힌다.
        p.x in (upperLeft.x until lowerRight.x) && p.y in (upperLeft.y until lowerRight.y)

fun main() {
  val p1 = Point(10, 20)
  val p2 = Point(50, 50)
  val rectangle = Rectangle(p1, p2)

  // in의 좌항이 해당 함수의 파라미터가 되고 우항은 contains를 소유한 객체이다.
  println(Point(20, 30) in rectangle)
}
```

:::

### rangeTo 관례

::: details 자세히

```kotlin
/** start..end -> start.rangeTo(end)
 *  - rangeTo는 함수의 **범위를 반환**
 *  - Comparable 인터페이스를 구현하고 있으면 rangeTo를 정의할 필요가 없다.
 *  - 코틀린 표준 라이브러리를 통해 비교 가능한 원소로 만들 수 있다.
 *      - operator fun <T: Comparable<T>> T.rangeTo(that: T): ClosedRange<T>
 */

fun main() {
  val now = LocalDate.now()

  // now.range(now.plusDays(10)) 이 된다.
  val vacation = now..now.plusDays(10)
  println(now.plusDays(3) in vacation)
}
```

:::

### for 루프 iterator 관례

::: details 자세히

- for 루프에서 사용하는 in은 iterator를 호출해 hasNext, next 호출을 반복하는 식으로 변환된다.

```kotlin
// range에 대한 for문을 돌리기 때문에 ClosedRange<>.iterator를 정의한다.
operator fun ClosedRange<LocalDate>.iterator(): Iterator<LocalDate> =
        object : Iterator<LocalDate> {
          var current = start

          override fun hasNext() = current <= endInclusive

          override fun next() = current.apply {
            current = current.plusDays(1)
          }
        }

fun main() {
  // iterator 메서드를 확장 함수로 정의할 수 있기 떄문에 자바 문자열에 대한 for 루프가 가능해진다.
  for (c in "asd") {
    println(c)
  }

  val now = LocalDate.now()
  // 위에서 정의한 iterator를 이용해 for문을 돌릴 수 있다.
  for (date in (now..now.plusDays(10))) {
    println(date)
  }
}
```

:::

### 구조 분해 관례

::: details 자세히

```kotlin
/** 구조 분해 관례
 *  - val (a, b) = p --> a = p.component1(), b = p.component2()
 *  - data 클래스는 주 생성자 들에 들어 있는 프로퍼티에 대해서는 자동으로 컴파일러가 componentN을 만들어 준다.
 *  - 구조분해는 이터레이터와 함께 루프문에서 매우 유용하다.
 */

// 일반 클래스에는 직접 정의할 수 있다.
class NewPoint(val x: Int, val y: Int) {
  operator fun component1() = x
  operator fun component2() = y
  // (x, y) = NewPoint(1, 2) 이렇게 가능
}

// data class에 대해선 컴파일러가 자동으로 componentN 함수를 만들어준다.
data class NamedComponents(val name: String, val extension: String)

fun splitFilename(fullName: String): NamedComponents {
  val result = fullName.split('.', limit = 2)
  return NamedComponents(result[0], result[1])
}

fun splitFilename2(fullName: String): NamedComponents {
  // 배열도 component를 제공하므로 이렇게 써도 된다.
  // 코틀린 표준 라이브러리에서는 맨 앞의 다섯 원소에 대해 componentN을 제공한다.
  val (name, extesion) = fullName.split('.', limit = 2)
  return NamedComponents(name, extesion)
}

fun main() {
  // 구조 분해를 활용하면 값을 간단히 풀어서 가져올 수 있다.
  val (name, extension) = splitFilename("helloWorld.kt")
  println("$name.$extension")
}
```

:::

### 위임 프로퍼티

::: details 자세히

```kotlin
class Foo {
  // 이렇게 위임을 설정할 수 있다.
  var p: Type by Delegate()

  // 위와 같이 설정하면 실제 set, get은 delegate로 위임되어 로직이 수행될 것이다.
  private val delegate = Delegate()
  var p: Type
    set(value: Type) = delegate.setValue(..., value)
  get() = delegate.getValue(...)
}
```

- 위임 프로퍼티를 사용하면 값을 단순히 backing field에 저장하는것 보다 더 복잡한 방식으로 작동하는 프로퍼티를 구현할 수 있다.
  - 예를들어 프로퍼티 위임을 통해 자신의 값을 필드가 아닌 DB 테이블, 세션, 맵등에 저장이 가능하다.
- 이는 도우미 객체인 위임 객체가 필요하다.

#### 지연 초기화를 백킹 필드를 통해 구현

```kotlin
/** 이러한 패턴은 매우 자주 사용된다.
 * - 뒷받침하는 프로퍼티를 이용해 데이터를 지연 초기화 하는 기법이다.
 * - 하지만 이 방식은 스레드 안전하지 않고 프로퍼티가 많을 수록 귀찮아 질 것이다.
 */
class Person3(val name: String) {
  private var _emails: List<String>? = null
  val emails: List<String>
    get() {
      // emails은 딱 한번만 가져온다.
      if (_emails == null) {
        _emails = loadEmails(this)
      }
      return _emails!!
    }
}
```

#### 위임 프로퍼티 활용: by lazy()를 사용한 프로퍼티 초기화 지연

```kotlin
class Person4(val name: String) {
  /** 위임 프로퍼티는 백킹 필드와 값이 오직 한번만 초기화 됨을 보장하는 get 로직을 함께 캡슐화 해준다.
   *  - lazy 함수가 위임 객체를 반환하는 표준 라이브러리이다.
   *  - lazy 함수는 코틀린 관례에 맞는 getValue 메서드가 들어있는 객체를 반환해준다.
   **/
  val emails by lazy { loadEmails(this) }
}
```

:::

### 위임 프로퍼티 구현해보기

::: details 자세히

- 위임 프로퍼티 없이 프로퍼티 변경을 리스너에 통지해주는 기능을 구현하보고 그 후에 위임 프로퍼티를 사용하는 방식으로 리팩터링 한다.

#### 기본 자바 빈즈를 이용해 구현

```kotlin
// 리스너의 목록을 관리하고 이벤트가 들어오면 통지한다
open class PropertyChangeAware {
  protected val changeSupport = PropertyChangeSupport(this)

  fun addPropertyChangeListener(listener: PropertyChangeListener) {
    changeSupport.addPropertyChangeListener(listener)
  }

  fun removePropertyChangeListener(listener: PropertyChangeListener) {
    changeSupport.removePropertyChangeListener(listener)
  }
}

class MyPerson(
        val name: String, age: Int, salaray: Int
) : PropertyChangeAware() {
  var age: Int = age
    set(value) {
      val oldValue = field
      field = value
      changeSupport.firePropertyChange("age", oldValue, value)
    }

  var salary: Int = salaray
    set(value) {
      val oldValue = field
      field = value
      changeSupport.firePropertyChange("salary", oldValue, value)
    }
}

fun main() {
  val myPerson = MyPerson("Jayden", 26, 1234)
  myPerson.addPropertyChangeListener(
          PropertyChangeListener { event ->
            println("Property ${event.propertyName} changed from ${event.oldValue} to ${event.newValue}")
          }
  )

  myPerson.age = 30
  myPerson.salary = 5500
}
```

#### 공통 모듈을 뽑아내서 재사용성 증가 시키기

```kotlin
class ObservableProperty(
        private val propName: String,
        private var propValue: Int,
        private val changeSupport: PropertyChangeSupport
) {
  fun getValue(): Int = propValue
  fun setValue(newValue: Int) {
    val oldValue = propValue
    propValue = newValue
    changeSupport.firePropertyChange(propName, oldValue, newValue)
  }
}

class MyPerson(
        val name: String, age: Int, salaray: Int
) : PropertyChangeAware() {
  val _age = ObservableProperty("age", age, changeSupport)
  var age: Int
    get() = _age.getValue()
    set(value) = _age.setValue(value)

  val _salary = ObservableProperty("salary", salaray, changeSupport)
  var salary: Int
    get() = _salary.getValue()
    set(value) = _salary.setValue(value)
}
```

- 도우미 클래스를 통해 get, set을 위힘하여 변경을 통지하도록 할 수 있다.

#### 위임 프로퍼티 구현 후 적용

```kotlin
class ObservableProperty(
        private var propValue: Int,
        private val changeSupport: PropertyChangeSupport
) {
  // 위임을 위해 코틀린 관례에 맞게 operator를 붙이고, 해당 객체를 프로퍼티를 넘겨줘야 한다.
  operator fun getValue(p: MyPerson, prop: KProperty<*>): Int = propValue
  operator fun setValue(p: MyPerson, prop: KProperty<*>, newValue: Int) {
    val oldValue = propValue
    propValue = newValue
    changeSupport.firePropertyChange(prop.name, oldValue, newValue)
  }
}

class MyPerson(
        age: Int, salary: Int
) : PropertyChangeAware() {
  // by 오른쪽의 객체를 **위임 객체**라고 부른다.
  // 코틀린은 위임 객체를 감춰진 프로퍼티에 저장하고, 주 객체의 프로퍼티를 읽거나 쓸때마다 위임 객체의 getValue, setValue를 호출해준다.
  var age: Int by ObservableProperty(age, changeSupport)
  var salary: Int by ObservableProperty(salary, changeSupport)
}
```

#### 코틀린 지원 라이브러리로 위임 객체 만들기

```kotlin
class MyPerson(
        age: Int, salary: Int
) : PropertyChangeAware() {
  /** observer를 정의하고 코틀린 위임 객체에 넘겨주면 된다.
   *  - 사실 위임 객체의 방법은 보이지 않는 접근자들을 만들어 주는 것이다.
   *  - get() -> <delegate>.getValue(v, <property>)
   *  - set() -> <delegate>.setValue(c, <property>, x)
   *  - 단순한 방법이지만 프로퍼티가 저장될 값을 맵, 디비 등으로 바꿀 수 있고, 프로퍼티를 읽거나 쓸 때 이벤트들을 추가하는 방식들을 간결하게 구현할 수 있다.
   */

  private val observer = { prop: KProperty<*>, oldValue: Int, newValue: Int ->
    changeSupport.firePropertyChange(prop.name, oldValue, newValue)
  }

  var age: Int by Delegates.observable(age, observer)
  var salary: Int by Delegates.observable(salary, observer)
}
```

:::

## 8장. 고차 함수

### 고차 함수 정의

::: details 자세히

- 고차 함수는 다른 함수를 인자로 받거나 함수를 반환하는 함수이다.
- 그러므로 filter, map, with 등이 모두 고차 함수로 볼 수 있다.
  :::

### 함수 타입

::: details 자세히

```kotlin
fun main() {
  // 함수도 타입이 존재한다. 타입을 명시하면 실제 람다식은 타입 추론이 가능하다.
  val sum: (Int, Int) -> Int = { x, y -> x + y }
  // nullable도 가능
  val sumNullable: (Int, Int) -> Int? = { x, y -> x + y }

  val actions: () -> Unit = { println(123) }
  // 함수 전체에 대해서도 nullable을 정의할 수 있다.
  val actionsNullable: (() -> Unit)? = { println(123) }


  fun performRequest(
          url: String,
          // 가독성을 위해 파라미터 이름을 정의할 수 있다.
          callback: (code: Int, contnet: String) -> Unit
  ) {
    callback(1, "Hello")
  }
  performRequest("url") { code, contnet -> //TODO()
  }

  // 함수 타입만 미리 정해놓을 수도 있다.
  fun toAndThree(operation: (Int, Int) -> Int) {
    val result = operation(2, 3)
    println("The result is $result")
  }
}
```

#### IntelliJ IDEA 팁

- 인텔리에는 디버깅할 때 람다 코드 내부를 한 단계씩 실행해볼 수 잇는 `스마트 스테핑을 제공`한다.
  :::

### 자바에서 코틀린 함수 타입

::: details 자세히

- 컴파일된 코드 안에서 함수 타입은 FunctionN인터페이스를 구현한 객체이다.
- FunctionN 인터페이스에는 invoke 메서드 정의가 하나 들어있기 때문에 자바에서도 코틀린 함수타입을 invoke를 통해 호출할 수 있게 된다.
  :::

### 안전한 nullable function 호출

::: details 자세히

```kotlin
fun <T> Collection<T>.joinToString(
        separator: String = ", ",
        prefix: String = "",
        suffix: String = "",
        transform: ((T) -> String)? = null
): String {
  val list = this
  return buildString {
    append(suffix)
    for ((index, element) in list.withIndex()) {
      if (index > 0) append(separator)
      // 람다식은 invoke 함수를 가지는 인터페이스임을 활용하여 null check를 사용할 수 있다.
      val str = transform?.invoke(element) ?: element.toString()
      append(str)
    }
    append(suffix)
  }
}
```

:::

### 함수를 반환하는 함수 만들기

::: details 자세히

```kotlin
data class Person(
        val firstName: String,
        val lastName: String,
        val phoneNumber: String?
)


fun getPredicate(prefix: String = "", onlyWithPhoneNumber: Boolean = false): (Person) -> Boolean {
  val startsWithPrefix = { p: Person -> p.firstName.startsWith(prefix) || p.lastName.startsWith(prefix) }
  if (!onlyWithPhoneNumber) {
    return startsWithPrefix
  }
  // 함수 반환 타입으로 유추가 가능하므로 람다식을 반활할때도 it을 활용할 수 있다. 
  return { startsWithPrefix(it) && it.phoneNumber != null }
}
```

:::

### 인라인 함수: 람다의 부가 비용 없애기

::: details 자세히

- 코틀린이 보통 람다를 익명 클래스로 컴파일하지만 그렇다고 람다를 사용할 때마다 익명 클래스처럼 새로운 클래스를 만들지 않는다.
- 하지만 **람다가 변수를 포획하여 상태를 가지고 있게 되면 람다가 생성되는 시점마다 새로운 익명 클래스 객체가 생성될 것이다.**
- 이런 경우에는 실행 시점에 익명 클래스 생성에 대한 부가 비용이 발생하여 성능저하가 일어날 수 있다.
- **inline 변경자를 활용하면 컴파일러는 해당 인라인 함수를 호출하는 곳에 함수 본문에 해당하는 바이트 코드를 복사하여 컴파일 시켜준다.**
  :::

### 인라이닝이 작동하는 방식

::: details 자세히

```kotlin
// 이 함수는 inline을 사용했으므로 자바의 synchronized 문과 같을 것이다.
inline fun <T> synchronized(lock: Lock, action: () -> T): T {
  lock.lock()
  try {
    return action()
  } finally {
    lock.unlock()
  }
}

// ### 기존 함수 -> 실제 컴파일 시 인라인된 foo 함수처럼 바이트코드가 함수 본문에 삽입된다.
fun foo(l: Lock) {
  println("Before sync")

  synchronized(l) {
    println("Action")
  }
  println("AfterSync")
}

// ### 인라인된 foo 함수 ###
fun foo(l: Lock) {
  println("Before sync")

  // synchronized함수와 synchronized함수에 전달된 람다 표현식까지 인라이닌된다.          
  lock.lock()
  try {
    println("Action")
  } finally {
    lock.unlock()
  }
  println("AfterSync")
}
```

- 인라인을 활용하면 함수를 호출하는 바이트코드 대신 함수 본문을 번역한 바이트코드로 컴파일될 것이다.

> 한 인라임 함수를 여러곳에서 사용하면 호출하는 곳에 각각 바이트 코드를복사하므로 바이트코드가 거대해질 수 있다.
:::

### 인라인 함수의 한계

::: details 자세히

- **모든 람다식을 인라이닝할 수 없다.**
- 인라이닝은 람다식을 본문에 직접 펼치기 때문에 상황에 따라 이러한 방식이 불가능 할 때가 존재한다.
- 예를들어 함수의 파라미터에 람다식이 있고 그 람다식을 바로 호출한다면 쉽게 인라이닝이 가능하다.
- **하지만 파라미터로 받은 람다식을 다른 변수에 저장한다면 그 변수는 객체의 참조를 가져야 한다.**
- 이 경우엔 함수의 본문에서 람다에 대한 참조를 가져야 하므로 인라이닝이 불가능하다.
  - 이러한 상황에 대비하여 의도적으로 인라이닝을 하지 못하도록 notinline 변경자를 붙여 인라인을 금지시킬 수 있다.

> 인라인 함수의 본문에서 람다 식을 바로 호출하거나, 해당 람다 식을 인자로 전달받아 바로 호출하는 경우에 해당 람다를 인라이닝할 수 있다.
:::

### 컬렉션 연산 인라이닝
::: details 자세히
- 컬렉션의 filter 같은 함수는 인라인 함수이기 때문에 filter 함수의 바이트코드는 그 함수에 전달된 람다 본문의 바이트코드와 함께 filter를 호출한 위치에 들어가게 된다.
  - 그러므로 직접 if문을 작성하는 것과 바이트코드는 거의 동일하여 성능은 차이가 없다.
    :::

### 시퀀스와 인라이닝
::: details 자세히

- 시퀀스는 지연 계산을 위해 filter와 같은 함수를 객체로 가지고 있어야 하므로 인라이닝할 수 없다.
- **그러므로 지연 계산을 지원하는 시퀀스가 기본 컬렉션 함수보다 성능이 항상 좋은건 아니다. 오직 지연 계산의 이점이 필요할때만 성능이 좋다**
  :::

### 함수를 인라인으로 선언해야 할 때
::: details 자세히
- 람다를 인자로 받는 함수를 인라이닝하면 이점이 많다.
  - JVM은 함수 호출과 람다를 인라이닝 해줄 정도로 똑똑하지 못하기 때문에 성능을 향상시킬 가능성이 있다.
  - 인라이닝을 활용하면 함수 호출 비용을 줄일 수 있고, 람다로 표현하는 클래스와 람다 인스턴스에 해당하는 객체를 만들 필요가 없어진다.
  - 일반 람다 표현식으로는 하지 못하는 non-local return 같은 기능도 활용할 수 있다.
    :::

### 함수를 인라인으로 선언하지 말아야 할 때
::: details 자세히
- 람다를 인자로 받는 함수 같은 경우가 아니라 일반 함수 호출은 경우엔 JVM이 이미 강력하게 최적화를 시켜준다.
  - JIT 컴파일러가 기계어로 변환할 때 캐싱기법등을 활용하여 일반 함수 호출에 대한 최적화를 시켜준다.
  - 만약 코틀린 인라이닝을 사용하게 되면 바이트코드 중복이 발생하므로 오히려 성능에 불리하다.
    :::

### 인라인 함수를 사용할 때 주의할 점
::: details 자세히
- 인라인 함수는 해당 함수의 본문에 해당하는 바이트코드를 호출 지점에 복사하기 때문에 인라인 함수의 코드 크기가 크다면 바이트코드가 상대적으로 매우 커질 수 있으므로 인라인 함수는 최대한 짧게 정의하는 것이 좋다.
  - 코틀린 기본 지원 inline 함수들을 보면 모두 크기가 아주 작다는 사실을 알 수 있다.
    :::

### 인라인 함수 활용 예
::: details 자세히
```kotlin
fun main() {
  // Closeable을 구현체들은 inline 확장함수인 use를 사용할 수 있다.
  // use 인라이닝 함수는 내부적으로 자원 할당을 해제해주기 때문에 간편히 Closeable 구현체를 사용할 수 있다.
  BufferedReader(FileReader(""))
          .use { doRun(it) }
}

fun doRun(bufferedReader: BufferedReader): List<String> {
  return listOf(bufferedReader.readLine())
}
```
:::

### 인라인 함수의 non-local return

::: details 자세히
```kotlin
fun lookForAlice(people: List<Person2>) {
  // 일반적인 for문에서는 발견즉시 for문을 종료하여 함수를 리턴할 수 있다.
  for (person in people) {
    if (person.name == "Alice") {
      println("Found")
      return
    }
  }
  println("Alice is not found")

  // 코틀린은 자바와 다르게 forEach에서도 for문과 같이 return이 가능해진다.
  // 여기서 return은 lookForAlice 함수의 return이 된다.
  // 이렇게 자신의 상위 스코프의 블록을 반환하게 만드는 것을 non-local return이라고 부른다.
  // inline 함수가 되어 forEach 구문의 바이트코드가 실제 lookForAlice본문에 존재하게 되므로 이러한 동작이 가능하다.
  people.forEach {
    if (it.name == "Alice") {
      println("Found")
      return
    }
  }
  println("Alice is not found")
}
```
:::

### 레이블을 활용한 로컬 return

::: details 자세히
```kotlin
fun lookForAlice2(people: List<Person2>) {
  // 로컬 리턴은 for 루프의 break과 비슷한 역할을 수행해준다.
  people.forEach label@{
    if (it.name === "Alice") return@label
  }
  println("Alice might be somewhere")

  people.forEach {
    // 로컬 리턴을 함수 이름을 통해 할 수도 있다.
    if (it.name === "Alice") return@forEach
  }
}
```

> 람다식의 레이블을 명시하면 함수명을 활용할 수 없다. 그리고 람다 식에는 레이블이 2개 이상 붙을 수 없다.

```kotlin
fun main2() {
  // 레이블은 this에도 적용된다.
  // 레이블을 걸면 일반 this는 외부 참조를 가지게 될 것이다.
  StringBuffer().apply sb@{
    this@sb.append("Hello World")
  }
}
```

- local 반환문은 장황하고, 람다 안에 여러 위치에 return@label이 필요해지면 사용이 불편한다.
- 그래서 코틀린은 코드 블록을 여기저기 전달하기 위한 다른 해법을 제공하며 그것이 바로 `익명 함수`이다.

#### 익명함수는 기본적으로 로컬 return이다.

```kotlin
fun lookForAlice3(people: List<Person2>) {
  people.forEach(fun(person) {
    // return은 익명 함수를 지칭한다.
    if (person.name == "Alice") return
    println("${person.name} is not Alice")
  })

  // 반환 타입은 명시해줘야 한다.
  people.filter(fun(person): Boolean { return person.age < 30 })

  // 식이 본문인 함수를 활용하면 리턴타입이 및 명시적 리턴이 필요없다.
  people.filter(fun(person) = person.age < 30)
}
```

- 익명함수는 일반 함수와 동일하나 함수 이름이나 파라미터 타입을 생략할 수 있는 차이일 뿐이다.

> 람다 함수는 기본적으로 논로컬 리턴을 특징으로 하고 익명 함수는 로컬 리턴을 특징으로 한다.
> - 람다는 label을 통해 로컬 리턴이 가능하지만 익명 함수는 논로컬 리턴이 불가능하다.
> - 익명 함수는 일반 함수와 같아보이지만 사실 람다 식의 문법적 편의일 뿐이다.  
    :::

## 9장. 제네릭스
### 제네릭 타입 파라미터
::: details 자세히
- **자바와 다르게 코틀린은 raw 타입을 허용하지 않으므로 제네릭 타입의 타입인자를 컴파일러가 알 수 있게 해줘야 한다.**
- 제네릭의 기본적인 특징은 자바랑 대부분 동일하다.

```kotlin
// 타입 파라미터에 여러 제약을 가할 수 있다.
// T 타입은 반드시 CharSequence와 Appendable을 구현한 구현체여야 한다.
fun <T> ensureTrailingRerioid(seq: T)
        where T : CharSequence, T : Appendable {
    if (!seq.endsWith('.')) {
        seq.append('.')
    }
}

// 타입파라미터는 nullable하므로 null 불가능하게 막을 수 있다.
fun <T : Any> test(t: T): Nothing = TODO()
```

:::

### 런타임의 제네릭: 타임 검사와 캐스트

::: details 자세히

- 코틀린도 자바와 동일하게 런타임엔 타입 파라미터 정보는 제거된다..
- 즉, 런타임에 타입 정보가 제거되므로 런타임에 제네릭 타입에 대한 검사는 불가능하다.
- 예를들어 자바에선 타입을 검사할 때`stringList is List`와 같이 제네릭 타입을 제외하고 검사 하지만 **코틀린은 제네릭 클래스에 반드시 제네릭 타입을 명시해야 한다.**
- `stringList is List<*>`와 같이 star projection을 활용할 수 있으며 런타임에 타입 정보를 알수있도록 **inline, reified**를
  활용하면 `stringList is List<String>`와 같이 타입 검사가 가능하다.

#### 실체화한 타입 파라미터를 사용한 함수 선언

- 제네릭 클래스건 함수건 런타임엔 타입이 소거되어 확인이 불가능하지만, 인라인 함수의 타입 파라미터는 실체화시킬 수 있다.

```kotlin
// inline 함수와 reified를 활용하면 실체화된 타입으로 취급할 수 있다.
inline fun <reified T> isA(value: Any) = value is T

fun main() {
    println(isA<String>(1)) // false
    println(isA<String>("1")) // true

    // 실체화된 타입을 활용할 수 있는 예(원하는 타입의 원소만 가져옴)
    val items = listOf(1, "2", 3)
    println(items.filterIsInstance<Int>())
}
```

#### 왜 인라인 함수에서만 실체화된 타입을 쓸 수 있을까?
- 컴파일러는 인라인 함수의 바이트코드를 해당 함수를 호출한 모든 곳에 복사하여 삽입하는데 이 때 컴파일러는 실체화된 타입 인자를 통해 함수를 호출하는 곳에서의 정확한 타입을 알 수 있게 해준다.
  - **자바에서는 inline 함수도 보통의 함수처럼 호출하므로 reified를 사용하는 inline 함수를 호출할 수 없다.**
- 실체화한 타입 파라미터가 있는 함수는 타입 인자를 바이트코드에 넣기 위해 일반 함수보다 더 많은 작업 필요하고 이를 위해 반드시 inline이 가능해야 한다.

> 인라인 함수는 함수를 함수 파라미터로 가지는 등 성능에 효율적일 때 사용할 수도 있지만 위와 같이 실체화한 타입을 사용하기 위해 사용할 수도 있다.

:::

### 실체화한 타입으로 클래스 참조를 대신하기
::: details 자세히
```kotlin
// class에 대한 정보를 파라미터로 받음
fun <T> printClass(clazz: Class<T>) = println(clazz)

// 실체화를 통해 타입 정보를 타입 파라미터로 받아서 활용할 수 있음
inline fun <reified T> printClassUsingReified() = printClass(T::class.java)

fun main() {
    printClass(Integer::class.java)
    printClassUsingReified<Integer>()
}
```

> 실체화한 타입 파라미터는 타입 검사, 리플렉션 등으로 사용할 순 있지만 해당 인스턴스를 생성하거나, 동반 객체 메서드를 호출하는 등의 작업은 불가능하다.
:::


### 변성(variance): 제네릭과 하위 타입
- 변성(공변성, 무공변성, 반공변성)은 제네릭 타입의 기저 타입은 동일하나 타입 파라미터가 다를 때 서로 어떤 관계를 가지는지에 대한 개념으로 제네릭을 제대로 활용하기 위해 꼭 필요한 개념이다.

### 변성이 있는 이유: 인자를 함수에 넘기기
::: details 자세히
```kotlin
fun addContent(list: MutableList<Any>) {
  list.add(1)
}

fun main() {
  val strings = mutableListOf("a")
  // String은 Any의 하위타입이므로 List<Any>를 받는 함수 파라미터에 List<String>을 넘겨줄 수 있을거 같지만 
  // 실제 addContent 함수에서 처럼 Integer 타입이 추가될 수 있어 런타임 에러가 발생하여 타입 안전성을 보장해줄 수 없어 컴파일이 불가능하다.
  addContent(strings)  // ## 컴파일 에러 ##
}
```

- strings가 addContent의 파라미터로 들어가기 위해선 일반적인 함수 호출 방식에 따라 `MutableList<String>이 MutableList<Any>의 하위 타입`이 되어야 한다.

> 코틀린에서 T는 T?의 하위 타입이다. 즉 한 클래스에 두 가지타입(nullable type, not nullable type)이 존재한다.
:::

### 공변성: 하위 타입 관계를 유지

::: details 자세히

- A가 B의 하위 타입일 때 Service\<A>가 Service\<B>의 하위 타입이라면 이는 공변성을 가진다.
- **제네릭은 기본적으로 무공변성을 지니기 때문에** MutableList\<Any>을 기대하는 곳에 MutableList\<String>을 넣을 수 없다. (하위 타입이 아니기 때문에)
- 하지만 코틀린은은 타입 파라미터에 `out`이라는 명령어를 통해 타입 파라미터가 공변성을 가지도록 할 수 있다.

```kotlin
open class Animal
class Cat : Animal()
class Dog : Animal()

// out을 붙여 공변성을 지니게 하면 타입 안전성을 위해 해당 클래스는 타입 파라미터를 오직 out위치(생산)에 둘 수 있다.
class Herd<out T : Animal> {
  // T가 out 위치에 있으므로 가능. 해당 타입을 읽어 반환하는건 가능하다.
  fun getTypeParameter(): T = TODO()

  // T가 in 위치에 있으므로 에러 발생. 소비(쓰기)는 불가능
  // 공변성을 제공하게 되면 Herd<T>는 하위 타입인 Herd<Dog> or Herd<Cat>도 가능해진다. 
  // ## 만약 add 메서드를 사용할 수 있게 되면 Herd<Cat>인 인스턴스에서 add(t: Dog)가 호출될 수 있고 Dog는 Cat이 될 수 없어 런타임 에러를 발생시킬 수 있다. ## 
  // fun add(t: T) = TODO()
}

// Head<Dog> or Herd<Cat>이 오더라도 Head<>엔 소비하는 코드가 없고 오직 생산하는 코드만 있으므로 문제가 되지 않는다.
// - Dog이던 Cat이던 결군 상위 타입인 Animal이 될 수 있기 때문에 런타임 에러를 유발하지 않는다.
fun feedAll(animalHerd: Herd<Animal>) {
  for (animal in animalHerd.animals) {
    TODO()
  }
}

fun catTest(catHerd: Herd<Cat>) {
    // out을 지정해 공변성을 가지도록 하였으므로 Herd<Cat>은 Herd<Animal>의 하위 타입이 되어 호출이 가능하다.
    feedAll(catHerd)
}
```
- out 키워드를 붙이면 **공변성**은 제공해주나 이를 보장하기 위해 **내부에서 타입 파라미터를를 소비하는건 불가능하다.**
- List는 읽기 전용이므로 내부에서 요소를 소비할 일이 없기 때문에 out을 붙여 공변성을 보장해주도록 했다. 그래서 **MutableList\<>와 달리 List\<>는 공변성을 제공한다.**

> 변성(variance)은 코드에서 위험할 여지가 있는 함수를 호출하지 못하게 만들어 제네릭 타입의 안전성을 제공한다.
> - out 키워드는 내부에서 소비를 막아 공변성을 제공하더라도 제네릭 타입을 안전하게 사용할 수 있음을 보장한다.
:::

### 반공변성: 뒤집힌 하위 타입 관계
::: details 자세히
```kotlin
interface Comparator<in T> {
  /**
   * - 반공변하므로 Comparator<String>를 파라미터로 가지는 메서드에 Comparator<Any>가 전달될 수 있고 compare 메서드에 String 타입이 전달될 것이다.
   * - String은 Any의 하위타입이므로 compare(e1: Any, e2: Any)에 String이 타입이 전달되어 사용이 가능하다.
   */
  fun compare(e1: T, e2: T): Int

  /** T가 out 위치에 있으므로 컴파일 에러가 발생한다.
   *  - 현재 Comparator는 반공변성을 제공하므로 Comparator<Any>는 Comparator<String>의 하위 타입이 되어 Comparator<String>를 파라미터로 가지는 메서드에 Comparator<Any>를 전달할 수 있다.
   *  - 만약 해당 메서드에서 Comparator<Any>가 전달되었는데 get()을 호출하게 되면 String인 T가 반환되어야 한다. 하지만 실제론 Any이기 때문에 하위 타입인 String으로 반환이 불가능하다.
   */
  // fun get(): T
}


class StringComparator: Comparator<String> {
  override fun compare(e1: String, e2: String): Int {
    TODO("Not yet implemented")
  }
}

class AnyComparator: Comparator<Any> {
  override fun compare(e1: Any, e2: Any): Int {
    TODO("Not yet implemented")
  }
}

// Comparator<String>를 파라미터로 가지지만 반공변성을 가지므로 Comparator<Any>가 올 수 있다.
fun test(comparator: Comparator<String>) {
  comparator.compare("1", "2")
}

fun main() {
  val stringComparator = StringComparator()
  test(stringComparator)

  // Comparator는 반공변성을 가지므로 Comparator<Any>는 Comparator<String>의 하위타입이 되어 test 메서드를 호출할 수 있다.
  val anyComparator = AnyComparator()
  test(anyComparator)
}
```
- 반공변성은 공변성의 반대이다. 반공변성을 가지는 클래스는 위와 같이 타입 값을 소비하는 것만 가능하다.
- **Service\<A>가 Service\<B>의 하위 타입일 때 A가 B의 상위 타입이라면 Service\<T>는 타입T에 반공변하다.**
- in 키워드를 붙이면 반공변을 제공할 수 있고 이를 보장하기 위해 해당 클래스에선 소비만 가능하다.(in 위치에만 사용 가능)

```kotlin
public interface Function1<in P1, out R> : Function<R> {
    public operator fun invoke(p1: P1): R
}
```
- Function1 인터페이스를 보면 in, out을 모두 가질 수 있는 것을 알 수 있다.
:::

### 사용 지점 변성: 타입이 언급되는 지점에서 변성 지정
::: details 자세히
- 위에서 사용한 out, in 방식은 **선언 지점 변성**이라고 하며 클래스 선언 시 변성을 지정하면 모든 장소에 영향을 끼치므로 편리하다.
- 하지만 자바에서는 제네릭 클래스를 사용할 때마다 필요하다면 와일드 카드를 통해 직접 변성을 정의해야 하며 이를 **사용 지점 변성**이라고 한다.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    <R> Stream<R> map(Function<? super T, ? extends R> mapper);
}
```
- 자바는 사용 지점 변성이기 때문에 위와 같이 Function을 사용하는 모든곳에서 직접 변성을 지정해야 한다.

```kotlin
// 코틀린도 사용 지점 변성을 지원한다. 만약 클래스 에서 이미 변성이 지정되어 있다면 따로 사용 지점 변성을 하지 않아도 된다.
// 사용 지점 변성은 자바와 동일하기 떄문에 out T -> ? extends T, in T -> ? super T와 동일하다.
fun<T> copyData(source: MutableList<out T>,
                destination: MutableList<in T>) {
    for (item in source) {
        destination.add(item)
    }
}
```
:::

### 스타 프로젝션: 타입 대신 *
::: details 자세히
- 자바의 와일드 카드와 동일하게 생각하면 된다.
- Service\<*>는 사실 Service\<out Any?>로 동작한다고 할 수 있다.
- *는 어떤 타입을 넣을 지 정확히 모르지만 제네릭 안전성을 위해선 오직 out만 가능할 것이다.

> 스타 프로젝션은 자바 와일드 카드처럼 타입의 데이터를 읽기만하지만 어떤 타입인지 알 필요 없을 때 일반 제네릭 타입 파라미터보다 간결하게 사용할 수 있다.
:::

## 10장. 애노테이션과 리플렉션
- 코틀린에서 애노테이션을 사용하는 문법은 자바와 똑같지만 선언할 때 사용하는 문법은 약간 다르다.
- 리플렉션 API의 일반 구조도 자바와 같지만 세부 사항에서 약간 차이가 있다.

### 애노테이션 선언과 적용
::: details 자세히
- 코틀린 애노테이션 인자를 지정하는 문법은 자바아 약간 다르다.
  - 클래스를 애노테이션 인자로 지정 시 @Anno(MyClass::class)로 지정해야 함
  - 다른 애노테이션을 인자로 지정할 때 @는 제외시켜야 한다.
  - 배열을 인자로 지정하기 위해선 arrayOf를 사용해야 한다.
    - 자바의 애노테이션 사용시 기본 value에 대해선 생략 가능
  - 어떤 프로퍼티를 애노테이션의 인자에 넣기 위해선 const를 붙여줘야 한다.
    - 애노테이션의 인자는 컴파일 시점에 알 수 있어야 하기 때문에 상수로 취급되어야 한다.

```kotlin
class HasTempFolder {
    // 프로퍼티가 아닌 getter에 애노테이션을 명시하는 방법
    // @property는 코틀린 프로퍼티 전체(getter, field 등등)에 적용될 수 있게 할 수 있다.
    @get:MyAnno
    val folder = Any()
}

// 애노테이션은 메타데이터이기 때문에 내부에 코드를 가질 수 없다. 그러므로 코틀린 애노테이션은 본문을 가질 수 없다.
// 프로퍼티는 오직 주 생성자로 정의한다.
annotation class MyAnno
```
:::

### 자바 API를 애노테이션으로 제어
- @JvmName, @JvmStatic, @JvmOverloads, @JvmField등 애노테이션으로 자바 언어를 대신할 수 있는 애노테이션들을 제공한다.

### 리플렉션
- 코틀린 리플렉션을 사용하기 위해 **자바가 제공하는 표준 리플렉션과**, **코틀린이 제공하는 코틀린 리플렉션 API**를 사용할 수 있어야 한다.
- 자바 리플렉션에서 기본적인건 제공하지만 코틀린만의 특성을 지닌 Nullable 타입, 코틀린 고유개념에 대해선 코틀린 API가 필요하다.

### 코틀린 리플렉션 API: KClass, KCallable, KFunction, KProperty
::: details 자세히
```kotlin
class Person2(val name: String, val age: Int)

fun foo(x: Int) = println(x)
fun main() {
    val kClass: KClass<Person2> = Person2::class
    // 비확장 프로퍼티만
    kClass.memberProperties.forEach { println(it.name) }

    // 모든 프로퍼티
    // KCallable은 함수와 프로퍼티를 아우르는 상위 인터페이스로 call 메서드가 들어있고 call 메서드로 함수나 프로퍼티(getter)를 호출할 수 있다.
    val members: Collection<KCallable<*>> = kClass.members
    members.forEach { println(it.name) }

    // KFunction은 KCallable을 구현하므로 call 호출 가능
    val kFunction = ::foo
    kFunction.call()
}
```

```kotlin
var counter = 0
fun main() {
    // 최상위 프로퍼티는 Property0이다. 이 프로퍼티는 인자 없이 get을 호출한다.
    val kProperty: KMutableProperty0<Int> = ::counter
    kProperty.setter.call(10)
    Assert.isTrue(kProperty.get() == 10)

    val person = Person2("name", 1)
    // 객체의 프로퍼티는 Property1로 get호출 시 객체를 넘겨주면 된다.
    val ageProperty1: KProperty1<Person2, Int> = Person2::age
    Assert.isTrue(ageProperty1.get(person) == 1)
}
```

#### KFunctionN 인터페이스는 언제 어떻게 정의될까?
- KFunction들은 컴파일러가 생성한 합성 타입이기 때문에 정의를 찾을 수 없다.(실제 해당 구현체를 조회할 수 없음)
- **코틀린은 컴파일러가 자동으로 생성하는 방식을 활용하기 때문에 원하는 수만큼 많은 파라미터를 갖는 함수에 대한 인터페이스를 사용할 수 있는 것이다.**

#### KClass 얻기
- 컴파일 시점에 정확히 대상을 알고 있다면 ClassName::class로 얻을 수 있다.
- 만약 런타임에 동적으로 얻길 원한다면 object.javaClass.kotlin을 사용한다.
:::


## 11장. DSL 만들기

### API에서 DSL로
::: details 자세히
- 개발자의 궁극적인 목표는 코드의 가독성과 유지 보수성을 가장 좋게 유지하는 것이다.
- 깔끔한 API는 클래스와 메서드 명으로 어떤 일을 수행하는지 명확히 알 수 있고 간결한 코드를 제공한다.
- 코틀린이 제공하는 확장 함수, 중위 함수, 연산자 오버로딩 등등의 다양한 기능은 깔끔한 API를 작성하는데 많은 도움을 준다.
- 코틀린의 기능을 잘 활용하면 깔끔한 API에서 더 나아가 DSL을 구축할 수 있다.
:::


### Domain-Specific Language
::: details 자세히
- 특정 도메인 영역에 특화된 언어들 중 가장 대표적인건 SQL, 정규식이 존재한다.
  - SQL은 데이터베이스 조작, 정규식은 문자열 조작에 가장 적합하며 그 이외엔 거의 사용되지 않는다.
- 이 둘은 자신들만의 규칙을 통해 범용 프로그래밍 언어에 비해 훨씬 더 깔끔하게 원하는 연산을 수행할 수 있다.
- 범용 프로그래밍 언어는 보통 **명령적**특징을 가지지만, DSL은 **선언적**특징을 가진다.
  - 명령적 언어는 원하는 연산을 위해 각 순서를 정확히 기술하지만, 선언적 언어는 원하는 결과만을 기술하고 세부적인건 내부 구현에 맡긴다.
- DSL이 가지는 단점은 자기만의 고유한 문법이 있어 다른 언어와의 통합이 어렵고 DSL 문법을 따로 습득해야 하므로 개발비용이 높다.
  - 이러한 단점을 해결하기 위해 내부 DSL이 많이 활용된다.
:::

### 내부 DSL
- 내부 DSL은 범용 언어로 작성된 프로그램의 일부로, 범용 언어와 동일한 문법을 사용하여 DSL의 장점을 유지한채 단점을 해결할 수 있다.

### DSL의 구조
::: details 자세히
- DSL과 일반 API를 명확히 구분하긴 어렵지만 DSL이 고유하게 가지는 특징은 자신만의 구조와 문법을 가지는 것이다.
- 일반 라이브러리 API는 어떤 메서드를 호출하면 다른 호출과는 아무런 연결성이 존재하지 않는다.
- 반면 DSL은 메서드 호출 시 정해진 DSL 문법에 의해서 구조화 된다.
  - 코틀린에서는 람다를 중첩시키거나, 메서드 호출을 연쇄시키는 방법으로 DSL 구조를 만들 수 있다.
:::


### 구조화된 API 구축으로 DSL 만들기
::: details 자세히
- 코틀린의 확장함수의 특징과 수신 객체 지정 람다를 통해 구조화된 API를 손쉽게 만들 수 있다.
```kotlin
// 파라미터를 일반 람다로 정의
fun myBuildString(
        buildAction: (StringBuilder) -> Unit
): String {
    val sb = StringBuilder()
    buildAction(sb)
    return sb.toString()
}

// 파라미터를 확장 함수 타입의 람다로 정의(수신 객체 지정 람다)
fun myBuildString2(
        buildAction: StringBuilder.() -> Unit
): String {
    val sb = StringBuilder()
    sb.buildAction()
    return sb.toString()
}

// 실제 코틀린에 구현된 방식. apply를 활용하여 더 간다히 정의할 수 있다.
fun buildStringByKotlinLib (
        buildAction: StringBuilder.() -> Unit
) = StringBuilder().apply { buildAction }.toString()

// with를 활용할 수도 있다.
fun buildStringUsingWith(
        buildAction: StringBuilder.() -> Unit
) = with(StringBuilder(), buildAction).toString()

fun main() {
    // 일반 람다이므로 it을 명시적으로 붙여줘야 한다.
    myBuildString {
        it.append("hello")
        it.append("world")
    }

    // 수신 객체 지정 람다이므로 this가 자동적으로 바인딩되므로 it을 생략하여도 된다.
    myBuildString2 {
        append("hello")
        append("world")
    }
}
```
:::


### kotlinx 사용해보기
::: details 자세히
```kotlin
fun buildDropdown() = createHTML()
        .div(classes = "dropdown") {
            button(classes = "btn dropdown-toggle") {
                +"Dropdown"
                span(classes = "caret")
            }
            ul(classes = "dropdown-menu") {
                li { a("#") { +"Action" } }
                li { a("#") { +"Another action" } }
                li { role = "separator"; classes = setOf("divider") }
                li { classes = setOf("dropdown-header"); +"Header" }
                li { a("#") { +"Separated Link" } }
            }
        }


fun buildDropdown2() = createHTML()
        .div(classes = "dropdown") {
            button(classes = "btn dropdown-toggle") {
                +"Dropdown"
                span(classes = "caret")
            }
            // 코틀린 언어로 구현되었기 때문에 커스텀하게 tag를 만들 수 있다.
            dropdownMenu {
                item("#", "Action")
                item("#", "Another action")
                divider()
                dropdownHeader("Header")
                item("#", "Separated Link")
            }
        }

fun UL.item(href: String, text: String) = li { a(href) { +text } }
fun UL.divider() = li { role = "separator"; classes = setOf("divider") }
fun UL.dropdownHeader(text: String) = li { classes = setOf("dropdown-header"); +text }
fun DIV.dropdownMenu(action: UL.() -> Unit) = ul(classes = "dropdown-menu", action)
```
:::

### invoke 관례
::: details 자세히
```kotlin
class Greeter(private val greeting: String) {
    operator fun invoke(name: String) {
        println("$greeting, $name!")
    }
}

fun main() {
    val greeter = Greeter("Hello")
    // 관례로 인해 gretter.invoke("World")로 호출된다.
    greeter("World")
}
```
- 인스턴스를 함수처럼 호출하면 invoke가 자동으로 호출된다.

#### invoke 활용하기
```kotlin
class DEPENDENCIES {
    fun compile(text: String) {
        println(text)
    }
    
    // 자기자신을 호출할 때 스스로에 대한 람다를 받아 dsl 구문으로 받을 수 있다.
    operator fun invoke(body: DEPENDENCIES.() -> Unit) {
        body()
    }
}

fun main() {
    val dependencies = DEPENDENCIES()
    // invoke를 활용하면 dsl형식과 일반 메서드 호출 형식을 모두 지원하도록 할 수 있다.
    dependencies {
        compile("org.springframework.boot:spring-boot-starter-web")
    }
    dependencies.compile("org.springframework.boot:spring-boot-starter-web")
}
```
:::

### 중위 함수 활용
::: details 자세히
```kotlin
interface Matcher<T> {
    fun test(value: T)
}

class startWith(val prefix: String) : Matcher<String> {
    override fun test(value: String) {
        if (!value.startsWith(prefix)) {
            throw AssertionError("String $value does not start with $prefix")
        }
    }
}

// 중위 함수를 정의
infix fun <T> T.should(matcher: Matcher<T>) = matcher.test(this)

fun test1() {
    // DSL을 활용하면 테스트 코드를 깔끔하게 유지시킬 수 있다.
    "hello" should startWith("h")
}


// start는 단순히 dsl 문법을 위해 사용되는 것
object start

infix fun String.should(x: start) = StartWrapper(this)

class StartWrapper(val value: String) {
    infix fun with(prefix: String) =
            if (value.startsWith(prefix))
                Unit
            else
                throw AssertionError("String $value does not start with $prefix")
}

fun test2() {
    // 중위 함수를 활용하면 이렇게도 가능
    "hello" should start with "h"
}
```
:::

### 원시 타입에 확장 프로퍼티를 활용하여 날짜 처리를 간단히
::: details 자세히
```kotlin
// 확장 프로퍼티는 백킹필드를 가질 수 없으므로 getter로 직접 명시하여야 한다.
val Int.days: Period get() = Period.ofDays(this)

val Period.ago: LocalDateTime get() = LocalDateTime.now() - this
val Period.fromNow: LocalDateTime get() = LocalDateTime.now() + this
val LocalDateTime.toDate get() = this.toLocalDate()

fun main() {
    Assert.isTrue(1.days.ago.toDate == LocalDateTime.now().minusDays(1).toLocalDate())
    Assert.isTrue(1.days.fromNow.toDate == LocalDateTime.now().plusDays(1).toLocalDate())
}
```
:::

### SQL DSL 만들기
::: details 자세히
```kotlin
// Table 내부에서 컬럼에 대한 기능을 확장하여 Table에서만 사용할 수 있도록 한다.(이런걸 멤버 확장이라고 한다)
open class Table {
    fun integer(name: String) = Column<Int>()
    fun varchar(name: String, length: Int) = Column<String>()
    
    fun <T> Column<T>.primaryKey(): Column<T> = TODO()
    // 자동 증가는 int만 되도록 제한을 건다
    fun Column<Int>.autoIncrement(): Column<Int> = TODO()
}

class Column<T>

// Table에서 정의한 타입들을 활용하여 컬럼을 지정할 수 있다.
object Item: Table() {
    val id = integer("id").primaryKey().autoIncrement()
    val name = varchar("name", 50)
}
fun main() {
    // 컬럼에 필요한 함수들은 Table 내부에서 확장하여 사용하기 때문에 외부에선 호출을 불가능하게 캡슐화할 수 있다.
    // Column<Int>().primaryKey()
}
```
:::

> 코틀린은 다양한 기능으로 내부 DSL을 제공해줄 수 있으면서, 코틀린은 정적 타입 언어이므로 코틀린으로 내부 DSL을 만들면 자동 완성 및 문법 안정성을 보장받으면서 DSL를 사용할 수 있다.
