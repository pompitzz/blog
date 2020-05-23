---
title: 아이템 18. 상속보다는 컴포지션을 사용하라
date: 2020-05-24 01:22
tags:
    - Java
---

# 아이템 18. 상속보다는 컴포지션을 사용하라
- 상위, 하위 클래스 모두 같은 프로그래머가 통제하는 패키지 안이나, 확장할 목적으로 설계되었고 문서화도 잘되어 있을 경우 상속도 안전하다.
- 하지만 일반적인 구체 클래스가 패키지 경게를 넘어, 다른 패키지 구체 클래스를 상속하는 것 위험하다.
- 여기서 말하는 상속은 클래스가 다른 클래스를 확장하는 구현 상속을 의미한다.

#### 메서드 호출과 달리 상속은 캡슐화를 깨트린다
- 상위 클래스가 어떻게 구현되느냐에 따라 하위 클래스의 동작에 이상이 생길 수 있다.
- 상위 클래스는 릴리스마다 내부 구현이 달라질 수 있으며, 그 여파로 코드 한 줄 건드리지 않은 하위 클래스가 오동작할 수 있게 된다.
 
 ```java
@NoArgsConstructor
public class InstrumentedHashSet<E> extends HashSet<E> {

  private int addCount = 0;

  public InstrumentedHashSet(int initCap, float loadFactor){
    super(initCap, loadFactor);
  }

  @Override
  public boolean add(E e) {
    addCount++;
    return super.add(e);
  }

  @Override
  public boolean addAll(Collection<? extends E> c) {
    addCount += c.size();
    return super.addAll(c);
  }

  public int getAddCount() {
    return addCount;
  }

  public static void main(String[] args) {
    InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
    s.addAll(List.of("A", "B"));
    int addCount = s.getAddCount();
    // 2가 아닌 4가 호출된다.
    System.out.println("addCount = " + addCount);
  }
}
```
- HashSet에서 add된 개수를 저장하는 새로운 클래스를 상속받아 만들었다.
- 출력된 결과는 2가 아닌 4가 호출되는데 그 이유는 addAll은 add 메서드를 이용하여 구현되기 때문이다.
- addAll을 재정의 하지 않으면 제대로 동작될테지만 언제까지건 hashSet의 구현이 그대로라고 보장할 수 없다.
- 이처럼 자신의 다른 부분을 사용하는 self-use 여부는 해당 클래스의 내부 구현 방식에 해당하므로 변경에 안전하지 못하다.
- 뿐만아니라 부모 클래스에서 새로운 기능이 추가되어 다른 방식으로 원소가 추가될 수 있다면 이는 제대로 동작되지 않을 것이다.
- 새로운 메서드를 이용하는것도 좋은 방법일 수 있지만 만약 부모 클래스에서 메서드 시그니처는 같지만 반환타탑이 다른 메서드를 구현한다면 컴파일 조차 되지 않을 것이다.

#### 컴포지션
- **이러한 모든 문제를 해결하기 위한 방법은 기존 클래스를 상속받아 확장하는 대신 새로운 클래스를 만들고 private 필드 변수로 참조하게 하면 된다.**
- 기존 클래스가 새로운 클래스의 구성요소로 쓰인다는 뜻에서 이러한 설계를 컴포지션(구성)이라고 한다.
- 컴포지션 통해 메서드 호출을 fowarding하게 되는데 이러한 메서드들을 forwarding method라고 한다.
- 이는 기존 클래스의 내부 구현 방식에 영향에 벗어나고 기존 클래스에 메서드가 추가되어도 영향을 받지 않는다.
- 컴포지션과 전달의 조합은 넓은 의미로 위임이라고 부르며 엄밀히 따져 래퍼 객체가 내부 객체에 자기 자신의 참조를 넘기는 경우에만 위임아라고 한다.
 
 #### 래퍼 클래스의 단점
 - 콜백 프레임워크에서 문제?? p119
 - http://bit.ly/2LepViV 
 
 #### 요약
 - 상속은 강력하지만 캡슐화를 해친다는 문제가 있다.
 - A를 상속하는 B를 작성하려 할때는 B가 정말 A인가? 라고 자문해보자.
 - "그렇다"라고 확신할 수 없다면 상속을 해서는 안되고 구성을 이용하여야 한다.
 - 자바 플랫폼 라이브버리 중 Stack은 Vector가 아니므로 이를 확장해서는 안됐다.
 - 마찬가지로 Properties는 HashTable이 아니므로 이를 확장해서는 안됐다.
 - 이 둘은 구성을 이용했으면 더 좋았을 것이다.
 - 구성을 써야할 상황에 상속을 이용하는건 내부 구현을 불필요하게 노출하는 꼴이된다.
 - 그 결과 과 API가 내부 구현에 묶이고 성능이 떨어지며 클라이언트가 노출된 내부에 직접 접근이 가능해서 시스템에 문제가 생기기 쉽다.
 - 마지막으로 해야할 자문은, 확장하려는 클래스의 API에 아무런 결함이 없는가? 결함이 있을 때 이 결함이 우리의 클래스 API까지 전파돼도 괜찮은가?를 생각해보아야 한다.
 