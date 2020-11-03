---
sidebar: auto
title: Vuex 모듈 등록 자동화하기
date: 2020-09-05 13:29
img: 
    - vue.png
tags: 
    - Vue.js
---

- Vuex에서 module을 사용하다보면 직접 state, gettets, mutations, actions를 등록해주는게 귀찮을때가 많습니다.
- 모듈 경로에 있는 js 파일들을 읽어 모듈을 자동으로 등록할 수 있도록 하는 방법을 발견하여 공유하고자 합니다.

## 기존의 Vuex 모듈 등록 방법
- 우선 예시에서 사용할 모듈을 정의해보겠습니다.

```js
// module/post.js
export const state = {
    title: 'Post Title'
};

export const getters = {
    getTitle(state) {
        return state.title;
    }
};

export const mutations = {
};

export const actions = {
};

```

```java
// module/user.js
const state = {
    name: 'User Name'
};

const getters = {
    getName(state) {
        return state.name;
    }
};

const mutations = {
};

const actions = {
};

export default {
    state,
    getters,
    mutations,
    actions,
};

```
- 보통 Vuex에서 모듈을 사용하기 위해선 보통 사용할 모듈의 이름.js로 파일을 만들어 Vuex를 위한 4가지 속성을 정의합니다.
- export하는 방식은 첫 번째 코드인 post.js와 같이 각각을 export 해줄 수도 있고 혹은 user.js와 같이 export default를 활용하여 방식 모두 가능합니다.

```java
// index.js
import Vue from 'vue';
import Vuex from 'vuex';
import user from './module/user.js'
import * as post from './module/post.js'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        post,
    }
});

export default store;
```
- export한 모듈들은 Vuex를 등록하는 곳에서 import하여 modules 내부에 넣어주면 모듈을 등록할 수 있습니다.
- 하지만 보통 모듈을 사용하면 namespaced를 활용하기 때문에 아래와 같이 namespaced를 true로 등록해주어야 합니다.

```js
// index.js
import Vue from 'vue';
import Vuex from 'vuex';
import user from './module/user.js'
import * as post from './module/post.js'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user: {
            namespaced: true,
            ...user
        },
        post: {
            namespaced: true,
            ...post
        },
    }
});

export default store;
```
- Vuex를 사용할 때 Vuex 모듈에 정의한 네 가지 속성에 필요한 기능을 구현하는 것이 중요하며 모듈을 등록하는건 단순히 반복적인 작업입니다.
- 모듈 등록을 자동화 해놓으면 귀찮고 반복적인 작업을 하지도 않고 모듈 등록을 까먹을 일도 없을 것입니다.

## 자동으로 Vuex 모듈 등록하기
- 사용할 모듈은 위에서 정의한 user, post를 동일하게 사용합니다.
- 자동으로 Vuex를 등록하는 방법은 webpack에서 제공하는 require.context를 활용할 수 있습니다.
- require.context를 활용하면 지정된 파일경로와 그 파일이 js일 경우 export된 값을 얻을 수 있습니다.

### require.context가 제공해주는 정보
```js
// module/index.js
const requireContext = require.context(
    './', // 탐색할 root 폴더
    true, // 하위 폴더까지 탐색
    /[^(index)]\.js$/ // 탐색할 정규 표현식 (index를 제외한 js 파일들을 탐색합니다)
);

console.log(requireContext.keys()); // ["./post.js", "./user.js"]
```
- requre.context에 폴더 및 정규 표현식을 정의하면 원하는 context들을 가져올 수 있습니다. 
- 가져온 context들의 key 값들은 경로를 포함한 해당 파일의 이름으로 구성되어 있습니다.

```js
const requireContext = require.context(
    './',
    true,
    /[^(index)]\.js$/
);

requireContext.keys().forEach(filePath => {
    console.log(requireContext(filePath));
})
/* ./auth.js 
Module {__esModule: true, …}
    actions: {}
    getters: 
        getTitle: ƒ getTitle(state)
    mutations: {}
    state: 
        title: "Post Title"
*/
/* ./user.js
Module {default: {…}, __esModule: true, Symbol(Symbol.toStringTag): "Module"}
    default:
        actions: {}
        getters:
            getName: ƒ getName(state)
        mutations: {}
        state:
            name: "User Name"
*/
```
- requireContext의 value들을 출력해보면 각 js 파일의 export 값을 가지고 있는 것을 알 수 있습니다.
- user와 같이 default로 export한 경우 내부에 default안에 exprot된 값을 가지고 있습니다.

```js
const getExportValues = (requireContextValue)  => requireContextValue.default || requireContextValue;
```
- 즉 requireContextValue에서 export 값들은 requireContextValue의 default값 혹은 그 값 자체가 됩니다.
- 보통 파일명에 맞춰 Vuex 모듈명을 지정하므로 filePath로 모듈명을 구하고 exportValues를 통해 모듈을 등록할 수 있으므로 이를 활용하여 Vuex에 등록할 모듈을 생성해보겠습니다.

### modules 생성하기
```js
const getExportValues = (requireContextValue)  => requireContextValue.default || requireContextValue;
const getModuleName = (filePath) => filePath
    .replace(/^\.\//, '') // 파일 경로 앞단의 ./ 제거
    .replace(/\.js$/, '') // .js 제거

const requireContext = require.context(
    './', // 탐색할 root 폴더
    true, // 하위 폴더까지 탐색
    /[^(index)]\.js$/ // 탐색할 정규 표현식 (index를 제외한 js 파일들을 탐색합니다)
);

const modules = {};
requireContext.keys().forEach(filePath => {
    const exportValues = getExportValues(requireContext(filePath));
    const moduleName = getModuleName(filePath);

    modules[moduleName] = {
        namespaced: true,
        ...exportValues
    }
})

export default modules;
```
- 지정된 폴더의 js 파일들을 모두 탐색한 후 context를 만들어 filePath와 exportValues를 추출합니다. 
- filePath를 통해 moduleName을 가져오고 moduleName과 exportValues를 활용하여 modules을 생성할 수 있습니다.

### 생성한 modules 등록하기
```js
import Vue from 'vue';
import Vuex from 'vuex';
import modules from "@/store/module";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
});

export default store;
```
- module 폴더 내부의 js파일을 탐색하여 모듈을 자동으로 생성하기 때문에 해당 modules를 등록하기만 하면 됩니다.
- **Vuex에 새로운 모듈을 정의하더라도 직접 모듈을 등록할 필요가 없어졌습니다.**

## 정리
- Vuex의 모듈 등록은 단순히 반복되는 작업으로 자동화를 할 수 있습니다.
- webpack에서 제공하는 require.context를 활용하면 js파일을 탐색하여 export 값들을 가져올 수 있고 이를 통해 모듈을 자동으로 생성할 수 있습니다.

> Vuex 중첩 모듈을 자동으로 등록하는 방법은 [GitHub 코드](https://github.com/pompitzz/blog_code/blob/master/vuex_module_register/src/store/module/index.js)를 참고하시면 확인할 수 있습니다.


## 참고 자료
- [7 Secret Patterns Vue Consultants Don’t Want You to Know - Chris Fritz](https://www.youtube.com/watch?v=7lpemgMhi0k&feature=emb_title)
   
  

