# 方法调用 MCP

DebugTools IDEA 插件在 `DebugToolsMethodInvocationToolset` 中提供 5 个 MCP 工具，分别负责查询连接、查询可附着 JVM、附着 JVM、生成方法参数模板和调用 Java 方法。

本页是工具参考手册，只说明每个工具的作用、输入参数和返回值。AI 应该在什么条件下选择工具、工具之间如何组合、失败后如何恢复，由 [方法调用 Skill](../skill/method-invocation.md) 负责。

## 工具概览

| 工具 | 作用 |
| --- | --- |
| `list_debug_tools_connections` | 查询当前 IDEA 项目已经建立的 DebugTools 连接。 |
| `list_attachable_jvms` | 查询当前 IDEA 项目可以附着的本地 JVM。 |
| `attach_local_jvm` | 向指定本地 JVM 加载 DebugTools agent，并可等待连接建立。 |
| `generate_method_args_template` | 根据 IDEA 项目中的 Java 方法签名生成 DebugTools `argsJson` 参数模板。 |
| `invoke_java_method` | 通过指定 DebugTools 连接调用目标 JVM 中的 Java 方法。 |

## 公共约定

5 个工具都支持可选参数 `projectPath`：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `projectPath` | 否 | `string` | IDEA 项目目录或项目内文件路径。MCP 上下文无法确定项目，或 IDEA 同时打开多个项目时用于指定目标项目。 |

省略 `projectPath` 时，插件会从 IDEA MCP 调用上下文和当前打开的项目中解析目标项目。如果无法确定项目，工具会返回 MCP error。

工具的正常结果以 JSON 文本返回。参数缺失、项目不存在或工具执行异常时，插件可能直接返回 MCP error；部分工具还会在正常 JSON 结构中通过 `success=false` 和错误字段表达业务失败。

## 1. 查看 DebugTools 连接

工具名：`list_debug_tools_connections`

**作用**

读取当前 IDEA 项目的 DebugTools 连接快照。它只查询连接，不会附着 JVM、切换连接或发起方法调用。

**参数**

没有工具专属的必填参数，只支持公共可选参数 `projectPath`。

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `count` | `integer` | 当前项目的连接数量。 |
| `connections` | `array` | DebugTools 连接列表。 |
| `connections[].connectionId` | `string` | 连接唯一标识，可传给 `invoke_java_method.connectionId`。 |
| `connections[].applicationName` | `string` | 目标应用名称。 |
| `connections[].pid` | `string \| null` | 目标 JVM 进程 ID；远程连接等场景可能为空。 |
| `connections[].source` | `string` | 连接来源类型，当前为 `LOCAL` 或 `REMOTE`。 |
| `connections[].host` | `string` | DebugTools agent 所在主机。 |
| `connections[].port` | `integer` | DebugTools socket 端口。 |
| `connections[].httpPort` | `integer \| null` | DebugTools HTTP 端口；未提供 HTTP 能力时为空。 |
| `connections[].remark` | `string \| null` | 连接备注。 |
| `connections[].state` | `string` | 当前连接状态，例如 `CONNECTING`、`CONNECTED`、`RECONNECTING` 或 `DISCONNECTED`。 |
| `connections[].active` | `boolean` | 连接是否处于可用状态。 |
| `connections[].defaultClassLoader` | `object \| null` | 当前连接选中的默认 ClassLoader。 |
| `connections[].defaultClassLoader.name` | `string` | 默认 ClassLoader 名称。 |
| `connections[].defaultClassLoader.identity` | `string` | 默认 ClassLoader 标识。 |
| `connections[].headers` | `object` | 当前连接保存的 Header。 |
| `connections[].printSqlType` | `string \| null` | 当前连接的 SQL 打印模式。 |

返回示例：

