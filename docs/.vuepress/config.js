module.exports = {
    base: "/blog/",
    title: "Jayden`s Blog",
    head: [['link', {rel: 'icon', href: '/img/favicon.svg'}]],
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
};


function navConfigs() {
    return [
        {text: 'Java', link: '/tag/Java.html'},
        {text: 'Spring', link: '/tag/Spring.html'},
        {text: 'Tags', link: '/tag/'},
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
    };
}