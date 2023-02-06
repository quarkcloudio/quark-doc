const moment = require('moment');
const { defaultTheme } = require('@vuepress/theme-default')

module.exports = ({
    dest: '../../quarkdoc',
    title: 'QuarkCMS',
    description: '基于低代码架构 可快速开发多端应用的解决方案',
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

    theme: defaultTheme({
        repo: 'quarkcms/quark-doc',
        repoLabel: 'GitHub',
        editLinks: true,
        docsDir: 'docs',
        smoothScroll: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        logo: '/logo.png',
        navbar: [
            {
                text: 'QuarkGo文档',
                link: '/quark-go/'
            },
            {
                text: 'QuarkAdmin文档',
                link: '/quark-admin/'
            },
            {
                text: 'QuarkUI文档',
                link: '/quark-ui/'
            },
            {
                text: 'v2',
                children: [
                    { text: 'v2', link: 'https://www.quarkcms.com/' },
                    { text: 'v1', link: 'https://v1.quarkcms.com/' }
                ]
              }
        ],
        sidebar: {
            '/quark-go/' : [
                {
                    title: 'QuarkGo文档',
                    collapsable: false,
                    sidebarDepth:2,
                    children: [
                        'installation',
                        'resources',
                        'search',
                        'actions',
                        'metrics',
                        'dashboards',
                        'builtin'
                    ]
                },
            ],
            '/quark-admin/' : [
                {
                    title: 'Admin文档',
                    collapsable: false,
                    sidebarDepth:2,
                    children: [
                        'installation',
                        'resources',
                        'search',
                        'actions',
                        'metrics',
                        'dashboards',
                        'builtin',
                        'helper'
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
    }),

    themePlugins: {
        // only enable git plugin in production mode
        git: true,
    },
    plugins: [
        ['@vuepress/back-to-top', true],
        ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: true
        }],
        ['@vuepress/medium-zoom', true],
        ['@vuepress/container', {
            type: 'vue',
            before: '<pre class="vue-container"><code>',
            after: '</code></pre>'
        }],
        ['@vuepress/container', {
            type: 'upgrade',
            before: info => `<UpgradePath title="${info}">`,
            after: '</UpgradePath>'
        }],
        ['@vuepress/plugin-docsearch',{
            apiKey: '3a539aab83105f01761a137c61004d85',
            indexName: 'vuepress',
            searchParameters: {
                facetFilters: ['tags:v2'],
            },
            // locales: {
            //     '/zh/': {
            //         placeholder: '搜索文档',
            //     },
            // },
        }],
    ]
})