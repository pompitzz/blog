---
sidebar: auto
title: AWS EC2에 JDK 11 설치하기
date: 2020-07-05 17:44
img: java.png
tags: 
    - AWS
    - JAVA
---

- EC2 JDK 버전을 로컬 환경과 맞추기 위해 JDK11로 업그레이드 할 필요가 생겼습니다.
- yum으로 설치하려고 했으나 아래와 같이 설치 가능한 jdk 목록에 jdk11은 존재하지 않았습니다.
- Amazon에서 제공하는 OpenJDK인 Amazon Coretto를 curl로 다운받아 간편하게 설치할 수 있습니다. 


```shell script
yum list java*jdk-devel # 설치 가능한 jdk 확인
# java-1.6.0-openjdk-devel.x86_64                                       1:1.6.0.41-1.13.13.1.77.amzn1                                       amzn-main
# java-1.7.0-openjdk-devel.x86_64                                       1:1.7.0.261-2.6.22.1.83.amzn1                                       amzn-updates
# java-1.8.0-openjdk-devel.x86_64                                       1:1.8.0.252.b09-2.51.amzn1                                          amzn-updates
```


## JDK 설치
```shell script
# aws coreetto 다운로드
sudo curl -L https://corretto.aws/downloads/latest/amazon-corretto-11-x64-linux-jdk.rpm -o jdk11.rpm

# jdk11 설치
sudo yum localinstall jdk11.rpm

# jdk version 선택
sudo /usr/sbin/alternatives --config java

# java 버전 확인
java --version

# 다운받은 설치키트 제거
rm -rf jdk11.rpm
```

## 이전 버전 제거하기
```shell script
yum list installed | grep "java" # yum 설치 리스트 확
# java-1.8.0-openjdk-headless.x86_64    1:1.8.0.222.b10-0.47.amzn1   @amzn-updates
# java-11-amazon-corretto-devel.x86_64  1:11.0.7.10-1                installed

sudo yum remove java-1.8.0-openjdk-headless.x86_64 
```
- jdk 설치 목록에서 버전을 확인한 후 위와 같이 제거할 수 있습니다.

## 참고자료
- [AWS Corretto JDK List](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/downloads-list.html)