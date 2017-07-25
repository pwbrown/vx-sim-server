var net = require('net'),
    defaults = require('./defaults'),
    errors = require('./error'),
    Client = require('./client'),
    Studio = require('./studio'),
    lwcp = require('./lwcpParse'),
    random = require('./random'),
    defServ = defaults.server;

var newConnMap = ['server_id','server_version','server_caps','lwcp_version','zone','uid'];
var selectStudioMap = ['id','name','show_id','show_name','next','pnext','busy_all','num_lines','num_hybrids','num_hyb_fixed','mute','show_locked','auto_answer','line_list'];

var Server = module.exports = function(config){
    this.systemIP = random.genIPAddress();
    this.systemPN = random.genPhoneNumber();
    //Parse and establish configuration settings and create studios
    this.setupServer(config);
    //Create a net TCP server instance
    this.server = new net.Server();
    //Establish server listeners
    this.createListeners();
}

//********SERVER METHODS
//Function to start the server
Server.prototype.startServer = function(cb){
    this.server.listen(this.port, this.host, function(){
        if(this.port == 0) this.port = this.server.address().port;
        var host = (this.host == '127.0.0.1')? 'localhost' : this.host;
        console.log("Telos VX Sim Server Listening at " + host + ":" + this.port);
        if(typeof cb == 'function')
            cb({
                port: this.port,
                simIP: this.systemIP,
                simPhoneNum: this.systemPN
            });
    }.bind(this));
}

//********CONNECTIONS
//Handles New TCP Connections
Server.prototype.newConnection = function(socket){
    var id = socket.remoteAddress + ":" + socket.remotePort;
    this.clients[id] = new Client(id, socket, this.onData.bind(this), this.connectionClose.bind(this));
    this.consoleLog(2, "Client Connected -> " + id);
    this.send(id, "indi cc " + this.get(newConnMap));
}

//Handles closing client connections
Server.prototype.connectionClose = function(clientId){
    this.consoleLog(2, "Client Disconnected -> " + clientId);
    delete this.clients[clientId];
}

//********DATA HANDLING
//Receiving data from a client
Server.prototype.onData = function(clientId, original, body){
    this.consoleLog(2, "IN -> " + clientId + " -> " + original.trim()); //Console log the original input
    //Handle invalid LWCP data
    if(body == null) 
        return this.error(clientId, 'cc', 'MISSING_OBJECT');
    //Validate object
    var testObject = (body.subObject !== null)? body.object + "." + body.subObject : body.object;
    if(typeof defaults.validObjects[testObject] == 'undefined') 
        return this.error(clientId, testObject, 'INVALID_OBJECT');
    //Validate operation
    if(defaults.validObjects[testObject].indexOf(body.operation) == -1)
        return this.error(clientId, testObject, null, "Not a valid object for '"+ body.operation + "' operation.");
    if(testObject == 'cc'){
        this.ccHandler(clientId, body);
    }else if(testObject == 'studio'){
        this.studioHandler(clientId, body);
    }else if(testObject == 'studio.line'){
        this.studioLineHandler(clientId, body);
    }else if(testObject == 'studio.book'){
        this.studioBookHandler(clientId, body);
    }else if(testObject == 'studio.log'){
        this.studioLogHandler(clientId, body);
    }
}

//Handles 'CC' Object requests
Server.prototype.ccHandler = function(id, body){
    var op = body.operation;
    if(op == 'ping'){
        return this.send(id, 'pong cc');
    }else if(op == 'get'){
        var props = (body.properties !== null)? lwcp.propNames(body.properties) : [];
        if(props.indexOf('date') !== -1 && !this.loggedIn(id)) props.splice(props.indexOf('date'),1);
        if(props.indexOf('studio_list') !== -1 && !this.loggedIn(id)) props.splice(props.indexOf('studio_list'),1);
        if(props.length == 0) return this.error(id, 'cc', 'NO_VALID_PROPERTIES');
        var message = this.get(props);
        if(!message) return this.error(id, 'cc', 'NO_VALID_PROPERTIES');
        else return this.send(id, "indi cc " + message);
    }else if(op == 'set'){ //Set mode
        if(!this.loggedIn(id)) return this.error(id, 'cc', 'NOT_LOGGED_IN');
        var props = (body.properties !== null)? body.properties : [];
        if(props.length == 0) return this.error(id, 'cc', 'NO_VALID_PROPERTIES');
        var mode = lwcp.getPropValue('mode', props);
        this.clients[id].setMode(mode);
    }else if(op == 'login'){
        var props = (body.properties !== null)? body.properties : [];
        var username = lwcp.getPropValue('user',props);
        var password = lwcp.getPropValue('password',props);
        if(username == 'undefined'|| password == 'undefined') return this.error(id, 'cc', 'MISSING_AUTH_CRED');
        if(username !== this.username || password !== this.password) return this.send(id, 'ack cc logged=FALSE');
        else{
            this.clients[id].login();
            return this.send(id, 'ack cc logged=TRUE');
        }
    }
}

