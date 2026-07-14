# Spring 配置 Skill

Spring 配置 Skill 用来让 AI Agent 读取运行中 Spring 应用的 `Environment` 配置值。它看到的是应用启动后最终解析出的值，而不是简单读取仓库里的 `application.yml` 或 `application.properties`。

Skill 名称是 `debug-tools-spring-config`。

## 能做什么

- 读取指定 Spring 配置 key 的运行时值。
- 复用已有 DebugTools 连接，或在需要时附着目标 JVM。
- 在多个运行中应用之间选择正确目标。
- 区分“配置 key 没有解析到值”和“请求失败”。

常见用途包括：

- 确认当前生效的 `server.port`。
- 查看 `spring.profiles.active`。
- 确认数据源、Redis、消息队列等组件实际使用的地址。
- 排查环境变量、启动参数、配置中心或 profile 覆盖后的最终值。

## 怎样使用

直接说明“运行中应用”和要读取的 key：

```text
读取运行中 Spring 应用的 server.port 和 spring.profiles.active。
```

```text
查看 demo-service 当前生效的 spring.datasource.url。
```

```text
确认当前 JVM 中 feature.user-cache.enabled 的最终值。
```

不必特意加上“使用 DebugTools”。“运行中 Spring 应用”“当前 JVM”“最终生效值”等信息可以帮助 Agent 判断要读取的是运行时 `Environment`，而不是源码配置文件。

## 需要提供什么

这个能力按 key 查询，不能无条件导出全部 Spring 配置。请求中应至少给出一个配置 key。

如果有多个 Spring 应用同时运行，最好同时提供应用名、模块名、主类或 PID，例如：

```text
读取 PID 31245 对应 Spring 应用的 server.port。
```

没有提供 key 时，Agent 会先询问要读取哪些配置；无法从多个连接中确定目标时，也会让用户选择应用。

## 为什么和读取配置文件不同

`application.yml` 中写出的值不一定是应用最终使用的值。Spring 还可能受到以下来源影响：

- 当前激活的 profile。
- 环境变量。
- JVM 系统属性和启动参数。
- 外部配置文件。
- 配置中心或其他 PropertySource。

Spring 配置 Skill 返回的是运行时 `Environment` 解析后的结果，因此更适合排查“代码仓库里明明是这个值，运行时为什么不是”的问题。

## 特殊注意事项

### `null` 表示没有解析到该 key

某个 key 返回 `null` 时，表示当前 Spring `Environment` 没有解析到值，不代表整个请求失败。可以检查 key 拼写、当前 profile 和配置来源。

### 必须先有可用连接

Skill 会先查找 DebugTools 连接，没有连接时再尝试附着 JVM。它不会猜测 `localhost` 或默认端口，也不会扫描本机端口寻找 Spring 应用。

如果当前没有可附着 JVM，Agent 可能建议通过 Hotswap 启动一个 IDEA 运行配置；没有得到启动授权时不会擅自启动应用。

### 读取的是敏感运行时数据

数据源密码、令牌和密钥也可能存在于 Spring `Environment` 中。只读取排查任务确实需要的 key，不要把包含敏感值的结果直接粘贴到 Issue、聊天记录或公开日志。

### 它不是 Java 方法调用

读取配置时会使用 DebugTools 的 Spring 配置 HTTP 能力，而不是调用某个 Spring Bean 方法。如果任务是执行 Java 代码，应改用 [方法调用 Skill](./method-invocation.md)。

## 无法触发时

如果当前 AI 客户端报告缺少 DebugTools MCP 连接工具，先检查 [IDEA MCP 配置](../mcp/idea.md) 和插件状态。不要让 Agent 发明 `get_spring_config` 之类的 MCP 工具，也不要用读取本地配置文件冒充运行时结果。
