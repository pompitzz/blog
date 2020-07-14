// Tag, Home Main 페이지등을 제외하고 실제 포스트 페이지만 가져온다.
export default function getPostsByPath(path, pages) {
    let onlyHtml = new RegExp(`${path}(?=.*html)`);
    let htmlPosts = pages
        .filter(page => page.path.match(onlyHtml))
        .filter(page => !!page.title)
        .map(page => setDefaultImgIfNoneHas(page));
    htmlPosts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    return htmlPosts;
}

function setDefaultImgIfNoneHas(page) {
    if (!page.frontmatter.img) {
        page.frontmatter.img = "vue.png";
    }
    return page;
}