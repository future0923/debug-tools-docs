# Method Invocation MCP

The DebugTools IDEA plugin provides five MCP tools in `DebugToolsMethodInvocationToolset`. They inspect connections, list attachable JVMs, attach to a JVM, generate method argument templates, and invoke Java methods.

This page is a tool reference and covers only each tool's purpose, input parameters, and return values. The [Method Invocation Skill](../skill/method-invocation.md) defines when an AI should use each tool, how to combine them, and how to recover from failures.

## Tool Overview

| Tool | Purpose |
| --- | --- |
| `list_debug_tools_connections` | Lists established DebugTools connections for the current IDEA project. |
| `list_attachable_jvms` | Lists local JVMs that the current IDEA project can attach to. |
| `attach_local_jvm` | Loads the DebugTools agent into a specified local JVM and can wait for a connection. |
| `generate_method_args_template` | Generates a DebugTools `argsJson` template from a Java method signature in the IDEA project. |
| `invoke_java_method` | Invokes a Java method in the target JVM through a specified DebugTools connection. |

## Common Conventions

All five tools support an optional `projectPath` parameter:

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | An IDEA project directory or a file path inside the project. Use it to identify the target when the MCP context is ambiguous or IDEA has multiple projects open. |

When `projectPath` is omitted, the plugin resolves the target from the IDEA MCP call context and open projects. If it cannot identify a project, the tool returns an MCP error.

Normal results are returned as JSON text. Missing parameters, nonexistent projects, or unexpected execution failures may return an MCP error directly. Some tools represent expected business failures with `success=false` and an error field in an otherwise valid JSON result.

## 1. List DebugTools Connections

Tool name: `list_debug_tools_connections`

**Purpose**

Reads a snapshot of DebugTools connections for the current IDEA project. It only queries connections and does not attach to a JVM, switch connections, or invoke a method.

**Parameters**

There are no tool-specific required parameters. Only the common optional `projectPath` parameter is supported.

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `count` | `integer` | Number of connections in the current project. |
| `connections` | `array` | DebugTools connections. |
| `connections[].connectionId` | `string` | Unique connection ID. Pass it to `invoke_java_method.connectionId`. |
| `connections[].applicationName` | `string` | Target application name. |
| `connections[].pid` | `string \| null` | Target JVM process ID; may be null for remote connections. |
| `connections[].source` | `string` | Connection source, currently `LOCAL` or `REMOTE`. |
| `connections[].host` | `string` | Host running the DebugTools agent. |
| `connections[].port` | `integer` | DebugTools socket port. |
| `connections[].httpPort` | `integer \| null` | DebugTools HTTP port; null when HTTP capabilities are unavailable. |
| `connections[].remark` | `string \| null` | Connection remark. |
| `connections[].state` | `string` | Current state, such as `CONNECTING`, `CONNECTED`, `RECONNECTING`, or `DISCONNECTED`. |
| `connections[].active` | `boolean` | Whether the connection is active and available. |
| `connections[].defaultClassLoader` | `object \| null` | Default ClassLoader selected for the connection. |
| `connections[].defaultClassLoader.name` | `string` | Default ClassLoader name. |
| `connections[].defaultClassLoader.identity` | `string` | Default ClassLoader identity. |
| `connections[].headers` | `object` | Headers stored by the current connection. |
| `connections[].printSqlType` | `string \| null` | SQL printing mode for the current connection. |

Response example:

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

## 2. List Attachable JVMs

Tool name: `list_attachable_jvms`

**Purpose**

Reuses the JVM discovery logic from the DebugTools IDEA attach dialog to list local Java processes that the current project can attach to. It only returns candidate JVMs and does not attach to them.

**Parameters**

