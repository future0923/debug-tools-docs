# Built-in Functions {#groovy-function}

To facilitate obtaining information about attached applications, `DebugTools` provides some `Groovy` built-in functions.

## Get JVM Instance {#jvm-instance}

By calling `gi` / `getInstances` passing in the class object, you can get the current JVM instance array of the class.

**Function definition**

```java
/**
 * Get all instances of the specified Class in the JVM
 *
 * @param targetClass The class object to be obtained
 * @param <T>         Specific types
 * @return Instance Array
 */
public <T> T[] gi(Class<T> targetClass) {}

/**
 * Get all instances of the specified Class in the JVM
 *
 * @param targetClass The class object to be obtained
 * @param <T>         Specific types
 * @return Instance Array
 */
public <T> T[] getInstances(Class<T> targetClass) {}
```

**Usage example**

```groovy
import org.springframework.context.ApplicationContext
// gi or getInstances to get the jvm instance
gi(ApplicationContext.class)
gi ApplicationContext.class
getInstances(ApplicationContext.class)
getInstances ApplicationContext.class
```

## Spring Bean operation {#spring-bean-operation}

### Injecting Bean Instances {#inject-bean-instance}

Bean instances are injected by calling `rb` / `registerBean`.

**Function definition**

```java
/**
 * Inject the instance into the Spring container and generate the BeanName according to Spring's BeanName rule
 *
 * @param bean The bean to be obtained
 * @param <T>  Specific type
 */
public <T> void rb(T bean) {}

/**
 * Inject the instance into the Spring container and generate the BeanName according to Spring's BeanName rule
 *
 * @param bean The bean to be obtained
 * @param <T>  Specific type
 */
public <T> void registerBean(T bean) {}

/**
 * Inject an instance into the Spring container and specify the BeanName
 *
 * @param beanName Injected BeanName
 * @param bean     The bean to be obtained
 * @param <T>      Specific type
 */
public <T> void rb(String beanName, T bean) {}

/**
 * Inject an instance into the Spring container and specify the BeanName
 *
 * @param beanName Injected BeanName
 * @param bean     The bean to be obtained
 * @param <T>      Specific type
 */
public <T> void registerBean(String beanName, T bean) {}
```

**Usage example**

```groovy
class TestBean {
    String hello(String name) {
        return "hello " + name
    }
}

def testBean = new TestBean()
rb(testBean)
rb("testBean", testBean)
registerBean(testBean)
registerBean("testBean", testBean)
```

### Get Bean Instance {#get-bean-instance}

Get the Spring Bean instance by calling `gb` / `getBean`.

**Function definition**

```java
/**
 * Get all instances of the specified Bean in the Spring container
 *
 * @param beanClass The class object to be obtained
 * @param <T>       Specific Type
 * @return Instance Array
 */
public <T> T[] gb(Class<T> beanClass) {}

/**
 * Get all instances of the specified Bean in the Spring container
 *
 * @param beanClass The class object to be obtained
 * @param <T>       Specific Type
 * @return Instance Array
 */
public <T> T[] getBean(Class<T> beanClass) {}

/**
 * Get all instances of the specified Bean in the Spring container
 *
 * @param beanName The name of the bean to get
 * @param <T>      Specific Type
 * @return Instance Array
 */
public <T> T[] gb(String beanName) {}

/**
 * Get all instances of the specified Bean in the Spring container
 *
 * @param beanName The name of the bean to get
 * @param <T>      Specific Type
 * @return Instance Array
 */
public <T> T[] getBean(String beanName) {}
```

**Usage example**

```groovy
gb(TestBean.class)
// Get the injected testBean and execute the hello method
gb("testBean")[0].hello("debug tools")
gb TestBean.class
getBean(TestBean.class)
getBean("testBean")
getBean TestBean.class
```

### Destroy Bean Instance {#destroy-bean-instance}

Destroy the Spring Bean instance by calling `urb` / `unregisterBean`.

