---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DebugTools"
  text: "集成于 IntelliJ IDEA 的 Java 开发调试插件"
  tagline: 专注于提升开发效率与缩短调试周期
  actions:
    - theme: brand
      text: 什么是 DebugTools?
      link: /guide/introduction
    - theme: alt
      text: 快速开始
      link: /guide/install
    - theme: alt
      text: GitHub
      link: https://github.com/future0923/debug-tools
    - theme: alt
      text: Gitee
      link: https://gitee.com/future94/debug-tools
  image:
    src: /logo.webp
    alt: DebugTools

features:
  - icon:
      src: /icon/hot_deployment.svg
    title: 热部署
    details: 传统的部署流程一般为提交代码->拉取代码->打包->部署->重启项目后才能让编写的代码生效。而热部署可以跳过这繁琐的流程，开发者修改代码后无需手动触发打包或重启服务，应用即可实时加载新逻辑并运行，极大缩短反馈周期。我们开发/测试等环境引入热部署后，团队整体开发效率可提升大大提升，尤其适用于敏捷开发模式下的高频迭代场景。
    link: /guide/hot-deploy
  - icon:
      src: /icon/hotswap_on.svg
    title: 热重载
    details: 传统编写代码时，需要重启应用才能生效，而热重载可以在不重启应用下让编写的代码生效立刻，让开发者编写的代码改动瞬间生效，极大提升迭代效率。支持类(包括代理类)的属性和方法变动、Spring、Solon、Mybatis等主流框架。同时适配 jdk8、jdk11、jdk17、jdk21 等多个JDK版本。
    link: /guide/hot-reload
  - icon: 🚗
    title: 调用任意Java方法
    details: 直接调用本地或远程应用中的 Java 方法，支持静态方法、实例方法、Spring Bean 方法、Dubbo、XXL-JOB、MQ、MyBatis Mapper 等场景，可传递复杂参数、Header 与任务参数，减少临时代码和重复请求构造。
    link: /guide/method/quick-start
  - icon: 🤔
    title: 执行Groovy脚本
    details: 依托附着应用，可以执行编写Groovy脚本及对附着应用调试。可以快速获取应用程序信息，执行对应功能代码。并内置常用Groovy函数，帮助开发者定位应用程序问题。
    link: /guide/groovy-execute
  - icon: 👀
    title: 打印SQL语句与耗时
    details: 不需要修改任何代码和配置，即可格式化打印真正运行的SQL语句并输出执行时间。支持任何通过JDBC连接的数据库，如：MySQL、PostgreSQL、SQLServer、ClickHouse、Oracle、Sqlite 等。
    link: /guide/sql  
  - icon: 🔍
    title: 搜索HttpUrl
    details: 通过给定的URL信息直接跳转到相应的方法定义位置。内置强大的URL信息提取功能，各种形式的URL都能精准定位。
    link: /guide/search-http
  
---
