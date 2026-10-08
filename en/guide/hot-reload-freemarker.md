# Freemarker Hot Reload

DebugTools 5.3.0 supports Freemarker template hot reload. After updated templates reach the location read by the application, the next render checks for new content. After Java model classes are redefined, DebugTools clears the introspection cache of the registered object wrapper so templates can use updated properties.

## Enable and Verify

1. Start the application with `Hotswap 'application' with DebugTools`, or preload the Agent as described in [Hot Deploy](./hot-deploy.md).
2. Make sure `Freemarker` is not selected in `Settings | DebugTools | Hot Reload | Disable Plugin`.
3. Request a Freemarker page once to initialize the template configuration and view.
4. Edit a template such as `src/main/resources/templates/index.ftlh`.
5. Use `Copy 'index.ftlh' to target` to update local output, or `Deploy 'index.ftlh' to remote` for a remote target.
6. Request the page again and check the updated content.

For resource paths and transfer steps, see [Resource File Hot Reload and Deployment](./hot-reload-resource.md). Saving a template in the source directory does not update a running application that still reads an older copy from its output directory or JAR.

## Model Class Changes

When a template accesses properties or methods of a Java object, compile and hot reload any changed model classes before requesting the page again.

DebugTools adjusts the template check interval and schedules object wrapper cache clearing after class redefinition. Object wrapper integration covers `freemarker.ext.servlet.FreemarkerServlet` and Spring MVC's `FreeMarkerView`. Verify custom template engines or wrappers separately.

::: tip
- Class structure changes still require a JDK with enhanced class redefinition support. See [JDK Installation](./install.md#jdk).
- The plugin declares Freemarker `2.3.31` as its tested version. Verify other versions with your application.
- If a template stays unchanged, check its actual resource path, the selected ClassLoader, and template plugin logs, then check browser or proxy caching.
:::
