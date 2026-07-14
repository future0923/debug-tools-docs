# Install and Use the Skills

[debug-tools-ai](https://github.com/future0923/debug-tools-ai) is the open-source AI Skill project for DebugTools. It supports agents including Codex, Claude Code, Gemini, OpenCode, Cursor, Kimi, and Pi, and packages Java method invocation, Hotswap, and Spring runtime configuration access as workflows that AI clients can load.

After installation, describe the task you want to complete. You normally do not need to say "use DebugTools" or arrange the MCP tool sequence yourself.

## Before Installation

Make sure that:

- The DebugTools plugin is installed in IntelliJ IDEA.
- The IDEA MCP Server is enabled and exposes the MCP tools provided by DebugTools.
- Your AI client can connect to the MCP Server for the current IDEA project.

If IDEA MCP is not configured, read [Using IDEA MCP](../mcp/idea.md) first.

::: info
`debug-tools-ai` installs only Skills, agent instructions, and plugin metadata for supported platforms. It does not install IntelliJ IDEA, the DebugTools plugin, the DebugTools agent, or the IDEA MCP Server.
:::

## One-Line Installation

For Codex, run:

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --codex
```

Other agents use the same installer with a different final option:

| Agent | Install Option |
| --- | --- |
| Codex | `--codex` |
| Claude Code | `--claude` |
| Gemini | `--gemini` |
| OpenCode | `--opencode` |
| Cursor | `--cursor` |
| Kimi | `--kimi` |
| Pi | `--pi` |
| All local integrations | `--all` |

For example, install every supported local integration at once:

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --all
```

The installer copies Skills, agent instructions, and plugin metadata into each platform's local configuration directory. After installation, reopen the AI client or create a new task so it reloads those files.

## Codex Installation Result

With `--codex`, the three Skills are installed at:

```text
~/.codex/skills/debug-tools-method-invocation
~/.codex/skills/debug-tools-hotswap
~/.codex/skills/debug-tools-spring-config
```

Codex plugin metadata is copied to:

```text
~/.codex/plugins/debug-tools-ai
```

Run the following command to confirm that all three `SKILL.md` files exist:

```bash
ls ~/.codex/skills/debug-tools-{method-invocation,hotswap,spring-config}/SKILL.md
```

## Verify the Installation

On success, the installer prints output for the selected platform, for example:

```text
Installed Codex files
debug-tools-ai installation finished
```

For another install option, the first line names the corresponding agent. Then reopen the AI client or create a new task and confirm that it loads all three Skills.

Codex users can also use the preceding `ls` command to check the three `SKILL.md` files directly. For other agents, inspect the corresponding local configuration directory.

## Describe the Task Directly

After installation, the agent selects a Skill based on the task. None of these requests need an extra "use DebugTools" prefix:

```text
Invoke com.demo.UserController.getUser with id=10001.
```

```text
Start the DemoApplication run configuration with Hotswap.
```

```text
Compile the Java classes I just modified and reload them into the current debugger session.
```

```text
Read server.port and spring.profiles.active from the running Spring application.
```

The AI follows the Skill rules for connection selection, argument preparation, and run configuration filtering. You only need to provide another choice when multiple JVMs, run configurations, debugger sessions, or ClassLoaders may match.

## When to Be Explicit

If a request could mean either "read the source files" or "access the running JVM," state the target clearly:

```text
Read the resolved server.port from the running Spring application. Do not read application.yml.
```

If the AI client did not load the relevant Skill or cannot see the DebugTools MCP tools, add an explicit hint:

```text
Invoke this Java method through DebugTools in IDEA.
```

This is not a required prefix for everyday use. It is only an aid when diagnosing Skill discovery or MCP configuration.

## The Three Skills

| Skill | What It Does |
| --- | --- |
| [Method Invocation Skill](./method-invocation.md) | Finds or attaches to a JVM, prepares arguments, invokes Java methods, and handles Spring readiness, ClassLoaders, and result views. |
| [Hotswap Skill](./hotswap.md) | Lists and starts IDEA run configurations, then compiles and reloads recently modified Java classes into a debugger session. |
| [Spring Configuration Skill](./spring-config.md) | Reads final values for specified configuration keys from the `Environment` of a running Spring application. |

## Update

To update an installation created by the one-line installer, rerun the command with the same agent option. It overwrites the local files with the latest version from the repository's `main` branch:

```bash
curl -fsSL https://raw.githubusercontent.com/future0923/debug-tools-ai/main/install.sh | bash -s -- --codex
```

See [future0923/debug-tools-ai](https://github.com/future0923/debug-tools-ai) for source code, issue tracking, and release history.
