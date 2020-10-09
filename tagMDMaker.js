import {getTagStore} from "./docs/.vuepress/store/tag";
import fs from "fs";

const tags = getTagStore().values();

function getTemplate(tagName) {
    const lines = [
        '---',
        'sidebar: false',
        'sitemap:',
        '   exclude: true',
        '---',
        `<TagMain tagName=\"${tagName}\" />`,
    ]
    return lines.reduce((line, curLine) => line + '\n' + curLine)
}

function getWritePath(tagName) {
    return `./docs/tag/${tagName}.md`;
}

tags.forEach(tag => {
    const tagName = tag.tagName;
    const template = getTemplate(tagName);
    const writePath = getWritePath(tagName);
    fs.writeFile(writePath, template, 'utf8', (err => {
        if (err) {
            console.log(err);
            process.exit();
        }
    }))
    console.log('tag create sucess: ', writePath)
})
