# Method Parameter JSON

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

Method parameter JSON is the input protocol used by DebugTools when invoking Java methods. It describes the source type and content of each method parameter. The target JVM converts `content` into the real Java argument according to `type`.

## Basic Format

The root node is a JSON object. Each field in the root object corresponds to one method parameter. The field name is usually the Java method parameter name, and the value contains fixed `type` and `content` fields:

```json
{
  "[parameterName]": {
    "type": "[type]",
    "content": "[content]"
  }
}
```

`type` decides how the target JVM converts `content` into the real argument. When the invocation panel is opened, IDEA automatically detects and fills the initial parameter JSON.

::: warning
In non-Spring parameter conversion scenarios, the target JVM matches method parameters by the field order of the root object. Spring methods prefer matching by parameter name, but it is still recommended to keep the root object field order consistent with the method signature to avoid matching errors when compiled parameter names are unavailable.
:::

## Parameter Generation Mode

- `Simple`: when a method invocation page is opened, entity parameters do not expand any properties by default.
- `Current`: when a method invocation page is opened, entity parameters expand all properties of the current entity by default.
- `All`: when a method invocation page is opened, entity parameters expand all properties of the current entity and all parent classes by default.

You can change the default generation format in `Settings | Method Invocation`. `Default entity parameter` controls the initial parameter JSON format when a method invocation page is opened.

![method_default_gen_param_type.png](/images/method/method_default_gen_param_type.png){v-zoom}

::: tip
- This setting only affects the initial JSON of method pages without parameter cache. If the same method has been saved with <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="Save request parameters" />, the saved parameter content is restored first.
- The generated template is only a starting point. You can delete unnecessary object fields or manually add nested fields as long as the final JSON matches the target Java type.
:::

## Supported Types

### simple

`simple` is used for primitive types, wrapper types, strings, numbers, booleans, date/time values, `URI`, `URL`, `Locale`, and other simple values.

`content` can be a JSON string, number, boolean, or `null`:

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
    "content": "Tom"
  }
}
```

::: tip
- Write date/time values as strings.
- `LocalDateTime` and `Date` support `yyyy-MM-dd HH:mm:ss`, `yyyy-MM-dd'T'HH:mm:ss`, `yyyy/MM/dd HH:mm:ss`, `yyyy.MM.dd HH:mm:ss`, `yyyy-MM-dd HH:mm`, `yyyyMMddHHmmss`, and `yyyyMMddHHmmssSSS`.
- `LocalDate` supports `yyyy-MM-dd`, `yyyy/MM/dd`, `yyyy.MM.dd`, and `yyyyMMdd`.
- `LocalTime` supports `HH:mm:ss`, `HH:mm`, `HHmmss`, `HH:mm:ss.SSS`, `HH:mm:ss.S`, and `HHmmssSSS`.
- Choose the concrete format according to the target parameter type.
:::

::: details Date/time example

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

`enum` is used for enum parameters. It also supports enum arrays and collections such as `List<Enum>`.

For a single enum, write the enum constant name in `content`:

```json
{
  "status": {
    "type": "enum",
    "content": "ENABLE"
  }
}
```

For enum arrays or enum collections, write a string array in `content`:

```json
{
  "statuses": {
    "type": "enum",
    "content": ["ENABLE", "DISABLE"]
  }
}
```

When entering an enum name value, the editor suggests available enum constants and shows the enum comment summary after each candidate, which helps confirm the business meaning of each value.

![param_json_enum_completion.png](/images/method/param_json_enum_completion.png){v-zoom}

### file

`file` is used for `java.io.File`, `MultipartFile`, file arrays, or file collections.

For a single file, write the absolute path on the target application machine in `content`:

```json
{
  "file": {
    "type": "file",
    "content": "/tmp/input.xlsx"
  }
}
```

For multiple files, write a path array in `content`:

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

In Spring environments, `MultipartFile` and `MultipartFile[]` are converted to mock file objects after reading file content from the path. In normal non-Spring conversion, the result is `java.io.File` or a file array.

When filling `File`, `MultipartFile`, or similar file fields in `content`, enter `file` to trigger the file path completion item, then choose a file path to write it into the current JSON string.

![param_json_file_completion.png](/images/method/param_json_file_completion.png){v-zoom}

### class

`class` is used for `Class<?>` parameters. Write the fully qualified class name in `content`.

```json
{
  "clazz": {
    "type": "class",
    "content": "com.example.demo.UserDTO"
  }
}
```

The target JVM loads the class through `Class.forName`. If the class name is wrong or not visible to the current ClassLoader, parameter conversion fails and `null` is passed in.

When entering a class name, the editor suggests Java classes available in the project.

![param_json_class_completion.png](/images/method/param_json_class_completion.png){v-zoom}

### json_entity

`json_entity` is used for regular objects, arrays, collections, maps, and most complex DTOs.

#### Entity Object

For object parameters, write a JSON object in `content`:

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

When filling `content` for an entity type, the editor suggests available field names according to the DTO. Each candidate shows the field comment summary and field type. Fields already written are not suggested again.

![param_json_entity_field_completion.png](/images/method/param_json_entity_field_completion.png){v-zoom}

#### Array or Collection

For arrays or collection parameters, write a JSON array in `content`:

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
        "name": "Tom"
      },
      {
        "id": 10002,
        "name": "Jerry"
      }
    ]
  }
}
```

