



//Network Storage. Production version

	if($.os.match('Windows')){
		//PC
		var user = $.getenv("USERNAME")
		var centralLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\central_log.txt");
		var importantLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\important_log.txt");
		var centralErrorLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\error_log.txt");
		var missingTemplatesLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_longs\\converted_templates_needed.txt");

		
	} else {
		// MAC
		var user = $.getenv("USER")
		var centralLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/central_log.txt");
		var importantLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/important_log.txt");
		var centralErrorLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/error_log.txt");
		var buildMockLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/mockup_builder_log.txt");
		var missingTemplatesLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/converted_templates_needed.txt");
	}



//Global variables

var scriptLog = "";
var errorLog = "";
var templatesNeeded = "";
var logDest = [];





var beginScriptMsg = ["!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
"******************************************************************************",
"`7MM\"\"\"Yp, `7MM\"\"\"YMM    .g8\"\"\"bgd `7MMF'`7MN.   `7MF'    `7MMF'        .g8\"\"8q.     .g8\"\"\"bgd  ",
"  MM    Yb   MM    `7  .dP'     `M   MM    MMN.    M        MM        .dP'    `YM. .dP'     `M  ",
"  MM    dP   MM   d    dM'       `   MM    M YMb   M        MM        dM'      `MM dM'       `  ",
"  MM\"\"\"bg.   MMmmMM    MM            MM    M  `MN. M        MM        MM        MM MM           ",
"  MM    `Y   MM   Y  , MM.    `7MMF' MM    M   `MM.M        MM      , MM.      ,MP MM.    `7MMF'",
"  MM    ,9   MM     ,M `Mb.     MM   MM    M     YMM        MM     ,M `Mb.    ,dP' `Mb.     MM  ",
".JMMmmmd9  .JMMmmmmMMM   `\"bmmmdPY .JMML..JML.    YM      .JMMmmmmMMM   `\"bmmd\"'     `\"bmmmdPY  ",
"******************************************************************************",
"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"];


var endScriptMsg = ["!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
"******************************************************************************",
"`7MM\"\"\"YMM  `7MN.   `7MF'`7MM\"\"\"Yb.       `7MMF'        .g8\"\"8q.     .g8\"\"\"bgd ",
"  MM    `7    MMN.    M    MM    `Yb.       MM        .dP'    `YM. .dP'     `M  ",
"  MM   d      M YMb   M    MM     `Mb       MM        dM'      `MM dM'       `  ",
"  MMmmMM      M  `MN. M    MM      MM       MM        MM        MM MM           ",
"  MM   Y  ,   M   `MM.M    MM     ,MP       MM      , MM.      ,MP MM.    `7MMF'",
"  MM     ,M   M     YMM    MM    ,dP'       MM     ,M `Mb.    ,dP' `Mb.     MM  ",
".JMMmmmmMMM .JML.    YM  .JMMmmmdP'       .JMMmmmmMMM   `\"bmmd\"'     `\"bmmmdPY  ",
"******************************************************************************",
"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"];

var beginProcMsg = [
"****   *****   ***    *****  *    *",
"*   *  *      *         *    **   *",
"****   ****   *  ***    *    * *  *",
"*   *  *      *   *     *    *  * *",
"****   *****   ***    *****  *   **",
]


var beginScriptString = beginScriptMsg.join("\n")
var endScriptString = endScriptMsg.join("\n");
var beginProcMsgString = beginProcMsg.join("\n");













function logTime()
{
	var date = new Date();
	var m = date.getMonth() +1;
	if(m<10){m = "0" + m};
	var d = date.getDate();
	if(d<10){d = "0" + d};
	var h = date.getHours();
	var min = date.getMinutes();
	if(min<10){min = "0" + min};
	var s = date.getSeconds();
	if(s<10){s = "0" + s};
	var y = date.getFullYear().toString();
	y = y.substring(2,4);
	var time = m + "/" + d + "/" + y + "  " + h + ":" + min + ":" + s;

	return time;
}

var log =
{
	h : function(msg)
	{
		var result = "\n";
		msg = msg.split("::");

		
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += msg.join("\n");
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n";
		scriptLog += result;
	},
	bp : function(msg)
	{
		var result = "";

		msg = msg.split("::");

		result += "Beginning process: " + msg.join("\n");
		result += "\n";
	
		scriptLog += result;
	},
	e : function(msg)
	{
		var result = "\n";

		msg = msg.split("::");

		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n[error]: ";
		result += msg.join("\n[error]: ");
		result += "\n";
		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n\n";

		scriptLog += result;
		errorLog += result;

	},
	l : function(msg)
	{
		var result = "";

		msg = msg.split("::");

		result += "[msg]: ";
		result += msg.join("\n[msg]: ");
		result += "\n";

		scriptLog += result;
	},
	L : function(msg)
	{
		var result = "";

		msg = msg.split("::");

		result += "[msg]>>>: ";
		result += msg.join("\n[msg]>>>: ");
		result += "\n";

		scriptLog += result;
	},
	missingCT : function(msg)
	{
		var result = "";

		msg = msg.split("::");

		result += msg.join("\n");
		result += "\n";
		templatesNeeded += result;
	}
}

