---
sidebar: auto
title: Spock 사용 시 주의해야 할 것들
date: 2020-11-23 23:27
img: 
    - groovy.png
tags: 
    - Groovy
---

## where block에는 @Shared, static
```groovy
class SpockTest extends Specification {
    @Shared int sharedMin = 1
    @Shared int sharedMax = 2

    static int MIN = 1
    static int MAX = 2

    def getMaxValue() { return 2 }
    def getMinValue() { return 1 }

    int minValue = 1
    int maxValue = 2

    def "max"() {
        expect:
        Math.max(a, b) == max

        where:
        a             | b             || max
        1             | 2             || 2
        sharedMin     | sharedMax     || sharedMax
        MIN           | MAX           || MAX
        getMinValue() | getMaxValue() || getMaxValue()
        // minValue  | maxValue  || maxValue 불가능
    }
}
```
- where block에서 공유 필드 데이터를 사용하기 위해선 @Shared or static 변수만 사용할 수 있습니다.
- 리터럴 or method 호출은 가능합니다.  

## helper method에는 def가 아닌 void
```groovy
class SpockHelperMethodTest extends Specification {
    class Point {
        int x
        int y
        Point(int x, int y) {
            this.x = x
            this.y = y
        }
    }

    def "point"() {
        expect:
        // spock은 def 메서드의 내부의 assert를 파악할 수 없다. 
        // assertPointWithDef(new Point(1, 2), new Point(1, 2))
        assertPointWithVoid(new Point(1, 2), new Point(1, 2))
    }

    def assertPointWithDef(Point actual, Point expect) {
        assert actual.x == expect.x
        assert actual.y == expect.y
    }

    void assertPointWithVoid(Point actual, Point expect) {
        assert actual.x == expect.x
        assert actual.y == expect.y
    }
}
```
- 테스트를 작성할 때 중복을 제거하기 위해 helper method를 이용할 때가 있는데 spock에서 then or expect block에서 helper method를 사용할 땐 void method를 사용해줘야 합니다.
- def 메서드의 경우 spock은 해당 메서드의 return 값이 true인지를 판별하게 됩니다.
    - assertPointWithDef는 null을 반환하게 되므로 expect block은 테스트가 실패했다고 보고합니다.
- void 메서드를 명시적으로 표현해줘야만 spock은 해당 메서드 내부의 assert문을 각각 수행해줍니다.

## mocking에서 사용되는 변수의 위치를 주의하자
```java
@RequiredArgsConstructor
class MessageService {
    private final MessageSender messageSender;

    void sendMessage(String message) {
        messageSender.send(message);
    }
}

public interface MessageSender {
    void send(String message);
}
```
- MessageService에서 MessageSender를 통해 message를 send하는 로직이 있다고 가정해보겠습니다.

### MissingPropertyException 예외 발생
```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)

        when:
        messageService.sendMessage("message")

        then:
        def message = "message"
        1 * messageSender.send(message) // mocking
    }
}
```
- 코드가 깔끔하진 않지만 에러가 전혀 발생할거 같지 않은 코드입니다. 하지만 테스트를 실행하면 MissingPropertyException가 발생합니다.
- **그 이유는 spock이 구문을 분석할 때 then block에 존재하는 mocking 구문을 파악한 후 when when block 앞으로 이동시키기 때문입니다.**
- 즉 아래와 같이 코드가 구성될 것입니다.

```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)
        // 실제 코드 배치는 이렇게 될 것이다.
        1 * messageSender.send(message) 

        when:
        messageService.sendMessage("message")

        then:
        def message = "message"
    }
}
```
- 이로 인해 message라는 변수는 실제 런타임 시 mocking 구문에서 찾을 수 없게 되어 에러가 발생하게 됩니다.

### 해결책 1) interaction blcok 활용
```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)

        when:
        messageService.sendMessage("message")

        then:
        interaction { // 해당 blcok을 활용하면 내부 코드가 함께 이동된다.
            def message = "message"
            1 * messageSender.send(message)
        }
    }
}
```
- interaction block 내부의 구문들은 실행 시 함께 when block 앞으로 이동되어 에러가 발생하지 않습니다.

### 해결책 2) given or where block에 변수를 명시하자
```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)
        def message = "message" // given block에 변수 지

        when:
        messageService.sendMessage("message")

        then:
        1 * messageSender.send(message)
    }
}
```
- mocking 구문은 when 앞으로 이동되기 떄문에 given block에 변수를 명시하면 에러가 발생하지 않습니다.

## stubbing과 mocking은 동시에 명시하자
### mockito style로 테스트 작성 시 에러 발생
```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)
        messageSender.send("message") >> { throw new RuntimeException() } // stubbing

        when:
        messageService.sendMessage("message")

        then:
        1 * messageSender.send("message") // mocking
        thrown(RuntimeException)
    }
}
```
- 흔히 mockio에서 테스트 코드를 작성할 때 처럼 given 절에 stubbing, then 절에 mocking 관련 코드를 넣게 되면 spock에선 테스트가 실패합니다.
- **그 이유는 mocking 구문을 when block 앞으로 이동시킬 때 동일한 대상으로 지정된 stubbing 구문은 정상 적용되지 않기 때문입니다.**
    - 즉 RuntimeException을 던지는 stubbing은 적용되지 않아 테스트가 실패합니다.
- 아래와 같이 stubbing, mocking을 동시에 명시하면 문제는 해결됩니다. 

```groovy
class MockingTest extends Specification {
    def "send message"() {
        given:
        MessageSender messageSender = Mock()
        MessageService messageService = new MessageService(messageSender)

        when:
        messageService.sendMessage("message")

        then: "stubbing, mocking은 동시에 명시하자"
        1 * messageSender.send("message") >> { throw new RuntimeException() }
        thrown(RuntimeException)
    }
}
```
