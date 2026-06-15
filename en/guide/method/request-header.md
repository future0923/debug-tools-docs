# Request Headers

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

Request headers add context to a method invocation, such as authentication tokens, tenant identifiers, language, gray release flags, and request source information. DebugTools supports headers at three levels: method-level, connection-level, and project-level. When a method is invoked, DebugTools merges these headers and sends the final map to the target JVM.

## Three Configuration Levels

### Method-Level

Method-level headers are filled in the `Headers` tab on the method invocation page. They only apply to the current method invocation page.

![method_invoke_panel.png](/images/method/method_invoke_panel.png){v-zoom}

Each row is one header key-value pair:

- Only enabled rows are included in the invocation.
- `Key` is the header name, such as `Authorization`, `X-Tenant-Id`, or `Accept-Language`.
- `Value` is the header value, such as `Bearer token` or `tenant-a`.
- When entering a header name, the editor suggests common HTTP headers and shows a short description for each option. Selecting an item writes it into the current cell.
- If the same method needs to reuse these headers, click <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="Save request parameters" /> in the toolbar to save them to the method parameter cache. The next time the same method is opened, they are restored automatically.

Method-level headers are suitable for temporary debugging, method-specific differences, or overriding connection-level and project-level defaults. For example, if only one method needs to switch tenants, fill `X-Tenant-Id` at the method level.

#### Editing Toolbar

The toolbar above the header table is used to maintain headers in the current tab:

| Button | Description |
| --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_table_add.svg" alt="Add" /> | Add a new enabled header row. |
| <img class="dt-table-icon" src="/icon/method/idea_table_remove.svg" alt="Clear" /> | Clear all header rows in the current tab. |
| <img class="dt-table-icon" src="/icon/method/idea_reset.svg" alt="Reset" /> | Discard the current edits and reload the default headers. On the method invocation page, this goes back to the project-level default headers. In connection-level or project-level dialogs, it goes back to the corresponding saved values. |
| <img class="dt-table-icon" src="/icon/method/idea_menu_save_all.svg" alt="Save" /> | Save the currently enabled headers. On the method invocation page, use it together with saving request parameters from the page toolbar. In connection-level or project-level dialogs, it saves to that level. |
| <img class="dt-table-icon" src="/icon/method/table_convert_pair.svg" alt="Table pair conversion" /> | Switch between table mode and text mode. |

The checkbox in the first column controls whether a row is enabled. Click the header checkbox to enable or disable all rows in bulk. The remove button in each row deletes only that row.

Click <img class="dt-inline-icon" src="/icon/method/table_convert_pair.svg" alt="Table pair conversion" /> to switch headers to text mode, which is convenient for pasting or batch editing:

![request_header_text_mode.png](/images/method/request_header_text_mode.png){v-zoom}

In text mode, each line uses the `Key: Value` format. Prefix a line with `#` to disable that header. For example, `#Authorization: Bearer token` is converted into an unchecked header row. Click <img class="dt-inline-icon" src="/icon/method/table_convert_pair.svg" alt="Table pair conversion" /> again to convert the text back to the table.

### Connection-Level

Connection-level headers are configured on a single connection card in the connection management page. They only apply to that connection.

Click <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> on a connection card to open the Header dialog. After saving, all method invocations under this connection include these headers by default. After expanding a connection card, you can also view the headers already saved for that connection in the details area.

![request_header_connection_position.png](/images/method/request_header_connection_position.png){v-zoom}

Connection-level headers are suitable for fixed context by application, environment, or instance, for example:

- A test application always uses `X-Env: test`.
- A tenant-specific application always uses `X-Tenant-Id: tenant-a`.
- When the same IDEA project connects to multiple applications, each connection keeps its own authentication or environment headers.

::: tip
Connection-level headers are saved with the connection record. After disconnecting and reconnecting, the headers kept by the connection card continue to take effect.
:::

### Project-Level

Project-level headers are configured through <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Global Header" /> in the connection management toolbar. The button is shown as `Global Header`, and its practical scope is the default DebugTools headers for the current IDEA project.

![request_header_project_position.png](/images/method/request_header_project_position.png){v-zoom}

After saving, all connections and all method invocations in the current project include these headers by default. Project-level headers are suitable for truly shared defaults, such as:

- A `User-Agent` used by all debug invocations.
- A base authentication header shared by the current project.
- Language, channel, or request source identifiers shared by all services.

::: warning
Project-level headers have the widest scope. If the same IDEA project connects to multiple applications with different authentication, tenant, or environment values, prefer connection-level headers instead of project-level headers.
:::

## Merge Priority

When invoking a method, DebugTools merges the three levels into the final request headers:

```text
Method-level > connection-level > project-level
```

If the same header key appears in multiple levels, the highest-priority value is used:

| Header Key | Project-Level | Connection-Level | Method-Level | Final Value |
| --- | --- | --- | --- | --- |
| `Authorization` | `Bearer project-token` | `Bearer connection-token` | `Bearer method-token` | `Bearer method-token` |
| `X-Tenant-Id` | `tenant-default` | `tenant-a` | Not set | `tenant-a` |
| `Accept-Language` | `en-US` | Not set | Not set | `en-US` |

In other words:

- Headers filled at the method level are not overwritten by connection-level or project-level headers.
- Headers filled at the connection level are not overwritten by project-level headers.
- Project-level headers are used only when neither method-level nor connection-level headers contain the same key.

## Recommended Usage

Put each header in the smallest reusable scope:

- If it only affects the current method debugging session, use method-level.
- If multiple methods under the same connection need it, use connection-level.
- If every connection in the current IDEA project can share it, use project-level.

If you repeatedly fill the same header in method pages, consider moving it to connection-level or project-level. If a project-level header is frequently overridden by different connections, it is usually a better fit for connection-level.

## Cache and Restore

Click <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="Save request parameters" /> in the method invocation toolbar to save the current method-level headers. When the same method is opened again, method-level headers are restored together with the parameter JSON, XXL-JOB parameter, trace configuration, and selected script.

When restoring a request from invocation history, DebugTools also fills in the headers from that record, making previous invocations easier to reproduce.

Connection-level headers are saved on the connection card. Project-level headers are saved through <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Global Header" /> in the toolbar and stored as plugin global settings, not as part of a specific method or connection record. They are not lost after closing IDEA, reopening the project, or restarting IDEA.

Click <img class="dt-inline-icon" src="/icon/method/clear.svg" alt="Clear Cache" /> in the toolbar to open the cache cleanup menu. `Method param cache` only clears the saved method invocation form content, including method-level parameters, headers, scripts, and related fields. It does not affect connection-level headers or project-level header settings.

Click `Clear all` to clear the core Jar cache, method parameter cache, and project-level header settings at once. Project-level headers are also cleared if you delete them in the project-level Header dialog and save, or if the IDEA DebugTools plugin configuration file is removed.

![Clear cache menu](/images/method/clear_cache_menu.png){v-zoom}

::: tip
Headers are used when DebugTools builds Spring MVC and Spring WebFlux request objects. If the target method has parameters such as `HttpServletRequest`, `ServerHttpRequest`, or `ServerWebExchange`, those objects can also read the merged headers from the current invocation.
:::
