# Hotswap MCP

DebugTools IDEA 插件在 `DebugToolsHotswapToolset` 中提供运行配置查询、Hotswap 启动、Java Debugger 热重载、操作查询和 `run_and_invoke` 编排工具。

本页是工具参考手册，只说明每个工具的作用、输入参数和返回值。AI 应该如何选择运行配置、怎样处理自动附着、什么时候触发热重载等组合规则，由 [Hotswap Skill](../skill/hotswap.md) 负责。

## 工具概览

| 工具 | 作用 |
| --- | --- |
| `list_debug_tools_run_configurations` | 查询当前 IDEA 项目中的运行配置，并支持按模块、主类和配置类型筛选。 |
| `execute_debug_tools_run_configuration` | 使用 DebugTools Hotswap executor 启动指定 IDEA 运行配置。 |
| `compile_and_reload_modified_files` | 对已附着的 Java Debugger 会话触发 Compile and Reload Modified Files。 |
| `get_hotswap_operation` | 查询之前提交的热重载操作状态。 |
| `run_and_invoke` | 编排状态检查、可选启动/附着、热重载、方法调用以及可选日志/SQL 验证。 |

## 公共约定

这些工具都支持可选参数 `projectPath`：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | IDEA 项目目录或项目内文件路径。MCP 上下文无法确定项目，或 IDEA 同时打开多个项目时用于指定目标项目。 |

省略 `projectPath` 时，插件会从 IDEA MCP 调用上下文和当前打开的项目中解析目标项目。如果无法确定项目，工具会返回 MCP error。

工具的正常结果以 JSON 文本返回。参数缺失、项目不存在或工具执行异常时，插件可能直接返回 MCP error；可以预期的业务失败会通过返回对象中的 `success=false` 和 `message` 表达。

## 1. 查看 IDEA 运行配置

工具名：`list_debug_tools_run_configurations`

**作用**

读取当前 IDEA 项目 `RunManager` 中的运行配置，并返回配置名称、类型、主类和模块信息。它只查询配置，不会启动应用。

返回列表与 IDEA 原生运行配置列表保持一致，不会预先过滤“不支持 DebugTools Hotswap executor”的配置。是否支持启动由 `execute_debug_tools_run_configuration` 实际检查。

**参数**

没有工具专属的必填参数。

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |
| `moduleName` | 否 | `string` | 模块名称筛选，和返回值中的 `moduleName` 精确匹配。 |
| `mainClassNameContains` | 否 | `string` | 主类名包含筛选，检查 `mainClassName` 是否包含指定文本。 |
| `typeDisplayName` | 否 | `string` | 运行配置类型展示名筛选，精确匹配，例如 `Spring Boot` 或 `Application`。 |

同时提供多个筛选参数时，运行配置必须满足全部条件才会返回。空字符串按未提供处理。

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `count` | `integer` | 筛选后返回的运行配置数量。 |
| `configurations` | `array` | 运行配置摘要列表。 |
| `configurations[].name` | `string` | IDEA 运行配置名称。该名称可传给 `execute_debug_tools_run_configuration.configurationName`。 |
| `configurations[].typeName` | `string` | 运行配置类型名称。 |
| `configurations[].typeDisplayName` | `string` | IDEA 中显示的配置类型名称。 |
| `configurations[].mainClassName` | `string \| null` | 能从该配置读取到的 Java 主类全限定名。 |
| `configurations[].moduleName` | `string \| null` | 运行配置关联的 IDEA 模块名称。 |

请求示例：

```json
{
  "moduleName": "demo-service",
  "mainClassNameContains": "DemoApplication",
  "typeDisplayName": "Spring Boot"
}
```

返回示例：

```json
{
  "count": 1,
  "configurations": [
    {
      "name": "DemoApplication",
      "typeName": "Spring Boot",
      "typeDisplayName": "Spring Boot",
      "mainClassName": "com.example.DemoApplication",
      "moduleName": "demo-service"
    }
  ]
}
```

