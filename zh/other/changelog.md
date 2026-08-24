---
layout: doc
aside: false
---
# 版本迭代记录

## [5.2.0](https://github.com/future0923/debug-tools/compare/v5.1.0...v5.2.0) (2026-08-24)

- 支持 forest 热重载 by [@wangqiqi95](https://github.com/wangqiqi95)
- 巨幅提升搜索 http url 响应速率
- 优化多项目同时启动自动附着就绪标记
- [#299](https://github.com/future0923/debug-tools/issues/299) 支持方法调用页面支持放大缩小双向停靠
- [#300](https://github.com/future0923/debug-tools/issues/300) 调用方法和http请求增加一键复制cURL的功能
- 适配2026.2+ MCP 工具描述符
- [#265](https://github.com/future0923/debug-tools/issues/265) 支持搜索 JAX-RS 的 url
- [#298](https://github.com/future0923/debug-tools/issues/298) 打印 sql 支持 GBase 数据库 by [@ayuayue](https://github.com/ayuayue)
- 扫描 url 支持 FeignClient 注解配置 by [@javalover123](https://github.com/javalover123)
- [#302](https://github.com/future0923/debug-tools/issues/302) 打印 sql 支持存储过程 by [@javalover123](https://github.com/javalover123)
- [#304](https://github.com/future0923/debug-tools/issues/304) 打印 sql 格式选择为 Compress，保留 `/* 块注释 */` 注释 by [@javalover123](https://github.com/javalover123)
- [#297](https://github.com/future0923/debug-tools/issues/297) 修复调用记录页面 | http调试 | 实际请求：请求 URL没有完整显示 鼠标滚轮无效的 bug by [@wangqiqi95](https://github.com/wangqiqi95)

## [5.1.0](https://github.com/future0923/debug-tools/compare/v5.0.1...v5.1.0) (2026-07-13)

- 调用方法如果是 controller 方法支持转为 http 调用
- 适配 idea 的 mcp 模块，提供调用 java 方法和热重载的 mcp 工具
- 修改方法 header 样式样式及体验
- [#265](https://github.com/future0923/debug-tools/issues/265) - 搜索url支持JAX-RS规范注解
- 修复主类模块索引未就绪时查找异常的bug
- 修复调用历史页面 tree 模式搜索没效果的bug
- [#281](https://github.com/future0923/debug-tools/issues/281) - 修复多环境下找不到配置信息的bug
- [#292](https://github.com/future0923/debug-tools/issues/292) - 修复sa-token高版本无法调用方法的bug
- [#293](https://github.com/future0923/debug-tools/issues/293) - 修复附着之后如果请求 spring 信息过早导致无法使用的bug
- [#294](https://github.com/future0923/debug-tools/issues/294) - 修复开启打印 sql 偶发导致 Spring Boot 启动死锁的bug by [@C.](https://github.com/suntaoSCB)

## [5.0.1](https://github.com/future0923/debug-tools/compare/v5.0.0...v5.0.1) (2026-06-21)

- 调用方法输入 class 类型时增加提示功能
- 调用方法历史支持 json 方式查看执行结果
- 鼠标悬停应用信息展示增加模块和项目信息
- 优化热部署、设置首页样式
- [#285](https://github.com/future0923/debug-tools/issues/285) - 搜索 http 方法支持请求方法前缀过滤
- [#280](https://github.com/future0923/debug-tools/issues/280) - 修复多应用名称相同sql历史共用的 bug
- [#282](https://github.com/future0923/debug-tools/issues/282) - 修复开启自动附着重启应用会导致填写的应用附加信息为空的 bug
- [#283](https://github.com/future0923/debug-tools/issues/283) - 修复没有 RequestContextHolder 类时无法调用方法的 bug
- [#284](https://github.com/future0923/debug-tools/issues/284) - 修复调用历史找不到的方法会一直卡在加载中的 bug
- [#287](https://github.com/future0923/debug-tools/issues/287) - 修复调用记录重启项目时重新执行方法失败的bug

## [5.0.0](https://github.com/future0923/debug-tools/compare/v4.6.1...v5.0.0) (2026-06-09)

- 插件整体重构，UI 全新升级，交互体验大幅优化
- 支持多应用附着，所有功能都支持多应用同时操作
- 扫描应用列表增加模块、项目信息，优化 jps 命令扫不到 java 应用的问题
- [#269](https://github.com/future0923/debug-tools/issues/269) - 增加 json 编辑器、header 输入等各种提示功能
- [#279](https://github.com/future0923/debug-tools/issues/279) - 支持 publisher、Mono、Flux、SSE 展示，调试 ai 方法响应更丝滑
- [#273](https://github.com/future0923/debug-tools/issues/273) - 全面支持 record 类
  - 热重载支持 record 类型
  - 调用方法支持 record 类型入参
  - 调用方法支持查看 record 类型返回值（json、debug）
- 全面适配 idea 中 shorten command line 的 classpath file 模式启动应用
  - [#267](https://github.com/future0923/debug-tools/issues/267) - 附着列表可以识别应用
  - [#277](https://github.com/future0923/debug-tools/issues/277) - 不用热重载方式启动也可以开启打印 sql
  - [#278](https://github.com/future0923/debug-tools/issues/278) - 不用热重载方式启动也可以调用方法
  - 默认类加载器自动选择
  - 用 `ClassLoader.getSystemResourceAsStream("")` 也可以找到资源文件
- [#260](https://github.com/future0923/debug-tools/issues/260) - 调用历史支持查看方法返回值
- [#264](https://github.com/future0923/debug-tools/issues/264) - 设置改为全局存储
- [#271](https://github.com/future0923/debug-tools/issues/271) - 支持 xxl-job 的3+版本
- [#268](https://github.com/future0923/debug-tools/issues/268) - 调用方法支持反序列化 hutool 的JSONObject类型
- [#253](https://github.com/future0923/debug-tools/issues/253) - 调用方法支持嵌套类型的 file、MultipartFile 类型
- [#266](https://github.com/future0923/debug-tools/issues/266) - 修复内存泄露
- 修复2026.1+的各种 edt 线程错误

## [4.6.1](https://github.com/future0923/debug-tools/compare/v4.6.0...v4.6.1) (2026-04-07)

- 改为异步获取类加载器避免应用假死时获取延迟阻塞idea主UI进程
- 支持SpringBoot2的WebFlux请求头信息
- [#254](https://github.com/future0923/debug-tools/issues/254) - 支持SpringBoot3请求上下文及添加头信息
- [#231](https://github.com/future0923/debug-tools/issues/231) - 支持将url中数字类型PathVariable信息替换为{}进行搜索匹配
- [#255](https://github.com/future0923/debug-tools/issues/255) - 修复设置无法修改sql打印配置的bug
- [#258](https://github.com/future0923/debug-tools/issues/258) - 获取jvm列表时忽略Gradle守护进程
- [#256](https://github.com/future0923/debug-tools/issues/256) [#259](https://github.com/future0923/debug-tools/issues/259) - idea2026.1方法调用图标从鼠标移动改为常驻行头
- [#257](https://github.com/future0923/debug-tools/issues/257) - 修复idea2026.1调用窗口获取类信息报错的bug
- [#261](https://github.com/future0923/debug-tools/issues/261) - 修复idea2026.1调用窗口获取方法信息报错的bug
- 修复idea2026.1搜索url报错的bug
- [#262](https://github.com/future0923/debug-tools/issues/262) - 修复切换项目时偶尔附着失败的bug

## [4.6.0](https://github.com/future0923/debug-tools/compare/v4.5.3...v4.6.0) (2026-03-25)

- 重构通讯模块，同时调用多个方法、热部署、groovy等互不影响
- 重构设置页面ui
- [#197](https://github.com/future0923/debug-tools/issues/197) - 增加热重载启动禁用指定插件功能 by [@fat-huhu](https://github.com/fat-huhu)
- [#236](https://github.com/future0923/debug-tools/issues/236) - 修复低版本springboot无法热重载单个@RequestParam注解的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#240](https://github.com/future0923/debug-tools/issues/240) - 修复热重载启动时EasyExcel设置setHeadRowNumber(0)时空指针的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#249](https://github.com/future0923/debug-tools/issues/249) - 修复MacOS系统M芯片切换jdk偶尔失败的bug
- [#249](https://github.com/future0923/debug-tools/issues/249) - 修复idea2025.3.3+下'attach失败:Failed to load agent library: 0'的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#238](https://github.com/future0923/debug-tools/issues/238) - 修复命令风格转换选中一个字母报错的bug by [@ayuayue](https://github.com/ayuayue)

## [4.5.3](https://github.com/future0923/debug-tools/compare/v4.5.2...v4.5.3) (2026-02-03)

- [#200](https://github.com/future0923/debug-tools/issues/200) - 修复PostgreSQL占位符变量未替换的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#205](https://github.com/future0923/debug-tools/issues/205) - 支持数组和泛型集合类型的枚举参数转换 by [@ayuayue](https://github.com/ayuayue)
- [#210](https://github.com/future0923/debug-tools/issues/210) - 支持修改@RequestParam注解热重载
- [#212](https://github.com/future0923/debug-tools/issues/212) - 打印sql支持正则过滤包和语句 by [@wangqiqi95](https://github.com/wangqiqi95)
- [#214](https://github.com/future0923/debug-tools/issues/214) - 优化搜索url搜索速度和double shift卡死的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#218](https://github.com/future0923/debug-tools/issues/218) - 优化发送消息避免阻塞idea的ui进程
- [#219](https://github.com/future0923/debug-tools/issues/219) - 修复切换新项目时偶尔NPE的bug
- [#226](https://github.com/future0923/debug-tools/issues/226) - 优化获取JVM列表和Attach功能避免阻塞UI线程
- [#230](https://github.com/future0923/debug-tools/issues/230) - 优化quick debug时间类型支持更多格式自动转化 by [@ayuayue](https://github.com/ayuayue)

## [4.5.2](https://github.com/future0923/debug-tools/compare/v4.5.1...v4.5.2) (2026-01-15)

- [#185](https://github.com/future0923/debug-tools/issues/185) - 增加热重载保留类静态变量用运行时数据的配置
- [#186](https://github.com/future0923/debug-tools/issues/186) - 修复JdbcTemplate无法打印sql的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#187](https://github.com/future0923/debug-tools/issues/187) - 修复修复热部署本地编译VFS同步刷新死锁的bug
- [#190](https://github.com/future0923/debug-tools/issues/190) - 修复OpenFeign的项目如果没有Mybatis无法启动的bug
- [#191](https://github.com/future0923/debug-tools/issues/191) - 修复MacOS切换jdk8与jdk17时dylib无法重新加载的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#196](https://github.com/future0923/debug-tools/issues/196) - 修复使用ServerPreparedStatement的无法格式化打印sql的bug
- [#198](https://github.com/future0923/debug-tools/issues/198) - 修复搜索url无法识别controller注解放入自定注解中的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#202](https://github.com/future0923/debug-tools/issues/202) - 优化搜索 url 返回样式，搜索注释及中文首字母，增加double shift展示搜索url选项 by [@wangqiqi95](https://github.com/wangqiqi95)

## [4.5.1](https://github.com/future0923/debug-tools/compare/v4.5.0...v4.5.1) (2026-01-06)

- [#180](https://github.com/future0923/debug-tools/issues/180) - 调用java方法支持file数组类型参数 by [@ayuayue](https://github.com/ayuayue)
- 修复openfeign与spring的class冲突导致spring项目热重载识别失败的bug

## [4.5.0](https://github.com/future0923/debug-tools/compare/v4.4.4...v4.5.0) (2025-12-22)

- [#166](https://github.com/future0923/debug-tools/issues/166) - 热重载/热部署支持openfeign
- [#164](https://github.com/future0923/debug-tools/issues/164) - 增加日志级别控制 by [@wangqiqi95](https://github.com/wangqiqi95)
- [#167](https://github.com/future0923/debug-tools/issues/167) - 修复达梦8打印sql时空指针的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- [#170](https://github.com/future0923/debug-tools/issues/170) - 修复用DebugTools的执行器启动时断点的标识未及时变化的bug
- [#172](https://github.com/future0923/debug-tools/issues/172) - 修复windows系统同时启动2个应用会显示dll文件占用的bug by [@ayuayue](https://github.com/ayuayue)
- 优化MyBatis、MyBatisPlus热重载锁机制
- 修复热重载修改匿名内部类偶尔导致jvm崩溃的bug

## [4.4.4](https://github.com/future0923/debug-tools/compare/v4.4.3...v4.4.4) (2025-11-24)

- [#71](https://github.com/future0923/debug-tools/issues/71) - 增加动态控制打印SQL配置
- [#154](https://github.com/future0923/debug-tools/pull/154) - 打印sql结尾增加分号 by [@javalover123](https://github.com/javalover123)
- [#158](https://github.com/future0923/debug-tools/issues/158) - 优化MethodAround执行性能
- [#155](https://github.com/future0923/debug-tools/issues/155) - 修复MyBatis和MyBatisPlus混用时MyBatis热重载失效的bug by [@ruhengChen](https://github.com/ruhengChen)
- [#160](https://github.com/future0923/debug-tools/issues/160) - 修复扫描url时spring注解value为null的bug
- [#161](https://github.com/future0923/debug-tools/issues/161) - 修复继承GenericFilterBean类后热重载无法启动的bug

## [4.4.3](https://github.com/future0923/debug-tools/compare/v4.4.2...v4.4.3) (2025-11-03)

- [#150](https://github.com/future0923/debug-tools/issues/150) - 支持jdk25热重载
- [#151](https://github.com/future0923/debug-tools/issues/151) - json方式查看调用结果配置变更
- [#149](https://github.com/future0923/debug-tools/issues/149) - 优化调试窗口
- [#153](https://github.com/future0923/debug-tools/issues/153) - 修复不同模块url相同时只能一个的bug
- [#152](https://github.com/future0923/debug-tools/issues/152) - 修复热部署相同的类第二次远程编译时找不到类的bug

## [4.4.2](https://github.com/future0923/debug-tools/compare/v4.4.1...v4.4.2) (2025-10-15)

- [#142](https://github.com/future0923/debug-tools/issues/142) - 支持命名格式切换
- [#139](https://github.com/future0923/debug-tools/issues/139) - 支持配置是否搜索依赖jar中的url
- [#148](https://github.com/future0923/debug-tools/issues/148) - 支持配置是否启用调用方法记录
- [#144](https://github.com/future0923/debug-tools/issues/144) - 修复Spring的BeanCopier热重载失败的bug
- [#136](https://github.com/future0923/debug-tools/issues/136) - 修复SQL打印时单引号没有转义导致打印sql失败的bug by [@fat-huhu](https://github.com/fat-huhu)
- [#137](https://github.com/future0923/debug-tools/issues/137) - 修复easyexcel读取时不加@ExcelIgnore顺序错乱的bug by [@wangqiqi95](https://github.com/wangqiqi95)

## [4.4.1](https://github.com/future0923/debug-tools/compare/v4.4.0...v4.4.1) (2025-09-29)

- 修复切换项目时ToolWindow偶发返回null
- [#127](https://github.com/future0923/debug-tools/issues/127) - 优化热部署扫描文件及本地编译性能
- [#131](https://github.com/future0923/debug-tools/issues/131) - 优化 tomcat 类加载展示 contextName 信息 by [@iwillmissu](https://github.com/iwillmissu)
- [#129](https://github.com/future0923/debug-tools/issues/129) - 修复调用历史列表操作阻塞 UI 进程的 bug
- [#35](https://github.com/future0923/debug-tools/issues/35) - 修复spring返回数据jackson偶尔热重载失败
- [#130](https://github.com/future0923/debug-tools/issues/130) - 修复 MyBatis xml 中的 resultType 的实体变化热重载未生效的 bug
- [#134](https://github.com/future0923/debug-tools/issues/134) - 修复资源文件夹只有一个文件时与 class 文件同时热重载后资源文件监听失败的 bug
- [#135](https://github.com/future0923/debug-tools/issues/135) - 修复 SpringBoot 2.0.x 、SpringMvc 5.0.x 下 Controller 重载失败的 bug

## [4.4.0](https://github.com/future0923/debug-tools/compare/v4.3.1...main) (2025-09-18)

- 支持查看调用记录信息
- 调用参数窗口/响应信息窗口展示当前附着应用名称
- 支持 shorten command line 的 classpath file 模式
- 优化搜索 url 响应速度
- 修复Spring接口类型的listener收不到event事件的bug
- 修复HuTool低版本ReflectUtil找不到getMethodsDirectly方法的bug

## [4.3.1](https://github.com/future0923/debug-tools/compare/v4.3.0...4.3.1) (2025-09-03)

- 热部署支持resource目录下的文件
- 热部署支持mybatis的xml文件
- debug-tools-boot支持pid参数传入进程号
- 修复EasyExcel在热重载启动下导出样式丢失的bug by [@wangqiqi95](https://github.com/wangqiqi95)
- 修复SpringBoot3.4.5下热部署启动失败的bug

## [4.3.0](https://github.com/future0923/debug-tools/compare/v4.2.0...4.3.0) (2025-08-25)

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

## [4.2.0](https://github.com/future0923/debug-tools/compare/v4.1.2...v4.2.0) (2025-08-08)

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

## [4.1.2](https://github.com/future0923/debug-tools/compare/v4.1.1...v4.1.2) (2025-07-15)

- 修复dynamic-datasource4.2+启动失败的bug
- 修复mybatis-spring2.0.2启动失败的bug
- 修复fastjson2高版本获取不到getKotlinConstructor方法的bug
- 修复无法切换类加载器
- 修复启动java.lang.NullPointerException: Cannot read field "string" because "utf" is null的bug

## [4.1.1](https://github.com/future0923/debug-tools/compare/v4.1.0...v4.1.1) (2025-07-09)

- 增加ToolWindow快捷跳转设置与文档按钮 by [@ayuayue](https://github.com/ayuayue)
- 新增对 MacOS aarch64（M 芯片）下 JDK8 热重载的支持 [@yaoxinghuo](https://github.com/yaoxinghuo)
- 修复项目在MacOS aarch64（M芯片）下无法使用的bug by [@yaoxinghuo](https://github.com/yaoxinghuo)
- 修复热重载 [dynamic-datasource](https://github.com/baomidou/dynamic-datasource) 4.3+下失效的bug by [@anweicloud](https://github.com/anweicloud)
- 修复热重载 [MyBatisPlus](https://baomidou.com/) 3.5.6+继承 ServiceImpl 时 lambdaQuery() 获取失败的bug
- 修复oracle、sqlserver打印sql失败的bug
- 修复Groovy中找不到Spring的Class信息的bug
- 修复返回结果json方式查看大json时UI卡顿的bug

## [4.1.0](https://github.com/future0923/debug-tools/compare/v4.0.1...v4.1.0) (2025-06-27)

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

## [4.0.1](https://github.com/future0923/debug-tools/compare/v4.0.0...v4.0.1) (2025-06-04)

- 修复 Exception in thread java.lang.UnsatisfiedLinkError: io.github.future0923.debug.tools.vm.VmTool.getInstances0(Ljava/lang/Class;I)[Ljava/lang/0bject; 的bug

## [4.0.0](https://github.com/future0923/debug-tools/compare/v3.4.4...v4.0.0) (2025-06-03)

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

## [3.4.4](https://github.com/future0923/debug-tools/compare/v3.4.3...v3.4.4) (2025-04-22)

- 支持 intellij idea 2025.1 版本

## [3.4.3](https://github.com/future0923/debug-tools/compare/v3.4.2...v3.4.3) (2025-04-01)

- 修复文件夹下只有一个 Controller 文件时改名热重载失败的BUG
- 修改 JDK21 热重载启动失败的BUG
- 修改 WebFlux 无法调用的BUB

## [3.4.2](https://github.com/future0923/debug-tools/compare/v3.4.1...v3.4.2) (2025-03-17)

- 增加按钮触发编译 XML 文件以触发
- 修复 Controller 文件重命名时无法触发热重载的BUG
- 修复连接远程应用失败的BUG

## [3.4.1](https://github.com/future0923/debug-tools/compare/v3.4.0...v3.4.1) (2025-02-27)

- 修复多个 MyBatis Mapper 热重载时 ConcurrentModificationException 的BUG

## [3.4.0](https://github.com/future0923/debug-tools/compare/v3.3.0...v3.4.0) (2025-02-20)

- 热重载支持支持 static 变量、static final 变量、static 代码块
- 热重载支持支持 Enum
- 修复在Spring环境中无法调用非Bean类的BUG by [@yutimothy666](https://github.com/yutimothy666)

## [3.3.0](https://github.com/future0923/debug-tools/compare/v3.2.0...v3.3.0) (2025-02-11)

- 热重载支持 MyBatis Plus 增加Entity、修改Entity、增加Mapper、修改Mapper、增加xml、修改xml.
- 热重载支持 MyBatis 增加Mapper、修改Mapper、增加xml、修改xml.
- 增加通过默认类加载器执行上一次功能
- 修复开启SQL打印时无法执行Maven命令的BUG

## [3.2.0](https://github.com/future0923/debug-tools/compare/v3.1.2...v3.2.0) (2025-01-09)

- 增加热重载功能，无需重启应用即可使编写的代码生效。

## [3.1.2](https://github.com/future0923/debug-tools/compare/v3.1.1...v3.1.2) (2024-12-30)

- 修复移除 ContextPath 失败的BUG
- 修复多个项目共享一个附加按钮的 bug

## [3.1.1](https://github.com/future0923/debug-tools/compare/v3.1.0...v3.1.1) (2024-12-18)

- 搜索 http url时可以移除 ContextPath 信息
- 修复没有 http(s) 时无法匹配域名的BUG

## [3.1.0](https://github.com/future0923/debug-tools/compare/v3.0.1...v3.1.0) (2024-12-17)

- 增加搜索 http url功能.
- 修复远程应用时 Groovy 执行时无法获取默认类加载器的BUG.
- 修复 DebugToolsClassLoader 重复加载 AppClassLoader 基础包导致使用 DefaultClassLoader 抛出异常的BUG。
- 优化日志打印

## [3.0.1](https://github.com/future0923/debug-tools/compare/v3.0.0...v3.0.1) (2024-12-12)

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