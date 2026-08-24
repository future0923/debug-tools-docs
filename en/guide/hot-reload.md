# Hot reload <Badge type="warning" text="beta" /> {#hot-reload}

::: info
Hot reload is complex to implement and requires many compatibility scenarios. If this project helps you save development time, you might as well click <a target="_blank" href="https://github.com/future0923/debug-tools"><img src="https://img.shields.io/github/stars/future0923/debug-tools?style=flat&logo=GitHub" style="display: inline-block; vertical-align: middle;" /></a>. Your recognition will make more people discover it, and your support is my motivation to update. If it doesn't work, please submit <a target="_blank" href="https://github.com/future0923/debug-tools/issues"><img src="https://img.shields.io/github/issues-closed/future0923/debug-tools?style=flat&logo=github" style="display: inline-block; vertical-align: middle;" /></a> for feedback.
:::

When writing code traditionally, you need to restart the application to take effect. Hot reload makes code changes take effect immediately without restarting the application, greatly improving iteration efficiency. It supports changes to class properties and methods (including proxy classes), Spring, Solon, MyBatis, and other mainstream frameworks. It is compatible with JDK 8, JDK 11, JDK 17, JDK 21, JDK 25, and other versions.

## 1. Enable hot reload

- Please disable the `Build, Execution, Deployment -> Debugger -> Async Stack Traces` configuration in IDEA.

![instrumenting_agent.png](/images/hotswap/instrumenting_agent.png){v-zoom}

- Click `Hotswap 'xxx' with DebugTools` in `More Actions` to start the application with a hot reload.

![start_hotswap.png](/images/hotswap/start_hotswap.png){v-zoom}

::: details If you find it cumbersome to open `More Actions` every time, you can place the button in the `Main Toolbar`

For example, add a button on the right side as shown below:

![main_toolbar.png](/images/hotswap/main_toolbar.png){v-zoom}

Search for `Hotswap with DebugTools`. If you want to change the icon, you can also modify it below.

![add_hotswap_action.png](/images/hotswap/add_hotswap_action.png){v-zoom}

This will allow you to click from outside the application.

![start_hotswap_toolbar.png](/images/hotswap/start_hotswap_toolbar.png){v-zoom}

:::

