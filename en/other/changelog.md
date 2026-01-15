---
layout: doc
aside: false
---
# ChangeLog

## [4.5.2](https://github.com/future0923/debug-tools/compare/v4.5.1...v4.5.2) (2026-01-15)

- [#185](https://github.com/future0923/debug-tools/issues/185) - Add configuration for hot reload to retain static variables of class using runtime data.
- [#186](https://github.com/future0923/debug-tools/issues/186) - Fixed a bug where JdbcTemplate could not print SQL by [@wangqiqi95](https://github.com/wangqiqi95)
- [#187](https://github.com/future0923/debug-tools/issues/187) - Fixed a bug where hot deployment of local compilation of VFS would result in a deadlock during synchronous refresh. [#190](https://github.com/future0923/debug-tools/issues/190) - Fixed a bug where OpenFeign projects would not start without Mybatis.
- [#190](https://github.com/future0923/debug-tools/issues/190) - Fixed a bug where OpenFeign projects would not start without Mybatis.
- [#191](https://github.com/future0923/debug-tools/issues/191) - Fixed a bug where dylib would not reload when switching between JDK 8 and JDK 17 on macOS by [@wangqiqi95](https://github.com/wangqiqi95)
- [#196](https://github.com/future0923/debug-tools/issues/196) - Fixed a bug where SQL could not be formatted when using ServerPreparedStatement.
- [#198](https://github.com/future0923/debug-tools/issues/198) - Fixed a bug where searching URLs could not recognize controller annotations inserted into custom annotations by [@wangqiqi95](https://github.com/wangqiqi95) [@wangqiqi95](https://github.com/wangqiqi95)
- [#202](https://github.com/future0923/debug-tools/issues/202) - Optimized the search URL return style, added a double shift option to display the search URL by [@wangqiqi95](https://github.com/wangqiqi95)

## [4.5.1](https://github.com/future0923/debug-tools/compare/v4.5.0...v4.5.1) (2026-01-06)

- [#180](https://github.com/future0923/debug-tools/issues/180) - Added support for file array type parameters when calling Java methods by [@ayuayue](https://github.com/ayuayue)
- Fixed a bug where OpenFeign and Spring class conflicts caused Spring projects to fail to recognize hot reload.

## [4.5.0](https://github.com/future0923/debug-tools/compare/v4.4.4...v4.5.0) (2025-12-22)

- [#166](https://github.com/future0923/debug-tools/issues/166) - Added support for OpenFeign for hot reload/hot deployment
- [#164](https://github.com/future0923/debug-tools/issues/164) - Added log level control by [@wangqiqi95](https://github.com/wangqiqi95)
- [#167](https://github.com/future0923/debug-tools/issues/167) - Fixed a bug in DM8 that caused a null pointer exception when printing SQL by [@wangqiqi95](https://github.com/wangqiqi95)
- [#170](https://github.com/future0923/debug-tools/issues/170) - Fixed a bug where breakpoint markers didn't update promptly when starting with the DebugTools executor.
- [#172](https://github.com/future0923/debug-tools/issues/172) - Fixed a bug where starting two applications simultaneously on Windows would display DLL file usage, by [@ayuayue](https://github.com/ayuayue)
- Optimized the hot reload lock mechanism for MyBatis and MyBatisPlus.
- Fixed a bug where hot reload of anonymous inner classes occasionally caused JVM crashes.

## [4.4.4](https://github.com/future0923/debug-tools/compare/v4.4.3...v4.4.4) (2025-11-24)

- [#71](https://github.com/future0923/debug-tools/issues/71) - Added dynamic control over SQL printing configuration
- [#154](https://github.com/future0923/debug-tools/pull/154) - Added a semicolon at the end of printed SQL by [@javalover123](https://github.com/javalover123)
- [#158](https://github.com/future0923/debug-tools/issues/158) - Optimized MethodAround execution performance
- [#155](https://github.com/future0923/debug-tools/issues/155) - Fixed a bug where MyBatis hot reload failed when MyBatis and MyBatisPlus were used together by [@ruhengChen](https://github.com/ruhengChen)
- [#160](https://github.com/future0923/debug-tools/issues/160) - Fixed a bug where Spring annotation values were null when scanning URLs
- [#161](https://github.com/future0923/debug-tools/issues/161) - Fixed a bug where hot reload failed to start after inheriting the GenericFilterBean class

## [4.4.3](https://github.com/future0923/debug-tools/compare/v4.4.2...v4.4.3) (2025-11-03)

- [#150](https://github.com/future0923/debug-tools/issues/150) - Supports JDK 25 hot reload
- [#151](https://github.com/future0923/debug-tools/issues/151) - View call results configuration changes via JSON
- [#149](https://github.com/future0923/debug-tools/issues/149) - Optimize the debug window
- [#153](https://github.com/future0923/debug-tools/issues/153) - Fixed a bug where only one instance of the same URL could be used across different modules
- [#152](https://github.com/future0923/debug-tools/issues/152) - Fixed a bug where classes could not be found during the second remote compilation after hot deployment of the same class

## [4.4.2](https://github.com/future0923/debug-tools/compare/v4.4.1...v4.4.2) (2025-10-15)

- [#142](https://github.com/future0923/debug-tools/issues/142) - Supports switching naming formats
- [#139](https://github.com/future0923/debug-tools/issues/139) - Supports configuring whether to search for URLs in dependent JARs
- [#148](https://github.com/future0923/debug-tools/issues/148) - Supports configuring whether to enable method call logging
- [#144](https://github.com/future0923/debug-tools/issues/144) - Fixed a bug causing Spring's BeanCopier hot reload to fail
- [#136](https://github.com/future0923/debug-tools/issues/136) - Fixed a bug where single quotes were not escaped when printing SQL, causing SQL print failure. By [@fat-huhu](https://github.com/fat-huhu)
- [#137](https://github.com/future0923/debug-tools/issues/137) - Fixed a bug where the order of SQL statements was disrupted when reading from EasyExcel without adding @ExcelIgnore. By [@wangqiqi95](https://github.com/wangqiqi95)

## [4.4.1](https://github.com/future0923/debug-tools/compare/v4.4.0...v4.4.1) (2025-09-29)

- Fixed an issue where the ToolWindow occasionally returned null when switching projects.
- [#127](https://github.com/future0923/debug-tools/issues/127) - Optimized hot deployment file scanning and local compilation performance.
- [#131](https://github.com/future0923/debug-tools/issues/131) - Optimized the display of contextName information during Tomcat class loading by [@iwillmissu](https://github.com/iwillmissu)
- [#129](https://github.com/future0923/debug-tools/issues/129) - Fixed a bug where calling history list operations would block the UI process.
- [#35](https://github.com/future0923/debug-tools/issues/35) - Fixed occasional hot reload failure of Jackson when returning Spring data.
- [#130](https://github.com/future0923/debug-tools/issues/130) - Fixed a bug where hot reload of entity changes to the resultType in MyBatis XML did not take effect.
- [#134](https://github.com/future0923/debug-tools/issues/134) - Fixed a bug where resource file monitoring failed when a resource folder contained only one file and was hot-reloaded simultaneously with a class file.
- [#135](https://github.com/future0923/debug-tools/issues/135) - Fixed a bug where controller reload failed in Spring Boot 2.0.x and Spring MVC 5.0.x.

## [4.4.0](https://github.com/future0923/debug-tools/compare/v4.3.1...v4.4.0) (2025-09-18)

- Support for viewing call log information
- Display the name of the currently attached application in the call parameters window/response information window
- Support for classpath file mode for shortened command lines
- Optimized URL search response speed
- Fixed a bug where Spring interface listeners could not receive events
- Fixed a bug where ReflectUtil in earlier versions of HuTool could not find the getMethodsDirectly method

## [4.3.1](https://github.com/future0923/debug-tools/compare/v4.3.0...4.3.1) (2025-09-03)

- Hot deployment supports files in the resource directory
- Hot deployment supports MyBatis XML files
- debug-tools-boot supports passing the process ID as the PID parameter
- Fixed a bug where EasyExcel export styles were lost during hot reload by [@wangqiqi95](https://github.com/wangqiqi95)
- Fixed a bug where hot deployment failed in Spring Boot 3.4.5

## [4.3.0](https://github.com/future0923/debug-tools/compare/v4.2.0...4.3.0) (2025-08-25)

- Added pre- and post-scripts for calling methods
- Added a double-click/right-click menu to zoom in on SQL statements in trace mode
- Internationalization (English/Chinese) by [@ayuayue](https://github.com/ayuayue)
- Printing SQL statements supports the DAMO database by [@wangqiqi95](https://github.com/wangqiqi95)
- Toggle on and off whether to display the call method button when hovering the mouse over the line by [@wangqiqi95](https://github.com/wangqiqi95)
- JDK 11 plugin now supports only JBR 11 and no longer supports TRAVA 11
- Spring Boot DevTools projects now use the RestartClassLoader class loader by default
- Fixed a bug where regex matching failed when passing escaped strings to the call method trace function
- Fixed a bug where dylib loading errors occurred on macOS on M chipsets by [@wangqiqi95](https://github.com/wangqiqi95) [@wangqiqi95](https://github.com/wangqiqi95)
- Fixed a bug causing MyBatis Plus 3.5.6 startup failure (by [@wangqiqi95](https://github.com/wangqiqi95))
- Fixed a bug causing hot reload failure in MyBatis Plus 3.5.11+
- Fixed a hot reload failure in mybatis-spring 3.0.4+
- Fixed a bug causing cglib bean startup failure in Spring Boot 3.4.5
- Fixed a bug causing debug-tools-boot to fail to attach due to an incorrect application name being retrieved during remote attachment.

## [4.2.0](https://github.com/future0923/debug-tools/compare/v4.1.2...v4.2.0) (2025-08-08)

- Added a trace function to display the link duration when calling methods.
- Added a function to display the method call button when hovering the mouse over the line header.
- Added the ability to copy objects to JSON in the right-click menu of breakpoints. By [@ayuayue](https://github.com/ayuayue)
- Added the ability to print SQL history and save it to a file. By [@ayuayue](https://github.com/ayuayue)
- Adapted hot reload startup to the IDEA run/debug configurations. By [@loong95](https://github.com/loong95)
- Optimized the MyBatis mapper XML file recognition method. By [@loong95](https://github.com/loong95)
- Optimized the agent startup loading speed.
- Removed the Groovy Console button from the right-click menu.
- Removed the hot deploy button from the launcher and placed it in the ToolWindow.
- Fixed the bug in SQL print time type display by [@ayuayue](https://github.com/ayuayue)
- Fixed the bug in WSL2 causing XML hot reload failure by [@seahoe](https://github.com/seahoe)
- Fixed the bug in mybatis-spring 1.3.2 startup failures.
- Fixed the bug in dynamic-datasource 3+ startup failures.
- Fixed the bug in inner class constructors where the parent class's IoC property was null.

## [4.1.2](https://github.com/future0923/debug-tools/compare/v4.1.1...v4.1.2) (2025-07-15)

- Fixed the bug of dynamic-datasource4.2+ startup failure
- Fixed the bug of mybatis-spring2.0.2 startup failure
- Fixed the bug of fastjson2 high version not getting getKotlinConstructor method
- Fixed the bug of unable to switch class loader
- Fixed the bug of startup java.lang.NullPointerException: Cannot read field "string" because "utf" is null

## [4.1.1](https://github.com/future0923/debug-tools/compare/v4.1.0...v4.1.1) (2025-07-09)

- Add ToolWindow quick jump settings and document buttons by [@ayuayue](https://github.com/ayuayue)
- Add support for hot reload of JDK8 under MacOS aarch64 (M chip) [@yaoxinghuo](https://github.com/yaoxinghuo)
- Fix the bug that the project cannot be used under MacOS aarch64 (M chip) by [@yaoxinghuo](https://github.com/yaoxinghuo)
- Fix the bug that hot reload [dynamic-datasource](https://github.com/baomidou/dynamic-datasource) is invalid under 4.3+ by [@anweicloud](https://github.com/anweicloud)
- Fix hot reload [MyBatisPlus](https://baomidou.com/) 3.5.6+ lambdaQuery() failed to obtain when inheriting ServiceImpl
- Fixed the bug that oracle and sqlserver failed to print sql
- Fixed the bug that Spring Class information could not be found in Groovy
- Fixed the bug that the UI was stuck when viewing large json in the return result json mode

## [4.1.0](https://github.com/future0923/debug-tools/compare/v4.0.1...v4.1.0) (2025-06-27)

- Hot deployment supports modifying MyBatis Mapper files
- Hot deployment supports modifying MyBatis Plus Entity/Mapper files
- Hot reload supports [Solon](https://solon.noear.org/) applications
- Calling Java methods supports [Solon](https://solon.noear.org/) Bean methods
- Add remote connection configuration function by [@anweicloud](https://github.com/anweicloud)
- Add printing compression SQL option configuration (Pretty, Compress, No)
- Optimize the logic of calling static methods.
- Optimize the logic of automatic attachment startup application
- Optimize command execution logic
- Fixed the bug that SQL statements cannot be printed under Jdk21
- Fixed the bug of StackOverflowError when Jackson deserializes nested classes
- Fixed the bug that the list of attached project class loaders does not refresh when closing ToolWindow
- Fixed the bug that application attachment fails when only automatic attachment is enabled
- Fixed the bug that the status cannot be updated when the remote connection is disconnected
- Fixed the bug that the application project cannot be packaged under jdk21

## [4.0.1](https://github.com/future0923/debug-tools/compare/v4.0.0...v4.0.1) (2025-06-04)

- Fixed the bug that Exception in thread java.lang.UnsatisfiedLinkError: io.github.future0923.debug.tools.vm.VmTool.getInstances0(Ljava/lang/Class;I)[Ljava/lang/0bject; 的bug([#63](https://github.com/future0923/debug-tools/issues/63))

## [4.0.0](https://github.com/future0923/debug-tools/compare/v3.4.4...v4.0.0)(2025-06-03)

- Added hot deployment function to achieve hot update of remote application code in seconds.
- Added remote dynamic compilation function. When hot deploying and hot reloading, you can choose to compile the code with local Idea or dynamically compile the code with remote application.
- Added default class loader selection function, which allows you to select class loader when performing hot deployment, hot reload, and Groovy scripts
- Added [dynamic-datasource](https://github.com/baomidou/dynamic-datasource) dynamic data source `@DS` annotation hot reload ([#8](https://github.com/future0923/debug-tools/issues/8))
- Added [hutool](https://hutool.cn) hot reload([#48](https://github.com/future0923/debug-tools/issues/48))
- Added [Gson](https://github.com/google/gson) hot reload([#49](https://github.com/future0923/debug-tools/issues/49))
- Added [EasyExcel](https://github.com/alibaba/easyexcel) hot reload([#46](https://github.com/future0923/debug-tools/issues/46))
- Added [FastJson](https://github.com/alibaba/fastjson)、[FastJson2](https://github.com/alibaba/fastjson2) hot reload([#56](https://github.com/future0923/debug-tools/issues/56))
- Added [Jackson](https://github.com/FasterXML/jackson-databind) hot reload([#50](https://github.com/future0923/debug-tools/issues/50))
- Added [hibernate-validator](https://github.com/hibernate/hibernate-validator) hot reload([#60](https://github.com/future0923/debug-tools/issues/60))
- Refactor the calling method function, remote calling supports hot deployment of classes
- Supports calling internal class methods at more than two levels([#43](https://github.com/future0923/debug-tools/issues/43))
- Automatically attach the application launched in the current project([#58](https://github.com/future0923/debug-tools/issues/58))
- Optimized heartbeat logic
- Optimize http timeout
- Fixed the bug that RuntimeExceptionWithAttachments：Read access is allowed from inside read-action only([#38](https://github.com/future0923/debug-tools/issues/38)).

## [3.4.4](https://github.com/future0923/debug-tools/compare/v3.4.3...v3.4.4) (2025-04-22)

- Support IntelliJ IDEA 2025.1 version ([#37](https://github.com/future0923/debug-tools/issues/37)).

## [3.4.3](https://github.com/future0923/debug-tools/compare/v3.4.2...v3.4.3) (2025-04-01)

- Fixed the problem that there is only one Controller under the folder File renaming hot reload failed BUG ([#31](https://github.com/future0923/debug-tools/issues/31)).
- Modify JDK21 hot reload startup failure BUG ([#30](https://github.com/future0923/debug-tools/issues/30)).
- Modify WebFlux can not call BUG ([#29](https://github.com/future0923/debug-tools/issues/29)).

## [3.4.2](https://github.com/future0923/debug-tools/compare/v3.4.1...v3.4.2) (2025-03-17)

- Add button to trigger compilation XML File to trigger ([#21](https://github.com/future0923/debug-tools/issues/21)).
- Fix the bug that hot reload cannot be triggered when the Controller file is renamed ([#23](https://github.com/future0923/debug-tools/issues/23)).
- Fix the bug that failed to connect to the remote application ([#27](https://github.com/future0923/debug-tools/issues/27)).

## [3.4.1](https://github.com/future0923/debug-tools/compare/v3.4.0...v3.4.1) (2025-02-27)

- Fix ConcurrentModificationException when multiple MyBatis Mappers are hot reloaded BUG ([#20](https://github.com/future0923/debug-tools/issues/20)).

## [3.4.0](https://github.com/future0923/debug-tools/compare/v3.3.0...v3.4.0) (2025-02-20)

- Hot reload supports static variables, static final variables, and static code blocks ([#10](https://github.com/future0923/debug-tools/issues/10)).
- Hot reload supports Enum ([#10](https://github.com/future0923/debug-tools/issues/10))
- Fixed the bug that non-Bean classes cannot be called in Spring environment ([#16](https://github.com/future0923/debug-tools/issues/16)).

## [3.3.0](https://github.com/future0923/debug-tools/compare/v3.2.0...v3.3.0) (2025-02-11)

- Hot reload supports MyBatis Plus to add Entity, modify Entity, add Mapper, modify Mapper, add xml, modify xml.
- Hot reload supports MyBatis to add Mapper, modify Mapper, add xml, modify xml.
- Add the function of executing the last time through the default class loader ([#12](https://github.com/future0923/debug-tools/issues/12)).
- Fixed the bug that Maven commands cannot be executed when SQL printing is turned on ([#7](https://github.com/future0923/debug-tools/issues/7)).

## [3.2.0](https://github.com/future0923/debug-tools/compare/v3.1.2...v3.2.0) (2025-01-09)

- Added hot reload function to make the written code effective without restarting the application.

## [3.1.2](https://github.com/future0923/debug-tools/compare/v3.1.1...v3.1.2) (2024-12-30)

- Fix the bug that failed to remove ContextPath ([#3](https://github.com/future0923/debug-tools/issues/3)).
- Fix the bug that multiple projects share an additional button ([#4](https://github.com/future0923/debug-tools/issues/4)).

## [3.1.1](https://github.com/future0923/debug-tools/compare/v3.1.0...v3.1.1) (2024-12-18)

- ContextPath information can be removed when searching for http urls
- Fix the bug that domain names cannot be matched when there is no http(s)

## [3.1.0](https://github.com/future0923/debug-tools/compare/v3.0.1...v3.1.0) (2024-12-17)

- Added the function of searching http url.
- Fixed the bug that the default class loader cannot be obtained when Groovy is executed in remote application.
- Fixed the bug that DebugToolsClassLoader repeatedly loaded the AppClassLoader base package, causing an exception to be thrown when using DefaultClassLoader.
- Optimize log printing ([#2](https://github.com/future0923/debug-tools/issues/2))

## [3.0.1](https://github.com/future0923/debug-tools/compare/v3.0.0...v3.0.1) (2024-12-12)

- Support IntelliJ IDEA 2024.3 version.
- Fix the bug that Groovy cannot get the default class loader when executing in remote application.

## 3.0.0 (2024-11-01)

- Add the function of calling remote application methods.
- Add the function of selecting class loader when calling methods.

## 2.3.0 (2024-09-19)

- Add groovy console, which can quickly execute code through the target application
- Add debug mode to quickly copy name and value
- Add attach The application can disconnect and stop the service

## 2.2.0 (2024-08-28)

- Support toString, json, debug to view the return result
- Support console, debug to view the exception information
- Support org.springframework.web.multipart.MultipartFile type parameter input
- Optimize the plugin style
- Fix the recursive stack overflow exception when the parameters are nested

## 2.1.0 (2024-08-19)

- Support 2024.2 version
- Support calls in non-Spring environments
- Support passing xxl-job parameters
- Support more parameter passing
  - request (MockHttpServletRequest)
  - response (MockHttpServletResponse)
  - file (absolute path to File object)
  - class (class full name to Class object)
- Optimize the window parameter logic

## 2.0.1 (2024-08-09)

- Fixed the bug that the heartbeat is too short and causes the business execution to be interrupted
- Fixed the bug that the exception information is not printed completely

## 2.0.0 (2024-08-06)

- Added interactive logic to support the caller to view the execution results and error information.
- Fixed the bug that the SQL print display error is NULL.

## 1.2.1 (2024-06-13)

- Added cache cleaning logic
- Added the exception return information of failed execution
- Optimized the request header parameter input logic
- Fixed the bug that the batch operation cannot print SQL

## 1.2.0 (2024-06-07)

- Optimized the core library loading logic
- Added the function of printing SQL statements and time consumption
- Fixed the bug that the library loading failed under window

## 1.1.1 (2024-06-04)

- Added a custom class loader to separate the target application
- Fixed the StackOverflowError when the collection type BUG

## 1.1.0 (2024-05-30)

- Add call configuration information
- Add request header parameter passing

## 1.0.0 (2024-05-29)

- Can call any Java method and support parameter passing

## First line of code submission (2024-05-08)