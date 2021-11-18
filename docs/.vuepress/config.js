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
      { text: '购买课程', link: 'https://coding.imooc.com/class/401.html' }
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
          title: '服务端项目准备',
          collapsable: false,
          children: [
            'init/guide',
          ]
        },
        {
          title: '服务端新增接口配置',
          collapsable: false,
          children: [
            'interfaceConfiguration/guide',
          ]
        },
        {
          title: '服务端数据库配置',
          collapsable: false,
          children: [
            'databaseConfiguration/guide',
          ]
        },
        {
          title: '模版文件处理',
          collapsable: false,
          children: [
            'template/guide',
          ]
        },
        {
          title: '联调测试',
          collapsable: false,
          children: [
            'jointCommissioning/web',
            'jointCommissioning/service',
          ]
        },
      ]
    }
  }
}