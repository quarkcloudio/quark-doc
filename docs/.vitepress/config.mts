import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "QuarkCloud",
  description: "The Lowcode Management System",
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
  ],
  themeConfig: {
    logo: '/logo.png',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'QuarkGo', link: '/quark-go/' },
      { text: 'QuarkJar', link: '/quark-jar/' },
      { text: 'QuarkLar', link: '/quark-lar/' },
      { text: 'QuarkUI', link: '/quark-ui/' }
    ],

    sidebar: {
      '/quark-go/': [
        {
          text: 'QuarkGo文档',
          link: '/quark-go/',
          items: [
            { text: '前言', link: '/quark-go/' },
            { text: '入门', link: '/quark-go/installation' },
            { text: '资源', link: '/quark-go/resources' },
            { text: '搜索', link: '/quark-go/search' },
            { text: '行为', link: '/quark-go/actions' },
            { text: '指标', link: '/quark-go/metrics' },
            { text: '仪表盘', link: '/quark-go/dashboards' },
            { text: '后台功能', link: '/quark-go/builtin' },
          ]
        },
      ],
      '/quark-jar/': [
        {
          text: 'QuarkJar文档',
          link: '/quark-jar/',
          items: [
            { text: '前言', link: '/quark-jar/' },
          ]
        },
      ],
      '/quark-lar/': [
        {
          text: 'QuarkLar文档',
          link: '/quark-lar/',
          items: [
            { text: '前言', link: '/quark-lar/' },
            { text: '入门', link: '/quark-lar/installation' },
            { text: '资源', link: '/quark-lar/resources' },
            { text: '搜索', link: '/quark-lar/search' },
            { text: '行为', link: '/quark-lar/actions' },
            { text: '指标', link: '/quark-lar/metrics' },
            { text: '仪表盘', link: '/quark-lar/dashboards' },
            { text: '开箱功能', link: '/quark-lar/builtin' },
            { text: '辅助函数', link: '/quark-lar/helper' },
          ]
        },
      ],
      '/quark-ui/': [
        {
          text: 'QuarkUI文档',
          link: '/quark-ui/',
          items: [
            { text: '前言', link: '/quark-ui/' },
            { text: '快速上手', link: '/quark-ui/getting-started' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/quarkcloudio/' }
    ],

    footer: {
      copyright: 'Copyright © 2024 QuarkCloud'
    }
  }
})
