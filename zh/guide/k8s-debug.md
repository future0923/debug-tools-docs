# Kubernetes 微服务调试

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

在微服务云原生架构中，后端应用通常部署在远程 Kubernetes 集群中，服务之间存在复杂的内网注册中心、配置中心、RPC 调用链以及私有数据库或消息队列依赖。直接在本地机器启动完整的微服务集群成本高昂，而传统的 NodePort、Ingress 暴露或跳板机端口转发配置繁琐且无法做到即开即用。

DebugTools 提供了类似 Mirrord 的开箱即用体验，无缝集成到 IntelliJ IDEA 工具栏。通过一键连接 Kubernetes 集群内的 Pod 或 Deployment，自动完成 Agent 注入与安全端口隧道建立，让开发者在本地如同调试本地进程一样调试远程集群内的微服务（包括方法调用、热部署、SQL 拦截、Groovy 脚本执行等），免去繁琐的网络配置。

---

## 1. 核心特性

- **开箱即用**：直接基于本地 `~/.kube/config` 自动读取多集群 Context、命名空间与工作负载，无需配置复杂的 Ingress 或暴露公网端口。
- **工作负载感知**：支持直接按 Deployment 或 Pod 维度选择目标，支持实时模糊搜索快速定位服务。
- **智能 Agent 模式**：
  - **预置 Agent 模式**：如果目标容器镜像已集成并运行 DebugTools Agent，直接复用已有端口，秒级完成连接。
  - **动态注入模式**：如果目标容器尚未运行 Agent，插件会自动将 Agent 包与 Attach 工具推送到容器内，自动检测 Java 进程并动态 Attach，无需重启 Pod。
- **自动端口分配**：支持本地端口冲突自动递增分配，同一台机器可同时连接多个不同的远程微服务调试，互不干扰。
- **完整生命周期管理**：连接管理面板内集成专门的 K8s 运行指标展示（集群、命名空间、Pod、转发隧道状态 `● 运行中` / `○ 已停止`），支持断开、停止、重连与删除。
- **安全保障**：隧道进程绑定 IDEA 生命周期，关闭工程或退出 IDE 时自动回收后台进程，杜绝孤儿隧道泄漏。

---

## 2. 使用前提

1. **本地环境安装 `kubectl`**：
   - 确保本机终端已安装 `kubectl` 命令，并已加入系统 `PATH` 环境变量。
   - 可以在终端运行 `kubectl version --client` 验证是否正常可用。
2. **有效的 Kubernetes 集群配置**：
   - 本机 `~/.kube/config` 文件中包含可正常访问目标集群的配置，并且具备获取 Pod/Deployment 列表、`exec` 与 `port-forward` 的权限。
3. **集群网络互通**：
   - 开发者本地机器能够访问 Kubernetes API Server（例如通过公司内网或 VPN 直连集群 API Server）。

---

## 3. 连接 Kubernetes 目标

### 3.1 打开连接弹窗

打开 IDEA 界面右侧或底部的 `DebugTools` 工具窗口，在连接管理页面的顶部工具栏中，点击 <img class="dt-inline-icon" src="/icon/method/k8s.svg" alt="K8s 连接" /> 按钮，即可打开 Kubernetes 目标连接对话框。

![Kubernetes 目标连接弹窗](/images/k8s/k8s_dialog.png){v-zoom}

### 3.2 选择集群与命名空间

- **集群上下文 (Cluster Context)**：下拉列表自动读取本地 kubeconfig 中配置的所有集群 Context，当前激活的上下文会带有 `(current)` 标记。切换上下文后，命名空间列表会自动刷新。
- **选择命名空间 (Select Namespace)**：下拉选择目标微服务所在的命名空间，默认选中 `default`。

### 3.3 选择目标服务 (Pod / Deployment)

1. **类型过滤**：支持勾选 `Pods` 与 `Deployments`，可单独或同时显示 Pod 和 Deployment 资源。
2. **即时搜索**：在搜索框中输入关键字（如 `crm`、`order`、`gateway`），目标列表会实时过滤匹配项。
3. **选择目标**：
   - **Deployment**：推荐选择。插件会自动查找当前 Deployment 下健康运行中的 Pod 实例进行连接；后续重连时如果 Pod 发生过重启漂移，也会自动重新解析最新 Pod。
   - **Pod**：适合精准调试特定异常实例。
4. **容器选择 (Container)**：目标选中后，下方容器下拉框会自动列出该 Pod 内的容器。插件会自动过滤常见的 Service Mesh 边车容器（如 `istio-proxy`、`linkerd-proxy`），默认选中主业务容器。

