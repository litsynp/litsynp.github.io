---
title: "[프로그래머스][Level 2][#17679] 프렌즈4블록 해설"
date: 2022-06-05T02:50:33+09:00
draft: false
description: " "
categories: ["problem-solving"]
tags: ["코딩테스트", "프로그래머스", "구현 유형"]
series: ["코딩테스트 문제풀이"]
eleventyExcludeFromCollections: true
---

## About

- **사이트**: 프로그래머스
- **이름**: \[1차\] 프렌즈4블록
- **수준**: LEVEL 2
- **유형**: 구현
- **출제**: 2018 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/17679

## 참고

[참고 블로그](https://velog.io/@hyeon930/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-%ED%94%84%EB%A0%8C%EC%A6%884%EB%B8%94%EB%A1%9D-Java)

## 해설

주석을 달아두어 이해하기 쉬울 것이다.

enum, BFS, DFS를 처음에 생각했으나, 생각보다 단순하게 접근하면 되는 문제였다.

블록은 한번에 삭제되는 것이 아니라 4칸의 영역이 겹칠 수 있다. 따라서 따로 `checked` 라는 것을 둘 것이다.

문자를 넣어둘 `map`과, 삭제할 블록의 위치를 담아두는 `checked`를 둔다.

그리고 다음의 순서로 진행한다.

1. 모든 블록에 대해서, 빈 칸이 아닐 경우에 주변 4개를 검사한다. 주변 4개를 검사해서 같은 블록이 있다면 check 해둔다.

2. 다시 모든 블록에 대해서, check된 좌표를 삭제한다. 삭제한 개수는 따로 저장해둔다.

3. 삭제된 것이 하나도 없다면 종료한다. 삭제된 것이 있다면 `answer`에 개수를 더한다.

4. 삭제된 것이 있다면 중간 중간 빈칸이 생겼을텐데, 빈칸에 대해서는 블록을 하나씩 내려준다.

## 코드

[GitHub](https://github.com/litsynp/ps-java/blob/main/app/src/main/java/psjava/programmers/challenges/level2/Q17679.java)

```java
public class Q17679 {

    public int solution(int m, int n, String[] board) {
        char[][] map = new char[m][n];

        for (int i = 0; i < m; i++) {
            map[i] = board[i].toCharArray();
        }

        int answer = 0;
        // m: 세로 길이
        // n: 가로 길이
        while (true) {
            // 삭제할 블록 수
            int count = checkBlock(m, n, map);

            // 삭제한 블록이 없다면 종료
            if (count == 0) {
                break;
            }

            answer += count;

            // 빈 칸이 생겼다면 내려보냄
            dropBlock(m, n, map);
        }

        return answer;
    }

    static int checkBlock(int m, int n, char[][] map) {
        int count = 0;
        boolean[][] checked = new boolean[m][n];

        // 모든 블록에 대해서
        for (int r = 0; r < m - 1; r++) {
            for (int c = 0; c < n - 1; c++) {
                // 비어있으면 지나감
                if (map[r][c] == '.') {
                    continue;
                }

                // 비어있지 않다면 인접한 4칸 검사
                // 인접한 같은 종류의 4 블록이 있다면 check = true
                checkFour(map, checked, r, c);
            }
        }

        // 체크된 블록을 모두 빈 칸으로 만듦
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (checked[r][c]) {
                    // 빈칸이 된 블록 = "삭제할 블록"
                    count++;
                    map[r][c] = '.';
                }
            }
        }

        // 삭제할 블록 개수 반환
        return count;
    }

    static void dropBlock(int m, int n, char[][] map) {
        for (int c = 0; c < n; c++) {
            // 맨 아랫줄부터 좌->우 검사
            for (int r = m - 1; r >= 0; r--) {
                // 비어있는 공간이 있다면
                if (map[r][c] == '.') {
                    // 위로 한칸씩 올라가면서 블록을 찾으면 밑으로 내림
                    for (int nr = r - 1; nr >= 0; nr--) {
                        if (map[nr][c] != '.') {
                            map[r][c] = map[nr][c];
                            map[nr][c] = '.';
                            break;
                        }
                    }
                }
            }
        }
    }

    static void checkFour(char[][] map, boolean[][] checked, int r, int c) {
        // 현재 블록 종류
        char block = map[r][c];

        // 현재 블록을 포함해서 같은 종류의 블럭 4개가 인접한지 체크
        // X: 현재 블록, O: 검사할 인접한 블록
        // XO
        // OO
        // 의 방향으로만 검사
        for (int x = r; x <= r + 1; x++) {
            for (int y = c; y <= c + 1; y++) {
                if (map[x][y] != block) {
                    return;
                }
            }
        }

        // 모두 인접하다면 check
        for (int x = r; x <= r + 1; x++) {
            for (int y = c; y <= c + 1; y++) {
                checked[x][y] = true;
            }
        }
    }
}
```
