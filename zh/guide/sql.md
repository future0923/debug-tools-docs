# 打印执行 SQL 与耗时 {#print_sql}

## 用途 {#purpose}

**痛点：** 当我们测试业务的时候，需要查看实际执行的 SQL 与耗时时间，很多上层的驱动会有多种开启打印的方式，很多都需要修改代码或修改配置打印。

DebugTools 通过在 [jdbc](https://www.oracle.com/database/technologies/appdev/jdbc.html) 层通过 `修改数据库驱动字节码` 实现在运行时打印 SQL 与耗时，从而避免上层数据库链接池的不同影响 SQL 的打印。

**理论上支持所有通过 Jdbc 链接的数据库驱动：**

- [MySQL](https://www.mysql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [SQLServer](https://www.microsoft.com/en-us/sql-server/)
- [ClickHouse](https://clickhouse.com/)
- [Oracle](https://www.oracle.com/database/technologies/)
- ...

## 使用 {#use}

### Idea {#idea}

在 `setting -> Other Settings -> DebugTools` 中配置开启或者关闭

![print_sql_setting](/images/print_sql_setting.png){v-zoom}

- `Pretty`: 格式化打印 SQL 语句
- `Compress`: 压缩形式打印 SQL 语句
- `No`: 不打印 SQL
- `Auto save sql to file`: 将 SQL 保存到文件中
- `SQL Retention Days`: 保留多少天
- `SQL 忽略模式`: 支持正则表达式匹配，忽略某些不需要打印的 SQL 语句

SQL 文件在`.idea/DebugTools/sql` 文件夹下，也可以点击 `ToolsWindow` 打开最新 SQL 文件。

![sql_file.png](/images/sql_file.png){v-zoom}

成功会在日志中输出 `Print xxx(mysql/oracle/...) log bytecode enhancement successful`

![print_sql_success](/images/print_sql_success.png){v-zoom}

**打印效果如下：**

```text
Execute consume Time: 3 ms; Execute SQL:
SELECT
    id,
    name,
    age,
    version
FROM
    dp_user
WHERE
    id=1
```

::: tip 注意

1. 由于 DebugTools 是通过字节码的方式打印SQL，所以修改配置后需要重新启动应用才能生效。
2. 启动应用时开启打印SQL配置(Compress / Pretty)可以在附着应用之后进行动态修改SQL打印配置。
3. SQL 忽略模式支持正则表达式，可以忽略不需要打印的 SQL 语句，例如：`^SELECT.*FROM sys_` 可以忽略所有以 sys\_ 表开头的 SELECT 查询。

:::

### 动态配置

启动应用时开启打印 SQL 配置(Compress / Pretty)，可以在附着应用之后进行动态修改 SQL 打印配置。

![dynamic_sql.png](/images/dynamic_sql.png){v-zoom}

### SQL 保存功能 {#sql-save}

DebugTools 支持将 SQL 保存到文件中，方便后续查看和调试。开启后会保存到 `.idea/DebugTools/sql` 文件夹下，可设置保留天数。

在 打印sql 配置中勾选 `自动保存sql到文件` 并设置保留天数,最小1天。


![sql_save_setting.png](/images/sql_save_setting.png){v-zoom}

![sql_save.png](/images/sql_save.png){v-zoom} 


### SQL 忽略功能 {#sql-ignore}

DebugTools 支持通过 `正则表达式/完整的sql语句` 忽略特定的 SQL 语句，避免打印不必要的 SQL 信息。

**配置方式：**

在设置界面的 `打印sql` 中点击 `忽略sql配置` 按钮，弹窗填写忽略规则,支持多行配置，每行一个正则模式。

![sql_ignore_setting.png](/images/sql_ignore_setting.png){v-zoom}

![sql_ignore_rule_setting.png](/images/sql_ignore_rule_setting.png){v-zoom}

**示例：**

```
^SELECT.*FROM sys_          # 忽略所有sys_表的查询
select 1 from dual
```

**使用场景：**

- 忽略系统表查询（sys\_*、information_schema.*等）
- 忽略日志表操作
- 忽略敏感信息相关的 SQL
- 忽略频繁执行的监控 SQL

## 警告 {#warning}

> [!WARNING] 最好不要在生产环境中使用
> 因为 DebugTools 通过 **修改数据库驱动字节码** 来实现 SQL 的打印，可能出现兼容不到位或者其他考虑不到的情况，生产环境可能存在风险。
