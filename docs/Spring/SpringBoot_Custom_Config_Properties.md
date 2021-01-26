---
title: SpringBoot Type-Safe하게 Property 설정하기
date: 2020-12-05 22:53
img: 
    - spring.png
tags: 
    - Spring
---

- 스프링 부트에선 애플리케이션의 property 값들을 사용할 때 @Value 방식이 아닌 @ConfigurationProperties를 이용하여 Type-Safe한 POJO기반으로 관리할 수 있습니다.

### application.yml
```yaml
# resource/application.yml
my:
  server:
    host: localhost
    port: 8081
```
- 해당 yml를 기반으로 Property 설정을 진행 해보겠습니다.

## @ConfigurationProperties 사용
### 1. Configuration annotationProcessor 추가
```groovy
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-validation'
	
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	
	// configuration annotationProcessor 추가
	annotationProcessor "org.springframework.boot:spring-boot-configuration-processor"
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```
- configuration annotationProcessor를 추가하면 IDE 자동 완성 및 메타 데이터 활용을 지원해주므로 추가해줍니다.
    - [관련 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html#configuration-metadata-format) 

### 2. Property 클래스 추가
```java
@Getter
@Setter
@ConfigurationProperties(prefix = "my.server")
public class MyServerProperties {
    private String host;
    private int port;
}
```
- @ConfigurationProperties의 prefix를 설정하고 yml에 설정한 property name과 field name을 일치시키면 property 바인딩이 이루어집니다.  
- 일반적으로 스프링이 프로퍼티 값을 세팅할 때 빈 생성자, 세터를 활용하므로 세터 메서드가 필요합니다.

#### 생성자 바인딩 활용
```java
@Getter
@ConstructorBinding // 추가
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "my.server")
public class MyServerProperties {
    private final String host;
    private final int port;
}
```
- @ConstructorBinding를 추가하면 생성자 바인딩이 가능합니다.


### 3. Property Class 등록
- 다양한 방식으로 Property Class를 등록할 수 있습니다.

#### 1) @EnableConfigurationProperties: class별로 등록
```java
@EnableConfigurationProperties(MyServerProperties.class)
@SpringBootApplication
public class JavaSpringConfigurationApplication {
	public static void main(String[] args) {
		new SpringApplicationBuilder(JavaSpringConfigurationApplication.class)
				.web(WebApplicationType.NONE)
				.run(args);
	}
}
```
- @EnableConfigurationProperties는 Class별로 Property를 등록할 수 있습니다.

#### 2) @ConfigurationPropertiesScan: 스캐닝 방식 활용
```java
@ConfigurationPropertiesScan
@SpringBootApplication
public class JavaSpringConfigurationApplication {
	public static void main(String[] args) {
		new SpringApplicationBuilder(JavaSpringConfigurationApplication.class)
				.web(WebApplicationType.NONE)
				.run(args);
	}
}
```
- @ComponentSacn과 같은 방식으로 pakage를 중심으로 @ConfigurationProperties가 설정된 Property들을 모두 등록할 수 있습니다. 

#### 3) 일반 빈처럼 등록
```java
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "my.server")
public class MyServerProperties {
    private String host;
    private int port;
}
```
- Property Class를 일반 빈으로 등록하여 사용할 수도 있습니다.
- 단 **이 경우 @ConstructorBinding은 사용할 수 없습니다.**

### 참고 문서
- [Spring Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config-typesafe-configuration-properties)
