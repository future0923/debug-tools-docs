import { createRequire } from 'module'
import { DefaultTheme, defineConfig } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const zh = defineConfig({
  lang: 'zh-Hans',
  title: 'DebugTools',
  titleTemplate: '集成于 IntelliJ IDEA 的 Java 开发调试插件',
  description: "专注于提升开发效率与缩短调试周期",
  themeConfig: {
    siteTitle: 'DebugTools',
    logo: '/pluginIcon.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    outline: {
      level: 'deep',
      label: '页面导航'
    },
    editLink: {
      pattern: 'https://github.com/future0923/debug-tools-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页面'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdated: {
      text: '最后更新于',
    },
    sidebar: {
      '/guide': {
        base: '/guide/',
        items: sidebarGuide()
      },
      '/blog': {
        base: '/blog/',
        items: sidebarBlog()
      },
      '/ai': {
        base: '/ai/',
        items: sidebarAi()
      },
      'other': {
        base: '/other/',
        items: sidebarOther()
      }
    },
    socialLinks: [
      {icon: 'github', link: 'https://github.com/future0923/debug-tools'},
      {icon: 'gitee', link: 'https://gitee.com/future94/debug-tools'},
    ],
    footer: {
      message: `基于 GPL-3.0 许可发布 | 版权所有 © 2024-${new Date().getFullYear()} <a href="https://github.com/future0923/" target="_blank">Future0923</a>`,
      copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">吉ICP备2024021764号-1</a> | <img src="/icon/beian.png" alt="" style="display: inline-block; width: 18px; height: 18px; vertical-align: middle;" /> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=22010302000528" rel="noreferrer" target="_blank">吉公网安备22010302000528</a>'
    },
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '文档',
      link: '/guide/introduction',
    },
    {
      text: 'AI',
      link: '/ai/mcp/idea',
      activeMatch: '/ai/'
    },
    {
      text: '博客',
      link: '/blog/java-env',
    },
    {
      text: '视频教程',
      items: [
        {
          text: '如何断点调式DebugTools项目',
          link: 'https://www.bilibili.com/video/BV1i66oBXEmC'
        },
      ]
    },
    {
      text: '联系我',
      link: '/contact-me',
    },
    {
      text: pkg.version,
      items: [
        {
          text: '更新日志',
          link: '/other/changelog'
        },
        {
          text: '参与贡献',
          link: '/other/contributing.md'
        }
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        {text: '什么是 DebugTools？', link: 'introduction'},
        {text: '安装说明', link: 'install'},
        {text: '快速开始', link: 'quick-start'}
      ]
    },
    {
      text: '热重载',
      collapsed: false,
      items: [
        {text: '使用热重载', link: 'hot-reload'},
        {text: 'Class', link: 'hot-reload-class'},
        {text: 'Proxy', link: 'hot-reload-proxy'},
        {text: 'SpringBoot', link: 'hot-reload-springboot'},
        {text: 'Mybatis', link: 'hot-reload-mybatis'},
        {text: 'MybatisPlus', link: 'hot-reload-mybatis-plus'},
        {text: 'Solon', link: 'hot-reload-solon'},
      ]
    },
    {
      text: '热部署',
      collapsed: false,
      items: [
        {text: '使用热部署', link: 'hot-deploy'},
      ]
    },
    {
      text: '快速调用Java方法',
      collapsed: false,
      items: [
        {text: '快速开始', link: 'method/quick-start'},
        {text: '连接管理', link: 'method/connect-manage'},
        {text: '方法调用', link: 'method/invoke-page'},
        {text: '方法参数JSON', link: 'method/param-json'},
        {text: '请求头', link: 'method/request-header'},
        {text: '前后置脚本', link: 'method/method-script'},
        {text: '链路耗时', link: 'method/trace-method'},
        {text: 'Reactive', link: 'method/reactive'},
        {text: '调用历史', link: 'method/invoke-record'},
        {text: '转为 HTTP', link: 'method/convert-http'},
      ]
    },
    {
      text: '搜索Http地址',
      collapsed: false,
      items: [
        {text: '搜索Http地址', link: 'search-http'},
      ]
    },
    {
      text: '打印SQL语句与执行耗时',
      collapsed: false,
      items: [
        {text: 'SQL', link: 'sql'},
        {text: 'SQL历史记录', link: 'sql-history'},
      ]
    },
    {
      text: '执行Groovy脚本',
      collapsed: false,
      items: [
        {text: '执行Groovy脚本', link: 'groovy-execute'},
        {text: '内置函数', link: 'groovy-function'},
      ]
    },
    {
      text: 'Idea插件说明',
      collapsed: false,
      items: [
        {text: '切换命名格式', link: 'toggle-camel-case'},
      ]
    },
  ]
}

function sidebarBlog(): DefaultTheme.SidebarItem[] {
  return [
    {text: 'Java多版本管理', link: 'java-env'},
    {text: '远程调试', link: 'remote-debug'},
    {text: '@Autowired与@Value源码解析', link: 'autowired-value'},
  ]
}

function sidebarAi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'MCP',
      collapsed: false,
      items: [
        {text: 'IDEA MCP 使用说明', link: 'mcp/idea'},
        {text: '方法调用 MCP', link: 'mcp/method-invocation'},
        {text: 'Hotswap MCP', link: 'mcp/hotswap'},
      ]
    },
    {
      text: 'Skill',
      collapsed: false,
      items: [
        {text: '安装与使用', link: 'skill/quick-start'},
        {text: '方法调用 Skill', link: 'skill/method-invocation'},
        {text: 'Hotswap Skill', link: 'skill/hotswap'},
        {text: 'Spring 配置 Skill', link: 'skill/spring-config'},
      ]
    },
  ]
}

function sidebarOther(): DefaultTheme.SidebarItem[] {
  return [
    {text: '版本迭代记录', link: 'changelog'},
    {text: '参与贡献', link: 'contributing'},
  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
