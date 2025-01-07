---
title: "Redis Keys and Values"
date: 2022-06-18T15:46:22+09:00
draft: false
description: Some notes about Redis keys and values from Redis docs.
categories: ["today-i-read"]
tags: ["Redis"]
series: ["tir"]
featuredImage: "https://dwglogo.com/wp-content/uploads/2017/12/1100px_Redis_Logo_01.png"
eleventyExcludeFromCollections: ["posts"]
---

## Keys

[Data types tutorial](https://redis.io/docs/manual/data-types/data-types-tutorial/)

Redis keys are binary-safe. It means you can use any binary sequence as a key, from a string ‘foo’ to the content of a JPEG file. The empty string “” is also a valid key.

- **Very long keys** are not a good idea. They take more memory, and more time in the lookup with costly key-comparison.
- **Very short keys** are often not a good idea. They harm readability and added space is often minor.
- Try to stick with a **schema**. For instance, “object-type:id” (”user:1000”). Dots (.) or dashes (-) are often used for multi-word fields, as in “comment:431:reply.to” or “comment:4321:reply-to”.
- The **maximum** allowed key size is 512 MB.

## Data Types

[Redis data types](https://redis.io/docs/manual/data-types/)

- **Strings**: most basic and simplest data type
  - can be used for atomic counters
- **Lists**: ordered list of strings
  - `LPUSH`, `RPUSH`
- **Sets**: unrepeated, unordered collection of Strings
- **Hashes**: maps between String fields and String values
- **Sorted Sets**: not repeating collection of Strings, each member associated with a `score`, used to keep the Sorted Set in order from smallest to greatest score.
- **Bitmaps** and **HyperLogLogs**: data types based on String base type, with their own semantics
- **Streams**: data structure that acts like an append-only log. useful for recording events in the order they occur.
- **Geospatial Indexes**: useful for finding locations within a given geographic radius.
