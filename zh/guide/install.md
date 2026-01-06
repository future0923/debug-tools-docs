# 安装说明 {#install}

## 1. 安装插件 {#install-plugin}

### 1.1 Marketplace 商店（推荐） {#marketplace}

1. 打开 `IDE Settings` 并选择 `Plugins`
2. 在 `Marketplace` 搜索 `DebugTools` 并点击 `install`
3. 重启应用

![marketplace](/images/marketplace.png){v-zoom}

### 1.2 自行安装 {#manual-installation}

::: code-group

```text [商店网址]
https://plugins.jetbrains.com/plugin/24463-debugtools
```

```text [离线安装]
https://download.debug-tools.cc/DebugToolsIdeaPlugin.zip
```

```sh [手动构建]
git clone https://github.com/future0923/debug-tools.git
cd debug-tools
# maven打包需要使用 `java17+` 版本构建
mvn clean install -T 2C -Dmaven.test.skip=true
# dist目录下
# debug-tools-boot.jar 远程agent包
cd debug-tools-idea
# grade打包Idea插件时需要使用`java17+`版本构建
./gradlew clean buildPlugin
# dist目录下
# DebugTools-{version}.zip IDEA插件包
```

```text [github]
https://github.com/future0923/debug-tools/releases
```

```text [gitee]
https://gitee.com/future94/debug-tools/releases
```

:::

## 2. 安装JDK {#jdk}

只有使用[热部署](hot-deploy)、[热重载](hot-reload)功能时才需要特定的JDK支持。

为了简化热部署安装步骤，linux支持一键安装，使用如下命令

```shell
wget https://download.debug-tools.cc/install/linux-install.tar.gz -O linux-install.tar.gz && tar zxf linux-install.tar.gz && cd linux-install && ./install.sh
```

安装位置

- jdk: `/usr/local/java`
- debug-tools: `/usr/local/debug-tools`

### 2.1 JDK 8 {#jdk8}

#### 2.1.1 直接使用打包好的JDK包 （推荐）

::: details 通过github下载