### 3.4 端口与高级配置

弹窗底部的高级配置面板提供本地与远端调试端口设置：

- **远端 Agent 端口智能推导**：
  - **基于业务端口推导**：当目标 Pod 或 Deployment 容器中声明了业务端口（如 `8080`）时，插件会自动计算并将远端 HTTP 端口设置为 `业务端口 + 10000`（如 `18080`），TCP 端口设置为 `业务端口 + 20000`（如 `28080`）。不同微服务推导出的端口互不重合，有效避免集群内容器端口冲突。若容器未显式声明端口，则默认回退到基准端口 `12345`（TCP）与 `22222`（HTTP）。
  - **预置 Agent 自适应复用**：若微服务在启动时已通过 `-javaagent` 集成了 DebugTools Agent（监听在默认端口 `12345/22222` 或推导端口上），连接时插件会自动检测并直接复用已有端口，无需重复注入。
  - **支持手动修改**：高级设置中的端口输入框支持自由编辑，用户手动输入的端口具有最高优先级。
- **本地转发端口**：映射到本机 `127.0.0.1` 的 TCP 与 HTTP 端点，默认采用与远端一致的端口。
- **端口被占用时自动递增分配**：默认勾选。当本地已有其他服务或调试连接占用了该端口时，插件会自动递增查找可用空闲端口（例如 `28081`、`18081`），避免本地端口冲突。

### 3.5 发起连接

配置完成后，点击底部的 `CONNECT` 按钮（或直接双击列表中的目标项），插件会启动后台连接任务并在 IDEA 右下角展示进度：

1. **解析目标 Pod**：若选中 Deployment，自动查询并锁定其运行中的 Pod 实例。
2. **检测与注入 Agent**：
   - 首先探测容器内是否已在目标端口（推导端口或默认 `12345/22222`）监听 Agent 服务；
   - 若已监听，直接复用已运行的 Agent；
   - 若未监听，检查并上传 `debug-tools-agent.jar` 和 `attach.jar`，通过 `jps -l` 自动定位目标 Java 进程 PID 并执行 Attach 动态注入；
   - 等待并验证 Agent 端口监听就绪。
3. **建立隧道**：启动后台 `kubectl port-forward` 进程，将本地选定的 TCP 与 HTTP 端口安全映射到远端 Pod 对应的 Agent 端口。
4. **连通性校验**：通过本地隧道端点校验 HTTP 握手，确保远端服务已完全可达。
5. **客户端接入**：DebugTools 客户端自动连接该本地隧道端口，初始化连接并获取应用元数据。

---

## 4. 连接管理与调试

### 4.1 查看 K8s 连接卡片

连接成功后，弹窗自动关闭，DebugTools 连接管理页面中会新增一张带有 `Remote` 来源标签、前缀为 `k8s:` 的连接卡片，同时 IDEA 底部状态栏会显示当前的 K8s 调试目标。

![K8s 连接卡片](/images/k8s/k8s_connection_card.png){v-zoom}

卡片展开后，会展示专门的 Kubernetes 运行时信息区块：

| 字段 | 含义 | 说明示例 |
| --- | --- | --- |
| **Cluster** | 集群上下文 | 当前连接使用的 Kubernetes 集群 Context（如 `dev-cluster`） |
| **Namespace** | 命名空间 | 目标服务所在的命名空间（如 `default`） |
| **Pod** | 实际连接 Pod | 当前建立调试隧道的具体 Pod 实例名称 |
| **Target** | 目标工作负载 | 最初选中的目标（如 `deployment/crm-system`） |
| **Forward** | 端口映射关系 | 本地转发端口与远端容器端口映射（如 `127.0.0.1:12345 -> 12345`） |
| **Tunnel** | 隧道状态 | 绿色 `● 运行中` 表示端口转发隧道正常；灰色 `○ 已停止` 表示隧道已终止 |

### 4.2 卡片操作按钮

卡片顶部提供便捷的操作入口：

