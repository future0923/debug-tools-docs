# Method Invocation Skill

The Method Invocation Skill lets an AI agent connect to a running Java application and invoke a specified method. It handles JVM discovery, DebugTools connections, method arguments, overloads, and ClassLoaders, so you do not need to choose each MCP tool manually.

The skill name is `debug-tools-method-invocation`.

## What It Can Do

- Reuse an existing DebugTools connection in the current IDEA project.
- Find attachable local JVMs and attach the DebugTools agent when needed.
- Invoke instance or static methods.
- Generate correctly structured templates for complex arguments.
- Distinguish overloaded methods and invoke an explicit parameter signature.
- Help select the correct ClassLoader when a class or Spring Bean cannot be found.
- View invocation results as ToString, JSON, or Debug output.

For the MCP tool parameters and return values, see [Method Invocation MCP](../mcp/method-invocation.md).

## How to Use It

Tell the AI the class name, method name, and arguments:

```text
Invoke com.demo.UserController.getUser with id=10001.
```

```text
Invoke com.demo.UserService.createUser with name Alice and age 18.
```

```text
Invoke com.demo.HealthService.check, then show the result as JSON.
```

You do not need to say "use DebugTools" in every request. Intent such as "invoke a Java method," "attach to this JVM," or "show the JSON fields in the invocation result" can trigger the skill.

To reduce follow-up questions, provide as much of the following information as possible:

| Information | When It Is Needed |
| --- | --- |
| Fully qualified class name | Recommended in every request, for example `com.demo.UserController`. |
| Method name | Required, for example `getUser`. |
| Argument values | Required when the method has arguments. |
| Parameter types | Required when overloads cannot be distinguished from values alone. |
| Project, module, or application name | Useful when IDEA has multiple projects open or several similar applications running. |
| PID | Useful when the target JVM is already known and should be attached directly. |

## What the Agent Does

The agent normally checks existing connections first. If no suitable connection exists, it lists attachable JVMs and establishes a connection. For methods with arguments, it either builds the arguments directly or generates an argument template first, depending on their complexity, and then invokes the method.

The skill chooses these steps. You only need to select among ambiguous candidates; you do not need to chain MCP tools manually.

## Special Considerations

### Newly Attached Spring Applications Need Time

Immediately after attaching to a JVM or starting an application through Hotswap, the Spring container may still be initializing. Before invoking a `Controller`, `Service`, Repository, or another Bean, the agent waits for Spring to become ready.

Regular static utility methods do not depend on Spring and normally skip this wait.

### Complex Arguments and Overloads May Need More Information

Simple arguments can be used directly. For objects, collections, nested structures, or unclear parameter names, the agent generates an argument template before filling values.

If same-name overloads are still ambiguous, the agent asks you to confirm the parameter types instead of guessing.

### Multiple JVMs or Connections Are Not Chosen Arbitrarily

When the project has one clear target, the agent can reuse it directly. When multiple connections, JVMs, or similar applications are available, the agent filters them by project, main class, and connection metadata. If the target remains ambiguous, it asks you to choose.

### ClassLoaders Are Checked Only When Needed

Normal invocations do not enumerate ClassLoaders in advance. The agent checks which ClassLoaders can load the target class only after errors such as a missing class, missing Bean, mismatched framework context, or incorrect class version.

If multiple ClassLoaders can load the class, you must confirm the target. The agent does not guess from names alone.

### If No JVM Can Be Attached, the Agent May Suggest Starting One

When there is neither an active connection nor an attachable JVM, the agent can inspect IDEA run configurations and suggest starting the application through Hotswap. Unless the original request already authorized startup, it asks before running the project.

### ToString Is the Default Result View

The default invocation result is suitable for a quick inspection. For structured content, continue with a request such as:

```text
Show the previous result as JSON.
```

```text
Use the Debug view to expand result.user.
```

JSON and Debug views depend on the HTTP information returned by the connection. If the connection does not provide it, the agent explains that the view is unavailable.

## If the Skill Does Not Trigger

If the AI client reports that no DebugTools MCP tools are available, do not ask it to simulate invocation with `jps`, port scanning, or a temporary Java program. Check the [IDEA MCP configuration](../mcp/idea.md) and confirm that the DebugTools plugin exposes its tools correctly.
