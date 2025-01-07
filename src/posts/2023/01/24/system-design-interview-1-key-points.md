---
title: "Key Points"
description: "일종의 노트 개념으로 핵심 포인트만 모아봅니다."
tags: ["books"]
series: "가상 면접 사례로 배우는 대규모 시스템 설계 기초 (System Design Interview)"
date: 2023-01-24T03:23:00+09:00
eleventyExcludeFromCollections: ["posts"]
---

## 지표

- **규모 확장성** (서버 1대 → N대), **고가용성** (high availability)
  - 다중화 (replication)
  - 샤딩 (sharding)
    - 작업 대상 데이터의 양을 줄일 수 있다
    - 샤딩 정책 - 데이터를 서버마다 균등하게 배분하는 방법 고안
- 동시성
  - 이중화/다중화
    - 무상태 (stateless)하게 유지
  - 동기화
    - 동기화 충돌
      - 버저닝
- 일관성
  - RDB - ACID 보장
  - NoSQL - ACID 기본 지원하지 않음, 프로그래밍 로직으로 대체
- 응답 속도
  - 시스템의 응답 속도: \~100ms

## 요구사항

일간 능동 사용자는? 매일 평균 몇 건의 작업을 수행하는지/평균 소비하는 시간이 얼마인지? 각 작업마다 평균 몇 바이트의 데이터가 필요한지?

### 트래픽 규모

- 일별 능동 사용자 수(**DAU**: Daily Active User)
  - 5천만(5M)?
- 인원 제한은 어느 정도로 해야 하는지?
- 동시 접속자 수
  - 동시 접속자 수 x 접속 당 필요한 서버 메모리 = 접속에 필요한 서버 메모리
- CDN (Content Delivery Network)
  - 캐시
  - 국가/지역별 센터에 배치하여 사용자 근거리로 지정해 응답 지연 개선

### QPS (Query Per Second)

초당 몇 번의 질의가 들어오는지를 구한다.

**최대 QPS** \~= QPS \* 2

### 데이터 보관 기간

- 내용/길이 제한
- 보관 기한 (10년, … 영원히)
- 공간 절약 (p.296)
  - 중복 제거(de-dupe) - 두 블록이 같은 블록인지 해시값으로 판단
  - 지능적 백업 전략
    - 한도 설정
    - 중요한 버전만 보관
  - 아카이빙 저장소(cold storage) - 자주 쓰이지 않는 데이터는 아카이빙 (e.g., AWS S3 Glacier)

### 응답 지연 (Latency)

몇 ms 안에 처리해야하는지?

### 클라이언트

#### 지원 기기

모바일 앱 / 웹(브라우저) / 스마트 TV / …

### 데이터 관련

- 암호화
- 데이터 유형
  - RDBMS
    - 일반적인 데이터
    - 데이터 가운데 롱 테일(long tail)에 해당하는 부분을 잘 처리하지 못함.
    - 인덱스가 커지면 데이터에 대한 무작위 접근(random access)을 처리하는 비용이 늘어남.
      - e.g., 특정 사용자가 언급된 메시지를 보거나, 특정 메시지로 점프(jump)하여 무작위한 데이터 접근을 하는 경우
  - NoSQL - 자유로움
  - Key-Value Store
    - 수평적 규모확장(horizontal scaling)이 쉬움
    - 데이터 접근 지연 시간(latency) 낮음
    - 많은 안정적인 채팅 시스템이 채택
      - Facebook Messenger - HBase
      - Discord - Cassandra

### 캐싱 (Caching)

- 캐시 미스(cache miss) (p.238)
  - 데이터가 캐시에 없는 경우
  - 캐시 서버의 메모리가 부족할 경우
  - 캐시 서버에 장애가 있을 경우
- 브라우저 캐싱(browser caching) (p.239)
  - cache-control 응답 헤더 활용
  - e.g., 구글 검색 엔진

### 추가 논의 / 처리 기법 / 키워드

- 다양한 파일 유형 (확장성)
  - 원본 저장소(original storage) (p.252)
    - 대형 이진 파일 저장소(BLOB: Binary Large Object storage) - 이진 데이터를 하나의 개체로 보관하는 데이터베이스 관리 시스템
