export default function getHtmlPagesByPath(currentPage, pages) {
    let onlyHtml = new RegExp(`${currentPage}(?=.*html)`);
    let htmlPages = pages.filter(page => page.path.match(onlyHtml))
        .map(page => addDefaultImgIfNoneHas(page));
    htmlPages.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    return htmlPages;
}

function addDefaultImgIfNoneHas(page) {
    if (!page.frontmatter.img) {
        page.frontmatter.img = "default.png";
    }
    return page;
}