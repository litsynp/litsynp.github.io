---
title: "[프로그래머스][level 3][#92345] 사라지는 발판"
date: 2022-06-07T15:02:49+09:00
draft: false
summary: " "
categories: ["problem-solving"]
tags: ["코딩테스트", "프로그래머스", "DFS 유형"]
series: ["코딩테스트 문제풀이"]
eleventyExcludeFromCollections: true
---

## About

- **사이트**: 프로그래머스
- **이름**: 사라지는 발판
- **수준**: 3
- **유형**: DFS
- **출제**: 2022 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/92345

## 해설

- 최대 사이즈가 크지 않다 (1 <= 가로&세로 길이 <= 5)
- 움직일 때마다 밟고 있던 발판이 사라진다

라는 조건 덕분에 완전탐색으로 풀어도 문제가 없다.

DFS로 풀도록 하는데, 다음 조건으로 return 해본다.

- 이길 수 있는 케이스가 있다면 그 중에서 최선으로 이기는 케이스를 리턴한다. (승리)
- 질 수 밖에 없다면 최대한 오래 버티는 케이스를 리턴한다. (패배)

`board[ax][ay]` 를 0으로, B의 턴을 실행하고 나서 결과를 반환받으면 1로 만들어줌으로써 다른 분기를 검사할 수 있도록 한다.

승자는 가장 빨리 이기는 걸 선택하고, 패자는 최대한 늦게 지는 걸 선택한다.

모두 이기는 경우 최대한 빨리 이기는 것을, 모두 지는 경우 최대한 늦게 지는 걸 선택한다.

## 코드

[GitHub](https://github.com/litsynp/ps-java/blob/main/app/src/main/java/psjava/XXX.java)

{% raw %}

```java
public class Q92345 {

    int[][] board;
    int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    int MAX_X;
    int MAX_Y;


    public int solution(int[][] board, int[] aloc, int[] bloc) {
        this.board = board;
        MAX_X = board.length;
        MAX_Y = board[0].length;

        return dfs(aloc[0], aloc[1], bloc[0], bloc[1]);
    }

    int dfs(int ax, int ay, int bx, int by) {
        if (board[ax][ay] == 0) {
            return 0;
        }
        int result = 0;

        for (int[] dir : dirs) {
            int nx = ax + dir[0];
            int ny = ay + dir[1];

            if (isOut(nx, ny) || board[nx][ny] == 0) {
                continue;
            }

            board[ax][ay] = 0;
            int bMove = dfs(bx, by, nx, ny) + 1;
            board[ax][ay] = 1;

            if (result % 2 == 0 && bMove % 2 == 1) {
                result = bMove;
            } else if (result % 2 == 0 && bMove % 2 == 0) {
                result = Math.max(result, bMove);
            } else if (result % 2 == 1 && bMove % 2 == 1) {
                result = Math.min(result, bMove);
            }
        }
        return result;
    }

    boolean isOut(int x, int y) {
        return x < 0 || x >= MAX_X || y < 0 || y >= MAX_Y;
    }
}
```

{% endraw %}

## 관련 있는 / 유사한 알고리즘

[스프라그-그런디 정리](https://anz1217.tistory.com/110)

[미니맥스 알고리즘](https://ssollacc.tistory.com/43)

## REF

[해설](https://blog.encrypted.gg/1032)

[자바 풀이](https://velog.io/@pppp0722/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-Level3-%EC%82%AC%EB%9D%BC%EC%A7%80%EB%8A%94-%EB%B0%9C%ED%8C%90-Java)

[자바 풀이 2](https://velog.io/@weaxerse/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4Java-92345%EB%B2%88-%EC%82%AC%EB%9D%BC%EC%A7%80%EB%8A%94-%EB%B0%9C%ED%8C%90)
