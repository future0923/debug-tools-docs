# AGENTS.md

本文件记录 `debug-tools-docs` 仓库的协作规范。后续修改文档时，请优先遵守这里的约定。

## 文档语言

- 中文文档写在 `zh/` 下，面向用户说明实际操作流程，避免只描述代码实现。
- 生成新文档或大段文档内容时，默认先只生成中文文档；中文内容经用户核对确认后，再根据用户明确要求生成英文文档。
- 说明按钮操作时，优先使用按钮图标或按钮名称，不写“第一个”“第二个”“左侧”“右上角”“右下角”等依赖当前布局的位置描述。
- 如果按钮本身已经用图标展示，正文里不要在图标后面重复写按钮文字。例如不要写“图标 `附着`”，直接写“点击工具栏中的图标按钮”。
- 表格可以保留“按钮”列，用于解释图标含义；正文则尽量保持轻量，不重复标签。

## 图标规范

- 文档中涉及插件按钮时，优先使用项目已有 SVG 图标，放在 `public/icon/method/` 下。
- 添加或替换按钮图标前，必须先查看 `debug-tools-idea` 源码，确认按钮实际绑定的图标常量或资源路径，例如 `AllIcons.Actions.Edit`、`AllIcons.General.Remove`、`DebugToolsIcons.Action.Disconnect`。不要凭语义手画一个“差不多”的图标。
- `DebugToolsIcons.*` 使用插件源码 `src/main/resources/icon/` 下的真实资源；`AllIcons.*` 使用 IntelliJ Platform JAR 里的真实 SVG 资源。可用 `javap -verbose` 查看常量对应路径，再用 `unzip -p` 从平台 JAR 取出 SVG。
- 来自 IntelliJ `AllIcons.*` 的图标文件建议命名为 `idea_*.svg`，避免和插件自定义图标同名混用；来自 `DebugToolsIcons.*` 的图标保持插件资源语义命名。
- 表格中的图标必须使用 SVG 图片，不要用 `铅笔`、`暂停`、`刷新`、`更多` 这类文字占位，否则窄列会换行变形。
- 正文列表中只要提到“图标”或图标按钮，也必须引用 SVG 文件，不要写成 `运行`、`编辑`、`移除` 这类纯文字。
- 表格图标统一使用：

```html
<img class="dt-table-icon" src="/icon/method/example.svg" alt="按钮名称" />
```

- SVG 图标必须落成文件后再引用，不要把 `<svg>...</svg>` 直接写进 Markdown 正文。内联 SVG 容易被渲染成源码文本，也会让文档难维护。
- 正文行内图标也使用文件引用，统一写法：

```html
<img class="dt-inline-icon" src="/icon/method/example.svg" alt="按钮名称" />
```

- 文档页如需自定义图标尺寸，可在页面顶部 `<style>` 中维护 `.dt-inline-icon` 和 `.dt-table-icon`，保持图标稳定不换行、不拉伸。

## 截图与资源

- 文档截图放在 `public/images/method/`。
- Markdown 中引用截图使用站点绝对路径，例如 `/images/method/attach_list.png`。
- 截图后追加 `{v-zoom}`，保持可点击放大。

## 侧边栏

- 新增中文文档页后，同步检查 `.vitepress/locales/zh.ts`，把页面加入合适的侧边栏分组。

## 验证

- 修改文档、图标或 VitePress 配置后，运行：

```bash
npm run docs:build
```

- 构建时可能出现 `Failed to track page view`、`getaddrinfo ENOTFOUND debug-tools.cc`，这是统计请求的网络问题。只要命令退出码为 `0` 且显示 `build complete`，文档构建可视为通过。
