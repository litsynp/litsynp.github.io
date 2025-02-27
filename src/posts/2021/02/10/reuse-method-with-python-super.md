---
title: "[Python] super() 이용해서 기존 메소드 이용하기"
date: 2021-02-10T00:00:00+09:00
draft: false
categories: ["tips"]
tags: ["Django REST Framework", "python"]
series: ["django-rest-framework"]
featuredImage: "https://www.django-rest-framework.org/img/logo.png"
eleventyExcludeFromCollections: ["posts"]
---

## Why use it?

프로젝트에서 **Django REST Framework**를 사용하고 있는데, `serializer`나 `viewset`을 사용할 때, 특히 `ModelViewSet` 을 override할 때 HTTP 메소드에 따른 함수를 수정하고 싶을 때가 있다.

그럴 때 특정 분기에 따라 override하기 전의 클래스 메소드를 사용하고 싶은 때가 있다.

예시는 다음과 같다.

```python
# ViewSet 안의 메소드
def destroy(self, request, *args, **kwargs):
    user_id = int(self.kwargs.get('pk'))

    # 로그인한 사용자와 조회하려는 사용자의 ID가 일치한지 확인
    if self.request.user.id == user_id:
        return super(UserViewSet, self).destroy(request, *args, **kwargs)
    else:
        response = {
            'detail': 'Delete function is not offered without authorization as the owner.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)
```

아무튼 예시에 간략하게 설명을 덧붙이자면, 다음과 같다.

- 제시한 `destroy` 함수는 DRF의 `ModelViewSet` 를 상속한 클래스인 `UserViewSet` 내의 함수이다.
- `destroy` 함수를 override하여 새로운 기능을 제공하고자 한다.
- 로그인한 사용자의 ID와, URL에 있는 parameter (`/users/:pk`)의 `pk` 부분, 즉 조회하려는 사용자의 ID가 일치하는지를 확인한다.
  - 일치하면 `super()` 를 이용하여 기존 `destroy` 함수를 호출해 해당 사용자를 DB에서 삭제한다.
  - 일치하지 않으면 HTTP 상태 코드 403 Forbidden와 함께 response 메세지를 JSON으로 반환한다.

### 참고

- 위와 같이 작성하면 물론 로그인을 했는지부터 확인해야하기 때문에 `permission_classes`를 작성해야 한다.
- 또한, 위의 함수만 작성하면 DRF의 admin site에서는 DELETE 버튼이 비활성화되지 않는다. (물론 클릭하면 권한에 따라 reject 될 것이다)

## REF

[Using super with a class method - (Stack Overflow)](https://stackoverflow.com/questions/1817183/using-super-with-a-class-method)
