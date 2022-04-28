---
title: "프로그래머스에서 정답이 맞는데 아무리 해도 Test Case에서 오류나는 경우"
date: 2022-04-28T15:49:15+09:00
draft: false
categories: ["problem-solved"]
tags: ["ps"]
series: ["코딩테스트"]
cover:
  image: "https://file.newswire.co.kr/data/datafile2/thumb_640/2021/06/1993996598_20210610150326_5364622170.jpg"
  alt: "Programmers logo"
  caption: "Programmers"
  relative: false
---

# 프로그래머스에서 정답이 맞는데 아무리 해도 Test Case에서 오류나는 경우

프로그래머스에서 문제를 푸는데 아무리 해도 정답이 맞지 않는 경우가 있다.

그건 어쩌면 logic이 틀린게 아니라 변수 초기화 시점이 잘못됐을 수도 있다.

static을 이용해 전역으로 설정하고 있었다면,

[참고](https://programmers.co.kr/questions/13442)를 보면 `answer = 0` 초기화를 선언 시가 아닌 **solution 안에서 진행해야** 테스트케이스 오류가 나지 않음을 알 수 있다.

추측으로는 이전의 테스트 케이스 진행 중 `answer` 의 값이 이전 테스트 케이스에서 영향을 받은 걸지도 모르겠다.

이런 식으로 실전에서 맞아야 할 몇 문제를 더 틀렸을 수도 있었을 것 같다...

주의 해야겠다!
