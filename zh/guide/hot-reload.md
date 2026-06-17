# 热重载 <Badge type="warning" text="beta" /> {#hot-reload} 

::: info
热重载实现复杂且需要兼容情况较多，如果这个项目帮你节省了开发时间，不妨点个 <a target="_blank" href="https://github.com/future0923/debug-tools"><img src="https://img.shields.io/github/stars/future0923/debug-tools?style=flat&logo=GitHub" style="display: inline-block; vertical-align: middle;" /></a> <a target="_blank" href="https://gitee.com/future94/debug-tools"><img src="https://gitee.com/future94/debug-tools/badge/star.svg?theme=dark" style="display: inline-block; vertical-align: middle;" /></a>，你的认可会让更多人发现它，你的支持是我更新的动力。如果不生效麻烦提交 <a target="_blank" href="https://github.com/future0923/debug-tools/issues"><img src="https://img.shields.io/github/issues-closed/future0923/debug-tools?style=flat&logo=github" style="display: inline-block; vertical-align: middle;" /></a> 反馈一下。
:::

传统编写代码时，需要重启应用才能生效，而热重载可以在不重启应用下让编写的代码生效立刻，让开发者编写的代码改动瞬间生效，极大提升迭代效率。支持类(包括代理类)的属性和方法变动、Spring、Solon、Mybatis等主流框架。同时适配 jdk8、jdk11、jdk17、jdk21、jdk25 等多个JDK版本。

## 1. 开启热重载

- 请关掉idea的 `Build, Execution, Deployment -> Debugger -> Async Stack Traces` 配置 

![instrumenting_agent.png](/images/instrumenting_agent.png){v-zoom}

- 点击 `More Actions` 中的 `Hotswap 'xxx' with DebugTools` 以热重载的方式启动应用。

![start_hotswap.png](/images/start_hotswap.png){v-zoom}

::: details 如果觉得每次都要展开 `More Actions` 比较繁琐，可以将按钮配置在 `Main Toolbar` 中

比如在右侧添加按钮如下图所示：

![main_toolbar.png](/images/main_toolbar.png){v-zoom}

搜索 `Hotswap with DebugTools`，如果想调 Icon 也可以在下面修改。

![add_hotswap_action.png](/images/add_hotswap_action.png){v-zoom}

这样就可以在外面点击了

![start_hotswap_toolbar.png](/images/start_hotswap_toolbar.png){v-zoom}

:::

