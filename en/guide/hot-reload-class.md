# Hot reload of normal class files

## Property changes

```java
public class User {
    
    private String userId; // [!code ++]
    
    private String name; // [!code --]
    private String userName; // [!code ++]
    
    private Integer userAge; // [!code --]
}
```

- You can use the new `userId` attribute.
- Remove the `name` attribute, and use the new `userName` attribute.
- You can use the new `userAge` attribute.

## Method changes

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

- You can use the new `getUserName` method.
- Remove the `getUserDefaultUser` method, and use the new `genDefaultUser` method.

## Static information changes{#static-change}

Support static variables, static final variables, and static code blocks.


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

After being overloaded, the values of variables var1, var2, and var3 are changed.


::: warning
Hot reloading of static variables will re-execute the class's `clinit` method, so <span style="color: red;">hot reloading will overwrite the runtime value with the value initialized at compile time</span>.
:::

::: details Cause
If the following changes are not overridden, var1 will not change from String to Integer.
```java
private static String var1 = "debug"; // [!code --]
private static Integer var1 = 666; // [!code ++]
```

However, in the following scenario, var1 will add data at runtime. If you overwrite it, you will lose the runtime data.

```java
private static Map<String, Long> var1 = new HashMap<>();
```

Therefore, <span style="color: red;">DebugTools will overwrite runtime data by default, but you can prevent overwriting of field runtime data using the following method</span>.

:::

::: details Solution 1: assign the variable only when it is empty in the static code block

```java
private static Map<String, Long> var1;

static {
    // This way, executing this code block when calling the clinit method will not overwrite runtime data.
    if (var1 == null) {
        var1 = new HashMap<>();
    }
}
```
:::

::: details Solution 2: configure it in the plugin

When the mouse is on a static field, open the context menu and click `Ignore this static field during hot reload`.

After adding it, a hint icon appears in the gutter. Click the icon to remove the ignore rule from the current configuration.

![hot_reload_ignore_static_field_action.png](/images/hotswap/hot_reload_ignore_static_field_action.png){v-zoom}

You can also maintain ignored static field configuration in `Settings | DebugTools | Hot Reload`. This page can switch the active configuration file, reload the list, view details, or add a new configuration.

![hot_reload_ignore_static_field_setting.png](/images/hotswap/hot_reload_ignore_static_field_setting.png){v-zoom}

- Dropdown: select the ignored static field configuration used when hot reload starts. The default configuration name is `default`.
- `Reload`: reread the configuration file list from the local configuration directory.
- `Detail`: open the selected configuration file so you can edit the rules directly.
- `Add`: create a new ignored static field configuration file, useful for saving different rule sets for different projects or scenarios.

Configuration files are stored under `.debugTools/IgnoreStaticField/` in the local user directory. The file content is regular `.conf` text. Rules support both `class#fieldName` and `class.fieldName`, and comments starting with `#` or `;`.

![hot_reload_ignore_static_field_conf.png](/images/hotswap/hot_reload_ignore_static_field_conf.png){v-zoom}
:::

## Enumeration class information changes.

```java
public enum StatusEnum {
    
    A1, // [!code --]
    A22, // [!code --]
    A2, // [!code ++]
    A3, // [!code ++]
}
```

After the change, there are only two enumeration values, A2 and A3.

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

The content will take effect after being changed.

## Internal class changes

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

- Added `userAuths` attribute.
- Modified `RoleVO` internal class information for normal use.
- Added `AuthVO` internal class information for normal use.

## Abstract class

Turn on hot reload, and when the abstract class is modified, all subclasses will take effect.

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

After hot reloading `User`, both `Debug` and `Tools` can use the `getUserName()` method.

## Interface

When the default method of an interface is modified, all implementation classes will take effect.

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

After hot reloading `User`, both `Debug` and `Tools` can use the `getUserName()` method.
