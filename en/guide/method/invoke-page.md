# Method Invocation

<style>
.vp-doc .dt-inline-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 2px;
  max-width: none;
  object-fit: contain;
  vertical-align: -3px;
}
.vp-doc .dt-table-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  max-width: none;
  vertical-align: middle;
}
</style>

The method invocation page is an independent request workspace for one target method. After a method is opened, DebugTools creates a request tab in the tool window. You can select the attached application and ClassLoader, fill in parameters, headers, scripts, and other request data, then view the invocation result.

## Open Method Invocation

Click the method invocation entry from the method gutter icon or the context menu inside the method body. DebugTools creates a request tab for the current method. The tab name uses `ClassName#methodName`; hover over the method input to view the full class name, parameter types, and return type.

![method_invoke_position.png](/images/method/method_invoke_position.png){v-zoom}

You can open multiple method requests at the same time. When switching tabs, each method keeps its own parameters, target connection, and result area, which is useful when repeatedly verifying several Service, Mapper, or Job methods.

## Page Toolbar

The toolbar on the method invocation page only affects the current request tab.

| Icon | Button | Description |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/attach.svg" alt="Attach" /> | `Attach` | Open the local JVM process list. After attaching, the application appears in the application dropdown. |
| <img class="dt-table-icon" src="/icon/method/idea_locate.svg" alt="Locate current method source" /> | `Locate current method source` | Jump back to the source location of the current method. |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="Refresh" /> | `Refresh` | Reload applications and ClassLoaders, then detect the suitable connection for the current method again. |
| <img class="dt-table-icon" src="/icon/method/idea_copy.svg" alt="Copy request parameters" /> | `Copy request parameters` | Copy the current parameter JSON. The content is the same as the visible text in the method parameter tab. |
| <img class="dt-table-icon" src="/icon/method/idea_save.svg" alt="Save request parameters" /> | `Save request parameters` | Save the current request form to the method parameter cache. It is restored the next time the same method is opened. |
| <img class="dt-table-icon" src="/icon/method/idea_execute.svg" alt="Request" /> | `Request` | Invoke the method with the current application, ClassLoader, and request form. |

After clicking <img class="dt-inline-icon" src="/icon/method/idea_execute.svg" alt="Request" />, the request button enters the `Requesting...` state. When a new request starts, the previous result is cleared so old results are not mixed with the current request.

## Select Target Application

The top area contains two dropdowns: application and ClassLoader.

- The application dropdown shows applications that are attached locally or connected remotely in the current project. The format is `ApplicationName · Local` or `ApplicationName · Remote`. If a connection has a remark, the remark is shown first; hover to view details.
- The ClassLoader dropdown is bound to the selected application. When the application connection is normal, DebugTools refreshes it and selects the remote default ClassLoader automatically.
- When multiple connections exist, the page tries to automatically select the application and ClassLoader that can load the class containing the current method.

::: tip
- In most cases, you do not need to select the ClassLoader manually.
- If the wrong ClassLoader is selected, common symptoms are that the target JVM cannot find the class, Bean, or method.
- For multi-module applications, plugin-based applications, and Spring Boot DevTools scenarios, prefer the ClassLoader that can load the current business class.
- When IDEA starts the application with the `shorten command line` classpath file mode, the default ClassLoader may also change.
:::

## Request Data

### Method Parameters

Method parameter JSON is the input protocol used by DebugTools when invoking Java methods. Each field in the root object corresponds to one method parameter. The field name is usually the Java method parameter name, and the value contains fixed `type` and `content` fields:

```json
{
  "[parameterName]": {
    "type": "[type]",
    "content": "[content]"
  }
}
```

`type` decides how the target JVM converts `content` into the real Java argument.

Common types include `simple`, `json_entity`, `enum`, `bean`, `lambda`, `request`, `response`, `file`, and `class`.

For the full format, type examples, completion behavior, and editor actions, see [Method Parameter JSON](./param-json).

### Headers

The `Headers` tab is used to fill in headers for the current method invocation. Only enabled headers are included in the request. It is useful for authentication, tenant, language, gray release, and other context values.

