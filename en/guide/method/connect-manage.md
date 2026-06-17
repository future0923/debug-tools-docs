# Connection Management

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

The connection management page is used to view and maintain all applications currently attached to DebugTools. Both local JVM attachments and remote service connections appear here as connection cards. Features such as method invocation, SQL printing, Groovy execution, and hot deployment are all based on a selected connection.

![connect_manage_empty.png](/images/method/connect_manage_empty.png){v-zoom}

## Open Connection Management

Open the `DebugTools` tool window in IDEA. By default, it opens the connection management page. If no application is attached, the page shows `No attached applications`.

The toolbar provides these actions:

| Icon | Button | Description |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/attach.svg" alt="Attach" /> | `Attach` | Select and attach to a local Java process. |
| <img class="dt-table-icon" src="/icon/method/connect.svg" alt="Connect" /> | `Connect` | Connect to a remote DebugTools service. |
| <img class="dt-table-icon" src="/icon/method/http.svg" alt="Global Header" /> | `Global Header` | Configure default headers used by later calls. |
| <img class="dt-table-icon" src="/icon/method/clear.svg" alt="Clear Cache" /> | `Clear Cache` | Clear the core Jar cache, method parameter cache, or all supported caches. |
| <img class="dt-table-icon" src="/icon/method/help.svg" alt="Help" /> | `Help` | Open the DebugTools documentation. |
| <img class="dt-table-icon" src="/icon/method/appreciation.svg" alt="Sponsor" /> | `Sponsor` | Open the sponsor entry. |

The search box supports filtering by remark, application name, PID, host, or port. When many connections are attached, add remarks to frequently used applications and search by remark later.

::: tip
The account button uses the IDEA account icon. It is used to sign in or view IDEA plugin account information.
:::

## Attach Applications

### Local

Click <img class="dt-inline-icon" src="/icon/method/attach.svg" alt="Attach" /> in the toolbar to open the local JVM process list. The dialog scans Java processes running on the current machine and selects an available process by default.

![attach_list.png](/images/method/attach_list.png){v-zoom}

Each item in the list shows:

- PID: the process ID, for example `19924`.
- Application name: the short main class name is preferred; if the process is started from a Jar, the Jar file name is shown.
- Run configuration, module, and project: if the process comes from the current IDEA run configuration, these details are shown in the list.
- Full name: after selecting a process, the detail area shows the full main class name or Jar path.

You can attach in either of these ways:

- Double-click the target JVM process.
- Select the target JVM process, then click `Attach`.

If the list is empty, make sure the Java application is running, then click `Refresh` to scan again. Click `Cancel` to close the dialog without attaching.

::: tip
Local attach injects the DebugTools Agent into the target JVM. After attaching successfully, the application appears in the connection management list with the source marked as `Local`.
:::

### Remote

<!--@include: ../parts/connect-remote.md-->

## View Connections

### Application Information

After an application is attached, the connection is displayed as a card in the list.

![connection_list.png](/images/method/connection_list.png){v-zoom}

Each connection card shows:

- Application name: the short application name is shown by default. Hover to view the full name.
- Connection status: green means connected. When disconnected, the card is shown as not connected.
- Source tag: local attachments show `Local`, and remote connections show `Remote`.
- Runtime information: expand the card to view `PID` or `Host`, `TCP` port, and `HTTP` port.

Click the card title area or blank area to expand or collapse details. Buttons, dropdowns, input fields, and other operation controls do not trigger expand or collapse.

### Remarks

Click the edit button on a connection card to modify its remark. After saving, the card title is displayed as `Remark (ApplicationName)`, which makes it easier to distinguish environments when multiple applications are attached, for example `Order Service Test (OrderApplication)`.

Press Enter to save the remark, or click the save button. Press `Esc` or click the cancel button to discard the change.

### Header

The connection management page provides two types of headers:

- Configure through the toolbar <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> entry to apply headers to all connected applications.
- Click <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> on a single connection card to configure headers that apply only to that connection.