::: tip
- 热重载需要特定的jdk才能生效，请先参考[JDK安装](install#jdk)完成JDK的初始化。
- 不更换jdk也可以使用热重载，只是无法更改类的签名(推荐更换jdk)。
:::

> 启动项目如果提示 `DCEVM is not installed` ，检查[JDK安装](install#jdk)是否正确。JDK8 检查命令 `java -XXaltjvm=dcevm -version` 是否能正常输出。
> ![dcevm_not_install.png](/images/dcevm_not_install.png){v-zoom}




## 2. 触发热重载

热重载是通过 `debug` 方式启动应用，项目输出如下日志，并打印载入的热重载插件。

```text
DebugTools: 2025-01-07 16:41:07.909    INFO [main] i.g.f.d.t.h.c.HotswapAgent 44 : open hot reload unlimited runtime class redefinition.{3.3.0}
DebugTools: 2025-01-07 16:41:08.498    INFO [main] i.g.f.d.t.h.c.c.PluginRegistry 132 : Discovered plugins: [JdkPlugin, ClassInitPlugin, AnonymousClassPatch, WatchResources, HotSwapper, Proxy, Spring, MyBatis]
```

### 2.1 Debug热更新 {#compile-reload-file}

- 通过右键菜单的 `Compile and Reload Modified Files` 按钮.
  
![compile_reload_file.png](/images/compile_reload_file.png){v-zoom}

- 文件主页面的 `Code changed` 按钮.

![compile_code_changed.png](/images/compile_code_changed.png){v-zoom}

### 2.2 热部署

热部署能发远程应用，当然也可以用于将本地变更部署到已经附着的目标应用。

详细配置和操作请查看[热部署](./hot-deploy)。

### 2.3 单文件远程编译

<!--@include: ./parts/hot-deploy-one-file.md-->

::: tip
热部署时idea可能有时无法获取到最新的断点信息，如果需要及时更新断点请使用[方式1](#compile-reload-file)
:::

### 2.4 单 XML 文件

在 XML 文件的编辑器或项目树中打开右键菜单，点击 `编译 "xxx.xml" 到target目录`，插件会先保存当前 XML 文件，再按源码根下的相对路径写入当前模块的编译输出目录。

![hot_reload_xml_context_menu.png](/images/method/hot_reload_xml_context_menu.png){v-zoom}

::: tip
- 这个操作只覆盖编译输出目录中的资源文件，不会修改源码目录下的 XML。
- XML 文件需要位于项目源码根或资源根下，否则插件无法计算写入 `target/classes` 的相对路径。
- 也可以通过[方式1](#compile-project)重新编译项目来触发 XML 文件更新。
:::

## 3. 哪些情况可以热重载

### 3.1 普通的class文件

- 新增类文件
- 存在的类 **增加/修改** 类中的 **属性/方法/内部类**。
- 匿名内部类
- 枚举类

详细点击 [class文件热重载](hot-reload-class.md) 查看

::: tip 静态信息变动特别注意
静态字段<span style="color: red;">热重载会编译时初始化的值覆盖掉运行时的值</span>，具体[点击](hot-reload-class#static-change)查看
:::

### 3.2 代理类

- java JDK 代理类。
- Cglib 代理类。

详细点击 [代理类热重载](hot-reload-proxy.md) 查看

### 3.3 SpringBoot Bean

- Controller
- Service
- Component
- Repository

详细点击 [SpringBoot](hot-reload-springboot.md) 查看

### 3.4 MyBatis

- Mapper（新增/修改）
- Xml（新增/修改）

::: tip 注意

MyBatis 目前支持在 `Spring` 环境下，其他情况未知。

:::

详细点击 [MyBatis](hot-reload-mybatis.md) 查看

### 3.5 MyBatisPlus

- Entity（新增/修改）
- Mapper（新增/修改）
- Xml（新增/修改）

::: tip 注意

MyBatisPlus 目前支持在 `Spring` 环境下，其他情况未知。

:::

详细点击 [MyBatisPlus](hot-reload-mybatis-plus.md) 查看

### 3.6 dynamic-datasource

- `@DS`注解新增
- `@DS`注解修改

详细点击 [DynamicDatasource](dynamic-datasource.md) 查看

### 3.7 HuTool

支持 [hutool](https://hutool.cn) 热重载

- `ReflectUtil` 反射工具类
- `BeanDesc` bean描述符
- `JSONUtil` json工具类

### 3.8 Gson

支持 [Gson](https://github.com/google/gson) 工具包热重载

### 3.9 EasyExcel

支持 [EasyExcel](https://github.com/alibaba/easyexcel) 热重载

### 3.10 Jackson

支持 [Jackson](https://github.com/FasterXML/jackson-databind) 热重载

### 3.11 FastJson、FastJson2

支持 [FastJson](https://github.com/alibaba/fastjson)、[FastJson2](https://github.com/alibaba/fastjson2)热重载

### 3.12 hibernate-validator

支持 [hibernate-validator](https://github.com/hibernate/hibernate-validator) 工具包热重载

### 3.13 Solon

支持 [Solon](https://solon.noear.org) 类及容器热重载

- `Controller`
- `Component`
- `Configuration`
- ...

详细点击 [Solon](hot-reload-solon.md) 查看

### 3.14 OpenFeign

支持 [OpenFeign](https://github.com/OpenFeign/feign) 热重载

- 支持 `@FeignClient` 注解标记的接口新增/修改

### 3.15 其他

其他情况热重载尝试一下，这里不一一举例了，如果不能生效麻烦提交个 [issues](https://github.com/future0923/debug-tools/issues) 反馈一下。

## 4. 禁用热重载插件

如果某个热重载插件在当前项目中存在兼容问题，可以先在 `Settings | DebugTools | 热重载` 中临时禁用指定插件，再重新以热重载方式启动应用。

![hot_reload_disable_plugins.png](/images/method/hot_reload_disable_plugins.png){v-zoom}

`禁用插件` 会把选中的插件名称写入热重载启动参数 `disabledPlugins`。Agent 初始化时会根据插件名跳过对应插件，适合用于临时规避某个框架插件引起的启动异常、类转换异常或热重载副作用。

可选插件按类型分组：

| 分组 | 插件 |
| --- | --- |
| Base | `JdkPlugin`、`Class`、`Proxy`、`HotSwapper`、`WatchResources` |
| Third Party | `Spring`、`Feign`、`MyBatis`、`Solon` |
| Other | `IntelliJIdea`、`HibernateValidator`、`EasyExcel`、`Gson`、`FastJson`、`HuTool` |

::: warning
- 这个配置只影响后续重新启动的热重载应用；已经启动的应用不会因为修改设置立即卸载插件。
- 禁用插件会关闭对应能力。例如禁用 `Spring` 后，Spring Bean 新增/修改相关的热重载能力也会失效。
- 如果只是排查问题，建议一次只禁用一个插件，确认影响范围后再决定是否长期保留。
:::
