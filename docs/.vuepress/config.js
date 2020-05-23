module.exports = {
    base: "/blog/",
    title: "VuePress Blog",
    themeConfig: {
        logo: "/img/logo.png",
        nav: [
            {text: 'Java', link: '/java/'},
            {text: 'Spring', link: ''},
            {
                text: 'Tags',
                items: [
                    {text: 'Database', link: '/items'},
                    {text: 'JAVA', link: '/items'}
                ]

            },
        ]
    },
    markdown: {
        lineNumbers: true,
    }
};

// vuepress config 설정 파