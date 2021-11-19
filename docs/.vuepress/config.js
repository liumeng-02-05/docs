module.exports = {
  title: '管理后台文档',
  description : '【毕设】管理后台课程配套文档',
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: false },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2, 3] },
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: `logo.jpg` }],
    ['meta', { name: 'theme-color', content: '#1890ff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig : {
    nav : [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '学习课程', link: '' }
    ],
    navbar: true,
    sidebar: {
      collapsable: false,
      '/guide/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: '准备阶段',
          collapsable: false,
          children: [
            'init/web',
            'init/service',
            'init/guide',
            'init/advanced'
          ]
        },
        {
          title: '联调阶段',
          collapsable: false,
          children: [
            'joint/service'
          ]
        },
        {
          title: '发布阶段',
          collapsable: false,
          children: [
            'release/init',
            'release/perfect'
          ]
        },
        {
          title: '模块集合',
          collapsable: false,
          children: [
            'packageAggregate/web',
            'packageAggregate/service'
          ]
        }
      ]
    }
  }
}