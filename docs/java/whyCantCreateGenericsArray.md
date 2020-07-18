---
sidebar: auto
title: [JAVA] 제네릭 배열을 생성하지 못하는 이유
date: 2020-07-18 14:28
img: java.png
tags: 
    - JAVA
---

- 자바에서 제네릭 배열을 직접 생성하려고 하면 컴파일 에러가 발생합니다.
- 그 이유는 제네릭과 배열의 서로 다른 특징 때문에 제네릭이 사용되는 이유인 **타입 선언을 통한 타입 안정성을 보장해줄 수 없기 때문입니다.**

## 제네릭과 배열의 차이점
### 배열은 공변, 제네릭은 불공변
- 배열은 공변성을 가지므로 자기자신을 확장한 타입으로도 할당이 가능합니다.
- 반대로 제네릭의 타입파라미터는 불공변하므로 오직 자기자신의 타입만 할당할 수 있습니다.
- 객체지향적인 관점에서 바라보면 배열이 적합하고 제네릭이 이상한거 같지만 사실은 그 반대입니다. 

```java
Object[] objects = new String[1];
objects[0] = 1; // 컴파일은 되지만, 실행시간(런타임)에 예외가 발생한다.
```
- 배열은 공변성을 가지므로 Object 배열이 String 배열로 초기화되고, objects의 요소에 숫를 넣더라도 컴파일이 이루어집니다.
- 하지만 objects는 String 배열이므로 숫자를 가질 수 없어 런타임에 예외가 발생합니다.
- 자바를 사용하는 이유 중 하나가 정적 컴파일 언어로 시스템의 안정성을 높여주기 위함인데 배열의 이러한 특징은 컴파일 타임에 에러를 잡아주지못해 안전하지 않습니다.

```java
List<Object> objectList = new ArrayList<String>(); // 컴파일 조차 되지 않는다.
```
- 반대로 제네릭은 불공변성을 가지기 때문에 컴파일 조차 되지 않습니다.
- 이러한 차이와 더불어 배열과 제네릭은 실체화 유무에서도 차이가 발생합니다.

### 배열은 실체화되지만 제네릭은 실체화 불가능하다.
```java
Object[] objects = new String[1];
objects[0] = 1; // 컴파일은 되지만, 실행시간(런타임)에 예외가 발생한다.
```
- 이 코드가 런타임에 예외를 발생시킬 수 있었던 이유는 **배열은 실체화 되기 때문에 런타임에 자신이 담기로 한 원소타입(String)을 인지할 수 있습니다.**

```java
// 컴파일 시
List<String> stringList = new ArrayList<String>();
List<Integer> integerList = new ArrayList<Integer>();

// 런타임
List stringList = new ArrayList();
List integerList = new ArrayList();
```
- 반대로 제네릭은 컴파일 전에 존재하던 타입 정보가 런타임시에는 소거(Erasure)됩니다.
- 즉 List<String>로 선언하여도 런타임에는 소거되어 List가 됩니다.
    - 이렇게 컴파일타임보다 런타임에 타입 정보를 적게 가지는 타입을 **실체화 불가 타입이라고 합니다.**
    - 이러한 방식으로 설계된 이유는 자바가 하위 호환성을 중요시하기 때문에 레거시 코드와 제네릭 코드를 함께 사용할 수 있게 하기 위함입니다.
- **제네릭은 런타임에 타입이 소거되더라도 개발자가 선언한 제네릭 타입에 대한 타입 안정성을 보장해줘야 하기 때문에 제네릭 배열로 생성이 불가능한 것입니다.** 
- 만약 제네릭 배열이 가능하다면 어떻게 될까요?

