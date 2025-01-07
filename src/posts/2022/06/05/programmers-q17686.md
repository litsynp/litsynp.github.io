---
title: "[프로그래머스][Level 2][#17686] 파일명 정렬 해설"
date: 2022-06-05T02:50:40+09:00
draft: false
description: " "
categories: ["problem-solving-questions"]
tags: ["코딩테스트", "프로그래머스", "문자열 유형"]
series: ["problem-solving-questions"]
eleventyExcludeFromCollections: true
---

## About

- **사이트**: 프로그래머스
- **이름**: \[3차\] 파일명 정렬
- **수준**: LEVEL 2
- **유형**: 문자열
- **출제**: 2018 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/17686

## 해설

정규표현식을 잘 구글링해서 풀었다. 솔직히 깔끔한 방법은 아니다.

`(?<=\\D)(?=\\d)`라는 정규표현식으로 숫자가 아닌 문자열과 숫자로 시작하는 문자열을 나눈다.

숫자로 시작하는 문자열은 다시 `\\d+`로 숫자만 걸러준다. 그 외의 부분은 버려도 좋다.

\* 참고로, `matcher.group()`를 사용하면 match 결과 전체를 준다. 그룹을 지정했다면 매개변수로 그룹의 숫자를 넣어주면 된다.

그렇게 `List`에 하나씩 `add` 해주고, 나중에 정렬을 진행해 순서대로 반환한다.

정렬 기준은 클래스에서 `Comparable` 인터페이스를 `implement` 하고 `compareTo`를 오버라이딩하였다. 문제의 정의대로 순서대로 비교해주면 된다.

## 코드

[GitHub](https://github.com/litsynp/ps-java/blob/main/app/src/main/java/psjava/programmers/challenges/level2/Q17686.java)

```java
import java.util.*;
import java.util.regex.*;

public class Q17686 {

    public String[] solution(String[] files) {
        List<Node> list = new ArrayList<>();
        for (int i = 0; i < files.length; i++) {
            String[] part = files[i].split("(?<=\\D)(?=\\d)");

            String head = part[0];
            String number = "";
            Pattern pattern = Pattern.compile("\\d+");
            Matcher matcher = pattern.matcher(part[1]);
            if (matcher.find()) {
                number = matcher.group();
            }

            Node node = new Node(i, files[i], head, number);
            list.add(node);
        }

        Collections.sort(list);
        return list.stream().map(n -> n.orig).toArray(String[]::new);
    }

    static class Node implements Comparable<Node> {
        int idx;
        String orig;
        String head;
        String number;

        @Override
        public String toString() {
            return "Node{" +
                    "idx=" + idx +
                    ", head='" + head + '\'' +
                    ", number='" + number + '\'' +
                    '}';
        }

        public Node(int idx, String orig, String head, String number) {
            this.idx = idx;
            this.orig = orig;
            this.head = head.toLowerCase();
            this.number = number;
        }

        @Override
        public int compareTo(Node o) {
            int order1 = this.head.compareTo(o.head);
            if (order1 != 0) {
                return order1;
            }

            int i1 = Integer.parseInt(this.number);
            int i2 = Integer.parseInt(o.number);
            int order2 = Integer.compare(i1, i2);
            if (order2 != 0) {
                return order2;
            }

            return Integer.compare(this.idx, o.idx);
        }
    }
}
```
