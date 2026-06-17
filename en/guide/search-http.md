# Search HTTP URL to Jump Directly to the Corresponding Method Definition {#search-http-url}

## Purpose {#purpose}

In Spring, Spring Boot, or WebFlux projects, an HTTP URL is usually composed from Mapping annotations on both the class and the method. DebugTools can search for the matching interface method based on the entered URL and jump directly to the code definition.

<video controls width="640">
  <source src="https://download.debug-tools.cc/mp4/search_url.mp4" type="video/mp4">https://download.debug-tools.cc/mp4/search_url.mp4
</video>

## Use {#use}

### Shortcut Keys

The default shortcut is macOS `command option N` / Windows `ctrl alt N`. You can also modify it in IDEA's keymap settings.

![search_http_keymap.png](/images/url/search_http_keymap.png){v-zoom}

Open the search box, enter the URL, and select a matching item to jump to the code definition.

- Supports word-segment search

![search_http.png](/images/url/search_http.png){v-zoom}

- Supports searching by comments

![search_http_chinese.png](/images/url/search_http_chinese.png){v-zoom}

- Supports Chinese comments and Chinese initial-letter search

![search_http_chinese_first.png](/images/url/search_http_chinese_first.png){v-zoom}

### Tool Window

Click the <img src="/pluginIcon.svg" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> toolbar on the right side of IDEA to open the DebugTools window, then click <img src="/icon/search.svg" alt="S" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> on the left to open the HTTP URL search box.

![search_tools_window.png](/images/url/search_tools_window.png){v-zoom}

### Search URLs in Dependent JARs

![search_settings.png](/images/url/search_settings.png){v-zoom}

After enabling this option, DebugTools also searches URL information in dependent JAR files.

## Match Path Information {#match-path}

### URL Information Extraction

::: tip No matter which URL format below you enter, DebugTools extracts `/test` for matching
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

### Request Method Prefix Filter

If the same Path has multiple request methods in the project, add an HTTP method prefix before the URL to show only matching results for the specified method.

Supported prefixes include `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`, `TRACE`, and `REQUEST`. Matching is case-insensitive.

::: tip Request method filter examples
- `GET /patient`
- `put /patient`
- `DELETE http://localhost:8080/patient?id=1`
:::

When you enter `put /patient`, DebugTools first recognizes the `PUT` method, then uses `/patient` for URL matching, and only shows the method corresponding to `PUT /patient`. When no method prefix is entered, the original behavior is preserved: all request methods are matched by Path.

### Match Numeric Path Variables

After enabling this option, numeric PathVariable segments in the URL are replaced with `{}` for search matching.

For example, searching `test/123/0` is converted to `test/{}/{}`.

Setting:

![search_settings.png](/images/url/search_settings.png){v-zoom}

Result:

![search_replace_number.png](/images/url/search_replace_number.png){v-zoom}

### Remove ContextPath Information

Many projects configure `server.servlet.context-path`, which can prevent direct URL searches from matching the corresponding method. Extra Path information may also appear after gateway forwarding.

You can configure the `ContextPath` values that need to be removed. Multiple values can be split by separators. DebugTools supports `,`, `，`, and newline separators (`\r`, `\n`, `\r\n`).

![search_settings.png](/images/url/search_settings.png){v-zoom}

The configuration in the screenshot is parsed as `contextPath1`, `contextPath2`, `contextPath3`, and `contextPath4`.

::: tip After configuring ContextPath values to remove, no matter which URL format below you enter, DebugTools extracts `/test` for matching
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
