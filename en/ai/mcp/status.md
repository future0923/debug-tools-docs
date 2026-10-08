# DebugTools Status MCP

`get_debug_tools_status` returns an IDEA project diagnostic snapshot combining the project, DebugTools connections, attachable JVMs, Java debugger sessions, and HTTP probes. Available from 5.3.0, it does not start applications, attach processes, or invoke business methods.

## Parameters and Result

There are no required parameters. Optional `projectPath` specifies an IDEA project directory or a file within it. Provide it when several projects are open.

```json
{
  "projectPath": "/path/to/demo"
}
```

Normal results use a wrapper containing `success`, `data`, `error`, `requestId`, and `timestamp`. The snapshot is in `data`:

| Field | Purpose |
| --- | --- |
| `project.name`, `project.path` | Confirm which IDEA project owns the MCP call. |
| `connections` | Connection IDs, application names, PIDs, addresses, sources, connection states, and availability. |
| `connections[].springReady` | Whether this HTTP probe of `/spring/ready` succeeded. |
| `connections[].httpProbe` | Whether this probe of the Agent root HTTP endpoint succeeded. |
| `connections[].capabilities` | Hints for method invocation, ClassLoader queries, result fetching, logs, and SQL. |
| `attachableJvms` | Local JVM PIDs, display names, run configuration names, and module names. |
| `debuggerSessions` | Attached Java debugger session names, process information, and HotSwap hints. |
| `nextAction` | A suggested next step based on this snapshot. |

An unresolved project returns `NO_PROJECT`. An aggregation error returns `INTERNAL_ERROR`.

## Continue from the State

| `nextAction` | Next step |
| --- | --- |
| `INVOKE` | An active target exists. Generate arguments and invoke the method. |
| `SELECT_CONNECTION` | Several active connections exist. Select an explicit `connectionId`. |
| `WAIT_FOR_SPRING` | Check Agent HTTP availability and wait for Spring readiness before invoking a Spring Bean. |
| `SELECT_DEBUGGER_SESSION` | Select an explicit Java debugger session name before hot reload. |
| `ATTACH_JVM` | Select a PID from `attachableJvms`, then call `attach_local_jvm`. |
| `START_RUN_CONFIGURATION` | List run configurations and start an explicitly selected configuration. |

A successful startup response only means IDEA accepted the request. Confirm that the DebugTools connection is established afterward.

## Interpret Probe Results

`springReady=false` means this `/spring/ready` HTTP probe did not succeed. Spring may not be ready, or the port may be unreachable. Do not wait indefinitely on this hint for a non-Spring application.

In 5.3.0, `invokeJavaMethod` returns `AVAILABLE` or `UNAVAILABLE` based on socket activity. `classLoaderQuery` and `resultFetch` return `AVAILABLE` or `UNKNOWN` based on the `/getApplicationName` probe. These hints do not guarantee that business class loading, Bean lookup, or result fetching will succeed.

`logs` and `sql` currently return `UNKNOWN`. Call the [logs and SQL tools](./observability.md) to confirm availability. `debuggerSessions[].hotSwap=AVAILABLE` indicates an attached session was found; it does not guarantee that the JDK supports every class structure change.

This snapshot omits connection Headers. Use `list_debug_tools_connections` when you need complete connection configuration.
