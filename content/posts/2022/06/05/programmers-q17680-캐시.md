---
title: "[프로그래머스][Level 2][#17680] 캐시 해설"
date: 2022-06-05T02:50:50+09:00
draft: false
summary: " "
categories: ["problem-solving"]
tags: ["코딩테스트", "프로그래머스", "자료구조 유형"]
series: ["코딩테스트 문제풀이"]
---

## About

- **사이트**: 프로그래머스
- **이름**: \[1차\] 캐시
- **수준**: LEVEL 2
- **유형**: 자료구조
- **출제**: 2018 KAKAO BLIND RECRUITMENT
- **주소**: https://programmers.co.kr/learn/courses/30/lessons/17680

## 해설

LRU 캐시가 무엇인지 친절하게 해설에서 설명을 해줬다. 가장 오래된 데이터를 교체하면 된다.

`LinkedHashSet` 을 생각해서 풀 수도 있겠다. 하지만 자바에서 친절하게 `LinkedHashMap` 에서 `removeEldestEntry`를 오버라이딩할 수 있도록 제공해서, 이를 오버라이딩하는 것으로 쉽게 풀 수 있다.

`LinkedHashMap`을 생성할 때, **매개변수 3개** (코드 참고)를 넣어주는 것이 중요하다.

`LinkedHashMap`은 기본적으로 넣은 순서로 정렬되는 **insertion-ordered**이다. 이걸 접근 순서로 바꾸는 **access-ordered** (즉, **LRU**)로 바꾸려면 3번째 변수인 `accessOrder`에 true를 대입해줘야 한다. 두 번째 매개변수인 `loadFactor`은 `0.75f`가 optimal한 편이니 `0.75f`를 넣어주면 된다. (물론 달리 해도 동작은 한다. 참고 링크를 참고할 것)

그리고 `cache.get()`를 **반드시** 넣어줘야 access 했는지를 `LinkedHashMap` 이 알 수 있다. `containsKey()`는 접근으로 안 쳐주는 것으로 보인다.

캐시 사이즈가 0이면 저장이 안되는 조건을 처음에 놓치긴 했는데, 효율성의 문제지 빼도 작동은 할 것이다.

## 참고

[LinkedHashMap ordering](https://stackoverflow.com/questions/35838739/linkedhashmap-ordering)

[StackOverflow - why is loadFactor in HashMap is set to 0.75 by default? [duplicate]](https://stackoverflow.com/questions/61341274/why-is-loadfactor-in-hashmap-is-set-to-0-75-by-default)

## 코드

[GitHub](https://github.com/litsynp/ps-java/blob/main/app/src/main/java/psjava/programmers/challenges/level2/Q17680.java)

```java
import java.util.*;

public class Q17680 {

    public int solution(int cacheSize, String[] cities) {
        int answer = 0;

        // 캐시 사이즈 0이면 저장이 안됨
        if (cacheSize == 0) {
            return cities.length * 5;
        }

        LRUCache cache = new LRUCache(cacheSize);
        for (String city : cities) {
            answer += cache.execute(city);
        }

        return answer;
    }

    // LRU: Least Recently Used
    class LRUCache {

        Map<String, Integer> cache;
        final int cacheSize;

        public LRUCache(int _cacheSize) {
            cacheSize = _cacheSize;
            // true를 줌으로써 "insertion-ordered"가 아닌 "access-ordered" map으로 바꾼다.
            cache = new LinkedHashMap<>(cacheSize, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(java.util.Map.Entry<String, Integer> eldest) {
                    // capacity보다 크면 가장 오래된 데이터를 자동으로 삭제
                    return size() > cacheSize;
                }
            };
        }

        public int execute(String in) {
            in = in.toLowerCase();

            if (cache.containsKey(in)) {
                // cache hit
                cache.get(in);
                return 1;
            } else {
                cache.put(in, 0);
                return 5;
            }
        }
    }
}
```
