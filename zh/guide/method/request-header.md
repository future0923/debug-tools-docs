# 请求头

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

请求头用于给方法调用补充上下文信息，例如鉴权 Token、租户标识、语言、灰度标识、请求来源等。DebugTools 支持在方法级、应用级和项目级三个层级配置 Header，最终发起调用时会合并后发送到目标 JVM。应用级 Header 保存在当前连接中，只影响该连接对应的应用。

## 三种设置方法

### 方法级

方法调用页的 `Header` 页签会同时展示当前方法实际生效的方法级、应用级和项目级 Header。页签名称后的数字是合并、去重后的有效 Header 数量。

![方法调用页的分层 Header](/images/method/request_header_layered.png){v-zoom}

#### 识别 Header 来源

`Key` 前的彩色圆点表示 Header 来源。将鼠标移到圆点或 Key 上，可以查看对应的来源提示：

| 来源 | 浅色主题 | 深色主题 | 悬停提示 | 作用范围 |
| --- | --- | --- | --- | --- |
| 方法级 | 蓝色 `#2563EB` | 蓝色 `#60A5FA` | `方法` | 只作用于当前方法。 |
| 应用级 | 橙色 `#D97706` | 橙色 `#F59E0B` | `应用` | 作用于当前连接对应的应用。 |
| 项目级 | 绿色 `#16A34A` | 绿色 `#22C55E` | `项目` | 作用于当前 IDEA 项目中的所有 DebugTools 调用。 |

同名 Key 只展示优先级最高的一行。例如同一个 Key 在方法级和应用级都存在时，表格只展示方法级值。

#### 设置请求头

每一行是一组 Header 键值：

- 勾选启用后，这一行才会参与本次方法调用。
- `Key` 填 Header 名，例如 `Authorization`、`X-Tenant-Id`、`Accept-Language`。
- `Value` 填 Header 值，例如 `Bearer token`、`tenant-a`。
- 输入 Header 名时，编辑器会提示常见 HTTP Header，并展示每个 Header 的说明，选中后会自动写入当前单元格。
- 同一个方法需要长期复用这些 Header 时，点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> 保存到方法参数缓存。下次打开同一方法时会自动恢复。

方法级适合临时调试、单个接口差异、覆盖应用级或项目级默认值。例如同一个应用里只有某个方法需要切换租户，就把 `X-Tenant-Id` 写在方法级。

应用级和项目级继承行的复选框与 Key 不能在方法调用页修改。可以直接编辑 Value，再使用 `Action` 列中的同步按钮保存到对应层级；仅修改 Value 而不执行同步操作，不会改变实际调用使用的 Header。

#### 行操作

`Action` 列中的按钮会随 Header 来源变化。将鼠标移到按钮上，可以查看操作名称：

| 按钮 | 鼠标悬停 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/sync_application.svg" alt="同步到应用 Header" /> | `同步到应用 Header` | 方法级行会移动到应用级；应用级行会把编辑后的 Value 保存到当前应用。项目级行不显示此按钮。 |
| <img class="dt-table-icon" src="/icon/method/sync_project.svg" alt="同步到项目 Header" /> | `同步到项目 Header` | 将当前值保存到项目级。方法级或应用级行执行后，会删除当前方法和当前应用中的同名覆盖值，表格中的来源变为项目级；项目级行可用此按钮保存编辑后的 Value。 |
| <img class="dt-table-icon" src="/icon/method/remove.svg" alt="删除 Header" /> | `删除 Header` | 删除该行所属层级的 Header。删除应用级 Header 后，如果项目级存在同名 Key，项目级值会重新显示并生效。 |

三个 Action 图标使用插件内置的中性灰色。来源通过 Key 前的彩色圆点区分。

#### 编辑工具栏

请求头表格上方的工具栏用于维护 Header：

| 按钮 | 显示位置 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_table_add.svg" alt="新增" /> | 方法调用页、应用级和项目级设置 | 新增一行当前层级的 Header，默认启用。 |
| <img class="dt-table-icon" src="/icon/method/idea_table_remove.svg" alt="清空" /> | 方法调用页、应用级和项目级设置 | 方法调用页只清空方法级 Header，应用级和项目级继承行仍会保留；设置弹窗中会清空当前层级。 |
| <img class="dt-table-icon" src="/icon/method/idea_reset.svg" alt="重置" /> | 应用级和项目级设置 | 放弃当前编辑内容，重新加载对应层级已保存的 Header。 |
| <img class="dt-table-icon" src="/icon/method/idea_menu_save_all.svg" alt="保存" /> | 应用级和项目级设置 | 保存当前层级已启用的 Header。方法级 Header 使用方法调用工具栏中的 <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> 保存。 |
| <img class="dt-table-icon" src="/icon/method/table_convert_pair.svg" alt="表格文本转换" /> | 表格工具栏 | 在表格模式和文本模式之间切换。 |

