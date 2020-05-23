export default function html(currentPage, pages) {
    let onlyHtml = new RegExp(`${currentPage}(?=.*html)`);
    return pages
        .filter(page => page.path.match(onlyHtml))
        .map(page => addDefaultImgIfNoneHas(page));
}

function addDefaultImgIfNoneHas(page) {
    if (!page.frontmatter.img) {
        page.frontmatter.img = "default.png";
    }
    return page;
}