//Handles 'studio' Object requests
Server.prototype.studioHandler = function(id, body){
    if(!this.clients[id].isLoggedIn()) return this.error(id, 'studio', 'NOT_LOGGED_IN');
    var op = body.operation;
    var props = (body.properties !== null)? body.properties: [];
    var propNames = (body.properties !== null)? lwcp.propNames(body.properties) : [];
    var clientStudioId = this.clients[id].getStudio();
    if(op == 'select'){
        if(propNames.indexOf('id') == -1 && propNames.indexOf('name') == -1) return this.error(id, 'studio', 'MISSING_ID_NAME');
        var studioId = lwcp.getPropValue('id', props);
        var name = lwcp.getPropValue('name', props);
        var nameId = this.getStudioId(name);
        var searchId = null;
        if(typeof studioId == 'number')
            searchId = studioId;
        else if(name !== 'undefined' && nameId !== null){
            searchId = nameId;
        }
        if(searchId == 0) return this.changeStudio(id, 0);
        if(searchId == null || typeof this.studios[searchId] == 'undefined') return this.error(id, 'studio', 'STUDIO_ID');
        this.changeStudio(id, searchId);
    }else if(op == 'select_show'){
        return this.error(id, 'studio', 'FEATURE');
    }else if(op == 'im'){
        if(clientStudioId == 0 || clientStudioId == null) return this.error(id, 'studio', 'UNSELECTED_STUDIO');
        var from = lwcp.getPropValue('from', props);
        var message = lwcp.getPropValue('message', props);
        if(from == 'undefined' || message == 'undefined' || typeof from !== 'string' || typeof message !== 'string') return this.error(id, 'studio', 'IM_FAILURE');
        var msg = "event studio from=\""+from+"\", message=\""+message+"\"";
        this.broadcast(clientStudioId, msg);
    }else if(op == 'busy_all'){
        if(clientStudioId == 0 || clientStudioId == null) return this.error(id, 'studio', 'UNSELECTED_STUDIO');
        var state = lwcp.getPropValue('state', props);
        if(typeof state !== 'boolean') state = false;
        var msgs = this.studios[clientStudioId].setBusyAll(state);
        return this.broadcast(clientStudioId, msgs);
    }else if(op == 'drop'){
        return this.error(id, 'studio', 'FEATURE');
    }else if(op == 'hold'){
        return this.error(id, 'studio', 'FEATURE');
    }else if(op == 'get'){
        if(clientStudioId == null){
            if(propNames.length == 0) return this.error(id, 'studio', 'UNSELECTED_STUDIO');
            var res = "";
            for(var i = 0; i < propNames.length; i++){
                var add = "";
                if(propNames[i] == 'id') add = "id=0";
                if(propNames[i] == 'name') add = "name=NULL";
                if(add !== ""){
                    res += (res !== '')? ", " + add : add;
                }
            }
            if(res !== "") return this.send(id, "event studio " + res);
            else return this.error(id, 'studio', 'UNSELECTED_STUDIO');
        }else{
            if(propNames.length == 0) return this.error(id, 'studio', 'NO_VALID_PROPERTIES');
            var msg = this.studios[clientStudioId].get(propNames);
            if(!msg) return this.error(id, 'studio', 'NO_VALID_PROPERTIES');
            return this.send(id, "indi studio " + msg);
        }
    }
}

//Handles 'studio.line' Object requests
Server.prototype.studioLineHandler = function(id, body){
    console.log("Handling studio.line");
}

//Handles 'studio.book' Object requests
Server.prototype.studioBookHandler = function(id, body){
    console.log("Handling studio.book");
}

//Handles 'studio.log' Object requests
Server.prototype.studioLogHandler = function(id, body){
    console.log("Handling studio.log");
}


