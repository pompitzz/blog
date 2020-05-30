module.exports = {
    base: "/blog/",
    title: "Blog",
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
        {text: 'Java', link: '/tag/Java.html'},
        {text: 'Spring', link: '/tag/Spring.html'},
        {text: 'Tags', link: '/tag/'},
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
        '/refactoring/': [{
            title: '리팩토링',
            children: [
                'ch1',
                'ch2',
                'ch3',
                'ch4'
            ]
        }],
        '/vue/vuepress/': [{
            title: 'VuePress',
            children: [
                'ch1',
                'ch2',
            ],
        }]
    };
}