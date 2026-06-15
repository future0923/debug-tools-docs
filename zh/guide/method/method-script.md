# 方法前后置脚本

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

方法前后置脚本用于在调用目标方法前后插入一段 Java 逻辑。

它适合临时补齐调试上下文，例如写入 ThreadLocal、调整入参、准备登录态、记录调用现场，或者在方法返回和异常时做额外观察。

DebugTools 会把选中的 Java 脚本随本次方法调用发送到目标 JVM，在目标 ClassLoader 下动态编译并执行。

## 使用入口

### 方法调用页

在方法调用页打开 `方法脚本` 页签，从下拉框中选择要随本次请求执行的脚本。选择空项表示本次调用不使用脚本。

![方法调用页的方法脚本位置](/images/method/method_script_invoke_position.png){v-zoom}

选择脚本后，当前连接会记录默认脚本名称。之后在同一连接中打开其他方法调用页，会优先带出这个默认脚本；如果单个方法已经保存过请求参数，则方法缓存中的脚本选择优先。

### 连接管理页

展开连接卡片后，也可以在连接配置中维护当前连接默认使用的 `方法脚本`。这里选择的脚本会作为该连接下新打开方法调用页的默认值。

![连接管理页的方法脚本位置](/images/method/method_script_connection_position.png){v-zoom}

## 脚本工具栏

方法脚本下拉框旁边的工具栏用于维护脚本文件：

| 按钮 | 作用 |
| --- | --- |
| <img class="dt-table-icon" src="/icon/method/idea_add.svg" alt="新增" /> | 新增一个 Method Around 脚本，并打开 Java 编辑弹窗。 |
| <img class="dt-table-icon" src="/icon/method/idea_edit.svg" alt="编辑" /> | 查看或编辑当前选中的脚本。未选择脚本时不可用。 |
| <img class="dt-table-icon" src="/icon/method/idea_remove.svg" alt="删除" /> | 删除当前选中的脚本文件，并从下拉框中移除。未选择脚本时不可用。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> | 重新扫描当前项目的脚本目录，刷新下拉框。 |

新增或编辑脚本时，弹窗顶部可以填写脚本名称，并提供 `优化导入`、`格式化代码`、`类短连接引用` 操作。点击 `保存` 后，脚本会保存为当前项目下的 Java 文件。

## 脚本存储位置

脚本保存到当前 IDEA 项目的：

```text
.idea/DebugTools/MethodAround/[脚本名称].java
```

例如脚本名称填写 `LoginContext`，最终文件就是：

```text
.idea/DebugTools/MethodAround/LoginContext.java
```

::: tip
- 脚本文件跟随当前项目目录保存。
- 下拉框会读取这个目录中的文件名作为脚本名称。
- 删除脚本会同时删除对应的 `.java` 文件。
- 如果手动新增、复制或修改这个目录中的文件，点击 <img class="dt-inline-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> 后即可重新加载。
:::

## 脚本模板

新增脚本时会生成固定的 Java 模板。类名、包名和方法签名建议保持不变，只在方法体里补充自己的逻辑。

```java
package io.github.future0923.debug.tools.base.around;

import java.util.List;
import java.util.Map;

public class RunMethodAround {

    public void onBefore(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters) {

    }

    public void onAfter(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Object result) {

    }

    public void onException(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Throwable throwable) {

    }

    public void onFinally(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Object result, Throwable throwable) {

    }
}
```

## 执行顺序

一次方法调用中，脚本按下面的顺序执行：

1. `onBefore`：目标方法执行前调用。
2. 目标方法执行。
3. `onAfter`：目标方法正常返回后调用，可以读取返回值 `result`。
4. `onException`：目标方法抛出异常时调用，可以读取 `throwable`。
5. `onFinally`：无论目标方法正常返回还是抛出异常，最后都会调用。

如果没有选择脚本，DebugTools 不会执行任何 Method Around 逻辑。

## 方法参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `headers` | `Map<String, String>` | 本次调用最终合并后的 Header。 |
| `xxlJobParam` | `String` | `XxlJob` 页签填写的参数，没有填写时通常为空字符串。 |
| `className` | `String` | 当前调用的目标类名。 |
| `methodName` | `String` | 当前调用的目标方法名。 |
| `methodParameterTypes` | `List<String>` | 目标方法参数类型列表，顺序与方法签名一致。 |
| `methodParameters` | `Object[]` | 目标方法真实入参数组，可以在 `onBefore` 中修改数组元素。 |
| `result` | `Object` | 目标方法返回值，只在 `onAfter` 和 `onFinally` 中提供。 |
| `throwable` | `Throwable` | 目标方法异常，只在 `onException` 和 `onFinally` 中提供。 |

::: warning
- 不要修改模板中的包名、类名和方法签名。目标 JVM 会按固定的 `RunMethodAround` 类和固定方法签名反射调用，签名不一致会导致脚本无法执行。
- 如果使用 [热重载](../hot-reload.md) 方式启动，还可以动态改类签名(增删改属性或者方法)，但是 onXXX 方法的参数和返回值必须保持一致。
:::

## 示例

下面示例展示了几种常见用法：在调用前补充 Header、修改入参，在返回后打印结果，在异常时打印异常信息。

```java
package io.github.future0923.debug.tools.base.around;

import java.util.List;
import java.util.Map;

public class RunMethodAround {

    public void onBefore(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters) {
        headers.put("X-Debug-Source", "DebugTools");

        if (methodParameters.length > 0 && methodParameters[0] instanceof String) {
            methodParameters[0] = ((String) methodParameters[0]).trim();
        }

        System.out.println("before invoke: " + className + "#" + methodName);
    }

    public void onAfter(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Object result) {
        System.out.println("invoke result: " + result);
    }

    public void onException(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Throwable throwable) {
        System.out.println("invoke exception: " + throwable.getMessage());
    }

    public void onFinally(Map<String, String> headers, String xxlJobParam, String className, String methodName, List<String> methodParameterTypes, Object[] methodParameters, Object result, Throwable throwable) {
        System.out.println("invoke finished");
    }
}
```

::: tip
脚本运行在目标 JVM 中，`System.out.println` 会输出到目标应用控制台。脚本里访问的类也需要能被当前调用使用的 ClassLoader 加载。
:::

## 保存和恢复

- 点击方法调用页工具栏中的 <img class="dt-inline-icon" src="/icon/method/idea_save.svg" alt="保存请求参数" /> 会保存当前方法选择的脚本。再次打开同一个方法时，会跟随参数 JSON、Header、XXL-JOB 参数和链路配置一起恢复。
- 从调用记录恢复请求时，也会回填当时选择的脚本名称，便于复现历史调用。
- 在方法调用页或连接管理页手动选择脚本后，当前连接会记录这个默认脚本。后续同一连接下打开未保存过脚本选择的方法页时，会自动带出该默认值。
- 清理缓存中的 `Method param cache` 会清理方法级脚本选择；不会删除 `.idea/DebugTools/MethodAround/` 下的脚本文件，也不会删除连接默认脚本设置。

::: warning
方法脚本会在目标 JVM 中执行，和目标方法处在同一次调用链路中。不要在脚本中写入不可控的数据库更新、外部请求或长时间阻塞逻辑；调试完成后，及时取消脚本选择或删除临时脚本。
:::
