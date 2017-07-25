# vx-sim-server
Simulation Telos VX Server for use in testing.  Runs in node.js

## Installing Dependencies
    npm install vx-sim-server --save
    --OR--
    yarn add vx-sim-server

## Getting Started
```Javascript
var SimServer = require('vx-sim-server')

var vx = new SimServer();

vx.startServer(function(config){
    //Print dynamically generated TCP port
    console.log(config.port);
})
```

## Customizing Server
----
----

### Static Port
* By default, if a port is not provided, the OS will provide a random, available port
* The dynamic feature is useful when creating multiple sim servers that are all running on different ports
* Provide a static port to keep it from changing on server restart:

        {port:12345}

### Custom Login Credentials
* The default username is "username", and the default password is "password"
* Customize the credentials by providing the following options

        {username: 'myUsername', password: 'myPassword'}

### Debugging
* By default the server will not log any connection details or tcp messages to the console.
* To print details to the console add the debug option:

        {debug: 1} //Will print error messages to the console
        --OR--
        {debug: 2} //Will print error messages and ALL TCP communication messages to the console

### Example
```Javascript
var vx = new SimServer({
    username: "user",
    password: "password1234",
    port: 10101,
    debug: 2
});
```