**Function definition**

```java
/**
 * Destroys the bean with the specified name
 *
 * @param beanName The name of the bean to be destroyed
 */
public void urb(String beanName) {}

/**
 * Destroys the bean with the specified name
 *
 * @param beanName The name of the bean to be destroyed
 */
public void unregisterBean(String beanName) {}
```

**Usage example**

```groovy
urb("testBean")
unregisterBean("testBean")
```

### Get Bean Definition {#get-bean-definition}

Get the Bean definition information by calling `gtbd` / `getBeanDefinition`.

**Function definition**

```java
/**
 * Get the Bean definition information for the specified Bean in the Spring container
 *
 * @param beanName The Bean name to query
 * @return Bean definition information
 * @throws Exception if an exception occurs during the process
 */
public BeanDefinition gtbd(String beanName) {}

/**
 * Get the Bean definition information for the specified Bean in the Spring container
 *
 * @param beanName The Bean name to query
 * @return Bean definition information
 * @throws Exception if an exception occurs during the process
 */
public BeanDefinition getBeanDefinition(String beanName) {}
```

**Usage example**

```groovy
gtbd("testBean")
getBeanDefinition("testBean")
```

### Get Bean Names {#get-bean-names}

Get all Bean names for the specified type in the Spring container by calling `gtbn` / `getBeanNamesForType`.

**Function definition**

```java
/**
 * Get all Bean names of the specified type in the Spring container
 *
 * @param type The class type to query
 * @return Bean name array
 * @throws Exception if an exception occurs during the process
 */
public String[] gtbn(Class<?> type) {}

/**
 * Get all Bean names of the specified type in the Spring container
 *
 * @param type The class type to query
 * @return Bean name array
 * @throws Exception if an exception occurs during the process
 */
public String[] getBeanNamesForType(Class<?> type) {}
```

**Usage example**

```groovy
gtbn(TestBean.class)
getBeanNamesForType(TestBean.class)
```

### Destroy Bean and Definition {#destroy-bean-and-definition}

Destroy the Bean with the specified name and its definition by calling `urbd` / `unregisterBeanAndDefinition`.

**Function definition**

```java
/**
 * Destroy the Bean with the specified name and its definition
 *
 * @param beanName The name of the Bean to destroy
 */
public void urbd(String beanName) {}

/**
 * Destroy the Bean with the specified name and its definition
 *
 * @param beanName The name of the Bean to destroy
 */
public void unregisterBeanAndDefinition(String beanName) {}
```

**Usage example**

```groovy
urbd("testBean")
unregisterBeanAndDefinition("testBean")
```

## Get the Spring runtime environment {#environment-config}

Get the `spring.profiles.active` configuration information by calling `gActive` / `getSpringProfilesActive`.

**函数定义**

```java
/**
 * Get the spring running environment
 *
 * @return environment
 */
public String gActive() {}

/**
 * Get the spring running environment
 *
 * @return environment
 */
public String getSpringProfilesActive() {}
```

**Usage example**

```groovy
gActive()
getSpringProfilesActive()
```

## Get Spring Configuration Information {#spring-config}

Get spring configuration information by calling `gsc` / `getSpringConfig`.

**Function definition**

```java
/**
 * Get spring configuration
 *
 * @param key Configuration key
 * @return Specific configuration information
 */
public Object gsc(String key) {}

/**
 * Get spring configuration
 *
 * @param key Configuration key
 * @return Specific configuration information
 */
public Object getSpringConfig(String key) {}
```

**Usage example**

```groovy
gsc("spring.application.name")
gsc "spring.application.name"
getSpringConfig("spring.application.name")
getSpringConfig "spring.application.name"
```

## AOP Proxy Operation {#aop-proxy-operation}

### Get Proxy Target Object {#get-target-object}

Get the original target object of the AOP proxy by calling `getTargetObject`.

**Function definition**

