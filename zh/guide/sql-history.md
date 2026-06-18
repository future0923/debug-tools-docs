# SQL 历史记录

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

SQL 历史记录用于查看 `将执行的SQL保存到文件` 生成的本地 SQL 文件。开启保存后，DebugTools 会按 IDEA 项目、应用和日期把 SQL 写入当前用户目录，SQL 历史记录页会扫描这些文件并展示成列表。

## 打开 SQL 历史记录

在 DebugTools 工具窗口中点击 <img class="dt-inline-icon" src="/icon/method/database.svg" alt="SQL 历史记录" /> 进入 SQL 历史记录页。也可以在连接管理页的连接卡片菜单中打开当前应用的 SQL 历史记录。

![sql_history.png](/images/sql/sql_history.png){v-zoom}

列表包含三列：

| 列 | 说明 |
| --- | --- |
| `项目 / 应用` | SQL 文件所属 IDEA 项目和应用。新记录会显示项目目录名和应用名；旧记录没有项目维度时只显示应用名。 |
| `日期` | SQL 文件日期，对应 `{yyyy-MM-dd}.sql`。 |
| `操作` | 打开文件、在文件夹中显示、删除文件。 |

顶部搜索框可以按项目名、应用名或日期过滤列表。点击 <img class="dt-inline-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> 会重新扫描本地 SQL 文件。

## 常用操作

| 图标 | 按钮 | 作用 |
| --- | --- | --- |
| <img class="dt-table-icon" src="/icon/method/file.svg" alt="打开 SQL 文件" /> | `打开SQL文件` | 在 IDE 编辑器中打开当前行对应的 SQL 文件。双击列表行也会打开文件。 |
| <img class="dt-table-icon" src="/icon/method/folder.svg" alt="在文件夹中显示" /> | `在文件夹中显示` | 打开系统文件管理器并定位到当前 SQL 文件所在目录。 |
| <img class="dt-table-icon" src="/icon/method/clear.svg" alt="删除 SQL 文件" /> | `删除SQL文件` | 删除当前 SQL 文件，删除前会弹出确认框。 |
| <img class="dt-table-icon" src="/icon/method/idea_refresh.svg" alt="刷新" /> | `刷新` | 重新读取本地 SQL 历史文件。 |

## 本地保存位置

SQL 历史文件保存在当前用户目录：

```text
~/.debugTools/sql/{project}/{application}/{yyyy-MM-dd}.sql
```

`{project}` 是当前 IDEA 项目名称加项目路径 hash 生成的目录名，例如 `order-service-a8f31c2b`。项目名称用于阅读，路径 hash 用于区分本机同名项目。

`{application}` 优先使用启动主类名，例如 `com.foo.OrderApplication`；如果当前场景取不到主类名，会回退到应用名或运行配置名。项目名和应用名都会转换成适合文件系统使用的目录名，例如空格、斜杠等字符会被替换成 `-`。如果应用名为空，会使用 `application`。

旧版本生成的 SQL 文件仍然使用旧目录：

```text
~/.debugTools/sql/{application}/{yyyy-MM-dd}.sql
```

SQL 历史记录页会兼容读取旧目录。旧记录没有项目维度，所以列表中只显示应用名。

每个应用每天一个 `.sql` 文件，新 SQL 会追加到当天文件末尾。文件内容包含执行时间、数据库类型、耗时和 SQL 文本：

```sql
-- 2026-05-18 14:30:12 | mysql | 12ms
select * from user where id = 1;
```

SQL 文件不会按天数自动清理，会一直保留到手动删除。可以在 SQL 历史记录页删除单个日期文件，也可以直接在本地目录中清理。

## 和 SQL 打印设置的关系

SQL 历史记录页只负责查看和管理已经保存下来的 SQL 文件。要生成记录，需要先在 [SQL 设置](./sql.md) 中选择 `美化` 或 `压缩`，并勾选 `将执行的SQL保存到文件`。

如果关闭 SQL 打印，或没有勾选保存到文件，SQL 历史记录页不会新增记录。
