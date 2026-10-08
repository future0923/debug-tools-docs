# Thymeleaf Hot Reload

DebugTools 5.3.0 supports Thymeleaf template hot reload. The plugin clears the current template's cache before rendering, allowing subsequent requests to read updated content.

## Enable and Verify

1. Start the application with `Hotswap 'application' with DebugTools`, or preload the Agent as described in [Hot Deploy](./hot-deploy.md).
2. Make sure `Thymeleaf` is not selected in `Settings | DebugTools | Hot Reload | Disable Plugin`.
3. Request a Thymeleaf page once.
4. Edit a template such as `src/main/resources/templates/thymeleaf.html`.
5. Use `Copy 'thymeleaf.html' to target` to update local output, or `Deploy 'thymeleaf.html' to remote` for a remote target.
6. Request the page again and check that the changes took effect.

See [Resource File Hot Reload and Deployment](./hot-reload-resource.md) for the steps. After cache clearing, the application must still read the new file from the path used by its template resolver. Saving a source file alone does not replace a template inside a JAR.

## Changing Java Code and Templates Together

If you also change a Controller, Service, or Java object used by the template, update the Java compilation output and trigger class hot reload, then update the template resource. Template cache clearing does not replace Java class redefinition.

::: tip
- The plugin declares Thymeleaf `3.0.15` as its tested version. Verify other versions with your application.
- This feature applies to the `TemplateManager.parseAndProcess` rendering path. Verify whether custom rendering flows use that entry point.
- If a template stays unchanged, check the template resolver path, resource deployment directory, and default ClassLoader. Browser or proxy caches may also affect the displayed result.
:::
