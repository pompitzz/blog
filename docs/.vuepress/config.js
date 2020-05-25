module.exports = {
    base: "/blog/",
    title: "VuePress Blog",
    head: [
        ['link', {rel: 'icon', href: '/img/favicon.svg'}]
    ],
    themeConfig: {
        logo: "/img/logo.png",
        nav: [
            {text: 'Java', link: '/java/'},
            {text: 'Spring', link: ''},
            {text: 'Tags', link: '/tag/'},
        ],
        sidebarDepth: 2,
        sidebar: {
            '/refactoring/': [{
                title: '리팩토링',
                children: [
                    'ch1',
                    'ch2',
                    'ch3',
                    'ch4'
                ]
            }],
        },
        smoothScroll: true
    },
    markdown: {
        lineNumbers: true,
    },
};

// vuepress config 설정 파