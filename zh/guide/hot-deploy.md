# 热部署 <Badge type="warning" text="beta" /> {#hot-deploy}

::: info
热部署实现复杂且需要兼容情况较多，如果这个项目帮你节省了开发时间，不妨点个 <a target="_blank" href="https://github.com/future0923/debug-tools"><img src="https://img.shields.io/github/stars/future0923/debug-tools?style=flat&logo=GitHub" style="display: inline-block; vertical-align: middle;" /></a> <a target="_blank" href="https://gitee.com/future94/debug-tools"><img src="https://gitee.com/future94/debug-tools/badge/star.svg?theme=dark" style="display: inline-block; vertical-align: middle;" /></a>，你的认可会让更多人发现它，你的支持是我更新的动力。如果不生效麻烦提交 <a target="_blank" href="https://github.com/future0923/debug-tools/issues"><img src="https://img.shields.io/github/issues-closed/future0923/debug-tools?style=flat&logo=github" style="display: inline-block; vertical-align: middle;" /></a> 反馈一下。
:::

## 1. 什么是热部署

传统的部署流程一般为 `提交代码->拉取代码->打包->部署->重启项目` 后才能让编写的代码生效。

热部署可以跳过这繁琐的流程，开发者修改代码后无需手动触发打包或重启服务，应用即可`秒级`加载新逻辑并运行，极大缩短反馈周期。

热部署基于 [热重载](hot-reload) 实现，热重载仅支持本地环境，热部署则让远程应用也可以热重载。

## 2. 开启热部署

