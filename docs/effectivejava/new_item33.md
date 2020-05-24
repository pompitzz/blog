---
title: 아이템 33. 타입 안전 이종 컨테이너를 고려하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- class 리터럴을 type token이라고 하는데 이를 이용하여 타입별로 인스턴스를 저장할 수 있는 클래스를 만들 수 있다.

```java
public class Favorites {
  private Map<Class<?>, Object> favorites = new HashMap<>();

  public <T> void putFavorite(Class<T> type, T instance) {
    favorites.put(type, instance);
  }

  public <T> T getFavorite(Class<T> type) {
    return type.cast(favorites.get(type));
  }
}
```
- Class 객체를 이용하여 타입별 값을 가지는 데이터를 만들 수 있다.
- get하는 데이터는 Object이므로 type.cast를 이용하여 형변환을 해준다.
- 일반적으로 이 방식은 잘 동작하나 악의적으로 제네릭이 아닌 타입으로 넘기면 타입 안정성이 깨지게 된다.

```java
public class Main {
  public static void main(String[] args) {
    // 1
    Favorites f = new Favorites();
    f.putFavorite((Class)Integer.class, "I`m String") ;
    Integer integer = f.getFavorite(Integer.class);

    // 2
    HashSet<Integer> set = new HashSet<>();
    ((HashSet) set).add("I`m String");
    set.forEach(System.out::print);
  }
}
```
- 위 둘의 결과는 모두 ClassCastException이 발생한다.
- 이를 예방하기 위해 put할 때 type case를 해주고 type은 null check를 해주어 타입 불변식을 어기지 않도록 하면 된다.

```java
public <T> void putFavorite(Class<T> type, T instance) {
  favorites.put(Objects.requireNonNull(type), type.cast(instance));
}
```
- Collections의 checkedSet, checkedList같은 메서드들이 이 방식을 적용한 컬렉션 래퍼들이다.
- 이 정적 팩터리들은 컬렉션과 함께 1개의 Class를 받아 Class 객체와 컬렉션의 컴파일 타임 타입이 같음을 보장한다.
- 이 래퍼들은 제너릭과 raw 타입을 섞어 사용하는 애플리케이션에서 클라이언트 코드가 컬렉션에 잘못된 타입을 넣는지 체크하는데 도움을 준다.

#### Favorites의 제약
- 위에서 설명한 ClassCastException 이외에 Favorites에는 실체화 불가 타입을 사용할 수 없다.
- String[]은 되지만 List<String>은 List<String>.class가 불가능하고 List.class만 가능하다.
- 이를 우회하는 방법으로 슈퍼타입 토큰이 있지만 완벽하지는 않다.
  
#### 핵심 정리
- 컬렉션 API로 대표되는 일반적인 제네릭 형태에서는 한 컨테이너가 다룰 수 있는 타입 매개변수의 수가 고정되어 있다.
- 하지만 컨테이너 자체가 아닌 키를 타입 매개변수로 바꾸면 이런 제약이 없는 타입 이종 컨테이너를 만들 수 있다.
- Class 키를 쓰는 타입 안전 이종 컨테이너는 Class 객체의 타입 토큰을 이용한다.
- 혹은 직접 구현한 키 타입을 사용할 수도 있을것이다.