## 제네릭 배열이 가능하다면 발생할 수 있는 문제점
```java
// 컴파일 에러가 발생한다.
List<String>[] stringLists = new List<String>[1]; // 제네릭 배열을 생성. 런타임시에는 List[]가 된다.

List<Integer> intList = Arrays.asList(1); // 타입 소거로 인해 런타임시 List가 된다.
Object[] objects = stringLists; // 배열은 공변성을 가지고 Object는 최상위 타입이므로 Object[]는 List[]로 할당될 수 있다.
objects[0] = intList; // intList또한 List가 되기 때문에 할당가능하다. 
String s = stringLists[0].get(0) // 예외 발생 
```
- 만약 제네릭 배열을 만들 수 있다면 위와 같은 상황이 발생할 수 있고 이는 결국 런타임 예외로 이어집니다.
- 마지막에 예외가 발생하는 이유는 stringLists[0]에는 objects[0]에 할당한 intList가 존재하기 때문에 해당 결과는 Integer를 반환하지만 Integer -> String으로 형변환을 시도 하여 예외가 발생하게 됩니다.
- **이러한 이유로 제네릭 배열은 제네릭의 타입안정성을 보장해줄 수 없어 컴파일 오류를 발생시킵니다.**
- 하지만 모든 경우에서 제네릭 배열이 불가능한 것은 아닙니다. 와일드카드 타입을 이용하거나, 강제 형변환을 통해 제네릭 배열을 사용할 수 있습니다.
  
## 제네릭 배열 사용하기
### 와일드카드(\<?>) 타입을 이용한 제네릭 배열 생성 
```java
// 컴파일 에러가 발생 안함.
List<?>[] lists = new List<?>[2];
lists[0] = Arrays.asList(1);
lists[1] = Arrays.asList("A");
    for (List<?> list : lists) {
        System.out.println(list);
    }
}
```
- 비한정적 와일드카드 타입으로 제네릭 배열을 생성하면 컴파일에러가 발생하지 않습니다.
- 비한정적 와일드카드 타입은 모든 제네릭 타입을 가질 수 있습니다. 그러므로 raw 타입으로 정의한 `List[]`와 동일한 의미를 가지므로 컴파일 에러를 발생시키지 않습니다.

### (E[]) Object[] 형변한 이용하기
```java
public class Store<E> {
    private E[] elements;
    private int index;
    
    // 컴파일 경고가 있더라도, 타입 안전성을 확신할 수 있으면 컴파일 경고를 무시할 수 있다.
    @SuppressWarnings("unchecked")
    public Store(int size) {
     // this.elements = new E[size]; 제네릭 배열은 생성불가! 컴파일 에러가 발생한다.
        this.elements = (E[]) new Object[size];
        this.index = 0;
    }
    
    public boolean save(E e) {
        if (index >= elements.length)
            return false;
        
        elements[index++] = e;
        return true;
    }
}
```
- Object 배열에서 (E[])로 형변환을 이용하면 제네릭 배열을 만들 수 있습니다.
- 형변환을통해 제네릭 배열을 생성하는 경우 컴파일러에서 경고를 표시할 것입니다.
    - 위에서 설명했던거 처럼 제네릭 배열은 타입 안전성을 보장해줄 수 없기 때문입니다.
- 하지만 Store Class는 값을 저장할 수 있는 유일한 메서드인 save(E e)에서 **E 타입으로만 값이 들어옴을 보장할 수 있기 때문에 컴파일러는 경고를 보내겠지만 타입이 안전함을 확신할 수 있습니다.**
    - 이런경우 `@SuppressWarnings("unchecked")` 애너테이션을 이용하면 컴파일 경고를 제거할 수 있습니다.
    
## 결론
- 배열과 제네릭은 서로 다른 특징을 가지고 있습니다.
- 배열은 공변성을 가지고 런타임에 타입 정보를 가지고 있어 런타임에 타입 안정성을 보장할 수 없습니다.
- 반면 제네릭은 불공변성을 가지므로 런타임에 타입 안전성을 보장할 수 있으나 타입 정보가 소거됩니다.
- 이러한 서로 다른 특징으로 인해 일반적으로 제네릭 배열을 생성하는것은 컴파일 오류를 발생시킵니다.  