::: tip
Hot reload requires a specific JDK to take effect. Please refer to [JDK installation](install#jdk) to complete JDK initialization
:::

> If the startup project prompts `DCEVM is not installed`, check whether the [JDK installation](install#jdk) is correct. JDK8 Check whether the command `java -XXaltjvm=dcevm -version` can be output normally.
> ![dcevm_not_install.png](/images/hotswap/dcevm_not_install.png){v-zoom}

## 2. Trigger hot reload

Start the application in debug mode. The project outputs the following log and prints the loaded hot reload plug-in.

```text
DebugTools: 2025-01-07 16:41:07.909 INFO [main] i.g.f.d.t.h.c.HotswapAgent 44 : open hot reload unlimited runtime class redefinition.{3.3.0}
DebugTools: 2025-01-07 16:41:08.498 INFO [main] i.g.f.d.t.h.c.c.PluginRegistry 132: Discovered plugins: [JdkPlugin, ClassInitPlugin, AnonymousClassPatch, WatchResources, HotSwapper, Proxy, Spring, Solon, Mybatis]
```

### 2.1 Debug hot update {#compile-reload-file}

If the application is started by `Debug`, hot reload can be triggered by the following method, and breakpoint information can also be updated.

- Use the `Compile and Reload Modified Files` button in the right-click menu.

![compile_reload_file.png](/images/hotswap/compile_reload_file.png){v-zoom}

- Use the `Code changed` button on the main file page.

![compile_code_changed.png](/images/hotswap/compile_code_changed.png){v-zoom}

### 2.2 Hot deployment

Hot deployment can send changes to remote applications, and it can also deploy local changes to an already attached target application.

For detailed configuration and operation steps, see [Hot Deploy](./hot-deploy.md).

### 2.3 Single file remote compilation

<!--@include: ./parts/hot-deploy-one-file.md-->

::: tip
During hot deployment, idea may sometimes fail to obtain the latest breakpoint information. If you need to update the breakpoint in time, please use [Method 1](#compile-reload-file)
:::

### 2.4 Single XML file

Open the context menu in an XML file editor or project tree, then click `Compile "xxx.xml" to target directory`. The plugin saves the current XML file and writes it to the current module's compilation output directory by its relative path from the source root.

![hot_reload_xml_context_menu.png](/images/hotswap/hot_reload_xml_context_menu.png){v-zoom}

::: tip
- This operation only overwrites the resource file in the compilation output directory. It does not modify the XML file in the source directory.
- The XML file must be under a project source root or resource root. Otherwise, the plugin cannot calculate the relative path to write into `target/classes`.
- You can also trigger XML updates by recompiling the project through [Method 1](#compile-project).
:::

## 3. In which cases can hot reload be performed

### 3.1 Ordinary class files

- Add new class files
- **Add/modify** **properties/methods/inner classes** in existing classes.
- Anonymous inner class
- Enumeration class

Click [class file hot reload](hot-reload-class.md) for details

:::tip Pay special attention to changes in static information

<span style="color: red;">Hot reloading of static fields will cause the values initialized at compile time to overwrite the values at runtime</span>. See [click](hot-reload-class#static-change) for details.

:::

### 3.2 Proxy class

- Java JDK proxy class.
- Cglib proxy class.

Click [proxy class hot reload](hot-reload-proxy.md) for details

### 3.3 SpringBoot Bean

- Controller
- Service
- Component
- Repository

Click [SpringBoot](hot-reload-springboot.md) for details

### 3.4 MyBatis

- Mapper (new/modified)

- Xml (new/modified)

::: tip Note

MyBatis currently supports `Spring` environment, other situations are unknown.

:::

Click [MyBatis](hot-reload-mybatis.md) for details

### 3.5 MyBatisPlus

- Entity (new/modified)

- Mapper (new/modified)

- Xml (new/modified)

::: tip

MyBatisPlus currently supports `Spring` environment, other situations are unknown.

:::

Click [MyBatisPlus](hot-reload-mybatis-plus.md) for details

### 3.6 dynamic-datasource

- `@DS` annotation added
- `@DS` annotation modified

Click [DynamicDatasource](dynamic-datasource.md) for details

### 3.7 HuTool

Support [hutool](https://hutool.cn) hot reload

- `ReflectUtil` reflection tool class
- `BeanDesc` bean descriptor
- `JSONUtil` json tool class

### 3.8 Gson

Support [Gson](https://github.com/google/gson) toolkit hot reload

### 3.9 EasyExcel

Support [EasyExcel](https://github.com/alibaba/easyexcel) hot reload

### 3.10 Jackson

Support [Jackson](https://github.com/FasterXML/jackson-databind) hot reload

### 3.11 FastJson、FastJson2

Support [FastJson](https://github.com/alibaba/fastjson)、[FastJson2](https://github.com/alibaba/fastjson2) hot reload

### 3.12 hibernate-validator

Support [hibernate-validator](https://github.com/hibernate/hibernate-validator) hot reload

### 3.13 Solon

Support [Solon](https://solon.noear.org) class and container hot reload

- `Controller`
- `Component`
- `Configuration`
- ...

Click [Solon](hot-reload-solon.md) for details

### 3.14 OpenFeign

Supports hot reload of [OpenFeign](https://github.com/OpenFeign/feign)

- Supports adding/modifying interfaces annotated with `@FeignClient`

### 3.15 Forest

Supports hot reload of [Forest](https://github.com/dromara/forest)

- Supports adding/modifying interfaces and other components

### 3.16 Others

Hot reload can also be used in other situations. I won’t give examples here. If it doesn’t work, please submit an [issue](https://github.com/future0923/debug-tools/issues) to give feedback.

## 4. Disable Hot Reload Plugins

If a hot reload plugin has compatibility issues in the current project, temporarily disable the specified plugin in `Settings | DebugTools | Hot Reload`, then restart the application with hot reload.

![hot_reload_disable_plugins.png](/images/hotswap/hot_reload_disable_plugins.png){v-zoom}

`Disabled Plugins` writes the selected plugin names into the hot reload startup parameter `disabledPlugins`. During Agent initialization, plugins with matching names are skipped. This is useful for temporarily avoiding startup exceptions, class transformation exceptions, or hot reload side effects caused by a specific framework plugin.

Available plugins are grouped by type:

| Group | Plugins |
| --- | --- |
| Base | `JdkPlugin`, `Class`, `Proxy`, `HotSwapper`, `WatchResources` |
| Third Party | `Spring`, `Feign`, `MyBatis`, `Solon` |
| Other | `IntelliJIdea`, `HibernateValidator`, `EasyExcel`, `Gson`, `FastJson`, `HuTool` |

::: warning
- This configuration only affects applications started with hot reload after the setting changes. Already running applications do not unload plugins immediately.
- Disabling a plugin also disables the corresponding capability. For example, after disabling `Spring`, hot reload capabilities related to adding or modifying Spring Beans stop working.
- If you are only troubleshooting, disable one plugin at a time, confirm the impact, then decide whether to keep it disabled.
:::
