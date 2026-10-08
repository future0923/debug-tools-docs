# DebugTools MCP Workflow

5.3.0 provides status, search, method invocation, HotSwap, logs, and SQL tools that can be combined to verify results after editing code. HotSwap tools currently report submission only. Confirm compilation and reloading in IDEA before using an invocation result as evidence that new code took effect.

## Identify the Project and Target

1. Call `get_debug_tools_status`. Provide `projectPath` when several projects are open.
2. Select an active `connectionId`. If none exists, select an explicit PID from `list_attachable_jvms` and attach, or select and start an exact run configuration.
3. Wait for the connection. For Spring Bean calls, also confirm `/spring/ready`. Resolve HTTP connectivity issues first.
4. Before hot reload, confirm IDEA Java Debugger is connected to the same JVM. Provide `sessionName` when several sessions exist.

The DebugTools Agent connection handles method invocation. The Java Debugger connection handles HotSwap and breakpoints. They are separate connections.

## Locate the Method and Prepare Arguments

If the class and method are known, call `generate_method_args_template` directly. If only the HTTP path is known, use `search_http_url` to locate the Controller, then confirm the method signature and overloaded parameter types.

Fill the template's `content` values and preserve declaration order. To reuse a saved pre/post script, get its name from `list_method_around_scripts`, inspect it with `get_method_around_script` if needed, and pass the name as `methodAroundName`.

## Verify After Hot Reload

1. Call `compile_and_reload_modified_files` for an explicit Java debugger session.
2. Retain `operationId`. `get_hotswap_operation` currently returns a request record without confirming final completion.
3. Confirm successful compilation and class replacement in IDEA's HotSwap UI or notifications.
4. Call the target method with `invoke_java_method`, selecting `resultView` as needed.
5. Query records after the invocation using `read_target_application_logs` or `get_last_sql_statements`. Provide the target connection explicitly and narrow the result with `since` and keywords.

Assess result fetch failure separately from method execution failure. Logs cover DebugTools records only; SQL covers statements printed by DebugTools and not filtered out. An empty array does not mean the complete business flow produced no logs or SQL.

## Use run_and_invoke

When no active connection exists, `run_and_invoke` can explicitly start an exact run configuration or attach a specified PID, then submit hot reload and invoke a method. See [Hotswap MCP](./hotswap.md) for parameters and return fields.

Use it when there is one clear target and immediate invocation after submitting hot reload is acceptable. It does not wait for HotSwap completion or automatically verify that the Java debugger session and method connection refer to the same JVM.

For multiple connections or strict verification of new code, use the separate steps above. Orchestrated log/SQL queries read the first active connection without filtering by invocation time, so they are not direct evidence for this invocation on a specified connection.

## Recover from Failure

New query tools usually return failures with `error.code`, `hint`, `availableOptions`, `retryable`, and `nextAction`. Method invocation still primarily uses `success` and `throwable`. HotSwap uses `errorCode`, `message`, and candidate session lists.

Select an ID or session again if the target is ambiguous. Reconnect if inactive. List scripts again if one is missing. Resolve compilation errors reported by IDEA first. Do not treat submission success, empty records, or unknown capabilities as a passed verification.