```json
{
  "count": 1,
  "connections": [
    {
      "connectionId": "demo-connection",
      "applicationName": "DemoApplication",
      "pid": "42135",
      "source": "LOCAL",
      "host": "127.0.0.1",
      "port": 12345,
      "httpPort": 22222,
      "remark": null,
      "state": "CONNECTED",
      "active": true,
      "defaultClassLoader": {
        "name": "org.springframework.boot.loader.launch.LaunchedClassLoader",
        "identity": "12345678"
      },
      "headers": {},
      "printSqlType": null
    }
  ]
}
```

## 2. 查看可附着 JVM

工具名：`list_attachable_jvms`

**作用**

复用 DebugTools IDEA 附着窗口的 JVM 枚举逻辑，列出当前项目可附着的本地 Java 进程。它只返回候选 JVM，不会执行附着。

**参数**

没有工具专属的必填参数，只支持公共可选参数 `projectPath`。

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `count` | `integer` | 可附着 JVM 数量。 |
| `jvms` | `array` | 可附着 JVM 列表。 |
| `jvms[].pid` | `string` | JVM 进程 ID。 |
| `jvms[].displayName` | `string` | 用于展示和识别进程的名称。 |
| `jvms[].attachName` | `string` | DebugTools 实际执行附着时使用的应用名。 |
| `jvms[].configurationName` | `string \| null` | 关联的 IDEA 运行配置名称。 |
| `jvms[].moduleName` | `string \| null` | 关联的 IDEA 模块名称。 |
| `jvms[].projectName` | `string \| null` | 关联的 IDEA 项目名称。 |

返回示例：

```json
{
  "count": 1,
  "jvms": [
    {
      "pid": "42135",
      "displayName": "com.example.DemoApplication",
      "attachName": "DemoApplication",
      "configurationName": "DemoApplication",
      "moduleName": "demo-service",
      "projectName": "demo"
    }
  ]
}
```

## 3. 附着本地 JVM

工具名：`attach_local_jvm`

**作用**

向指定本地 JVM 加载 DebugTools agent，触发与 IDEA 插件相同的本地附着逻辑。工具可以只提交附着请求，也可以在指定时间内等待 DebugTools 连接建立。

**参数**

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `pid` | 是 | `string` | 目标 JVM 进程 ID。 |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |
| `attachName` | 否 | `string` | 附着使用的应用名。省略时，插件会按 `pid` 从当前可附着 JVM 列表中解析。 |
| `waitForConnectionMillis` | 否 | `integer` | 附着后等待连接建立的最长时间，单位毫秒。大于 `0` 时每 100 毫秒检查一次连接。 |

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 是否成功触发附着流程。 |
| `pid` | `string` | 实际附着的 JVM 进程 ID。 |
| `attachName` | `string \| null` | 实际使用的应用名。 |
| `message` | `string` | 结果说明，例如 `Attach requested` 或 `Attach requested and connection established`。 |
| `connectionId` | `string \| null` | 等待期间建立的 DebugTools 连接 ID。未等待或等待期间未建立连接时为空。 |
| `host` | `string \| null` | 新连接的主机。 |
| `port` | `integer \| null` | 新连接的 DebugTools socket 端口。 |
| `httpPort` | `integer \| null` | 新连接的 DebugTools HTTP 端口。 |

::: warning
`success=true` 只保证附着流程已经成功触发。只有返回了 `connectionId`，才能说明在 `waitForConnectionMillis` 指定的时间内检测到了 DebugTools 连接。
:::

请求示例：

```json
{
  "pid": "42135",
  "waitForConnectionMillis": 10000
}
```

返回示例：

```json
{
  "success": true,
  "pid": "42135",
  "attachName": "DemoApplication",
  "message": "Attach requested and connection established",
  "connectionId": "demo-connection",
  "host": "127.0.0.1",
  "port": 12345,
  "httpPort": 22222
}
```

## 4. 生成方法参数模板

工具名：`generate_method_args_template`

**作用**