```java
/**
 * Get the original target object of the AOP proxy object
 * @param candidate The proxy object
 * @param <T> Target object type
 * @return The original target object, or itself if not a proxy object
 */
public <T> T getTargetObject(Object candidate) {}
```

**Usage example**

```groovy
getTargetObject(proxyBean)
```

### Get Proxy Target Class {#get-target-class}

Get the original target class of the AOP proxy object by calling `gtClass` / `getTargetClass`.

**Function definition**

```java
/**
 * Get the original target class of the AOP proxy object
 * @param candidate The proxy object
 * @return The original target class, or its own class if not a proxy object
 */
public Class<?> gtClass(Object candidate) {}

/**
 * Get the original target class of the AOP proxy object
 * @param candidate The proxy object
 * @return The original target class, or its own class if not a proxy object
 */
public Class<?> getTargetClass(Object candidate) {}
```

**Usage example**

```groovy
gtClass(proxyBean)
getTargetClass(proxyBean)
```

### Check if AOP Proxy {#is-aop-proxy}

Check if the invocation handler is a Spring AOP proxy by calling `isAopProxy`.

**Function definition**

```java
/**
 * Check if the invocation handler is a Spring AOP proxy
 * @param invocationHandler The invocation handler
 * @return Returns true if it is a Spring AOP proxy, otherwise false
 */
public boolean isAopProxy(InvocationHandler invocationHandler) {}
```

**Usage example**

```groovy
isAopProxy(invocationHandler)
```

### Find Bridged Method {#find-bridged-method}

Find the original method corresponding to the bridged method by calling `findBridgedMethod`.

**Function definition**

```java
/**
 * Find the original method corresponding to the bridged method
 * @param targetMethod The possible bridged method
 * @return The original method, or itself if not a bridged method
 */
public Method findBridgedMethod(Method targetMethod) {}
```

**Usage example**

```groovy
findBridgedMethod(method)
```

## Complete Example {#complete-example}

```groovy
import org.springframework.context.ApplicationContext

// Return results
class ResultDTO {
    // Results for gi
    ApplicationContext[] gi
    // Results for gb
    TestBean[] gb
    // The result of calling the hello method
    String helloMethodResult
    // Current Environment
    String active
    // Application Name
    String applicationName
}

// To inject TestBean
class TestBean {

    String hello(String name) {
        return "hello " + name
    }
}

def result = new ResultDTO()

// gi or getInstances to get the jvm instance
def v1 = gi(ApplicationContext.class)
result.gi = v1
gi ApplicationContext.class
getInstances(ApplicationContext.class)
getInstances ApplicationContext.class

def testBean = new TestBean()
// Inject beans into spring
rb(testBean)
rb("testBean", testBean)
rb("testBeanClazz", TestBean)
//registerBean(testBean)
//registerBean("testBean", testBean)


// gb or getBean to get spring bean
def v2 = gb(TestBean.class)
result.gb = v2
// Get the injected testBean and execute the hello method
result.helloMethodResult = gb("testBean")[0].hello("debug tools")
gb TestBean.class
getBean(TestBean.class)
getBean("testBean")
getBean TestBean.class

// Get Bean names
def beanNames = gtbn(TestBean.class)

// Get Bean definition
def beanDef = gtbd("testBean")

// destroy bean
urb("testBean")
//unregisterBean("testBean")

// destroy bean and definition
urbd("testBeanClazz")
//unregisterBeanAndDefinition("testBeanClazz")

// Active or get SpringProfilesActive to get the current spring environment
def v3 = gActive()
result.active = v3
getSpringProfilesActive()

// gsc or getSpringConfig to get spring configuration
def v4 = gsc("spring.application.name")
result.applicationName = v4
gsc "spring.application.name"
getSpringConfig("spring.application.name")
getSpringConfig "spring.application.name"
return result
```

Use [debug](./run-result#debug) to view the returned results.

![groovy_example_debug](/images/groovy_example_debug.png){v-zoom}
