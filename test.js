var SimServer = require('./lib/server');

var vx = new SimServer({
    username: "user",
    password: "pass",
    port: 51645,
    debug: 2
})

vx.startServer()