::: tip
热部署需要特定的jdk才能生效，请先参考[JDK安装](install#jdk)完成JDK的初始化。
:::

热部署需要下载 debug-tools-agent.jar

::: code-group

```text [网址]
https://download.debug-tools.cc/debug-tools-agent.jar
```

```sh [手动构建]
git clone https://github.com/future0923/debug-tools.git
cd debug-tools
# 目前maven打包需要使用 `java17+` 版本构建。
mvn clean install -T 2C -Dmaven.test.skip=true
# dist目录下
# debug-tools-agent.jar 远程agent包
```

```text [github]
https://github.com/future0923/debug-tools/releases
```

```text [gitee]
https://gitee.com/future94/debug-tools/releases
```

:::

### 2.1 添加JVM参数

【Java 8】 启动时添加如下的 JVM 参数。

```shell
-XXaltjvm=dcevm -javaagent:${agentPath}/debug-tools-agent.jar=${conf}
```

【Java 11】启动时添加如下的 JVM 参数。

```shell
-javaagent:${agentPath}/debug-tools-agent.jar=${conf} --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/jdk.internal.loader=ALL-UNNAMED --add-opens java.base/java.io=ALL-UNNAMED --add-opens java.desktop/java.beans=ALL-UNNAMED --add-opens java.desktop/com.sun.beans=ALL-UNNAMED --add-opens java.desktop/com.sun.beans.introspect=ALL-UNNAMED --add-opens java.desktop/com.sun.beans.util=ALL-UNNAMED --add-opens java.base/sun.security.action=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED --add-opens java.base/java.net=ALL-UNNAMED
```

【Java 17/21】启动时添加如下的 JVM 参数。

```shell
-XX:+AllowEnhancedClassRedefinition -javaagent:${agentPath}/debug-tools-agent.jar=${conf} --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/jdk.internal.loader=ALL-UNNAMED --add-opens java.base/java.io=ALL-UNNAMED --add-opens java.desktop/java.beans=ALL-UNNAMED --add-opens java.desktop/com.sun.beans=ALL-UNNAMED --add-opens java.desktop/com.sun.beans.introspect=ALL-UNNAMED --add-opens java.desktop/com.sun.beans.util=ALL-UNNAMED --add-opens java.base/sun.security.action=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED --add-opens java.base/java.net=ALL-UNNAMED
```

- `agentPath` 为 debug-tools-agent.jar 的路径
- `conf` 为传入 agent 的配置信息，格式为 `key1=value1,key2=value2`

### 2.2 可选配置

| 可选key项                | 含义                           | value取值                 | 取值示例                                               |
|-----------------------|------------------------------|-------------------------|----------------------------------------------------|
| applicationName       | 应用名称                         | 附着应用的名称，不传也可以自动获取       | DebugTools                                         |
| hotswap               | 是否开启热重载/热部署                  | true:开启 <br /> false:关闭 | ture                                               |
| server                | 是否启动Server给客户端连接             | true:开启 <br /> false:关闭 | ture                                               |
| tcpPort               | 监听的TCP端口 (server=true时才生效)   | 可用端口                    | 12345                                              |
| httpPort              | 监听的HTTP端口  (server=true时才生效) | 可用端口                    | 22222                                              |
| printSql              | 是否打印执行的SQL语句                 | true:开启 <br /> false:关闭 | ture                                               |
| ignoreStaticFieldPath | 热重载时忽略哪些静态配置路径               | 配置文件地址                  | /etc/debug-tools/conf/debug-tools-ignore.conf      |
| propertiesFilePath    | 外部配置文件路径                     | 配置文件地址                  | /etc/debug-tools/conf/debug-tools-agent.properties |

propertiesFilePath 配置

| key                         | 含义                                                                                                    | 默认值                              |
|-----------------------------|-------------------------------------------------------------------------------------------------------|----------------------------------|
| applicationName             | 应用的名称(同上面)                                                                                            | 根据规则自动获取                         |
| hotswap                     | 是否开启热重载/热部署 (同上面)                                                                                     | true                             |
| server                      | 是否启动Server给客户端连接 (同上面)                                                                                | true                             |
| tcpPort                     | 监听的TCP端口 (server=true时才生效) (同上面)                                                                      | 默认从 12345 开始递增寻找可用端口             |
| httpPort                    | 监听的HTTP端口  (server=true时才生效) (同上面)                                                                    | 默认从 22222 开始递增寻找可用端口             |
| lombokJarPath               | lombok.jar 路径，远程动态编译时如果使用了lombok需要指定才能编译 (同上面)                                                        | -                                |
| printSql                    | 是否打印执行的SQL语句                                                                                          | false                            |
| includedClassLoaderPatterns | 要初始化热重载/热部署的ClassLoader。 与 excludedClassLoaderPatterns 只能同时配置一个                                       | -                                |
| excludedClassLoaderPatterns | 要排除初始化重载/热部署的ClassLoader。 与 includedClassLoaderPatterns 只能同时配置一个                                      | -                                |
| pluginPackages              | 扫描其它路径上编写的插件，多个路径逗号分隔                                                                                 | -                                |
| extraClasspath              | MacOS/Linux 加载扩展的class文件路径                                                                            | /var/tmp/debug-tools/classes     |
| extraClasspathWin           | Windows 加载扩展的class文件路径                                                                                | c:/var/tmp/debug-tools/classes   |
| watchResources              | MacOS/Linux 监听资源路径                                                                                    | /var/tmp/debug-tools/resources   |
| watchResourcesWin           | Windows 监听资源路径                                                                                        | c:/var/tmp/debug-tools/resources |
| spring.basePackagePrefix    | Spring基础package前缀，多个路径逗号分隔                                                                            | -                                |
| disabledPlugins             | 禁用的插件，多个逗号分隔                                                                                          | -                                |
| autoHotswap                 | 是否自动热重载。在 ClassLoader 的 resources 路径下监视更改的类文件后在运行中的应用程序中重新加载类定义。它使用Java Instrumentation API来重新加载类字节码。 | false                            |
| autoHotswap.port            | JPDA连接端口，监听更改文件后进行热重载，启动时需要指定JPDA端口。                                                                  | -                                |

默认配置文件示例：

```properties
# 应用名称
applicationName=
# 是否开启热重载/热部署
hotswap=true
# 是否启动Server给客户端连接
server=true
# 监听的TCP端口 (server=true时才生效)
# 默认从 12345 开始递增寻找可用端口
tcpPort=
# 监听的HTTP端口  (server=true时才生效)
# 默认从 22222 开始递增寻找可用端口
httpPort=
# 是否打印执行的SQL语句
printSql=false
# 要初始化重载/热部署的ClassLoader。 与 excludedClassLoaderPatterns 只能同时配置一个
includedClassLoaderPatterns=
# 要排除初始化重载/热部署的ClassLoader。 与 includedClassLoaderPatterns 只能同时配置一个
excludedClassLoaderPatterns=
# 扫描其它路径上编写的插件，多个路径逗号分隔
pluginPackages=
# 加载扩展的class文件路径
extraClasspath=/var/tmp/debug-tools/classes
extraClasspathWin=c:/var/tmp/debug-tools/classes
# 监听资源路径，多个逗号分隔
watchResources=/var/tmp/debug-tools/resources
watchResourcesWin=c:/var/tmp/debug-tools/resources
# lombok.jar 路径
# 远程动态编译时如果使用了lombok需要指定才能编译
lombokJarPath=
# Spring基础package前缀，多个路径逗号分隔
spring.basePackagePrefix=
# 禁用的插件，多个逗号分隔
disabledPlugins=
# 自动热重载
# 在 ClassLoader 的 resources 路径下监视更改的类文件后在运行中的应用程序中重新加载类定义。
# 它使用Java Instrumentation API来重新加载类字节码。
autoHotswap=false
# JPDA连接端口，监听更改文件后进行热重载，启动时需要指定JPDA端口
# <pre>java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000</pre>
autoHotswap.port=
```

<style>
.dt-inline-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: -3px;
}

