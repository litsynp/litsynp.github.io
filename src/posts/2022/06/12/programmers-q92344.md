---
title: "[프로그래머스][level 3][#92344] 파괴되지 않은 건물"
date: 2022-06-12T12:21:17+09:00
draft: false
description: " "
categories: ["problem-solving"]
tags: ["코딩테스트", "프로그래머스", "알고리즘 유형", "누적합"]
series: ["코딩테스트 문제풀이"]
eleventyExcludeFromCollections: true
---

## About

- **사이트**: 프로그래머스
- **이름**: 파괴되지 않은 건물
- **수준**: 3
- **유형**: 알고리즘
- **출제**: 2022 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/92344

## 해설

단순 3중 for문으로도 가능하지만, **"누적합"** 이라는 것을 이용하지 않으면 **효율성에서 탈락**하는 문제이다.

**누적합 (Prefix Sum, Cumulatvie Sum)**이란, **나열된 수의 누적된 합**을 뜻한다. 연산을 적용할 범위에서 연산 시작 점에 `N`을, 연산 끝 점에 `-N`을 표기하여 나중에 한번에 합산하는 방법이다.

이 문제의 경우엔 구간합을 구하는 데에 사용할 수 있다. 누적합은 1차원 배열에 적용하는 것이 기본이지만 이 문제의 경우 2차원 배열이므로 각 연산마다 4개의 좌표(범위)에 있는 값만 갱신시킨다. 갱신에 `O(1)`, 합산 과정에서 `O(N * M)` 의 시간 복잡도를 갖는다.

1. 일단 좌표를 받으면 누적합의 좌표로 바꿔서 누적합 연산 2차원 배열에 저장한다.
2. 연산마다 **상->하**, **좌->우** 순서로 더한다.
3. 마지막으로 2중 for문을 이용해 누적합 배열을 돌면서 파괴되지 않은 건물 (내구도가 1 이상)의 수를 더해 반환하면 된다.

누적합을 알면 맞히고 모르면 틀리는 문제라고 볼 수 있겠다.

### 누적합 합산 과정

누적합 합산 과정은 다음과 같이 진행된다.

![image](https://user-images.githubusercontent.com/42485462/173213368-6cccd815-2583-4f22-96b7-4f6b4be0ceaa.png)

## 코드

```java
public class Q92344 {

    public int solution(int[][] board, int[][] skill) {

        final int N = board.length;
        final int M = board[0].length;

        // 누적합 배열 생성
        int[][] accMap = new int[N + 1][M + 1];
        for (int[] s : skill) {
            int type = s[0];
            int r1 = s[1];
            int c1 = s[2];
            int r2 = s[3];
            int c2 = s[4];
            int degree = type == 1 ? -s[5] : s[5];

            accMap[r1][c1] += degree;
            accMap[r1][c2 + 1] += -degree;
            accMap[r2 + 1][c1] += -degree;
            accMap[r2 + 1][c2 + 1] += degree;
        }

        // 상하
        for (int r = 1; r < N; r++) {
            for (int c = 0; c < M; c++) {
                accMap[r][c] += accMap[r - 1][c];
            }
        }

        // 좌우
        for (int c = 1; c < M; c++) {
            for (int r = 0; r < N; r++) {
                accMap[r][c] += accMap[r][c - 1];
            }
        }

        // 결과 확인
        int answer = 0;
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < M; c++) {
                if (board[r][c] + accMap[r][c] > 0) {
                    answer++;
                }
            }
        }

        return answer;
    }
}
```

## REF

https://jangcenter.tistory.com/121

https://sskl660.tistory.com/77
