# Print SQL execution and time {#print_sql}

## Purpose {#purpose}

**Pain point:** When we test the business, we need to view the actual SQL execution and time consumption. Many
upper-level drivers have multiple ways to enable printing, and many of them require code modification or configuration
modification for printing.

DebugTools to print SQL and time consumption at runtime by `modifying the database driver bytecode` at
the [jdbc](https://www.oracle.com/database/technologies/appdev/jdbc.html) layer, thereby avoiding the impact of
different upper-level database connection pools on SQL printing.

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

The SQL file is in the `.idea/DebugTools/sql` folder. You can also open the latest SQL file by clicking the
`ToolsWindow`.

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

1. Since DebugTools prints SQL in bytecode, you need to restart the application to take effect after modifying the
   configuration.
2. Enabling SQL printing configuration (Compress/Pretty) at application startup allows you to dynamically modify the SQL
   printing configuration after attaching the application.

:::

### Dynamic Configuration

Enabling SQL printing configuration (Compress/Pretty) at application startup allows you to dynamically modify the SQL
printing configuration after attaching the application.

![dynamic_sql.png](/images/dynamic_sql.png){v-zoom}

### Filtering SQL

When there are too many SQL statements, we can configure filters to target specific SQL statements.

![filter_sql_setting.png](/images/filter_sql_setting.png){v-zoom}

::: tip
The configuration to ignore SQL is only visible when printing SQL is enabled.
:::

**Supports the following four configurations**

- `sql.print.packages`: Prints SQL statements from the specified call chain package.
    - **Identification method: Checks if the execution thread stack information matches the configured package name
      using regular expressions.**
    - **This configuration has higher priority than sql.print.ignore-packages.**
    - **Supports regular expressions.**
- `sql.print.ignore-packages`: Ignores printing SQL statements from the specified call chain package.
    - **Identification method: Checks if the execution thread stack information matches the configured package name
      using regular expressions.**
    - **This configuration is disabled if sql.print.packages is configured.**
    - **Supports regular expressions.**
- `sql.print.statement`: Prints the specified SQL statement.
    - **This configuration has higher priority than sql.print.ignore-statement.**
    - **Supports regular expressions.**
- `sql.print.ignore-statement`: Ignore the specified SQL statement
    - **This configuration is ineffective if `sql.print.statement` is configured**
    - **Supports regular expressions**

The file content is a regular text file, with content appended to the corresponding paragraph. It supports `#` and `;`
comments. `[[xxx]]` is a fixed format. Multi-line support is supported. For example:

```txt
[[sql.print.packages]]
com.example.demo
com.example.test

[[sql.print.ignore-packages]]
com.example.demo
com.example.test

[[sql.print.statement]]
select 1
select * from user

[[sql.print.ignore-statement]]
select 1
select * from user
```

## Warning {#warning}

> [!WARNING] It is best not to use it in a production environment
> Because DebugTools implements SQL printing by **modifying the database driver bytecode**, there may be incompatibility or other unconsidered situations, and there may be risks in the production environment.