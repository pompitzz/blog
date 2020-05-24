---
title: 아이템 37. ordinal 인덱싱 대신 EnumMap을 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
```java
public class Main {
  public static void main(String[] args) {
    Set<Plant>[] plantsByLifeCycle = (Set<Plant>[]) new Set[Plant.LifeCycle.values().length];

    // EumeMap 사용
    Map<Plant.LifeCycle, Set<Plant>> plantsByLifeCycle2 = new EnumMap<>(Plant.LifeCycle.class);
  }
}
```
- 배열에 비해 형변환을 하지 않고 더 안전하다.
- **배열의 인덱스를 얻기 위해 ordinal을 쓰는건 일반적으로 좋지 않으니 대신 EnumMap을 사용하라**
