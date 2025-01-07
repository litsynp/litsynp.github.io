---
title: Flip-Flops and Latches
date: 2023-10-10T22:23:30+09:00
draft: false
categories: []
tags: ["electronics"]
description: "Flip-flops와 latches에 대해 알아보자."
series: ["tir"]
featuredImage: ""
toc: true
eleventyExcludeFromCollections: ["posts"]
---

## Flip-Flops and Latches

- Sequential Logic: 순차 회로는 저장할 시점을 정하기 위해 주기적인 신호(e.g., Clock)를 필요로 한다.
- Flip-flop와 latch는 1 bit 를 저장할 수 있다.

### Flip-Flops

Flip-flop을 FF라고도 부르며, 휘발성 메모리의 역할을 한다.

- Timing signal은 0과 1이 주기적으로 반복해서 들어오게 된다.
- 0에서 1로 바뀌는 순간을 상승 엣지(rising edge), 1에서 0으로 바뀌는 순간을 하강 엣지(falling edge)라 한다.

### Latches

래치(latch)라는 단어는 문고리를 걸어 잠근다는 의미인데, 회로에서 클럭과 같은 신호가 입력을 걸어 잠가는 역할을 하므로 적절한 용어라고 할 수 있다.

### Differences?

Flip-flop과 latch는 서로 바꿔서(interchangeably) 쓰이기도 한다. 구분점은 flip-flop은 clock을 신호로 갖는 **edge-triggered** 이며, latch는 clock이 어떻든 신경쓰지 않고 현재 control signal만 확인하는 **level-triggered** 이다.

그래서 사실 저 차이점을 제외하면 동일하게 적어도 된다.

종류는:

- **R-S(Reset-Set) flip-flops(latches)**: 가장 간단한 FF(또는 latch)로, 대칭 형태를 띄고 있다.
- **Level-triggered D-type latches**: Data 비트와 값 보존 비트로 사용되는 클럭(Clock, Clk)를 입력으로 갖고 있다. 1-bit 메모리라고도 불린다.
- **Edge-triggered D-type flip-flops**: Data 비트와 값 보존 비트로 사용되는 클럭(Clock, Clk)를 입력 외에도 프리셋(Pre), 클리어(Clr) 신호가 있는데, 이 두 신호는 클럭이나 데이터 신호보다 높은 우선 순위를 갖는다. Level-triggered D-type latches보다 더 복잡하다.

## Triggers

시스템에서 특정 이벤트를 감지하기 위해 트리거(trigger)라는 개념을 사용한다.
트리거는 크게 **레벨 트리거(Level Trigger)**, **엣지 트리거 (Edge Trigger)** 로 나눌 수 있다.

### Level Triggers

레벨 트리거는 상태 변수의 현재 상황을 기준으로 동작한다.
체크 당시 상태가 1이면 이벤트를 발생시키고, 0이면 이벤트를 발생시키지 않는 방식이다.

- Latch는 `level-triggered`이다.

### Edge Triggers

엣지 트리거는 상태 변수가 "변하는 순간"을 기준으로 동작한다.
변하는 순간은 두 가지로 나뉜다:

1. 상승 엣지 (Rising Edge): 상태가 0에서 1로 변하는 순간
2. 하강 엣지 (Falling Edge): 상태가 1에서 0으로 변하는 순간

상태가 0에서 0 또는 1에서 1로, 변하지 않는 상태에서 체크를 하면 트리거가 이벤트를 발생시키지 않는다.

즉, 상태가 0에서 1 또는 1에서 0으로 전이되는 순간 엣지 트리거가 이벤트를 발생시킨다.

- Flip-flop은 `edge-triggered`이다.
- 간소화된 회로를 그릴 때 상자 안의 클럭 신호 옆에 각괄호(`>`)가 있다면 edge-triger 속성을 갖고 있다는 뜻이다.

## References

- [도서 - Code: The Hidden Language of Computer Hardware and Software](https://www.amazon.com/Code-Language-Computer-Hardware-Software/dp/0137909101)
- [21. 플립 플롭과 래치 (Flip Flops and Latchs: Sequential Logic)](https://skyil.tistory.com/82)
- [에지 트리거(Edge Trigger, ET)와 레벨 트리거(Level Trigger, LT)의 차이점](https://soft.plusblog.co.kr/55)
- [Is there a difference between an SR flip-flop and an SR latch? If so, what are the differences?](https://www.quora.com/Is-there-a-difference-between-an-SR-flip-flop-and-an-SR-latch-If-so-what-are-the-differences)
