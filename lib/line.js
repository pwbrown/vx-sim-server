const whiteList = ['state','callstate','name','local','remote','hybrid','time','comment','direction','ssid','rport'];

var Line = module.exports = function(busyAll, ip, pn){
    //Setup line defaults
    this.systemIP = ip;
    this.systemPN = pn;
    this.local = "sip:"+this.systemPN.replace(/-/g,"") + "@"+this.systemIP;
    this.setupLine(busyAll);
}

Line.prototype.getLineListItem = function(){
    var order = ['state','callstate','name','local','remote','hybrid','time','comment','direction'];
    var item = "[";
    for(var i = 0; i < order.length; i++){
        if(i !== 0) item += ", ";
        item += this[order[i]];
    }
    item += "]";
    return item;
}

Line.prototype.get = function(items){
    if(typeof items == 'string' || items.length == 1){
        if(typeof items !== 'string') items = items[0];
        if(typeof this[items] == 'undefined' || whiteList.indexOf(items) == -1) return null;
        else var value = this[items];
        return items + "=" + value; //Returns single item
    }else{
        return items.map(function(item, index){
            if(typeof this[item] !== 'undefined' && whiteList.indexOf(item) !== -1){
                var prop = "";
                if(index !== 0) prop += " ";
                prop += item + "=" + this[item];
                return prop;
            }else{
                return "";
            }
        }.bind(this));
    }
}

//********HELPER FUNCTIONS*********
Line.prototype.setupLine = function(busyAll){
    this.state = busyAll? "BUSY" : "IDLE";
    this.callstate = "IDLE";
    this.name = "\"" + this.systemPN + "\"";
    this.local = "\"" + this.local + "\"";
    this.remote = "NULL";
    this.hybrid = 0;
    this.time = "NULL";  //resets when line state changes
    this.comment = "\"\"";
    this.direction = "NONE";
    this.ssid = 0;
    this.rport = 1234;
}