[https://github.com/future0923/debug-tools/releases/tag/dcevm-jdk-1.8.0_181](https://github.com/future0923/debug-tools/releases/tag/dcevm-jdk-1.8.0_181)

- [windows-jdk-8u181.zip](https://github.com/future0923/debug-tools/releases/download/dcevm-jdk-1.8.0_181/windows-jdk-8u181.zip)
- [mac-x64-jdk-8u181.zip](https://github.com/future0923/debug-tools/releases/download/dcevm-jdk-1.8.0_181/mac-x64-jdk-8u181.zip)
- [mac-aarch64-jdk-8u282.zip](https://github.com/future0923/debug-tools/releases/download/dcevm-jdk-1.8.0_181/mac-aarch64-jdk-8u282.zip)
- [linux-x64-jdk-8u181.tar.gz](https://github.com/future0923/debug-tools/releases/download/dcevm-jdk-1.8.0_181/linux-x64-jdk-8u181.tar.gz)

:::

::: details DebugTools官网下载

- [windows-jdk-8u181.zip](https://download.debug-tools.cc/dcevm-jdk-1.8.0_181/windows-jdk-8u181.zip)
- [mac-x64-jdk-8u181.zip](https://download.debug-tools.cc/dcevm-jdk-1.8.0_181/mac-x64-jdk-8u181.zip)
- [mac-aarch64-jdk-8u282.zip](https://download.debug-tools.cc/dcevm-jdk-1.8.0_181/mac-aarch64-jdk-8u282.zip)
- [linux-x64-jdk-8u181.tar.gz](https://download.debug-tools.cc/dcevm-jdk-1.8.0_181/linux-x64-jdk-8u181.tar.gz)

:::

::: tip 注意
- 目前Mac OS并没有纯正的M芯片的DCEVM的jdk，上面提供的jdk是通过`adopt jdk`改造而来，本质还是x86架构的jdk。
- 如果项目允许，非常推荐使用 JetBrainsRuntime 11+
:::

#### 2.1.2 自行安装

::: details Windows/Mac OS (intel)

下载对应版本的 .jar 文件。<span style="color: red;">目前只支持下面版本的JDK，请选择对应版本的。</span>

| java version | download by debug tools                                                                                | [download by github](https://github.com/future0923/debug-tools/releases/tag/dcevm-installer)                                       |
|--------------|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 1.8.0_181    | [DCEVM-8u181-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u181-installer.jar) | [DCEVM-8u181-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u181-installer.jar) |
| 1.8.0_172    | [DCEVM-8u172-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u172-installer.jar) | [DCEVM-8u172-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u172-installer.jar) |
| 1.8.0_152    | [DCEVM-8u152-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u152-installer.jar) | [DCEVM-8u152-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u152-installer.jar) |
| 1.8.0_144    | [DCEVM-8u144-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u144-installer.jar) | [DCEVM-8u144-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u144-installer.jar) |
| 1.8.0_112    | [DCEVM-8u112-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u112-installer.jar) | [DCEVM-8u112-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u112-installer.jar) |
| 1.8.0_92     | [DCEVM-8u92-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u92-installer.jar)   | [DCEVM-8u92-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u92-installer.jar)   |
| 1.8.0_74     | [DCEVM-8u74-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u74-installer.jar)   | [DCEVM-8u74-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u74-installer.jar)   |
| 1.8.0_66     | [DCEVM-8u66-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u66-installer.jar)   | [DCEVM-8u66-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u66-installer.jar)   |
| 1.8.0_51     | [DCEVM-8u51-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u51-installer.jar)   | [DCEVM-8u51-installer.jar](https://github.com/future0923/debug-tools/releases/download/dcevm-installer/DCEVM-8u51-installer.jar)   |
| 1.8.0_45     | [DCEVM-8u45-installer.jar](https://download.debug-tools.cc/dcevm-installer/DCEVM-8u45-installer.jar)   | [DCEVM-8u45-installer.jar](https://github.com/java-hot-deploy/debug-tools/releases/download/dcevm-installer/DCEVM-8u45-installer.jar)   |

运行对应的 `java -jar DCEVM-8uXX-installer.jar` 文件，找到对应的版本，点击 `Install DCEVM as altjvm` 按钮即可。

![dcevm-installer.png](/images/dcevm-installer.png){v-zoom}

:::

::: details Linux

如输入 `java -XXaltjvm=dcevm -version` 输入如下提示

```text
Error: missing `dcevm' JVM at `/home/java/jdk1.8.0_291/jre/lib/amd64/dcevm/libjvm.so'.
Please install or use the JRE or JDK that contains these missing components.
```

下载对应版本的文件并改名为 `libjvm.so` 到上面提取的目录下即可。

| java version | download by debug tools                                             | [download by github](https://github.com/java-hot-deploy/debug-tools/releases/tag/libjvm.so)             |
|--------------|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| >= 1.8.0_181 | [libjvm181.so](https://download.debug-tools.cc/libjvm/libjvm181.so) | [libjvm181.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm181.so) |
| 1.8.0_172    | [libjvm172.so](https://download.debug-tools.cc/libjvm/libjvm172.so) | [libjvm172.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm172.so) |
| 1.8.0_152    | [libjvm152.so](https://download.debug-tools.cc/libjvm/libjvm152.so) | [libjvm152.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm152.so) |
| 1.8.0_144    | [libjvm144.so](https://download.debug-tools.cc/libjvm/libjvm144.so) | [libjvm144.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm144.so) |
| 1.8.0_112    | [libjvm112.so](https://download.debug-tools.cc/libjvm/libjvm112.so) | [libjvm112.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm112.so) |
| 1.8.0_92     | [libjvm92.so](https://download.debug-tools.cc/libjvm/libjvm92.so)   | [libjvm92.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm92.so)   |
| 1.8.0_74     | [libjvm74.so](https://download.debug-tools.cc/libjvm/libjvm74.so)   | [libjvm74.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm74.so)   |
| <= 1.8.0_66  | [libjvm66.so](https://download.debug-tools.cc/libjvm/libjvm66.so)   | [libjvm66.so](https://github.com/java-hot-deploy/debug-tools/releases/download/libjvm.so/libjvm66.so)   |

:::

### 2.2 JDK 11 {#jdk11}

::: details JetBrainsRuntime

使用 [JetBrainsRuntime](https://github.com/JetBrains/JetBrainsRuntime/tree/jbr11) JDK 可以支持热部署/热重载。

<span style="color: red;">请下载带有 JBR with JCEF (DCEVM) 或者 JBR with JCEF (fastdebug)。</span>

建议使用最新版 [11_0_15-b2043.56](https://github.com/JetBrains/JetBrainsRuntime/releases/tag/jbr11_0_15b2043.56)

:::

### 2.3 JDK 17/21/25 {#jdk17-21-25}

使用 [JetBrainsRuntime](https://github.com/JetBrains/JetBrainsRuntime) JDK 可以支持热部署/热重载。

<span style="color: red;">请下载带有 JBRSDK with JCEF 版本。</span>

Java 17 建议使用最新版 [17.0.14b1367.22](https://github.com/JetBrains/JetBrainsRuntime/releases/tag/jbr-release-17.0.14b1367.22)

Java 21 建议使用 [最新版](https://github.com/JetBrains/JetBrainsRuntime/releases) 即可

Java 25 建议使用 [最新版](https://github.com/JetBrains/JetBrainsRuntime/releases)，如[25b176.4](https://github.com/JetBrains/JetBrainsRuntime/releases/tag/jbr-release-25b176.4)。

还可以在 Project Structure 中下载jdk,选择JetBrains Runtime (JCEF)  
![jdk_download_idea](/images/jdk_download_idea.png){v-zoom}


::: info

苹果系统如果下载JDK后提示已损坏或无法验证开发者等原因不能启动JDK，输入 `sudo xattr -r -d com.apple.quarantine /$jdkPath` 即可， **$jdkPath** 是你的jdk目录

:::