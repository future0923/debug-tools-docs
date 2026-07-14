# 转为 HTTP

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

转为 HTTP 可以把 Spring Controller 方法调用页切换成真实 HTTP 请求页。

它会根据 Controller Mapping、当前参数 JSON 和 Header 生成请求地址、Query、Header、Body，通过 http 方式直接访问目标服务。

这个功能适合验证接口从 HTTP 入口到 Controller 的完整链路，例如 Filter、Interceptor等问题。

## 打开 HTTP 模式

在方法调用页点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/convert.svg" alt="转为 HTTP" />，页面会切换到 HTTP 模式。

![转为 HTTP 入口](/images/method/convert_http_entry.png){v-zoom}

转为 http 之后就是一个普普通通的 HTTP 请求页，和正常的 http 请求工具一样使用即可。

![HTTP控制台](/images/method/http_console.png){v-zoom}



::: tip
- 第一个输入框是 host 信息，第二个输入框是 context-path 信息。
- 需要回到普通方法调用时，再点击工具栏中的 <img class="dt-inline-icon" src="/icon/method/convert.svg" alt="返回方法调用" />。
:::

## 自动识别

### Port 和 Context Path

点击 <img class="dt-inline-icon" src="/icon/method/convert.svg" alt="转为 HTTP" /> 时，如果已经附着目标应用，会自动获取启动后真实的 port 和 context-path 信息。


如果没有附着应用，DebugTools 会定位当前 Controller 所在模块，读取该模块 `src/main/resources` 下的这些 YAML 文件：

```text
bootstrap.yml
bootstrap.yaml
application.yml
application.yaml
```

本地只识别 `server.port`、`server.servlet.context-path` 和 `spring.profiles.active`。识别到 `spring.profiles.active` 后，会继续读取同目录下的 `bootstrap-{profile}.yml`、`bootstrap-{profile}.yaml`、`application-{profile}.yml`、`application-{profile}.yaml`，profile 配置会覆盖基础配置。

### 参数补齐与转换

点击 <img class="dt-inline-icon" src="/icon/method/convert.svg" alt="转为 HTTP" /> 时，会读取当前方法调用页 `Param` 里的参数 JSON，并把每个参数的 `content` 自动带到 HTTP 页。

也就是说，可以先在普通方法调用页生成参数、修改参数，再转成 HTTP 请求，不需要到 HTTP 页重新填一遍。

## Header

HTTP 模式里的 Header 和方法调用页的 `请求头` 是同一套配置方式，支持方法级、连接级和项目级 Header。

详见 [请求头](./request-header)。

## Body

body 就和正常的 http 工具一样，支持 `none`、`form-data`、`x-www-form-urlencoded`、`json`、`text`、`xml`、`binary`。

## 发送和查看结果

点击请求按钮后，DebugTools 使用 IDEA 内置 HTTP 客户端访问生成的 URL，默认超时时间是 60 秒。

请求完成后，结果区顶部会展示 `Status`、`Time`、`Size`，下面按页签展示响应内容。

`Body` 页签用于查看响应体，支持格式化和原始内容切换，也可以按 `json`、`text`、`xml`、`html` 选择展示方式。

![HTTP 响应 Body](/images/method/convert_http_response_body.png){v-zoom}

`Header` 页签展示服务端返回的响应头。

![HTTP 响应 Header](/images/method/convert_http_response_header.png){v-zoom}

`Actual Request` 页签展示 DebugTools 最终发送出去的请求，包括请求 URL、请求 Header 和请求 Body。排查参数、Header 或 Content-Type 是否正确时，可以先看这里。

![HTTP 实际请求](/images/method/convert_http_actual_request.png){v-zoom}

连接失败、超时、证书错误、目标服务不可达等异常会显示在响应 Body 区域。

## 常见情况

| 现象 | 处理 |
| --- | --- |
| 看不到 <img class="dt-inline-icon" src="/icon/method/convert.svg" alt="转为 HTTP" /> | 当前方法没有可解析的 Spring Mapping，或不是 Controller HTTP 方法。 |
| 自动端口或 Context Path 不对 | 先附着目标应用再转换；仍不对时手动修改顶部地址字段。 |
| 项目使用 `application.properties` | 本地自动识别不会解析 properties，优先依赖附着后的运行时配置。 |
| 文件上传参数为空 | 在 `form-data` 中为文件项选择本机文件路径。 |
| POST 接口参数到了 Query | 普通 `@RequestParam` 默认进 Query；需要表单 Body 时声明 `consumes` 或手动调整 Body。 |

如果只想验证方法内部业务逻辑，用普通 [方法调用](./invoke-page) 更直接；如果要验证真实 HTTP 入口链路，用转为 HTTP。
