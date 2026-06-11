Click the <img src="/pluginIcon.svg" style="display: inline-block; width: 20px; height: 20px; vertical-align: middle;" /> toolbar on the right side of Idea to wake up the DebugTools window, and click to fill in the remote address.

Enter **host**, **tcpPort** and **httpPort**, and click the `Save & Connent` button to connect the remote application.

After successfully attaching the application, DebugTools will display the attachment status.
- `R`: indicates that the application is a remote application, and `L` indicates that it is a local application.
- `Connected`: the application has been successfully attached and connected to the service.
- `i.g.f.d.t.t.a.DebugToolsTestApplication`: the application name.
  - `Specified application name` if the application name is specified during attachment.
  - If the application name is not specified, the `spring.application.name` configuration item is used if it is a Spring application.
  - If not specified, the `Main-Class` in the jar at startup is used.
  - If not found, the `sun.java.command` in the startup command is used.
