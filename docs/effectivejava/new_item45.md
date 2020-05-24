---
title: 아이템 45. 스트림은 주의해서 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 스트림은 데이터 원소의 유한 혹은 무한 시퀀스를 뜻한다.
- 스트림 파이프라인은 이 원솓ㄹ로 수행하는 연산 단께를 표현하는 개념이다.
- 스트림의 원소들은 컬렉션, 배열 등 어디서든 올 수 있다.
- 스트림 파이프라인은 소스 스트림에서 시작해 종단 연산으로 끝나며 중간에 중간 연산이 올 수 있다.
- 스트림 파이프라인은 lazy evaluation을 제공하므로 종단 연산이 호출도리 때 평가가 이루어진다.
- 그러므로 종단 연산에 쓰이지 않는 데이터 원소는 계산에 쓰이지 않게 된다.
- 이러한 lazy evaluation은 무한 스트림을 다룰 수 있게 해주는 key이다.
- 스트림 API는 method chain을 지원하는 fluent API이다.

> 스트림 API는 다재다능하며 어떠 계산이라도 해낼 수 있지만 상황에 따라 유지보수가 어려운 코드가 될 수 도 있으니 사용시 주의하여야 한다.

#### 코드 예시
```java
public class Main {
  private static void anagram(String fileName, int minGroupSize) throws FileNotFoundException {
    File dictionary = new File(fileName);

    Map<String, Set<String>> groups = new HashMap<>();
    try (Scanner s = new Scanner(dictionary)) {
      while (s.hasNext()) {
        String word = s.next();
        groups.computeIfAbsent(alphabetize(word),
            unused -> new TreeSet<>()).add(word);
      }
    }
    for (Set<String> group : groups.values()) {
      if (group.size() >= minGroupSize)
        System.out.println(group.size() + ": " + group);
    }
  }

  private static String alphabetize(String s) {
    char[] a = s.toCharArray();
    Arrays.sort(a);
    return new String(a);
  }
}
```
- 파일을 읽어 해당 단어들의 아나그램 그룹을 출력하는 메서드이다.
- 해당 메서드는 스트림을 전혀사용하지 않고 구현하였다.
- 코드가 조금 길긴하지만 다른사람들이 보기에 명시적으로 이해하기 좋을 것이다.

```java
public class Main {
  private static void anagramUsingStream(String fileName, int minGroupSize) throws IOException {
    Path dictionary = Paths.get(fileName);

    try (Stream<String> words = Files.lines(dictionary)) {
      words.collect(
          Collectors.groupingBy(
              word -> word.chars()
                  .sorted()
                  .collect(
                      StringBuilder::new,
                      (sb, c) -> sb.append((char) c),
                      StringBuilder::append
                  ).toString()
          )
      ).values().stream()
          .filter(group -> group.size() >= minGroupSize)
          .forEach(g -> System.out.println(g.size() + ": " + g));
    }
  }
}
```
- 파일을 읽어드리는 곳을 제외하곤 오직 스트림만을 이용하여 구현된 메서드이다.
- 위와 기능을 동일하지만 코드의 양은 짧아졌다. 하지만 코드를 이해하기 상당히 어렵다.
- 람다, 스트림을 모르는 사람의 경우 이해하기가 훨씬 더 어려울 것이다.
- 이렇듯 **스트림을 과용하면 프로그램이 읽거나 유지보수하기 어려워진다.**
- 가장 좋은 방법은 스트림을 적절히 사용하는 것이다.

```java
public class Main {
  private static void anagramBalanced(String fileName, int minGroupSize) throws IOException {
    Path dictionary = Paths.get(fileName);

    try (Stream<String> words = Files.lines(dictionary)) {
      words.collect(Collectors.groupingBy(Main::alphabetize))
          .values()
          .stream()
          .filter(group -> group.size() >= minGroupSize)
          .forEach(group -> System.out.println(group.size() + ": " + group));
    }
  }

  private static String alphabetize(String s) {
    char[] a = s.toCharArray();
    Arrays.sort(a);
    return new String(a);
  }
}
```
- 스트림과 기능을 분리한 도우미 메서드를 적절히 사용한 버전이다.
- 스트림을 적절히 사용하고 도우미 메서드를 잘 활용하면 코드도 짧으며 이해하기 쉬운 코드를 만들 수 있다.

#### Char 스트림을 지원하지 않는 이유
- char는 사실 int 값으로 구성된다. 그러므로 char 스트림을 제공하기엔 불가능하다.

```java
public class Main{
  public static void main(String[] args){
    "Hello".chars().forEach(x -> System.out.println(x));
    "Hello".chars().forEach(x -> System.out.println((char) x));
  }
}
``` 
- chars()는 IntStream으로 구성되고 이를 출력하면 실제론 숫자를 출력한다.
- char를 표현하기 위해선 형변환을 이용하면 될것이다.
- **하지만 char 값들을 처리할 때는 스트림을 삼가는 편이 좋다.**

#### 무조건 스트림을 써야할까?
- 스트림으로 바꿀 수 있더라도 코드의 가독성, 유지보수를 잘 생각해봐야 한다.
- 스트림과 반복문을 적절히 조합하는게 가장 좋다.
- 그러니 **기존 코드는 스트림을 사용하도록 리팩터링하되, 새 코드가 더 나아 보일때만 반영하자.**

#### 람다로는 할수 없는 것
- 코드 블럭에서는 범위 안의 지역변수를 읽고 수정할 수 있다.
- 하지만 람다에서는 final이거나 사실상 fianl 변수만을 읽을 수 있고 지역변수를 수정하는건 불가능하다.
- **코드 블록에서는 return문을 사용해 빠져나오거나, break, continue등을 활용할 수 있으며, 메서드에서 선언된 명시된 검사 예외를 던질 수 있다.**
- 하지만 람다로는 이 중 어느것도 할 수 없다.

#### 람다, 스트림이 적절한 경우
- 원소들의 시퀀스를 일관되게 변환하고, 필터링하며 하나의 연산을 사용해 결합한다.
- 원소들의 시퀀스를 컬렉션의 모으며 특종 조건을 만족하는 원소들을 찾는다.

#### 스트림으로 처리하기 어려운 것
- 한 데이터가 파이프라인의 여러 단계를 통과할 때 이 데이터의 각 단계에서의 값에 동시에 접근하기 어렵다.
- 스트림 파이프라인은 일단 한 값을 다른 값에 매핑하고 나면 원래 값을 잃는 구조이다.
- 우회하는 방법이 있겠지만 코드도 복잡해지고 주목적에서 벗어나게 된다.


#### 핵심 정리
- 스트림과 반복문을 적절히 잘 사용하는것이 가장 좋은 해결책이다.
- 어느것이 더 나은지 모르겠으면 양쪽다 구현해보고 나은쪽을 택하자.