读取 IDEA 项目中的 Java PSI，根据目标方法签名生成与 DebugTools 方法调用页面相同的 `argsJson` 模板。它只读取项目源码并生成 JSON，不会连接 JVM，也不会调用目标方法。

**参数**

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `className` | 是 | `string` | 声明目标方法的 Java 类全限定名。 |
| `methodName` | 是 | `string` | 目标方法名。 |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |
| `parameterTypes` | 否 | `string[]` | 方法参数类型，按声明顺序排列。存在重载方法时用于选择准确签名，建议使用全限定名。 |
| `genParamType` | 否 | `string` | 参数模板展开模式，可选 `SIMPLE`、`CURRENT`、`ALL`。省略时使用 DebugTools 全局默认值。 |

`genParamType` 的含义：

| 值 | 说明 |
| --- | --- |
| `SIMPLE` | 对象参数只生成对象外壳，不继续展开字段。 |
| `CURRENT` | 展开当前类直接声明的字段。 |
| `ALL` | 展开当前类及其继承得到的字段。 |

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 是否成功找到方法并生成模板。 |
| `className` | `string \| null` | 请求中的目标类名。 |
| `methodName` | `string \| null` | 请求中的目标方法名。 |
| `parameterNames` | `string[]` | 从 Java 方法声明读取的参数名，保持声明顺序。 |
| `parameterTypes` | `string[]` | 最终选中方法的参数类型，保持声明顺序。 |
| `argsJson` | `string` | 生成的 DebugTools 参数 JSON 字符串。失败时为 `{}`。 |
| `genParamType` | `string \| null` | 实际使用的模板展开模式。 |
| `errorMessage` | `string \| null` | 失败原因；成功时为空。 |

请求示例：

```json
{
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterTypes": ["java.lang.Long"],
  "genParamType": "CURRENT"
}
```

返回示例：

```json
{
  "success": true,
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterNames": ["id"],
  "parameterTypes": ["java.lang.Long"],
  "argsJson": "{\"id\":{\"type\":\"simple\",\"content\":\"\"}}",
  "genParamType": "CURRENT",
  "errorMessage": null
}
```

如果同一个类中存在多个同名方法但没有提供 `parameterTypes`，工具会返回 `success=false`，并在 `errorMessage` 中提示指定重载签名。

## 5. 调用 Java 方法

工具名：`invoke_java_method`

**作用**

把 MCP 参数转换为 DebugTools 原有的 `RunDTO` 请求，通过已建立的 DebugTools socket 连接发送到目标 JVM，并等待方法执行结果。

**参数**

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `className` | 是 | `string` | 目标类全限定名。 |
| `methodName` | 是 | `string` | 目标方法名。 |
| `projectPath` | 否 | `string` | 目标 IDEA 项目路径，含义见“公共约定”。 |
| `connectionId` | 否 | `string` | 目标 DebugTools 连接 ID。省略时，当前项目必须只有一个活跃连接。 |
| `parameterTypes` | 否 | `string[]` | 目标方法参数类型，按声明顺序排列；用于确定重载方法。 |
| `argsJson` | 否 | `string` | DebugTools 方法参数 JSON 字符串。无参方法可省略或传 `{}`。 |
| `headers` | 否 | `object` | 本次调用的 Header，键和值都按字符串处理。优先级高于连接 Header 和全局 Header。 |
| `xxlJobParam` | 否 | `string` | 传入目标调用上下文的 XXL-JOB 参数。 |
| `traceMethodDTO` | 否 | `object` | 方法链路、MyBatis 和 SQL 等 Trace 配置。 |
| `methodAroundContent` | 否 | `string` | 在目标方法前后执行的 Method Around Java 源码内容。 |
| `methodAroundContentIdentity` | 否 | `string` | Method Around 内容标识。省略但提供了内容时，插件使用内容 MD5。 |
| `classLoaderIdentity` | 否 | `string` | 目标 ClassLoader 标识。省略时使用连接当前选中的默认 ClassLoader。 |
| `timeoutMillis` | 否 | `integer` | 等待目标 JVM 响应的超时时间，单位毫秒，默认 `30000`。小于 `1` 时按 `1` 处理。 |

