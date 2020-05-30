---
title: VuePress로 블로그 만들기 1) 시작하기
date: 2020-05-28 01:00
img: default.png
tags: 
    - Vue.js
    - VuePress
---
- VuePress를 이용하면 마크다운 파일들을 정적 html로 만들어 깃헙에 배포할 수 있습니다.
- VuePress는 일반적인 Vue와 다르게 build 시 마크다운 파일들을 모두 html로 변환하여 빌드하기 때문에 검색엔진에 최적화 되어 있습니다.
- VuePress에서 기본으로 제공해주는 테마와 필요한 부분들을 커스텀하여 나만의 블로그를 빠르고 쉽게 만들 수 있습니다.


## VuePress 설치 후 실행하기
```shell script
mkdir vuepress
cd vuepress

yarn init

yarn add -D vuepress
```
- 원하는 폴더를 만든 후 해당 폴더에 vuePress를 추가해줍니다.

```shell script
mkdir blog

drwxr-xr-x    2 XXX  staff    64B  5 28 01:08 blog
drwxr-xr-x  805 XXX  staff    25K  5 28 01:06 node_modules
-rw-r--r--    1 XXX  staff   142B  5 28 01:06 package.json
-rw-r--r--    1 XXX  staff   332K  5 28 01:06 yarn.lock
```
- 마크다운 파일들을 담을 blog 폴더를 추가해줍니다.
- 폴더 구조는 위와 같이 구성됩니다.

```shell script
cd blog
echo "# Vuepress로 블로그 만들기" >> README.md
```
- blog 폴더에서 README.md를 만든 후 텍스트를 넣어줍니다.

```js
// package.json
{
  "name": "vuepress",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  // scripts 추가
  "scripts": {
    "dev": "vuepress dev blog",
    "build": "vuepress build blog"
  },
  "devDependencies": {
    "vuepress": "^1.5.0"
  }
}
```
- package.json에 scripts를 추가해줍니다.

```shell script
yarn dev
```
- 테스트 서버를 띄운 뒤 확인해보면 마크다운으로 작성했던 텍스트들이 자동으로 변환되어 나타나는 것을 알 수 있습니다.


```shell script
echo "# Sample Page입니다." >> sample.md

yarn build
```
- 추가로 smaple.md를 만들고 이번엔 빌드를 해보겠습니다.


```shell script
# .vuepress/dist/
-rw-r--r--  1 XXX  staff   1.2K  5 28 01:22 404.html
drwxr-xr-x  5 XXX  staff   160B  5 28 01:22 assets
-rw-r--r--  1 XXX  staff   2.3K  5 28 01:22 index.html
-rw-r--r--  1 XXX  staff   2.2K  5 28 01:22 sample.html
```
- 빌드를하면 blog폴더에 .vuepress/dist가 생성되고 해당 위치에 빌드 파일들이 나타나며 빌드 된 파일을 위와 같습니다.
- 여여서 서  index.html을 보시면 처음 만들었던 README.md가 랜더링되어 있으며 smaple.md는 sample.html로 랜더링되어 있습니다.
- **즉 README.md의 경우 index.html이 되며 그렇지 않을경우 해당 파일명과 동일한 html을 생성해주게 됩니다.**

<br>

<img src="./samplepage.png" width="400" heigth="200"/>

- yarn dev로 테스트 서버를 띄운 후 localhost:8080/sample.html로 접속하면 위와 같이 sample 페이지가 나타나는 것을 알 수 있습니다.


## 기본 테마 꾸미기
```js
// .vuepress/config.js
module.exports = {
    base: '/vuepress/', // base url을 설정합니다.
    title: 'VuePress 블로그',
    head: [['link', {rel: 'icon', href: 'img.png'}]], // html head에 넣을 값들을 설정할 수 있습니다.
    themeConfig: { // VuePress 기본 테마에 필요한 설정을을 추가합니다.
        logo: '/vue.png', // title옆에 나타날 로고 이미지
        nav: [ 
            {text: 'Home', link: '/'},
            {text: 'Sample', link: '/sample.html'},
        ]
    },
};
```
- 빌드된 폴더가 생성되는 .vuepress폴더에 config.js를 만든 후 위와 같이 작성해줍니다.
- title, head뿐만아니라 logo, nav설정들을 간단하게 추가할 수 있습니다.
- logo의 사진같은경우 .vuepress/public 폴더를 생성 후 해당 path에 저장하면 됩니다.

<br>
<br>

<img src="./settingConfig.png" width="800" height="200"/>

- config 적용 후 base url을 설정하였으므로 localhost:8080/vuepress/에 접속하면 변경된 화면을 확인할 수 있습니다.
- [VuePress Docs](https://vuepress.vuejs.org/theme/default-theme-config.html)를 참고하시면 더 많은 설정들을 확인할 수 있습니다.

<br>

> 다음 게시글에서는 만들 VuePress 프로젝트를 깃헙에 배포하는 작업을 진행하겠습니다. 
> 몇가지 설정을 미리 해놓으면 github으로 푸시만 하여도 자동으로 배포가 가능해집니다. 

### 참고자료
- [VuePress Docs](https://vuepress.vuejs.org/)