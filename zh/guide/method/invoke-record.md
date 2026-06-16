# 调用历史

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

调用历史用于保存方法调用请求和执行结果。开启后，每次从方法调用页发起请求，DebugTools 会把目标方法、应用、ClassLoader、参数 JSON、Header、前后置脚本名称、运行状态、耗时和结果快照保存到本机。

它适合反复验证同一个方法、复用上一次参数、查看最近调用失败原因，或从历史记录快速回到源码。

## 打开调用历史

在 DebugTools 工具窗口中点击 <img class="dt-inline-icon" src="/icon/method/history.svg" alt="调用记录" /> 进入调用记录页。

调用记录页默认按设置展示为树或列表。树视图按日期和应用分组，适合从某个应用当天的调用中查找方法。

![invoke_record_tree.png](/images/method/invoke_record_tree.png){v-zoom}

列表视图按记录展示，适合按状态、方法、应用和时间快速扫读。

![invoke_record_list.png](/images/method/invoke_record_list.png){v-zoom}

页面顶部的搜索框可以搜索方法名、类名、参数或应用名称。

## 常用操作

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/convert.svg" alt="切换列表/树" /> | `切换列表/树` | 在列表视图和树视图之间切换。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> | `刷新` | 重新读取本地调用历史。 |
| <img class="dt-table-icon" src="/icon/method/remove.svg" alt="清空记录" /> | `清空记录` | 删除全部调用记录，删除前会二次确认。 |
| <img class="dt-table-icon" src="/icon/method/idea_locate.svg" alt="定位源码" /> | `定位源码` | 根据记录中的类名、方法名和方法描述符跳转到源码方法。 |
| <img class="dt-table-icon" src="/icon/method/idea_restart.svg" alt="重新运行" /> | `重新运行` | 使用历史记录中保存的请求内容再次调用目标方法。 |
| <img class="dt-table-icon" src="/icon/method/idea_edit.svg" alt="填充到请求方法" /> | `填充到请求方法` | 在详情区打开对应方法请求页，并恢复该记录的参数、Header、脚本等内容。 |
| <img class="dt-table-icon" src="/icon/method/idea_preview.svg" alt="查看结果" /> | `查看结果` | 在详情区展示当前记录的返回结果或异常堆栈。 |

树视图中选中日期或应用分组后执行删除，会删除该分组下的记录，删除前会二次确认。

### 重新运行

点击 <img class="dt-inline-icon" src="/icon/method/idea_restart.svg" alt="重新运行" /> 后，DebugTools 会直接使用这条历史记录里保存的请求快照再次调用目标方法。

重新运行会复用历史记录中的目标应用、ClassLoader、参数 JSON、Header、XXL-JOB 参数、Trace Method 配置和前后置脚本等请求内容。它不会先打开请求编辑页，也不会让你修改参数；点击后就会立即发送请求。

重新运行适合“刚才这组参数失败了，我想原样再试一次”的场景。再次调用会生成新的运行记录；如果设置里开启了调用历史去重，新的记录可能会按去重规则合并到旧记录上。

::: tip
如果需要先修改参数、Header 或脚本，不要用重新运行，改用 <img class="dt-inline-icon" src="/icon/method/idea_edit.svg" alt="填充到请求方法" />。
:::

### 填充到请求方法

点击 <img class="dt-inline-icon" src="/icon/method/idea_edit.svg" alt="填充到请求方法" /> 后，DebugTools 会在详情区打开这条历史记录对应的方法调用页，并把历史请求内容填回编辑区。

![invoke_record_fill_request.png](/images/method/invoke_record_fill_request.png){v-zoom}

回填内容包括参数 JSON、Header、ClassLoader、XXL-JOB 参数、Trace Method 配置和前后置脚本。回填后不会自动执行，你可以先调整参数、切换 ClassLoader、增删 Header 或更换脚本，再手动发起调用。

这个操作会根据历史记录中的类名、方法名和方法描述符去当前项目里查找源码方法。方法还在、签名也能匹配时，才能打开对应的请求页；如果方法被删除、重命名，或参数签名已经变化，就可能无法回填到请求页。

### 查看结果

点击 <img class="dt-inline-icon" src="/icon/method/idea_preview.svg" alt="查看结果" /> 后，详情区会展示这条历史记录保存下来的执行结果。它只读取本地历史，不会重新调用目标方法，也不会修改记录内容。

默认展示 `toString` 结果：

![invoke_record_result_tostring.png](/images/method/invoke_record_result_tostring.png){v-zoom}

如果执行的时候点击 `JSON` 页签，这里才会可以切换到 JSON 编辑器：

![invoke_record_result_json.png](/images/method/invoke_record_result_json.png){v-zoom}

执行失败可以查看本次调用保存下来的异常堆栈：

![invoke_record_result_failure_stack.png](/images/method/invoke_record_result_failure_stack.png){v-zoom}

## 本地保存与上限

调用历史保存在当前用户目录下：

```text
~/.debugTools/invoke-record/
```

::: tip
- 保存数量有上限：每天最多保留最近 20 条，总计最多保留最近 100 条。
- 超过上限后，旧记录会被新记录自然顶掉。
:::

## 设置项

在 DebugTools 工具窗口点击 <img class="dt-inline-icon" src="/icon/method/setting.svg" alt="设置" /> 打开设置，进入 `调用方法` 页，在 `调用历史` 分组调整这些选项：

![invoke_record_setting.png](/images/method/invoke_record_setting.png){v-zoom}

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `启用调用历史` | 开启 | 开启后保存方法调用请求和结果；关闭后不再新增或更新调用记录，已有记录不会自动删除。 |
| `相同方法调用历史去重` | 关闭 | 按“方法”合并历史。类名、方法名、方法描述符相同，就认为是同一个方法；即使参数 JSON 不同，也只保留最后一次调用。 |
| `相同参数调用历史去重` | 关闭 | 按“方法 + 参数 JSON”合并历史。只有同一个方法、同一份参数 JSON，才会覆盖旧记录；参数 JSON 不同会分别保留。 |
| `调用历史默认视图` | `树` | 控制打开调用历史页时默认使用树视图还是列表视图。 |

可以把这两个选项理解成“用什么作为历史记录的唯一标识”：

| 配置 | 适合场景 | 连续调用 `id=1`、`id=2`、`id=1` 后会保留 |
| --- | --- | --- |
| 两个都关闭 | 想保留每次调用过程 | 3 条记录 |
| 只开启 `相同方法调用历史去重` | 只关心每个方法最后一次执行结果 | 1 条记录：最后一次调用 |
| 只开启 `相同参数调用历史去重` | 想合并完全相同参数的重复重试 | 2 条记录：`id=2` 和最新的 `id=1` |
| 两个都开启 | 和只开启 `相同参数调用历史去重` 一样，按“方法 + 参数 JSON”合并 | 2 条记录：`id=2` 和最新的 `id=1` |