| 图标 | 按钮 | 说明 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_edit.svg" alt="编辑备注" /> | `编辑备注` | 为该 K8s 连接设置别名备注，方便在多服务并发调试时快速识别。 |
| <img class="dt-table-icon" src="/icon/method/http.svg" alt="项目 Header" /> | `项目 Header` | 设置该连接独享的全局请求头（例如特定的租户 ID、测试流量染色 Tag 等）。 |
| <img class="dt-table-icon" src="/icon/method/disconnect.svg" alt="断开连接" /> | `断开连接` | 仅断开客户端与远程服务的连接，并终止本地端口转发隧道，连接卡片仍保留在列表中。 |
| <img class="dt-table-icon" src="/icon/method/idea_suspend.svg" alt="停止" /> | `停止` | 向远端发送停止指令，并安全清理本地端口转发隧道。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="重连" /> | `重连` | 连接断开后变为可用状态。点击后会自动重新校验 Deployment 与 Pod 实例，重新拉起端口转发隧道并恢复调试连接。 |
| <img class="dt-table-icon" src="/icon/method/idea_more.svg" alt="更多" /> | `更多` | 展开更多菜单，包含打开 SQL 历史、Groovy 控制台、热部署和删除连接。 |

---

## 5. 调试能力全景

连接到 Kubernetes 目标后，DebugTools 的所有核心功能均可无缝作用于远端微服务：

1. **方法调用 (Method Invoke)**：直接在 IDEA 编辑器中右键调用远端 Spring Bean、Dubbo 接口或普通类的方法，支持实时回显返回值与异常调用栈，详见 [快速调用Java方法](./method/quick-start)。
2. **代码热重载与热部署 (Hot Deploy)**：修改本地 Java 代码后，通过热部署功能直接将字节码增量推送到集群容器内的 JVM 中秒级生效，无需重新构建 Docker 镜像或重新发布 Pod，详见 [使用热部署](./hot-deploy)。
3. **SQL 打印与耗时分析**：实时捕获远端微服务执行的 SQL 语句、参数与执行耗时，辅助排查远端慢查询与数据异常，详见 [SQL 打印](./sql)。
4. **Groovy 脚本动态执行**：直接在远端应用上下文中运行任意 Groovy 代码片段，动态获取 Spring ApplicationContext、排查内存状态或调用私有逻辑，详见 [执行Groovy脚本](./groovy-execute)。
5. **AI MCP 协议联动**：配合 Cursor、Claude Desktop 或其他 AI 编码助手，通过 MCP 协议自动调试与诊断远端 K8s 微服务，详见 [MCP 调试](/ai/mcp/idea)。

---

## 6. 常见问题 (FAQ)

### Q1: 点击连接提示 `kubectl: command not found` 或无法找到命令？
**解答**：IDEA 启动时读取的系统环境变量可能未包含 `kubectl` 所在的路径。
- **Windows**：请将 `kubectl.exe` 所在目录添加到系统或用户环境变量 `Path` 中，并重启 IDEA。
- **macOS / Linux**：如果在桌面启动器打开 IDEA，请确保 `/usr/local/bin` 或 `~/.asdf/shims` 等路径已在全局 PATH 中生效，或通过终端 `open -a "IntelliJ IDEA"` 启动。

### Q2: 提示连接 Pod 动态 Attach 失败或无权限？
**解答**：动态 Attach 模式依赖在容器内执行 `jps` 和 `AttachTool`。
- 如果目标 Pod 的基础镜像是极简镜像（如 Scratch、Distroless），可能缺少基本的 Shell 或 JDK 工具。
- 如果容器以只读文件系统或严格限制非 root 用户的安全策略运行（`securityContext` 限制了 `SYS_PTRACE` 权限），动态注入可能会被底层 Linux 内核拒绝。
- **推荐方案（生产/准生产规范）**：在 Dockerfile 构建镜像或部署配置中直接预先集成 Agent。

::: tip 预先集成 Agent 启动示例
在 Dockerfile 或容器启动脚本中添加：
```shell
-javaagent:/opt/debug-tools/debug-tools-agent.jar=server=true,tcpPort=12345,httpPort=22222
```
此时目标容器启动后即处于监听状态，DebugTools 在连接时会自动识别为**预置 Agent 模式**，直接建立隧道秒级接入，不需要任何动态注入权限。
:::

### Q3: Pod 重启或漂移后如何恢复连接？
**解答**：如果当初选择的是 **Deployment** 目标，当 Pod 因发布或异常发生重启重建后，无需重新打开弹窗新建连接；直接在连接卡片上点击 <img class="dt-inline-icon" src="/icon/method/idea_refresh.svg" alt="重连" /> 按钮，插件会自动重新解析当前健康的最新 Pod 实例，重新拉起端口转发隧道并恢复通信。

### Q4: 本地端口被其他进程占用怎么办？
**解答**：连接弹窗默认勾选了 `端口被占用时自动递增分配`。如果本机的 `12345` 或 `22222` 端口已被其他服务占用，插件会自动选择 `12346`、`22223` 等空闲端口进行本地端口映射，完全无需手动干预。
