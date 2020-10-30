module.exports = ({
    dest: '../../quarkdoc',
    title: 'Quark',
    description: '一款由 Ant Design Pro & Laravel 驱动的开发框架',
    head: [
        ['link', { rel: 'icon', href: `/logo.png` }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
        ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
        ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    themeConfig: {
        repo: 'quarkcms/quark-doc',
        repoLabel: 'GitHub',
        editLinks: true,
        docsDir: 'docs',
        smoothScroll: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        logo: '/logo.png',
        nav: [
            {
                text: 'CMS文档',
                link: '/quark-cms/'
            },
            {
                text: 'Admin文档',
                link: '/quark-admin/'
            },
            {
                text: 'UI文档',
                link: '/quark-ui/'
            },
        ],
        sidebar: {
            '/quark-cms/' : [
                {
                    title: 'CMS文档',
                    collapsable: false,
                    children: [
                        '',
                        'installation',
                        'tags',
                        'views',
                        'tools',
                        'qa',
                        'helper',
                    ]
                },
            ],
            '/quark-admin/' : [
                {
                    title: 'Admin文档',
                    collapsable: false,
                    children: [
                        '',
                        'installation',
                        'model-table',
                        'model-form',
                        'model-show'
                    ]
                },
            ],
            '/quark-ui/' : [
                {
                    title: 'UI文档',
                    collapsable: false,
                    children: [
                        '',
                        'getting-started'
                    ]
                },
            ]
        }
    },
    plugins: [
        ['@vuepress/back-to-top', true],
        ['@vuepress/last-updated', true],
        ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: true
        }],
        ['@vuepress/medium-zoom', true],
        ['container', {
            type: 'vue',
            before: '<pre class="vue-container"><code>',
            after: '</code></pre>'
        }],
        ['container', {
            type: 'upgrade',
            before: info => `<UpgradePath title="${info}">`,
            after: '</UpgradePath>'
        }]
    ]
})