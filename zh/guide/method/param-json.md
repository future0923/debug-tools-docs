# 方法参数JSON

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

方法参数JSON 是 DebugTools 调用 Java 方法时使用的入参协议。它描述每个方法参数的来源类型和参数内容，目标 JVM 会根据 `type` 把 `content` 转成真实 Java 入参。

## 基本格式

方法参数JSON 的根节点是一个对象。根对象的每个字段对应一个方法参数，字段名通常是 Java 方法参数名，字段值固定包含 `type` 和 `content`：

```json
{
  "[参数名]": {
    "type": "[类型]",
    "content": "[参数内容]"
  }
}
```

`type` 决定目标 JVM 如何把 `content` 转成真实入参，唤醒面板时候 idea 会自动识别填写。

::: warning
非 Spring 参数转换场景下，目标 JVM 会按根对象字段顺序匹配方法参数顺序。Spring 方法会优先按参数名匹配，但仍建议保持根对象字段顺序和方法签名一致，避免编译参数名不可用时匹配错误。
:::

## 生成参数模式

- `简单`：新打开方法调用页时，实体类参数默认不展开任何属性。
- `当前`：新打开方法调用页时，实体类参数默认展开本实体的所有属性。
- `全部`：新打开方法调用页时，实体类参数默认展开本实体与所有父类的所有属性。

默认生成格式可以在 `Settings | 调用方法` 中调整。`实体类默认参数` 控制方法调用页首次打开时生成参数 JSON 的格式：

![method_default_gen_param_type.png](/images/method/method_default_gen_param_type.png){v-zoom}

::: tip
- 这个设置只影响没有参数缓存的方法页初始 JSON。已经点击 <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> 保存过的同一方法，会优先恢复已保存的参数内容。
- 实际调用时，可以删除不需要的对象字段，也可以手动补充嵌套字段；只要最终 JSON 符合目标 Java 类型即可。
:::

## 支持的 type

### simple

`simple` 用于基本类型、包装类型、字符串、数字、布尔值、日期时间、`URI`、`URL`、`Locale` 等简单值。

`content` 可以直接写 JSON 字符串、数字、布尔值或 `null`：

```json
{
  "id": {
    "type": "simple",
    "content": 10001
  },
  "enabled": {
    "type": "simple",
    "content": true
  },
  "name": {
    "type": "simple",
    "content": "张三"
  }
}
```

::: tip
- 日期时间写成字符串。
- `LocalDateTime` 和 `Date` 支持 `yyyy-MM-dd HH:mm:ss`、`yyyy-MM-dd'T'HH:mm:ss`、`yyyy/MM/dd HH:mm:ss`、`yyyy.MM.dd HH:mm:ss`、`yyyy-MM-dd HH:mm`、`yyyyMMddHHmmss`、`yyyyMMddHHmmssSSS`
- `LocalDate` 支持 `yyyy-MM-dd`、`yyyy/MM/dd`、`yyyy.MM.dd`、`yyyyMMdd`
- `LocalTime` 支持 `HH:mm:ss`、`HH:mm`、`HHmmss`、`HH:mm:ss.SSS`、`HH:mm:ss.S`、`HHmmssSSS`。
- 不同的格式根据这个传入具体内容即可。
:::

::: details 时间格式示例

```json
{
  "startTime": {
    "type": "simple",
    "content": "2026-06-15 10:30:00"
  },
  "bizDate": {
    "type": "simple",
    "content": "2026-06-15"
  }
}
```
:::


### enum

`enum` 用于枚举参数，也支持枚举数组和 `List<枚举>` 这类集合参数。

单个枚举的 `content` 写枚举常量名：

```json
{
  "status": {
    "type": "enum",
    "content": "ENABLE"
  }
}
```

枚举数组或枚举集合的 `content` 写字符串数组：

```json
{
  "statuses": {
    "type": "enum",
    "content": ["ENABLE", "DISABLE"]
  }
}
```

输入枚举 name 值时，编辑器会提示可选枚举常量，并在候选项后展示枚举注释摘要，便于确认每个值的业务含义。

