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

Studio.prototype.getName = function(){
    return this.name;
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