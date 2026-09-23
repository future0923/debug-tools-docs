# DebugTools 日志和 SQL MCP

::: tip 用它做调用后的证据检查
先完成目标方法调用，再用日志或 SQL 查询验证结果。始终给出条数上限，并尽量加上时间或关键字过滤，避免把整段运行历史塞给 AI。
:::

## 读取目标日志

使用 `read_target_application_logs` 查询目标 JVM 最近的一段日志。可选参数包括 `connectionId`、`limit`、`since`、`level` 和 `keyword`。日志记录可能包含 `timestamp`、`level`、`logger`、`thread`、`message`、`throwable` 和 `source`。

建议组合：调用开始时间作为 `since`，再用 `level` 或 `keyword` 缩小范围。

## 读取最近 SQL

使用 `get_last_sql_statements` 查询目标 JVM 的 SQL 环形缓冲。IDEA 的 `~/.debugTools/sql` 历史仍可在 SQL 历史页面中查看。可选参数包括 `connectionId`、`limit`、`since` 和 `keyword`。记录可能包含 `timestamp`、`sql`、`consumeTimeMillis`、`dbType` 和 `applicationName`。

## 判断返回结果

尽量总是设置条数，并结合时间或关键字过滤。`LOGS_UNAVAILABLE` 表示目标没有可用日志来源，`SQL_HISTORY_UNAVAILABLE` 表示目标端点无法读取。这两个错误都不表示对应流为空。

当前实现可以返回 DebugTools 以及已经接入的采集记录。除非目标能力探测确认，不要承诺已覆盖所有第三方日志框架。

| 返回状态 | 含义 |
| --- | --- |
| 正常结果 | 目标端点可用，返回当前缓冲区中符合条件的记录。 |
| `LOGS_UNAVAILABLE` | 目标没有可用日志来源；不能解释成“没有日志”。 |
| `SQL_HISTORY_UNAVAILABLE` | 目标端点或远程历史不可读；不能解释成“没有 SQL”。 |
