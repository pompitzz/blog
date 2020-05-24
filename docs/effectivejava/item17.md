---
title: 아이템 17. 변경 가능성을 최소화하라
date: 2020-05-24 01:22
img: default.png
tags:
    - Java
---

# 아이템 17. 변경 가능성을 최소화하라
- 불변 클래스란 간단히 말해 그 인스턴스의 내부 값을 수정할 수 없는 클래스다.
- 불변 인스턴스에 간직된 정보는 고정되어 객체가 파괴되는 순간까지 절대 달라지지 않는다.
- 자바 플랫폼 라이브러리 중 String, 기본 타입 박싱 클래스, BigInteger, BigDecimal등이 여기에 속한다.
- 불변 클래스는 가변 클래스보다 설계 및 구현이 쉽고 오류의 여지가 적다.

#### 불변 클래스 규칙
- 객체의 상태를 변경하는 변경자 메서드를 제공하지 않는다.
- 클래스를 확장할 수 없도록 한다.
- 모든 필드를 final로 선언한다.
- 모든 필드를 private로 선언한다.(public final도 되지만 이는 내부 표현 변경에 제약이 생긴다)
- 자신 외에는 내부의 가변 컴포넌트에 접근할 수 없도록 한다.
    - 클래스에 가변 객체가 있다면 클라이언트에서 이 객체를 참조할 수 없도록 한다.
    - 접근자가 그 필드를 그대로 반환해서도 안되고 방어적 복사가 필요하다.
    

#### 불변 복소수 클래스
```java
@RequiredArgsConstructor
public class Complex {
  private final double re;
  private final double im;

  public double realPart() {
    return re;
  }

  public double imaginaryPart() {
    return im;
  }

  public Complex plus(Complex c) {
    return new Complex(re + c.re, im + c.im);
  }

  public Complex minus(Complex c) {
    return new Complex(re - c.re, im - c.im);
  }

  public Complex times(Complex c) {
    return new Complex(
        re*c.re - im*c.im,
        re*c.im + im*c.re);
  }

  public Complex dividedBy(Complex c) {
    double tmp = c.re*c.re + c.im*c.im;
    return new Complex(
        (re*c.re + im*c.im) / tmp,
        (im*c.im - re*c.im) / tmp
    );
  }

  @Override
  public boolean equals(Object o) {
    if (o == this)
      return true;
    if (!(o instanceof Complex))
      return false;
    Complex c = (Complex) o;

    return Double.compare(c.re, re) == 0
        && Double.compare(c.im, im) == 0;
  }

  @Override
  public int hashCode() {
    return 31 * Double.hashCode(re) + Double.hashCode(im);
  }

  @Override
  public String toString() {
    return "(" + re + " + " + im + "i)";
  }
}
```
- 해당 사칙연산 메서드들은 인스턴스 자신을 수정하지 않고 새로운 Complex를 반환한다.
- **이처럼 피연산자에 함수를 적용해 그 결과를 반환하지만, 피연산자 자체는 그대로인 프로그래밍 패턴을 함수형 프로그래밍이라 한다.**
- 이외 달리 절차형, 명령형 프로그래밍에서는 메서드에서 피연산자인 자신을 수정해 자신의 상태가 변하게 된다.
- 메서드 이름이 add가 아닌 plus인 이유도 해당 메서드가 객체의 값을 변경시키지 않는것을 강조하는 것이다.
- 이 방식으로 프로그래밍하면 코드에서 불변이 되는 영역의 비율이 높아지는 장점을 누릴 수 있다.
- **불변 객체는 단순하고 생성된 시점의 상태를 파괴될 떄 까지 그대로 간직한다.**
- **불변 객체는 근본적으로 스레드 안전하며 동기화가 필요 없다.**
- 불변객체는 안심하고 공유할 수 있게 된다. 그러므로 불변 클래스는 한번 만든 인스턴스를 최대한 활용하기를 권한다.

