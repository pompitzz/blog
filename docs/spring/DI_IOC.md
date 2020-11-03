---
sidebar: auto
title: Java, Spring 의존성 주입(DI), 제어의 역전(IoC)
date: 2020-08-16 17:29
img: 
    - java.png
tags: 
    - JAVA
    - Spring
---
- 의존성 주입과 제어의 역전은 스프링 공부를 하게 되면 반드시 접하게 되는 개념입니다. 
- 사실 이 개념들은 스프링 철학에 중심이 되는 개념일 뿐 스프링에만 속하는 특정한 개념들이 아니지만, 저의 경우 스프링 공부를 하면서 처음 접했고 단번에 이해하기 쉽지 않은 개념들인거 같습니다.
  
## 1. 의존성 주입(Dependency Injection)
- 의존성 주입을 알아보기 전에 **의존성**이 무엇인지에 대해 알아보겠습니다.

### 의존성
```java
@Getter
@AllArgsConstructor
public class User {
    private Long userId;
    private String name;
    private String email;
    private String phoneNumber;
}

public class UserRepository {
    private final Map<Long, User> userStore = new HashMap<>();

    public void save(User user) {
        userStore.put(user.getUserId(), user);
    }
}

public class UserService {
    private UserRepository userRepository;

    public void register(User user) {
        userRepository.save(user);
    }
}
```
- UserService.register가 호출되면 userRepository에 해당 user를 저장하고 회원가입이 완료되는 간단한 로직입니다.
- 자바에서 어떤 대상에게 의존성을 가지는 방법은 다양하며 UserService와 같이 필드 변수에 다른 객체를 가지고 있는 경우도 그중 하나입니다.
- 즉 UserService class에서 **UserService**는 **UserRepository**에 대해 의존하고 있기 때문에 **의존성**을 가진다고 할 수 있습니다.

```java
public class Main {
    public static void main(String[] args) {
        UserService userService = new UserService();
        userService.register(new User(1L, "Jayden", "qwe@gmail.com", "010-1234-1234"));
    }
}
```
- 위의 코드를 실행시켜보면 어떤 일이 발생할까요?
- 현재 userService에는 userRepository가 필드에 정의만 되어있을 뿐 어디에서도 인스턴스화 하지 않았기 때문에 userRepository는 Null이므로 NullPointerExcpetion가 발생할 것입니다.
  

```java
public class UserService {
    private UserRepository userRepository = new UserRepository();

    public void register(User user) {
        userRepository.save(user);
    }
}
```
- 가장 단순한 방법으로는 필드를 정의함과 동시에 UserRepository 객체를 생성해주면 정상적으로 동작할 것입니다.
- 즉 해당 코드를 동작시키기 위해서는 어떻게든 의존하고 있는 대상(UserRepository)에 대해 실제 객체를 정의해줘야 합니다.
- 지금과 같이 필드에서 객체를 직접 생성하지 않고 userRepository를 사용하기 위해선 또 어떤 방법이 있을까요?

### 의존성 주입
```java
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void register(User user) {
        userRepository.save(user);
    }
}
```
- UserService를 생성할 때 외부에서 UserRepository를 함께 결정하여 생성자 파라미터로 전달할 수 있을 것입니다.
- 이렇게 **의존하는 대상을 직접 결정하는 것이 아닌 외부에서 결정하여 주입해주는 것을 의존성 주입이라고 합니다.**
- UserService에서 사용할 객체를 직접 정의하지 않고 외부에서 주입해주는게 어떤 도움이 될까요?

### 의존성 주입의 장점
- 의존성 주입을 활용하면 의존 객체의 생성과 사용의 책임을 분리할 수 있습니다.
  - 생성과 사용의 책임을 분리하면 UserService에서는 UserRepository가 어떻게 만들어지는지 생각하지 않고 단지 UserRepository를 사용하기만 하면 됩니다.
  - **책임 분리를 통해 관심사를 분리하면 개발 시 생각할 범위를 좁힐 수 있어 복잡도를 줄일 수 있습니다.**
- 의존하는 객체와의 의존 관계를 컴파일 타임이 아닌 런타임에 결정할 수 있습니다.
  - 만약 UserRepository가 인터페이스라면 UserService는 컴파일 타임에는 실제로 UserRepository를 구현한 대상에 대해 알 수 없고 단지 인터페이스인 UserRepository에만 의존하게 됩니다.
  - 실제 런타임 시 UserService를 생성할 때 넘겨주는 UserRepository의 구현체에 따라 UserService가 의존하는 UserRepository 대상은 달라질 것입니다.
  - 이는 인터페이스가 아닌 단일 클래스에 의존하더라도 프록시를 활용하여 UserRepsitory의 프록시 객체를 주입해줄 수 있습니다.
  - **컴파일 타임이 아닌 런타임에 의존 관계를 결정하면 코드의 변경없이 기능을 확장할 수 있습니다.**

