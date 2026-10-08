# DebugTools 日志和 SQL MCP

5.3.0 新增 `read_target_application_logs` 和 `get_last_sql_statements`，通过目标 Agent HTTP 端点读取最近的进程内记录。先调用目标方法，再结合调用时间或关键字查询，可以减少无关记录。

## 前置条件

IDEA 项目已建立活跃 DebugTools 连接，目标使用 5.3.0 Agent，并且 Agent HTTP 端口可访问。远程或 Kubernetes 连接也需要相应 HTTP 端口转发。

::: tip 记录范围
日志工具当前采集目标 JVM 内 DebugTools 自身打印的日志，未自动接入应用的 Logback、Log4j 或完整标准输出。SQL 工具读取已经进入 DebugTools SQL 打印流程且未被过滤的语句，需要先开启[SQL 打印](../../guide/sql.md)。
:::

## 读取最近日志

工具名：`read_target_application_logs`。

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径。 |
| `connectionId` | 条件必填 | `string` | 多个活跃连接时必须指定。 |
| `limit` | 否 | `integer` | 默认 `100`，限制在 `1` 到 `200`。 |
| `since` | 否 | `integer` | Unix 毫秒时间戳，仅保留时间不早于此值的记录，默认 `0`。 |
| `level` | 否 | `string` | 日志级别精确匹配，忽略大小写；例如 `ERROR`，不会自动包含其他级别。 |
| `keyword` | 否 | `string` | 日志消息子串，区分大小写。 |

请求示例：

```json
{
  "connectionId": "demo-connection",
  "limit": 20,
  "level": "ERROR",
  "keyword": "UserService"
}
```

返回记录字段为 `timestamp`、`level`、`logger`、`thread`、`message` 和 `throwable`。`timestamp` 为 Unix 毫秒时间戳，`throwable` 无异常时为空。

## 读取最近 SQL

工具名：`get_last_sql_statements`。

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径。 |
| `connectionId` | 条件必填 | `string` | 多个活跃连接时必须指定。 |
| `limit` | 否 | `integer` | 默认 `50`，限制在 `1` 到 `200`。 |
| `since` | 否 | `integer` | Unix 毫秒时间戳，默认 `0`。 |
| `keyword` | 否 | `string` | SQL 文本子串，区分大小写。 |

请求示例：

```json
{
  "connectionId": "demo-connection",
  "limit": 10,
  "keyword": "user"
}
```

返回记录字段为 `timestamp`、`sql`、`consumeTimeMillis`、`dbType` 和 `applicationName`。SQL 内容按当前 SQL 打印格式记录，耗时单位为毫秒。

## 结果与缓冲限制

两个工具的正常结果都使用结构化包装，`data` 是记录数组：

```json
{
  "success": true,
  "data": [],
  "error": null,
  "requestId": "example-request-id",
  "timestamp": "2026-10-08T00:00:00Z"
}
```

结果取符合过滤条件的最近若干条，按记录时间从旧到新排列。两个缓冲最多保留各 500 条，日志缓冲还按消息大小淘汰旧记录；目标进程重启后清空。不要求开启 SQL 自动保存，也不读取 IDEA 本地的 `~/.debugTools/sql` 历史文件。

| 结果 | 含义与处理 |
| --- | --- |
| `success=true`、`data=[]` | 当前缓冲没有符合条件的记录。检查采集范围、SQL 打印开关和过滤条件。 |
| `LOGS_UNAVAILABLE` | 日志请求或结果解析失败；检查 Agent 版本、HTTP 端口和连接。 |
| `SQL_HISTORY_UNAVAILABLE` | SQL 请求或结果解析失败；检查 Agent 版本、HTTP 端口和 SQL 能力。 |
| `CONNECTION_AMBIGUOUS` | 目标不明确，从错误的候选列表中选择 `connectionId`。 |
| `NO_CONNECTION` | 先建立活跃连接。 |

能力不可用不能解释成没有记录。即使查询成功，也不能据此认定所有应用日志或全部数据库语句都已被采集。
