import { defaultTheme } from '@vuepress/theme-default'

module.exports = ({
    dest: './dist',
    title: 'QuarkCloud',
    description: 'The Lowcode Management System',
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
        repo: 'quarkcloudio/quark-doc',
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
                    { text: 'v2', link: 'https://quarkcloud.io/' },
                    { text: 'v1', link: 'https://v1.quarkcloud.io/' }
                ]
              }
        ],
        sidebar: {
            '/quark-go/' : [
                {
                    text: 'QuarkGo文档',
                    collapsable: true,
                    sidebarDepth:2,
                    children: [
                        '/quark-go/README.md',
                        '/quark-go/installation',
                        '/quark-go/resources',
                        '/quark-go/search',
                        '/quark-go/actions',
                        '/quark-go/metrics',
                        '/quark-go/dashboards',
                        '/quark-go/builtin'
                    ]
                },
            ],
            '/quark-admin/' : [
                {
                    text: 'Admin文档',
                    collapsable: true,
                    sidebarDepth:2,
                    children: [
                        '/quark-admin/README.md',
                        '/quark-admin/installation',
                        '/quark-admin/resources',
                        '/quark-admin/search',
                        '/quark-admin/actions',
                        '/quark-admin/metrics',
                        '/quark-admin/dashboards',
                        '/quark-admin/builtin',
                        '/quark-admin/helper'
                    ]
                },
            ],
            '/quark-ui/' : [
                {
                    text: 'UI文档',
                    collapsable: true,
                    children: [
                        '/quark-ui/README.md',
                        '/quark-ui/getting-started'
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