#### 생성과 사용의 책임 분리
```java
public class ObjectFactory {
    public UserService userService() {
        return new UserService(userRepository());
    }

    public UserRepository userRepository() {
        return new UserRepository();
    }
}

public class Main {
    public static void main(String[] args) {
        ObjectFactory objectFactory = new ObjectFactory();
        UserService userService = objectFactory.userService();
        userService.register(new User(1L, "Jayden", "qwe@gmail.com", "010-1234-1234"));
    }
}
```
- 의존성 주입을 활용하면 ObjectFactory와 같이 객체의 생성만을 담당하는 Factory를 만들 수 있습니다.
- Factory에서는 오직 객체의 생성만을 담당하기 때문에 객체 생성에 대한 변경이 필요할 때는 Factory만 살펴보면 되고, 해당 객체들을 사용하는 측에서는 어떻게 객체가 생성되는지 신경쓰지 않아도 됩니다.

#### 런타임에 의존 관계를 결정
```java
public interface NotificationService {
    void notify(User user, String message);
}

public class UserService {
    private UserRepository userRepository;
    private NotificationService notificationService;

    public UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public void register(User user) {
        userRepository.save(user);
        notificationService.notify(user, "회원가입 성공!");
    }
}
```
- 회원가입을 하는 로직에서 회원가입이 완료되면 알림을 보내는 서비스를 정의해보았습니다.
- UserService는 NotificationService에 대해 의존 관계를 가지고 있고, 생성자를 통해 의존성을 주입하고 있습니다.
- 여기서 NotificaitonService는 인터페이스이기 때문에 해당 코드만으로는 실제 어떤 NotificationService를 통해 알림을 보내는지 알 수 없습니다.
- 그러므로 컴파일 타임으로는 실제로 의존하는 NotificationService의 구현체를 알 수 없고 런타임 시 생성자에 넘어오는 NotificationService의 구현체에 따라 달라질 것입니다.

```java
public class SMSNotificationService implements NotificationService{
    @Override
    public void notify(User user, String message) {
        System.out.println("[문자 전송] To: " + user.getPhoneNumber() + " Message: " + message);
    }
}

public class MailNotificationService implements NotificationService{
    @Override
    public void notify(User user, String message) {
        System.out.println("[이메일 전송] To: " + user.getEmail() + " Message: " + message);
    }
}

public class ObjectFactory {
    public UserService userService() {
        return new UserService(userRepository(), smsNotificationService());
    }

    public UserRepository userRepository() {
        return new UserRepository();
    }
    
    public NotificationService smsNotificationService() {
        return new SMSNotificationService();
    }
}

public class Main {
    public static void main(String[] args) {
        ObjectFactory objectFactory = new ObjectFactory();
        UserService userService = objectFactory.userService();
        userService.register(new User(1L, "Jayden", "qwe@gmail.com", "010-1234-1234"));
    }
}
```
- SMS, Mail 알림 서비스가 있을 때 UserService의 NotificationService는 UserService를 생성할 때 넘겨주는 실체 구현 객체에 따라 UserService에서 사용하는 NotificationService는 달라질 것입니다.
- UserService는 단지 NotificationService에서만 의존하지만 런타임에 따라 실제 의존하는 대상들을 다르게 주입해줄 수 있기 때문에 **UserService의 코드를 변경하지 않고도 기능을 확장할 수 있게 됩니다.**
  - 만약 제가 UserService를 생성할 때 MailNotificationService 객체를 주입해줬다면 UserService의 코드는 아무런 변경없이 SMS에서 Mail로 알림을 변경할 수 있게 됩니다.
  - 사실 이는 널리 알러진 디자인 패턴 중 하나인 **전략(Strategy) 패턴**입니다.
- main 메서드에서는 ObjectFactory를 통해 UserService를 사용할 뿐 생성에 대해 어떠한 책임도 없기 때문에 NotificationService가 추가되어도 코드의 변경이 필요 없었습니다.

## 2. 제어의 역전(Inversion of Control)
- 제어의 역전이라는 용어는 다양한 곳에서 사용되는 용어입니다. 
- 어떤 객체가 의존하는 객체들을 스스로 선택한다면 해당 객체는 자신에 대한 제어권을 가진다고 할 수 있습니다.
- 그러므로, 이러한 제어권이 역전되어 어떤 객체가 의존하는 객체들을 스스로 선택하는게 아닌 외부에 의해 결정되는 것도 제어의 역전이라고 할 수 있습니다.
  - 현재 ObjectFactory에서 의존성 주입을 통해 객체들이 의존하는 객체들을 결정해주고 있습니다.
- **이를 통해 의존성 주입은 제어의 역전을 이루기위해 사용할 수 있는 하나의 방법인것을 알 수 있습니다.**
  - 스프링을 공부하면 의존성 주입과 제어의 역전라는 용어는 언제나 함께 나오는 이유가 스프링에서는 의존성 역전을 위해 가장 많이 사용되는 방법이 의존성 주입이기 때문입니다.


### 스프링의 IoC
- 스프링에는 ObjectFactory와 같은 역할을 하는 ApplicationContext가 존재하며 이를 IoC 컨테이너, DI 컨테이너라고 부릅니다.
- ApplicationContext에서는 스프링 빈으로 등록된 객체들의 관리해줍니다.
  - 스프링 빈이란 ApplicationContext가 제어권을 가질 수 있는 객체들을 의미합니다.
- ObjectFactory에서는 단지 객체들의 생성을 관리해주지만, ApplicationContext에서는 객체의 생성 뿐만아니라 생명주기 및 스코프등 설정에 따라 수많은 기능을 제공해줍니다.
