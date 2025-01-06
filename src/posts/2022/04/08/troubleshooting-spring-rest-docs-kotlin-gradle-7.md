---
title: "Troubleshooting Spring Boot + Spring REST Docs + Kotlin + Gradle 7"
date: 2022-04-08T16:59:02+09:00
draft: false
categories: ["problem-solved"]
tags: ["Spring"]
series: ["Spring 알아보기"]
featuredImage: "https://blog.jetbrains.com/kotlin/files/2020/02/kotlin_blog_gradle_ide.png"
eleventyExcludeFromCollections: ["posts"]
---

# Spring REST Docs 설정하기

Spring REST Docs를 설정하고 싶은데, Gradle 7, Kotlin, build.gradle.kts를 사용하는 예제를 찾아보기 어려웠다.

Kotlin을 사용하는 Spring Boot에서, 다음 환경으로 진행한다.

- **Gradle 7**
- Gradle Kotlin DSL을 사용하는 `build.gradle.kts` 사용

## 첫 번째 이슈 - index.adoc 생성

어찌저찌 테스트 코드를 작성하고 빌드하면 테스트 코드에 따라 `build/generated-snippets` 경로 안에 \*.adoc 파일들이 생성된다.

하지만 `index.html` 파일이 생성되지 않았다.

예제를 대충 읽었기 때문에 놓친 부분이 있었는데, `index.adoc` 파일을 작성해야 했다.

[Spring Boot | REST Docs 적용하기 ( + build failed 해결.. )](https://gaemi606.tistory.com/entry/Spring-Boot-REST-Docs-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0) 글을 읽어보고 `src/docs/asciidoc/` 경로에 `index.adoc` 파일을 만들어본다.

## 두 번째 이슈 - Gradle 7과 asciidoc의 문제

*Spring Initializr*을 이용하여 스프링 부트 프로젝트를 만든 상태였고, 자동으로 `org.asciidoctor.convert` 플러그인이 설정된 상황이었다.

그런데 `./gradlew asciidoctor`을 실행했을 때 나오는 오류가 다음과 같았다.

```
In plugin 'org.asciidoctor.convert' type 'org.asciidoctor.gradle.AsciidoctorTask' method 'asGemPath()' should not be annotated with: @Optional, @InputDirectory.
```

구글링을 통해 찾아보니, Gradle 7과는 해당 플러그인이 현재 호환이 되지 않는 것으로 판단되었다.

선택 가능한 방법은 다음과 같다.

1. Gradle의 버전을 6 이하의 버전으로 낮춘다.

2. 오류를 잘 수정해본다.

Gradle 7을 현재 사용 중이기 때문에 1번과 같이 그냥 버전을 낮추는 건 찜찜했다. 따라서 오류를 잘 수정해보기로 했다.

찾아봐도 어떻게 고쳐야되는지 예제가 잘 안나오지만, 결국 GitHub에서 되는 예제를 찾았다!

다음과 같이 진행하면 된다.

```kotlin
plugins {
    // ...
    id("org.asciidoctor.jvm.convert") version "3.3.2"
}

val asciidoctorExtensions: Configuration by configurations.creating

dependencies {
    // ...
    asciidoctorExtensions("org.springframework.restdocs:spring-restdocs-asciidoctor")
}

// ...

tasks.clean {
    delete("src/main/resources/static/docs")
}

tasks.test {
    systemProperty("org.springframework.restdocs.outputDir", snippetsDir)
    outputs.dir(snippetsDir)
}


tasks.build {
    dependsOn("copyDocument")
}

tasks.asciidoctor {
    dependsOn(tasks.test)

    attributes(
        mapOf("snippets" to snippetsDir)
    )
    inputs.dir(snippetsDir)

    doFirst {
        delete("src/main/resources/static/docs")
    }
}

tasks.register("copyDocument", Copy::class) {
    dependsOn(tasks.asciidoctor)
    from(tasks.asciidoctor.get().outputDir)
    into(file("src/main/resources/static/docs"))
}

tasks.bootJar {
    dependsOn(tasks.asciidoctor)

    from(tasks.asciidoctor.get().outputDir) {
        into("BOOT-INF/classes/static/docs")
    }
}
```

## REF

### Spring REST Docs in General

[Spring REST Docs + Kotlin 예제](https://github.com/sangwoobae/kotlin-spring-rest-docs)

[‘Gradle Kotlin DSL’ 이야기](https://techblog.woowahan.com/2625/)

### Troubleshooting

첫 번째 이슈

- https://blog.naver.com/PostView.naver?blogId=qjawnswkd&logNo=222409742108&parentCategoryNo=&categoryNo=41&viewDate=&isShowPopularPosts=false&from=postView

- [Spring Boot | REST Docs 적용하기 ( + build failed 해결.. )](https://gaemi606.tistory.com/entry/Spring-Boot-REST-Docs-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

두 번째 이슈

- [[Spring] Spring rest docs 적용기(gradle 7.0.2)](https://velog.io/@max9106/Spring-Spring-rest-docs%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%AC%B8%EC%84%9C%ED%99%94)

- 결론으로, 다음 GitHub에 올라온 이슈에서의 `build.gradle.kts`를 따라하여 해결

  - [Configure a Gradle 7 compatible version of Asciidoctor's Gradle plugin in projects using REST Docs #676](https://github.com/spring-io/start.spring.io/issues/676)
