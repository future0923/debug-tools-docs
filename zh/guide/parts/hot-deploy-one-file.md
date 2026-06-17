在 Java 源文件的编辑器或项目树中打开右键菜单，点击 `远程编译并热部署 "xxx.java"`，插件会先保存当前文件，再把源码发送到已附着的目标应用，由目标应用完成远程编译并立即热部署。

如果当前项目同时连接了多个应用，点击后会先选择要部署到的连接；执行时会使用该连接卡片中当前选中的 `ClassLoader`。

![hot_deploy_remote_compile_context_menu.png](/images/hotswap/hot_deploy_remote_compile_context_menu.png){v-zoom}

热部署完成后，结果会输出到 IDEA 的 Run 工具窗口，页签标题为 `远程部署结果`；多应用连接时标题会带上应用名称。

![hot_deploy_remote_compile_result.png](/images/hotswap/hot_deploy_remote_compile_result.png){v-zoom}

::: tip
- 只有附着应用后才支持通过热部署的方式热重载变动文件
- 使用远程动态编译时，附着应用必须要通过 JDK 启动，不能使用 JRE 启动。
:::
