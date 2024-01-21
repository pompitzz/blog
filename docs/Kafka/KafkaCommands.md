---
title: Kafka(카프카) CLI 명령어 모음
date: 2024-01-21 21:03
img: 
    - kafka.png
tags: 
    - Kafka
---

```shell
# 카프카 다운로드 https://kafka.apache.org/downloads
wget https://archive.apache.org/dist/kafka/3.6.1/kafka_2.13-3.6.1.tgz # linux
curl https://archive.apache.org/dist/kafka/3.6.1/kafka_2.13-3.6.1.tgz -o kafka_2.13-3.6.1.tgz # mac

tar xvf kafka_2.13-3.6.1.tgz

# kafka 실행
./bin/zookeeper-server-start.sh -daemon ./config/zookeeper.properties
./bin/kafka-server-start.sh -daemon ./config/server.properties

jps -vm | grep kafka # Kafka JVM 프로세스 확인

# 토픽 생성
./bin/kafka-topics.sh --create --topic test-events --bootstrap-server localhost:9092 # --partitions 3 --replication-factor 1 --config retention.ms=172800000

# 토픽 파티션 개수 늘리기
./bin/kafka-topics.sh --alter --partitions 7 --topic test-events --bootstrap-server localhost:9092

# 토픽 목록
./bin/kafka-topics.sh --list --bootstrap-server localhost:9092

# 토픽 세부사항
./bin/kafka-topics.sh --describe --topic test-events --bootstrap-server localhost:9092

# 토픽 프로듀서
./bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-events

# 토픽 컨슈머
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-events # --from-beginning --property print.key=true --group test-group

# 컨슈머 그룹 목록
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list

# 컨슈머 그룹 세부사항
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group test-group
```
