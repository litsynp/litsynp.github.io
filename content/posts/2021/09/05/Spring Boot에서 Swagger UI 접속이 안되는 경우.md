---
title: "Spring Boot에서 Swagger UI 접속이 안되는 경우"
date: 2021-09-05T01:00:00+09:00
draft: false
categories: ["problem-solved"]
tags: ["Spring", "Spring Boot", "Swagger"]
series: ["Spring 알아보기"]
featuredImage: "https://www.scottbrady91.com/img/logos/swagger-banner.png"
---

## 문제

---

**스프링 부트**에서 **Swagger2**의 `3.0.0` 버전을 의존성에 추가했는데, `/v2/api-docs`는 접근이 되는데 `/swagger-ui`는 접근이 안됨.

## 원인

---

아마도 dependencies를 잘못 설정했을 확률이 높다.

## 해결법

---

Gradle 기준, `build.gradle`에서 다음과 같이 설정되어 있다면,

```
implementation group: 'io.springfox', name: 'springfox-swagger-ui', version: '3.0.0'
implementation group: 'io.springfox', name: 'springfox-swagger2', version: '3.0.0'
```

다음과 같이 바꾼다.

```
implementation "io.springfox:springfox-boot-starter:3.0.0"
```

다시 빌드하고 `/swagger-ui` endpoint로 접속해보면 성공!👍