![param_json_enum_completion.png](/images/method/param_json_enum_completion.png){v-zoom}


### file

`file` 用于 `java.io.File`、`MultipartFile`、文件数组或文件集合。

单个文件的 `content` 写目标应用机器上的文件绝对路径：

```json
{
  "file": {
    "type": "file",
    "content": "/tmp/input.xlsx"
  }
}
```

多个文件的 `content` 写路径数组：

```json
{
  "files": {
    "type": "file",
    "content": [
      "/tmp/a.xlsx",
      "/tmp/b.xlsx"
    ]
  }
}
```

Spring 环境下，`MultipartFile` 和 `MultipartFile[]` 会根据路径读取文件内容并构造成 Mock 文件对象；普通非 Spring 转换只会得到 `java.io.File` 或文件数组。

在 `content` 中填写 `File`、`MultipartFile` 等文件字段时，可以输入 `file` 唤醒文件路径补全项，然后选择文件路径写入当前 JSON 字符串。

![param_json_file_completion.png](/images/method/param_json_file_completion.png){v-zoom}

### class

`class` 用于 `Class<?>` 参数。`content` 写完整类名。

```json
{
  "clazz": {
    "type": "class",
    "content": "com.example.demo.UserDTO"
  }
}
```

目标 JVM 会通过 `Class.forName` 加载该类。类名写错或当前 ClassLoader 不可见时，参数会转换失败并传入 `null`。

输入类名时，编辑器会提示项目中可用的 Java 类。

![param_json_class_completion.png](/images/method/param_json_class_completion.png){v-zoom}

### 实体

`json_entity` 用于普通对象、数组、集合、Map，以及大多数复杂 DTO。

#### 实体对象

对象参数的 `content` 写成 JSON 对象：

```json
{
  "query": {
    "type": "json_entity",
    "content": {
      "userId": 10001,
      "status": "ENABLE",
      "tags": ["vip", "new"],
      "page": {
        "current": 1,
        "size": 20
      }
    }
  }
}
```

填写实体类型的 `content` 时，编辑器会根据 DTO 字段提示可选字段名。候选项会展示字段注释摘要和字段类型，已经写过的字段不会重复提示。

![param_json_entity_field_completion.png](/images/method/param_json_entity_field_completion.png){v-zoom}

#### 数组或集合

数组或集合参数的 `content` 写成 JSON 数组：

```json
{
  "ids": {
    "type": "json_entity",
    "content": [10001, 10002, 10003]
  },
  "users": {
    "type": "json_entity",
    "content": [
      {
        "id": 10001,
        "name": "张三"
      },
      {
        "id": 10002,
        "name": "李四"
      }
    ]
  }
}
```

#### Map

Map 参数的 `content` 写成 JSON 对象：

```json
{
  "attrs": {
    "type": "json_entity",
    "content": {
      "tenant": "default",
      "debug": true
    }
  }
}
```

#### enum

如果字段类型是枚举类型，可以通过枚举的 `NAME` 信息传递枚举。

输入枚举 name 值时，编辑器会提示可选枚举常量，并在候选项后展示枚举注释摘要，便于确认每个值的业务含义。

![param_json_enum_completion.png](/images/method/param_json_enum_completion.png){v-zoom}

#### class

如果是 `Class<?>` 类型，可以通过 `class` 信息传递类。

输入类名时，编辑器会提示项目中可用的 Java 类。

![param_json_class_completion.png](/images/method/param_json_class_completion.png){v-zoom}

#### 文件

如果 DTO 字段类型是 `java.io.File` 或 `MultipartFile`，字段值可以直接写目标应用机器上的文件绝对路径。`MultipartFile` 会转成 Mock 文件对象：

```json
{
  "uploadDTO": {
    "type": "json_entity",
    "content": {
      "type": "zip",
      "file": "/tmp/demo.zip",
      "multipartFile": "/tmp/demo.zip"
    }
  }
}
```

在 `content` 中填写 `File`、`MultipartFile` 等文件字段时，可以输入 `file` 唤醒文件路径补全项，然后选择文件路径写入当前 JSON 字符串。

