---
title: "[Java] Garbage Collector in JVM"
date: 2022-02-12T11:28:52-08:00
draft: false
categories: ["Java"]
tags: ["Java"]
featuredImage: "https://stackify.com/wp-content/uploads/2017/05/Java-Garbage-Collection.png"
---

# Garbage Collection

## 가비지 컬렉션 (Garbage Collection, GC)

- **stop-the-world**
  - GC를 실행하기 위해 JVM이 애플리케이션 실행을 멈추는 것을 뜻한다. stop-the-world가 발생하면 **GC를 실행하는 thread를 제외한 나머지 thread는 모두 작업을 멈춘다.** 어떤 GC 알고리즘을 사용하더라도 stop-the-world는 발생한다. 대개 GC 튜닝이란 이 stop-the-world 시간을 줄이는 것을 뜻한다.
- Java에서는 프로그램 코드로 (`null` 할당, `System.gc()` 호출, ...) 메모리를 명시적으로 해제할 필요가 없다.
- GC의 과정을 **Mark and Sweep**이라고도 한다. GC가 스택의 모든 변수, 또는 Reachable 객체를 스캔하면서 각각 어떤 객체를 참조하고 있는지 찾는 과정을 **Mark**라고 한다. 이 과정에서 stop-the-world가 발생한다. 이후 Mark 되어있지 않은 객체들을 힙에서 제거하는 과정이 **Sweep**이다.
- **Reachability**
  - Java의 GC는 가비지 객체를 판별하기 위해 **reachability** 라는 개념을 사용한다.
  - **reachable**은 Stack에서 Heap 영역의 객체에 대해 참조 할 수 있는지를 뜻한다.
  - 어떤 객체에 유효한 참조가 있으면 **reachable**, 없으면 **unreachable**로 구별한다.
  - unreachable 객체를 **가비지로 간주**한다.
- JVM의 Heap은 **Young, Old, Perm** 세 영역으로 나뉜다. Young 영역에서 발생한 GC를 **Minor GC**, 나머지 두 영역에서 발생한 GC를 **Major GC**(**Full GC**)라고 한다.
  - Young (Generation) 영역: 새롭게 생성한 객체가 위치한다. 대부분의 객체가 금방 unreachable 상태가 되기 때문에 많은 객체가 Young 영역에 생성되었다가 사라진다.
  - Old (Generation) 영역: Young 영역에서 reachable 상태를 유지해 살아남은 객체가 여기로 복사된다. 대부분 Young 영역보다 크게 할당하며, 크기가 큰 만큼 Young 영역보다 GC는 적게 발생한다.
  - Perm 영역: **Method Area**라고도 한다. 클래스와 메소드 정보와 같이 자바 언어 레벨에서는 거의 사용되지 않는 영역이다.

## REF

[https://d2.naver.com/helloworld/1329](https://d2.naver.com/helloworld/1329)

[https://velog.io/@litien/가비지-컬렉터GC](https://velog.io/@litien/%EA%B0%80%EB%B9%84%EC%A7%80-%EC%BB%AC%EB%A0%89%ED%84%B0GC)
