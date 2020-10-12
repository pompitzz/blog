---
sidebar: auto
title: JAVA 매개변수(Parameter)수가 같은 오버로딩 메서드가 위험한 이유
date: 2020-07-15 22:41
img: java.png
tags: 
    - JAVA
---

- 객체지향언어인 자바에서는 메서드 시그니처(메서드 명, 메서드 파라미터들의 조합)를 통해 메서드를 구분하기 때문에 오버로딩을 통해 유연한 설계가 가능합니다.
- 하지만 오버로딩 메서드의 매개변수 수가 같을 경우 유연성 보다 혼란을 더 많이 얻게 될 확률이 높습니다.

## 오버로딩과 오버라이딩의 특징
- 오버로딩 메서드와 오버라이딩 메서드는 해당 메서드가 사용되는 시점의 차이가 존재하기 때문에 혼란이 생길 수 있습니다.

### 오버로딩 메서드 정의
```java
class Parent {
}

class Child extends Parent {
}

void print(Parent parent) {
    System.out.println("Parent");
}

void print(Child child) {
    System.out.println("Child");
}
```
- Child는 Parent를 확장하고 있고, Parent와 Child를 각각 매개변수로 가지는 print 오버로딩 메서드를 정의하였습니다.

```java
@Test
void printTest()throws Exception {
    print(new Parent());
    print(new Child());
}
```
- 해당 코드의 결과는 Parent, Child를 출력합니다.

```java
@Test
void printTest2() throws Exception {
    List<Parent> parents = Arrays.asList(
            new Parent(),
            new Child()
    );

    parents.forEach(parent -> this.print(parent));
}
```
- 하지만 해당 코드의 출력은 어떻게 될까요?
- **결과는 Parent가 두 번 출력됩니다.**
- 그렇다면 오버라이딩 메서드는 어떻게 동작할까요?

### 오버라이딩 메서드 정의
```java
class Parent {
    void print() {
        System.out.println("Parent");
    }
}

class Child extends Parent {
    @Override
    void print() {
        System.out.println("Child");
    }
}

@Test
void printTest3() throws Exception {
    List<Parent> parents = Arrays.asList(
            new Parent(),
            new Child()
    );

    parents.forEach(parent -> parent.print());
}
```
- 이번엔 위와같이 print 메서드를 오버라이딩한 후 결과를 확인해보면 Parent, Child가 각각 출력됩니다.
- 이러한 차이는 **오버로딩 메서드는 컴파일 시점에 정적으로 사용할 메서드가 선택되고, 오버라이딩 메서드는 런타임 시점에 동적으로 사용할 메서드가 선택되기 때문입니다.**
    - 오버로딩 메서드의 경우 컴파일 시점에 결정되기 때문에 List\<Parent>의 요소들은  Parent를 매개변수로 가지는 메서드가 호출됩니다.
    - 오버라이딩 메서드의 경우 런타임 시점에 결정되기 때문에 List\<Parent>라고 하더라도 실제 요소들의 타입의 오버라이딩 메서드가 호출됩니다.
    - 자바 기본 라이브러리에서도 오버로딩으로 인해 겪을 수 있는 문제들이 몇 가지 존재합니다.
    
## 오버로딩으로 겪을 수 있는 문제

### 리스트의 오버로딩
```java
@Test
void numbersTest() {
    // 1)
    final List<Integer> numbers1 = numbers();
    System.out.println(numbers1); // [-3, -2, -1, 0, 1, 2, 3]
    IntStream.rangeClosed(0, 3).forEach(numbers1::remove);
    System.out.println(numbers1); // [-2, 0, 2]
    
    // 2)
    final List<Integer> numbers2 = numbers();
    System.out.println(numbers2); // [-3, -2, -1, 0, 1, 2, 3]
    IntStream.rangeClosed(0, 3).boxed().forEach(numbers2::remove);
    System.out.println(numbers2); // [-3, -2, -1]
}

List<Integer> numbers() {
return IntStream.rangeClosed(-3, 3).boxed().collect(Collectors.toList());
}
```
- 2번의 코드는 중간에 IntStream에서 boxed()를 추가한 것 말고는 1번의 코드와 모두 동일합니다.
- boxed()는 박싱 타입으로 변환(int -> Integer)해주는 기능을 가지고 있습니다.
- 단지 박싱 타입으로 변환했을 뿐인데 서로 다른 결과가 발생하는 이유는 **오버로딩으로 인해 발생할 수 있는 문제입니다.**

```java
// List의 오버로딩 remove 메서드
boolean remove(Object o);

E remove(int index);
```
- 리스트는 remove메서드를 리스트의 index를 통해 제거할 수 있고, 혹은 리스트의 Element를 통해 제거할 수 있습니다.
    - 반환 타입이 다르지만 오버로딩 메서드인 이유는 게시글 처음에 언급했듯이 반환 타입은 메서드 파라미터에 포함되지 않기 때문입니다.
- 2번의 경우 Integer로 remove 메서드를 호출하기 때문에 동일한 값을 가지는 Element를 제거합니다.
- 1번의 경우 int로 remove를 호출하기 때문에 리스트의 index를 기준으로 Element를 제거하기 때문에 서로 다른 결과를 가지게 된 것입니다.

### ExecutorService.submit() 오버로딩
```java
@Test
void executorTest()throws Exception {

    final Thread thread = new Thread(System.out::println);

    final ExecutorService es = Executors.newCachedThreadPool();
    // es.submit(System.out::println); 컴파일 에러 발생
    es.submit((Runnable) System.out::println);
}
```
- 아래와 같이 Thread 생성자와 ExecutorService.submit 메서드는 매개변수로 Runnable을 가지고 있습니다.
- 하지만 ExecutorService에서는 Thread 생성 시 전달한 방식과 동일하게 Runnable을 전달하면 컴파일 에러가 발생합니다.
- 그 이유는 ExecutorService의 submit 메서드는 오버로딩을 통해 Callable or Runnable을 받을 수 있어 컴파일러가 어떤 메서드를 호출 할 것인지 정하지 못하기 때문입니다.
    - 이를 해결하기 위해선 명시적으로 사용할 타입을 선언해주어야 합니다.  

```java
// Executor Service submit 오버로딩 메서드
Future<?> submit(Runnable task);

<T> Future<T> submit(Callable<T> task);
```

## 결론
- 오버로딩 메서드를 정의할 때 매개변수 수를 다르게 정의한다면 예측 불가능한 결과를 예방할 수 있습니다.
- 매개변수 수가 같은 오버로딩 메서드들을 사용한다면 정확한 결과를 얻기 위해 명시적으로 형변환을 해주는 것이 좋습니다. 


### 참고자료
- [Effective Java 3/E](http://www.yes24.com/Product/Goods/65551284)
