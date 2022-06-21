---
title: "[TIR] About web.xml"
date: 2022-01-21T23:50:40-08:00
draft: false
categories: ["today-i-read"]
tags: ["Spring"]
featuredImage: "https://user-images.githubusercontent.com/42485462/150630882-6a9a3648-b603-48c7-befc-4be6f66a84e7.png"
---

# Today I Read

## Reference

https://tlatmsrud.tistory.com/35

## What I Learned

### web.xml이란

- 웹 애플리케이션의 설정파일이다.
- _DD_ (_Deployment Description_, 배포 설명자) 라고 불린다.
  - *DD*는 웹 애플리케이션 실행 시 메모리에 로드된다.
- `web.xml`이란, 웹 애플리케이션을 실행시킬 때 함께 올라가야 할 설정들을 정의해놓은 파일이다.

### 설정이란

- `web.xml`은 크게 세 개의 설정을 한다.
  1. `DispatcherServlet`: **클라이언트의 요청을 전달 받아 처리**
  2. `ContextLoaderListener`: **웹 애플리케이션 컨텍스트 단위 설정을 로드**
  3. `Filter`: **클라이언트에서 온 요청을 `DispatcherServlet`이 받기 전 거치는 과정 처리**

### DispatcherServlet

- `DispatcherServlet`은 **클라이언트의 요청을 전달받아 요청을 처리하는 객체**이다.
- 요청을 **직접 처리하지 않고 적절한 객체에게 역할을 위임**하여 클라이언트의 요청을 처리한다.
- 요청을 처리하기 위해서 크게 **4가지** 일이 진행되어야 한다.

  1. 클라이언트의 요청을 처리해줄 컨트롤러를 찾는다.
     - `HandlerMapping`이라는 **객체가 요청을 처리할 컨트롤러를 검색하는 역할**을 하는데, 클라이언트의 요청 경로를 이용해 컨트롤러를 검색 후, 검색된 객체를 `DispatcherServlet`에게 전달한다.
  2. 컨트롤러를 실행시킨다. 즉, 비즈니스 로직을 처리한다.
     - `HandlerAdapter`라는 객체가 **컨트롤러를 실행시키는 역할**을 하는데, `@Controller` 어노테이션을 이용하여 구현한 컨트롤러 뿐만 아니라, Controller 인터페이스를 구현한 컨트롤러, 특수 목적으로 사용되는 `HttpRequestHandler` 인터페이스를 구현한 클래스를 동일한 방식으로 실행할 수 있도록 한다.
     - 실행된 Controller는 리턴할 데이터와 View를 `HandlerAdapter`에게 리턴한다. *Handler Adapter*는 데이터와 view를 `ModelAndView` 형태로 `DispatcherServlet`에게 리턴한다.
  3. 클라이언트에게 보여질 View를 찾는다.
     - `ViewResolver` 객체가 **클라이언트에게 보여질 view를 찾는 역할**을 한다.
  4. 응답 데이터와 View를 클라이언트에게 전달한다.
     - 최종적으로 `ViewResolver` 객체가 리턴한 View 객체에 응답 데이터를 넣어 클라이언트에게 리턴한다.

### ContextLoaderListener

- 웹 애플리케이션의 규모가 커진다면, 클라이언트의 요청 또한 다양해질 것이고, 이를 처리할, 즉 클라이언트의 요청을 처리하는 역할을 가진 `DispatcherServlet`도 늘어날 수 있다. 다른 성격을 가진 서블릿을 만들어야 할 수 있으니, 서블릿의 성격에 맞게 설정도 각각 적용시켜야 한다.
- 그러나 모든 서블릿이 **공통으로 가져야 할 설정**도 존재한다. 즉 Servlet Context 단위가 아닌, (Web) Application Context 단위의 설정이 필요한데, 이를 `ContextLoaderListener` 객체가 처리한다.

### Filter

- `Filter`란, 클라이언트에서 온 요청을 `DispatcherServlet`이 받기 전 거치는 부분이다.
- e.g.) *Spring Security Filter*가 적용되어 있다면, 인가 및 인증 처리를 먼저 처리한 후 `DispatcherServlet`에게 요청을 전달할 것이다.
- e.g.) *Encoding Filter*가 적용되어 있다면 클라이언트의 요청 데이터를 인코딩하는 작업이 선 처리된 후 `DispatcherServlet`에게 필터링 된 데이터가 전달된다.