![param_json_file_completion.png](/images/method/param_json_file_completion.png){v-zoom}


### bean

`bean` 用于 Spring、Solon 或目标 JVM 中已经存在的组件对象。`content` 可以省略。

```json
{
  "orderService": {
    "type": "bean"
  }
}
```

目标 JVM 会优先按参数类型从 Spring 容器获取最后一个 Bean；获取不到时会尝试从 Solon 或 JVM 已有实例中查找；仍找不到时，会尝试调用构造方法创建实例。

### lambda

`lambda` 用于 `@FunctionalInterface` 接口参数。`content` 写 Java Lambda 或方法引用表达式字符串，内容中需要包含 `->` 或 `::`。

```json
{
  "predicate": {
    "type": "lambda",
    "content": "value -> value != null"
  },
  "mapper": {
    "type": "lambda",
    "content": "String::valueOf"
  }
}
```

### request

`request` 用于请求对象参数。一般不需要填写业务内容，`content` 可以省略或写 `null`。

```json
{
  "request": {
    "type": "request",
    "content": null
  }
}
```

Spring 环境下支持 `javax.servlet.http.HttpServletRequest`、`jakarta.servlet.http.HttpServletRequest`、`org.springframework.http.server.reactive.ServerHttpRequest` 和 `org.springframework.web.server.ServerWebExchange`。

::: tip
- 填写的 header 等数据也可以查看到
- WebFlux 请求对象会使用当前请求页的 Header 构造上下文。
:::

### response

`response` 用于响应对象参数。一般不需要填写业务内容，`content` 可以省略或写 `null`。

```json
{
  "response": {
    "type": "response",
    "content": null
  }
}
```

Spring 环境下支持 `javax.servlet.http.HttpServletResponse`、`jakarta.servlet.http.HttpServletResponse` 和 `org.springframework.http.server.reactive.ServerHttpResponse`。

### unknown

`unknown` 是兜底类型。IDEA 无法识别参数类型时可能生成它，但目标 JVM 没有专门的转换逻辑，实际调用时通常会得到 `null`。

```json
{
  "arg": {
    "type": "unknown",
    "content": null
  }
}
```

遇到 `unknown` 时，建议按真实 Java 参数类型手动改成 `simple`、`json_entity`、`bean` 等可转换类型。

## 参数编辑器工具栏

方法参数页签中的工具栏用于转换、格式化和重新生成当前参数 JSON。

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/param_import.svg" alt="导入" /> | `导入` | 将其他格式的参数转换成 DebugTools 方法参数JSON。 |
| <img class="dt-table-icon" src="/icon/method/param_export.svg" alt="导出" /> | `导出` | 将当前 DebugTools 方法参数JSON 转换成其他格式，并复制转换结果。 |
| <img class="dt-table-icon" src="/icon/method/param_pretty.svg" alt="格式化" /> | `格式化` | 格式化当前参数 JSON，便于阅读和继续编辑。 |
| <img class="dt-table-icon" src="/icon/method/param_example_simple.svg" alt="生成简单参数" /> | `生成参数` | 按 `简单` 模式重新生成参数模板，只保留 `type` 和最小 `content`。 |
| <img class="dt-table-icon" src="/icon/method/param_example_current.svg" alt="生成当前实体参数" /> | `生成参数并默认当前实体类` | 按 `当前` 模式重新生成参数模板，展开当前实体类字段。 |
| <img class="dt-table-icon" src="/icon/method/param_example_all.svg" alt="生成完整参数" /> | `生成参数并默认全部` | 按 `全部` 模式重新生成参数模板，展开当前实体类和父类字段。 |
| <img class="dt-table-icon" src="/icon/method/idea_inlay_rename_in_comments.svg" alt="显示参数注释" /> | `显示参数注释` | 显示或隐藏参数 JSON 行尾的类型和注释提示。 |

::: warning
重新生成参数模板会覆盖编辑器里的当前参数内容。需要复用当前参数时，先保存或复制当前 JSON。
:::
