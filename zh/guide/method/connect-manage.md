# 连接管理

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

连接管理页用于统一查看和维护当前已经附着的应用。无论是本地 JVM 附着，还是远程服务连接，都会在这里生成一张连接卡片，后续调用方法、打印 SQL、执行 Groovy、热部署等功能都可以基于具体连接继续操作。

![connect_manage_empty.png](/images/method/connect_manage_empty.png){v-zoom}

## 进入连接管理

打开 IDEA 的 `DebugTools` 工具窗口，默认会进入连接管理页。未附着任何应用时，页面会提示 `暂无附着应用`。

工具栏提供这些入口：

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/attach.svg" alt="附着" /> | `附着` | 选择本机正在运行的 Java 进程并附着。 |
| <img class="dt-table-icon" src="/icon/method/connect.svg" alt="连接" /> | `连接` | 连接远程 DebugTools 服务。 |
| <img class="dt-table-icon" src="/icon/method/http.svg" alt="全局 Header" /> | `全局 Header` | 配置所有连接默认携带的 Header。 |
| <img class="dt-table-icon" src="/icon/method/clear.svg" alt="清理缓存" /> | `清理缓存` | 清理核心 Jar 缓存、方法参数缓存，或一键清理全部缓存。 |
| <img class="dt-table-icon" src="/icon/method/help.svg" alt="帮助" /> | `帮助` | 打开 DebugTools 使用文档。 |
| <img class="dt-table-icon" src="/icon/method/appreciation.svg" alt="赞赏作者" /> | `赞赏作者` | 打开赞赏入口。 |

搜索框支持按备注、应用名、PID、Host 或端口快速定位连接。连接很多时，可以先给常用应用设置备注，再通过备注检索。

::: tip
账号按钮使用 IDEA 账号图标，用于登录或查看 IDEA 插件账号信息。
:::

## 附着应用

### 本地

点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/attach.svg" alt="附着" /> 按钮，会打开本地 JVM 进程列表。弹窗打开后会自动扫描当前机器正在运行的 Java 进程，并默认选中可用进程。

![attach_list.png](/images/method/attach_list.png){v-zoom}

列表中每一项会展示：

- PID：进程号，例如 `19924`。
- 应用名称：优先展示主类短名；如果是 Jar 启动，则展示 Jar 文件名。
- 启动配置、模块、项目：如果进程来自当前 IDEA 运行配置，会在列表详情中展示这些信息。
- 完整名称：选中某个进程后，详情区域会展示完整主类名或 Jar 路径。

可以用两种方式完成附着：

- 双击目标 JVM 进程。
- 单击选中目标 JVM 进程后，点击 `附着` 按钮。

如果列表为空，先确认 Java 应用已经启动，再点击 `刷新` 重新扫描。点击 `取消` 会关闭弹窗，不执行附着。

::: tip
本地附着会向目标 JVM 注入 DebugTools Agent。附着成功后，应用会出现在连接管理列表中，来源显示为 `本地`。
:::

### 远程

点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/connect.svg" alt="连接" /> 按钮，会打开远程目标弹窗。这里用于连接已经启动 DebugTools 服务端的远程应用。

![connect_remote_empty.png](/images/method/connect_remote_empty.png){v-zoom}

首次使用时没有历史记录，点击 <img class="dt-inline-icon" src="/icon/method/idea_add.svg" alt="新增" /> 新建远程目标。

![connect_remote_new.png](/images/method/connect_remote_new.png){v-zoom}

新建目标需要填写：

- `主机`：远程应用所在机器地址，不填时默认使用 `127.0.0.1`。
- `端口`：分别填写 `TCP` 端口和 `HTTP` 端口，默认值为 `12345` 和 `22222`。
- `名称`：可选。填写后会保存到历史列表；不填写时只作为临时目标连接一次。

填写完成后点击 `应用`，插件会先通过 `HTTP` 端口获取远程应用名称，再通过 `TCP` 端口建立连接。连接成功后会关闭弹窗，并在连接管理列表中新增一张来源为 `远程` 的连接卡片。

::: warning
远程连接前请确认目标应用已经启动 DebugTools 服务端，并且本机可以访问目标机器的 `TCP` 和 `HTTP` 端口。否则会提示连接失败或获取应用名称失败。
:::

**管理远程历史**

如果新建远程目标时填写了 `名称`，下次打开远程目标弹窗时会展示在历史列表中。

![connect_remote_saved.png](/images/method/connect_remote_saved.png){v-zoom}

历史列表支持：

- 在搜索框中按名称或主机过滤。
- 双击目标直接连接。
- 点击 <img class="dt-inline-icon" src="/icon/method/idea_run_all.svg" alt="连接" /> 发起连接。
- 点击 <img class="dt-inline-icon" src="/icon/method/idea_edit.svg" alt="编辑" /> 修改主机、端口或名称。
- 点击 <img class="dt-inline-icon" src="/icon/method/idea_remove.svg" alt="移除" /> 删除历史记录。

编辑历史目标后点击 `应用` 会立即按最新配置发起连接。修改名称时，旧名称对应的历史记录会被替换为新名称。

## 查看连接列表

### 应用信息

附着成功后，连接会以卡片形式显示在列表中。

![connection_list.png](/images/method/connection_list.png){v-zoom}

每张连接卡片会展示：

