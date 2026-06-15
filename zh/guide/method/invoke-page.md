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

`XxlJob` 页签填写 XXL-JOB 参数。调用 `execute` 等任务方法时，把调度参数写入该文本框，插件会随本次请求一起发送。

![method_invoke_xxl_job.png](/images/method/method_invoke_xxl_job.png){v-zoom}

例如截图中调用 `LeaseBrokerWageJob#execute()`，`XxlJob` 页签填写 `2`，下方结果区返回 `Void`，表示任务方法已经按当前参数完成调用。

### 链路耗时

`链路耗时` 页签用于打开本次调用的 Trace。启用后可以配置最大深度，并选择是否记录 MyBatis、SQL、是否跳过 get/set 方法，还可以用业务包和忽略包缩小采集范围。

调用完成后，结果区会出现追踪视图，用于查看方法调用链路、SQL 和耗时信息。只想验证返回值时可以保持关闭，减少目标应用额外采集开销。

### Reactive

当目标方法返回 `Flux`、`Mono`、`org.reactivestreams.Publisher` 或 `java.util.concurrent.Flow.Publisher` 时，页面会显示 `Reactive` 页签。这里的配置只影响工具窗口展示，不改变远端方法执行逻辑。

`返回后先展示` 可以选择事件列表或提取结果。使用提取结果时，`提取路径` 支持按 JSON Path 从流式 `data` 中取值并拼接，例如 `$.content`；也可以用 `$[event].path` 只提取指定 SSE event 的字段。

## 查看结果

请求返回前，结果区显示 `暂无请求结果`。普通返回值会嵌入结果面板，支持 `toString`、`JSON`、`调试`、`追踪`、`控制台` 等视图，实际出现哪些页签取决于本次返回内容和调用配置。

![result_json.png](/images/method/result_json.png){v-zoom}

`Void` 和 `Null` 返回值可以直接在 `toString` 或文本结果中查看，但不支持调试树展开。方法抛出异常时，结果区会展示异常结果，便于复制堆栈或回到源码继续定位。

对于流式响应，页面会在首次事件到达时切换为流式结果面板。调用未结束时可以点击 `停止` 取消当前流式请求；再次发起请求或关闭标签页时，插件也会主动终止仍在推送的流式响应。

## 参数缓存和调用记录

点击 <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> 会保存当前方法的参数 JSON、Header、XXL-JOB 参数、链路配置和脚本选择。下次打开同一个方法时，页面会自动恢复这些内容。

每次发起请求时，插件会生成调用记录，并在响应回来后补充结果。后续从调用记录恢复请求时，会回填当时的参数 JSON、Header、ClassLoader、XXL-JOB 参数、链路配置和方法脚本，便于复现历史调用。

::: warning
方法调用页会直接在目标 JVM 中执行当前方法。对写数据库、发消息、调用外部接口或触发定时任务的方法，运行前请确认应用环境、Header、ClassLoader 和参数都正确。
:::
