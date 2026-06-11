# 快速调用 Java 方法 {#method-invoke}

DebugTools 支持在 IntelliJ IDEA 中直接调用项目内的 Java 方法，本地和远程都支持，支持多个应用多个方法同时调用。

无需新增 Controller、编写临时测试用例或从请求入口逐层触发，只需要选择目标方法、填写参数并执行，即可快速验证业务逻辑。

## 适用场景 {#use-cases}

可调用普通类方法、静态方法、Spring Bean 方法、Dubbo 服务、XXL-JOB 任务、MQ 消费方法、MyBatis Mapper 方法、流式 SSE 响应等。

- 验证某个 Service、Mapper、工具类或组件方法的返回结果
- 跳过 Controller、网关、鉴权、参数组装等外层流程，直接调试核心业务逻辑
- 快速调用 Spring 管理的 Bean 方法，包括 Dubbo、XXL-JOB、MQ 等框架内的方法
- 调用 MyBatis Mapper 方法，验证 SQL 参数、查询结果和执行耗时
- 给方法传递复杂参数、Header 参数或 XXL-JOB 参数
- 远程调用目标应用方法，并配合远程 Debug 定位问题
- 结合 [热重载](../hot-reload) 修改代码后立即再次调用验证

## 快速开始

### 附着应用

在 `toolwindow` 中点击附着按钮查看当前可以附着的应用

![attach_local.png](/images/method/attach_local.png){v-zoom}

双击或点击下面的附着按钮附着应用（单击下面的可以展示详细内容）

![attach_list.png](/images/method/attach_list.png){v-zoom}

在连接管理列表可以查看已附着的应用（可以附着多个应用）

![connection_list.png](/images/method/connection_list.png){v-zoom}

### 选择方法

在 `方法行头` 和 `方法体内右键菜单` 都可以点击唤醒调用方法窗口（支持多个方法）

![method_invoke_position.png](/images/method/method_invoke_position.png){v-zoom}

在 `toolwindows` 中查看调用方法窗口

![method_invoke_panel.png](/images/method/method_invoke_panel.png){v-zoom}  

### 填写参数并运行

填写方法参数信息，支持复杂参数、Header 参数、前后置脚本或 XXL-JOB 参数等后点击运行

![method_param.png](/images/method/method_param.png){v-zoom}

### 查看结果

`toString` 方式查看运行结果

![result_to_string.png](/images/method/result_to_string.png){v-zoom}

`JSON` 方式查看运行结果

![result_json.png](/images/method/result_json.png){v-zoom}

`Debug` 方式查看运行结果（与 idea 的断点查看效果基本一致）

![result_debug.png](/images/method/result_debug.png){v-zoom}
   
::: tip
还有 `Exception` 、 `SSE流式` 、`Trace` 等特殊情况查看运行结果方式，后续会详细介绍
:::