//******CLIENT INTERACTION
//Sends a message to a specific client using the id parameter
Server.prototype.send = function(id, msg){
    if(typeof this.clients[id] !== 'undefined'){
        this.consoleLog(2, "OUT -> " + id + " -> " + msg);
        this.clients[id].send(msg);
    }
}
Server.prototype.broadcast = function(studioId, msg){
    if(typeof msg == 'object' && msg.length){
        for(var i = 0; i < msg.length; i++){
            this.broadcast(studioId, msg[i]);
        }
    }else{
        var ids = this.studios[studioId].getClients();
        for(var i = 0; i < ids.length; i++){
            this.send(ids[i], msg);
        }
    }
}
Server.prototype.error = function(id, object, type, custMessage){
    var msg = "ack " + object + " $status=ERR ";
    msg += "$msg=\"" + (custMessage || errors[type]) + "\"";
    this.send(id, msg);
}

//*****HELPER FUNCTIONS*******
Server.prototype.get = function(items){
    if(typeof items == 'string' || items.length == 1){
        if(typeof items !== 'string') items = items[0];
        var value = null;
        if(items == 'date'){  //Date is a dynamic value so it must be generated each time
            value = "\"" + ((new Date()).toISOString()).replace(/\..*$/,'') + "\"";
        }else if(items == 'studio_list'){
            value = this.createStudioList();
        }else{
            if(typeof defServ[items] == 'undefined') return null;
            else value = defServ[items];
        }
        return items + "=" + value; //Returns single item
    }else{
        return items.map(function(item, index){
            if(item == 'date'){
                value = "\"" + ((new Date()).toISOString()).replace(/\..*$/,'') + "\"";
            }else if(item == 'studio_list'){
                value = this.createStudioList();    
            }else if(typeof defServ[item] !== 'undefined'){
                value = defServ[item];
            }else{
                return "";
            }
            var prop = "";
            if(index !== 0) prop += " ";
            prop += item + "=" + value;
            return prop;
        })
    }
}
Server.prototype.changeStudio = function(id, studioId){
    var fromId = this.clients[id].getStudio();
    if(fromId !== 0 && fromId !== null){
        this.studios[fromId].removeClient(id);
    }
    if(studioId !== 0){
        this.studios[studioId].addClient(id);
        this.clients[id].setStudio(studioId);
        this.send(id, 'event studio ' + this.studios[studioId].get(selectStudioMap));
    }else{
        this.clients[id].setStudio(null);
        this.send(id, 'event studio id=0, name=NULL');
    }
}
Server.prototype.getStudioId = function(name){
    if(name == null) return 0;
    for(var key in this.studios){
        if(this.studios[key].getName() == name) return key;
    }
    return null;
}
Server.prototype.loggedIn = function(id){
    return this.clients[id].isLoggedIn();
}
Server.prototype.consoleLog = function(level, message){
    if(typeof level !== 'number') level = 1;
	if(this.debug >= level && this.debug > 0){
		console.log(message);
	}
}
Server.prototype.setupServer = function(config){
    var def = defaults.serverSettings;
    if(typeof config == 'undefined' || config == null) config = {};
    this.host = config.host || def.host; //Localhost default
    this.port = config.port || def.port;  //0 port will allow the os to choose an available port
    this.username = (typeof config.username == 'string')? config.username : def.username; //Configuring the username for the telos server
    this.password = (typeof config.password == 'string')? config.password : def.password; //Configuring the password for the telos server
    this.debug = config.debug || 0; //Sets the debug level
    this.createStudios(config);
    //Create Client list
    this.clients = {}
}

Server.prototype.createStudios = function(config){
    this.studios = {};
    var numberOfStudios = 2;
    if(typeof config.studios == 'number' && config.studios > 0) numberOfStudios = Math.floor(config.studios); //Floor in case float is passed in
    this.numberOfStudios = numberOfStudios;
    for(var i = 0; i < numberOfStudios; i++){
        var studio = defaults.studio(i+1);
        if(typeof config.lines == 'number' && config.lines > 0) studio.lines = Math.floor(config.lines);
        this.studios[(i+1)] = new Studio(studio, this.systemIP, this.systemPN);
    }
}

Server.prototype.createStudioList = function(){
    var list = "[";
    for(var i = 0; i < this.numberOfStudios; i++){
        var id = i + 1;
        if(i !== 0) list += ", ";
        list += "[" + id + ", \"" + this.studios[id].getName() + "\"]";
    }
    list += "]";
    return list;
}

Server.prototype.createListeners = function(){
    this.server.on('connection', this.newConnection.bind(this));
}