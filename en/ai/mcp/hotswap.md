# Hotswap MCP

The DebugTools IDEA plugin provides three MCP tools in `DebugToolsHotswapToolset`. They list IDEA run configurations, start a run configuration through DebugTools Hotswap, and trigger compilation and hot reload through IDEA Java Debugger.

This page is a tool reference and covers only each tool's purpose, input parameters, and return values. The [Hotswap Skill](../skill/hotswap.md) defines how an AI should select run configurations, handle auto-attach, and decide when to trigger hot reload.

## Tool Overview

| Tool | Purpose |
| --- | --- |
| `list_debug_tools_run_configurations` | Lists run configurations in the current IDEA project, with optional module, main class, and configuration type filters. |
| `execute_debug_tools_run_configuration` | Starts a specified IDEA run configuration with the DebugTools Hotswap executor. |
| `compile_and_reload_modified_files` | Triggers Compile and Reload Modified Files for an attached Java Debugger session. |

## Common Conventions

All three tools support an optional `projectPath` parameter:

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | An IDEA project directory or a file path inside the project. Use it to identify the target when the MCP context is ambiguous or IDEA has multiple projects open. |

When `projectPath` is omitted, the plugin resolves the target from the IDEA MCP call context and open projects. If it cannot identify a project, the tool returns an MCP error.

Normal results are returned as JSON text. Missing parameters, nonexistent projects, or unexpected execution failures may return an MCP error directly. Expected business failures are represented by `success=false` and `message` in the result object.

## 1. List IDEA Run Configurations

Tool name: `list_debug_tools_run_configurations`

**Purpose**

Reads run configurations from the current IDEA project's `RunManager` and returns their names, types, main classes, and modules. It only queries configurations and does not start an application.

The result matches IDEA's native run configuration list. It does not prefilter configurations that do not support the DebugTools Hotswap executor. Support is checked when `execute_debug_tools_run_configuration` runs.

**Parameters**

There are no tool-specific required parameters.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |
| `moduleName` | No | `string` | Module name filter. It must exactly match `moduleName` in the result. |
| `mainClassNameContains` | No | `string` | Main class substring filter. Checks whether `mainClassName` contains the supplied text. |
| `typeDisplayName` | No | `string` | Exact run configuration type display name, such as `Spring Boot` or `Application`. |

When multiple filters are supplied, a configuration must satisfy all of them. Empty strings are treated as omitted.

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `count` | `integer` | Number of run configurations after filtering. |
| `configurations` | `array` | Run configuration summaries. |
| `configurations[].name` | `string` | IDEA run configuration name. Pass this value to `execute_debug_tools_run_configuration.configurationName`. |
| `configurations[].typeName` | `string` | Run configuration type name. |
| `configurations[].typeDisplayName` | `string` | Configuration type name displayed by IDEA. |
| `configurations[].mainClassName` | `string \| null` | Fully qualified Java main class name, when available. |
| `configurations[].moduleName` | `string \| null` | Associated IDEA module name. |

Request example:

```json
{
  "moduleName": "demo-service",
  "mainClassNameContains": "DemoApplication",
  "typeDisplayName": "Spring Boot"
}
```

Response example:

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

## 2. Start a Run Configuration

Tool name: `execute_debug_tools_run_configuration`

**Purpose**

Finds an IDEA run configuration by name and requests startup with the DebugTools Hotswap executor. This is equivalent to selecting the configuration in IDEA and running `Hotswap '<configuration>' with DebugTools`.

**Parameters**

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `configurationName` | Yes | `string` | Exact full name of the IDEA run configuration to start. |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Whether the startup request was successfully submitted to IDEA's execution system. |
| `configurationName` | `string` | Requested run configuration name. |
| `executorId` | `string` | DebugTools executor ID used for the request, currently `DebugTools Debug Executor`. |
| `autoAttachEnabled` | `boolean` | Whether the global DebugTools auto-attach option is enabled. |
| `requiresManualAttach` | `boolean` | Whether the DebugTools agent must be attached manually after startup. |
| `nextAction` | `string \| null` | Suggested next action for the MCP client; null when startup fails. |
| `expectedMainClassName` | `string \| null` | Expected main class read from the run configuration. |
| `expectedModuleName` | `string \| null` | Expected module read from the run configuration. |
| `message` | `string` | Startup status or failure description. |
| `availableConfigurationNames` | `string[]` | Available configuration names when the requested configuration is not found; normally empty for other results. |

Current `nextAction` values:

| Value | Meaning |
| --- | --- |
| `LIST_DEBUG_TOOLS_CONNECTIONS` | Auto-attach is enabled; the client should check DebugTools connections next. |
| `LIST_ATTACHABLE_JVMS` | Auto-attach is disabled; the client should list attachable JVMs next. |
| `null` | Startup failed, so no next action is suggested. |

::: warning
`success=true` only means IDEA accepted the startup request. It does not mean the JVM has finished starting or that a DebugTools connection has been established.
:::

Request example:

```json
{
  "configurationName": "DemoApplication"
}
```

Successful response example:

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

Response when the configuration is not found:

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

If the configuration exists but its runner does not support the DebugTools Hotswap executor, or the executor is unavailable in the current IDEA instance, the tool also returns `success=false` with the reason in `message`.

## 3. Compile and Hot Reload Modified Classes

Tool name: `compile_and_reload_modified_files`

**Purpose**

Selects an attached IDEA Java Debugger session in the current project and invokes Java Debugger's `Compile and Reload Modified Files` capability.

Here, modified files are files and classes tracked by Java Debugger since the session started or since the previous reload. They are not the modified files in the Git workspace.

**Parameters**

There are no unconditionally required tool-specific parameters.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `projectPath` | No | `string` | Target IDEA project path; see Common Conventions. |
| `sessionName` | Conditional | `string` | Java Debugger session name. It can be omitted when only one session is available, but is required when multiple sessions exist. |
| `compileBeforeReload` | No | `boolean` | Whether to compile before hot reload. When omitted, uses the current IDEA Java Debugger `COMPILE_BEFORE_HOTSWAP` setting. |

**Return Value**

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Whether the compile-and-reload request was successfully submitted to IDEA Java Debugger. |
| `sessionName` | `string \| null` | Selected debugger session name. If selection fails, it may contain the requested name or be null. |
| `compileBeforeReload` | `boolean` | Effective compile-before-reload setting for this request. |
| `message` | `string` | Request result or failure reason. |
| `availableSessionNames` | `string[]` | Candidate session names when multiple sessions exist without a selection, the requested session does not exist, or a similar selection error occurs. |

::: warning
`success=true` only means the request was submitted to IDEA Java Debugger. Compilation progress, HotSwap results, and failure details are still shown by IDEA's native UI or notifications.
:::

Request example:

```json
{
  "sessionName": "DemoApplication",
  "compileBeforeReload": true
}
```

Successful response example:

```json
{
  "success": true,
  "sessionName": "DemoApplication",
  "compileBeforeReload": true,
  "message": "Compile and reload modified files requested",
  "availableSessionNames": []
}
```

Response when multiple debugger sessions exist and `sessionName` is omitted:

```json
{
  "success": false,
  "sessionName": null,
  "compileBeforeReload": true,
  "message": "Multiple attached Java debugger sessions are available; pass sessionName to choose one",
  "availableSessionNames": ["DemoApplication", "WorkerApplication"]
}
```

If the current project has no attached Java Debugger session, the tool returns `success=false` with `message` set to `No attached Java debugger session is available for hotswap`.
