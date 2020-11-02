module.exports = {
    base: "/blog/",
    title: "BLOG",
    head: headConfig(),
    themeConfig: {
        smoothScroll: true,
        logo: "/img/logo.png",
        nav: navConfigs(),
        sidebarDepth: 2,
        sidebar: sidebarConfig(),
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
        {text: 'JAVA', link: '/tag/JAVA.html'},
        {text: 'Vue.js', link: '/tag/Vue.js.html'},
        // {text: 'Spring', link: '/tag/Spring.html'}
    ];
}

function headConfig() {
    return [
        ['link', {rel: 'icon', href: '/img/favicon.svg'}],
        ['meta', {name: 'google-site-verification', content: '5Yx4T6uI30XHP7CaIBllI-z_pTFiIF9H73JCnPtoqu0'}]
    ];
}

function sidebarConfig() {
    return {
        '/vue/vuepress/': [{
            title: 'VuePres로 블로그 제작',
            children: [
                'ch1',
                'ch2',
            ],
        }]
    };
}