DebugTools supports headers at three levels: method-level, connection-level, and project-level. The final priority is `Method-level > connection-level > project-level`. For configuration entries, merge rules, and usage recommendations, see [Request Headers](./request-header).

### Method Script

The `Method Script` tab selects a Java script.

The script can execute corresponding code `before` the target method call, `after` it returns, `when an exception occurs`, and `after final cleanup`.

It helps process parameters, results, or context, and is useful for temporarily preparing login state, environment variables, `ThreadLocal`, and other prerequisites.

For script entry points, template methods, execution order, and examples, see [Method Pre/Post Scripts](./method-script).

### XxlJob

The `XxlJob` tab is used to fill in the XXL-JOB scheduling parameter. The content is sent with the current request as a plain string.

Before the target JVM executes the method, DebugTools writes this string into the XXL-JOB context. If the target method reads the task parameter through XXL-JOB APIs such as `XxlJobHelper.getJobParam()` or `XxlJobContext.getXxlJobContext().getJobParam()`, it reads the value filled in this tab.

The content entered here is not part of the method parameter JSON and is not passed as a target method argument. If the method itself has parameters, you still need to fill them in the `Method Parameters` tab.

For ordinary methods, or methods that do not depend on XXL-JOB context, leave this tab empty. When it is empty, DebugTools does not set an extra XXL-JOB parameter for this invocation.

![method_invoke_xxl_job.png](/images/method/method_invoke_xxl_job.png){v-zoom}

In the screenshot, `LeaseBrokerWageJob#execute()` is invoked with `2` in the `XxlJob` tab. If this task method reads the XXL-JOB task parameter internally, it receives the string `2`; the result area returns `Void`, meaning the task method has completed.

### Trace

The `Trace` tab is used to enable trace collection for the current invocation. After enabling it, you can configure the maximum depth, whether to record MyBatis and SQL, whether to skip getter/setter methods, and use business packages or ignored packages to narrow the collection range.

After the invocation completes, the result area shows a trace view for inspecting the method call chain, SQL, and execution time. For detailed options, trace tree operations, and usage recommendations, see [Trace](./trace-method).

### Reactive

When the target method returns `Flux`, `Mono`, `org.reactivestreams.Publisher`, or `java.util.concurrent.Flow.Publisher`, the page shows the `Reactive` tab. These settings only affect how the tool window displays the result; they do not change the remote method execution logic.

When debugging LLM, Agent, SSE, and other AI streaming APIs, it can extract fragmented events and join them into a continuous result, which makes it especially useful for diagnosing AI streaming output.

`Display after return` can show either the event list or extracted result. When using extracted result, `Extract path` supports JSON Path for extracting and joining values from streaming `data`, such as `$.content`. You can also use `$[event].path` to extract only fields from a specified SSE event.

For detailed display behavior, extract path rules, and subscription cancellation, see [Reactive](./reactive).

## View Results

Before the request returns, the result area shows `No request result`. A normal return value is embedded in the result panel. It supports views such as `toString`, `JSON`, `Debug`, `Trace`, and `Console`. The actual tabs depend on the current return content and invocation configuration.

![result_json.png](/images/method/result_json.png){v-zoom}

`Void` and `Null` return values can be viewed directly in `toString` or the text result, but they cannot be expanded in the debug tree. If the method throws an exception, the result area displays the exception result so you can copy the stack trace or return to the source code for further diagnosis.

For streaming responses, the page switches to the streaming result panel when the first event arrives. While the invocation is still running, click `Stop` to cancel the current streaming request. Starting another request or closing the tab also terminates any active streaming response.

## Parameter Cache and Invocation Records

Click <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="Save request parameters" /> to save the current method parameter JSON, headers, XXL-JOB parameter, trace configuration, and selected script. The next time the same method is opened, the page restores these values automatically.

Every invocation creates a record. After the response returns, DebugTools supplements the record with the result. When restoring a request from invocation history, DebugTools fills in the parameter JSON, headers, ClassLoader, XXL-JOB parameter, trace configuration, and method script from that record, making it easier to reproduce previous calls.

::: warning
The method invocation page directly executes the current method in the target JVM. For methods that write to a database, send messages, call external services, or trigger scheduled jobs, confirm the application environment, headers, ClassLoader, and parameters before running.
:::
