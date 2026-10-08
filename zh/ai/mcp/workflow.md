# DebugTools MCP 工作流

5.3.0 提供状态、搜索、方法调用、HotSwap、日志和 SQL 工具，可以组合成“修改代码后验证结果”的流程。HotSwap 工具当前只返回提交状态，需要在 IDEA 中确认实际编译与重载完成，再把调用结果作为新代码的验证依据。

## 先明确项目与目标

1. 调用 `get_debug_tools_status`，同时打开多个项目时提供 `projectPath`。
2. 选择一个活跃 `connectionId`；没有连接时，从 `list_attachable_jvms` 选择明确 PID 后附着，或从运行配置列表选择准确配置后启动。
3. 等待连接可用；Spring Bean 调用还要确认 `/spring/ready`，HTTP 不可达时先处理连接问题。
4. 需要热重载时，确认 IDEA Java Debugger 已连接同一个 JVM；多个会话提供 `sessionName`。

DebugTools Agent 连接负责方法调用，Java Debugger 连接负责 HotSwap 和断点，它们是不同连接。

## 定位方法并准备参数

已知类和方法时，直接调用 `generate_method_args_template`。只知道接口路径时，先使用 `search_http_url` 找到 Controller，再确认方法签名和重载参数类型。

在模板的 `content` 中填入参数值，保持声明顺序。需要已保存的前后置脚本时，先用 `list_method_around_scripts` 获取名称，按需用 `get_method_around_script` 查看内容，再把名称传给 `methodAroundName`。

## 热重载后验证

1. 对明确的 Java 调试会话调用 `compile_and_reload_modified_files`。
2. 保存返回的 `operationId`。`get_hotswap_operation` 当前只返回请求记录，不能确认最终完成。
3. 在 IDEA HotSwap UI/通知中确认编译和类替换成功。
4. 用 `invoke_java_method` 调用目标方法，根据需要设置 `resultView`。
5. 使用 `read_target_application_logs` 或 `get_last_sql_statements` 查询调用后的记录，显式提供目标连接，并用 `since` 和关键字缩小范围。

方法结果获取失败与方法执行失败分别判断。日志范围限于 DebugTools 自身记录，SQL 范围限于已开启 SQL 打印且未被过滤的语句；空数组不代表完整业务过程没有日志或 SQL。

## 使用 run_and_invoke

`run_and_invoke` 可以在没有活跃连接时显式启动准确的运行配置，或附着指定 PID，然后提交热重载并调用方法。参数和返回字段见 [Hotswap MCP](./hotswap.md)。

适合只有一个明确目标、且能够接受热重载提交后立即调用的场景。当前工具不等待 HotSwap 完成，也不自动校验 Java 调试会话和方法连接属于同一 JVM。

多个连接或需要严格验证新代码时，优先按上述分步流程操作。编排中的日志/SQL 读取首个活跃连接且不按调用时间过滤，不能直接作为指定连接本次调用的证据。

## 失败后继续

新查询工具的失败结果通常含 `error.code`、`hint`、`availableOptions`、`retryable` 和 `nextAction`。方法调用仍主要通过 `success`、`throwable` 表达失败；HotSwap 通过 `errorCode`、`message` 和候选会话列表表达失败。

目标不明确时重新选择 ID 或会话；连接不可用时重新建立连接；脚本不存在时重新列出脚本；编译失败时先修复 IDEA 报告的错误。不要把请求提交成功、空记录或未知能力当作验证通过。
