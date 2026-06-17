点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/connect.svg" alt="连接" /> 按钮，会打开远程目标弹窗。这里用于连接已经启动 DebugTools 服务端的远程应用。

![connect_remote_empty.png](/images/method/connect_remote_empty.png){v-zoom}

首次使用时没有历史记录，点击 <img class="dt-inline-icon" src="/icon/method/idea_add.svg" alt="新增" /> 新建远程目标。

![connect_remote_new.png](/images/method/connect_remote_new.png){v-zoom}

新建目标需要填写：

- `主机`：远程应用所在机器地址，不填时默认使用 `127.0.0.1`。
- `端口`：分别填写 `TCP` 端口和 `HTTP` 端口，默认值为 `12345` 和 `22222`。
- `名称`：可选。填写后会保存到历史列表；不填写时只作为临时目标连接一次。

填写完成后点击 `应用`，插件会先通过 `HTTP` 端口获取远程应用名称，再通过 `TCP` 端口建立连接。连接成功后会关闭弹窗，并在连接管理列表中新增一张来源为 `远程` 的连接卡片。

::: tip
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