表格首列的复选框用于控制单行是否启用，点击表头复选框可以批量启用或禁用所有行。每行操作列中的移除按钮只删除当前行。

点击 <img class="dt-inline-icon" src="/icon/method/table_convert_pair.svg" alt="表格文本转换" /> 后，请求头会切换为文本模式，便于直接粘贴或批量编辑：

![request_header_text_mode.png](/images/method/request_header_text_mode.png){v-zoom}

文本模式每行使用 `Key: Value` 格式。行首加 `#` 表示该 Header 禁用，例如 `#Authorization: Bearer token` 会转换成未勾选的 Header 行；再次点击 <img class="dt-inline-icon" src="/icon/method/table_convert_pair.svg" alt="表格文本转换" /> 会把文本内容转换回表格。

### 应用级

应用级 Header 在连接管理页的单个连接卡片上配置，只作用于当前连接对应的应用。

在连接卡片点击 <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> 打开 Header 配置弹窗，保存后该应用下的所有方法调用都会默认携带这些 Header。展开连接卡片后，也可以在详情区域查看当前应用已经保存的 Header。

![request_header_connection_position.png](/images/method/request_header_connection_position.png){v-zoom}

应用级适合按应用、环境或实例区分的固定上下文，例如：

- 测试环境应用固定使用 `X-Env: test`。
- 某个租户应用固定使用 `X-Tenant-Id: tenant-a`。
- 同一个 IDEA 项目同时连接多个应用时，每个连接分别保存自己的鉴权或环境 Header。

::: tip
应用级 Header 跟随连接记录在内存中保存。
:::

### 项目级

项目级 Header 在连接管理页工具栏的 <img class="dt-inline-icon" src="/icon/method/http.svg" alt="全局 Header" /> 入口配置。页面按钮显示为 `全局 Header`，但作用范围是当前 IDEA 项目里的 DebugTools 调用默认 Header。

![request_header_project_position.png](/images/method/request_header_project_position.png){v-zoom}

保存后，当前项目中所有连接、所有方法调用都会默认携带这些 Header。项目级适合真正通用的默认值，例如：

- 所有调试调用都需要的 `User-Agent`。
- 当前项目统一的基础鉴权 Header。
- 所有服务都一致的语言、渠道或来源标识。

::: warning
项目级 Header 影响范围最大。如果同一个 IDEA 项目同时连接多个应用，且不同应用的鉴权、租户或环境值不同，建议放到应用级，不要放到项目级。
:::

## 合并和优先级

发起方法调用时，DebugTools 会把三层 Header 合并成最终请求 Header：

```text
方法级 > 应用级 > 项目级
```

同名 Header 只会保留高优先级的值：

| Header Key | 项目级 | 应用级 | 方法级 | 最终生效 |
| --- | --- | --- | --- | --- |
| `Authorization` | `Bearer project-token` | `Bearer connection-token` | `Bearer method-token` | `Bearer method-token` |
| `X-Tenant-Id` | `tenant-default` | `tenant-a` | 未填写 | `tenant-a` |
| `Accept-Language` | `zh-CN` | 未填写 | 未填写 | `zh-CN` |

也就是说：

- 方法级已经填写的 Header，不会被应用级或项目级覆盖。
- 应用级已经填写的 Header，不会被项目级覆盖。
- 项目级只在方法级和应用级都没有同名 Key 时作为默认值生效。

## 存储与清理缓存

**存储**
- 方法级：文件
- 应用级：内存
- 项目级：文件

**清理缓存**

![清理缓存菜单](/images/method/clear_cache_menu.png){v-zoom}

- `Method param cache`：会清理掉方法级 header。
- `全部清除`：方法级 header 和项目级 header
- 当然对应位置一个个删除保存也是可以的

::: tip
- Header 会参与构造 Spring MVC、Spring WebFlux 请求对象。
- 目标方法参数中如果使用 `HttpServletRequest`、`ServerHttpRequest`、`ServerWebExchange` 等请求对象，也可以读取到当前调用合并后的 Header。
:::
