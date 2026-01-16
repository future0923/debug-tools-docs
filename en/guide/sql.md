# Print SQL execution and time {#print_sql}

## Purpose {#purpose}

**Pain point:** When we test the business, we need to view the actual SQL execution and time consumption. Many upper-level drivers have multiple ways to enable printing, and many of them require code modification or configuration modification for printing.

DebugTools to print SQL and time consumption at runtime by `modifying the database driver bytecode` at the [jdbc](https://www.oracle.com/database/technologies/appdev/jdbc.html) layer, thereby avoiding the impact of different upper-level database connection pools on SQL printing.

**Theoretically supports all database drivers connected through Jdbc:**

- [MySQL](https://www.mysql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [SQLServer](https://www.microsoft.com/en-us/sql-server/)
- [ClickHouse](https://clickhouse.com/)
- [Oracle](https://www.oracle.com/database/technologies/)
- ...

## Use {#use}

### Idea {#idea}

Configure to open or close in `setting -> Other Settings -> DebugTools`

![print_sql_setting](/images/print_sql_setting.png){v-zoom}

- `Pretty`: Print SQL statements in formatted form
- `Compress`: Print SQL statements in compressed form
- `No`: Do not print SQL statements
- `Auto save sql to file`: Save SQL statements to a file
- `SQL Retention Days`: Retain SQL statements for a certain number of days
- `SQL Ignore Pattern`: Support regular expression matching to ignore certain SQL statements that don't need to be printed

The SQL file is in the `.idea/DebugTools/sql` folder. You can also open the latest SQL file by clicking the `ToolsWindow`.

![sql_file.png](/images/sql_file.png){v-zoom}

Success will output `Print xxx(mysql/oracle/...) log bytecode enhancement in the log successful`

![print_sql_success](/images/print_sql_success.png){v-zoom}

**The printing effect is as follows:**

```text
Execute consume Time: 3 ms; Execute SQL:Execute consume Time: 3 ms; Execute SQL:
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

::: tip

1. Since DebugTools prints SQL in bytecode, you need to restart the application to take effect after modifying the configuration.
2. Enabling SQL printing configuration (Compress/Pretty) at application startup allows you to dynamically modify the SQL printing configuration after attaching the application.
3. SQL Ignore Pattern supports regular expressions, you can ignore SQL statements that don't need to be printed, for example: `^SELECT.*FROM sys_` can ignore all SELECT queries starting with sys\_ tables

:::

### Dynamic Configuration

Enabling SQL printing configuration (Compress/Pretty) at application startup allows you to dynamically modify the SQL printing configuration after attaching the application.
![dynamic_sql.png](/images/dynamic_sql.png){v-zoom}


### SQL Save Function {#sql-save}

DebugTools supports saving SQL to files for easy viewing and debugging later. When enabled, SQL will be saved to the `.idea/DebugTools/sql` folder, and you can set the retention days. 

Check `Automatically save sql to file` in the print sql configuration and set the number of days to keep it, minimum 1 day.

![sql_save_setting.png](/images/sql_save_setting.png){v-zoom}

![sql_save.png](/images/sql_save.png){v-zoom}

### SQL Ignore Function {#sql-ignore}

DebugTools supports ignoring specific SQL statements through regular expressions to avoid printing unnecessary SQL information.

**Configuration method:**
Click the `Ignore SQL Configuration` button in the `Print SQL` settings, then fill in the ignore rules in the popup dialog, supporting multi-line configuration, one pattern per line.

![sql_ignore_setting.png](/images/sql_ignore_setting.png){v-zoom}

![sql_ignore_rule_setting.png](/images/sql_ignore_rule_setting.png){v-zoom}

**Example:**

```
^SELECT.*FROM sys_          # Ignore all queries on sys_ tables
select 1 from dual
```

**Usage scenarios:**

- Ignore system table queries (sys\__, information_schema._, etc.)
- Ignore log table operations
- Ignore SQL related to sensitive information
- Ignore frequently executed monitoring SQL

## Warning {#warning}

> [!WARNING] It is best not to use it in a production environment
> Because DebugTools implements SQL printing by **modifying the database driver bytecode**, there may be incompatibility or other unconsidered situations, and there may be risks in the production environment.
