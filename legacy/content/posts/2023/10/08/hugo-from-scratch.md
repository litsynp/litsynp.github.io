---
title: "Hugo 블로그 만들기"
date: 2023-10-07T23:23:00+09:00
draft: false
summary: Hugo로 블로그를 만들어보자.
tags: ["hugo", "blog"]
toc: true
---

## About

[Hugo는 Go로 만든 정적 사이트 제너레이터](https://gohugo.io/about/what-is-hugo/)이다.

GitHub Pages로 블로그를 만들기 위해 보통 [Jekyll](https://jekyllrb.com/) 또는 [Hugo](https://gohugo.io/)를 사용하는데, Hugo가 더 빠르고 사용 경험도 좋다고 해서 Hugo로 만들었던 전적이 있다.

물론 직접 만들어도 되지만, 다른 것 개발하기도 바쁘고 블로그 글 작성하기도 바빠서 그냥 잘 만들어진 엔진을 사용했다.

블로그 자체는 2021년에 만들었는데, 2023년부터 블로그를 재정비하면서 또 한번 어려움을 겪고 난 뒤 한 번 정리해보려고 한다.

## Hugo 사용법

설치는 [여기](https://gohugo.io/installation/)를 참고하자.

그 외 자주 쓰는 사용법은 다음과 같다.

```bash
$ hugo new posts/게시글-URL.md
```

로컬에서 테스트하려면 다음과 같이 하면 된다.

```bash
$ hugo server
```

보통 Hugo를 사용할 땐 처음부터 만들기보단 테마를 깔아서 사용하는 경우가 많다. 테마는 [여기](https://themes.gohugo.io/)에서 찾을 수 있다.

테마를 사용할 땐 `themes/` 경로에 작성하게 되며, 커스텀 설정을 주로 `config.toml` 또는 `config.yaml`에 작성하게 된다.

레이아웃 등 커스텀 페이지 설정은 `layouts`을 사용하는데, 사용하는 테마의 `layouts`을 참고하면 된다.

나 같은 경우에는 [risotto](https://github.com/joeroe/risotto) 테마를 사용했는데, risotto theme에는 comment 기능이 없고 글씨 크기가 너무 균일해서 밋밋하기에 [fork를 떠서](https://github.com/litsynp/risotto) 직접 수정했다.

이처럼 직접 수정해야 하는 경우에도 fork를 떠서 수정이 가능하다.


## 댓글 기능 추가

Hugo는 템플릿 기능이 있어서 댓글 기능을 추가하기가 쉽다.

근데 사용하는 theme에 따라 댓글을 넣기 위한 기능이 없는 경우도 있다. 내가 쓰는 테마인 risotto는 댓글 기능이 없어서 직접 만들어야 했다.

댓글 기능은 [Disqus](https://disqus.com/), [utterances](https://utteranc.es/) 등 여러가지가 있는데, 나는 utterances를 사용했다.

이유는 GitHub issues와 연동이 되고 광고가 없기 때문이다.

둘다 theme에서 지원만 된다면 추가는 쉬우니 구글을 참고하자. 보통 .html 파일을 추가하고 `layouts`에서 include하면 된다. 일부 theme에는 단순히 `config` 파일에서 키-밸류만 추가해도 되는 경우도 있다.


## 도메인 등록

도메인 등록은 가장 싼 곳에서 등록하면 된다.

국내 서비스로는 [가비아](https://www.gabia.com/), [호스팅KR](https://www.hosting.kr/) 등이 있다.

블로그 찾아보면 충분히 설명이 많으니 이 부분은 생략한다.


## Google Analytics 등록

이 부분은 그렇게 어렵지 않다. Hugo 자체에서 지원하는데, `config.toml`에 다음과 같이 작성하면 된다.

```toml
googleAnalytics = "UA-XXXXXXXXX-X"
```


## Google Search Console 등록

Google SEO를 위해서는 Google Search Console에 등록하는 것이 좋다.

Google Search Console 등록은 꽤나 까다로운데:

1. 도메인의 소유권을 확인한다. TXT 레코드를 도메인 서비스에서 DNS로 등록하거나, HTML 파일을 `static/` 경로에 넣으면 된다.
2. 인덱싱이 완료될 때까지 기다린다.
3. `sitemap.xml`을 등록한다.


yaml 파일로 작성하는 경우에는 다음과 같다.

```yaml
googleAnalytics: UA-XXXXXXXXX-X
```

Naver 등 다른 검색 엔진에 등록하는 법은 아티클 최하단 **References**를 참고하자.


## 마치며

개발 블로그를 만들 생각이 있다면 Hugo를 100%는 아니더라도 고려해볼만 하다.

혼자 처음부터 만드려면 page navigation부터 시작해서 최적화, analytics, SEO 등 고려할 것들이 많은데, Hugo를 사용하면 이런 것들을 많이 신경쓰지 않아도 어느 정도 해결이 된다.


## Links

- [Hugo](https://gohugo.io/)
- [Hugo Themes](https://themes.gohugo.io/)

## References

- [Hugo에 Google Analytics 적용하기](https://kimmj.github.io/hugo/google-analytics/)
- [Hugo 블로그 검색 엔진에 등록하기](https://ence2.github.io/2020/11/hugo-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EA%B2%80%EC%83%89-%EC%97%94%EC%A7%84%EC%97%90-%EB%93%B1%EB%A1%9D%ED%95%98%EA%B8%B0/)
