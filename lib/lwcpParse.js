exports.parse = function(input){
    input = input.trim();
	input = input.replace(/(\n|\r)/g,'');
	input = input.match(/^([a-z_]+)\s\s*([a-z]+)(?:\.([a-z]+)(?:\#([0-9]+))?)?(?:\s\s*(.*))?$/);
	if(input !== null){
		input = {
			operation: input[1] || null,
			object: input[2] || null,
			subObject: input[3] || null,
			subObjectId: input[4] || null,
			properties: input[5] || null
		}
		if(input.properties)
			input.properties = propertyParse(input.properties);
	}
	return input;
}
exports.propNames = function(input){
    var props = [];
    input.map(function(item){
        if(typeof item == 'string') props.push(item);
        else if(typeof item == 'object' && item.property) props.push(item.property);
    })
    return props;
}
exports.getPropValue = function(key, props){
	for(var i = 0; i < props.length; i++){
		if(props[i].property && props[i].property == key && typeof props[i].value !== 'undefined') 
            return props[i].value;
	}
	return 'undefined';
}
function propertyParse(props){
	var properties = [];
	while(props.length > 0){
		if(props[0] == ",") props = props.substring(1);
		props = props.trim();
		var cmIndex = props.indexOf(",");
		var wsIndex = props.indexOf(" ");
		var eqIndex = props.indexOf("=");
		if(eqIndex == -1 && wsIndex == -1 && cmIndex == -1){
			properties.push(props);
			props = "";
		}else{
			var checkArray = [];
			if(eqIndex !== -1) checkArray.push(eqIndex);
			if(wsIndex !== -1) checkArray.push(wsIndex);
			if(cmIndex !== -1) checkArray.push(cmIndex);
			var min = Math.min.apply(null, checkArray);
			checkArray.splice(checkArray.indexOf(min),1); //Remove successful min from array for later use
			var property = props.slice(0,min);
			props = props.substring(min+1);
			if(min == eqIndex){  //Grab our value
				props = props.trim();
				if(props.indexOf("\"") == 0){          //STRING PARSE
					props = props.substring(1);
					var qIndex = props.indexOf("\"");
					if(qIndex !== -1){
						var value = props.slice(0,qIndex);
						props = props.substring(qIndex+1);
						properties.push({property: property, value: value});
					}
				}else if(props.indexOf("\[") == 0){    //ARRAY PARSE
					var closeIndex = 0;
					var openCount = 1;
					for(var i = 1; i < props.length; i++){
						if(props[i] == "\]")
							openCount--;
						else if(props[i] == "\[")
							openCount++;
						if(openCount == 0){
							closeIndex = i;
							break;
						}
					}
					if(closeIndex !== 0){
						var unparsedArray = props.slice(0,closeIndex+1);
						props = props.substring(closeIndex+1);
						unparsedArray = ((unparsedArray.replace(/TRUE/g,'true')).replace(/FALSE/g,'false')).replace(/NULL/g,'null');
						var temp = unparsedArray;
						unparsedArray = unparsedArray.replace(/(\[\s*|\,\s*)([A-Z]+(?:\_[A-Z]+)*)(\s*\]|\s*\,)/,"$1\"$2\"$3");
						while(unparsedArray !== temp){
							temp = unparsedArray;
							unparsedArray = unparsedArray.replace(/(\[\s*|\,\s*)([A-Z]+(?:\_[A-Z]+)*)(\s*\]|\s*\,)/,"$1\"$2\"$3");
						}
						try{
							var parsedArray = JSON.parse(unparsedArray);
							properties.push({property: property, value: parsedArray});
						}catch(e){}
					}
				}else{
					var wsIndex = props.indexOf(" ");
					var cmIndex = props.indexOf(",");
					if(wsIndex == -1 && cmIndex == -1){
						var unparsedValue = props;
						props = "";
					}else{
						var checkArray = [];
						if(wsIndex !== -1) checkArray.push(wsIndex);
						if(cmIndex !== -1) checkArray.push(cmIndex);
						var min = Math.min.apply(null, checkArray);
						unparsedValue = props.slice(0,min);
						props = props.substring(min+1);
					}
					if(unparsedValue.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)){
						try{
							var parsedValue = parseFloat(unparsedValue);
						}catch(e){
							var parsedValue = unparsedValue;
						}
					}else if(unparsedValue.match(/NULL/)){
						var parsedValue = null;
					}else if(unparsedValue.match(/TRUE/)){
						var parsedValue = true;
					}else if(unparsedValue.match(/FALSE/)){
						var parsedValue = false;
					}else{
						var parsedValue = unparsedValue;
					}
					properties.push({
						property: property,
						value: parsedValue
					})
				}
			}else{
				properties.push(property);
			}
		}
	}
	return properties;
}