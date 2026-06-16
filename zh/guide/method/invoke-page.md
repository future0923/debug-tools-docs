# 方法调用

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

方法调用页是每个目标方法独立的请求工作台。打开方法后，DebugTools 会在工具窗口中创建一个请求标签页，用于选择附着应用和 ClassLoader、填写参数、Header、脚本等请求内容，并展示本次调用结果。

## 打开方法调用

在方法行头或方法体右键菜单中点击调用方法入口，会为当前方法创建请求标签页。标签页名称使用 `类名#方法名`，鼠标悬停方法输入框可以查看完整类名、参数类型和返回类型。

![method_invoke_position.png](/images/method/method_invoke_position.png){v-zoom}

可以同时打开多个方法请求。切换标签页时，每个方法自己的参数、目标连接和结果区域会独立保留，适合在多个 Service、Mapper、Job 方法之间反复验证。

## 页面工具栏

方法调用页的工具栏用于处理当前请求页，不会影响其他方法请求。

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/attach.svg" alt="附着" /> | `附着` | 打开本地 JVM 进程列表，附着后应用会出现在应用下拉框中。 |
| <img class="dt-table-icon" src="/icon/method/idea_locate.svg" alt="定位当前方法源码" /> | `定位当前方法源码` | 跳回当前方法源码位置，便于在参数和实现之间切换。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> | `刷新` | 重新加载应用和 ClassLoader，并重新探测当前方法适合的连接。 |
| <img class="dt-table-icon" src="/icon/method/idea_copy.svg" alt="复制请求参数" /> | `复制请求参数` | 复制当前参数 JSON，内容与方法参数页签中可见文本一致。 |
| <img class="dt-table-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> | `保存请求参数` | 保存当前请求表单到方法参数缓存，下次打开同一方法时自动恢复。 |
| <img class="dt-table-icon" src="/icon/method/idea_execute.svg" alt="请求" /> | `请求` | 使用当前应用、ClassLoader 和请求表单执行方法调用。 |

点击 <img class="dt-inline-icon" src="/icon/method/idea_execute.svg" alt="请求" /> 后，请求按钮会进入 `请求中...` 状态。新请求开始时，页面会清空上一轮结果，避免旧结果和当前请求混在一起。


## 选择调用目标应用

页面顶部包含应用和 ClassLoader 两个下拉框：

- 应用下拉框展示当前项目已经附着或远程连接的应用，格式为 `应用名 · 本地` 或 `应用名 · 远程`。连接设置了备注时，会优先展示备注，鼠标悬停可以展示详细信息。
- ClassLoader 下拉框绑定当前应用。应用连接正常时会自动刷新并选择远端默认 ClassLoader。
- 当同时存在多个连接时，页面会尝试自动选择包含当前方法所在类的应用和 ClassLoader。

::: tip
- 系统已经做了自动选择各种情况的类加载器，绝大多数情况下不需要手动选择。
- ClassLoader 选错时，常见表现是目标 JVM 找不到类、Bean 或方法。
- 多模块应用、插件化应用、Spring Boot DevTools 场景下，优先选择能加载当前业务类的 ClassLoader。
- idea 中 shorten command line 的 classpath file 模式启动应用默认类加载器也会变
:::

## 携带参数

### 方法参数

方法参数JSON 是 DebugTools 调用 Java 方法时使用的入参协议。根对象的每个字段对应一个方法参数，字段名通常是 Java 方法参数名，字段值固定包含 `type` 和 `content`：

```json
{
  "[参数名]": {
    "type": "[类型]",
    "content": "[参数内容]"
  }
}
```

`type` 决定目标 JVM 如何把 `content` 转成真实入参。

常用类型包括 `simple`、`json_entity`、`enum`、`bean`、`lambda`、`request`、`response`、`file`、`class` 等。

详细格式、每种类型示例、各种操作使用详见 [方法参数JSON](./param-json)。

### 请求头

`请求头` 页签填写本次方法调用携带的 Header。只勾选启用的 Header 会参与调用，适合传递鉴权、租户、语言、灰度标识等上下文。

DebugTools 支持方法级、连接级、项目级三种 Header 设置方式，最终优先级为 `方法级 > 连接级 > 项目级`。

详细配置入口、合并规则和使用建议详见 [请求头](./request-header)。

### 方法脚本

`方法脚本` 页签选择 java 脚本。

脚本可以在目标方法调用 `前`、`后`、`异常时`、`最终处理完成` 时执行对应的代码。

帮助处理参数、结果或上下文，适合临时补齐登录态、环境变量、ThreadLocal 等调用前置条件。

脚本入口、模板方法、执行顺序和示例详见 [方法前后置脚本](./method-script)。

### XxlJob

`XxlJob` 页签填写 XXL-JOB 调度参数，内容会作为一段普通字符串随本次请求发送。

目标 JVM 执行方法前，DebugTools 会把这段字符串写入 XXL-JOB 上下文。

目标方法内部如果通过 `XxlJobHelper.getJobParam()`、`XxlJobContext.getXxlJobContext().getJobParam()` 等 XXL-JOB API 读取任务参数，就会读到这里填写的内容。

![method_invoke_xxl_job.png](/images/method/method_invoke_xxl_job.png){v-zoom}

例如截图中调用 `LeaseBrokerWageJob#execute()`，`XxlJob` 页签填写 `2`。如果该任务方法内部读取 XXL-JOB 任务参数，就会得到字符串 `2`。

