# DebugTools 状态 MCP

`get_debug_tools_status` 返回当前 IDEA 项目的一份诊断快照，聚合项目身份、DebugTools 连接、可附着 JVM、已附着 Java 调试会话、Spring 就绪状态和能力探测结果。

::: tip 先看 `nextAction`
这不是一个需要反复尝试的状态接口。先读取 `nextAction`，再按建议选择连接、附着 JVM、启动运行配置或等待 Spring，就能把后续调用串起来。
:::

## 快照包含什么

响应包含 `project`、`connections`、`attachableJvms`、`debuggerSessions` 和 `nextAction`。`nextAction` 固定为 `INVOKE`、`SELECT_CONNECTION`、`ATTACH_JVM`、`START_RUN_CONFIGURATION`、`SELECT_DEBUGGER_SESSION`、`WAIT_FOR_SPRING`、`RECONNECT` 或 `NONE`。

| 区域 | 用途 |
| --- | --- |
| `project` | 确认当前 MCP 调用对应的 IDEA 项目。 |
| `connections` | 选择可调用的 DebugTools 目标，并取得 `connectionId`。 |
| `attachableJvms` | 没有连接时，查找可以附着的本地 JVM。 |
| `debuggerSessions` | 热重载前确认 Java 调试会话和 HotSwap 能力。 |
| `nextAction` | 给出当前状态下最直接的下一步。 |

## 根据状态继续

可以按以下方式决定下一步：

1. `INVOKE` 表示已有可用目标。
2. `SELECT_CONNECTION` 表示存在多个活跃连接，应通过 `connectionId` 选择。
3. `ATTACH_JVM` 表示可以调用 `attach_local_jvm` 附着本地 JVM。
4. `START_RUN_CONFIGURATION` 表示先列出运行配置，只启动明确选中的配置。
5. `WAIT_FOR_SPRING` 表示调用 Spring 方法前轮询所选连接的 `/spring/ready`。

::: warning 不要把启动成功当成连接成功
运行配置启动请求返回成功，只代表 IDEA 已经接受启动请求。后续仍要重新读取连接状态，确认目标 JVM 已经建立 DebugTools 连接。
:::

## 安全边界

响应会主动省略连接 header，避免把认证信息暴露给 MCP 客户端。能力值为 `AVAILABLE`、`UNAVAILABLE`、`NOT_CONFIGURED` 或 `UNKNOWN`；`UNKNOWN` 不能当作探测成功。
