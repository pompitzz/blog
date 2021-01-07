---
title: JAVA 제네릭 배열을 생성하지 못하는 이유
date: 2020-07-18 14:28
img: 
    - java.png
tags: 
    - JAVA
---

- 자바에서 제네릭 타입은 중요한 두 가지 차이를 가지고, 이 차이로 인해 제네릭 배열은 타입 안전성을 보장할 수 없어 직접 생성이 불가능합니다. 

## 제네릭과 배열의 차이점
### 1. 배열은 공변, 제네릭은 불공변
- 배열의 경우 Sub가 Super의 하위 타입일때 Sub[]는 Super[]의 하위 타입이 됩니다.
    - 이런 경우를 공변하다고 합니다.
- 반면 제네릭 타입의 경우 Sub가 Super의 하위 타입이더라도 ArrayList\<Sub>는 ArrayList\<Super>의 하위 타입이 아닙니다.
    - 이런 경우를 불공변하다고 합니다.
 
#### 배열은 공변
```java
Object[] objects = new String[1]; // 배열은 공변하므로 String[]은 Object[]의 하위 타입이므로 컴파일 가능
objects[0] = 1;
```
- objcets는 컴파일 타임에 Object[]이므로 Integer을 할당할 수 있으나, **런타임엔 String[]이기 때문에 예외가 발생합니다.**

> 자바를 사용하는 이유 중 하나가 정적 컴파일 언어로 시스템의 안정성을 높여주기 위함인데 배열의 이러한 특징은 컴파일 타임에 타입 안전성을 보장해줄 수 없습니다.

#### 제네릭은 불공변
```java
ArrayList<Object> objectList = new ArrayList<String>(); // 제네릭 타입은 불공변하므로 컴파일 불가능
```
- **제네릭 타입은 불공변하기 때문에 String 타입이 Object 타입을 확장했다 하더라도 컴파일 에러가 발생합니다.**
    - 만약 제네릭 타입이 공변하여 컴파일이 된다면 배열과 동일하게 런타임에 타입 에러가 발생할 것입니다.
- 그러므로 배열 대신 제네릭 타입을 사용하는 것이 타입 안전한 프로그래밍을 할 수 있습니다.

### 2. 배열은 런타임에 실체화, 제네릭 타입은 런타임에 소거

#### 배열은 런타임에 실체화
```java
Object[] objects = new String[1];
```
- 배열은 런타임에 타입이 실체화되기 때문에 objects는 런타임에 String[]가 됩니다. 

#### 제네릭 타입은 런타임에 소거
```java
// 컴파일 타임(실제 작성한 코드)
ArrayList<String> stringList = new ArrayList<String>();
ArrayList<Integer> integerList = new ArrayList<Integer>();

// 런타임(제네릭 타입은 런타임에 소거되므로 구분이 불가능하다)
ArrayList stringList = new ArrayList();
ArrayList integerList = new ArrayList();
```
- 제네릭 타입은 런타임에 소거되므로 런타임에는 타입이 소거된 ArrayList만 남게됩니다.

### 제네릭 배열이 가능하다면 발생할 수 있는 문제점
```java
// 실제론 컴파일 에러가 발생한다.
ArrayList<String>[] stringLists = new ArrayList<String>[1]; // 제네릭 배열을 생성. 런타임시에는 제네릭 타입은 소거되므로 ArrayList[]가 된다.

ArrayList<Integer> intList = Arrays.asList(1);              // 타입 소거로 인해 런타임시 ArrayList가 된다.
Object[] objects = stringLists;                             // 배열은 공변성을 가지므로 Object[]는 ArrayList[]가 될 수 있다.
objects[0] = intList;                                       // intList또한 ArrayList이므로 배열의 요소가 될 수 있다. 
String s = stringLists[0].get(0)                            // String 타입을 가져야 하지만 Integer이므로 예외 발생  
```
- 만약 제네릭 배열을 만들 수 있다면 위와 같은 상황이 발생할 수 있고 이는 결국 런타임 예외로 이어집니다.

#### 왜 제네릭은 실체화 불가능하게 만들었을까?
- 자바에서 제네릭 타입을 굳이 런타임에 소거한 이유는 하위 호환성을 보장하기 위함입니다. 
    - 만약 제네릭 타입이 런타임에 실체화 된다면 제네릭이 생기기전에 사용했던 클래스들와 호환이 불가능하게 됩니다.
- 제네릭이 런타임에 자신의 타입을 소거하더라도 개발자가 선언한 제네릭의 타입 파라미터에 명시한 타입만 들어갈 수 있도록 **타입 안전성을 보장해줘야 합니다.**
- 하지만 **제네릭 타입이 런타임에 소거되던 말던 제네릭 타입의 목적은 타입 안전성을 보장하기 위함이므로 타입 안정성 보장이 필요합니다.** 
    - 배열은 위에서 보았듯이 공변하므로 제네릭 배열이 가능하도록 하면 타입 안전성을 보장할 수 없게 되어 제네릭 배열을 직접 생성할 수 없습니다.

> 제네릭 배열을 직접 생성할 순 없지만 와일드카드 타입을 이용하거나, 강제 형변환을 통해 제네릭 배열을 사용할 수 있습니다.
  
## 제네릭 배열 사용하기
### 와일드카드 타입을 이용한 제네릭 배열 생성 
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
    - raw 타입이기 때문에 모든 타입을 포함할 수 있어 배열의 공변성이 문제가 되지 않습니다.

### 형변한 이용하기
```java
public class Store<E> {
    private E[] elements;
    private int index;
    
    // 경고가 발생하나 타입 안전성을 확신할 수 있으니 경고를 제거한다.
    @SuppressWarnings("unchecked")
    public Store(int size) {
     // this.elements = new E[size]; 직접 제네릭 배열은 생성불가!
        this.elements = (E[]) new Object[size]; // 강제 형변환을 이용하여 생성
        this.index = 0;
    }
    
    // elements는 해당 메서드에서만 추가될 수 있으므로 코드상으로 타입 안전성 보장이 가능하다. 
    public boolean save(E e) {
        if (index >= elements.length)
            return false;
        
        elements[index++] = e;
        return true;
    }
}
```
- Object 배열에서 (E[])로 형변환을 이용하면 제네릭 배열을 만들 수 있습니다.
- 형변환을 통해 제네릭 배열을 생성하는 경우 타입 안전성을 보장해줄 수 없기 때문에 컴파일러에서 경고를 표시합니다.
- 하지만 코드 상으로 타입 안전성 보장이 가능하다면 문제 없이 사용할 수 있습니다.  
        
## 결론
- 배열은 공변하며 런타임에 실체화 되지만, 제네릭 타입은 불공변하며 런타임에 소거됩니다.
- 이로 인해 배열은 타입 안전성을 보장해줄 수 없어 제네릭 배열을 직접 생성할 수 없습니다.
- 타입 안전성을 위해서라면 배열을 사용하기 보다 제네릭 타입을 활용한 리스트를 사용하는 것이 좋습니다.