There are no tool-specific required parameters. Only the common optional `projectPath` parameter is supported.

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `count` | `integer` | Number of attachable JVMs. |
| `jvms` | `array` | Attachable JVMs. |
| `jvms[].pid` | `string` | JVM process ID. |
| `jvms[].displayName` | `string` | Name used to display and identify the process. |
| `jvms[].attachName` | `string` | Application name used by DebugTools when attaching. |
| `jvms[].configurationName` | `string \| null` | Associated IDEA run configuration name. |
| `jvms[].moduleName` | `string \| null` | Associated IDEA module name. |
| `jvms[].projectName` | `string \| null` | Associated IDEA project name. |

Response example:

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

## 3. Attach to a Local JVM

Tool name: `attach_local_jvm`

**Purpose**

Loads the DebugTools agent into a specified local JVM using the same local attach flow as the IDEA plugin. The tool can either submit the attach request only or wait for a DebugTools connection for a specified duration.

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `pid` | Yes | `string` | Target JVM process ID. |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |
| `attachName` | No | `string` | Application name used for attachment. When omitted, the plugin resolves it by `pid` from the current attachable JVM list. |
| `waitForConnectionMillis` | No | `integer` | Maximum time to wait for a connection after attachment, in milliseconds. Values greater than `0` poll every 100 milliseconds. |

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Whether the attach flow was triggered successfully. |
| `pid` | `string` | JVM process ID used for attachment. |
| `attachName` | `string \| null` | Application name used for attachment. |
| `message` | `string` | Result message, such as `Attach requested` or `Attach requested and connection established`. |
| `connectionId` | `string \| null` | DebugTools connection ID established during the wait. Null when no wait was requested or no connection appeared in time. |
| `host` | `string \| null` | Host of the new connection. |
| `port` | `integer \| null` | DebugTools socket port of the new connection. |
| `httpPort` | `integer \| null` | DebugTools HTTP port of the new connection. |

::: warning
`success=true` guarantees only that the attach flow was triggered successfully. A returned `connectionId` is required to confirm that a DebugTools connection was detected within `waitForConnectionMillis`.
:::

Request example:

```json
{
  "pid": "42135",
  "waitForConnectionMillis": 10000
}
```

Response example:

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

## 4. Generate a Method Argument Template

Tool name: `generate_method_args_template`

**Purpose**

Reads Java PSI from the IDEA project and generates an `argsJson` template from the target method signature using the same logic as the DebugTools method invocation page. It only reads project source and generates JSON. It does not connect to a JVM or invoke the target method.

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `className` | Yes | `string` | Fully qualified name of the Java class that declares the target method. |
| `methodName` | Yes | `string` | Target method name. |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |
| `parameterTypes` | No | `string[]` | Parameter types in declaration order. Use them to select an exact signature when overloads exist; fully qualified names are recommended. |
| `genParamType` | No | `string` | Argument template expansion mode: `SIMPLE`, `CURRENT`, or `ALL`. When omitted, uses the DebugTools global default. |

`genParamType` values:

| Value | Description |
| --- | --- |
| `SIMPLE` | Generates only the outer object for an object argument without expanding fields. |
| `CURRENT` | Expands fields declared directly by the current class. |
| `ALL` | Expands fields declared by the current class and inherited fields. |

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Whether the method was found and the template was generated. |
| `className` | `string \| null` | Requested target class name. |
| `methodName` | `string \| null` | Requested target method name. |
| `parameterNames` | `string[]` | Parameter names read from the Java declaration, in declaration order. |
| `parameterTypes` | `string[]` | Parameter types of the selected method, in declaration order. |
| `argsJson` | `string` | Generated DebugTools argument JSON string. `{}` on failure. |
| `genParamType` | `string \| null` | Template expansion mode that was used. |
| `errorMessage` | `string \| null` | Failure reason; null on success. |

Request example:

```json
{
  "className": "com.example.UserService",
  "methodName": "findUser",
  "parameterTypes": ["java.lang.Long"],
  "genParamType": "CURRENT"
}
```

Response example:

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

If a class has multiple methods with the same name and `parameterTypes` is omitted, the tool returns `success=false` and asks for an overload signature in `errorMessage`.

