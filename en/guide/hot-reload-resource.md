# Resource File Hot Reload and Deployment

Starting with 5.3.0, DebugTools single-file resource operations support more than XML. Non-Java files such as HTML, FTL, FTLH, YAML, and Properties can be copied to a module output directory or sent as resources to a connected target application.

Updating a file and reloading framework state are separate steps. Whether a successful write takes effect immediately depends on how the application reads the resource and whether a hot reload plugin refreshes its cache or configuration.

## Choose an Update Method

| Operation | Use case | Destination |
| --- | --- | --- |
| `Copy 'filename' to target` | A local application reads resources from module output. | The IDEA module's production output directory, such as `target/classes` or `out/production/module`, according to module configuration. |
| `Deploy 'filename' to remote` | A connected local or remote target needs a resource transfer through DebugTools. | The first `watchResources` directory configured for the selected ClassLoader; Windows uses `watchResourcesWin`. |

Both operations save the current file first and preserve its path relative to the source or resource root. They accept individual files rather than directories and do not compile Kotlin or other language source files into classes.

## Copy to Local Output

1. Confirm that the file belongs to an IDEA module source or resource root and that the module has a production output directory.
2. Open the context menu in the file editor or project tree.
3. Click `Copy 'filename' to target`.
4. Wait for the success notification, then request the page or method that uses the resource again.

For example:

```text
src/main/resources/templates/index.ftlh
    → target/classes/templates/index.ftlh
```

`to target` is the menu label; the actual output path may differ for Gradle and other projects. The plugin creates parent directories and overwrites the output file without modifying the source file.

If the menu is missing, check whether the file is a Java file, whether it is under a source or resource root, and whether module output is available.

## Deploy to a Target Application

1. Start the target using the [Hot Deploy](./hot-deploy.md) configuration and ensure its watched resource directory exists and is writable.
2. Establish a DebugTools connection and select a default `ClassLoader` that can read the business resources.
3. Open the current non-Java file's context menu and click `Deploy 'filename' to remote`.
4. If several connections exist, select the target connection.
5. Read the deployment result in the Run tool window, then verify the target page or method.

For example, `templates/thymeleaf.html` under the resource root is sent with that relative path and written to the watched resource directory:

```text
src/main/resources/templates/thymeleaf.html
    → /var/tmp/debug-tools/resources/templates/thymeleaf.html
```

`/var/tmp/debug-tools/resources` is the default example. Custom paths follow the selected ClassLoader's configuration. If multiple watched directories are configured, single-file deployment writes to the first one.

::: warning Conditions for Changes to Take Effect
- Attaching establishes a connection but does not prove that hot reload and resource watching were initialized. Start the target with hot reload or hot deployment enabled.
- MyBatis XML, Freemarker, and Thymeleaf require their corresponding plugins to handle reloading. See their feature pages.
- YAML and Properties files can be transferred, but this does not automatically rebind Spring configuration or rebuild Beans.
- Verify the actual effect after a successful deployment response. Missing watched directories and similar issues also require checking the target Agent logs.
:::

To deploy several resources at once, use `Resource Type` in the [Hot Deploy dialog](./hot-deploy.md#_4-1-multiple-files).
