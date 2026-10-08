# DebugTools 状态 MCP

`get_debug_tools_status` 返回 IDEA 项目的诊断快照，聚合项目、DebugTools 连接、可附着 JVM、Java 调试会话和 HTTP 探测信息。5.3.0 起可用，不会启动应用、附着进程或调用业务方法。

## 参数与结果

没有必填参数。可选 `projectPath` 指定 IDEA 项目目录或项目内文件路径；同时打开多个项目时建议提供。

```json
{
  "projectPath": "/path/to/demo"
}
```

正常结果使用 `success`、`data`、`error`、`requestId`、`timestamp` 包装，快照位于 `data`：

| 字段 | 用途 |
| --- | --- |
| `project.name`、`project.path` | 确认当前 MCP 调用的 IDEA 项目。 |
| `connections` | 连接 ID、应用名、PID、地址、来源、连接状态和可用性。 |
| `connections[].springReady` | `/spring/ready` 本次 HTTP 探测是否成功。 |
| `connections[].httpProbe` | Agent 根 HTTP 端点本次探测是否成功。 |
| `connections[].capabilities` | 方法调用、ClassLoader 查询、结果获取、日志和 SQL 的能力提示。 |
| `attachableJvms` | 本地 JVM 的 PID、显示名、运行配置名和模块名。 |
| `debuggerSessions` | 已附着 Java 调试会话的名称、进程信息和 HotSwap 提示。 |
| `nextAction` | 根据当前快照给出的下一步提示。 |

项目无法确定时返回 `NO_PROJECT`；聚合异常时返回 `INTERNAL_ERROR`。

## 根据状态继续

| `nextAction` | 后续操作 |
| --- | --- |
| `INVOKE` | 已有活跃目标，可生成参数模板并调用方法。 |
| `SELECT_CONNECTION` | 多个活跃连接，明确选择 `connectionId`。 |
| `WAIT_FOR_SPRING` | 确认目标 Agent HTTP 可用，并在调用 Spring Bean 前等待 Spring 就绪。 |
| `SELECT_DEBUGGER_SESSION` | 热重载前明确选择 Java 调试会话名称。 |
| `ATTACH_JVM` | 从 `attachableJvms` 选择 PID，再调用 `attach_local_jvm`。 |
| `START_RUN_CONFIGURATION` | 先查询运行配置，再启动明确选中的配置。 |

启动成功只表示 IDEA 接受了启动请求，后续仍需确认 DebugTools 连接已建立。

## 如何理解探测结果

`springReady=false` 表示本次 `/spring/ready` HTTP 探测没有成功，可能是 Spring 尚未就绪，也可能是端口不可达。非 Spring 应用不应仅因这个提示就无限等待。

5.3.0 中，`invokeJavaMethod` 根据 socket 活跃状态返回 `AVAILABLE` 或 `UNAVAILABLE`；`classLoaderQuery` 和 `resultFetch` 根据 `/getApplicationName` 探测返回 `AVAILABLE` 或 `UNKNOWN`。这些提示不保证目标业务类、Bean 或结果读取一定成功。

`logs`、`sql` 当前返回 `UNKNOWN`，需要分别调用[日志和 SQL 工具](./observability.md)确认。`debuggerSessions[].hotSwap=AVAILABLE` 表示发现了已附着会话，不保证当前 JDK 支持所有类结构变更。

此快照不包含连接 Header。需要完整连接配置时使用 `list_debug_tools_connections`。