省略 `connectionId` 时，如果项目没有活跃连接，返回 `No active DebugTools connection found`；如果存在多个活跃连接，返回错误并列出可选的 `connectionId`。

`traceMethodDTO` 支持的字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `traceMethod` | `boolean` | 是否启用方法链路追踪。 |
| `traceMaxDepth` | `integer` | 最大追踪深度。 |
| `traceMyBatis` | `boolean` | 是否追踪 MyBatis 调用。 |
| `traceSQL` | `boolean` | 是否追踪 SQL。 |
| `traceSkipStartGetSetCheckBox` | `boolean` | 是否跳过 getter、setter 风格方法。 |
| `traceBusinessPackageRegexp` | `string` | 需要追踪的业务包前缀或正则。 |
| `traceIgnorePackageRegexp` | `string` | 需要忽略的包前缀或正则。 |

### argsJson 格式

`argsJson` 是一个 JSON 字符串。字符串解析后的根对象中，每个字段对应一个 Java 方法参数；字段值使用 DebugTools `RunContentDTO` 结构。

```json
{
  "id": {
    "type": "simple",
    "content": "10001"
  },
  "query": {
    "type": "json_entity",
    "content": "{\"keyword\":\"debug-tools\"}"
  }
}
```

参数字段应保持 Java 方法声明顺序。能够取得真实参数名时使用真实名称；无法取得时可以使用 `arg0`、`arg1` 等有序名称。支持的常用 `type` 包括 `simple`、`json_entity`、`enum`、`bean`、`lambda`、`request`、`response`、`file` 和 `class`。

**返回值**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 方法是否执行成功。目标方法抛异常或插件侧调用失败时为 `false`。 |
| `applicationName` | `string \| null` | 返回结果的目标应用名称。 |
| `className` | `string \| null` | 实际调用的目标类名。 |
| `methodName` | `string \| null` | 实际调用的目标方法名。 |
| `parameterTypes` | `string[]` | 实际调用的方法参数类型。 |
| `resultClassType` | `string \| null` | 结果分类，常见值为 `VOID`、`NULL`、`SIMPLE`、`OBJECT`。 |
| `result` | `string \| null` | 目标方法返回值的 ToString 展示文本。 |
| `throwable` | `string \| null` | 目标方法异常或插件侧失败原因。 |
| `offsetPath` | `string \| null` | 普通结果在 DebugTools 结果存储中的偏移路径。 |
| `traceOffsetPath` | `string \| null` | Trace 结果在 DebugTools 结果存储中的偏移路径。 |
| `durationMillis` | `integer \| null` | 目标方法执行耗时，单位毫秒。 |

请求示例：

```json
{
  "connectionId": "demo-connection",
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterTypes": ["java.lang.Long"],
  "argsJson": "{\"id\":{\"type\":\"simple\",\"content\":\"10001\"}}",
  "timeoutMillis": 30000
}
```

成功返回示例：

```json
{
  "success": true,
  "applicationName": "DemoApplication",
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterTypes": ["java.lang.Long"],
  "resultClassType": "OBJECT",
  "result": "User(id=10001, name=DebugTools)",
  "throwable": null,
  "offsetPath": "123456789012345",
  "traceOffsetPath": null,
  "durationMillis": 18
}
```

失败返回示例：

```json
{
  "success": false,
  "applicationName": "DemoApplication",
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterTypes": ["java.lang.Long"],
  "resultClassType": "OBJECT",
  "result": null,
  "throwable": "java.lang.IllegalArgumentException: user not found",
  "offsetPath": "987654321098765",
  "traceOffsetPath": null,
  "durationMillis": 3
}
```