## 5. Invoke a Java Method

Tool name: `invoke_java_method`

**Purpose**

Converts MCP parameters into the existing DebugTools `RunDTO` request, sends it to the target JVM through an established DebugTools socket connection, and waits for the method result.

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `className` | Yes | `string` | Fully qualified target class name. |
| `methodName` | Yes | `string` | Target method name. |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |
| `connectionId` | No | `string` | Target DebugTools connection ID. When omitted, the current project must have exactly one active connection. |
| `parameterTypes` | No | `string[]` | Target method parameter types in declaration order, used to identify an overload. |
| `argsJson` | No | `string` | DebugTools method argument JSON string. Omit it or pass `{}` for a no-argument method. |
| `headers` | No | `object` | Headers for this invocation. Keys and values are treated as strings. These take priority over connection and global headers. |
| `xxlJobParam` | No | `string` | XXL-JOB parameter injected into the target invocation context. |
| `traceMethodDTO` | No | `object` | Trace settings for method calls, MyBatis, and SQL. |
| `methodAroundContent` | No | `string` | Method Around Java source executed before and after the target method. |
| `methodAroundContentIdentity` | No | `string` | Method Around content identity. If content is provided without an identity, the plugin uses the content MD5. |
| `classLoaderIdentity` | No | `string` | Target ClassLoader identity. When omitted, uses the connection's currently selected default ClassLoader. |
| `timeoutMillis` | No | `integer` | Time to wait for the target JVM response, in milliseconds. Defaults to `30000`; values below `1` are treated as `1`. |

If `connectionId` is omitted and the project has no active connection, the tool returns `No active DebugTools connection found`. If multiple active connections exist, it returns an error listing the available `connectionId` values.

Fields supported by `traceMethodDTO`:

| Field | Type | Description |
| --- | --- | --- |
| `traceMethod` | `boolean` | Whether to enable method call tracing. |
| `traceMaxDepth` | `integer` | Maximum trace depth. |
| `traceMyBatis` | `boolean` | Whether to trace MyBatis calls. |
| `traceSQL` | `boolean` | Whether to trace SQL. |
| `traceSkipStartGetSetCheckBox` | `boolean` | Whether to skip getter- and setter-style methods. |
| `traceBusinessPackageRegexp` | `string` | Business package prefix or regular expression to trace. |
| `traceIgnorePackageRegexp` | `string` | Package prefix or regular expression to ignore. |

### `argsJson` Format

`argsJson` is a JSON string. In the parsed root object, each field represents one Java method argument and its value uses the DebugTools `RunContentDTO` structure.

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

Argument fields should remain in Java method declaration order. Use real parameter names when available. Otherwise, use ordered fallback names such as `arg0` and `arg1`. Common supported `type` values include `simple`, `json_entity`, `enum`, `bean`, `lambda`, `request`, `response`, `file`, and `class`.

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Whether the method completed successfully. False when the target method throws or the plugin-side invocation fails. |
| `applicationName` | `string \| null` | Target application name returned with the result. |
| `className` | `string \| null` | Target class that was actually invoked. |
| `methodName` | `string \| null` | Target method that was actually invoked. |
| `parameterTypes` | `string[]` | Parameter types of the invoked method. |
| `resultClassType` | `string \| null` | Result category. Common values are `VOID`, `NULL`, `SIMPLE`, and `OBJECT`. |
| `result` | `string \| null` | ToString representation of the target method's return value. |
| `throwable` | `string \| null` | Target method exception or plugin-side failure reason. |
| `offsetPath` | `string \| null` | Offset path of the regular result in DebugTools result storage. |
| `traceOffsetPath` | `string \| null` | Offset path of the Trace result in DebugTools result storage. |
| `durationMillis` | `integer \| null` | Target method execution time in milliseconds. |

Request example:

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

Successful response example:

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

Failure response example:

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
