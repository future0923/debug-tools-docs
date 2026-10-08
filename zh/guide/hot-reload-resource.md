# 资源文件热重载与部署

从 5.3.0 起，DebugTools 的单文件资源操作不再仅限 XML。HTML、FTL、FTLH、YAML、Properties 等非 Java 文件都可以复制到模块输出目录，或作为资源发送到已连接的目标应用。

资源更新和框架重新加载是两步操作。文件写入成功后，是否立即生效取决于应用读取资源的方式，以及对应热重载插件是否处理了缓存或配置刷新。

## 选择更新方式

| 操作 | 适用场景 | 写入位置 |
| --- | --- | --- |
| `复制 '文件名' 到target目录` | 本地应用从模块编译输出读取资源。 | IDEA 当前模块的生产输出目录，例如 `target/classes` 或 `out/production/模块名`，以模块配置为准。 |
| `部署 '文件名' 到远程应用` | 已连接本地或远程目标，需要通过 DebugTools 发送资源。 | 所选 ClassLoader 配置的第一个 `watchResources` 目录；Windows 使用 `watchResourcesWin`。 |

两种操作都会先保存当前文件，并保持文件相对于源码根或资源根的路径。它们只处理单个文件，不能对目录执行，也不会把 Kotlin 等其他语言源码编译成 class。

## 复制到本地输出目录

1. 确认文件属于 IDEA 模块的源码根或资源根，并且模块已配置生产输出目录。
2. 在文件编辑器或项目树中打开右键菜单。
3. 点击 `复制 '文件名' 到target目录`。
4. 等待复制成功通知，再重新请求使用该资源的页面或方法。

例如：

```text
src/main/resources/templates/index.ftlh
    → target/classes/templates/index.ftlh
```

`target目录` 是菜单名称；Gradle 等项目的实际输出路径可能不同。插件会补齐输出文件的父目录并覆盖目标文件，不修改源码文件。

如果菜单没有显示，请检查文件是否为 Java 文件、是否位于源码根或资源根，以及模块输出目录是否可用。

## 部署到目标应用

1. 按[热部署](./hot-deploy.md)配置启动目标应用，确保资源监听目录存在且可写。
2. 建立 DebugTools 连接，并选择能读取业务资源的默认 `ClassLoader`。
3. 在当前非 Java 文件中打开右键菜单，点击 `部署 '文件名' 到远程应用`。
4. 存在多个连接时，选择本次部署的目标连接。
5. 查看 Run 工具窗口的部署结果，再验证目标页面或方法。

例如，资源根下的 `templates/thymeleaf.html` 会发送为同名相对路径，写入目标资源监听目录：

```text
src/main/resources/templates/thymeleaf.html
    → /var/tmp/debug-tools/resources/templates/thymeleaf.html
```

`/var/tmp/debug-tools/resources` 是默认配置示例。自定义路径时以所选 ClassLoader 的配置为准；配置多个监听目录时，单文件部署写入其中第一个目录。

::: warning 生效条件
- 普通附着只建立连接，不代表已初始化热重载和资源监听；请确认目标以热重载/热部署方式启动。
- MyBatis XML、Freemarker 和 Thymeleaf 模板需要对应插件处理重新加载，详见各功能页。
- YAML、Properties 等文件可以发送，但不会因此自动重新绑定 Spring 配置或重建 Bean。
- 部署响应成功后仍应检查实际效果；监听目录缺失等情况还需要查看目标应用的 Agent 日志。
:::

需要一次部署多个资源时，使用[热部署窗口](./hot-deploy.md#_4-1-多个文件)的 `Resource类型`。