.dt-table-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
</style>

## 3. 连接远程服务

远程应用启动时需要已经加载 `debug-tools-agent.jar`，并且 `server=true`。

- 如果没有显式配置端口，Agent 会默认从 `12345` 开始寻找可用 `TCP` 端口，从 `22222` 开始寻找可用 `HTTP` 端口，具体端口以控制台输出为准。
- 如果配置了 `tcpPort`、`httpPort`，后续连接时请使用实际配置的端口。

打开 IDEA 的 `DebugTools` 工具窗口，进入连接管理页。

<!--@include: ./parts/connect-remote.md-->

连接成功后，展开连接卡片并确认 `ClassLoader` 已经选择到要热部署的目标类加载器；后续多文件热部署、单文件远程编译都会基于这个连接发送请求。

::: warning
热部署请求会使用连接卡片中当前选中的 `ClassLoader`。如果目标应用存在多个类加载器，请先选择业务类实际所在的类加载器，再执行热部署；选错后可能出现类找不到、部署成功但不生效等情况。
:::

## 4. 使用热部署

### 4.1 多个文件

在连接管理中确认目标应用已经附着，并且已经选择默认 ClassLoader。

打开连接卡片的更多操作，点击 <img class="dt-inline-icon" src="/icon/method/hot_deployment.svg" alt="热部署" /> 打开热部署窗口。

![hot_deploy_more_menu.png](/images/method/hot_deploy_more_menu.png){v-zoom}

插件会先保存当前 IDEA 中未保存的文件，再按当前选择的文件类型加载可部署文件。

默认会勾选 `版本控制(git/svn)`，此时文件列表来自 VCS 变更；取消勾选后，文件列表来自项目打开后或上一次热部署清理时间之后修改过的文件。

![hot_deploy_multi_file_dialog.png](/images/method/hot_deploy_multi_file_dialog.png){v-zoom}

工具栏可维护本次部署范围：

