---
title: litsynp.log
layout: "base.njk"
---

## Posts

{% for post in collections.posts reversed %}

- {{ post.data.date | postDate }} [{{ post.data.title }}]({{ post.url }})

{% endfor %}
