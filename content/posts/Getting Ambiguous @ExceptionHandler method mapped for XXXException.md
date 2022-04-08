---
title: "Getting Ambiguous @ExceptionHandler method mapped for XXXException"
date: 2021-09-05T00:00:00+09:00
draft: false
categories: ["problem-solved"]
tags: ["Spring"]
series: ["Spring 알아보기"]
cover:
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/800px-Spring_Framework_Logo_2018.svg.png"
  alt: "Spring logo"
  relative: false
---

## 문제

---

**스프링**에서 `@ControllerAdvice`를 이용해 **전역 exception handler**를 직접 만들 때, `@ExceptionHandler(XXXException.class)`를 어노테이션으로 메소드에 달았을 때,

```
Getting Ambiguous @ExceptionHandler method mapped for XXXException
```

라는 오류가 뜨는 경우가 있다.

## 원인

---

**스프링**의 `@ExceptionHandler`에 이미 `MethodArgumentNotValidException`이 이미 구현이 되어있기 때문에 **동일한 두 개의 핸들러가 존재**하게 되기 때문에 발생한다.

## 해결법

---

`@ExceptionHandler` 어노테이션을 사용하는 대신, `@Override` 어노테이션을 이용해 해당 핸들러를 직접 오버라이드한다. (REF 참고)

## REF

---

[Stack Overflow](https://stackoverflow.com/questions/51991992/getting-ambiguous-exceptionhandler-method-mapped-for-methodargumentnotvalidexce)
