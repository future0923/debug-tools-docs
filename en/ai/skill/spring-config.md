# Spring Configuration Skill

The Spring Configuration Skill lets an AI agent read `Environment` values from a running Spring application. It returns the values resolved after application startup, rather than simply reading `application.yml` or `application.properties` from the repository.

The skill name is `debug-tools-spring-config`.

## What It Can Do

- Read runtime values for specified Spring configuration keys.
- Reuse an existing DebugTools connection or attach to a target JVM when needed.
- Select the correct target when multiple applications are running.
- Distinguish between "the key resolved to no value" and "the request failed."

Common uses include:

- Confirming the effective `server.port`.
- Inspecting `spring.profiles.active`.
- Checking the actual endpoint used by a data source, Redis, or a message queue.
- Diagnosing final values after environment variables, startup arguments, a configuration center, or profiles override local files.

## How to Use It

Specify the running application and the keys to read:

```text
Read server.port and spring.profiles.active from the running Spring application.
```

```text
Show the effective spring.datasource.url for demo-service.
```

```text
Confirm the final value of feature.user-cache.enabled in the current JVM.
```

You do not need to say "use DebugTools." Phrases such as "running Spring application," "current JVM," and "effective value" help the agent understand that you want the runtime `Environment`, not a source configuration file.

## What You Need to Provide

This capability queries explicit keys and cannot export every Spring property without a filter. Provide at least one configuration key.

If multiple Spring applications are running, also provide the application name, module name, main class, or PID, for example:

```text
Read server.port from the Spring application with PID 31245.
```

If no key is provided, the agent asks which properties to read. If it cannot identify one target from the available connections, it asks you to choose an application.

## Why This Differs from Reading Configuration Files

A value in `application.yml` is not necessarily the value the application uses. Spring may also be affected by:

- The active profile.
- Environment variables.
- JVM system properties and startup arguments.
- External configuration files.
- Configuration centers or other PropertySources.

The Spring Configuration Skill returns the value resolved by the runtime `Environment`, making it useful for questions such as, "Why does the application use a different value from the one in the repository?"

## Special Considerations

### `null` Means the Key Did Not Resolve

If a key returns `null`, the current Spring `Environment` did not resolve a value for it. This does not mean the entire request failed. Check the key spelling, active profile, and configuration sources.

### A Working Connection Is Required

The skill checks DebugTools connections first and attempts to attach to a JVM if no suitable connection exists. It does not guess `localhost` or a default port, and it does not scan local ports for Spring applications.

If no JVM can be attached, the agent may suggest starting an IDEA run configuration through Hotswap. It does not start the application without authorization.

### Runtime Configuration May Be Sensitive

Data source passwords, tokens, and secret keys may also be present in the Spring `Environment`. Read only the keys needed for the investigation, and do not paste sensitive results into issues, chat logs, or public logs.

### This Is Not Java Method Invocation

Configuration reads use DebugTools' Spring configuration HTTP endpoint rather than invoking a Spring Bean method. Use the [Method Invocation Skill](./method-invocation.md) when the task needs to execute Java code.

## If the Skill Does Not Trigger

If the AI client reports that DebugTools MCP connection tools are missing, check the [IDEA MCP configuration](../mcp/idea.md) and plugin status. Do not invent an MCP tool such as `get_spring_config`, and do not substitute local configuration file reads for runtime values.
