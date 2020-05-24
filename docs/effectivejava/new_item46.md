---
title: 아이템 46. 스트림에서는 부작용 없는 함수를 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 스트림 패러다임의 핵심은 계산을 일련의 변환으로 재구성하는 부분이다.
- 이때 각 변환 단계는 가능한 한 이전 단계의 결과를 받아 처리하는 순수 함수여야 한다.
- **순수 함수란 오직 입력만이 결과에 영향을 주는 함수를 말한다.**
- 즉 다른 가변 상태를 참조하지 않고, 함수 스스로도 다른 상태를 변경하지 않는다. 이렇게 하려면 스트림 연산에 건내는 함수 객체는 모두 부작용이 없어야 한다.

```java
public class Main {
  private static Map<String, Long> badPractice(String fileName) {
    Map<String, Long> freq = new HashMap<>();
    try (Stream<String> words = new Scanner(fileName).tokens()) {
      words.forEach(word -> freq.merge(word.toLowerCase(), 1L, Long::sum));
    }
    return freq;
  }
}
```
- 해당 코드는 스트림을 사용하긴 했지만 스트림의 패러다임을 제대로 이해하지 못한채 API만 사용한 것이다.
- 해당 코드의 모든 작업이 종단연산인 forEach에서 일어나는데, 이때 외부 상태를 수정하는 람다를 실행하면서 문제가 생긴다.
- forEach가 그저 스트림이 수행한 연산 결과를 보여주는 일 이상을 하게 되므로 좋지 않은 코드이다.

```java
public class Main {
  private static Map<String, Long> bestPractice(String fileName) {
    try (Stream<String> words = new Scanner(fileName).tokens()) {
      return words.collect
          (Collectors.groupingBy(String::toLowerCase, Collectors.counting()));
    }
  }
}
```
- 스트림 API를 제대로 활용한 코드로 코드가 매우 짧고 명확해졌다.
- forEach는 자바의 for-each와 비슷하다. 대놓고 반복적이라 병렬화할 수도 없어 가장 '덜' 스트림 스러운 기능이다.
- 그러므로 **forEach 연산은 스트림 계산 결과를 보고할 때만 사용하고, 계산하는데 쓰지말자.**

```java
public static void main(String[] args) {
final Map<String, Long> freq = bestPractice(args[0]);

final List<String> topTen = freq.keySet().stream()
    .sorted(Comparator.comparing(freq::get).reversed())
    .limit(10)
    .collect(Collectors.toList());
}
```
- 빈도수가 높은 단어 10개를 뽑아내는 파이프라인이다.
- collect와 comparing을 잘 활용하면 매우 깔끔한 코드로 구현이 가능하다. 

#### Collectors 알아보기
**toMap**
- 간단한 맵 수집기로 스트림 원소를 키에 매핑하는 함수와 값에 매핑하는 함수를 인수로 받아 구현된다.
- toMap은 보통 각 원소가 고유한 키에 매핑되어 있을 때 적절하다.
- 스트림 원소 다수가 같은 키를 사용하면 파이프라인이 IllegalStateException을 던질 것이다.

```java
// 1
Map<Artist, Album> topHits = albums.stream()
        .collect(toMap(Album::artist, a -> a, maxBy(comparing(Album::sales))));

// 2
toMap(keyMapper, valueMapper, (oldVal, newVal) -> newVal)
```
- 인수를 3개받는 toMap도 존재하는데, 해당 메서드는 어떤 키와 그 키에 연관된 원소들 중 하나를 골라 연관 짓는 맵을 만들 때 유용하다.
- 위의 코드에서 //1은 앨범리스트를 스트림으로 변환하여 아티스트별 가장 판매량이 높은 앨범과 Map을 구성하는 코드이다.
- 그리고 toMap은 충돌이 나면 마지막 값을 취하는 수집기를 만들떄도 유용하다. //2 참고
- 인수 4개를 받는 toMap도 있는데 마지막 인수에 HashMap::new와 같이 원하는 생성되길 원하는 맵의 구현체를 지정할 수있다.

 
**groupingBy**
- groupingBy는 toMap에서 발생할 수 있는 충돌을 다룰 수 있는 전략을 제공한다.
- 첫번째 인자에는 key를 그룹할 함수를 정의한다. 해당 인자만 사용한다면 Value는 List로 묶이게 된다.
- 두번째 인자는 downstream 수집기를 명시하는 곳으로 해당 함수를 명시하면 해당 downstream으로 부터 값을 생성하게 된다.
- 이 매개변수를 사용하는 가장 간단한 방법은 toSet()을 넘겨 그룹된 애들의 집합을 갖는 맵을 반환하게할 수 있다.

```java
Map<String, Long> freq = words.collect(groupingBy(String::toLowerCase, counting()))
```
- counting()을 건네 해당 원소를 개수를 매핑할 수도 있다.

**partitioningBy**
- 분류 함수로 predicate를 받아 Boolean의 키인 맵을 반환하게 해주는 수집기이다.

**joining**
- CharSequence 인스턴스의 스트림에만 적용할 수 있는 수집기로 원소들을 연결하는 기능을 제공한다.

#### 핵심 정리
- 스트림 파이프라인 프로그래밍의 핵심은 부작용 없는 함수 객체에 있다.
- 스트림뿐만 아니라 스트림 관련 객체에 건네지는 모든 함수 객체가 부작용이 없어야 한다.
- forEach는 종단 연상으로 스트림이 수행한 결과를 보고할 때만 이용해야 한다.
- 스트림을 올바르게 사용하려면 수집기를 잘 알아야 한다.
- 가장 중요하면서 많이 쓰이는 수집기 팩터리는 toList, toSet, toMap, groupingBy, joining이다.
