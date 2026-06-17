Click <img class="dt-inline-icon" src="/icon/method/connect.svg" alt="Connect" /> in the toolbar to open the remote target dialog. This is used to connect to a remote application where the DebugTools server has already started.

![connect_remote_empty.png](/images/method/connect_remote_empty.png){v-zoom}

When there is no saved history, click <img class="dt-inline-icon" src="/icon/method/idea_add.svg" alt="Add" /> to create a remote target.

![connect_remote_new.png](/images/method/connect_remote_new.png){v-zoom}

Fill in these fields:

- `Host`: the address of the remote application machine. If empty, `127.0.0.1` is used by default.
- `Port`: fill in the `TCP` port and `HTTP` port. The default values are `12345` and `22222`.
- `Name`: optional. If filled in, the target is saved to the history list. If left empty, it is used only as a temporary one-time target.

After filling in the fields, click `Apply`. The plugin first gets the remote application name through the `HTTP` port, then establishes the connection through the `TCP` port. After the connection succeeds, the dialog closes and a remote connection card is added to the connection management list.

::: tip
Before connecting remotely, make sure the target application has started the DebugTools server and that the current machine can access the target `TCP` and `HTTP` ports. Otherwise, the plugin may report connection failure or fail to get the application name.
:::

**Manage Remote History**

If a `Name` was filled in when creating a remote target, it appears in the history list the next time the remote target dialog is opened.

![connect_remote_saved.png](/images/method/connect_remote_saved.png){v-zoom}

The history list supports:

- Filtering by name or host in the search box.
- Double-clicking a target to connect directly.
- Clicking <img class="dt-inline-icon" src="/icon/method/idea_run_all.svg" alt="Connect" /> to start a connection.
- Clicking <img class="dt-inline-icon" src="/icon/method/idea_edit.svg" alt="Edit" /> to modify the host, ports, or name.
- Clicking <img class="dt-inline-icon" src="/icon/method/idea_remove.svg" alt="Remove" /> to delete the history record.

After editing a history target, click `Apply` to connect with the latest configuration. If the name is changed, the history record under the old name is replaced by the new one.