```java
public static final Complex ZERO = new Complex(0, 0);
public static final Complex ONE  = new Complex(1, 0);
public static final Complex I    = new Complex(0, 1);
```
- 가장 쉬운 방법은 이와같이 자주 쓰이는 값들을 상수로 제공하는 것이다.
- 정적 팩터리를 이용하여 인스턴스 중복 생성을 막을 수도 있을 것이다.
- 박싱된 기본 타입들과, BigInteger가 여기에 속한다. 그러므로 새로운 클래스를 설계할 때 public 생성자 대신 정적 팩터리를 만들어두면 더욱 유용할 것이다.

#### 불변 객체의 특징
- **불변 객체는 자유롭게 공유할 수 있음은 물론, 불변 객체끼리는 내부 데이터를 공유할 수 있다.**
- **객체를 만들때 다른 불변 객체들을 구성요소로 사용하면 이점이 많다.**
    - 값이 바뀌지 않는 구성요소들로 이뤄진 객체라면 구조가 복잡하더라도 유지보수가 수월해질 것이다.
    - 좋은 예로 불변 객체는 맵의 키와 집합의 원소로 쓰기에 적합하다.
    - 왜냐하면 맵이나 집합은 안에 담긴 값이 바뀌면 불변식이 무너지기 때문이다.
- **불변 객체는 그 자체로 실패 원자성을 제공한다**
    - 상태가 절대 변하지 않으므로 잠깐이라도 불일치 상태가 발생할 수 없다.
- **불변 클래스도 값이 다르면 반드시 독립된 객체로 만들어야 하는 단점이 존재한다**
    - 원하는 객체를 완성하기 까지의 단계가 많고, 중간에 생성된 객체들이 버려진다면 성능 문제가 심해질 수 있다.
    - 이를 위해 먼저 다단계 연산(?)을 예측하여 기본 기능으로 제공 해준다.
    - 클라이언드들이 원하는 복잡한 연산들을 정확히 예측할 수 있다면 package-private의 가변 동반 클래스만으로 충분하다.
    - 하지만 예측이 불가능하면 public으로 제공해줘야 한다.
    - 가장 대표적인 예가 String이다. String의 가변 동반 클래스는 StringBuilder, StringBuffer가 있다.
    
#### 불변 클래스 만드는 또 다른 방법
- 클래스의 불변을 보장하기 위해 상속을 모샇게 막아야할 때 final 클래스를 선언하는 것도 좋은 방법이지만 더 유연한 방법이 존재한다.
- 바로 모든 생성자를 private, package-private로 만들고 public 정적 팩토리를 제공하는 방법이다.

```java
public class Complex {
  private final double re;
  private final double im;

  private Complex(double re, double im) {
    this.re = re;
    this.im = im;
  }

  public static Complex valueOf(double re, double im) {
    return new Complex(re, im);
  }
}
```
- 이 방식을 활용하면 바깥에서 볼 수 없는 package-private 구현 클래스들을 원하는 만큼 만들어 사용할 수 있으니 훨씬 유용하다.
- 그리고 private 생성자 이므로 어차피 상속이 불가능해 final과 동일한 효과를 내고 정적 팩터리를 사용하므로 활용할 여지가 많다.
- 모든 필드가 final이고 어떤 메서드도 그 객체를 수정할 수 없어야 하는 규칙이 조금 과하다면 조금 완화하여 **객체의 상태 중 외부에 비치는 값만 변경할 수 없다**로 변경할 수 있을 것이다.
 
#### 정리
- **클래스는 꼭 필요한 경우가 아니라면 불변이어야 한다.**
- 불변 클래스의 장점은 많으며 단점은 잠재적인 성능 저하 뿐이다.
- 모든 클래스를 불변으로 만들 수는 없을 것이다. 불변으로 만들 수 없는 클래스라도 변경할 수 있는 부분은 최소화하자.

> 다른 합당한 이유가 없다면 모든 필드는 private final이어야 한다.
    