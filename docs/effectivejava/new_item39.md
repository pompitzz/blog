---
title: 아이템 39. 명명 패턴보다 애너테이션을 사용하라
date: 2020-05-24 01:24
img: default.png
tags:
    - Java
---
- 전통적으로 도구나 프레임워크가 특별히 다뤄야 할 프로그램 요소에는 딱 구분되는 명명 패턴을 적용해왔다.
- JUnit3에서는 테스트 메서드 이름을 test로 시작하겠끔 했다. 효과적이지만 단점도 크다.
    - 1) 오타가 나면안된다.
    - 2) 올바른 프로그램 요소에만 사용될 보장이 없다.
    - 3) 프로그램 요소를 매개변수로 전달할 마땅한 방법이 없다.
- **애너테이션은 이 모든 문제를 해결해주는 멋진 방법이다.**


- 이 애너테이션을 사용하는 곳에는 직접적인 영향을 주지 않는다.
- 그저 이 애너테이션에 관심 있는 프로그램에게 추가 정보를 제공해줄 뿐이다.
- 즉 대상 코드의 의미는 그대로 둔채 그 애너테이션에 관심 있는 도구에서 특별한 처리를 할 기회를 준다.
- 바로 아래와 같이 말이다.

```java
public class RunTests {
  public static void main(String[] args) throws ClassNotFoundException {
    int tests = 0;
    int passwed = 0;
    Class<?> testClass = Sample.class;
    for (Method m : testClass.getDeclaredMethods()) {
      if (m.isAnnotationPresent(Test.class)) {
        tests++;
        try {
          m.invoke(null);
          passwed++;
        } catch (InvocationTargetException e) {
          Throwable exc = e.getCause();
          System.out.println(m + " 실패: " + exc);
        } catch (Exception e) {
          System.out.println("잘못 사용한 @Test: " + m);
        }
      }
    }
    System.out.printf("성공: %d, 실패: %d%n", passwed, tests - passwed);
  }
}
```
- 애너테이션에 예외 타입을 인스턴스 변수로 생성해 에외에 대한 검증을 다룰 수도 있을 것이다.
- 혹은 인스턴스 변수를 배열로 받아 여러 예외를 한번에 넘기도록할 수도 있을 것이다.
- 혹은 자바 8의 @Repeatable을 이용하여 배열대신 애너테이션을 반복정의하게 할 수도 있을 것이다.
- **애너테이션으로 할 수 있는 일을 명명 패턴으로 처리할 이유는 없다.**