#### Map

For map parameters, write a JSON object in `content`:

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

#### Enum Field

If a DTO field is an enum type, pass the enum by its `NAME` value.

When entering an enum name value, the editor suggests available enum constants and shows the enum comment summary after each candidate.

![param_json_enum_completion.png](/images/method/param_json_enum_completion.png){v-zoom}

#### Class Field

If a DTO field is `Class<?>`, pass the class by class name.

When entering a class name, the editor suggests Java classes available in the project.

![param_json_class_completion.png](/images/method/param_json_class_completion.png){v-zoom}

#### File Field

If a DTO field type is `java.io.File` or `MultipartFile`, the field value can be the absolute path of a file on the target application machine. `MultipartFile` is converted to a mock file object.

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

When filling `File`, `MultipartFile`, or similar file fields in `content`, enter `file` to trigger the file path completion item, then choose a file path to write it into the current JSON string.

![param_json_file_completion.png](/images/method/param_json_file_completion.png){v-zoom}

### bean

`bean` is used for component objects that already exist in Spring, Solon, or the target JVM. `content` can be omitted.

```json
{
  "orderService": {
    "type": "bean"
  }
}
```

The target JVM first gets the last Bean by parameter type from the Spring container. If not found, it tries to find it from Solon or existing JVM instances. If still not found, it tries to create an instance through a constructor.

### lambda

`lambda` is used for `@FunctionalInterface` interface parameters. Write a Java Lambda or method reference expression string in `content`; it must contain `->` or `::`.

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

`request` is used for request object parameters. Business content is usually not required. `content` can be omitted or set to `null`.

```json
{
  "request": {
    "type": "request",
    "content": null
  }
}
```

In Spring environments, `javax.servlet.http.HttpServletRequest`, `jakarta.servlet.http.HttpServletRequest`, `org.springframework.http.server.reactive.ServerHttpRequest`, and `org.springframework.web.server.ServerWebExchange` are supported.

::: tip
- The headers and other data filled in the invocation page can also be obtained.
- WebFlux request objects are built from the headers of the current request page.
:::

### response

`response` is used for response object parameters. Business content is usually not required. `content` can be omitted or set to `null`.

```json
{
  "response": {
    "type": "response",
    "content": null
  }
}
```

In Spring environments, `javax.servlet.http.HttpServletResponse`, `jakarta.servlet.http.HttpServletResponse`, and `org.springframework.http.server.reactive.ServerHttpResponse` are supported.

### unknown

`unknown` is a fallback type. IDEA may generate it when it cannot identify the parameter type, but the target JVM has no dedicated conversion logic for it, so the actual invocation usually receives `null`.

```json
{
  "arg": {
    "type": "unknown",
    "content": null
  }
}
```

When you see `unknown`, manually change it to a convertible type such as `simple`, `json_entity`, or `bean` according to the real Java parameter type.

## Parameter Editor Toolbar

The toolbar in the method parameter tab is used to convert, format, and regenerate the current parameter JSON.

| Icon | Button | Description |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/param_import.svg" alt="Import" /> | `Import` | Convert other parameter formats into DebugTools method parameter JSON. |
| <img class="dt-table-icon" src="/icon/method/param_export.svg" alt="Export" /> | `Export` | Convert the current DebugTools method parameter JSON into another format and copy the converted result. |
| <img class="dt-table-icon" src="/icon/method/param_pretty.svg" alt="Format" /> | `Format` | Format the current parameter JSON so it is easier to read and edit. |
| <img class="dt-table-icon" src="/icon/method/param_example_simple.svg" alt="Generate simple parameters" /> | `Gen Param` | Regenerate the parameter template in `Simple` mode, keeping only `type` and minimum `content`. |
| <img class="dt-table-icon" src="/icon/method/param_example_current.svg" alt="Generate current entity parameters" /> | `Gen Param With Default Current Entity Class` | Regenerate the parameter template in `Current` mode, expanding fields of the current entity class. |
| <img class="dt-table-icon" src="/icon/method/param_example_all.svg" alt="Generate all parameters" /> | `Gen Param With Default All` | Regenerate the parameter template in `All` mode, expanding fields of the current entity class and parent classes. |
| <img class="dt-table-icon" src="/icon/method/idea_inlay_rename_in_comments.svg" alt="Show parameter comments" /> | `Show parameter comments` | Show or hide line-end type and comment hints in the parameter JSON. |

::: warning
Regenerating the parameter template overwrites the current content in the editor. Save or copy the current JSON first if you need to reuse it.
:::
