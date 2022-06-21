---
title: "[Spring Boot] External API Call"
date: 2022-02-11T23:30:25-08:00
draft: false
categories: ["Spring"]
tags: ["Spring"]
featuredImage: "https://user-images.githubusercontent.com/42485462/172010873-abdf31d4-a91c-4109-943e-5bc04378b5f0.png"
---

`RestTemplate` is commonly used for external API call in Spring.

But from Spring 5, `WebClient` in WebFlux is preferred over `RestTemplate`.

First, add this dependency to `build.gradle`.

```groovy
// build.gradle
// ...
implementation 'org.springframework.boot:spring-boot-starter-webflux'
// ...
```

Then create a bean to inject into different classes.

```java
package com.litsynp.application.domain.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder getWebClientBuilder() {
        return WebClient.builder();
    }
}
```

Finally, inject WebClientBuilder into the service and build the web client to call the external API.

```java
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class ExterrnalApiService {

    private final WebClient.Builder webClientBuilder;

    public ResponseEntity<?> get() {
        return webClientBuilder.baseUrl("https://randomuser.me").build()
                .get()
                .uri("/api")
                .retrieve()
                .toEntity(Object.class) // Response DTO Type
                .block();
    }

    public ResponseEntity<?> create() {
        return webClientBuilder.baseUrl("https://gorest.co.in").build()
                    .post()
                    .uri("/public/v2/users")
                    .header("Authorization", "Bearer AAA.BBB.CCC")
                    .header("Content-Type", "application/json")
                    .bodyValue(new HashMap<String, Object>() {{
                        put("email", "abdasdfc@tesat.com");
                        put("name", "abc");
                        put("gender", "male");
                        put("status", "active");
                    }})
                    .retrieve()
                    .toEntity(Object.class)
                    .block();
    }
}
```

\* Used https://randomuser.me and https://gorest.co.in for external API testing.

### REF

[https://stackoverflow.com/questions/42365266/call-another-rest-api-from-my-server-in-spring-boot](https://stackoverflow.com/questions/42365266/call-another-rest-api-from-my-server-in-spring-boot)

[https://bravenamme.github.io/2021/01/07/web_client/](https://bravenamme.github.io/2021/01/07/web_client/)
