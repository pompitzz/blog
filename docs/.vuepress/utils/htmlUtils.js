import {getTagStore} from "./tag";

// Tag, Home Main 페이지등을 제외하고 실제 포스트 페이지만 가져온다.
export default function getPostsByPath(path, pages) {
    let onlyHtml = new RegExp(`${path}(?=.*html)`);
    let htmlPosts = pages
        .filter(page => page.path.match(onlyHtml))
        .filter(page => filterList(page.path))
        .map(page => addDefaultImgIfNoneHas(page));
    htmlPosts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    return htmlPosts;
}

function addDefaultImgIfNoneHas(page) {
    if (!page.frontmatter.img) {
        page.frontmatter.img = "default.png";
    }
    return page;
}

function filterList(path) {
    const split = String(path).split('/');
    let targetHtml = split[split.length - 1];
    return getTagStore().notContainsHtml(targetHtml);
}