# Execute Groovy Script {#execute-groovy-script}

Groovy scripts run inside the target JVM. They can access Java classes in the target application, Spring Beans, and the [built-in functions](./groovy-function.md) provided by DebugTools. Before running a script, attach locally or connect remotely, then select an available default `ClassLoader` on the connection card.

::: warning Pay attention to the ClassLoader
Groovy scripts use the default `ClassLoader` selected for the current connection. If the target application has multiple class loaders, choose the one that can load business classes and the Spring container. Choosing the wrong one may cause classes, Beans, or configuration values to be unavailable.
:::

## 1. Open the Groovy Console

On the DebugTools connection management page, open the more menu on the target connection card and click `Groovy Console`.

![groovy_connection_menu](/images/groovy/groovy_connection_menu.png){v-zoom}

DebugTools creates or opens a Groovy Scratch file under `Scratches and Consoles -> Debug Tools Plugins -> groovy`. The file name is generated from the connected application name, such as `SpringBootMybatis.groovy`.

When the file is created for the first time, DebugTools writes the connection identifier at the top:

```groovy
// DebugTools-Connection-Id: ...
```

This identifier binds the current Groovy file to the target connection. Do not delete or manually modify this line during normal use. If the file already exists, DebugTools only reopens it and does not overwrite your script content.

## 2. Write the Script

Write the script in the opened `.groovy` file. It is a standard Groovy file, so IDEA provides Groovy syntax support, project classes, and import suggestions.

For example, read the target Spring application's port configuration:

```groovy
gsc("server.port")
```

Common built-in functions include:

| Function | Description |
| --- | --- |
| `gi` / `getInstances` | Get instances of the specified Class from the target JVM. |
| `gb` / `getBean` | Get a Bean from the target Spring container. |
| `rb` / `registerBean` | Register a Bean in the target Spring container. |
| `urb` / `unregisterBean` | Unregister a Bean from the target Spring container. |
| `gActive` / `getSpringProfilesActive` | Get the currently active Spring Profiles. |
| `gsc` / `getSpringConfig` | Get Spring configuration from the target application. |

For complete usage, see [Groovy Built-in Functions](./groovy-function.md).

## 3. Run the Script

Open the context menu in the current Groovy file and click `Run Current Groovy Script 'xxx.groovy'`.

![groovy_run_context_menu](/images/groovy/groovy_run_context_menu.png){v-zoom}

When running, DebugTools first saves the current file, then sends the full script content, connection identifier, and default `ClassLoader` identifier to the target JVM. The target JVM executes the script with the DebugTools Groovy base class, so you can directly call built-in functions such as `gsc`, `gb`, and `gi`.

If the current file has no connection identifier:

- When there is only one connection, DebugTools uses that connection directly and binds it to the current file.
- When there are multiple connections, DebugTools asks you to choose the connection for running the script.
- When there is no available connection, go back to the connection management page and reopen `Groovy Console` from the target connection card.

## 4. View Results

After execution completes, the result appears in IDEA's bottom Run tool window. The title format is `Groovy Result - ApplicationName`.

![groovy_debug_result](/images/groovy/groovy_debug_result.png){v-zoom}

Result display rules:

| Result type | Display |
| --- | --- |
| `null` | The `toString` tab shows `NULL`. |
| Primitive values, strings, and other simple values | The `toString` tab shows the converted text. |
| Object | The `toString` tab shows the object's `toString()`, and the `Debug` tab can expand the object structure. |
| Exception | The exception stack is shown, so you can continue checking the script, parameters, or `ClassLoader`. |

If you need to inspect object fields, switch to the `Debug` tab and expand the object. If you only need to copy the returned value, use the copy action on the result node.
