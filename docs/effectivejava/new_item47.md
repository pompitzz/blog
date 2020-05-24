---
title: 아이템 47. 반환 타입으로는 스트림보다 컬렉션이 낫다
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 스트림은 반복을 지원하지 않는다. 따라서 스트림과 반복을 알맞게 조합해야 좋은 코드가 나온다.
- 사실 Stream 인텊이스는 Iterable 인터페이스가 정의한 추상 메서드를 전부 포함할 뿐만아니라, Iterable 인터페이스가 정의한 방식대로 동작한다.
- 그럼에도 for-each를 쓸 수 없는 이유는 바로 Stream이 Iterable을 확장하지 않아서이다.

```java
for (Album a : (Iterable<Album>) albums.stream()::iterator) {
      
}
```
- Stream의 iterator를 이용하여 for-each를 사용할 순 있다.
- 이때 iterator는 람다 함수로 표현되기 때문에 iterator를 직접 명시해줘야 for-each문을 사용할 수 있다.

```java
for(Album a : iterableOf(albums.stream())){
}

private static <E> Iterable<E> iterableOf(Stream<E> stream) {
  return stream::iterator;
}
```
- 어댑터를 잘 이용하면 따로 형변환을 하지 않아도 된다. 하지만 여전히 까다롭다.
- 그렇다고 Iterable 타입으로 반환하면 Stream을 주로 사용하는 사람이 불편할 것이다.

```java
private static <E> Stream<E> streamOf(Iterable<E> iterable) {
    return StreamSupport.stream(iterable.spliterator(), false);
}
```
- stream으로 변환하는 어댑터도 StreamSupport를 이용하면 간단히 구현할 수 있다.


#### Collection을 반환해야 하는 이유
- Collection 인터페이스는 Iterable의 하위 타입이고 stream 메서드를 제공한다.
- 그러므로 **원소 시퀀스를 반환하는 공개 API의 반환 타입에는 Collection이나 그 하위 타입을 쓰는게 일반적으로 최선이다.**

#### 핵심 정리
- 컬렉션을 반환할 수 있다면 컬렉션을 반환하자.
- 이미 컬렉션이거나, 컬렉션을 하나 더 만들어도될 정도로 원소 개수가 적당하면 컬렉션으로 반환하자.
- 그렇지 않으면 전용 컬렉션을 구현하여 반활할지 생각해보자.