- 종단간 암호화
- 안전성
- 성능 개선 (p.267)
  - CDN
  - 병렬화 - 느슨하게 결합된 시스템 만들기 (e.g., 메시지 큐)
- 오류 처리
- 다국어 지원
- 스트림 프로세싱
  - 아파치 하둡 맵리듀스(Apache Hadoop MapReduce)
  - 아파치 스파크 스트리밍(Apache Spark Streaming)
  - 아파치 스톰(Apache Storm)
  - 아파치 카프카(Apache Kafka)
- 안정 해시
- 블룸 필터
- 메세지 큐
- 오류 처리 (p.272)
  - 회복 가능 오류(recoverable error) - 몇 번 더 시도(retry)하면 해결된다. 복구 어려우면 오류 코드 반환
  - 회복 불가능 오류(non-recoverable error) - 중단 후 오류 코드 반환
- 로드 밸런싱
  - 로드 밸런서(load balancer): API 서버 각각으로 고르게 요청을 분산하는 역할
  - 로드밸런서끼리 박동(heart) 신호를 주기적으로 보내서 상태를 모니터링 (p.297)
- 트라이 (Trie) (p.229)
- 데이터 샘플링 (p.239)
- 롱테일 (p.271)

### ID 생성 방식 (Ch.7 - 분산 시스템을 위한 유일 ID 생성기 설계)

- base64 (요구사항에 따라 base62 등 다양)
- UUID
- 스노우플레이크 - 전역적 64-bit 순서 번호(sequence number) 생성기
- 지역적 순서 번호 생성기 (local sequence number generator) - ID의 유일성은 같은 그룹(e.g., DB 파티션) 안에서만 보장

### 서비스 탐색 (Service Discovery)

- 기준
  - 클라이언트의 위치(geographical location)
  - 서버의 용량(capacity)
- 솔루션
  - 아파치 주키퍼(Apache Zookeeper) - 사용 가능한 서버를 등록시켜두면 클라이언트가 접속을 시도하면 사전에 정한 기준에 따라 최적의 서버를 골라준다.

## 개념

### SPOF (Single Point of Failure)

- 해당 서버가 죽으면 해당하는 전체 서비스가 중단, 최악의 경우 다른 서비스까지 중단
- 해결법: 다중화
- 서버 1대는 지양해야 함

### 채팅

- 양방향 통신
  - 폴링(polling)
  - 롱 폴링(long polling)
    - Dropbox
  - 웹소켓(WebSocket)
- 상태 유지 서비스 (웹소켓)
- 접속 상태 관리
  - 접속 장애
    - 박동(heartbeat) 검사
      - 마지막 이벤트를 받은 지 x초 이내에 또 다른 박동 이벤트 메시지를 받으면 접속 상태를 온라인으로 유지, 그렇지 않으면 오프라인
      - e.g., 매 5초바다 박동 이벤트를 보내고, 30초 동안 아무런 메시지를 받지 않으면 오프라인으로 변경

### 비디오 스트리밍 (Ch.14)

- 비디오 트랜스코딩 (p.253) - 비디오 인코딩이라고 부르기도 하는 절차로, 비디오의 포맷(MPEG, HLS 등)을 변환하는 절차. 단말이나 대역폭 요구사항에 맞는 최적의 비디오 스트림을 제공하기 위해 필요.
- 스트리밍 프로토콜(streaming protocol) (p.256)
  - 비디오 스트리밍을 위해 데이터를 전송할 때 쓰이는 표준화된 통신 방법
  - 널리 쓰이는 방식
    - MPEG-DASH (Moving Picture Experts Group - Dynamic Adaptive Streaming over HTTP)
    - Apple HLS (HTTP Live Streaming)
    - Microsoft Smooth Streaming
    - Adobe HTTP Dynamic Streaming (HDS)
  - 프로토콜마다 지원하는 비디오 인코딩이 다르고 플레이어도 다르다. 따라서 서비스의 용례에 맞는 프로토콜을 선택해야 한다.
