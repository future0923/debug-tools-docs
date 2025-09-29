---
layout: doc
aside: false
---
# 版本迭代记录

## [4.4.1](https://github.com/java-hot-deploy/debug-tools/compare/v4.4.0...v4.4.1) (2025-09-29)

- 修复切换项目时ToolWindow偶发返回null
- [#127](https://github.com/java-hot-deploy/debug-tools/issues/127) - 优化热部署扫描文件及本地编译性能
- [#131](https://github.com/java-hot-deploy/debug-tools/issues/131) - 优化 tomcat 类加载展示 contextName 信息 by [@iwillmissu](https://github.com/iwillmissu)
- [#129](https://github.com/java-hot-deploy/debug-tools/issues/129) - 修复调用历史列表操作阻塞 UI 进程的 bug
- [#35](https://github.com/java-hot-deploy/debug-tools/issues/35) - 修复spring返回数据jackson偶尔热重载失败
- [#130](https://github.com/java-hot-deploy/debug-tools/issues/130) - 修复 MyBatis xml 中的 resultType 的实体变化热重载未生效的 bug
- [#134](https://github.com/java-hot-deploy/debug-tools/issues/134) - 修复资源文件夹只有一个文件时与 class 文件同时热重载后资源文件监听失败的 bug
- [#135](https://github.com/java-hot-deploy/debug-tools/issues/135) - 修复 SpringBoot 2.0.x 、SpringMvc 5.0.x 下 Controller 重载失败的 bug

## [4.4.0](https://github.com/java-hot-deploy/debug-tools/compare/v4.3.1...main) (2025-09-18)

- 支持查看调用记录信息
- 调用参数窗口/响应信息窗口展示当前附着应用名称
- 支持 shorten command line 的 classpath file 模式
- 优化搜索 url 响应速度
- 修复Spring接口类型的listener收不到event事件的bug
- 修复HuTool低版本ReflectUtil找不到getMethodsDirectly方法的bug

## [4.3.1](https://github.com/java-hot-deploy/debug-tools/compare/v4.3.0...4.3.1) (2025-09-03)

- 热部署支持resource目录下的文件
- 热部署支持mybatis的xml文件
- debug-tools-boot支持pid参数传入进程号
- 修复EasyExcel在热重载启动下导出样式丢失的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- 修复SpringBoot3.4.5下热部署启动失败的bug

## [4.3.0](https://github.com/java-hot-deploy/debug-tools/compare/v4.2.0...4.3.0) (2025-08-25)

- 增加调用方法前后置脚本
- 增加trace方式sql语句双击/右键菜单放大查看
- 国际化(英文/中文) by [@ayuayue](https://github.com/ayuayue)
- 打印sql支持达梦数据库 by [@wangqiqi95](https://github.com/wangqiqi95)
- 鼠标放在行头是否展示调用方法按钮配置开关 by [@wangqiqi95](https://github.com/wangqiqi95)
- 插件jdk11改为只支持jbr11不再支持trava11
- SpringbootDevTools的项目默认选RestartClassLoader类加载器
- 修复调用方法trace功能传入转义字符串正则匹配失败的bug
- 修复macOS在M芯片下dylib加载错误的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- 修复MyBatis Plus3.5.6启动失败的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- 修复MyBatis Plus3.5.11+下热重载失败的bug
- 修复mybatis-spring3.0.4+下热重载失败
- 修复SpringBoot3.4.5下cglib的bean启动失败的bug
- 修复debug-tools-boot附着远程获取应用名错误导致附着失败的bug

## [4.2.0](https://github.com/java-hot-deploy/debug-tools/compare/v4.1.2...v4.2.0) (2025-08-08)

- 增加调用方法时trace功能展示链路耗时功能
- 增加鼠标放在行头展示调用方法按钮功能
- 增加断点右键菜单增加复制对象为json功能 by [@ayuayue](https://github.com/ayuayue)
- 增加sql打印历史并存储为文件功能 by [@ayuayue](https://github.com/ayuayue)
- 热重载启动适配idea run/debug configurations启动 by [@loong95](https://github.com/loong95)
- 优化mybatis mapper xml文件识别方式 by [@loong95](https://github.com/loong95)
- 优化agent启动加载速度
- 右键菜单移除Groovy控制台按钮
- 将热部署的按钮从启动栏移除放到ToolWindow中
- 修复sql打印时间类型显示bug by [@ayuayue](https://github.com/ayuayue)
- 修复wsl2导致xml热重载失败的bug by [@seahoe](https://github.com/seahoe)
- 修复mybatis-spring1.3.2启动失败的bug
- 修复dynamic-datasource3+启动失败的bug
- 修复内部类构造函数使用父类ioc属性时为null的bug

## [4.1.2](https://github.com/java-hot-deploy/debug-tools/compare/v4.1.1...v4.1.2) (2025-07-15)

- 修复dynamic-datasource4.2+启动失败的bug
- 修复mybatis-spring2.0.2启动失败的bug
- 修复fastjson2高版本获取不到getKotlinConstructor方法的bug
- 修复无法切换类加载器
- 修复启动java.lang.NullPointerException: Cannot read field "string" because "utf" is null的bug

## [4.1.1](https://github.com/java-hot-deploy/debug-tools/compare/v4.1.0...v4.1.1) (2025-07-09)

- 增加ToolWindow快捷跳转设置与文档按钮 by [@ayuayue](https://github.com/ayuayue)
- 新增对 MacOS aarch64（M 芯片）下 JDK8 热重载的支持 [@yaoxinghuo](https://github.com/yaoxinghuo)
- 修复项目在MacOS aarch64（M芯片）下无法使用的bug by [@yaoxinghuo](https://github.com/yaoxinghuo)
- 修复热重载 [dynamic-datasource](https://github.com/baomidou/dynamic-datasource) 4.3+下失效的bug by [@anweicloud](https://github.com/anweicloud)
- 修复热重载 [MyBatisPlus](https://baomidou.com/) 3.5.6+继承 ServiceImpl 时 lambdaQuery() 获取失败的bug
- 修复oracle、sqlserver打印sql失败的bug
- 修复Groovy中找不到Spring的Class信息的bug
- 修复返回结果json方式查看大json时UI卡顿的bug

## [4.1.0](https://github.com/java-hot-deploy/debug-tools/compare/v4.0.1...v4.1.0) (2025-06-27)

- 热部署支持修改 MyBatis Mapper文件
- 热部署支持修改 MyBatis Plus Entity/Mapper文件
- 热重载支持 [Solon](https://solon.noear.org/) 应用
- 调用Java方法支持 [Solon](https://solon.noear.org/) Bean 方法
- 增加远程连接配置功能 by [@anweicloud](https://github.com/anweicloud)
- 增加打印压缩SQL选项配置（Pretty、Compress、No）
- 优化调用静态方法执行逻辑
- 优化自动附着启动应用逻辑
- 优化命令执行逻辑
- 修复在Jdk21下无法打印SQL语句的bug
- 修复Jackson反序列化嵌套class时StackOverflowError的bug
- 修复关闭ToolWindow切换附着项目类加载器列表不刷新的bug
- 修复只开启自动附着时附着应用失败的bug
- 修复远程连接断开时状态无法更新的bug
- 修复应用项目在jdk21下无法打包的bug

## [4.0.1](https://github.com/java-hot-deploy/debug-tools/compare/v4.0.0...v4.0.1) (2025-06-04)

- 修复 Exception in thread java.lang.UnsatisfiedLinkError: io.github.future0923.debug.tools.vm.VmTool.getInstances0(Ljava/lang/Class;I)[Ljava/lang/0bject; 的bug

## [4.0.0](https://github.com/java-hot-deploy/debug-tools/compare/v3.4.4...v4.0.0) (2025-06-03)

- 增加热部署功能，实现秒级一键热更新远程应用代码。
- 增加远程动态编译功能，热部署、热重载时可以选择本地Idea编译还是远程应用动态编译代码
- 增加默认类加载器选择功能，执行热部署、热重载、Groovy脚本时可以选择类加载器
- 增加[dynamic-datasource](https://github.com/baomidou/dynamic-datasource)动态数据源 `@DS` 注解热重载
- 增加[hutool](https://hutool.cn)工具包热重载
- 增加[Gson](https://github.com/google/gson)工具包热重载
- 增加[EasyExcel](https://github.com/alibaba/easyexcel)工具包热重载
- 增加[FastJson](https://github.com/alibaba/fastjson)、[FastJson2](https://github.com/alibaba/fastjson2)工具包热重载
- 增加[Jackson](https://github.com/FasterXML/jackson-databind)工具包热重载
- 增加[hibernate-validator](https://github.com/hibernate/hibernate-validator)工具包热重载
- 重构调用方法功能，远程调用支持热部署后类
- 支持调用两级以上内部类方法
- 自动附着当前项目启动应用
- 优化心跳逻辑
- 优化 http 超时时间
- 修复RuntimeExceptionWithAttachments：Read access is allowed from inside read-action only的BUG by [@Aa580](https://github.com/Aa580)

## [3.4.4](https://github.com/java-hot-deploy/debug-tools/compare/v3.4.3...v3.4.4) (2025-04-22)

- 支持 intellij idea 2025.1 版本

## [3.4.3](https://github.com/java-hot-deploy/debug-tools/compare/v3.4.2...v3.4.3) (2025-04-01)

- 修复文件夹下只有一个 Controller 文件时改名热重载失败的BUG
- 修改 JDK21 热重载启动失败的BUG
- 修改 WebFlux 无法调用的BUB

## [3.4.2](https://github.com/java-hot-deploy/debug-tools/compare/v3.4.1...v3.4.2) (2025-03-17)

- 增加按钮触发编译 XML 文件以触发
- 修复 Controller 文件重命名时无法触发热重载的BUG
- 修复连接远程应用失败的BUG

## [3.4.1](https://github.com/java-hot-deploy/debug-tools/compare/v3.4.0...v3.4.1) (2025-02-27)

- 修复多个 MyBatis Mapper 热重载时 ConcurrentModificationException 的BUG

## [3.4.0](https://github.com/java-hot-deploy/debug-tools/compare/v3.3.0...v3.4.0) (2025-02-20)

- 热重载支持支持 static 变量、static final 变量、static 代码块
- 热重载支持支持 Enum
- 修复在Spring环境中无法调用非Bean类的BUG by [@yutimothy666](https://github.com/yutimothy666)

## [3.3.0](https://github.com/java-hot-deploy/debug-tools/compare/v3.2.0...v3.3.0) (2025-02-11)

- 热重载支持 MyBatis Plus 增加Entity、修改Entity、增加Mapper、修改Mapper、增加xml、修改xml.
- 热重载支持 MyBatis 增加Mapper、修改Mapper、增加xml、修改xml.
- 增加通过默认类加载器执行上一次功能
- 修复开启SQL打印时无法执行Maven命令的BUG

## [3.2.0](https://github.com/java-hot-deploy/debug-tools/compare/v3.1.2...v3.2.0) (2025-01-09)

- 增加热重载功能，无需重启应用即可使编写的代码生效。

## [3.1.2](https://github.com/java-hot-deploy/debug-tools/compare/v3.1.1...v3.1.2) (2024-12-30)

- 修复移除 ContextPath 失败的BUG
- 修复多个项目共享一个附加按钮的 bug

## [3.1.1](https://github.com/java-hot-deploy/debug-tools/compare/v3.1.0...v3.1.1) (2024-12-18)

- 搜索 http url时可以移除 ContextPath 信息
- 修复没有 http(s) 时无法匹配域名的BUG

## [3.1.0](https://github.com/java-hot-deploy/debug-tools/compare/v3.0.1...v3.1.0) (2024-12-17)

- 增加搜索 http url功能.
- 修复远程应用时 Groovy 执行时无法获取默认类加载器的BUG.
- 修复 DebugToolsClassLoader 重复加载 AppClassLoader 基础包导致使用 DefaultClassLoader 抛出异常的BUG。
- 优化日志打印

## [3.0.1](https://github.com/java-hot-deploy/debug-tools/compare/v3.0.0...v3.0.1) (2024-12-12)

- 支持 intellij idea 2024.3 版本.
- 修复远程应用时 Groovy 执行时无法获取默认类加载器的BUG.

## 3.0.0 (2024-11-01)

- 增加可以调用远程应用方法的功能.
- 增加方法调用时选择类加载器的功能.

## 2.3.0 (2024-09-19)

- 增加groovy控制台，可以通过目标应用快捷执行代码
- 增加 debug 方式可以快捷复制name和value
- 增加 attach 应用可以断开链接和停止服务

## 2.2.0 (2024-08-28)

- 支持 toString、json、debug 的方式查看返回结果
- 支持 console、debug 的方式查看异常信息
- 支持 org.springframework.web.multipart.MultipartFile 类型参数传入
- 优化插件样式
- 修复参数嵌套时的递归堆栈溢出异常

## 2.1.0 (2024-08-19)

- 支持 2024.2 版本
- 支持非Spring环境的调用
- 支持传递 xxl-job 参数
- 支持更多的参数传递
  - request (MockHttpServletRequest)
  - response (MockHttpServletResponse)
  - file (absolute path to File object)
  - class (class full name to Class object)
- 优化窗口参数逻辑

## 2.0.1 (2024-08-09)

- 修复心跳太短导致业务执行中断的BUG
- 修复异常信息打印不完整的BUG

## 2.0.0 (2024-08-06)

- 增加交互逻辑，支持调用方查看执行结果和错误信息.
- 修复NULL时SQL打印显示错误的BUG.

## 1.2.1 (2024-06-13)

- 增加缓存清理逻辑
- 增加执行失败的异常返回信息
- 优化请求头参数传入逻辑
- 修复批量操作无法打印SQL的BUG

## 1.2.0 (2024-06-07)

- 优化核心类库加载逻辑
- 增加打印SQL语句与耗时功能
- 修复window下类库加载失败的BUG

## 1.1.1 (2024-06-04)

- 增加自定义类加载器隔目标应用
- 修复集合类型时 StackOverflowError 的BUG

## 1.1.0 (2024-05-30)

- 增加调用配置信息
- 增加请求头参数传递

## 1.0.0 (2024-05-29)

- 可以调用任意Java方法并支持参数传递

## 第一行代码提交 (2024-05-08)