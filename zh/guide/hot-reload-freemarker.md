# Freemarker 热重载

DebugTools 5.3.0 支持 Freemarker 模板热重载。模板内容更新到应用实际读取的位置后，下一次渲染会重新检查模板；Java 模型类重定义后，会清理已注册对象包装器的内省缓存，减少模板仍使用旧属性信息的情况。

## 开启与验证

1. 使用 `Hotswap '应用名' with DebugTools` 启动应用，或按[热部署](./hot-deploy.md)配置预加载 Agent。
2. 确认 `Settings | DebugTools | 热重载 | 禁用插件` 没有选择 `Freemarker`。
3. 请求一次使用 Freemarker 的页面，让模板配置与视图初始化。
4. 修改模板，例如 `src/main/resources/templates/index.ftlh`。
5. 使用 `复制 'index.ftlh' 到target目录` 更新本地输出；远程目标使用 `部署 'index.ftlh' 到远程应用`。
6. 重新请求页面，确认模板内容已更新。

具体资源路径和发送方式见[资源文件热重载与部署](./hot-reload-resource.md)。只保存源目录中的模板，而运行应用仍读取输出目录或 JAR 内的旧内容时，页面不会因此更新。

## 模型类变更

模板访问 Java 对象的属性或方法时，如果修改了模型类，请先编译并触发类热重载，再重新请求页面。

DebugTools 对 Freemarker 模板检查间隔进行调整，并在类重定义后调度清理对象包装器缓存。对象包装器接入覆盖 `freemarker.ext.servlet.FreemarkerServlet` 和 Spring MVC 的 `FreeMarkerView`；自定义模板引擎或包装器需要单独验证。

::: tip
- 类结构变更仍需要支持增强类重定义的 JDK，见 [JDK 安装](./install.md#jdk)。
- 插件标记的测试版本为 Freemarker `2.3.31`，其他版本请结合实际项目验证。
- 若模板仍未更新，先检查实际资源路径、所选 ClassLoader 和模板插件日志，再确认浏览器或代理是否缓存了响应。
:::
