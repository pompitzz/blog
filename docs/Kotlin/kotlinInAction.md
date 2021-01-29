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

### 정적 타입 언어 장점
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
        when(e) {
            is Num -> e.value
            is Sum -> eval(e.left) + eval(e.right)
            else -> throw IllegalArgumentException()
        }

/**
 *  클래스의 프로퍼티를 스마트 캐스팅하고 싶다면 val이면서 커스텀 접근자가 정의되어 있지 않아야 한다.
 *  - var거나 커스텀 접근자가 있으면 언제가 같은 타입을 반환해준다는 것을 확신할 수 없기 때문에.. 
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
- 아규먼트에 디폴트 값을 지정할 수 있고 네이밍이 가능하다.
- named argument로 자바의 빌더를 대체할 수 있다.

#### Default Argument를 자바에도 지원하려면?
- @JvmOverloads를 붙이면 각각의 아규먼트에 맞는 오버로딩 메서드를 만들어준다.
:::
  
### 최상위 함수와 최상위 프로퍼티
::: details 자세히
#### 최상위 함수는 어떻게 생성될까?
- 바이트코드로 변환 후 자바로 디컴파일해보면 파일명Kt라는 클래스의 static 메서드로 정의된다.

#### 최상위 프로퍼티 val? const?
- 최상위 프로퍼티에 val, var 모두 사용 가능하다.
- val은 재할당이 불가능한건 맞지만 실제 호출 시 내부의 getter를 호출한다.
- 상수를 선언할 때 getter를 호출하는건 자연스럽지 못하므로 `const val NAME = "Dexter`와 같이 const를 붙여주자.
:::

### 확장 함수
::: details 자세히
- 기존에 만들어져 있던 클래스의 함수를 외부에서 추가하여 확장시키는 기법

```kotlin
// String의 확장 함수 정의. 확장이 될 대상을 **수신 객체 타입**이라고 칭하며 실제 함수가 호출된 수신 객체는 해당 함수에서 this로 참조가능
fun String.lastChar(): Char = this[this.length -1]
```

> 확장 함수는 캡슐화를 지키므로 수신 객체를 this로 참조하더라도 확장 함수에서는 접근이 제한된 대상은 접근이 불가능

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

    // 삼중 따옴표는 역슬래쉬를 두번써 이스케이핑이 필요 없다.
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
- 이는 클래스에도 적용되기 때문에 만약 클래스가 open되어 있다면 스마트 캐스트는 불가할 것이다.
:::
  
### 가시성 변경자
::: details 자세히
- 코틀린은 기본이 public이며 default 접근자는 따로 존재하지 않는다.
- 모듈 내부에서만 사용할 수 있는 internal 접근자를 따로 제공한다.
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
// 새로운 중첩 클래스가 생기면 when절을 반드시 구현해야 하므로 안전하다.
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
    // 다른 프로퍼티를 활용하여 커스텀 접근자를 가지는 프로퍼티를 구현할 수도 있다.(상태를 가지면 안되므로 Backing Field가 존재 안함)
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
            // backing field는 `field`로 접근가능 (get에서 field를 참조할 수 있지만 읽기만 가능하다.)
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
