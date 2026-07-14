# Hotswap Skill

Hotswap Skill 用来让 AI Agent 操作 IDEA 运行配置，或者把最近修改的 Java 类编译并重新加载到正在调试的 JVM。

Skill 名称是 `debug-tools-hotswap`。

## 能做什么

- 查看当前 IDEA 项目中的运行配置。
- 根据配置名、模块、主类或类型找到目标运行配置。
- 使用 DebugTools Hotswap executor 启动运行配置。
- 触发 IDEA Java Debugger 的 Compile and Reload Modified Files。
- 在多个运行配置或调试会话之间要求用户选择，避免启动或重载错误目标。

MCP 工具本身的参数和返回值见 [Hotswap MCP](../mcp/hotswap.md)。

## 怎样使用

启动已知的运行配置：

```text
用 Hotswap 启动 DemoApplication 运行配置。
```

只知道应用或模块时，也可以直接描述：

```text
用 Hotswap 启动 demo-service 模块里的 Spring Boot 应用。
```

修改代码后触发热重载：

```text
把刚修改的 Java 类编译并重新加载到当前调试会话。
```

```text
对 DemoApplication 调试会话执行 Compile and Reload Modified Files。
```

这里不必强调“DebugTools”。“Hotswap”“运行配置”“编译并重新加载到调试会话”等表达已经足以说明任务意图。

## 启动运行配置时

如果用户给出了准确的 IDEA 运行配置名称，Agent 可以直接请求启动。名称缺失或不明确时，Agent 会先查询运行配置，并根据模块、主类和配置类型筛选。

多个配置都可能匹配时，Agent 会展示准确的配置名称让用户选择，不会仅凭相似名称直接启动。

## 编译并热重载时

Skill 调用的是 IDEA Java Debugger 原生的 Compile and Reload Modified Files。它适用于应用已经在 Java Debugger 中运行，且希望把最近的代码修改加载进当前 JVM 的场景。

如果同时存在多个已附着调试会话，需要提供会话名称，或者从 Agent 返回的候选会话中选择。

## 特殊注意事项

### 启动成功不等于应用已经就绪

启动工具返回成功，只表示 IDEA 已接受启动请求。JVM 启动、DebugTools 自动附着和 Spring 初始化仍需要时间。

如果后续还要调用 Java 方法，Agent 会切换到 [方法调用 Skill](./method-invocation.md)，重新确认连接并在必要时等待 Spring ready。

### 自动附着可能没有开启

DebugTools 自动附着关闭时，运行配置仍然可以被启动，但后续方法调用前可能需要再附着 JVM。Agent 会根据启动结果提示下一步，不会把“已请求启动”误报为“已连接”。

### modified files 不是 Git 改动列表

Compile and Reload Modified Files 使用 IDEA Java Debugger 从调试会话启动后或上一次 reload 后跟踪到的变更类。它不根据 `git status` 判断范围，工作区中的其他未提交文件也不会因此阻止热重载。

### 最终结果以 IDEA 为准

请求提交后，编译进度、HotSwap 是否成功以及不支持的类结构变化都会显示在 IDEA 原生界面或通知中。Agent 能发起动作，但不能把“请求已提交”当成“所有类已经成功替换”。

## 无法触发时

如果当前 AI 客户端看不到 Hotswap MCP 工具，应先检查 [IDEA MCP 配置](../mcp/idea.md) 和 DebugTools 插件。不要让 Agent 通过读取 `.idea` 文件、执行 Gradle/Maven 命令或直接启动 Java 进程来冒充 Hotswap 工作流。
