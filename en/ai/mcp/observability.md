# DebugTools Logs and SQL MCP

::: tip Use these tools as post-invocation evidence
Invoke the target method first, then query logs or SQL to verify what happened. Always set a limit and add a time or keyword filter when possible so the response stays focused.
:::

## Read target logs

Use `read_target_application_logs` to read a bounded slice of recent target JVM logs. Optional filters are `connectionId`, `limit`, `since`, `level`, and `keyword`. A successful record can include `timestamp`, `level`, `logger`, `thread`, `message`, `throwable`, and `source`.

Use the invocation start time as `since`, then narrow the result with `level` or `keyword`.

## Read recent SQL

Use `get_last_sql_statements` to read recent SQL from the target JVM SQL ring buffer. IDEA `~/.debugTools/sql` history remains available in the SQL History UI. Optional filters are `connectionId`, `limit`, `since`, and `keyword`. Records can include `timestamp`, `sql`, `consumeTimeMillis`, `dbType`, and `applicationName`.

## Interpret the result

Always use a limit and a time or keyword filter when possible. `LOGS_UNAVAILABLE` means the selected target has no usable log source. `SQL_HISTORY_UNAVAILABLE` means the target endpoint is not readable. Neither error means that the corresponding stream is empty.

The current implementation can report DebugTools and compatible collected records. Do not promise that every third-party logging backend is captured unless the target capability probe confirms it.

| Status | Meaning |
| --- | --- |
| Normal response | The target endpoint is available and returned matching buffered records. |
| `LOGS_UNAVAILABLE` | No usable log source is available; do not interpret this as "no logs". |
| `SQL_HISTORY_UNAVAILABLE` | The target endpoint or remote history cannot be read; do not interpret this as "no SQL". |
