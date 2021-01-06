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
        { text: 'JAVA', link: '/tag/JAVA.html' },
        { text: 'Vue.js', link: '/tag/Vue.js.html' },
        // {text: 'Spring', link: '/tag/Spring.html'}
    ];
}

function headConfig() {
    return [
        ['link', { rel: 'icon', href: '/img/favicon.svg' }],
        ['meta', { name: 'google-site-verification', content: '5Yx4T6uI30XHP7CaIBllI-z_pTFiIF9H73JCnPtoqu0' }]
    ];
}

function sidebarConfig() {
    return {
        '/': [

            {
                title: 'java',
                children: [
                    '/java/awsEc2InstallJDK11.md', '/java/javaOverloadingParameter.md', '/java/threadPoolExecutor.md', '/java/whyCantCreateGenericsArray.md',
                ]
            },


            {
                title: 'spock',
                children: [
                    '/spock/spock-summary.md',
                ]
            },


            {
                title: 'spring',
                children: [
                    '/spring/DI_IOC.md', '/spring/SpringBoot_Custom_Config_Properties.md',
                    {
                        title: 'scheduler',
                        children: [
                            '/spring/scheduler/Scheduler.md',
                        ]
                    },

                ]
            },


            {
                title: 'vue',
                children: [

                    {
                        title: 'vuepress',
                        children: [
                            '/vue/vuepress/ch1.md', '/vue/vuepress/ch2.md',
                        ]
                    },
                    '/vue/vuexModuleAutoRegister.md',
                ]
            },

        ]
    }
}
