var SimServer = require('./lib/server');

var vx = new SimServer({
    username: "user",
    password: "",
    port: 51502
})

vx.startServer()