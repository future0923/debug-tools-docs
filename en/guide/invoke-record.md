# Invoke Method History

## Enable

![config_invoke_record.png](/images/config_invoke_record.png){v-zoom}

Enabling this configuration will generate a record of method calls.

## Call History List

Click the <img src="/pluginIcon.svg" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> toolbar on the right side of Idea to open the DebugTools window and view the call history list (up to 500 entries).

![invoke_record_toolwindow.png](/images/invoke_record_toolwindow.png){v-zoom}

Display format:

```
[Execution status icon] [Execution time] [Class name]#[Method name](parameter type): [Return value type] [Declaration exception] [Execution time]
```

## Menu

![invoke_record_action.png](/images/invoke_record_action.png){v-zoom}

- `Goto method source`: Jump to the currently selected source code location
- `Show call json`: Displays the JSON information for the currently selected call
- `Show param json`: Displays the JSON information for the method parameters for the currently selected call
- `Quick Debug`: Use the currently selected parameter call record to activate the debug panel. **Double-clicking the left mouse button also works**.
- `Rerun`: Reruns the currently selected method with the same parameters as before.
- `Return With Default ClassLoader`: Reruns the currently selected method with the currently selected default class loader, with the same parameters except for the class loader.
- `Remove`: Removes the currently selected call record.