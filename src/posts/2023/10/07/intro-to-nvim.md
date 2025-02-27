---
title: "nvim 입문기"
date: 2023-10-07T23:23:00+09:00
draft: false
description: nvim에 입문하면서 겪은 모험기를 끄적여본다.
tags: ["nvim"]
toc: true
---

## 첫 만남

난 프로그래밍을 시작하기 전부터, 즉, 중학생 때부터, 맥, 안드로이드, 리눅스 등 다양한 운영체제를 설치해보고 탐구해보는 것을 즐겼다.

리눅스를 써보면서 [vi](https://en.wikipedia.org/wiki/Vi), [nano](https://www.nano-editor.org/) 등의 에디터를 접할 일이 많았는데,
운영체제를 셋업하면서 간단하게 정보를 수정해야되는 경우가 있어서 그럴 때마다 어색한 기분을 느꼈다(물론 nano는 그냥 텍스트 에디터다).

방향키와 WASD도 충분한데 왜 hjkl로 움직이며, 마우스를 사용하는게 아무리 생각해도 더 빠른데 이걸 왜 쓰는걸까? 라는 생각이 많았다.

vi, vim은 꽤 흥미롭지만 배우기 어려운 존재로 계속 남아 있었다.

## 두 번째 만남. 학교 과제

여태까지는 vim은 사용하기 싫으면 피해도 됐기 때문에 괜찮았다. 대학교 3학년 전공 과목인 **운영체제**와 **리눅스**를 만나기 전까지는.

특히 운영체제 수업에서는 Linux의 교육용 distro 중 하나를 다운 받아 직접 컴파일 후 가상머신으로 올리는 게 첫 과제였으며, 그 이후 과제는 모두 운영체제를 건드려야 하는 과제였다.

학교 과제를 위해 맥북과 윈도우에서 [Visual Studio](https://visualstudio.microsoft.com/) (및 [Code](https://code.visualstudio.com/))를 사용했던 나에게 vim은 여전히 껄끄러운 존재였다.

군대가 왜 힘든지 아는가? 일반적으로 껄끄러운 사람은 피하면 되지만, 군대에서는 피할 수도 없고, 잠까지 같이 자야하기 때문이다(물론 내 군생활은 꽤 괜찮았다).

Visual Studio Code를 깔아서 해도 됐지만 GUI 환경을 제공받지 못하는 경우도 있었기 때문에 vim은 울며 겨자먹기로 사용했다. 그래서 우리의 두 번째 만남은 그리 유쾌하지 못했다.

## 세 번째 만남. 유튜브 - 1

세 번째 만남은 한가로이 유튜브를 보며 시간을 죽이던 어느 날이었다.

유튜브 알고리즘을 통해 한 영상을 접하게 되었는데, 알고리즘 챔피언십에서 vim으로 코드를 짜는 어떤 남자가 나오는 영상이었다(지금은 못찾겠다).

그 남자는 내가 마우스를 아무리 이리저리 빨리 움직여도 그렇게 빠른 속도로 코드를 짤 순 없을 것이라고 생각될 정도로 굉장한 페이스로 코드를 짜고 있었다.

그 때부터였을까. 나는 종종 vim 명령어, 단축키 등을 공부하며 "미리 대비"하고 있었다.

## 네 번째 만남. 유튜브 - 2

네 번째 만남은 가장 최근인 2023년이다. 회사를 다니게 되면서 주변 분들이 vim을, 또는 vscode에 [vim 플러그인](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)을 깔아서 에디터로 사용하고 계신다고 듣게 되었다.

그리고 최근 즐겨 보고 있는 유튜브의 [ThePrimagen](https://www.youtube.com/ThePrimeagen) 아저씨가 vim을 찬양하길래 더욱 솔깃해졌다.

그래서 아예 vim을 제대로 써보자 하고 이것 저것 탐구에 들어갔다.

## 탐구, 그리고 정착

조사해보며 알게된 사실은 요즘 vim보다는 [neovim(nvim)](https://neovim.io/)을 많이 사용한다는 것이다.

그래서 nvim을 우선 [homebrew](https://brew.sh/)로 깔고, [동료분이 추천해주신 영상](https://www.youtube.com/watch?v=w7i4amO_zaE)을 보며 말 그대로 "from scratch"로 nvim을 셋업해 나갔다.

처음엔 마음에 들었는데, 아무래도 초보자다보니 이렇게 설정하는 것조차 귀찮아졌다. 이렇게까지 셋업해도 결국 vim 자체를 못다루면 의미가 없을텐데 뭐하고 있는걸까 싶기도 하고.

그래서 더 빠르게 셋업할 수 없을까 고민하던 차에 여러 솔루션을 발견했다.

1. 난 하드코어 프로그래머다 -> 스스로 설정
2. 그냥 셋업된 IDE 바로 쓰고 싶다 -> [NvChad](https://github.com/NvChad/NvChad), [LunarVim](https://github.com/LunarVim/LunarVim), [AstroNvim](https://github.com/AstroNvim/AstroNvim)
3. 패키지 관리, 언어 서버(LSP), config 구조 설정 등 귀찮은 기본만 어느 정도로 해줬으면 좋겠고 나머진 내가 할거다 -> [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)

그래서 1번을 하다가 포기하고 3번으로 갈아탔다.

kickstart.nvim은 요약하자면 "reasonable한" default 설정을 제공한다. [lazy.nvim](https://github.com/folke/lazy.nvim) 기반으로 LSP 정도만 제공되는데 LSP 설정하는 게 사실 반필수적이지만 꽤 셋업이 귀찮기 때문에 도움이 된다.

또한, custom 설정을 하는 게 매우 쉬운데, 레포를 fork 뜬 뒤 custom에 lua 설정 파일을 넣으면 자동으로 다음에 nvim을 열 때 플러그인이 설치돼서 매우 편리하다.

말 안한게 있는데, vim은 심볼 분석, fuzzy finder, declaration/definition/usage search, 리팩터링, 코파일럿 같은 기능도 모두 플러그인을 통해 설정할 수 있다.

![Rustaurant 공유](https://github.com/litsynp/litsynp.github.io/assets/42485462/0e2a43c2-d1dc-4ea6-9072-14c272c27354)
(슬랙 러스트 동아리 채널에도 공유해보았다)

## 마치며

내게 vim의 첫 인상은 그렇게 좋지 않았지만 점점 애착을 붙이고 있다.

지금 정착한 플로우는 가벼운 개발은 nvim, 좀 더 serious한 개발은 IntelliJ, vscode 등을 사용하고 있다.

요즘 Rust를 흥미롭게 보면서 공부하고 있는데 nvim으로 코드를 짜면서 vim도 배우고 있어서 꽤 만족스럽다.

내 레포도 공유한다: https://github.com/litsynp/kickstart.nvim

현재는 플러그인을 몇 개 안쓰고 있긴 하다. 앞으로 nvim을 탐구해보면서 더 추가할 듯 하다.

![My nvim Setup](https://github.com/litsynp/litsynp.github.io/assets/42485462/fac48b37-b473-4fce-9a80-3652f4424422)
(현재 셋업. [Warp](https://www.warp.dev/)라는 터미널 클라이언트와 테마를 일치시켜 보았다.)
