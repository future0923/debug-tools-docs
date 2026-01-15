# 普通class文件热重载

## 属性变动

```java
public class User {
    
    private String userId; // [!code ++]
    
    private String name; // [!code --]
    private String userName; // [!code ++]
    
    private Integer userAge; // [!code --]
}
```

- 可以使用新增的 `userId` 属性。
- 删除 `name` 属性，可以使用新增的 `userName` 属性。
- 可以使用新增的 `userAge` 属性。

## 方法变动

```java
public class UserUtils {

    public static String getUserName(UserVO userVO) {// [!code ++]
        return userVO.getName();// [!code ++]
    }// [!code ++]
    
    public static User getDefaultUser() { // [!code --]
    public static User genDefaultUser () { // [!code ++]
        User user = new User();
        user.setUserId(0); // [!code --]
        user.setUserId(Id.next()); // [!code ++]
        user.setName("default"); // [!code --]
        user.setUserName("default"); // [!code ++]
        user.setUserAge(0);// [!code --]
        return user;
    }
}
```

- 可以使用新增的 `getUserName` 方法。
- 删除掉 `getUserDefaultUser` 方法，可以使用新增的 `genDefaultUser` 方法。

## 静态信息变动{#static-change}

支持 static 变量、static final 变量、static 静态代码块。

```java
public class StaticClass {
    
    private static String var1 = "debug"; // [!code --]
    private static String var1 = "tools"; // [!code ++]
    
    private static final String var2 = "debug"; // [!code --]
    private static final String var2 = "tools"; // [!code ++]
    
    private static String var3;
    
    static {
        var3 = "debug"; // [!code --]
        var3 = "tools"; // [!code ++]
    }
    
}
```

变量 var1 、var2 、var3 更改为重载之后的值。

::: tip 注意
静态变量的热重载会重新执行class的`clinit`方法，所以<span style="color: red;">热重载会编译时初始化的值覆盖掉运行时的值</span>。 

如下面的变动如果不覆盖，则 var1 不会从 String 类型变为 Integer。
```java
private static String var1 = "debug"; // [!code --]
private static Integer var1 = 666; // [!code ++]
```

但是下面的这种情况 var1 会在运行时添加数据，如果你覆盖了，则会丢失运行时的数据

```java
private static Map<String, Long> var1 = new HashMap<>();
```

所以<span style="color: red;">DebugTools默认会覆盖运行时数据，但你可以通过如下方法禁止覆盖字段运行时数据</span>。

**方法1**：在静态代码库写上变量为空时候才赋值，如：

```java
private static Map<String, Long> var1;

static {
    // 这样在调用 clinit 方法的时候执行此代码块也不会覆盖运行时数据
    if (var1 == null) {
        var1 = new HashMap<>();
    }
}
```

**方法2**：在插件中配置

鼠标在字段上时可以通过右键菜单增加配置可以在热重载时忽略字段，使其可以不用编译时的值覆盖运行时的值，添加之后在行头有icon提示，点击可以移出忽略。

![hotswap_ignores_this_field.png](/images/hotswap_ignores_this_field.png){v-zoom}

在页面增加配置，可以编写和切换对应的配置文件

![setting_hotswap_ignores_field.png](/images/setting_hotswap_ignores_field.png){v-zoom}

文件内容就是普通的conf，内容 `类#字段名` 和 `类.字段名` 均可以，支持 `#` 和 `;` 注释

![hotswap_ignores_field_conf.png](/images/hotswap_ignores_field_conf.png){v-zoom}
:::

## 枚举类信息变动

```java
public enum StatusEnum {
    
    A1, // [!code --]
    A22, // [!code --]
    A2, // [!code ++]
    A3, // [!code ++]
}
```

更改之后只有 A2 、A3 两个枚举值。

```java
public enum StatusEnum {

    A1(1, "a"), // [!code --]
    A1(1, "A"), // [!code ++]
    A22(22, "BB"), // [!code --]
    A2(2, "B"), // [!code ++]
    A3(3, "C"), // [!code ++]
    ;
    private final Integer code;

    private final String name;

    public StatusEnum(Integer code, String name) {
        this.code = code;
        this.name = name;
    }

    public Integer getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
    
    public StatusEnum of(Integer code) { // [!code ++]
        for (StatusEnum statusEnum : StatusEnum.values()) { // [!code ++]
            if (statusEnum.getCode().equals(code)) { // [!code ++]
                return statusEnum; // [!code ++]
            } // [!code ++]
        } // [!code ++]
        return code; // [!code ++]
    }
}
```

更改之后的内容生效。

## 内部类变动

```java
public class UserVO {
    
    private String userName;
    
    private List<RoleVO> userRoles;
    
    public static class RoleVO {
        
        private Long roleId;  // [!code --]
        
        private String name;  // [!code --]
        private String roleName;  // [!code ++]

        private Integer status; // [!code ++]
        
        public String getName() { // [!code --]
            return name; // [!code --]
        public String getRoleName() { // [!code ++]
            return roleName; // [!code ++]
        }
        
        public String getStatusName() { // [!code ++]
            return status == 1 ? "正常" : "禁用"; // [!code ++]
        } // [!code ++]
        
    }
    
    private List<AuthVO> userAuths; // [!code ++]
    
    public class AuthVO { // [!code ++]
        
        private String authName; // [!code ++]
        
    } // [!code ++]
}
```

- 增加了 `userAuths` 属性。
- 正常使用修改了 `RoleVO` 内部类信息。
- 正常使用新增了 `AuthVO` 内部类信息。

## 抽象类

开启热重载，抽象类修改，所有的子类都会生效。

```java
public abstract class User {
    
    public String getUserName() { // [!code ++]
        return "default"; // [!code ++]
    } // [!code ++]
}

public class Debug extends User {
    
}

public class Tools extends User {

}
```

热重载 `User` 之后，`Debug` 和 `Tools` 都可以使用 `getUserName()` 方法。

## 接口

接口默认方法修改，所有的实现类都会生效。

```java
public interface User {
    
    default String getUserName() { // [!code ++]
        return "default"; // [!code ++]
    } // [!code ++]
}

public class Debug implements User {
    
}

public class Tools implements User {

}
```

热重载 `User` 之后，`Debug` 和 `Tools` 都可以使用 `getUserName()` 方法。