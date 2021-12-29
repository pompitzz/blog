---
title: 애너테이션을 사용하지 않고 PropertySource 등록하기
date: 2021-10-18 23:24
img:
    - spring.png
tags:
    - Java
    - Spring 
---

사용자 정의 PropertySource를 등록할 때 `@PropertySource`를 사용하면 쉽게 등록이 가능하지만 다른 설정 값들을 기반으로 Property 파일을 유연하게 변경하기 어렵다. 

Property 파일을 유연하게 변경하기 위해 java code 기반으로 PropertySource를 알아보려고 한다.

## 방법 1.ApplicationContextInitializer
`ApplicationContextInitializer`를 통해 PropertySource를 추가할 수 있다.

```java
public class PropertySourceConfigurer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        try {
            MutablePropertySources propertySources = applicationContext.getEnvironment().getPropertySources();
            Resource resource = new ClassPathResource(resourcePath());
            propertySources.addLast(new ResourcePropertySource(resource));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to add property source", e);
        }
    }

    private String resourcePath() {
        // some logic...
        return "test.properties";
    }
}
```

스프링 부트 프로젝트라면 아래와 같이 Initizlizer를 추가할 수 있다.

```java
public static void main(String[] args) {
        new SpringApplicationBuilder(JavaSpringConfigurationApplication.class)
                .initializers(new PropertySourceConfigurer())
                .run(args);
    }
```

## 방법 2.EnvironmentPostProcessor(Spring Boot only)
스프링 부트에서는 스프링 부트 자체적으로 제공하는 `EnvironmentPostProcessor`를 통해 PropertySource를 추가할 수 있다.

```java
public class PropertySourceConfigurer implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            MutablePropertySources propertySources = environment.getPropertySources();
            Resource resource = new ClassPathResource(resourcePath());
            propertySources.addLast(new ResourcePropertySource(resource));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to add property source", e);
        }
    }

    private String resourcePath() {
        // some logic...
        return "test.properties";
    }
}
```

EnvironmentPostProcessor는 ApplicationContext 생성 전 Environment를 생성하는 시점에 실행된다.

그러므로 **스프링 빈 등록이 아닌 META-INF/spring.factories에 등록이 필요하다.**

```java
// resources/META-INF/spring.factories
org.springframework.boot.env.EnvironmentPostProcessor=com.example.demo.PropertySourceConfigurer
```


## 방법 3.BeanFactoryPostProcessor
빈 초기화 전 한번만 수행되는 `BeanFactoryPostProcessor`를 통해 PropertySource를 추가할 수 있다.

> @PropertySource 또한 `BeanFactoryPostProcessor`를 확장한 BeanDefinitionRegistryPostProcessor 구현체인 ConfigurationClassPostProcessor에서 추가된다.  

```java
@Component
public class PropertySourceConfigurer implements BeanFactoryPostProcessor, EnvironmentAware {

    private Environment environment;

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        if (environment instanceof ConfigurableEnvironment) {
            try {
                MutablePropertySources propertySources = ((ConfigurableEnvironment) environment).getPropertySources();
                Resource resource = new ClassPathResource(resourcePath());
                propertySources.addLast(new ResourcePropertySource(resource));
            } catch (Exception e) {
                throw new IllegalStateException("Failed to add property source", e);
            }
        }
    }

    private String resourcePath() {
        // some logic...
        return "test.properties";
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }
}
```
BeanFactoryPostProcessor는 ApplicationContext가 refresh될 때 수행되므로 빈 등록이 필요하다. 추가로 Environment를 사용하기 위해 EnvironmentAware 구현이 필요하다.
