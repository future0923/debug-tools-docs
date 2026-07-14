# Hotswap Skill

The Hotswap Skill lets an AI agent operate IDEA run configurations or compile and reload recently modified Java classes into a JVM that is being debugged.

The skill name is `debug-tools-hotswap`.

## What It Can Do

- List run configurations in the current IDEA project.
- Find a target configuration by name, module, main class, or type.
- Start a run configuration with the DebugTools Hotswap executor.
- Trigger IDEA Java Debugger's Compile and Reload Modified Files action.
- Ask you to choose among multiple run configurations or debugger sessions to avoid acting on the wrong target.

For the MCP tool parameters and return values, see [Hotswap MCP](../mcp/hotswap.md).

## How to Use It

Start a known run configuration:

```text
Start the DemoApplication run configuration with Hotswap.
```

You can also identify an application by module:

```text
Start the Spring Boot application in the demo-service module with Hotswap.
```

After modifying code, trigger hot reload:

```text
Compile the Java classes I just modified and reload them into the current debugger session.
```

```text
Run Compile and Reload Modified Files for the DemoApplication debugger session.
```

You do not need to emphasize "DebugTools." Terms such as "Hotswap," "run configuration," and "compile and reload into the debugger session" are enough to identify the workflow.

## Starting a Run Configuration

If you provide an exact IDEA run configuration name, the agent can request startup directly. If the name is missing or ambiguous, the agent first lists run configurations and filters them by module, main class, and configuration type.

When multiple configurations match, the agent shows their exact names and asks you to choose instead of starting one based only on a similar name.

## Compiling and Hot Reloading

The skill invokes IDEA Java Debugger's native Compile and Reload Modified Files action. Use it when the application is already running in Java Debugger and you want to load recent code changes into the current JVM.

If multiple attached debugger sessions exist, provide the session name or choose one from the candidates returned by the agent.

## Special Considerations

### A Successful Start Does Not Mean the Application Is Ready

A successful result only means IDEA accepted the startup request. JVM startup, DebugTools auto-attach, and Spring initialization still take time.

If the next step invokes a Java method, the agent switches to the [Method Invocation Skill](./method-invocation.md), confirms the connection, and waits for Spring readiness when necessary.

### Auto-Attach May Be Disabled

When DebugTools auto-attach is disabled, the run configuration can still start, but the JVM may need to be attached before method invocation. The agent suggests the next step from the startup result and does not report "connected" when it only requested startup.

### Modified Files Are Not the Git Change List

Compile and Reload Modified Files uses classes tracked by IDEA Java Debugger since the debugger session started or since the previous reload. It does not derive its scope from `git status`, and unrelated uncommitted files in the workspace do not prevent hot reload.

### IDEA Provides the Final Result

After the request is submitted, compilation progress, HotSwap success, and unsupported class structure changes appear in IDEA's native UI or notifications. The agent can initiate the action, but it cannot treat "request submitted" as proof that every class was replaced successfully.

## If the Skill Does Not Trigger

If the AI client cannot see the Hotswap MCP tools, check the [IDEA MCP configuration](../mcp/idea.md) and the DebugTools plugin first. Do not ask the agent to imitate the Hotswap workflow by reading `.idea` files, running Gradle or Maven commands, or starting a Java process directly.
