---
title: 아이템 29. 이왕이면 제네릭 타입으로 만들라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
```java
public class Stack<E>{
  private static final int DEFAULT_SIZE = 10;

  private E[] elements;
  private int size = 0;


  public Stack() {
    // 에러 발생
    elements = new E[DEFAULT_SIZE];
  }

  public void push(E e) {
    ensureCapacity();
    elements[size++]  = e;
  }

  private void ensureCapacity() {
    if (elements.length == size)
      elements = Arrays.copyOf(elements, 2 * size + 1);
  }

  public E pop() {
    if (size == 0) {
      throw new EmptyStackException();
    }
    return elements[--size];
  }

}
```
- 지난번에 구현했던 Stack을 제네릭으로 바꿔보면 실체화 불가 타입으로는 배열을 만들 수 없어 위의 주석에서 에러가 발생한다.
- 이를 해결할 방법은 두 가지가 있다.

#### 첫 번째 방법
```java
public Stack() {
elements = (E[]) new Object[DEFAULT_SIZE];
}
```
- 제네릭 배열 생성 제약을 우회하는 방법이다. 컴파일러는 오류 대신 경고를 내보낸다.
- 컴파일러는 이 프로그램이 타입 안전한지 증명할 방법은 없지만, 스택의 push는 항상 E로만 들어오기때문에 이 비검사 형변환은 안전하다.
- 비검사 형변환이 안전함을 직접 증명했으므로 @SuppressWarnings("unchecked")을 통해 경고를 숨긴다.

#### 두 번째 방법
```java
public class Stack<E>{
  private static final int DEFAULT_SIZE = 10;

  // Object[] 를 사용한다.
  private Object[] elements;
  private int size = 0;

  public Stack() {
    elements = new Object[DEFAULT_SIZE];
  }

  public void push(E e) {
    ensureCapacity();
    elements[size++]  = e;
  }

  private void ensureCapacity() {
    if (elements.length == size)
      elements = Arrays.copyOf(elements, 2 * size + 1);
  }

  public E pop() {
    if (size == 0) {
      throw new EmptyStackException();
    }
    // 에러 발생
    return elements[--size];
  }
}
```
- E[]대신 Object[]를 사용하는 방법이 있다.
- 이 방법은 pop()메서드에서 에러가 발생한다. 이는 리턴 타입을 (E)로 형변환 해주면 된다.
- 이 방식도 push는 E 타입만되므로 안전하기 때문에 경고를 숨겨도 된다.

#### 정리
- 첫 번째 방법은 가독성이 좋고, 배열의 타입을 E[]로 선언하여 오직 E만 받음을 확실히 어필하며 코드도 짧다.
- 그리고 첫 번째 방법은 형변환을 한번만 해주면되지만 두 번째 방법은 매번 형변환이 필요하다.
- 그러므로 첫 번째 방식이 더 선호되지만 배열의 런타임 타입이 컴파일 타입과 달라 힙 오염을 일으킨다.(item32)
