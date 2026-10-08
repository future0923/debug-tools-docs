# DebugTools Logs and SQL MCP

5.3.0 adds `read_target_application_logs` and `get_last_sql_statements` to read recent in-process records through the target Agent's HTTP endpoints. Invoke the target method first, then filter by invocation time or keywords to reduce unrelated records.

## Prerequisites

The IDEA project must have an active DebugTools connection, the target must use the 5.3.0 Agent, and its HTTP port must be reachable. Remote or Kubernetes connections also need the corresponding HTTP port forwarding.

::: tip Record Scope
The log tool currently captures logs printed by DebugTools itself inside the target JVM. It does not automatically capture application Logback, Log4j, or complete standard output. The SQL tool reads statements that entered the DebugTools SQL printing flow and passed its filters. Enable [SQL Printing](../../guide/sql.md) first.
:::

## Read Recent Logs

Tool: `read_target_application_logs`.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | Target IDEA project path. |
| `connectionId` | Conditional | `string` | Required when several active connections exist. |
| `limit` | No | `integer` | Default `100`, restricted to `1`–`200`. |
| `since` | No | `integer` | Unix timestamp in milliseconds. Keeps records at or after this time; default `0`. |
| `level` | No | `string` | Exact log level match, ignoring case, such as `ERROR`. Other levels are not included automatically. |
| `keyword` | No | `string` | Case-sensitive substring of the log message. |

Request example:

```json
{
  "connectionId": "demo-connection",
  "limit": 20,
  "level": "ERROR",
  "keyword": "UserService"
}
```

Record fields are `timestamp`, `level`, `logger`, `thread`, `message`, and `throwable`. `timestamp` is a Unix timestamp in milliseconds. `throwable` is null when no exception is present.

## Read Recent SQL

Tool: `get_last_sql_statements`.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | Target IDEA project path. |
| `connectionId` | Conditional | `string` | Required when several active connections exist. |
| `limit` | No | `integer` | Default `50`, restricted to `1`–`200`. |
| `since` | No | `integer` | Unix timestamp in milliseconds; default `0`. |
| `keyword` | No | `string` | Case-sensitive substring of SQL text. |

Request example:

```json
{
  "connectionId": "demo-connection",
  "limit": 10,
  "keyword": "user"
}
```

Record fields are `timestamp`, `sql`, `consumeTimeMillis`, `dbType`, and `applicationName`. SQL is stored in the current printing format; execution time is in milliseconds.

## Results and Buffer Limits

Normal results from both tools use a structured wrapper with an array of records in `data`:

```json
{
  "success": true,
  "data": [],
  "error": null,
  "requestId": "example-request-id",
  "timestamp": "2026-10-08T00:00:00Z"
}
```

The result contains the most recent matching records, ordered from oldest to newest. Each buffer retains at most 500 records. The log buffer also evicts old records based on message size. Both clear when the target process restarts. SQL auto-save is not required, and these tools do not read IDEA's local `~/.debugTools/sql` history files.

| Result | Meaning and action |
| --- | --- |
| `success=true`, `data=[]` | No matching records in the current buffer. Check collection scope, SQL printing, and filters. |
| `LOGS_UNAVAILABLE` | The log request or result parsing failed. Check Agent version, HTTP port, and connection. |
| `SQL_HISTORY_UNAVAILABLE` | The SQL request or result parsing failed. Check Agent version, HTTP port, and SQL capability. |
| `CONNECTION_AMBIGUOUS` | The target is ambiguous. Select `connectionId` from the error's candidates. |
| `NO_CONNECTION` | Establish an active connection first. |

An unavailable capability is not an empty record set. Even a successful query does not prove that all application logs or all database statements were captured.