## 2. 启动运行配置

工具名：`execute_debug_tools_run_configuration`

**作用**

按名称查找 IDEA 运行配置，并使用 DebugTools Hotswap executor 发起启动。这个动作等价于在 IDEA 中选择对应配置并执行 `Hotswap '<configuration>' with DebugTools`。

**参数**

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `configurationName` | 是 | `string` | 要启动的 IDEA 运行配置名称，按完整名称精确匹配。 |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 是否成功把启动请求交给 IDEA 执行系统。 |
| `configurationName` | `string` | 本次请求的运行配置名称。 |
| `executorId` | `string` | 实际使用的 DebugTools executor ID，当前为 `DebugTools Debug Executor`。 |
| `autoAttachEnabled` | `boolean` | DebugTools 全局“自动附着”开关是否启用。 |
| `requiresManualAttach` | `boolean` | 本次启动后是否需要手动附着 DebugTools agent。 |
| `nextAction` | `string \| null` | 给 MCP 客户端的后续动作提示；启动失败时为空。 |
| `expectedMainClassName` | `string \| null` | 从运行配置读取到的预期主类名。 |
| `expectedModuleName` | `string \| null` | 从运行配置读取到的预期模块名。 |
| `message` | `string` | 启动或失败说明。 |
| `availableConfigurationNames` | `string[]` | 找不到指定配置时返回当前项目的可用配置名称；其他结果通常为空数组。 |

`nextAction` 当前可能返回：

| 值 | 含义 |
| --- | --- |
| `LIST_DEBUG_TOOLS_CONNECTIONS` | 自动附着已开启，建议客户端后续查询 DebugTools 连接。 |
| `LIST_ATTACHABLE_JVMS` | 自动附着未开启，建议客户端后续查询可附着 JVM。 |
| `null` | 启动失败，没有后续动作提示。 |

::: warning
`success=true` 只表示 IDEA 已经接受启动请求，不表示 JVM 已启动完成，也不表示 DebugTools 连接已经建立。
:::

请求示例：

```json
{
  "configurationName": "DemoApplication"
}
```

成功返回示例：

```json
{
  "success": true,
  "configurationName": "DemoApplication",
  "executorId": "DebugTools Debug Executor",
  "autoAttachEnabled": true,
  "requiresManualAttach": false,
  "nextAction": "LIST_DEBUG_TOOLS_CONNECTIONS",
  "expectedMainClassName": "com.example.DemoApplication",
  "expectedModuleName": "demo-service",
  "message": "DebugTools run configuration start requested",
  "availableConfigurationNames": []
}
```

找不到运行配置时的返回示例：

```json
{
  "success": false,
  "configurationName": "UnknownApplication",
  "executorId": "DebugTools Debug Executor",
  "autoAttachEnabled": false,
  "requiresManualAttach": false,
  "nextAction": null,
  "expectedMainClassName": null,
  "expectedModuleName": null,
  "message": "Run configuration not found: UnknownApplication",
  "availableConfigurationNames": ["DemoApplication", "DemoTests"]
}
```

配置存在但当前 runner 不支持 DebugTools Hotswap executor，或当前 IDEA 中无法取得该 executor 时，也会返回 `success=false`，具体原因写在 `message` 中。

## 3. 编译并热重载修改类

工具名：`compile_and_reload_modified_files`

**作用**

选择当前项目中已附着的 IDEA Java Debugger 会话，并调用 IDEA Java Debugger 的 `Compile and Reload Modified Files` 能力。

这里的 modified files 是 Java Debugger 从调试会话启动后或上一次 reload 后跟踪到的变更文件和类，不是 Git 工作区中的 modified 文件。

**参数**