- 应用名称：默认展示短应用名，鼠标悬停可查看完整名称。
- 连接状态：绿色表示已连接，断开后会显示为非连接状态。
- 来源标签：本地附着显示 `本地`，远程连接显示 `远程`。
- 运行信息：展开卡片后可以查看 `PID` 或 `Host`、`TCP` 端口、`HTTP` 端口。

点击卡片标题区域或空白区域可以展开或收起详情。按钮、下拉框、输入框等操作控件不会触发展开收起。

### 备注

点击连接卡片上的编辑按钮可以修改连接备注。保存后，卡片标题会显示为 `备注 (应用名)`，在同时附着多个应用时更容易区分环境，例如 `订单服务-测试 (OrderApplication)`。

备注支持按回车保存，也可以点击保存按钮；按 `Esc` 或点击取消按钮会放弃本次修改。

### Header

连接管理页提供两类 Header：

- 通过工具栏 <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> 入口配置，对所有连接应用生效。
- 在单个连接卡片点击 <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> 按钮配置，只对当前连接生效。

展开连接卡片后，可以在详情区域查看当前连接已经保存的 Header。这里是只读展示，如需修改请通过连接卡片上的 <img class="dt-inline-icon" src="/icon/method/http.svg" alt="Header" /> 按钮进入配置弹窗。

::: tip
- 如果同一个 IDEA 项目同时连接多个应用，建议把鉴权、租户、环境标识等 Header 配置在具体连接上，避免不同应用之间互相影响。
- Header 还可以在方法调用页按方法单独配置，详细规则见 [请求头](./request-header)。
- 优先级为 `方法级 > 连接级 > 项目级`。
:::

### 调整连接配置

展开卡片后，可以直接修改当前连接的常用调用配置：

- `ClassLoader`：选择调用方法、执行脚本时使用的 ClassLoader。
- `SQL`：切换 SQL 打印模式。
- `方法脚本`：选择当前连接默认使用的 Method Around 脚本，也可以新增、查看、删除或刷新脚本。
- `Header`：查看当前连接 Header 键值。

这些配置按连接保存。多应用同时附着时，每个连接都可以维护自己的 ClassLoader、SQL 设置、方法脚本和 Header。

### 连接操作

连接卡片会根据连接状态展示不同操作：

| 图标 | 按钮 | 场景 | 作用 |
| --- | --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_edit.svg" alt="编辑备注" /> | `编辑备注` | 连接卡片 | 修改当前连接备注，保存后标题显示为 `备注 (应用名)`。 |
| <img class="dt-table-icon" src="/icon/method/http.svg" alt="项目 Header" /> | `项目 Header` | 连接卡片 | 配置当前连接自己的 Header。 |
| <img class="dt-table-icon" src="/icon/method/disconnect.svg" alt="断开连接" /> | `断开连接` | 已连接 | 只关闭当前卡片对应的客户端连接，连接记录仍保留在列表中。 |
| <img class="dt-table-icon" src="/icon/method/idea_suspend.svg" alt="停止" /> | `停止` | 已连接 | 向当前连接发送停止命令，适合需要结束当前附着服务时使用。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="重连" /> | `重连` | 已断开 | 本地连接会按应用名重新查找 JVM，远程连接会按原 Host 和端口重新连接。 |
| <img class="dt-table-icon" src="/icon/method/idea_more.svg" alt="更多菜单" /> | `更多菜单` | 连接卡片 | 收纳 SQL 历史、Groovy 控制台、热部署和删除连接等操作。 |

更多菜单中包含：

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/database.svg" alt="SQL 历史记录" /> | `SQL历史记录` | 打开当前应用的 SQL 历史记录。 |
| <img class="dt-table-icon" src="/icon/method/groovy.svg" alt="Groovy 控制台" /> | `Groovy控制台` | 打开绑定当前连接的 Groovy 控制台。 |
| <img class="dt-table-icon" src="/icon/method/hot_deployment.svg" alt="热部署" /> | `热部署` | 打开当前连接的热部署窗口。 |
| <img class="dt-table-icon" src="/icon/method/remove.svg" alt="删除连接" /> | `删除连接` | 删除当前连接记录。 |


## 清理缓存

点击 <img class="dt-inline-icon" src="/icon/method/clear.svg" alt="清理缓存" /> 会打开缓存清理菜单。菜单中可以勾选需要清理的缓存项，再点击 `清除` 执行；如果不想继续操作，点击 `取消` 关闭菜单。

![清理缓存菜单](/images/method/clear_cache_menu.png){v-zoom}

可清理的缓存包括：

- `Core jar cache`：清理 DebugTools 注入目标 JVM 时使用的核心 Jar 缓存。插件升级后、附着异常或怀疑本地 Agent 缓存不一致时，可以先清理这一项，再重新附着应用。
- `Method param cache`：清理方法调用参数缓存。清理后，再次打开同一个方法调用页时，不会继续自动恢复上次填写的参数、Header、脚本等调用表单内容。

点击 `全部清除` 会一次性清理核心 Jar 缓存、方法参数缓存和全局 Header 设置。清理完成后，IDEA 会弹出缓存清理成功的通知。

::: warning
清理缓存不会断开当前连接，也不会删除远程连接历史；但 `全部清除` 会清空通过全局 Header 入口保存的默认 Header，执行前请确认这些 Header 不再需要保留。
:::
