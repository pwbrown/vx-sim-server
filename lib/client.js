var lwcp = require('./lwcpParse');

var Client = module.exports = function(id, socket, handler, close){
    //Store client id
    this.id = id;
    //Store socket
    this.socket = socket;
    //Set data encoding
    this.socket.setEncoding('utf8');
    //Stores current studio id
    this.studio = null;
    //Store Login Status
    this.loggedIn = false;
    //Store Mode
    this.mode = 'TALENT';
    //Server handler to process incoming connections from client
    this.handler = handler;
    //Server handler to delete closing client connection
    this.close = close;
    //Register client socket listeners and redirect them
    this.socket.on('data', this.onData.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
}

Client.prototype.send = function(msg){
    this.socket.write(msg + "\r\n");
}

Client.prototype.onData = function(body){
    this.handler(this.id, body, lwcp.parse(body));
}

Client.prototype.onClose = function(body){
    this.close(this.id);
}

Client.prototype.onError = function(body){
    debugger;
}

Client.prototype.login = function(){
    this.loggedIn = true;
}

Client.prototype.isLoggedIn = function(){
    return this.loggedIn;
}

Client.prototype.setMode = function(mode){
    if(typeof mode == 'string' && mode !== '' && mode.toUpperCase() == 'PRODUCER') this.mode = 'PRODUCER';
    else this.mode = 'TALENT';
}

Client.prototype.getMode = function(){
    return this.mode;
}

Client.prototype.setStudio = function(id){
    this.studio = id;
}

Client.prototype.getStudio = function(){
    return this.studio;
}