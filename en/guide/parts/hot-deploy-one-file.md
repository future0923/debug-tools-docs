Open the context menu in a Java source file editor or project tree, then click `Remote Compile "xxx.java" to Hot Deploy`. The plugin saves the current file, sends the source code to the attached target application, and the target application compiles and hot deploys it.

If the current project is connected to multiple applications, the plugin asks you to choose the target connection first. The request uses the `ClassLoader` currently selected on that connection card.

![hot_deploy_remote_compile_context_menu.png](/images/hotswap/hot_deploy_remote_compile_context_menu.png){v-zoom}

After hot deployment completes, the result is printed in IDEA's Run tool window. The tab title is `Remote Deploy Result`; when multiple applications are connected, the title also includes the application name.

![hot_deploy_remote_compile_result.png](/images/hotswap/hot_deploy_remote_compile_result.png){v-zoom}

::: tip
- Hot reloading of changed files through hot deployment is only supported after the application is attached
- When using remote dynamic compilation, the attached application must be started through JDK, not JRE.
:::