没有工具专属的无条件必填参数。

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |
| `sessionName` | 条件必填 | `string` | Java Debugger 会话名称。只有一个可用会话时可省略；存在多个会话时必须指定。 |
| `compileBeforeReload` | 否 | `boolean` | 是否先编译再热重载。省略时使用 IDEA Java Debugger 当前的 `COMPILE_BEFORE_HOTSWAP` 设置。 |
| `waitMillis` | 否 | `integer` | 5.3.0 保留参数；当前不等待编译或重载完成。 |
| `operationId` | 否 | `string` | 保留参数；查询已有操作请使用 `get_hotswap_operation`，不要重复调用本工具。 |

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 是否成功把编译并热重载请求交给 IDEA Java Debugger。 |
| `sessionName` | `string \| null` | 实际选中的调试会话名称；选择失败时可能是请求中传入的名称或空值。 |
| `compileBeforeReload` | `boolean` | 本次请求最终采用的“先编译再重载”设置。 |
| `message` | `string` | 请求结果或失败原因。 |
| `availableSessionNames` | `string[]` | 多会话未指定、指定会话不存在等情况下返回的候选会话名称。 |
| `operationId` | `string \| null` | 用于查询操作的 ID。 |
| `status` | `string` | 请求或操作状态。 |
| `errorCode` | `string \| null` | 可用时返回结构化热重载错误码。 |

::: warning
`success=true` 只表示请求已经提交给 IDEA Java Debugger。后续编译进度、HotSwap 结果和失败详情仍由 IDEA 原生界面或通知展示。
:::

请求示例：

```json
{
  "sessionName": "DemoApplication",
  "compileBeforeReload": true
}
```

成功返回示例：

```json
{
  "success": true,
  "sessionName": "DemoApplication",
  "compileBeforeReload": true,
  "message": "Compile and reload modified files requested",
  "availableSessionNames": [],
  "operationId": "example-operation-id",
  "status": "REQUESTED"
}
```

存在多个调试会话但没有指定 `sessionName` 时的返回示例：

```json
{
  "success": false,
  "sessionName": null,
  "compileBeforeReload": true,
  "message": "Multiple attached Java debugger sessions are available; pass sessionName to choose one",
  "availableSessionNames": ["DemoApplication", "WorkerApplication"]
}
```

当前项目没有已附着的 Java Debugger 会话时，返回 `success=false`，`message` 为 `No attached Java debugger session is available for hotswap`。

## 4. 查询热重载操作 {#operation-query}

工具名：`get_hotswap_operation`。

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `operationId` | 是 | `string` | `compile_and_reload_modified_files` 成功返回的操作 ID。 |

```json
{
  "operationId": "example-operation-id"
}
```

查询结果使用结构化包装，`data` 是保存的热重载请求结果，包含 `sessionName`、`compileBeforeReload`、`operationId`、`status` 等字段。操作不存在时返回 `HOTSWAP_OPERATION_NOT_FOUND`。

::: warning 5.3.0 的反馈范围
当前实现提交请求后记录 `status=REQUESTED`，尚未接入 IDEA 编译与重载完成回调。查询会返回这个请求记录，不会自动推进为 `SUCCESS` 或 `FAILED`。`changedFiles`、`compiledClasses`、`reloadedClasses`、`skippedClasses` 和 `classResults` 当前为空。

`waitMillis` 不能用于确认类已重载，`operationId` 也不能证明编译完成。最终结果仍需查看 IDEA HotSwap UI/通知，并通过业务调用验证。
:::

## 5. 编排启动与方法调用

工具名：`run_and_invoke`。按需启动或附着目标，再提交热重载请求并调用 Java 方法。工具可追加最近日志和 SQL 查询。