| 按钮 | 含义 |
| --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_add.svg" alt="添加" /> | 手动添加文件到本次热部署列表。 |
| <img class="dt-table-icon" src="/icon/method/idea_remove.svg" alt="删除" /> | 从本次热部署列表移除当前选中的文件。 |
| <img class="dt-table-icon" src="/icon/method/hot_deploy_clear.svg" alt="清空" /> | 清空本次热部署列表。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="重置" /> | 按当前文件类型和 `版本控制(git/svn)` 设置重新扫描文件。 |
| <img class="dt-table-icon" src="/icon/method/idea_expand_all.svg" alt="全部展开" /> | 展开变更树。 |
| <img class="dt-table-icon" src="/icon/method/idea_collapse_all.svg" alt="全部折叠" /> | 折叠变更树。 |

部署选项决定本次热部署的文件类型和处理方式：

| 选项               | 说明                                                             |
|------------------|----------------------------------------------------------------|
| IntelliJ IDEA 编译 | 由本地 IDEA 编译选中的 Java 文件，再把编译后的 `.class` 发送到目标应用。内部类会和外部类一起发送。   |
| 远程附着应用编译         | 把选中的 Java 源码发送到目标应用，由附着应用远程编译后热部署。                             |
| Java类型           | 部署 `src/main/java` 等 Java 源码根下的 `.java` 文件。                    |
| Resource类型       | 部署 `src/main/resources` 等资源根下的资源文件。资源文件会按资源根相对路径写入目标应用的监听资源目录。 |
| 版本控制(git/svn)    | 勾选后从 VCS 变更读取 Java 或 Resource 文件；取消后按文件修改时间扫描。                 |

窗口主体是变更树，文件会按项目相对路径分组显示，并用 `A`、`M`、`D` 标记新增、修改、删除状态。

如果启用了 `版本控制(git/svn)`，双击文件可以查看变更前后的 diff。

![hot_deploy_vcs_diff.png](/images/method/hot_deploy_vcs_diff.png){v-zoom}

确认文件列表和选项后点击 `OK`。Java 文件会发送到目标应用的 `extraClasspath` 目录并触发类重定义；Resource 文件会发送到目标应用的 `watchResources` 目录。

执行结果会显示在 IDEA 的 Run 工具窗口中，标题为 `远程部署结果`；多应用连接时标题会带上应用名称。

![hot_deploy_multi_file_result.png](/images/method/hot_deploy_multi_file_result.png){v-zoom}

::: tip
- 只有附着应用后才支持通过热部署的方式热重载变动文件。
- 使用远程附着应用编译 Java 文件时，目标应用必须使用 JDK 启动，不能只使用 JRE。
- 如果窗口提示获取默认类加载器失败，请先在目标连接中选择默认 ClassLoader；多 ClassLoader 应用请确认选择的是业务类实际所在的类加载器。
:::

### 4.2 单文件远程编译

<!--@include: ./parts/hot-deploy-one-file.md-->

### 4.3 单 XML 文件远程部署

在 XML 文件的编辑器或项目树中打开右键菜单，点击 `部署 "xxx.xml" 到远程应用`，插件会先保存当前文件，再按资源根计算相对路径，并把 XML 作为资源文件发送到已附着的目标应用热部署。

如果当前项目同时连接了多个应用，点击后会先选择要部署到的连接；执行时会使用该连接卡片中当前选中的 `ClassLoader`。

![hot_deploy_xml_context_menu.png](/images/method/hot_deploy_xml_context_menu.png){v-zoom}

热部署完成后，结果会输出到 IDEA 的 Run 工具窗口，页签标题为 `远程部署结果`；多应用连接时标题会带上应用名称。

![hot_deploy_xml_result.png](/images/method/hot_deploy_xml_result.png){v-zoom}

::: tip
- 只有附着应用后才支持通过热部署的方式热重载变动文件
- XML 文件需要位于项目源码根或资源根下，否则插件无法计算发送到远程应用的资源相对路径。
- 如果窗口提示获取默认类加载器失败，请先在目标连接中选择默认 ClassLoader；多 ClassLoader 应用请确认选择的是业务资源实际所在的类加载器。
:::
