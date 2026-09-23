# DebugTools Status MCP

`get_debug_tools_status` returns one diagnostic snapshot for the current IDEA project. It combines project identity, active DebugTools connections, attachable JVMs, attached Java debugger sessions, Spring readiness, and capability probes.

::: tip Read `nextAction` first
Treat this response as the decision point for the next MCP call. Use it to select a connection, attach a JVM, start a run configuration, or wait for Spring readiness before invoking methods.
:::

## Snapshot contents

The response contains `project`, `connections`, `attachableJvms`, `debuggerSessions`, and `nextAction`. The `nextAction` value is one of `INVOKE`, `SELECT_CONNECTION`, `ATTACH_JVM`, `START_RUN_CONFIGURATION`, `SELECT_DEBUGGER_SESSION`, `WAIT_FOR_SPRING`, `RECONNECT`, or `NONE`.

| Area | Purpose |
| --- | --- |
| `project` | Confirms which IDEA project owns the MCP call. |
| `connections` | Identifies an invokable DebugTools target and its `connectionId`. |
| `attachableJvms` | Lists local JVMs that can be attached when no connection exists. |
| `debuggerSessions` | Confirms the Java debugger session and HotSwap capability before reloading. |
| `nextAction` | Gives the most direct next step for the current state. |

## Continue from the state

Use the snapshot as a decision point:

1. `INVOKE` means an active target can be used.
2. `SELECT_CONNECTION` means more than one active connection is available; select by `connectionId`.
3. `ATTACH_JVM` means a local JVM is available for `attach_local_jvm`.
4. `START_RUN_CONFIGURATION` means list configurations first and start only an explicitly selected configuration.
5. `WAIT_FOR_SPRING` means poll the selected connection's `/spring/ready` endpoint before invoking Spring methods.

::: warning A started run configuration is not an active connection
The start request only confirms that IDEA accepted the request. Read the connection status again and wait for the target JVM to establish its DebugTools connection.
:::

## Security boundary

Connection headers are intentionally omitted from this response. Capability values are `AVAILABLE`, `UNAVAILABLE`, `NOT_CONFIGURED`, or `UNKNOWN`; an `UNKNOWN` capability should not be treated as a successful probe.
