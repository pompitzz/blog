---
title: VuePress로 블로그 만들기 2) 자동 배포 구하기
date: 2020-05-30 21:07
img: vue.png
tags: 
    - Vue.js
    - VuePress
---
- Vuepress로 제작한 블로그를 배포할 때 가장 간편하게 할 수 있는 방법은 깃헙을 이용하는 것입니다.
- 추가적으로 Travis CI를 이용하면 원격 저장소에 Push 하기만 하면 자동으로 블로그를 배포시킬 수 있습니다.

## 배포 설정하기
- 깃허브에서 저장소를 하나 생성한 후 저장소를 등록합니다.

### Travis CI 연동하기
- [Travis CI](https://travis-ci.org/) 공식 홈페이지에서 github 아이디로 로그인을 진행합니다.

<img src="./travisRepo.png"/>

- 그 후 메인페이지에서 우측 상단에 위치하는 Setting을 클릭하면 사진과 같이 자신의 저장소 목록이 나타나며 빨간 박스로 표시된 버튼을 클릭하면 연동이 완료됩니다.
- 연동 후 메인 페이지로 다시 돌아가면 왼쪽 리스트에 연동된 저장소목록이 나타납니다.

### Gitgub Token 생성하기
- Travis CI에서 블로그를 배포하기 위해선 Travis CI에게 자신의 리포지토리에 배포할 권한을 부여해야 합니다.
- 이를 위해 [Github Token 생성 페이지](https://github.com/settings/tokens/new)에 접속하여 토큰을 생성합니다.

<img src="./githubToken.png"/>

- 위와 같이 같이 체크를 한 후 생성하기 버튼을 누르면 중앙에 초록색으로 토큰이 나타나는데 이를 복사합니다.

### Travis CI에 토큰 등록하기
- [Travis CI](https://travis-ci.org/)에 다시 접속하여 왼쪽 리스트에서 이전에 연동한 저장소를 클릭한 후 우측 상단의 More options 버튼을 클릭하여 Setting에 들어갑니다.

<img src="./tokenRegister.png"/>

- Setting 화면에서 복사한 토큰 값을 위와 같이 넣어준 후 ADD 버튼을 클릭해 등해 줍니다.(빨간색으로 표시된 박스에 토큰을 넣으면 됩니다.)
- 이제 Travis CI 스크립트를 작성한 후 깃허브에 올리기만 하면 자동 배포가 완료됩니다.
  

### Travis CI 스크립트 작성
```shell script
# ./travis.yml
language: node_js
node_js:
  - lts/*

install:
  - yarn install

script:
  - yarn build

deploy:
  provider: pages
  skip_cleanup: true
  local_dir: docs/.vuepress/dist
  github_token: $GITHUB_TOKEN # Travis CI에 등록한 토큰을 가져와 사용한다.
  keep_history: true
  on:
    branch: master # master 브랜치에서만 동작하도록 설정
```
- 프로젝트 가장 최상위 폴더에 .travis.yml을 생성한 후 위의 코드를 작성해줍니다.
- 사용할 언어를 선택하고 yarn을 설치하고 Vuepress 프로젝트를 빌드한 후 배포하는 간단한 travis 스크립트입니다.

### Base Url 수정
```js
module.exports = {
    base: '/blog_code/', // github repository 이름으로 변경!
    title: 'VuePress 블로그',
    head: [['link', {rel: 'icon', href: 'img.png'}]],
    themeConfig: {
        logo: '/vue.png',
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Sample', link: '/sample.html'},
        ]
    },
};
```
- 지난 게시글에서 .vuepress/config.js에 설정한 한  base url을 **깃허브 저장소 이름**으로 변경합니다.

### 배포
- 변경사항을 추가한 후 깃허브 원격 저장소에 푸시합니다.
- 푸시 후 Travis CI에 접속해보면 노란색 불빛이 나타나며 Job을 수행하는것을 알 수 있습니다.
- 배포가 완료되면 Travis CI에 등록된 저장소가 초록불로 변경됩니다.
- 그 후 **https://\[github account].github.io/\[github repository]/** 에 접속해보면 정상적으로 깃허브에 배포된 것을 확인할 수 있습니다.
- 이제 블로그를 제작한 후 깃허브 페이지에 따로 배포할 필요 없이 원격저장소에 푸시한 하면 자동으로 배포가 이루어 집니다.

