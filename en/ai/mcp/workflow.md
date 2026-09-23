# DebugTools MCP Closed Loop

For a repeatable edit-and-verify task, use this sequence:

1. Call `get_debug_tools_status` and inspect `nextAction`.
2. Select exactly one connection or debugger session. Multiple candidates require an explicit id or name.
3. If there is no target, use `run_and_invoke` only with an exact `runConfigurationName` and `allowStart=true`, or an explicit `pid` and `allowAttach=true`.
4. Reload modified classes with `compile_and_reload_modified_files` and retain `operationId` after a timeout.
5. Invoke with `resultView=TO_STRING`, `JSON`, `DEBUG`, or `NONE` as needed.
6. Use `read_target_application_logs` and `get_last_sql_statements` with bounded filters when verification is requested.
7. Follow structured `error.code`, `availableOptions`, `retryable`, and `nextAction` values for recovery.

`run_and_invoke` returns separate step statuses for status, start/attach, HotSwap, invocation, logs, and SQL. It does not guess a JVM or run configuration from a fuzzy name.
