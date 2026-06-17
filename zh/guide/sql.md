# 打印 SQL 语句与执行耗时 {#print_sql}

## 用途 {#purpose}

在调试业务代码时，经常需要确认实际执行的 SQL、SQL 参数和执行耗时。很多数据库连接池、ORM 或日志框架都有自己的 SQL 打印方式，排查时需要改配置甚至改代码。

DebugTools 在 JDBC 层通过修改数据库驱动字节码拦截 SQL 执行，不依赖具体连接池或 ORM。只要应用使用的是已适配的 JDBC 驱动，就可以在运行时打印 SQL 与耗时。

当前已适配以下 JDBC 驱动：

- [MySQL](https://www.mysql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [KingbaseES / 人大金仓](https://www.kingbase.com.cn/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [ClickHouse](https://clickhouse.com/)
- [Oracle](https://www.oracle.com/database/technologies/)
- [达梦 DM](https://www.dameng.com/)

## 开启 SQL 打印 {#setting}

打开 `Settings -> Other Settings -> DebugTools -> SQL`，在 `打印格式` 中选择 SQL 打印方式。

![sql_setting.png](/images/sql/sql_setting.png){v-zoom}

| 打印格式 | 作用 |
| --- | --- |
| `美化` | 格式化 SQL 后打印，适合阅读较长 SQL。 |
| `压缩` | 压缩成单行 SQL 后打印，适合减少日志占用。 |
| `不打印` | 关闭 SQL 打印。 |

::: tip
- 通过设置页修改 `打印格式` 后，需要重启应用才能完成数据库驱动字节码增强。
:::

成功增强后，应用日志中会输出类似下面的内容：

```text
Print xxx(mysql/oracle/...) log bytecode enhancement successful
```

打印效果如下：

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
    id=1;
```

## 过滤 SQL {#filter}

当 SQL 日志太多时，可以点击 `过滤打印SQL配置`，只打印指定包、指定 SQL，或忽略指定包、指定 SQL。

![sql_filter_config.png](/images/sql/sql_filter_config.png){v-zoom}

配置文件分为四个固定段：

| 配置段 | 作用 | 优先级 |
| --- | --- | --- |
| `[[sql.print.packages]]` | 只打印调用链路匹配这些包名正则的 SQL。 | 高于 `sql.print.ignore-packages`。 |
| `[[sql.print.ignore-packages]]` | 忽略调用链路匹配这些包名正则的 SQL。 | 配置了 `sql.print.packages` 后该段不生效。 |
| `[[sql.print.statement]]` | 只打印匹配这些 SQL 正则的语句。 | 高于 `sql.print.ignore-statement`。 |
| `[[sql.print.ignore-statement]]` | 忽略匹配这些 SQL 正则的语句。 | 配置了 `sql.print.statement` 后该段不生效。 |

包名规则会匹配当前执行线程的调用栈；MyBatis、MyBatis-Plus、JPA 代理类会尽量还原到对应 Mapper 或接口包名后再匹配。

SQL 规则会匹配最终 SQL 文本。配置内容支持正则；空行、以 `#` 开头的行、以 `;` 开头的行会被忽略。

示例：

```txt
[[sql.print.packages]]
com.example.order
com.example.user

[[sql.print.ignore-packages]]
com.example.health

[[sql.print.statement]]
select .* from user

[[sql.print.ignore-statement]]
select 1
```

::: tip
过滤配置会被目标应用监听。应用已经加载过滤配置后，修改配置文件会自动重新加载，不需要因为调整过滤规则而重启应用。
:::

## 保存 SQL 文件 {#save}

勾选 `将执行的SQL保存到文件` 后，DebugTools 会把打印出来的 SQL 追加保存到当前用户目录：

```text
~/.debugTools/sql/{application}/{yyyy-MM-dd}.sql
```

每条记录会包含执行时间、数据库类型、耗时和 SQL 文本，例如：

```sql
-- 2026-05-18 14:30:12 | mysql | 12ms
select * from user where id = 1;
```

SQL 文件会保留到你手动删除为止。可以在 DebugTools 工具窗口中打开 [SQL 历史记录](./sql-history.md)，查看、打开、定位或删除这些 SQL 文件。

## 连接中的动态切换 {#dynamic}

应用启动时只要已经启用了 SQL 打印增强，就可以在连接管理页的连接卡片中，通过 `SQL` 下拉框切换当前连接的 SQL 打印格式。该操作会发送到目标应用，立即调整当前连接的打印模式。

![sql_dynamic_switch.png](/images/sql/sql_dynamic_switch.png){v-zoom}

::: tip
如果应用启动时没有启用 SQL 打印增强，连接卡片中切换打印格式也无法补上数据库驱动字节码增强，需要重新启动应用。
:::

## 警告 {#warning}

> [!WARNING] 不建议在生产环境中使用
> DebugTools 通过修改数据库驱动字节码实现 SQL 打印。不同驱动、连接池或运行环境可能存在兼容风险，生产环境请谨慎开启。
