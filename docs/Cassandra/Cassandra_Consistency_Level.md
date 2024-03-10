---
title: 카산드라 Consistency Level
date: 2021-04-19 22:24
img: 
    - cassandra.png
tags: 
    - Cassandra
---

## Write consistency levels
### 1. ALL
- 클러스터의 모든 replica 노드들의 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level
- 가장 높은 일관성을 보장하지만 가용성은 가장 낮다.

### 2. EACH_QUORUM
- 각 datacenter에서 `QUORUM`만큼의 replica 노드들의 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level
- 특정 dc가 다운되면 QUORUM수를 만족하지 못해 쓰기 동작이 실패할 것이므로 각 datacenter를 같은 수준의 일관성으로 유지하고 싶을 때 사용할 수 있다.

#### 데이터센터(datacenter)?
- 여기서 의미하는 datacenter는 특정 클러스터에서 `replication`, `workload segregation`을 목적으로 구성된 `노드들의 그룹`을 의미
- 흔히 아는 물리적 데이터 센터를 의미하는 것이 아님
- [참고(datastax glossary)](https://docs.datastax.com/en/glossary/doc/glossary/gloss_data_center.html)

#### QUORUM 공식
- `quorum = floor(sum of replication factors / 2) + 1`
- `sum of replication factors = datacenter1_Replication Factors + dc2_RF + ... + dcN_RF`

**예시 1)**
- replication factors = 3인 경우 quorm = 2가 되므로 1개의 노드가 다운되어도 정상 동작

**예시 2)**
- datacenter가 2개 있고 각 dc의 replication factors = 3인 경우 quorm = 4가 되므로 2개의 노드가 다운되어도 정상 동작

> EACH_QUORUM의 경우 각 dc를 기준으로 하므로 dc1에서 1개, dc2에서 1개의 노드가 다운되었을 경우에만 정상 동작할 것이고 QUORUM은 dc1에서는 0개, dc2에서 2개의 노드가 다운되어도 정상 동작 할 것이다.

### 3. QUORUM
- 모든 datacenter에서 `QUORUM`만큼의 replica 노드들의 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level

### 4. LOCAL_QUORUM
- coordinator node가 존재하는 datacenter에서 `QUORUM`만큼의 replica 노드들의 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level
- multiple datacenter cluster에서 사용되며 하나의 dc에서 이루어지므로 dc간의 통신 지연을 방지할 수 있다.

#### coordinator node
- 클러스터에서 어떤 노드들이 요청을 받아야 하는지 결정하는 노드

### 5. ONE, TWO, THREE
- 적어도 1(ONE) or 2(TWO) or 3(THREE)개의 replica 노드에 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level

### 6. LOCAL_ONE
- local datacenter에서 적어도 하나의 replica 노드에 `commit log`와 `memtable`에 쓰기 동작이 완료되어야 하는 level

#### ONE vs LOCAL_ONE
- multiple datacenter에서 보통 ONE level이 적절하지만 각 dc간의 통신을 피하기 위해 LOCAL_ONE을 사용할 수 있다. 

### 7. ANY
- 모든 replica 노드들이 다운되어도 쓰기 동작이 가능한 level
- 모든 replica 노드들이 다운되었다면 ANY 동작으로 쓰기가 성공한 데이터는 노드들이 회복될 때까지 읽을 수 없다.
- 가장 높은 가용성을 보장하지만 일관성은 가장 낮다. 

## Read consistency levels
### 1. ALL
- 모든 replica 노드들이 응답을 해야 값을 반환하는 level로 하나의 노드라도 응답하지 않으면 읽기 동작은 실패한다.
- 가장 높은 일관성을 보장하지만 가용성은 가장 낮다.

### 2. EACH_QUORUM
- 읽기에선 제공하지 않음

### 3. QUORUM
- 모든 datacenter에서 `QUORUM`만큼의 replica 노드들이 응답을 해야 값을 반환하는 level

### 4. LOCAL_QUORUM
- coordinator node가 존재하는 datacenter에서 `QUORUM`만큼의 replica 노드들이 응답을 해야 값을 반환하는 level
- multiple datacenter cluster에서 사용되며 하나의 dc에서 이루어지므로 dc간의 통신 지연을 방지할 수 있다.

### 5. ONE, TOW, THREE
- 가장 가까운 1(ONE) or 2(TWO) or 3(THREE)개의 replica 노드가 응답하는 경우 값을 반환하는 level
- 오래된 데이터를 읽어도 큰 문제가 없는 경우 가장 높은 가용성을 제공하는 level이다.

### 6. LOCAL_ONE
- local datacenter에서 가장 가까운 하나의 replica 노드가 응답하는 경우 값을 반환하는 level

### 7. SERIAL
- 모든 datacenter에서 `QUORUM`만큼의 replica 노드에서 커밋 되지 않은 상태의 데이터를 읽을 수 있는 level
- 가장 최신의 값을 읽기 위해 사용할 수 있다.

### 8. LOCAL_SERIAL
- SERIAL과 동일하나 local dc로 제한한다.

## 참고 자료
- [datastax docs](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html)
