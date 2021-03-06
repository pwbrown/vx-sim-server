var Line = require('./line');

var Studio = module.exports = function(config, ip, pn){
    //Initialize Studio settings and create Shows and Lines
    this.systemIP = ip;
    this.systemPN = pn;
    this.setupStudio(config);
    this.clients = [];
}

//*******CLIENT MANAGEMENT*********
Studio.prototype.addClient = function(id){
    this.clients.push(id);
}
Studio.prototype.removeClient = function(id){
    var clientIndex = this.clients.indexOf(id);
    if(clientIndex !== -1) this.clients.splice(clientIndex, 1);
}
Studio.prototype.getClients = function(){
    return this.clients;
}

//*****HELPER FUNCTIONS******
Studio.prototype.get = function(items){
    if(typeof items == 'string' || items.length == 1){
        var current = this.getCurrentConfig();
        if(typeof items !== 'string') items = items[0];
        var value = null;
        if(typeof current[items] == 'undefined') return null;
        else value = current[items];
        return items + "=" + value; //Returns single item
    }else{
        return items.map(function(item, index){
            var current = this.getCurrentConfig();
            if(typeof current[item] !== 'undefined'){
                var prop = "";
                if(index !== 0) prop += " ";
                prop += item + "=" + current[item];
                return prop;
            }else{
                return "";
            }
        }.bind(this));
    }
}

Studio.prototype.createCall = function(caller){
    var lineId = null;
    for(var i = 0; i < this.numberOfLines; i++){
        var id = i+1;
        var state = this.lines[id].getLineState();
        if(state == 'IDLE'){
            lineId = id;
            break;
        }
    }
    if(lineId !== null){
        var msg = this.lines[lineId].setCall({
            "state": "RINGING_IN",
            "callstate": "RINGING_IN",
            "remote": "\"sip:1"+caller.phone+"@"+this.systemIP+"\"",
            "caller_id": "\"" + caller.city.toUpperCase() + ", " + caller.state.toUpperCase() + "\"",
            "direction": "INCOMING",
            "cause": 180,
            "comment":"\"\""
        });
        return {success: true, lineId: lineId, msg: msg};
    }else{
        //All lines were either busy or occuppied so the call failed
        return {success: false, lineId: lineId, msg: null};
    }
}

Studio.prototype.getLineProps = function(lineId, props){
    return this.lines[lineId].get(props);
}

Studio.prototype.setBusyAll = function(busy){
    var messages = [];
    messages.push("event studio busy_all=" + (busy? "TRUE" : "FALSE"));
    for(var i = 0; i < this.numberOfLines; i++){
        var id = i+1;
        messages.push("event studio.line#" + (i+1) + " " + this.lines[id].setBusyAll(busy));
    }
    return messages;
}

Studio.prototype.setComment = function(line, comment){
    return this.lines[line].setComment(comment);
}

Studio.prototype.putCallOnAir = function(line, hybrid){
    console.log("SHOULD PUT CALL ON AIR");
}

Studio.prototype.putCallOnHandset = function(line){
    console.log("SHOULD PUT CALL ON HANDSET");
}

Studio.prototype.getName = function(){
    return this.name;
}

Studio.prototype.getNumberLines = function(){
    return this.numberOfLines;
}

Studio.prototype.getCurrentConfig = function(key){
    return {
        'id': this.id,
        'name': "\"" + this.name + "\"",
        'show_id': this.showId,
        'show_list': this.genShowList(),
        'show_name': "\"" + this.showName + "\"",
        'line_list': this.genLineList(),
        'num_lines': this.numberOfLines,
        'hybrid_list': this.genHybridList(),
        'num_hybrids': this.numberOfHybrids,
        'num_hyb_fixed': this.numberOfFixedHybrids,
        'next': this.next,
        'pnext': this.pnext,
        'show_locked': this.showLocked? "TRUE" : "FALSE",
        'auto_answer': this.autoAnswer? "TRUE" : "FALSE",
        'busy_all': this.busyAll? "TRUE" : "FALSE",
        'mute': this.mute? "TRUE" : "FALSE"
    }
}

Studio.prototype.genShowList = function(){
    var list = "";
    for(var i = 0; i < this.numberOfShows; i++){
        var id = i+1;
        if(list !== '') list += ", ";
        list += "[" + id + ", \"Show " + id + "\"]"; 
    }
    if(list !== '') list = "[" + list + "]";
    return list;
}

Studio.prototype.genLineList = function(){
    var list = "";
    for(var i = 0; i < this.numberOfLines; i++){
        if(list !== '') list += ", ";
        list += this.lines[(i+1)].getLineListItem();
    }
    if(list !== '') list = "[" + list + "]";
    return list;
}

Studio.prototype.genHybridList = function(){
    var list = "";
    for(var i = 0; i < this.numberOfFixedHybrids; i++){
        if(list !== '') list += ", ";
        list += "\"Fixed " + (i+1) + "\"";
    }
    var numSelect = this.numberOfHybrids - this.numberOfFixedHybrids;
    for(var i = 0; i < numSelect; i++){
        if(list !== '') list += ", ";
        list += "\"S"+this.id+"-Selectable " + (i+1) + "\"";
    }
    if(list !== '') list = "[" + list + "]";
    return list;
}

Studio.prototype.setupStudio = function(config){
    this.name = config.name;
    this.id = config.id;
    this.numberOfShows = config.shows;
    this.showName = config.showName;
    this.showId = config.showId;
    this.numberOfHybrids = config.hybrids;
    this.numberOfFixedHybrids = config.fixedHybrids;
    this.numberOfLines = config.lines;
    this.next = 0;
    this.pnext = 0;
    this.busyAll = false;
    this.mute = false;
    this.showLocked = false;
    this.autoAnswer = false;
    this.setupLines(config.lines);
}

Studio.prototype.setupLines = function(num){
    this.lines = {};
    for(var i = 0; i < num; i++){
        var id = i+1;
        this.lines[id] = new Line(this.busyAll, this.systemIP, this.systemPN);
    }
}