After expanding a connection card, you can view the headers already saved for the current connection in the details area. This area is read-only. To modify headers, open the Header dialog from <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> on the connection card.

::: tip
- If the same IDEA project connects to multiple applications, it is recommended to configure authentication, tenant, or environment headers on specific connections to avoid affecting other applications.
- Headers can also be configured per method on the method invocation page. For details, see [Request Headers](./request-header).
- Priority: `Method-level > connection-level > project-level`.
:::

### Adjust Connection Configuration

After expanding a card, you can directly modify common call configuration for the current connection:

- `ClassLoader`: select the ClassLoader used when invoking methods or executing scripts.
- `SQL`: switch the SQL printing mode.
- `Method script`: select the default Method Around script for the current connection, or add, view, delete, and refresh scripts. See [Method Pre/Post Scripts](./method-script).
- `Header`: view the current connection header key-value pairs.

These settings are saved per connection. When multiple applications are attached, each connection can maintain its own ClassLoader, SQL setting, method script, and headers.

### Connection Actions

Connection cards show different actions depending on the connection status:

| Icon | Button | Scenario | Description |
| --- | --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_edit.svg" alt="Edit Remark" /> | `Edit Remark` | Connection card | Modify the remark of the current connection. After saving, the title is shown as `Remark (ApplicationName)`. |
| <img class="dt-table-icon" src="/icon/method/http.svg" alt="Project Header" /> | `Project Header` | Connection card | Configure headers for the current connection. |
| <img class="dt-table-icon" src="/icon/method/disconnect.svg" alt="Disconnect" /> | `Disconnect` | Connected | Close only the client connection for the current card. The connection record remains in the list. |
| <img class="dt-table-icon" src="/icon/method/idea_suspend.svg" alt="Stop" /> | `Stop` | Connected | Send a stop command to the current connection. Use this when the current attached service needs to be ended. |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="Reconnect" /> | `Reconnect` | Disconnected | Local connections search for the JVM again by application name. Remote connections reconnect using the original host and ports. |
| <img class="dt-table-icon" src="/icon/method/idea_more.svg" alt="More" /> | `More` | Connection card | Contains SQL history, Groovy console, hot deployment, and delete connection actions. |

The More menu contains:

| Icon | Button | Description |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/database.svg" alt="SQL History" /> | `SQL History` | Open the SQL history for the current application. |
| <img class="dt-table-icon" src="/icon/method/groovy.svg" alt="Groovy Console" /> | `Groovy Console` | Open the Groovy console bound to the current connection. |
| <img class="dt-table-icon" src="/icon/method/hot_deployment.svg" alt="Hot Deployment" /> | `Hot Deployment` | Open the hot deployment window for the current connection. |
| <img class="dt-table-icon" src="/icon/method/remove.svg" alt="Delete Connection" /> | `Delete Connection` | Delete the current connection record. |

Deleting a connection opens a confirmation dialog. After deletion, the connection record is removed from the list.

## Clear Cache

Click <img class="dt-inline-icon" src="/icon/method/clear.svg" alt="Clear Cache" /> to open the cache cleanup menu. Select the cache items you want to clear, then click `Clear`. Click `Cancel` to close the menu without clearing anything.

![Clear cache menu](/images/method/clear_cache_menu.png){v-zoom}

The supported cache items are:

- `Core jar cache`: clears the core Jar cache used when DebugTools injects into the target JVM. After upgrading the plugin, when attach fails, or when you suspect the local Agent cache is inconsistent, clear this item and attach the application again.
- `Method param cache`: clears the method invocation parameter cache. After clearing it, reopening the same method invocation page will no longer restore the previously filled parameters, headers, scripts, and other request form content.

Click `Clear all` to clear the core Jar cache, method parameter cache, and Global Header settings at once. After the cleanup finishes, IDEA shows a success notification.

::: warning
Clearing cache does not disconnect current connections and does not delete remote connection history. However, `Clear all` clears the default headers saved through the Global Header entry, so make sure those headers are no longer needed before running it.
:::
