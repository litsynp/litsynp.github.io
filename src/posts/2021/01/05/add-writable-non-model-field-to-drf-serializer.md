---
title: "[DRF] Serializer에 writable non-model field 추가하기"
date: 2022-01-05T23:31:28-08:00
draft: false
categories: ["tips"]
tags: ["Django REST Framework"]
series: ["Django REST Framework 팁"]
featuredImage: "https://user-images.githubusercontent.com/42485462/148346764-0e23e2c9-6acc-4c17-9b93-b11ca28db148.png"
eleventyExcludeFromCollections: ["posts"]
---

## 문제

_Django_ 및 *DRF*에서 model에 정의하지 않은 필드를 **POST / PUT용 serializer**에 추가하고 싶을 때가 있다. 그냥 `serializers.CharField()`로 추가하면 `unexpected keyword`라고 뜨면서 추가할 수 없는 문제가 발생한다.

## 해결법

Serializer에 추가해둔 필드를 `validate` 메소드에서 **model 생성에 사용되지 않도록** `pop()` 시켜준다.

```python
class UserSerializer(serializers.ModelSerializer):
    non_model_field = serializers.CharField(max_length=300, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'non_model_field')

    def validate(self, attrs):
        # ...
        attrs.pop('non_model_field', None)
        return super().validate(attrs)
```

## REF

[Stack Overflow](https://stackoverflow.com/questions/28322901/drf-modelserializer-with-a-non-model-write-only-field)
