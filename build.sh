#!/bin/bash

# docs/.vuepress/utils/tag.js에 tag를 추가하면 그에 맞는 md를 생성해준다.
java -jar jars/tag-md-maker.jar

yarn build