function printLog()
{
	var curTime = logTime();
	if(scriptLog != "")
	{
		centralLog.open();
		var contents= centralLog.read();
		centralLog.close();

		centralLog.open("w");

		var newStr = "";
		newStr += "\n\n\n\n";
		newStr += beginScriptString;
		newStr += "\n";
		newStr += "Script executed by: ";
		newStr += user + " at: " + curTime + "\n\n";
		newStr += scriptLog;
		newStr += endScriptString;
		var logString = contents + newStr ;
		// centralLog.write(newStr);
		centralLog.write(logString);
		centralLog.close();
	}

	if(errorLog != "")
	{
		centralErrorLog.open();
		var contents = centralErrorLog.read();
		centralErrorLog.close();

		centralErrorLog.open("w");
		var newStr = "";
		newStr += "\n\n\n\n";
		newStr += user + " encountered an error at: " + curTime + ":"
		newStr += "\n";
		newStr += errorLog;
		newStr += "\n";
		newStr += "--End--";
		newStr += "\n";
		var logString = contents + newStr;
		centralErrorLog.write(logString);
		centralErrorLog.close();
	}
	if(logDest.length > 0)
	{
		for(var x=0;x<logDest.length;x++)
		{
			var thisDest = logDest[x];
			

			thisDest.open();
			var contents = thisDest.read();
			thisDest.close();

			thisDest.open("w");

			var newStr = "";
			newStr += "\n\n\n\n";
			newStr += beginScriptString;
			newStr += "\n";
			newStr += "Script executed by: ";
			newStr += user + " at: " + curTime + "\n\n";
			newStr += scriptLog;
			newStr += endScriptString;
			var logString = contents + newStr ;

			thisDest.write(logString);
			thisDest.close();
		}
	}

	if(templatesNeeded != "")
	{
		missingTemplatesLog.open();
		var contents = missingTemplatesLog.read();
		missingTemplatesLog.close();

		missingTemplatesLog.open("w");
		var newStr = "";
		newStr += curTime;
		newStr += "The following converted template was not found when running " + scriptName + " script.\n";
		newStr += templatesNeeded;
		newStr += "\n";
		var logString = contents + newStr;
		missingTemplatesLog.write(logString);
		missingTemplatesLog.close();
	}
}


//////////////
/*

	condensed array prototype functions

*/

eval("@JSXBIN@ES@2.0@MyBbyBnABMAbyBnABMDbyBn0ABZFnAEXzFjGjMjPjPjSBfjzEiNjBjUjICfRBCzBhLDCzBhKEEXzGjSjBjOjEjPjNFfjCfnfCDCzBhNGVzDjNjBjYHfBVzDjNjJjOIfAnnnndBnnVIfAnnffACH4B0AhAI40BhAC0AzJjHjFjUiSjBjOjEjPjNJAGBgJbyBn0ADJLnAEjzEjFjWjBjMKfRBFeiOhDjJjOjDjMjVjEjFhAhChPiWjPjMjVjNjFjThPiDjVjTjUjPjNjJjajBjUjJjPjOhPiMjJjCjSjBjSjZhPiTjDjSjJjQjUjThPiTjDjSjJjQjUhAiSjFjTjPjVjSjDjFjThPhOjFjYjQhPjFjYjQhOjKjThCffJMnASzDjOjPjXLAEXLfjzEiEjBjUjFMfnfnftOObQn0ACJQnASzEjSjBjOjENBEjJfRCFdAFdCffnftOSbVn0ADJVnAEjzFjBjMjFjSjUOfRBCDCDnEjJfRCFdBFd2nUBffeOiFjSjSjPjShAjJjOKiMjJjOjFhAnnnehUhaKjBjOhAiJjMjMjVjTjUjSjBjUjPjShAjFjSjSjPjShAjPjDjDjVjSjSjFjEhahAhRhThUhWhUhVhYhRhYhZhAhIhHiNiSiBiQhHhJffJWnABjzDjMjPjHPfneAfJXnABjzFjWjBjMjJjEQfncffACzDhdhdhdRVNfBnndCnACzBheSVLfAjzDjFjYjQTfnnnABnzBjFUnbyBn0ABJgdnAEjOfRBCDCDnEjJfRCFdBFd2nUBffeOiFjSjSjPjShAjJjOKiMjJjOjFhAnnnehUhaKjBjOhAiJjMjMjVjTjUjSjBjUjPjShAjFjSjSjPjShAjPjDjDjVjSjSjFjEhahAhRhThUhWhUhVhYhRhYhZhAhIhHiNiSiBiQhHhJffACN4B0AiAL40BiAACAzFjJjTiFjYjQVAgfBJhAnAEjVfnf0DzAWByB");


//////////////
/*

	JSON.stringify method declaration

*/

if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}return v}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();



function intersects(item,dest)
{
	var result = true;

	//item coordinates
	var IL = item.left;
	var IT = item.top;
	var IR = item.left + item.width;
	var IB = item.top - item.height;

	//dest coordinates
	var DL = dest.left;
	var DT = dest.top;
	var DR = dest.left + dest.width;
	var DB = dest.top - dest.height;

	//check for anything that could make overlap false
	//if any of these conditions are true, an intersection is impossible
	if(
			IL > DR ||
			IR < DL ||
			IT < DB ||
			IB > DT
	)
	{
		result = false;
	}

	return result;

}

// function getCode(layer)
// {
// 	var layName = layer.name;
// 	var pat = /(.*)([-_][\d]{3,}([-_][a-z])?)/i;

// 	return layName.match(pat)[1];
// }

function getRandom(min,max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}