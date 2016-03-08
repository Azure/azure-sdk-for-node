
## Service Runtime

The Service Runtime allows you to interact with the machine environment where the current role is running. Please note that these commands will only work if your code is running in a worker role inside the Azure emulator or in the cloud.

The **isAvailable** method lets you determine whether the service runtime endpoint is running on the local machine.  It is good practice to enclose any code that
uses service runtime in the isAvailable callback.

```JavaScript
azure.RoleEnvironment.isAvailable(function(error, available) {
  if (available) {
    // Place your calls to service runtime here
  }
});
```

The **getConfigurationSettings** method lets you obtain values from the role's .cscfg file.

```Javascript
azure.RoleEnvironment.getConfigurationSettings(function(error, settings) {
  if (!error) {
    // You can get the value of setting "setting1" via settings['setting1']
  }
});
```

The **getLocalResources** method lets you find the path to defined local storage resources for the current role.  For example, the DiagnosticStore
resource which is defined for every role provides a location for runtime diagnostics and logs.

```Javascript
azure.RoleEnvironment.getLocalResources(function(error, resources) {
  if(!error){
    // You can get the path to the role's diagnostics store via
    // resources['DiagnosticStore']['path']
  }
});
```

The **getCurrentRoleInstance** method lets you obtain information about endpoints defined for the current role instance:

```JavaScript
azure.RoleEnvironment.getCurrentRoleInstance(function(error, instance) {
  if (!error && instance['endpoints']) {
    // You can get information about "endpoint1" such as its address and port via
    // instance['endpoints']['endpoint1']['address'] and instance['endpoints']['endpoint1']['port']
  }
});
```

The **getRoles** method lets you obtain information about endpoints in role instances running on other machines:

```Javascript
azure.RoleEnvironment.getRoles(function(error, roles) {
  if(!error){
    // You can get information about "instance1" of "role1" via roles['role1']['instance1']
  }
});
```
