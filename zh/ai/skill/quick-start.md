# 安装与使用 Skill

[debug-tools-ai](https://github.com/future0923/debug-tools-ai) 是 DebugTools 的开源 AI Skill 项目，支持 Codex、Claude Code、Gemini、OpenCode、Cursor、Kimi 和 Pi 等 Agent。它把 Java 方法调用、Hotswap 和 Spring 运行时配置读取整理成 AI 可以加载的工作流。

安装完成后，用户只需要描述想完成的任务。通常不必特意说“使用 DebugTools”，也不需要自己安排 MCP 工具的调用顺序。

## 安装前准备

安装 Skill 之前，请先确认：

- IntelliJ IDEA 已安装 DebugTools 插件。
- IDEA MCP Server 已启用，并已暴露 DebugTools 提供的 MCP 工具。
- 使用的 AI 客户端能够连接当前 IDEA 项目的 MCP Server。

如果还没有配置 IDEA MCP，请先阅读 [在 AI 中使用 IDEA MCP](../mcp/idea.md)。

::: info
`debug-tools-ai` 只安装 Skill、Agent 指令和对应平台的插件元数据，不会安装 IntelliJ IDEA、DebugTools 插件、DebugTools agent 或 IDEA MCP Server。
:::

## 一行安装

以 Codex 为例，在终端执行：

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --codex
```

其他 Agent 使用同一个安装脚本，只需要替换最后的安装参数：

| Agent | 安装参数 |
| --- | --- |
| Codex | `--codex` |
| Claude Code | `--claude` |
| Gemini | `--gemini` |
| OpenCode | `--opencode` |
| Cursor | `--cursor` |
| Kimi | `--kimi` |
| Pi | `--pi` |
| 全部本地集成 | `--all` |

例如，一次安装所有支持的本地集成：

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --all
```

安装器会根据参数，把 Skill、Agent 指令和插件元数据复制到对应平台的本地配置目录。安装结束后，重新打开 AI 客户端或新建一个任务，让客户端重新加载这些文件。

## Codex 安装结果

使用 `--codex` 时，3 个 Skill 会安装到：

```text
~/.codex/skills/debug-tools-method-invocation
~/.codex/skills/debug-tools-hotswap
~/.codex/skills/debug-tools-spring-config
```

Codex 插件元数据会复制到：

```text
~/.codex/plugins/debug-tools-ai
```

可以执行下面的命令，确认 3 个 `SKILL.md` 都存在：

```bash
ls ~/.codex/skills/debug-tools-{method-invocation,hotswap,spring-config}/SKILL.md
```

## 检查安装

安装成功时，脚本会输出对应平台的安装结果，例如：

```text
Installed Codex files
debug-tools-ai installation finished
```

使用其他安装参数时，第一行会显示对应的 Agent 名称。随后重新打开 AI 客户端或新建任务，确认客户端能够加载 3 个 Skill。

Codex 用户还可以使用前面的 `ls` 命令直接检查 3 个 `SKILL.md` 文件。其他 Agent 则检查各自的本地配置目录。

## 直接描述任务

安装后的 Agent 会根据任务内容选择对应 Skill。下面这些说法都不需要额外加上“使用 DebugTools”：

```text
调用 com.demo.UserController.getUser，参数 id=10001。
```

```text
用 Hotswap 启动 DemoApplication 运行配置。
```

```text
把刚修改的 Java 类编译并重新加载到当前调试会话。
```

```text
读取运行中 Spring 应用的 server.port 和 spring.profiles.active。
```

AI 会按照 Skill 中的规则完成连接选择、参数准备或运行配置筛选。只有在多个 JVM、运行配置、调试会话或 ClassLoader 都可能匹配时，才需要用户进一步选择。

## 什么时候需要明确说明

当一句话既可能表示“读取源码”，也可能表示“访问运行中的 JVM”时，建议把目标说清楚：

```text
读取运行中 Spring 应用解析后的 server.port，不要读取 application.yml 文件。
```

如果当前 AI 客户端没有加载到对应 Skill，或者任务中看不到 DebugTools MCP 工具，可以明确补充：

```text
通过 IDEA 中的 DebugTools 调用这个 Java 方法。
```

这不是日常使用的必填前缀，而是排查 Skill 发现或 MCP 配置问题时的辅助说明。

## 3 个 Skill

| Skill | 能做什么 |
| --- | --- |
| [方法调用 Skill](./method-invocation.md) | 查找或附着 JVM、准备参数、调用 Java 方法，并处理 Spring ready、ClassLoader 和结果视图。 |
| [Hotswap Skill](./hotswap.md) | 查询和启动 IDEA 运行配置，把最近修改的 Java 类编译并重新加载到调试会话。 |
| [Spring 配置 Skill](./spring-config.md) | 从运行中 Spring 应用的 `Environment` 读取指定配置 key 的最终值。 |

## 更新

使用一行安装的用户可以重新执行安装命令，并传入原来的 Agent 参数，覆盖为仓库 `main` 分支的最新版本：

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --codex
```

项目源码、问题反馈和版本记录见 [future0923/debug-tools-ai](https://github.com/future0923/debug-tools-ai)。
