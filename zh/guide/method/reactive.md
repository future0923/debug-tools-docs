# Reactive

调试大模型、Agent、SSE 等 AI 流式接口时，它可以把分段事件直接提取并拼接成连续结果，是排查 AI 流式输出的调试神器。

当目标方法返回如下类型时，方法调用页会显示 `Reactive` 页签。

| 返回类型 | 说明 |
| --- | --- |
| `reactor.core.publisher.Flux` | 多元素响应式流。每次 `onNext` 都会作为一条事件显示。 |
| `reactor.core.publisher.Mono` | 单元素或空响应式结果。通常最多产生一条 `NEXT` 事件，然后 `COMPLETE`。 |
| `org.reactivestreams.Publisher` | Reactive Streams 标准 Publisher。 |
| `java.util.concurrent.Flow.Publisher` | JDK Flow Publisher。IDEA 侧会显示 `Reactive` 页签；目标 JVM 实际流式订阅仍以 `org.reactivestreams.Publisher` 为准，因此返回对象需要同时兼容 Reactive Streams Publisher 才会按流式结果推送。 |


## 使用入口

打开返回值为 Reactive 类型的方法调用页后显示 `Reactive` 页签。

![method_reactive_config.png](/images/method/method_reactive_config.png){v-zoom}

`Reactive` 页签包含两个配置：

| 配置 | 说明 |
| --- | --- |
| `返回后先展示` | 控制流式结果面板首次展示哪个视图。可选 `事件列表` 或 `提取结果`。 |
| `提取路径` | 使用 JSON Path 从每条流式 `data` 中提取字段，并把提取到的内容按事件顺序拼接展示。默认值为 `$`。 |

## 响应展示

### 事件列表

`事件列表` 是默认展示方式。流式响应开始后，结果区会显示流式结果面板，并按接收顺序追加事件。

请求执行后，面板会随着 `onNext`、`onComplete` 等回调实时追加事件，适合先观察流式返回的顺序、结构和结束状态。

![method_reactive_event_list.gif](/images/method/method_reactive_event_list.gif){v-zoom}

每条事件会显示：

- 序号，例如 `#1`、`#2`
- 事件类型，例如 `NEXT`、`COMPLETE`、`ERROR`、`CANCELLED`
- 如果是 Spring `ServerSentEvent`，类型会显示为 `SSE`
- SSE 的 `event` 名称
- 数据预览

点击某条事件后，下方会展开事件详情。详情包含接收时间、序号、类型、数据类型、SSE 元信息，以及格式化后的 `data`。

### 提取结果

`提取结果` 用于把多条流式 `data` 拼接成一个连续结果，适合调试大模型流式输出、分段文本、增量 JSON 等场景。

选择 `返回后先展示` 为 `提取结果` 后，流式结果面板打开时会优先显示提取结果视图。也可以在结果面板中手动切换到提取结果视图。

切换到提取视图后，DebugTools 会按当前 `提取路径` 重新处理已收到的 `NEXT` 事件，并在后续事件到达时继续追加提取结果。

![method_reactive_aggregate_result.gif](/images/method/method_reactive_aggregate_result.gif){v-zoom}

`提取路径` 使用 JSON Path 从每条 `NEXT` 事件的 `data` 中取值：

| 示例 | 含义 |
| --- | --- |
| `$` | 提取整条 `data`。 |
| `$.content` | 提取 `data.content` 并拼接。 |
| `$.choices[0].delta.content` | 提取数组对象中的嵌套字段。 |
| `$[agent_delta].content` | 只处理 SSE `event` 为 `agent_delta` 的事件，并提取其 `data.content`。 |

提取结果只处理 `NEXT` 事件。`COMPLETE`、`ERROR`、`CANCELLED` 不参与拼接。

::: tip
输入提取路径时，DebugTools 会根据已经收到的流式 `data` 动态生成路径提示。对于 SSE，还会生成 `$[event]` 形式的候选路径，方便只提取指定事件类型的数据。
:::

### 提取路径规则

普通路径从每条事件的 `data` 开始解析。例如：

```text
$.content
```

表示从每条 `data` 中取 `content` 字段。

SSE 事件过滤路径使用：

```text
$[event].path
```

其中 `event` 是 SSE 事件名，`path` 是在该事件 `data` 内继续解析的 JSON Path。例如：

```text
$[message].content
```

表示只处理 `event = message` 的 SSE 事件，并提取这些事件 `data.content` 的值。

如果提取到的是字符串，会直接拼接字符串；如果提取到的是对象或数组，会先转为 JSON 字符串再拼接。

### SSE 展示

如果 `onNext` 返回的是 Spring `org.springframework.http.codec.ServerSentEvent`，DebugTools 会通过反射读取它的 SSE 元信息：

SSE 场景下，事件列表会显示 SSE event 名称，提取结果可以使用 `$[event].path` 只拼接指定事件类型的数据。

| 字段 | 说明 |
| --- | --- |
| `event` | SSE 事件名称。 |
| `id` | SSE 事件 ID。 |
| `retry` | SSE 重试间隔。 |
| `comment` | SSE 注释。 |
| `data` | 真正参与展示和提取的数据。 |

结果面板中的事件列表会优先展示 SSE 类型和 `event` 名称。提取路径也可以按 SSE `event` 过滤。

![method_reactive_sse.gif](/images/method/method_reactive_sse.gif){v-zoom}

## 远端执行过程

发起方法调用后，目标 JVM 会先执行目标方法。如果返回值是 Reactive Streams `Publisher`，DebugTools 不会把它当作普通对象结果直接展示，而是创建订阅：

| 远端事件 | IDEA 展示 |
| --- | --- |
| `onNext(value)` | 追加一条 `NEXT` 事件。 |
| `onComplete()` | 追加 `COMPLETE` 事件，并结束本次流式展示。 |
| `onError(error)` | 追加 `ERROR` 事件，展示异常堆栈，并结束本次流式展示。 |
| 用户停止订阅 | 追加 `CANCELLED` 事件，并取消目标端订阅。 |

DebugTools 每收到一条 `onNext`，会向订阅请求下一条数据。这样可以持续接收流式响应，同时避免一次性拉取无限流。

## 停止流式请求

流式响应还没有结束时，可以在结果面板点击 `停止`。

点击后，IDEA 会向目标应用发送取消请求，目标 JVM 会调用订阅对象的 `cancel()`，并返回 `CANCELLED` 事件。页面会结束当前请求状态。

这些情况也会主动清理仍在推送的流式响应：

- 再次发起新的方法调用
- 关闭当前方法调用标签页
- IDEA 与目标应用连接断开

## 使用建议

- 调试普通流式接口时，先用 `事件列表`，确认每条事件的结构和顺序。
- 确认 `data` 结构后，再切换到 `提取结果`，填写稳定的 `提取路径`。
- 调试 SSE 时，优先使用 `$[event].path`，避免把不同事件类型的数据拼在一起。
- 对可能无限推送的流，调试完成后及时点击 `停止`，避免目标应用持续订阅。
