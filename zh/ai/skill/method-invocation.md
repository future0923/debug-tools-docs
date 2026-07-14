# 方法调用 Skill

方法调用 Skill 用来让 AI Agent 连接运行中的 Java 应用并调用指定方法。它会处理 JVM 发现、DebugTools 连接、方法参数、重载方法和 ClassLoader 等细节，用户不需要自己逐个指定 MCP 工具。

Skill 名称是 `debug-tools-method-invocation`。

## 能做什么

- 复用当前 IDEA 项目中已有的 DebugTools 连接。
- 查找本地可附着 JVM，并在需要时附着 DebugTools agent。
- 调用实例方法或静态方法。
- 为复杂参数生成结构正确的参数模板。
- 区分重载方法，并使用明确的参数类型完成调用。
- 在类或 Spring Bean 找不到时协助选择正确的 ClassLoader。
- 查看调用结果的 ToString、JSON 或 Debug 视图。

MCP 工具本身的参数和返回值见 [方法调用 MCP](../mcp/method-invocation.md)。

## 怎样使用

直接告诉 AI 类名、方法名和参数即可：

```text
调用 com.demo.UserController.getUser，参数 id=10001。
```

```text
调用 com.demo.UserService.createUser，name 是 Alice，age 是 18。
```

```text
调用 com.demo.HealthService.check，然后把返回结果按 JSON 展示。
```

不必在每次请求中写“使用 DebugTools”。“调用 Java 方法”“附着到这个 JVM”“查看调用结果的 JSON 字段”等意图都可以触发这个 Skill。

为了减少 Agent 反问，建议尽量提供：

| 信息 | 什么时候需要 |
| --- | --- |
| 类的全限定名 | 建议始终提供，例如 `com.demo.UserController`。 |
| 方法名 | 必填，例如 `getUser`。 |
| 参数值 | 方法有参数时提供。 |
| 参数类型 | 存在重载方法且仅靠参数值无法区分时提供。 |
| 项目、模块或应用名称 | IDEA 打开多个项目或运行多个同类应用时提供。 |
| PID | 已经明确知道目标 JVM，且希望直接附着时提供。 |

## Agent 会怎样处理

Agent 通常会先查找已有连接。没有合适连接时，再列出可附着 JVM 并建立连接；有参数的方法会根据复杂度直接组装参数或先生成参数模板，最后再执行调用。

这些步骤由 Skill 决定。用户只需要确认多个候选项中的目标，不需要手动串联 MCP 工具。

## 特殊注意事项

### 新附着的 Spring 应用需要等待

刚附着 JVM 或刚通过 Hotswap 启动应用后，Spring 容器可能还没有初始化完成。调用 `Controller`、`Service`、Repository 或其他 Bean 方法时，Agent 会先等待 Spring ready，再执行方法调用。

普通静态工具方法不依赖 Spring，一般不会经过这个等待过程。

### 复杂参数和重载方法可能需要补充信息

简单参数可以直接使用。对象、集合、嵌套结构或参数名不明确时，Agent 会先生成参数模板再填值。

如果同名重载方法仍然无法区分，Agent 会要求你确认参数类型，而不是猜测要调用哪个方法。

### 多个 JVM 或连接不会自动乱选

当项目中只有一个明确目标时，Agent 可以直接复用。多个连接、多个 JVM 或多个相似应用同时存在时，Agent 会根据项目、主类和连接信息筛选；仍然无法确定时会让你选择。

### ClassLoader 只在需要时处理

正常调用不会预先枚举 ClassLoader。只有出现类找不到、Bean 找不到、框架上下文不匹配或类版本不正确等问题时，Agent 才会检查哪些 ClassLoader 能加载目标类。

如果多个 ClassLoader 都能加载目标类，需要由你确认，Agent 不会仅凭名称猜一个。

### 没有可附着 JVM 时可能建议启动应用

当既没有活动连接，也没有可附着 JVM 时，Agent 可以查询 IDEA 运行配置并建议通过 Hotswap 启动应用。除非原始请求已经授权启动，否则它会先询问，不会擅自运行项目。

### 默认结果是 ToString 视图

方法调用的默认结果适合快速查看。需要结构化内容时，可以继续说：

```text
把刚才的结果按 JSON 展示。
```

```text
用 Debug 视图展开 result.user 字段。
```

JSON 和 Debug 视图依赖连接返回的 HTTP 信息；连接不提供对应信息时，Agent 会说明该视图不可用。

## 无法触发时

如果当前 AI 客户端报告没有 DebugTools MCP 工具，不要让它改用 `jps`、端口扫描或临时 Java 程序模拟调用。先检查 [IDEA MCP 配置](../mcp/idea.md) 和 DebugTools 插件是否正常暴露工具。
