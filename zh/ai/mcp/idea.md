# IDEA MCP 使用说明

IntelliJ IDEA 从 2025.2 开始内置 MCP Server。启用后，Codex、Claude Code、Cursor、VS Code 等外部 AI 客户端可以通过 MCP 调用 IDEA 提供的工具，在当前打开的项目中读取代码、搜索符号、运行配置和执行其他 IDE 操作。

DebugTools 在 IDEA MCP Server 的基础上增加 Java 方法调用、和 Hotswap 等工具。

本页先介绍如何启用和连接 IDEA MCP Server，再说明 DebugTools 如何把自己的工具适配进去。

::: tip 官方说明
不同 IDEA 版本中的界面文案可能略有差异。IDEA MCP Server 的最新用法可以查看 [JetBrains MCP Server 文档](https://www.jetbrains.com/help/idea/mcp-server.html)。
:::

## 整体关系

```text
AI 客户端
    |
    | MCP
    v
IntelliJ IDEA MCP Server
    |-- IDEA 内置工具
    |-- DebugTools 方法调用工具
    `-- DebugTools Hotswap 工具
             |
             v
       当前 IDEA 项目和目标 JVM
```

AI 客户端只需要连接 IDEA MCP Server。DebugTools 工具会注册到同一个 MCP Server 中，不需要再配置单独的 DebugTools MCP 地址。

## 1. 确认 MCP Server 插件

IDEA MCP Server 从 IntelliJ IDEA 2025.2 开始内置，并由 JetBrains 的 `MCP Server` 插件提供。

1. 打开 IDEA 设置（macOS 中为 `Preferences`）。
2. 进入 `Plugins`，选择 `Installed`。
3. 搜索 `MCP Server`，确认插件已经启用。
4. 搜索 `DebugTools`，确认 DebugTools 插件已经安装并启用。

![IDEA 插件设置中的 MCP Server](/images/method/idea_mcp_plugin.png){v-zoom}

`MCP Server` 通常随新版 IDEA 安装并默认启用。如果设置中找不到该插件或 `Tools | MCP Server` 页面，先确认 IDEA 版本不低于 2025.2。

启用或更新插件后，建议重启 IDEA 并重新打开目标项目，让 DebugTools 在项目启动阶段完成 MCP 工具注册。

## 2. 启用 MCP Server

1. 打开 `Settings | Tools | MCP Server`。
2. 点击 `Enable MCP Server`。
3. 阅读授权提示并确认启用。

启用 MCP Server 后，外部 AI 客户端可以访问当前 IDEA 中打开的项目，并可能读取文件、触发 IDE 操作或运行命令。只为可信的本地 AI 客户端配置连接，不使用时可以在同一页面关闭 MCP Server。

::: info
`Run shell commands or run configurations without confirmation (brave mode)` 不是使用 DebugTools MCP 的前置条件。它会减少 IDEA 对命令和运行配置的确认提示，应根据自己的安全要求决定是否启用。
:::

## 3. 连接 AI 客户端

IDEA 支持自动配置和手动配置两种方式。优先使用自动配置，避免手写端口或连接参数。

### 自动配置

1. 在 `Settings | Tools | MCP Server` 中找到 `Clients Auto-Configuration`。
2. 在目标 AI 客户端对应项中点击 `Auto-Configure`。
3. 配置完成后重启 AI 客户端。

需要确认 IDEA 写入了什么内容时，打开该客户端的配置菜单并选择 `Open Client Settings File`。也可以选择 `Copy Config`，把配置手动添加到客户端。

### 手动配置

如果 IDEA 没有识别出正在使用的客户端，在 `Manual Client Configuration` 中按客户端支持的连接方式选择：

- `Copy Stdio Config`
- `Copy SSE Config`
- `Copy HTTP Stream Config`

把复制的完整配置添加到 AI 客户端，然后重启客户端。不同客户端支持的传输方式和配置文件位置不同，应以客户端自身的 MCP 配置说明为准。

![IDEA MCP Server 客户端配置](/images/method/idea_mcp_server_settings.png){v-zoom}

::: warning
不要根据其他机器或旧配置猜测 MCP 端口。IDEA 检测到客户端端口不一致时会提示重新配置；此时重新执行 `Auto-Configure`，或从当前 IDEA 复制一份新配置。
:::

### 在 Codex 中确认

IDEA 完成自动配置并重启 Codex 后，打开 Codex 设置中的 `插件 | MCP`，确认名为 `idea` 的服务器已经出现并处于启用状态。

![Codex 设置中的 IDEA MCP Server](/images/method/codex_idea_mcp_server.png){v-zoom}

如果列表中没有 `idea`，回到 IDEA 重新执行 `Auto-Configure`；如果已经存在但不可用，先确认开关已启用，再重启 Codex。

## 4. 检查 DebugTools 工具

进入 `Settings | Tools | MCP Server | Exposed Tools`，检查下面两个工具组及其工具是否可用并处于启用状态。

![IDEA MCP Exposed Tools 中的 DebugTools 工具组](/images/method/idea_mcp_exposed_tools.png){v-zoom}

### 方法调用工具组

在 `Exposed Tools` 中显示为 `DebugToolsMethodInvocationToolset`：

```text
list_debug_tools_connections
list_attachable_jvms
attach_local_jvm
generate_method_args_template
invoke_java_method
```

这组工具用于查看 DebugTools 连接、附着本地 JVM、生成方法参数模板和调用 Java 方法。详细用法见 [方法调用 MCP](./method-invocation.md)。

### Hotswap 工具组

在 `Exposed Tools` 中显示为 `DebugToolsHotswapToolset`：

```text
list_debug_tools_run_configurations
execute_debug_tools_run_configuration
compile_and_reload_modified_files
```

这组工具用于查看 IDEA 运行配置、通过 DebugTools Hotswap 启动应用，以及调用 IDEA Java Debugger 的编译并热重载能力。详细用法见 [Hotswap MCP](./hotswap.md)。

也可以通过 IDEA 的 `Tools | Show MCP Tools` 查看当前 MCP Server 暴露的全部工具、说明和参数。

## 5. 完成最小调用测试

重启 AI 客户端后，在目标项目对应的会话中输入：

```text
使用 IDEA MCP 的 list_debug_tools_connections 查看当前项目的 DebugTools 连接。
```

出现下面任意结果，都说明 AI 客户端已经能够调用 DebugTools MCP：

- 返回一个或多个 DebugTools 连接。
- 返回 `count=0` 或空连接列表，表示 MCP 调用成功，但当前项目还没有 DebugTools 连接。

## 接下来

- 查看 [方法调用 MCP](./method-invocation.md)，了解 5 个方法调用工具的参数和完整流程。
- 查看 [Hotswap MCP](./hotswap.md)，了解 3 个启动与热重载工具的用法。
- 安装 [DebugTools Skill](../skill/quick-start.md)，让 AI 自动遵循推荐的工具调用顺序。
