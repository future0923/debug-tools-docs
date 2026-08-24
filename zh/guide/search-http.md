# 搜索 HTTP 地址以直接跳转到对应方法定义 {#search-http-url}

## 用途 {#purpose}

在 Spring、Spring Boot、JAX-RS 或 WebFlux 项目中，一个 HTTP 地址通常由类上的 Mapping 和方法上的 Mapping 组合而成。DebugTools 可以根据输入的 URL 在项目中查找匹配的接口方法，并直接跳转到代码定义位置。

<video controls width="640">
  <source src="https://download.debug-tools.cc/mp4/search_url.mp4" type="video/mp4">https://download.debug-tools.cc/mp4/search_url.mp4
</video>

## 使用 {#use}

### 快捷键

默认快捷键为 macOS `command option N` / Windows `ctrl alt N`，也可以在 IDEA 的快捷键设置中修改。

![search_http_keymap.png](/images/url/search_http_keymap.png){v-zoom}

唤醒搜索框后输入 URL，选择匹配项即可跳转到代码定义位置。

- 支持分词搜索

![search_http.png](/images/url/search_http.png){v-zoom}

- 支持按注释搜索

![search_http_chinese.png](/images/url/search_http_chinese.png){v-zoom}

- 支持中文注释和中文首字母搜索

![search_http_chinese_first.png](/images/url/search_http_chinese_first.png){v-zoom}

### 工具窗口

点击 IDEA 右侧的 <img src="/pluginIcon.svg" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> 工具栏打开 DebugTools 窗口，再点击左侧的 <img src="/icon/search.svg" alt="S" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> 打开 HTTP 地址搜索框。

![search_tools_window.png](/images/url/search_tools_window.png){v-zoom}

### 搜索依赖 JAR 中的 URL

![search_settings.png](/images/url/search_settings.png){v-zoom}

开启该配置后，DebugTools 会同时搜索依赖 JAR 包中的 URL 信息。

## 匹配 Path 信息 {#match-path}

### URL 信息提取

::: tip 无论你输入下面哪种 URL 格式，DebugTools 都会提取出 `/test` 参与匹配
- `localhost/test?test=12`
- `http://localhost/test?test=12`
- `https://debug-tools.cc/test?test=12`
- `http://debug-tools.cc/test?test=12`
- `debug-tools.cc/test?test=12`
- `www.sada.com/test?test=12`
- `dasf.com/test?test=12`
- `cass.com/test`
- `hezhdsaong.com/test`
- `192.31.1.3/test`
- `192.31.1.3:31/test`
- `http://192.31.1.3:31/test`
:::

![url-extract.png](/images/url-extract.png){v-zoom}

### 请求方法前缀过滤

如果项目中同一个 Path 同时存在多个请求方法，可以在 URL 前增加 HTTP 方法前缀，只查看指定方法的匹配结果。

支持的前缀包括：`GET`、`POST`、`PUT`、`DELETE`、`PATCH`、`HEAD`、`OPTIONS`、`TRACE`、`REQUEST`，大小写不敏感。

::: tip 过滤请求方法示例
- `GET /patient`
- `put /patient`
- `DELETE http://localhost:8080/patient?id=1`
:::

输入 `put /patient` 时，DebugTools 会先识别 `PUT` 方法，再使用 `/patient` 进行 URL 匹配，并且只显示 `PUT /patient` 对应的方法。没有输入方法前缀时，仍保持原来的行为，按 Path 匹配所有请求方法。

### 数字参数模糊匹配

开启后会将 URL 中数字类型的 PathVariable 信息替换为 `{}` 进行搜索匹配。

例如搜索 `test/123/0`，实际会转换为 `test/{}/{}` 进行搜索。

配置：

![search_settings.png](/images/url/search_settings.png){v-zoom}

效果：

![search_replace_number.png](/images/url/search_replace_number.png){v-zoom}

### 移除 ContextPath 信息

很多项目会配置 `server.servlet.context-path`，这会导致直接按 URL 搜索时无法匹配到对应方法；经过网关转发时，也可能出现多余的 Path 信息。

可以在配置中填写需要移除的 `ContextPath`。多个配置可以通过分隔符切分，DebugTools 支持的分隔符包括 `,`、`，` 和换行符（`\r`、`\n`、`\r\n`）。

![search_settings.png](/images/url/search_settings.png){v-zoom}

上图配置会解析出需要移除的 `contextPath1`、`contextPath2`、`contextPath3` 和 `contextPath4`。

::: tip 配置需要移除的 ContextPath 后，无论你输入下面哪种 URL 格式，DebugTools 都会提取出 `/test` 参与匹配
- `localhost/contextPath1/test?test=12`
- `http://localhost/contextPath2/test?test=12`
- `https://debug-tools.cc/contextPath3/test?test=12`
- `http://debug-tools.cc/contextPath4/test?test=12`
- `debug-tools.cc/contextPath1/test?test=12`
- `www.sada.com/contextPath2test?test=12`
- `dasf.com/contextPath3/test?test=12`
- `cass.com/contextPath4/test`
- `hezhdsaong.com/contextPath1/test`
- `192.31.1.3/contextPath2/test`
- `192.31.1.3:31/contextPath3/test`
- `http://192.31.1.3:31/contextPath4/test`
:::

![remove_context_path_demo.png](/images/url/remove_context_path_demo.png){v-zoom}