### 参数

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `className` | 是 | `string` | 目标 Java 类全限定名。 |
| `methodName` | 是 | `string` | 方法名。 |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径。 |
| `connectionId` | 条件必填 | `string` | 方法调用目标；多活跃连接时必须明确指定。 |
| `sessionName` | 条件必填 | `string` | 热重载的 Java 调试会话；多会话时必须指定，并确认和方法调用属于同一 JVM。 |
| `compileBeforeReload` | 否 | `boolean` | 是否先编译，省略时使用 IDEA Java Debugger 设置。 |
| `waitMillis` | 否 | `integer` | 启动/附着后等待连接的时间，默认 `30000`，限制在 `0` 到 `120000` 毫秒；不等待 HotSwap 完成。 |
| `parameterTypes` | 否 | `string[]` | 方法参数类型，按声明顺序排列。 |
| `argsJson` | 否 | `string` | DebugTools 参数 JSON 字符串。 |
| `resultView` | 否 | `string` | `TO_STRING`、`JSON`、`DEBUG` 或 `NONE`。 |
| `methodAroundName` | 否 | `string` | 已保存前后置脚本名，不含 `.java`。 |
| `methodAroundContent` | 否 | `string` | 显式 Method Around Java 源码。 |
| `methodAroundContentIdentity` | 否 | `string` | 源码内容标识。 |
| `allowStart` | 否 | `boolean` | 没有活跃连接时允许启动配置，默认不启动。 |
| `runConfigurationName` | 条件必填 | `string` | `allowStart=true` 且需要启动时，提供准确的 IDEA 运行配置名。 |
| `allowAttach` | 否 | `boolean` | 没有活跃连接时允许附着指定进程，默认不附着。 |
| `pid` | 条件必填 | `string` | `allowAttach=true` 且需要附着时，提供明确 PID。 |
| `verifyLogs` | 否 | `boolean` | 调用后追加最近日志查询，固定最多 100 条。 |
| `verifySql` | 否 | `boolean` | 调用后追加最近 SQL 查询，固定最多 50 条。 |

有活跃连接时不会启动或附着新目标。没有活跃连接且两个开关都为 `true` 时，先尝试附着；附着失败会直接返回，不会转而启动配置。建议每次只选择一种方式。

### 请求示例

已有连接与 Java 调试会话时：

```json
{
  "connectionId": "demo-connection",
  "sessionName": "DemoApplication",
  "className": "com.example.HealthService",
  "methodName": "status",
  "parameterTypes": [],
  "argsJson": "{}",
  "compileBeforeReload": true,
  "resultView": "JSON"
}
```

没有连接、需要启动明确的运行配置时：

```json
{
  "allowStart": true,
  "runConfigurationName": "DemoApplication",
  "waitMillis": 30000,
  "className": "com.example.HealthService",
  "methodName": "status",
  "argsJson": "{}"
}
```

启动后需要 DebugTools 自动附着建立连接；自动附着关闭时建议分步启动、选 PID 并附着。`allowAttach` 只附着 DebugTools Agent，不会建立 Java Debugger 会话，因此仍需事先连接调试器。

### 返回值与使用限制

正常工具结果使用结构化包装；顶层 `success=true` 表示得到编排结果，流程是否成功需要读取 `data.success`：

| `data` 字段 | 说明 |
| --- | --- |
| `success` | 编排的业务结果。完成调用后取方法调用成功状态。 |
| `steps` | 步骤摘要，包含 `name`、`status`、`message`。 |
| `invokeResult` | 方法调用结果，包括额外结果获取状态。 |
| `hotswap` | 提交给 IDEA 的热重载请求结果。 |
| `error` | 启动或附着等流程失败说明。 |
| `logs`、`sql` | 开启对应查询时的最近记录；没有取得结果时为空。 |

5.3.0 的 `steps` 不是完整审计记录：启动或附着成功后不单独保留步骤，失败时才返回对应失败步骤。热重载提交成功后就会进入方法调用，因此调用可能发生在实际重载完成前。

`verifyLogs` 和 `verifySql` 查询当前项目枚举到的首个活跃连接，没有按 `connectionId` 绑定，也没有按调用时间过滤；查询失败返回空值，不改变方法调用的成功状态。多个活跃连接时，请关闭这两个选项，使用独立日志/SQL 工具并指定 `connectionId`、时间和过滤条件。

需要严格验证新代码已经生效时，按[MCP 工作流](./workflow.md)分步执行，在 IDEA 确认 HotSwap 完成后再调用方法。
