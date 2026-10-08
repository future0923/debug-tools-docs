# Thymeleaf 热重载

DebugTools 5.3.0 支持 Thymeleaf 模板热重载。插件在模板渲染前清理本次模板的缓存，让后续请求读取更新后的模板内容。

## 开启与验证

1. 使用 `Hotswap '应用名' with DebugTools` 启动应用，或按[热部署](./hot-deploy.md)配置预加载 Agent。
2. 确认 `Settings | DebugTools | 热重载 | 禁用插件` 没有选择 `Thymeleaf`。
3. 请求一次 Thymeleaf 页面。
4. 修改模板，例如 `src/main/resources/templates/thymeleaf.html`。
5. 使用 `复制 'thymeleaf.html' 到target目录` 更新本地输出；远程目标使用 `部署 'thymeleaf.html' 到远程应用`。
6. 重新请求页面，确认修改已生效。

具体操作见[资源文件热重载与部署](./hot-reload-resource.md)。插件清理模板缓存后，应用仍需要从模板解析器实际使用的路径读取新文件；不会仅凭源目录文件保存就更新 JAR 内的模板。

## Java 代码与模板一起修改

如果同时修改了 Controller、Service 或模板使用的 Java 对象，请分别更新 Java 编译输出并触发类热重载，再更新模板资源。模板缓存清理不会替代 Java 类重定义。

::: tip
- 插件标记的测试版本为 Thymeleaf `3.0.15`，其他版本请结合实际项目验证。
- 该功能作用于 `TemplateManager.parseAndProcess` 渲染路径；自定义模板处理流程需要验证是否经过此入口。
- 如果模板仍未更新，检查模板解析器路径、资源部署目录和默认 ClassLoader；浏览器或代理缓存也可能影响显示结果。
:::
