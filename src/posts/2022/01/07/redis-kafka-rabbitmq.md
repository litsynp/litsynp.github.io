---
title: "[TIR] Redis vs Kafka vs RabbitMQ"
date: 2022-01-07T23:38:42-08:00
draft: false
categories: ["today-i-read"]
tags: ["Message Queue", "Kafka", "RabbitMQ", "Redis"]
series: ["Today I Read"]
featuredImage: "https://tsh.io/wp-content/uploads/2021/04/message-broker-example-4_.png"
eleventyExcludeFromCollections: ["posts"]
---

# Today I Read

## Link

https://blog.devgenius.io/redis-vs-kafka-vs-rabbitmq-e935ebbc7ec

## What I Learned

- Means of communictaion between microservices: sync. and async.
  - **REST** for sync.
  - **MQ** for async.
- Considerations for choosing the right MQ:
  - **Broker scale**: # messages / sec.
  - **Data persistency**: the ability to recover messages
  - **Consumer capability**: Capability for 1:1 or 1:N
- Different message brokers and their purposes
  - RabbitMQ (AMQP) for **complex routing**
  - Kafka for **large amounts of data**
  - Redis for **short-lived messages**
