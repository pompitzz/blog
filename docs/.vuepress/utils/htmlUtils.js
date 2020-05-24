export default function html(currentPage, pages) {
    let onlyHtml = new RegExp(`${currentPage}(?=.*html)`);
    return pages
        .filter(page => page.path.match(onlyHtml));
}

