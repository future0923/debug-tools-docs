# DebugTools MCP 闭环

对于需要“改完代码马上验证”的任务，可以按以下顺序执行：

1. 调用 `get_debug_tools_status`，读取 `nextAction`。
2. 明确选择一个连接或调试会话；存在多个候选时必须传 ID 或名称。
3. 没有目标时，只有在传入精确 `runConfigurationName` 并设置 `allowStart=true`，或传入明确 `pid` 并设置 `allowAttach=true` 时，才能使用 `run_and_invoke` 启动/附着。
4. 使用 `compile_and_reload_modified_files` 热重载修改类；超时后保留 `operationId`。
5. 按需求使用 `resultView=TO_STRING`、`JSON`、`DEBUG` 或 `NONE` 调用方法。
6. 需要验证时，使用带条数和过滤条件的 `read_target_application_logs`、`get_last_sql_statements`。
7. 根据结构化错误中的 `error.code`、`availableOptions`、`retryable` 和 `nextAction` 恢复。

`run_and_invoke` 会分别返回状态、启动/附着、热重载、调用、日志和 SQL 步骤。它不会根据模糊名称猜测 JVM 或运行配置。
