module.exports = {
    base: "/blog/",
    title: "BLOG",
    head: headConfig(),
    themeConfig: {
        smoothScroll: true,
        logo: "/img/logo.png",
        nav: navConfigs(),
        sidebarDepth: 2,
        sidebar: require('./sidebarConfig.js'),
    },
    markdown: {
        lineNumbers: true,
    },
    plugins: {
        'sitemap': {
            hostname: 'https://pompitzz.github.io/blog',
            exclude: ['/404.html']
        },
    }
};


function navConfigs() {
    return [
        { text: 'JAVA', link: '/tag/JAVA.html' },
        { text: 'Vue.js', link: '/tag/Vue.js.html' },
    ];
}

function headConfig() {
    return [
        ['link', { rel: 'icon', href: '/img/favicon.svg' }],
        ['meta', { name: 'google-site-verification', content: '5Yx4T6uI30XHP7CaIBllI-z_pTFiIF9H73JCnPtoqu0' }]
    ];
}
