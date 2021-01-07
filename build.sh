#!/bin/bash

# docs/.vuepress/utils/tag.js에 tag를 추가하면 그에 맞는 md를 생성해준다.
babel-node tagMDMaker.js

# sidebarConfig 생성
babel-node sidebarConfigMaker.js

# build
vuepress build docs
