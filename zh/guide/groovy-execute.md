# 执行 Groovy 脚本 {#execute-groovy-script}

Groovy 脚本会在目标 JVM 内执行，可以访问目标应用中的 Java 类、Spring Bean，以及 DebugTools 提供的 [内置函数](./groovy-function.md)。执行脚本前需要先完成本地附着或远程连接，并在连接卡片中选择可用的默认 `ClassLoader`。

::: warning 注意 ClassLoader
Groovy 脚本运行时会使用当前连接选择的默认 `ClassLoader`。如果目标应用存在多个类加载器，请选择能加载业务类和 Spring 容器的 `ClassLoader`；选错后可能出现类找不到、Bean 获取不到或配置读取不到的情况。
:::

## 1. 打开 Groovy 控制台

在 DebugTools 的连接管理页中，打开目标连接卡片的更多菜单，点击 `Groovy 控制台`。

![groovy_connection_menu](/images/groovy/groovy_connection_menu.png){v-zoom}

DebugTools 会在 `Scratches and Consoles -> Debug Tools Plugins -> groovy` 下创建或打开一个 Groovy Scratch 文件。文件名会根据连接的应用名生成，例如 `SpringBootMybatis.groovy`。

首次创建文件时，DebugTools 会在文件顶部写入连接标识：

```groovy
// DebugTools-Connection-Id: ...
```

这个标识用于把当前 Groovy 文件和目标连接绑定起来。日常使用时不要删除或手动修改这一行；如果文件已经存在，DebugTools 只会重新打开文件，不会覆盖你已有的脚本内容。

## 2. 编写脚本

在打开的 `.groovy` 文件中编写脚本即可。它是标准 Groovy 文件，IDEA 会提供 Groovy 语法、项目类和导入提示。

例如读取目标 Spring 应用的端口配置：

```groovy
gsc("server.port")
```

常用内置函数包括：

| 函数 | 说明 |
| --- | --- |
| `gi` / `getInstances` | 获取目标 JVM 中指定 Class 的实例。 |
| `gb` / `getBean` | 从目标 Spring 容器中获取 Bean。 |
| `rb` / `registerBean` | 向目标 Spring 容器注册 Bean。 |
| `urb` / `unregisterBean` | 从目标 Spring 容器注销 Bean。 |
| `gActive` / `getSpringProfilesActive` | 获取当前激活的 Spring Profile。 |
| `gsc` / `getSpringConfig` | 获取目标应用的 Spring 配置。 |

完整函数用法可以查看 [Groovy 内置函数](./groovy-function.md)。

## 3. 运行脚本

在当前 Groovy 文件中打开右键菜单，点击 `运行当前 Groovy 脚本 'xxx.groovy'`。

![groovy_run_context_menu](/images/groovy/groovy_run_context_menu.png){v-zoom}

执行时 DebugTools 会先保存当前文件，然后把完整脚本内容、连接标识和默认 `ClassLoader` 标识发送到目标 JVM。目标 JVM 会使用 DebugTools 的 Groovy 基类执行脚本，因此脚本中可以直接调用 `gsc`、`gb`、`gi` 等内置函数。

如果当前文件没有连接标识：

- 只有一个连接时，DebugTools 会直接使用该连接并绑定当前文件。
- 有多个连接时，DebugTools 会让你选择要执行脚本的连接。
- 没有可用连接时，需要回到连接管理页，从目标连接卡片重新打开 `Groovy 控制台`。

## 4. 查看结果

执行完成后，结果会显示在 IDEA 底部的 Run 工具窗口中，标题格式为 `Groovy 结果 - 应用名`。

![groovy_debug_result](/images/groovy/groovy_debug_result.png){v-zoom}

结果展示规则如下：

| 结果类型 | 展示方式 |
| --- | --- |
| `null` | `toString` 页签显示 `NULL`。 |
| 基础类型、字符串等简单值 | `toString` 页签显示转换后的文本。 |
| 对象 | `toString` 页签显示对象的 `toString()`，`调试` 页签可以展开查看对象结构。 |
| 异常 | 显示异常堆栈，方便根据脚本、参数或 `ClassLoader` 继续排查。 |

如果结果中需要继续查看对象字段，可以切换到 `调试` 页签展开对象；如果只需要复制返回值，可以在结果节点中使用复制操作。