::: tip
- 这里填写的内容不会进入方法参数 JSON，也不会作为目标方法的某个入参传入。
- 如果方法本身有入参，仍然需要在 `方法参数` 页签中填写。
- 普通方法或不依赖 XXL-JOB 上下文的方法可以留空。留空时，本次调用不会额外设置 XXL-JOB 参数。
:::

### 链路耗时

`链路耗时` 页签用于打开本次调用的 Trace。启用后可以配置最大深度，并选择是否记录 MyBatis、SQL、是否跳过 get/set 方法，还可以用业务包和忽略包缩小采集范围。

调用完成后，结果区会出现追踪视图，用于查看方法调用链路、SQL 和耗时信息。

详细配置项、结果树操作和使用建议见 [链路耗时](./trace-method)。

### Reactive

当目标方法返回 `Flux`、`Mono`、`org.reactivestreams.Publisher` 或 `java.util.concurrent.Flow.Publisher` 时，页面会显示 `Reactive` 页签。这里的配置只影响工具窗口展示，不改变远端方法执行逻辑。

调试大模型、Agent、SSE 等 AI 流式接口时，它可以把分段事件直接提取并拼接成连续结果，是排查 AI 流式输出的调试神器。

`返回后先展示` 可以选择事件列表或提取结果。使用提取结果时，`提取路径` 支持按 JSON Path 从流式 `data` 中取值并拼接，例如 `$.content`；也可以用 `$[event].path` 只提取指定 SSE event 的字段。

详细展示方式、提取路径规则和停止订阅说明见 [Reactive](./reactive)。

## 查看结果

请求返回前，结果区显示 `暂无请求结果`。响应到达后，结果区会按本次返回类型切换为普通结果、异常结果或 Reactive 流式结果。普通调用如果开启了链路耗时，还会额外出现 `追踪` 页签。

### toString

`toString` 是普通调用成功后的默认页签，用来快速查看目标方法返回值的文本形式。

![result_to_string.png](/images/method/result_to_string.png){v-zoom}

- `void` 方法显示 `Void`。
- 返回 `null` 时显示 `NULL`。
- 返回数字、字符串、布尔值、日期等简单类型时，显示转换后的文本。
- 返回对象时，显示对象自己的 `toString()` 结果。如果业务类没有重写 `toString()`，这里通常只会看到类似 `com.example.User@xxxx` 的对象标识。

### JSON

`JSON` 页签会把结果转换成 JSON 文本展示

![result_json.png](/images/method/result_json.png){v-zoom}

不同返回类型的展示方式略有区别：

- `void` 会展示为包含 `Void` 的结果对象。
- `null` 会展示为包含 `Null` 的结果对象。
- 简单类型会包装到 `result` 字段中展示。
- 对象类型会在切换到 `JSON` 页签时，再从目标应用读取对象详情并序列化。

### 调试

`调试` 页签把返回结果展示成可展开的树，适合查看对象字段、集合元素、Map 键值和嵌套结构。

![result_debug.png](/images/method/result_debug.png){v-zoom}

普通对象会在切换到 `调试` 页签时按需读取对象详情。树节点展开后，可以继续查看子字段和值；对于只想确认某个字段是否正确的场景，通常比复制整段 JSON 更直观。

::: tip
- `void` 和 `null` 返回值不支持调试树展开。
- 简单类型会作为 `result` 叶子节点展示。
:::

### exception

方法抛出异常、参数解析失败、目标类或方法查找失败时，结果区会显示异常结果。异常结果包含 `控制台` 和 `调试` 两个页签：

- `控制台` 页签展示异常堆栈，适合复制错误信息、定位抛错类和行号。

![result_exception_console.png](/images/method/result_exception_console.png){v-zoom}

- `调试` 页签展示异常对象详情，适合查看异常类型、message、cause、suppressed 等结构化信息。

![result_exception_debug.png](/images/method/result_exception_debug.png){v-zoom}

异常结果不会进入普通返回值的 `toString`、`JSON` 页签。修正参数、Header、ClassLoader 或目标方法代码后，再次点击 <img class="dt-inline-icon" src="/icon/method/idea_execute.svg" alt="请求" /> 会清空旧异常并展示新结果。

### 追踪

`追踪` 页签用于查看本次方法调用采集到的 Trace 树。只有在 `链路耗时` 页签勾选 `追踪方法耗时` 并成功完成调用后，结果区才会显示这个页签。

![method_trace_result_tree.png](/images/method/method_trace_result_tree.png){v-zoom}

详细配置项、节点说明和结果树操作见 [链路耗时](./trace-method)。

### Reactive

当目标方法返回 Reactive 类型时，结果区会在首个流式事件到达后切换为流式结果面板，而不是普通的 `toString`、`JSON`、`调试` 页签。

![method_reactive_sse.gif](/images/method/method_reactive_sse.gif){v-zoom}

详细配置项、提取路径写法和示例见 [Reactive](./reactive)。

## 调用历史

方法调用完成后，如果已开启调用历史，DebugTools 会把本次请求和结果保存到本机。

需要重新运行、回看返回值、失败堆栈，或复用之前的参数继续调试时。

![invoke_record_tree.png](/images/method/invoke_record_tree.png){v-zoom}

详细操作见 [调用历史](./invoke-record)。
