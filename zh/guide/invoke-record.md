# 方法调用历史

## 开启

![config_invoke_record.png](/images/config_invoke_record.png){v-zoom}

开启配置可以生成调用的方法记录。

## 调用记录列表

点击 Idea 右侧的 <img src="/pluginIcon.svg" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> 工具栏唤醒 DebugTools 的窗口查看调用历史（最多 500 条）列表。

![invoke_record_toolwindow.png](/images/invoke_record_toolwindow.png){v-zoom}

展示格式：

```
执行状态图标 执行时间 类名#方法名(参数类型): 返回值类型 声明异常 执行时间
```

## 菜单

![invoke_record_action.png](/images/invoke_record_action.png){v-zoom}

- `Goto method source`: 跳转当前选中的源码位置
- `Show call json`: 展示当前选中的调用时的 json 信息
- `Show param json`: 展示当前选中的调用时方法参数 json 信息
- `Quick Debug`: 用当前选中的参调用记录唤醒调试面板，**双击鼠标左键也可以**。
- `Rerun`: 重新运行当前选中的方法，参数与之前完全一致
- `Return With Default ClassLoader`: 用当前选中的默认类加载器重新运行当前选中的方法，参数除类加载器与之前完全一致
- `Remove`: 移除当前选中的调用记录