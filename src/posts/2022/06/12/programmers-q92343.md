---
title: "[프로그래머스][level 3][#92343] 양과 늑대"
date: 2022-06-12T12:21:03+09:00
draft: false
description: " "
categories: ["problem-solving-questions"]
tags: ["코딩테스트", "프로그래머스", "DFS 유형"]
series: ["problem-solving-questions"]
eleventyExcludeFromCollections: true
---

## About

- **사이트**: 프로그래머스
- **이름**: 양과 늑대
- **수준**: 3
- **유형**: DFS
- **출제**: 2022 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/92343

## 해설

### 조건

이진 트리의 각 노드에 **늑대 또는 양**이 한 마리씩 있다. 루트에서 출발해 양을 모아야 한다.

노드에 방문할 때마다 해당 노드에 있던 늑대와 양이 따라오게 된다.

- 단, 만약 **모은 양의 수**보다 **늑대의 수가 같거나 많아지면** 모든 양이 잡아먹힌다.

중간에 양이 늑대에게 잡아먹히지 않도록 하며 **최대한 많은 수의 양**을 모아서 루트 노드로 돌아와야 한다.

위의 조건에 따라 **모을 수 있는 양은 최대 몇 마리인지**를 return 해야 한다.

### 풀이

매개변수로 넘어오는 `info`은 양(`0`)/늑대(`1`)을 담고 있고, `edges`는 `[부모 노드 번호, 자식 노드 번호]` 를 담고 있다. 0번 노드는 루트 노드이다.

매번 각 노드가 어떤 자식 노드를 갖고 있는지 `edges` 배열 만으로는 확인하기 번거롭다. `childs` 라는 2차원 배열(리스트)을 만들고, `childs[i]` 에는 각 노드에 존재하는 자식 노드를 `List<Integer>` 타입으로 저장한다.

**중요한 조건**이 하나 있다. 각 분기마다 자식 -> 부모 -> 자식으로 반대로 이동할 수도 있다. 즉, **아직 방문하지 않았다면 현재 노드의 레벨보다 높아도 방문할 수 있다**는 이야기다. 예를 들자면, 입출력 예 #1에서 `0->1->4`로 움직였다면 현재 분기, 현재 위치 (4)에서 방문할 수 있는 노드는 `[2, 3, 6, 8]` 이 있다.

이것을 처리하기 위해서 DFS에서 부모 노드로 이동하는 분기를 만들 수도 있다. 하지만 불필요한 재귀를 방지하기 위해 차라리 **각 분기마다 아직 방문하지 않은, 현재 분기에서 방문할 수 있는 노드의 번호 목록을 유지**해 `ArrayList<Integer> available` 이라고 두고, 처음에는 루트 노드 `0`을 넣어준다.

그리고 DFS를 이용해 루트 노드부터 출발해 백트래킹을 시작한다.

1. 늑대 또는 양인지를 확인한다. 여기서 양 또는 늑대를 확인할 때 [참고 블로그](https://velog.io/@hengzizng/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-%EC%96%91%EA%B3%BC-%EB%8A%91%EB%8C%80)에서 참고한 **XOR을 이용해 0 또는 1**로 양과 늑대를 구분했다. 그리고 현재 분기의 양의 수와 늑대의 수에 각각 더해준다.
2. 현재까지 모은 양의 수를 여태까지 다른 분기에서 모은 양의 수와 비교해 최대값을 저장한다.
3. 만약 늑대의 수가 양의 수보다 같거나 많다면 현재 분기를 종료한다.
4. **이전 분기에서 방문하지 않은 노드를 방문할 수도 있으므로,** `available`을 **그대로 복사하고**, 현재 **방문한 노드의 자식 노드**를 모두 방문할 목록 `available`에 넣어준다. **현재 방문한 노드는 제거**한다.

### 주의사항

Java의 경우 방문한 노드를 삭제하는 `remove()` 부분을 주의해야 한다. remove에 대해서는 [이 글](http://localhost:1313/posts/2022/05/06/java-listinteger%EC%97%90%EC%84%9C-remove%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%9B%90%EC%86%8C-%EC%82%AD%EC%A0%9C-%EA%B0%84-%EC%A3%BC%EC%9D%98%EC%A0%90/)을 참고한다. `Integer`로 캐스팅해주자.

## 코드

```java
import java.util.*;

public class Q92343 {

    private static int max = 0;
    private static List<Integer>[] childs;

    public int solution(int[] info, int[][] edges) {
        // 그래프 초기화
        initGraph(info, edges);

        // DFS로 완전 탐색
        // 다음으로 갈 수 있는 노드들의 번호
        ArrayList<Integer> available = new ArrayList<>();
        available.add(0);
        dfs(info, available, 0, 0, 0);

        return max;
    }

    private static void initGraph(int[] info, int[][] edges) {
        childs = new ArrayList[info.length];
        for (int[] edge : edges) {
            int parent = edge[0];
            int child = edge[1];

            if (childs[parent] == null) {
                childs[parent] = new ArrayList<>();
            }
            childs[parent].add(child);
        }
    }

    private static void dfs(int[] info, ArrayList<Integer> available, int cur, int sheepCnt, int wolfCnt) {
        sheepCnt += info[cur] ^ 1; // XOR 1 for !info[cur]
        wolfCnt += info[cur];

        // 답 갱신
        max = Math.max(sheepCnt, max);

        if (sheepCnt <= wolfCnt) {
            // 잡아먹히는 결과
            return;
        }

        // 다음으로 갈 수 있는 노드 갱신
        // 각각 경우의 수마다 필요하므로 새로 생성
        ArrayList<Integer> copyAvailable = new ArrayList<>();
        copyAvailable.addAll(available);
        if (childs[cur] != null) {
            copyAvailable.addAll(childs[cur]);
        }
        // 현재 방문한 노드는 제거
        copyAvailable.remove((Integer) cur);

        for (int next : copyAvailable) {
            dfs(info, copyAvailable, next, sheepCnt, wolfCnt);
        }
    }
}
```

## REF

[코드 및 개념 참고 블로그](https://velog.io/@topqr123q/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-2022-KAKAO-BLIND-RECRUITMENT-%EC%96%91%EA%B3%BC-%EB%8A%91%EB%8C%80-by-Java)

[코드 및 개념 참고 원본 블로그](https://velog.io/@hengzizng/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4-%EC%96%91%EA%B3%BC-%EB%8A%91%EB%8C%80)
