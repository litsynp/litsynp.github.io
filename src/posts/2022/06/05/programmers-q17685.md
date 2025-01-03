---
title: "[프로그래머스][Level 4][#17685] 자동완성 해설"
date: 2022-06-05T02:51:30+09:00
draft: false
summary: " "
categories: ["problem-solving"]
tags: ["코딩테스트", "프로그래머스", "문자열 유형"]
series: ["코딩테스트 문제풀이"]
---

## About

- **사이트**: 프로그래머스
- **이름**: \[3차\] 자동완성
- **수준**: LEVEL 4
- **유형**: 문자열
- **출제**: 2018 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/17685

## 해설

처음에 그래프, 트리 구조를 떠올리고 그렇게 구현해보려 했으나 생각보다 쉽게 안됐다.

그러다가 참고하게 된 아이디어는 다음과 같다.

1. 우선 사전순으로 정렬을 한다.
2. 모든 문자열에 대해서 입력해야되는 문자 수를 0으로 초기화한다.
3. 2개씩 묶어서 비교하면 된다.
4. 둘 중에 길이가 작은 것의 길이를 구한다. `shorter`라고 둔다.
5. 둘 중 처음으로 문자가 달라지는 곳의 위치를 구한다. `firstDiff` 라고 둔다.
6. 먼저 들어온 문자열에 대해서, 만약 `shorter`와 `firstDiff`가 같다면, 입력할 문자 수는 `firstDiff` 이다. 다르다면 이전에 저장된 값 `result[i]`와 `firstDiff + 1` 중 큰 쪽이 입력해야 할 문자의 수다.
7. 나중에 들어온 문자열은 `firstDiff + 1` 이라고 해둔다.

처음에 듣고 왜 무조건 나중에 들어온 문자열이 `firstDiff + 1` 인가 고민했다. 중요한 점은 문자열들은 사전 순으로 배열 안에서 정렬이 돼있다는 것이다. 사전 순으로 정렬했다고 길이가 긴 문자열이 뒤로 가는 것은 아니다.

또한 앞뒤만 뷔교해서 풀 수 있다는 것을 받아들여야 한다. 이해하기 몹시 어렵다. 이 역시도 사전 순으로 정렬돼있기 때문에 가능하다. 그리고 동일한 문자열은 존재하지 않는다는 것이다. 사전순으로 정렬돼있고 동일한 문자열은 존재하지 않기 때문에 앞뒤로만 비교하고 다른 부분만 찾아서 계산하면 된다.

### 예시

`words`가 다음과 같이 들어왔다고 가정하자: `[abc, abdf, abdg, ac]`.

### 1번 묶음

- abc (0) -> (3)
- abdf (0) -> (3)

라면, `shorter` = 3, `firstDiff` = 2 (c != d)이다. 둘이 다르기 때문에, 먼저 들어온 문자열 abc는 `result[i]` = 0과 `firstDiff + 1` = 3을 비교해 큰 쪽인 3을 입력해야 한다. 나중에 들어온 문자열 abdf는 `firstDiff + 1` = 3이다.

### 2번 묶음

- abdf (3) -> (4)
- abdg (0) -> (4)

라면, `shorter` = 4, `firstDiff` = 3이다. 마찬가지로 먼저 들어온 문자열 abdf는 `result[i]` = 3과 `firstDiff + 1` = 4를 비교해 큰 쪽인 4를 입력한다. 나중에 들어온 문자열 abdg는 `firstDiff + 1` = 4이다.

### 3번 묶음

- abdg (4) -> (4)
- ac (0) -> (2)

라면, `shorter` = 2, `firstDiff` = 1이다. 먼저 들어온 문자열 abdg는 `result[i]` = 4과 `firstDiff + 1` = 2를 비교해 큰 쪽인 4를 입력한다. 나중에 들어온 문자열 ac는 `firstDiff + 1` = 2이다.

### 정답

따라서 다음과 같다.

- abc = 3
- abdf = 4
- abdg = 4
- ac = 2

답은 3 + 4 + 4 + 2인 13이다.

## 참고

아이디어를 공유해준 친구 블로그다. 굉장히 참신한 아이디어인 것 같다. 다른 곳에 구글링해도 안나오는 방식으로 풀었다.

[앱등개발자IOS 블로그](https://appdung-ioss.tistory.com/)

## 코드

[GitHub](https://github.com/litsynp/ps-java/blob/main/app/src/main/java/psjava/programmers/challenges/level4/Q17685.java)

```java
import java.util.*;

public class Q17685 {

    public int solution(String[] words) {
        Arrays.sort(words);
        int[] result = new int[words.length];

        for (int i = 0; i < words.length - 1; i++) {
            int shorter = Math.min(words[i].length(), words[i + 1].length());
            int firstDiff = findFirstDiff(words[i], words[i + 1], shorter);

            if (shorter == firstDiff) {
                result[i] = firstDiff;
            } else {
                result[i] = Math.max(result[i], firstDiff + 1);
            }
            result[i + 1] = firstDiff + 1;
        }

        return Arrays.stream(result).sum();
    }

    static int findFirstDiff(String word1, String word2, int len) {
        int i = 0;
        for (i = 0; i < len; i++) {
            char c1 = word1.charAt(i);
            char c2 = word2.charAt(i);

            if (c1 != c2) {
                break;
            }
        }
        return i;
    }
}
```
