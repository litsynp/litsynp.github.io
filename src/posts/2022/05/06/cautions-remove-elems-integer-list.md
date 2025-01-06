---
title: "Java - List<Integer>에서 remove()를 이용한 원소 삭제 간 주의점"
date: 2022-05-06T23:36:45+09:00
draft: false
categories: ["problem-solved"]
tags: ["ps"]
series: ["코딩테스트", "Java"]
featuredImage: "https://wallpapercave.com/wp/wp7250034.jpg"
eleventyExcludeFromCollections: ["posts"]
---

# Java - `List<Integer>`에서 `remove()`를 이용한 원소 삭제 간 주의점

## Problem

다음 두 코드는 큰 차이가 있다.

```java
import java.util.*;

// ... 중략
List<Integer> list = new ArrayList<Integer>();
list.add(1);
list.add(2);
list.add(3);

list.remove(2);
System.out.println(list); // [1, 2]
```

```java
import java.util.*;

List<Integer> list = new ArrayList<Integer>();
list.add(1);
list.add(2);
list.add(3);

list.remove(Integer.valueOf(2));  // 또는 (Integer) 2
System.out.println(list); // [1, 3]
```

`java.util.List` 에서 `remove`의 signature는 두 가지이다.

1. `boolean remove(Object o);` -- 원소가 있다면 삭제 (`true`), 없다면 `false` (**오류 발생 X**)

2. `E remove(int index);` -- `index`번째 원소를 삭제 (`index` 번째 원소가 없다면 `java.lang.IndexOutOfBoundsException` 발생)

당연한 거지만 `List<Integer>`를 만들었더라도, `remove`에서 int로 의도한 게 아니라면 `remove` 메소드 실행 간에 wrapping을 해줘야한다.

또한 후자는 `index` 번째 원소가 없다면 Exception까지 발생하니 유의가 필요하다!

## Solution

상황과 용도에 맞게 인자를 넘겨주는 것이 바람직하다.

## REF

[Stack Overflow](https://stackoverflow.com/questions/21795376/java-how-to-remove-an-integer-item-in-an-arraylist)
