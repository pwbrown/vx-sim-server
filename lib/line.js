const whiteList = ['state','callstate','name','local','remote','hybrid','time','comment','direction','ssid','rport','caller_id'];

var Line = module.exports = function(busyAll, ip, pn){
    //Setup line defaults
    this.systemIP = ip;
    this.systemPN = pn;
    this.local = "sip:"+this.systemPN.replace(/-/g,"") + "@"+this.systemIP;
    this.setupLine(busyAll);
    this.shouldBeBusy = null;
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

Line.prototype.setBusyAll = function(busy){
    var message = "";
    if(this.state !== 'BUSY' && this.state !== 'IDLE'){
        this.shouldBeBusy = busy;
        message += this.get(['hybrid', 'state','callstate','time']);
        message += ", busy=" + (this.shouldBeBusy? "TRUE" : "FALSE");
        return message;
    }else{
        this.state = busy? "BUSY" : "IDLE";
        return this.get(['hybrid', 'comment', 'state', 'callstate', 'time', 'remote', 'caller_id', 'direction']);
    }
}

//********HELPER FUNCTIONS*********
Line.prototype.setupLine = function(busyAll){
    this.state = busyAll? "BUSY" : "IDLE";
    this.callstate = "IDLE";
    this.name = "\"" + this.systemPN + "\"";
    this.local = "\"" + this.local + "\"";
    this.remote = "NULL";
    this['caller_id'] = "NULL";
    this.hybrid = 0;
    this.time = "NULL";  //resets when line state changes
    this.comment = "\"\"";
    this.direction = "NONE";
    this.ssid = 0;
    this.rport = 1234;
}