//array.indexOf prototype
Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;}

//list of dr users
var DR_USERS = 
[
	"acacio.sabino",
	"juan.garabito",
	"medelyn.tavarez",
	"rafael.nolasco",
	"nicolas.nicasio"
];

if(typeof scriptName === "undefined")
{
	//no scriptName variable existed. create one.
	var scriptName = $.fileName;
	scriptName = scriptName.substring(scriptName.lastIndexOf("/")+1,scriptName.lastIndexOf("."));
	scriptName = scriptName.toLowerCase();
}



//Network Storage. Production version
var networkPath;
if($.os.match('Windows'))
{
	alert("Sorry. The scripts aren't designed to work with a PC");
	valid = false;
}

// MAC
var user = $.getenv("USER")

var homeFolderPath = "/Volumes/Macintosh HD/Users/" + user;
var homeFolder = new Folder(homeFolderPath);

//boolean to determine whether to use the CustomizationDR drive for testing.
var spoofDRUser = false;
if(DR_USERS.indexOf(user)>-1 || (spoofDRUser && user === "will.dowling"))
{
	var customizationPath = "/Volumes/CustomizationDR/";
}
else
{
	var customizationPath = "/Volumes/Customization/";
}
var customizationFolder = new Folder(customizationPath);




var desktopPath = homeFolderPath + "/Desktop/";
var desktopFolder = new Folder(desktopPath);

var documentsPath = homeFolderPath + "/Documents/";
var documentsFolder = new Folder(documentsPath);

var libraryPath = customizationPath + "Library/";
var libraryFolder = new Folder(libraryPath);

var graphicsPath = libraryPath + "Graphics/";
var graphicsFolder = new Folder(graphicsPath);

var prepressPath = libraryPath + "cads/prepress/";
var prepressFolder = new Folder(prepressPath);

var scriptsPath = libraryPath + "Scripts/";
var scriptsFolder = new Folder(scriptsPath);

var resourcePath = scriptsPath + "Script Resources/";
var resourceFolder = new Folder(resourcePath);

var imagesPath = resourcePath + "Images/";
var imagesFolder = new Folder(imagesPath);

var componentsPath = resourcePath + "components/";
var componentsFolder = new Folder(componentsPath);

var dataPath = resourcePath + "Data/";
var dataFolder = new Folder(dataPath);

var logsPath = dataPath + ".script_logs/";
var logsFolder = new Folder(logsPath);

var centralLibraryPath = dataPath + "central_library.js";
var centralLibraryFile = File(centralLibraryPath);

var btLibraryPath = dataPath + "build_template_library.js";
var btLibraryFile = File(btLibraryPath);

var aaSpecialInstructionsFile = File(dataPath + "/aa_special_instructions.js");

var userPathRegex = /(^\/Users\/[^\/]*\/)|(^.*~\/)/i;


//
//deprecated
//
//logs will now be placed into individual user folders
//instead of having one central log file for each script.
//
//log files
var centralLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/central_log.txt");
var importantLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/important_log.txt");
var centralErrorLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/error_log.txt");
var buildMockLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/mockup_builder_log.txt");
var missingTemplatesLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/converted_templates_needed.txt");
var changeCodeLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/change_code_log.txt");
//
//deprecated
//


//
//Netsuite URLs
//
//sales order data for prod file building
var NOD = netsuiteOrderDataURL = "https://460511.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1477&deploy=1&compid=460511&h=2834dd5419b7c48fdba0&soid=";
//old version of netsuite order data url. adam g says use the new one below..
//this one has been working fine domestically, but the new one supposedly works better in the DR???
// var NOD = netsuiteOrderDataURL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=1477&deploy=1&compid=460511&h=2834dd5419b7c48fdba0&soid="

//builder data for mockup building
var NBD = netsuiteBuilderDataURL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=908&deploy=1&compid=460511&h=940572c6865fbbe12e98&designId=";




//stopwatch object for tracking task durations
var Stopwatch = function()
{
	this.startTime = 0;
	this.endTime = 0;
	this.taskStart = 0;
	this.taskEnd = 0;
	this.stepLabel = "";

	this.logStart = function()
	{
		var curDate = new Date();
		this.startTime = curDate.getTime();
	}
	this.logEnd = function()
	{
		var curDate = new Date();
		this.endTime = curDate.getTime();
	}
	this.beginTask = function(label)
	{
		this.stepLabel = label;
		this.taskStart = new Date().getTime();
	}
	this.endTask = function()
	{
		this.taskEnd = new Date().getTime();
		var stepDuration =  this.taskEnd - this.taskStart;
		var msg = this.stepLabel + " step took " + stepDuration + " ms.";
		log.l(msg);
	}
	this.getElapsed = function()
	{
		return "Elapsed Time: " + (new Date().getTime() - this.startTime);
	}
	this.calculate = function()
	{
		return (this.endTime - this.startTime);
	}
}
var scriptTimer = new Stopwatch();
//initiate the start time
scriptTimer.logStart();



//
//LOGGING
//


//Global variables

var scriptLog = "";
var errorLog = "";

var errorList = [];
var messageList = [];

var logDest = [];

var LIVE_LOGGING = false;


var beginScriptMsg = [
	"////////////////////////////////////////////////////",
	"////////////////////////////////////////////////////",
	"////////////////////////////////////////////////////",
	"**********************BEGIN*************************",
	"****************" + scriptName + "*******************",
	"////////////////////////////////////////////////////",
	"",
	"***User: " + user + "***",
	""
];


var endScriptMsg = [
	"////////////////////////////////////////////////////",
	"***********************END**************************",
	"****************" + scriptName + "*******************",
	"////////////////////////////////////////////////////",
	"////////////////////////////////////////////////////",
	"////////////////////////////////////////////////////",
	"",
	"",
	"",
	""
];

var beginScriptString = beginScriptMsg.join("\n")
var endScriptString = endScriptMsg.join("\n");

function initLog()
{
	livePrintLog(beginScriptString);
}
function endLog()
{
	livePrintLog(endScriptString);
}

function livePrintLog(msg)
{
	var contents;
	for(var l=0,len=logDest.length;l<len;l++)
	{
		logDest[l].open("a");
		logDest[l].write(msg);
		logDest[l].close();
	}
}

function getLogDest()
{
	var userLogPath = logsPath + user + "/";
	var userLogFolder = Folder(userLogPath);
	if(!userLogFolder.exists)
	{
		userLogFolder.create();
	}
	var scriptLogFile = File(userLogPath + scriptName + ".txt");
	return scriptLogFile;
}

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
		if(LIVE_LOGGING)
		{
			livePrintLog(result);
		}
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

		if(LIVE_LOGGING)
		{
			livePrintLog(result);
		}
	},
	l : function(msg)
	{
		var result = "";

		msg = msg.split("::");

		result += "[msg]: ";
		result += msg.join("\n[msg]: ");
		result += "\n";

		scriptLog += result;
		if(LIVE_LOGGING)
		{
			livePrintLog(result)
		}
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
	if(LIVE_LOGGING)
	{
		return;
	}
	var curTime = logTime();

	if(logDest.length > 0 && scriptLog !== "")
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
			newStr += "homeFolderPath = " + homeFolderPath + "\n";
			newStr += "desktopPath = " + desktopPath + "\n";
			newStr += scriptLog;
			newStr += endScriptString;
			var logString = contents + newStr ;

			thisDest.write(logString);
			thisDest.close();
		}
	}
}

function printSpecialtyLog(file,msg)
{
	file.open("r");
	var contents = file.read();
	file.close();

	file.open("w");
	file.write(contents + "\n" + msg);
	file.close();
}


//
//END LOGGING
//











//string.toTitleCase() 
//prototype function to convert entire string to titlecase
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//////////////
/*

	condensed array prototype functions

*/

// eval("@JSXBIN@ES@2.0@MyBbyBnABMAbyBnABMDbyBn0ABZFnAEXzFjGjMjPjPjSBfjzEiNjBjUjICfRBCzBhLDCzBhKEEXzGjSjBjOjEjPjNFfjCfnfCDCzBhNGVzDjNjBjYHfBVzDjNjJjOIfAnnnndBnnVIfAnnffACH4B0AhAI40BhAC0AzJjHjFjUiSjBjOjEjPjNJAGBgJbyBn0ADJLnAEjzEjFjWjBjMKfRBFeiOhDjJjOjDjMjVjEjFhAhChPiWjPjMjVjNjFjThPiDjVjTjUjPjNjJjajBjUjJjPjOhPiMjJjCjSjBjSjZhPiTjDjSjJjQjUjThPiTjDjSjJjQjUhAiSjFjTjPjVjSjDjFjThPhOjFjYjQhPjFjYjQhOjKjThCffJMnASzDjOjPjXLAEXLfjzEiEjBjUjFMfnfnftOObQn0ACJQnASzEjSjBjOjENBEjJfRCFdAFdCffnftOSbVn0ADJVnAEjzFjBjMjFjSjUOfRBCDCDnEjJfRCFdBFd2nUBffeOiFjSjSjPjShAjJjOKiMjJjOjFhAnnnehUhaKjBjOhAiJjMjMjVjTjUjSjBjUjPjShAjFjSjSjPjShAjPjDjDjVjSjSjFjEhahAhRhThUhWhUhVhYhRhYhZhAhIhHiNiSiBiQhHhJffJWnABjzDjMjPjHPfneAfJXnABjzFjWjBjMjJjEQfncffACzDhdhdhdRVNfBnndCnACzBheSVLfAjzDjFjYjQTfnnnABnzBjFUnbyBn0ABJgdnAEjOfRBCDCDnEjJfRCFdBFd2nUBffeOiFjSjSjPjShAjJjOKiMjJjOjFhAnnnehUhaKjBjOhAiJjMjMjVjTjUjSjBjUjPjShAjFjSjSjPjShAjPjDjDjVjSjSjFjEhahAhRhThUhWhUhVhYhRhYhZhAhIhHiNiSiBiQhHhJffACN4B0AiAL40BiAACAzFjJjTiFjYjQVAgfBJhAnAEjVfnf0DzAWByB");
// eval("@JSXBIN@ES@2.0@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");
eval("@JSXBIN@ES@2.0@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")



//get unique from array
//pass in an array and this function
//returns only the unique elements
function getUnique(arr)
{
	var tempResult = {};
	var result = [];

	for(var x=0,len = arr.length;x<len;x++)
	{
		if(!tempResult[arr[x]])
		{
			tempResult[arr[x]] = 1;
		}
	}

	for(var item in tempResult)
	{
		result.push(item);
	}
	return result;
}

//////////////
/*

	JSON.stringify method declaration

*/

if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}return v}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();


function intersects(item,dest)
{
	//item coordinates
	var IL = item.left;
	var IT = item.top;
	var IR = item.left + item.width;
	var IB = item.top - item.height;


	//dest coordinates
	if(dest.typename === "Artboard")
	{
		var rect = dest.artboardRect;
		var DL = rect[0];
		var DT = rect[1];
		var DR = rect[2];
		var DB = rect[3];
	}
	else
	{
		var DL = dest.left;
		var DT = dest.top;
		var DR = dest.left + dest.width;
		var DB = dest.top - dest.height;
	}

	//check for anything that could make overlap false
	//if any of these conditions are true, an intersection is impossible
	return !(IL > DR || IR < DL || IT < DB || IB > DT );

}

function isContainedWithin(item,dest)
{
	//item coordinates
	var IL = item.left;
	var IT = item.top;
	var IR = item.left + item.width;
	var IB = item.top - item.height;

	//dest coordinates
	if(dest.typename === "Artboard")
	{
		var rect = dest.artboardRect;
		var DL = rect[0];
		var DT = rect[1];
		var DR = rect[2];
		var DB = rect[3];
	}
	else
	{
		var DL = dest.left;
		var DT = dest.top;
		var DR = dest.left + dest.width;
		var DB = dest.top - dest.height;
	}

	return (IL >= DL && IR <= DR && IT <= DT && IB >= DB);
}

function findParentArtboard(item,artboards)
{
	var result;
	for(var x=0,len = artboards.length;x<len;x++)
	{
		if(isContainedWithin(item,artboards[x]))
		{
			result = x;
		}
	}
	return result;
}

/*
	Component Name: print_bounds
	Author: William Dowling
	Creation Date: 22 January, 2018
	Description: 
		get the bounds of the selected item(s)
		and print them to the console
	Arguments
		none
	Return value
		void

*/

function printBounds()
{
	var result = [];
	if(!app.documents.length)
	{
		alert("OPEN A DOCUMENT!");
		return;
	}
	var docRef = app.activeDocument;
	var sel = docRef.selection;
	var buffer = 3;
	if(sel.length === 1)
	{
		sel = docRef.selection[0];
		result = [sel.left,sel.top,sel.left + sel.width,sel.top - sel.height];
	}
	else if(sel.length > 1)
	{
		var l,t,r,b;
		for(var x=0,len=sel.length;x<len;x++)
		{
			if(x>0)
			{
				if (sel[x].left < l)
					l = sel[x].left;
				if(sel[x].top > t)
					t = sel[x].top;
				if(sel[x].left + sel[x].width > r)
					r = sel[x].left + sel[x].width;
				if(sel[x].top - sel[x].height < b)
					b = sel[x].top - sel[x].height;
			}
			else
			{
				l = sel[x].left;
				t = sel[x].top;
				r = sel[x].left + sel[x].width;
				b = sel[x].top - sel[x].height;
			}

		}
		result = [l,t,r,b];
	}
	else
	{
		alert("MAKE A SELECTION!!");
	}

	if(result)
	{
		result[0] -= buffer;
		result[1] += buffer;
		result[2] += buffer;
		result[3] -= buffer;
	}

	$.writeln("[" + result + "];")
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

function findChildByName(parent,name,type)
{
	var item;
	for(var x=0,len=parent.pageItems.length;x<len;x++)
	{
		item = parent.pageItems[x];
		if(item.name.toLowerCase() === name.toLowerCase())
		{
			if(!type || (type && item.typename === type))
			{
				return item;
			}
		}
	}
}

function findSpecificLayer(parent,layerName)
{
	var result,layers;

	if(parent.typename === "Layer" || parent.typename === "Document")
	{
		layers = parent.layers;	
	}
	else if(parent.typename === "Layers")
	{
		layers = parent;
	}
	
	for(var x=0,len=layers.length;x<len && !result;x++)
	{
		if(layers[x].name.toLowerCase() === layerName.toLowerCase())
		{
			result = layers[x];
		}
	}
	return result;
}

function getPPLay(parent)
{
	var result, len, lay, subLay, subLayLen;
	var pat = /^[a-z]{2}[-_].*/i;

	if(parent.typename === "String")
	{
		parent = app.activeDocument.layers[parent];
	}

	if(parent.typename === "Layers")
	{
		//parent = activeDocument.layers
		//search the entire document for a garment layer
		//then try to find a prepress layer within that garment layer
		len = parent.length;
		for(var x=0;x<len && !result;x++)
		{
			lay = parent[x];
			if(pat.test(lay.name))
			{
				subLayLen = lay.layers.length;
				for(var y=0;y<subLayLen && !result;y++)
				{
					subLay = lay.layers[y];
					if(subLay.name === "Prepress" && subLay.layers.length > 0 && subLay.layers[0].pageItems.length > 0)
					{
						result = subLay;
					}
				}
			}
		}
	}
	else if(parent.typename === "Layer")
	{
		//parent = specific document layer
		//search a specific layer for a prepress layer
		//this condition requires a specific garment
		//layer to be passed as an argument
		
		if(pat.test(parent.name))
		{
			len = parent.layers.length;
			for(var x=0;x<len && !result;x++)
			{
				subLay = parent.layers[x];
				if(subLay.name === "Prepress" && subLay.layers.length)
				{
					result = subLay;
				}
			}
		}

	}
	return result;
}

function coord(ppLay)
{
	var coords = {};
	var curSize,thisPiece,pieceName;
	var ppLen = ppLay.layers.length;
	var subLen;

	if(ppLen > 0 && ppLay.layers[0].pageItems.length > 0)
	{
		for(var a=0;a<ppLay.layers.length;a++)
		{
			curSize = ppLay.layers[a].name;
			coords[curSize] = {};
			subLen = ppLay.layers[a].groupItems.length;
			for(var b=0;b<subLen;b++)
			{
				thisPiece = ppLay.layers[a].groupItems[b];
				pieceName = thisPiece.name;
				coords[curSize][pieceName] = [];
				coords[curSize][pieceName][0] = (Math.floor(thisPiece.left *1000)/1000);
				coords[curSize][pieceName][1] = (Math.floor(thisPiece.top *1000)/1000);
			} 	
		}
		return coords;
	}
	else
	{
		return false;
	}
}

function getCode(layName)
{
	var pat = /(.*)([-_][a-z\d]{3,}([-_][a-z])?)/i;
	var underscorePat = /([fpb][dsm])[_]/i;
	var result = layName.match(pat)[1];
	while(result.match(underscorePat))
	{
		result = result.replace(underscorePat,result.match(underscorePat)[1] + "-");
	}
	return result;
}

function getStyleNum(layName)
{
	var pat = /(.*)[-_]([a-z\d]{3,}([-_][a-z])?)/i;
	return layName.match(pat)[2];
}


//sendErrors Function Description
//Display any errors to the user in a preformatted list
function sendErrors(errorList)
{
	alert("The Following Errors Occurred:\n" + errorList.join("\n"));
}


//sendScriptMessages function description
//display any messages generated by teh script to the user
//these will be instances where the user should be warned or alerted
//in some way, but they are not necessarily errors
//this could also be used for apologies. =)
function sendScriptMessages(messageList)
{
	alert("The script sent the following messages:\n" + messageList.join("\n"));
}




/*
	Component Name: include_components
	Author: William Dowling
	Creation Date: 22 September, 2017
	Description: 
		display a dialog to determine whether to use
		development components or production components
		****This is only used if the user is will.dowling****
		****All other users simply get the production components****
		When a components directory is selected, loop the files
		in the directory and push all files with a ".js" extension
		to the result array. (This ensures that any archive folder is skipped);
	Arguments
		dev
			path to the development components folder
		prod
			path to the production components folder
		ignorePrompt
			boolean to determine whether or not to show the dialog
			if true, just go to the dev folder.
	Return value
		an array of file objects that contain the extension ".js"

*/
function includeComponents(dev,prod,ignorePrompt)
{
	var result;
	var compFolder,comps,thisComp;
	
	if(user === "will.dowling")
	{
		if(ignorePrompt)
		{
			compFolder = new Folder(dev);	
		}
		else
		{
			var w = new Window("dialog", "Which components?");
				var btnGroup = w.add("group");
					btnGroup.orientation = "column";
					var devBtn = btnGroup.add("button",undefined,"Development");
						devBtn.onClick = function()
						{
							compFolder = new Folder(dev);
							w.close();
						}
					var prodBtn = btnGroup.add("button", undefined, "Production");
						prodBtn.onClick = function()
						{
							compFolder = new Folder(prod);
							w.close();
						}
					var cancel = btnGroup.add("button", undefined, "Cancel");
						cancel.onClick = function()
						{
							w.close();
						}
			w.show();
		}
	}
	else
	{
		compFolder = new Folder(prod);
	}

	if(compFolder)
	{
		result = [];
		comps = compFolder.getFiles();
		var len = comps.length;
		for(var c=0;c<len;c++)
		{
			if(comps[c].name.indexOf("js")>-1)
			{
				result.push(comps[c]);
			}
		}
	}

	return result;
}




//generic function to check for proper .ai[t] extension
//to be used with Folder.getFiles(isAiFile) method and
//Folder.openDlg("Title",isAiFile) method.
function isAiFile(file)
{
	var aiPat = /.ai[t]?$/i;
	return aiPat.test(file.name);
}


/*
	Component Name: unlock_doc
	Author: William Dowling
	Creation Date: 25 September, 2017
	Description: 
		Unlock and un-hide all elements of the given doc
	Arguments
		document object
	Return value
		success boolean

*/
function unlockDoc(doc)
{
	doc.activate();
	log.h("unlockDoc(" + doc.name + ")");
	var result = true;

	var layers = doc.layers;
	var layLen = layers.length;
	for(var ll=0;ll<layLen;ll++)
	{
		try
		{
			layers[ll].locked = false;
			layers[ll].visible = true;
			log.l("layer " + layers[ll].name + " successfully revealed.");
		}
		catch(e)
		{
			errorList.push("Failed to unlock or un-hide the layer: \"" + 
				layers[ll].name + "\", which was layer # " + (ll + 1) + " of " + doc.name);
			
			log.e("Failed to unlock or un-hide the layer: \"" + 
				layers[ll].name + "\", which was layer # " + (ll + 1) + " of " + doc.name + 
				"::System error message was: " + e);
			
			result = false;
		}
	}
	try
	{
		app.executeMenuCommand("unlockAll");
		app.executeMenuCommand("showAll");
		log.l("Successfully executed 'unlockAll' and 'showAll' menu commands.");
	}
	catch(e)
	{
		errorList.push("Failed while executing menu commands to unlock and unhide all sublayers and objects.");
		log.e("Failed while executing menu commands to unlock and unhide all sublayers and objects.::System error message was: " + e);
		result = false;
	}
	doc.selection = null;

	return result;
}




/*
	Component Name: proper_template_setup
	Author: William Dowling
	Creation Date: 26 September, 2017
	Description: 
		update the given document such that all of the layers
		and sub layers are properly locked, unlocked, hidden or visible etc.
	Arguments
		document object
	Return value
		success boolean

*/

function properTemplateSetup(doc)
{
	log.h("properTemplateSetup(" + doc.name + ")");
	var result = true;

	doc.activate();

	var layers = doc.layers;
	var layLen = layers.length;
	var garPat = /^[a-z]{2}[-_]/i;
	var thisLay,thisSubLay,layInfo;
	var templateLayers = 
	{
		"Artwork Layer":
		{
			"locked":false,
			"visible":true
		},
		"Mockup":
		{
			"locked":false,
			"visible":true
		},
		"Prepress":
		{
			"locked":false,
			"visible":false
		},
		"Information":
		{
			"locked":true,
			"visible":true
		},
		"USA Collars":
		{
			"locked":true,
			"visible":false
		}

	}

	for(var x=layLen-1;x>=0;x--)
	{
		thisLay = layers[x];
		if(garPat.test(thisLay.name))
		{
			log.l("Looping sub layers for layer: " + thisLay.name);
			for(var lay in templateLayers)
			{
				try
				{
					log.l("Attempting to process the layer: " + lay);
					thisSubLay = thisLay.layers[lay];
					layInfo = templateLayers[lay];
					thisSubLay.locked = layInfo.locked;
					thisSubLay.visible = layInfo.visible;
					log.l("Successfully set " + lay + " to ");
				}
				catch(e)
				{
					log.l("Failed to process " + lay);
				}
			}
		}
		else
		{
			try
			{
				thisLay.zOrder(ZOrderMethod.SENDTOBACK);
				thisLay.locked = true;
				thisLay.visible = true;
				
				log.l("Sent " + thisLay.name + " to back.");	
			}
			catch(e)
			{
				log.e("Failed to process " + thisLay.name + "::System error message: " + e);
			}
		}
	}

	log.l("properTemplateSetup result = " + result);
	return result;
}


/*
	Component Name: is_template
	Author: William Dowling
	Creation Date: 05 December, 2017
	Description: 
		check whether the given document is a proper converted template
	Arguments
		doc
			active document object
	Return value
		result
			boolean representing whether garment is a template

*/

function isTemplate(parent)
{
	log.h("Checking to see whether " + parent + " is a proper converted template.");

	var result = true,
	art,
	info,
	mock,
	prepress,
	searchLayer;

	if(parent.typename === "Document")
	{
		searchLayer = parent.layers[0];
	}
	else if (parent.typename === "Layer")
	{
		searchLayer = parent;
	}
	
	//Try/Catch Description:
	//set variables for known template layers
	//if they don't exist, it's not a template
	try
	{
		art = searchLayer.layers["Artwork Layer"];
		info = searchLayer.layers["Information"];
		mock = searchLayer.layers["Mockup"];
		prepress = searchLayer.layers["Prepress"];
		log.l(parent + " is a proper template. returning true");
	}
	catch(e)
	{
		//this doc is not a converted template.
		//setting srcIsTemplate to false
		result = false;

		if(e.toString().indexOf("MRAP")>-1)
		{
			log.l("MRAP error occurred.")
			errorList.push("Failed to determine whether this file was a proper converted template because of an MRAP error.");
			errorList.push("Please restart Illustrator and try again.");
		}
		else
		{
			log.l(parent + " is NOT a template.::Results of isTemplate function are as follows:");
		}

		log.l("art = " + art);
		log.l("info = " + info);
		log.l("mock = " + mock);
		log.l("prepress = " + prepress + "\n\n");
	}
	
	return result
}

function writeDatabase(dbPath,contents)
{
	var dbFile = File(dbPath)
	dbFile.open("w");
	dbFile.write(contents);
	dbFile.close();
}

/*
	Component Name: write_read_me_file
	Author: William Dowling
	Creation Date: 30 November, 2017
	Description: 
		write a read me file in a given folder
	Arguments
		dest: destination folder
		msg: string to write to the file
	Return value
		success boolean

*/

function writeReadMe(dest,msg)
{
	var result = true;
	if(!dest.exists)
	{
		try
		{
			dest.create();
		}
		catch(e)
		{
			errorList.push("Failed to create destination folder at the following location:\n" + dest.fsName);
			return false;
		}
	}

	var readMeFile = new File(dest.fsName + "/READ_ME.txt");
	//get any existing contents of the file to avoid overwriting
	readMeFile.open();
	var contents = readMeFile.read();
	readMeFile.close();

	//write the new read me message
	readMeFile.open("w");
	$.writeln(contents + logTime() + ": " + msg + "\n\n");
	readMeFile.write(contents + logTime() + ": " + msg + "\n\n");
	readMeFile.close();

}





//send customized emails

function sendCustomEmail(emailAddress,subject,msg)
{
	var scriptText = [
		'set recipientName to "John Doe"',
		'set recipientAddress to "' + emailAddress + '"',
		'set theSubject to "' + subject + '"',
		'set theContent to "' + msg + '"',

		'tell application "Mail"',

		'	set theMessage to make new outgoing message with properties {subject:theSubject, content:theContent, visible:true}',

		'	tell theMessage',
		'		make new to recipient with properties {name:recipientName, address:recipientAddress}',

		'		send',
		'	end tell',
		'end tell',
	];

	//write local temporary .scpt file
	var tempScript = File(homeFolderPath + "/send_email.scpt");
	tempScript.open("w");
	tempScript.write(scriptText.join("\n"));
	tempScript.close();

	//run the executor script
	var executor = File("/Volumes/Customization/Library/Scripts/Script Resources/send_email.app");
	executor.execute();
}


/**********************/
/******UI Components***/
/**********************/

var UI = 
{
	"window":function(title,func)
	{
		var w = new Window("dialog",title);

		w.addEventListener("keydown",function(k)
		{
			if(k.keyName == "Enter")
			{
				func();
			}
		});

		return w;
	},
	"static":function(parent,txt,len)
	{
		var result = parent.add("statictext", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	},

	"edit":function(parent,txt,len,func)
	{
		var result = parent.add("edittext", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	},

	"group":function(parent)
	{
		return parent.add("group");
	},
	"panel":function(parent,title)
	{
		return parent.add("panel",title);
	},

	"checkbox":function(parent,txt,len)
	{
		var result = parent.add("checkbox", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	},

	"button":function(parent,txt,func)
	{
		var result = parent.add("button", undefined, txt);
		if(func)
		{
			result.onClick = func;
		}
		return result;
	},

	//img is a string representing absolute file path
	//to the image file
	//example:
	//var img = "/Volumes/Customization/Library/Scripts/Script Resources/Images/all.jpg";
	"iconButton":function(parent,img,func)
	{
		var result = parent.add("iconButton", undefined, img);
		if(func)
		{
			result.onClick = func;
		}
		return result;
	},

	"image":function(parent,img,func)
	{
		var result = parent.add("image", undefined, File(img));
		if(func)
		{
			result.onClick = func;
		}
		return result;
	},

	"listbox":function(parent,dimensions,children,resourceString)
	{
		var result = parent.add("listbox",dimensions,[],resourceString);
		if(children)
		{
			for(var x=0,len=children.length;x<len;x++)
			{
				result.add("item",children[x]);
			}
		};
		return result;
	},

	"radio":function(parent,txt,len)
	{
		var result = parent.add("radiobutton",undefined,txt);
		if(len)
		{
			result.characters = len;	
		}
		return result;
	},
	
	"dropdown":function(parent,children)
	{
		var result = parent.add("dropdownlist",undefined,children);
		result.selection = 0;
		return result;
	},

	"hseparator":function(parent,width)
	{
		var result = parent.add("panel");
			result.preferredSize = [width,50];
			result.minimumSize.height = result.maximumSize.height = 3;
		return result
	},

	"vseparator":function(parent,width)
	{
		var result = parent.add("panel");
			result.preferredSize = [width,50];
			result.minimumSize.width = result.maximumSize.width = 3;
		return result
	}

}

//standard prompt window
function uiPrompt(msg,title)
{
	var result;
	if(!title){title = ""};
	var w = new Window("dialog",title);
		w.orientation = "column";
		var topMsg = UI.static(w,msg);
		var input = UI.edit(w,"");
			input.characters = 20;
			input.active = true;
		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"Cancel",function()
			{
				w.close();
			});
			var submit = UI.button(btnGroup,"Submit",submitFunction);


	w.addEventListener("keydown",function(k)
	{
		if(k.keyName == "Enter")
		{
			submitFunction();
		}
	});


	w.show();

	function submitFunction()
	{
		result = input.text;
		w.close();
	}

	return result;
}



////////////////////////
////////ATTENTION://////
//
//		the below is deprecated in favor of new UI object
//		with function properties instead of standalone functions
//
////////////////////////


	/*
		Component Name: make_static_text
		Author: William Dowling
		Creation Date: 08 November, 2017
		Description: 
			Create a static text object for the given parent
		Arguments
			parent object (coulg be a group, or window, or tab, etc.)
			string of text to be used
			[character length]-optional
		Return value
			the newly created text object

	*/

	function UI_staticText(parent,txt,len)
	{
		var result = parent.add("statictext", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	}



	/*
		Component Name: make_group
		Author: William Dowling
		Creation Date: 17 November, 2017
		Description: 
			make a group object in the given parent element
		Arguments
			parent object
		Return value
			group object

	*/

	function UI_group(parent)
	{
		return parent.add("group");
	}



	/*
		Component Name: make_checkbox
		Author: William Dowling
		Creation Date: 28 November, 2017
		Description: 
			Create a checkbox object for the given parent
		Arguments
			parent object (coulg be a group, or window, or tab, etc.)
			string of text to be used
			[character length]-optional
		Return value
			the newly created checkbox object

	*/

	function UI_checkbox(parent,txt,len)
	{
		var result = parent.add("checkbox", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	}



	/*
		Component Name: make_button
		Author: William Dowling
		Creation Date: 08 November, 2017
		Description: 
			create a new button for the given parent object
		Arguments
			parent object
			string of text to display on button		
		Return value
			button object

	*/

	function UI_button(parent,txt,func)
	{
		var result = parent.add("button", undefined, txt);
		if(func)
		{
			result.onClick = func;
		}
		return result;
	}



	/*
		Component Name: make_edit_text
		Author: William Dowling
		Creation Date: 28 November, 2017
		Description: 
			Create an edit text object for the given parent
		Arguments
			parent object (coulg be a group, or window, or tab, etc.)
			string of text to be used
			[character length]-optional
		Return value
			the newly created text object

	*/

	function UI_editText(parent,txt,len)
	{
		var result = parent.add("edittext", undefined, txt);
		if(len)
		{
			result.characters = len;
		}
		return result;
	}



	/*
		Component Name: make_listbox
		Author: William Dowling
		Creation Date: 08 November, 2017
		Description: 
			createa a listbox element in the given parent
		Arguments
			parent object
			dimensions array
		Return value
			listbox object

	*/

	function UI_listbox(parent,dim)
	{
		var result = parent.add("listbox",dim,[]);
		result.onChange = function()
		{
			if(result.selection)
			{
				displayData(parent,result.selection.text);
			}
		}
		return result;
	}



	/*
		Component Name: make_tab
		Author: William Dowling
		Creation Date: 09 November, 2017
		Description: 
			Create a new tab in the given parent element
		Arguments
			parent object
			string representing the name of the tab
		Return value
			tab object

	*/

	function UI_tab(parent,txt,name)
	{
		var myTab = parent.add("tab", undefined, txt);
		myTab.name = name;
		return myTab;
	}



/*
	Component Name: make_new_spot_color
	Author: William Dowling
	Creation Date: 27 April, 2018
	Description: 
		create a new spot color in the active
		document if one does not already exist
		by the given name.
	Arguments
		name
			name of new spot color swatch
		colorType
			string representing color model type
				"CMYK" or "RGB"
		colorValue
			object containing the values for each color
				{
					cyan:100,
					magenta:0,
					yellow:0,
					black:0
				}
		[tint]
			optional. int. tint percentage of the swatch

	Return value
		newly created swatch object

*/

function makeNewSpotColor(name,colorType,colorValue,tint)
{
	var doc = app.activeDocument;
	var swatches = doc.swatches;
	
	if(!colorType)
	{
		colorType = "CMYK"
	}
	if(!colorValue)
	{
		try
		{
			colorValue = BOOMBAH_APPROVED_COLOR_VALUES[name];
		}
		catch(e)
		{
			colorValue =
			{
				"cyan": 12,
				"magenta": 30,
				"yellow": 84,
				"black": 5
			}
		}
	}

	var newSpotSwatch;
	try
	{
		newSpotSwatch = swatches[name];
		if(tint)
		{
			newSpotSwatch.color.tint = tint;
		}
	}
	catch(e)
	{
		var newColor = (colorType === "CMYK") ? new CMYKColor() : new RGBColor();
		for(var color in colorValue)
		{
			newColor[color] = colorValue[color];
		}

		var newSpot = doc.spots.add();
		newSpot.name = name;
		newSpot.color = newColor;
		newSpot.colorType = ColorModel.SPOT;

		newSpotSwatch = new SpotColor();
		newSpotSwatch.spot = newSpot;
		newSpotSwatch = swatches[name];
		if(tint)
		{
			newSpotSwatch.tint = tint;
		}
	}
	return newSpotSwatch;
}

function mergeSwatches(oldSwatchName,newSwatchName)
{
	var doc = app.activeDocument;
	var renameSuccess = false;	
	var swatchGroup;
	var overlappingSwatches = false;
	var swatch = makeNewSpotColor(oldSwatchName);
	try
	{
		swatch.name = newSwatchName;
		renameSuccess = true;
	}
	catch(e)
	{
		var counter = 2;
		while(!renameSuccess && counter < 22)
		{
			try
			{
				swatch.name = newSwatchName + counter;
				renameSuccess = true;
				overlappingSwatches = true;
				counter++;
			}
			catch(e)
			{
				counter++;
			}
		}
	}

	if(overlappingSwatches)
	{
		for(var x=0,len=doc.swatchGroups.length;x<len;x++)
		{
			if(doc.swatchGroups[x].name === newSwatchName)
			{
				swatchGroup = doc.swatchGroups[x];
				break;
			}
		}

		if(!swatchGroup)
		{
			swatchGroup = doc.swatchGroups.add();
			swatchGroup.name = newSwatchName;
		}

		swatchGroup.addSwatch(doc.swatches[newSwatchName]);
		swatchGroup.addSwatch(swatch);
	}


	var newColorValues;
	newColorValues = BOOMBAH_APPROVED_COLOR_VALUES[newSwatchName];

	if(!newColorValues)
	{
		errorList.push("Failed to find color values in the database for " + newSwatchName);
		errorList.push("Please recolor the " + newSwatchName + " swatch manually.");
		newColorValues = {
			"cyan": 100,
			"magenta": 100,
			"yellow": 100,
			"black": 100
		}
	}

	for(var color in swatch.color.spot.color)
	{
		swatch.color.spot.color[color] = newColorValues[color];
	}
}

//this function assumes that a clipping mask
//has been found in the group.
//this function returns an object that includes
//the 'overhang' of a clip mask. the part of the 
//clipped image that is not visible 
function getClippedAmount(group)
{
	var result = {left:0,top:0};
	var mask;
	var clippedArt = [];
	for(var x=0,len=group.pageItems.length;x<len;x++)
	{
		if(group.pageItems[x].clipped)
		{
			mask = group.pageItems[x];
		}
		else
		{
			clippedArt.push(group.pageItems[x]);
		}
	}

	if(clippedArt.length)
	{
		var tmpGroup = group.parent.groupItems.add();
		for(var x=0,len = clippedArt.length;x<len;x++)
		{
			tmpGroup.push(clippedart[x]);
		}
	}

	if(mask)
	{
		result.left = tmpGroup.left - mask.left;
		result.top = tmpGroup.top - mask.top;
	}
	return result;

}

function getCenterPoint(item)
{
	try
	{
		for(var x=0,len=item.pageItems.length;x<len;x++)
		{
			if(item.pageItems[x].clipped)
			{
				item = item.pageItems[x];
				break;
			}
		}
	}
	catch(e)
	{
		//item had no child items. just return the dimensions of the item
	}
	return [item.left + item.width/2,item.top - item.height/2];
}

function setCenterPoint(item,coords)
{
	item.left = coords[0] - item.width/2;
	item.top = coords[1] + item.height/2;
}



function asciiToHex(str)
{
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n++)
	{
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	}
	return arr1.join('');
}



function getLibraryEntry(lib,key)
{
	var result;
	if(result = lib[key])
	{
		return result;
	}
	else if(result = lib[key.replace("_","-")])
	{
		return result;
	}
	else if(result = lib[key.replace("-","_")])
	{
		return result;
	}
	else
	{
		return undefined;
	}
}

function releaseCompoundPaths(items)
{
	app.activeDocument.selection = null;
	for(var x=0,len=items.length;x<len;x++)
	{
		items[x].selected = true;
	}

	app.executeMenuCommand("noCompoundPath");
}


//basically just indexOf function but for a regex
//pass in the regex and the string to search and
//it will return the index of the regex just like
//if you used String.indexOf("test");
function regexIndexOf(regex,string)
{
	var ph = "_placeholder_";
	var tmpStr = string;
	tmpStr = tmpStr.replace(regex,ph);
	return tmpStr.indexOf(ph);
}

//trim off all leading and trailing spaces for a 
//given string. this is single line only.. multi line
//strings will probably cause unpredictable behavior.
function trimSpaces(str)
{
	str = str.replace(/^\s*/,"");
	str = str.replace(/\s*$/,"");
	return str;
}

//receive an array of strings and then trim the leading/trailing
//spaces of each element and then return a cleaned up array.
function trimSpacesArray(arr)
{
	var result = [];
	for(var x=0,len=arr.length;x<len;x++)
	{
		result.push(trimSpaces(arr[x]));
	}
	return result;
}

//create and load a new action
function createAction(name,actionString)
{
	var dest = new Folder("~/Documents");
	var actionFile = new File(dest + "/" + name + ".aia" );

	actionFile.open("w");
	actionFile.write(actionString.join("\n"));
	actionFile.close();
	
	//load the action
	app.loadAction(actionFile);
}


//remove all instances of an action with a given name
function removeAction(actionName)
{
	var localValid = true;

	while(localValid)
	{
		try
		{
			app.unloadAction(actionName,"");
		}
		catch(e)
		{
			localValid = false;
		}
	}
}

//curl data from a specified url and return the data as an anonymous object
function curlData(url,arg)
{
	log.h("Beginning execution of curlData(" + url + "," + arg + ")");
	var result;
	
	if(!arg)
	{
		log.e("arg was undefined.");
		errorList.push("Failed to get the data from netsuite. The required information was missing.");
		return result;
	}

	var localDataFile = File(documentsPath + "curlData/curlData.txt");
	var executor = File(resourcePath + "/curl_from_illustrator.app");

	var scptText =
		[
			"do shell script ",
			"\"curl \\\"" + url,
			arg + "\\\" > \\\"",
			localDataFile.fsName + "\\\"\""
		];
	var dataString = scptText.join("");

	var scriptPath = documentsPath + "curlData/"
	var scriptFolder = new Folder(scriptPath);
	if(!scriptFolder.exists)
	{
		scriptFolder.create();
	}
	var scptFile = new File(scriptPath + "curl_from_illustrator.scpt");

	scptFile.open("w");
	scptFile.write(dataString);
	scptFile.close();

	localDataFile.open("w");
	localDataFile.write("");
	localDataFile.close();

	try
	{
		executor.execute();
	}
	catch(e)
	{
		log.e("curlData executor failed..::e = " + e + "::url = " + url + "::arg = " + arg);
		errorList.push("Failed to fetch the data from netsuite..");
		return;
	}

	//try to read the data
	var curTries = 0;
	var maxTries;

	//if the user is in the DR, set a long timeout
	//otherwise keep it short
	if(DR_USERS.indexOf(user)>-1)
	{
		maxTries = 600;
	}
	else
	{
		maxTries = 200;
	}
	var dataProperlyWritten = false;
	var delay = 100;
	var parsedJSON;
	var htmlRegex = /<html>/gmi;

	while(!dataProperlyWritten && curTries < maxTries)
	{
		localDataFile.open("r");
		result = localDataFile.read();
		localDataFile.close();


		if(htmlRegex.test(result))
		{
			log.e("curl command returned html code instead of JSON.::" + result);
			errorList.push("Netsuite returned improper data for " + arg + ".")
			break;
		}

		if(result !== "")
		{

			try
			{
				parsedJSON = JSON.parse(result);
			}
			catch(e)
			{
				continue;
			}
			log.l("data found after " + curTries + " tries.");
			log.l("execution took " + (curTries * delay) + " milliseconds");
			dataProperlyWritten = true;
		}
		else
		{
			curTries++;
			if(curTries % 10 === 0)
			{
				log.l("curTries = " + curTries);
			}
			$.sleep(delay);
		}
	}

	log.l("end of curlData function");
	log.l("returning: " + parsedJSON);
	return parsedJSON;

}

function updateSwatchColor(swatch,name,colors)
{
	swatch.name = name;
	for(var color in swatch.color.spot.color)
	{
		swatch.color.spot.color[color] = colors[color];
	}
}


//
//action string arrays
//

//cleanup swatches action
var CLEANUP_SWATCHES_ACTION_STRING =
	["/version 3",
	"/name [ 16",
	"	636c65616e75705f7377617463686573",
	"]",
	"/isOpen 1",
	"/actionCount 1",
	"/action-1 {",
	"	/name [ 16",
	"		636c65616e75705f7377617463686573",
	"	]",
	"	/keyIndex 5",
	"	/colorIndex 0",
	"	/isOpen 1",
	"	/eventCount 2",
	"	/event-1 {",
	"		/useRulersIn1stQuadrant 0",
	"		/internalName (ai_plugin_swatches)",
	"		/localizedName [ 8",
	"			5377617463686573",
	"		]",
	"		/isOpen 0",
	"		/isOn 1",
	"		/hasDialog 0",
	"		/parameterCount 1",
	"		/parameter-1 {",
	"			/key 1835363957",
	"			/showInPalette 4294967295",
	"			/type (enumerated)",
	"			/name [ 17",
	"				53656c65637420416c6c20556e75736564",
	"			]",
	"			/value 11",
	"		}",
	"	}",
	"	/event-2 {",
	"		/useRulersIn1stQuadrant 0",
	"		/internalName (ai_plugin_swatches)",
	"		/localizedName [ 8",
	"			5377617463686573",
	"		]",
	"		/isOpen 0",
	"		/isOn 1",
	"		/hasDialog 1",
	"		/showDialog 0",
	"		/parameterCount 1",
	"		/parameter-1 {",
	"			/key 1835363957",
	"			/showInPalette 4294967295",
	"			/type (enumerated)",
	"			/name [ 13",
	"				44656c65746520537761746368",
	"			]",
	"			/value 3",
	"		}",
	"	}",
	"}"
	]

var UNLOCK_GUIDES_ACTION_STRING = [
	"/version 3",
	"/name [ 13",
	"	756e6c6f636b5f677569646573",
	"]",
	"/isOpen 1",
	"/actionCount 1",
	"/action-1 {",
	"	/name [ 13",
	"		756e6c6f636b5f677569646573",
	"	]",
	"	/keyIndex 0",
	"	/colorIndex 0",
	"	/isOpen 1",
	"	/eventCount 1",
	"	/event-1 {",
	"		/useRulersIn1stQuadrant 0",
	"		/internalName (adobe_lockGuide)",
	"		/localizedName [ 11",
	"			4c6f636b20477569646573",
	"		]",
	"		/isOpen 1",
	"		/isOn 1",
	"		/hasDialog 0",
	"		/parameterCount 1",
	"		/parameter-1 {",
	"			/key 1819239275",
	"			/showInPalette 4294967295",
	"			/type (boolean)",
	"			/value 0",
	"		}",
	"	}",
	"}"
]

var GRAPHIC_STYLE_FROM_SELECTION_ACTION_STRING = 
	[
		"/version 3",
		"/name [ 28",
		"	677261706869635f7374796c655f66726f6d5f73656c656374696f6e",
		"]",
		"/isOpen 1",
		"/actionCount 1",
		"/action-1 {",
		"	/name [ 28",
		"		677261706869635f7374796c655f66726f6d5f73656c656374696f6e",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 3",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_styles)",
		"		/localizedName [ 14",
		"			47726170686963205374796c6573",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 17",
		"				53656c65637420416c6c20556e75736564",
		"			]",
		"			/value 14",
		"		}",
		"	}",
		"	/event-2 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_styles)",
		"		/localizedName [ 14",
		"			47726170686963205374796c6573",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 1",
		"		/showDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 20",
		"				44656c6574652047726170686963205374796c65",
		"			]",
		"			/value 3",
		"		}",
		"	}",
		"	/event-3 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_styles)",
		"		/localizedName [ 14",
		"			47726170686963205374796c6573",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 1",
		"		/showDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 17",
		"				4e65772047726170686963205374796c65",
		"			]",
		"			/value 1",
		"		}",
		"	}",
		"}",
	];

var CLEAR_APPEARANCE_ACTION_STRING = 
	[
		"/version 3",
		"/name [ 16",
		"	636c6561725f617070656172616e6365",
		"]",
		"/isOpen 1",
		"/actionCount 1",
		"/action-1 {",
		"	/name [ 16",
		"		636c6561725f617070656172616e6365",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_appearance)",
		"		/localizedName [ 10",
		"			417070656172616e6365",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 16",
		"				436c65617220417070656172616e6365",
		"			]",
		"			/value 6",
		"		}",
		"	}",
		"}",
	];

var ADD_NEW_FILL_ACTION_STRING = 
	[
		"/version 3",
		"/name [ 12",
		"	6164645f6e65775f66696c6c",
		"]",
		"/isOpen 1",
		"/actionCount 1",
		"/action-1 {",
		"	/name [ 12",
		"		6164645f6e65775f66696c6c",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_appearance)",
		"		/localizedName [ 10",
		"			417070656172616e6365",
		"		]",
		"		/isOpen 1",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 12",
		"				416464204e65772046696c6c",
		"			]",
		"			/value 1",
		"		}",
		"	}",
		"}"
	]


//
//action string arrays
//

var BOOMBAH_APPROVED_COLORS = 
	[
		"Sangria B",
		"Hot Coral B",
		"Autumn Glory B",
		"Amethyst Orchid B",
		"Violet B",
		"Kiwi B",
		"Tropical Green B",
		"Turquoise B",
		"Aqua B",
		"Electric Blue B",
		"Cobalt B",
		"Teak Brown B",
		"Desert B",
		"Sand B",
		"Coyote B",
		"Mulch B",
		"Tree Bark B",
		"Oak Brown B",
		"Storm B",
		"Slate B",
		"Foliage B",
		"Gun Metal B",
		"Olive Drab B",
		"Forest Green B",
		"Black B",
		"White B",
		"Gray B",
		"Gray 2 B",
		"Steel B",
		"Navy B",
		"Navy 2 B",
		"Royal Blue B",
		"Columbia B",
		"Teal B",
		"Dark Green B",
		"Kelly Green B",
		"Lime Green B",
		"Optic Yellow B",
		"Yellow B",
		"Athletic Gold B",
		"Vegas Gold B",
		"Orange B",
		"Texas Orange B",
		"Red B",
		"Cardinal B",
		"Maroon B",
		"Hot Pink B",
		"Pink B",
		"Soft Pink B",
		"Purple B",
		"Flesh B",
		"Dark Flesh B",
		"Brown B",
		"Cyan B",
		"FLO ORANGE B",
		"FLO YELLOW B",
		"FLO PINK B",
		"Twitch B",
		"MINT B",
		"Magenta B",
		"Magenta 2 B",
		"NEON CORAL B",
		"FLAME B",
		"BRIGHT PURPLE B",
		"Dark Charcoal B",
		"Info B",
		"Jock Tag B",
		"Thru-cut",
		"CUT LINE",
		"Cutline",
		"Jrock Charcoal",
		"Feeney Purple B",
		"Feeney Orange B",
		"Feeney Orange Body B",
		"Tailgater Gold B",
		"Cut Line",
		"MLBPA Red",
		"MLBPA Navy",
		"Azure B",
		"Ice Blue B",
		"Plum B",
		"Eggplant B",
		"Poppy B",
		"Dusty Rose B",
		"Peacock B",
		"Wine B",
		"Fuschia Neon B",
		"Charcoal B"
	];
var BOOMBAH_PRODUCTION_COLORS = 
	['Thru-cut',
	 'CUT LINE',
	 'cut line',
	 'Info B',
	 'cutline',
	 'CUTLINE',
	 'SEW LINE',
	 'SEW LINES',
	 'SEWLINE'];

var BUILDER_COLOR_CODES = {
	"B" : "Black B",
	"BPU" : "BRIGHT PURPLE B",
	"BN" : "Brown B",
	"CRD" : "Cardinal B",
	"C" : "Charcoal B",
	"CB" : "Columbia B",
	"CY" : "Cyan B",
	"DC" : "Dark Charcoal B",
	"DF" : "Dark Flesh B",
	"DG" : "Dark Green B",
	"FLM" : "FLAME B",
	"FL" : "Flesh B",
	"FO" : "FLO ORANGE B",
	"FY" : "FLO YELLOW B",
	"FP" : "FLO PINK B",
	"GD" : "Athletic Gold B",
	"GY" : "Gray 2 B",
	"HP" : "Hot Pink B",
	"KG" : "Kelly Green B",
	"LG" : "Lime Green B",
	"MG" : "Magenta 2 B",
	"MRN" : "Maroon B",
	"MN" : "MINT B",
	"N" : "Navy 2 B",
	"NC" : "NEON CORAL B",
	"OY" : "Optic Yellow B",
	"O" : "Orange B",
	"PK" : "Pink B",
	"PU" : "Purple B",
	"RD" : "Red B",
	"RB" : "Royal Blue B",
	"SP" : "Soft Pink B",
	"STL" : "Steel B",
	"TL" : "Teal B",
	"TO" : "Texas Orange B",
	"TW" : "Twitch B",
	"VG" : "Vegas Gold B",
	"W" : "White B",
	"Y" : "Yellow B",
	"YL" : "Yellow B"
}

var BOOMBAH_APPROVED_COLOR_VALUES =
{
	"[Registration]":
	{
		"cyan": 100,
		"magenta": 100,
		"yellow": 100,
		"black": 100
	},
	"Black B":
	{
		"cyan": 72,
		"magenta": 67,
		"yellow": 63,
		"black": 72
	},
	"White B":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"Gray B":
	{
		"cyan": 44,
		"magenta": 40,
		"yellow": 41,
		"black": 3
	},
	"Gray 2 B":
	{
		"cyan": 43,
		"magenta": 30,
		"yellow": 26,
		"black": 0
	},
	"Steel B":
	{
		"cyan": 53,
		"magenta": 49,
		"yellow": 43,
		"black": 10
	},
	"Navy B":
	{
		"cyan": 83,
		"magenta": 73,
		"yellow": 53,
		"black": 61
	},
	"Navy 2 B":
	{
		"cyan": 100,
		"magenta": 87,
		"yellow": 42,
		"black": 53
	},
	"Royal Blue B":
	{
		"cyan": 100,
		"magenta": 89,
		"yellow": 33,
		"black": 23
	},
	"Columbia B":
	{
		"cyan": 68,
		"magenta": 30,
		"yellow": 5,
		"black": 0
	},
	"Cyan B":
	{
		"cyan": 88,
		"magenta": 48,
		"yellow": 15,
		"black": 1
	},
	"Teal B":
	{
		"cyan": 87,
		"magenta": 40,
		"yellow": 44,
		"black": 11
	},
	"Dark Green B":
	{
		"cyan": 85,
		"magenta": 48,
		"yellow": 76,
		"black": 54
	},
	"Kelly Green B":
	{
		"cyan": 94,
		"magenta": 26,
		"yellow": 87,
		"black": 13
	},
	"Lime Green B":
	{
		"cyan": 51,
		"magenta": 0,
		"yellow": 87,
		"black": 0
	},
	"Yellow B":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"Optic Yellow B":
	{
		"cyan": 22,
		"magenta": 2,
		"yellow": 98,
		"black": 0
	},
	"Athletic Gold B":
	{
		"cyan": 5,
		"magenta": 40,
		"yellow": 95,
		"black": 0
	},
	"Vegas Gold B":
	{
		"cyan": 26,
		"magenta": 31,
		"yellow": 57,
		"black": 1
	},
	"Orange B":
	{
		"cyan": 11,
		"magenta": 85,
		"yellow": 100,
		"black": 2
	},
	"Texas Orange B":
	{
		"cyan": 27,
		"magenta": 78,
		"yellow": 99,
		"black": 20
	},
	"Red B":
	{
		"cyan": 22,
		"magenta": 100,
		"yellow": 93,
		"black": 16
	},
	"Cardinal B":
	{
		"cyan": 35,
		"magenta": 95,
		"yellow": 71,
		"black": 44
	},
	"Maroon B":
	{
		"cyan": 50,
		"magenta": 76,
		"yellow": 61,
		"black": 57
	},
	"Hot Pink B":
	{
		"cyan": 35,
		"magenta": 98,
		"yellow": 31,
		"black": 5
	},
	"Pink B":
	{
		"cyan": 11,
		"magenta": 71,
		"yellow": 17,
		"black": 0
	},
	"Soft Pink B":
	{
		"cyan": 4,
		"magenta": 30,
		"yellow": 1,
		"black": 0
	},
	"Purple B":
	{
		"cyan": 91,
		"magenta": 99,
		"yellow": 27,
		"black": 15
	},
	"Flesh B":
	{
		"cyan": 7,
		"magenta": 17,
		"yellow": 34,
		"black": 0
	},
	"Dark Flesh B":
	{
		"cyan": 24,
		"magenta": 41,
		"yellow": 51,
		"black": 1
	},
	"Brown B":
	{
		"cyan": 43,
		"magenta": 71,
		"yellow": 81,
		"black": 51
	},
	"FLO ORANGE B":
	{
		"cyan": 1,
		"magenta": 72,
		"yellow": 98,
		"black": 0
	},
	"FLO YELLOW B":
	{
		"cyan": 3,
		"magenta": 0,
		"yellow": 100,
		"black": 3
	},
	"FLO PINK B":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Twitch B":
	{
		"cyan": 15,
		"magenta": 0,
		"yellow": 97,
		"black": 0
	},
	"MINT B":
	{
		"cyan": 57,
		"magenta": 0,
		"yellow": 62,
		"black": 0
	},
	"NEON CORAL B":
	{
		"cyan": 0,
		"magenta": 82,
		"yellow": 57,
		"black": 0
	},
	"FLAME B":
	{
		"cyan": 0,
		"magenta": 87,
		"yellow": 100,
		"black": 0
	},
	"Magenta B":
	{
		"cyan": 7,
		"magenta": 100,
		"yellow": 64,
		"black": 26
	},
	"Magenta 2 B":
	{
		"cyan": 12,
		"magenta": 100,
		"yellow": 36,
		"black": 0
	},
	"BRIGHT PURPLE B":
	{
		"cyan": 40,
		"magenta": 67,
		"yellow": 1,
		"black": 0
	},
	"Dark Charcoal B":
	{
		"cyan": 63,
		"magenta": 62,
		"yellow": 63,
		"black": 51
	},
	"Charcoal B":
	{
		"cyan": 65,
		"magenta": 55,
		"yellow": 52,
		"black": 28

	},
	"PerfCutContour":
	{
		"cyan": 78,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"CutContour":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Info B":
	{
		"cyan": 30,
		"magenta": 30,
		"yellow": 30,
		"black": 100
	},
	"Jock Tag B":
	{
		"cyan": 30,
		"magenta": 30,
		"yellow": 30,
		"black": 100
	},
	"Thru-cut":
	{
		"cyan": 100,
		"magenta": 40,
		"yellow": 0,
		"black": 0
	},
	"SEW LINE":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 100,
		"black": 0
	},
	"CUT LINE":
	{
		"cyan": 10,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"Collar B":
	{
		"cyan": 33,
		"magenta": 34,
		"yellow": 2,
		"black": 0
	},
	"Collar Info B":
	{
		"cyan": 42,
		"magenta": 58,
		"yellow": 79,
		"black": 30
	},
	"C1":
	{
		"cyan": 100,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"C2":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"C3":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"C4":
	{
		"cyan": 82,
		"magenta": 4,
		"yellow": 100,
		"black": 0
	},
	"C5":
	{
		"cyan": 40,
		"magenta": 53,
		"yellow": 0,
		"black": 0
	},
	"C6":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 0
	},
	"C7":
	{
		"cyan": 92,
		"magenta": 27,
		"yellow": 41,
		"black": 26
	},
	"C8":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 55,
		"black": 30
	},
	"C9":
	{
		"cyan": 42,
		"magenta": 1,
		"yellow": 100,
		"black": 0
	},
	"C10":
	{
		"cyan": 60,
		"magenta": 85,
		"yellow": 0,
		"black": 0
	},
	"C11":
	{
		"cyan": 100,
		"magenta": 69,
		"yellow": 0,
		"black": 0
	},
	"C12":
	{
		"cyan": 81,
		"magenta": 0,
		"yellow": 82,
		"black": 65
	},
	"C13":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 23
	},
	"C14":
	{
		"cyan": 9,
		"magenta": 0,
		"yellow": 0,
		"black": 76
	},
	"Boombah Logo B":
	{
		"cyan": 70,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Boombah Logo 2 B":
	{
		"cyan": 35,
		"magenta": 35,
		"yellow": 0,
		"black": 0
	},
	"Drawstring":
	{
		"cyan": 67,
		"magenta": 0,
		"yellow": 34,
		"black": 0
	},
	"Zipper":
	{
		"cyan": 1,
		"magenta": 16,
		"yellow": 71,
		"black": 0
	},
	"Binding":
	{
		"cyan": 0,
		"magenta": 82,
		"yellow": 100,
		"black": 0
	},
	"Buttons":
	{
		"cyan": 57,
		"magenta": 0,
		"yellow": 71,
		"black": 0
	},
	"Pocket Welt 1":
	{
		"cyan": 35,
		"magenta": 88,
		"yellow": 94,
		"black": 53
	},
	"Pocket Welt 2":
	{
		"cyan": 0,
		"magenta": 56,
		"yellow": 35,
		"black": 0
	},
	"Pocket Facing":
	{
		"cyan": 93,
		"magenta": 74,
		"yellow": 45,
		"black": 40
	},
	"C15":
	{
		"cyan": 0,
		"magenta": 69,
		"yellow": 0,
		"black": 62
	},
	"Num1":
	{
		"cyan": 100,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"Num2":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Num3":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"Num4":
	{
		"cyan": 82,
		"magenta": 4,
		"yellow": 100,
		"black": 0
	},
	"Num5":
	{
		"cyan": 40,
		"magenta": 53,
		"yellow": 0,
		"black": 0
	},
	"Num6":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 0
	},
	"Name1":
	{
		"cyan": 100,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"Name2":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Name3":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"Name4":
	{
		"cyan": 82,
		"magenta": 4,
		"yellow": 100,
		"black": 0
	},
	"Name5":
	{
		"cyan": 40,
		"magenta": 53,
		"yellow": 0,
		"black": 0
	},
	"Name6":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 0
	},
	"Logo1":
	{
		"cyan": 100,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"Logo2":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"Logo3":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"Logo4":
	{
		"cyan": 82,
		"magenta": 4,
		"yellow": 100,
		"black": 0
	},
	"Logo5":
	{
		"cyan": 40,
		"magenta": 53,
		"yellow": 0,
		"black": 0
	},
	"Logo6":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 0
	},
	"B1":
	{
		"cyan": 100,
		"magenta": 0,
		"yellow": 0,
		"black": 0
	},
	"B2":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 0,
		"black": 0
	},
	"B3":
	{
		"cyan": 0,
		"magenta": 0,
		"yellow": 100,
		"black": 0
	},
	"B4":
	{
		"cyan": 82,
		"magenta": 4,
		"yellow": 100,
		"black": 0
	},
	"B5":
	{
		"cyan": 40,
		"magenta": 53,
		"yellow": 0,
		"black": 0
	},
	"B6":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 0
	},
	"B7":
	{
		"cyan": 92,
		"magenta": 27,
		"yellow": 41,
		"black": 26
	},
	"B8":
	{
		"cyan": 0,
		"magenta": 100,
		"yellow": 55,
		"black": 30
	},
	"B9":
	{
		"cyan": 42,
		"magenta": 1,
		"yellow": 100,
		"black": 0
	},
	"B10":
	{
		"cyan": 60,
		"magenta": 85,
		"yellow": 0,
		"black": 0
	},
	"B11":
	{
		"cyan": 100,
		"magenta": 69,
		"yellow": 0,
		"black": 0
	},
	"B14":
	{
		"cyan": 9,
		"magenta": 0,
		"yellow": 0,
		"black": 76
	},
	"B13":
	{
		"cyan": 0,
		"magenta": 54,
		"yellow": 100,
		"black": 23
	},
	"B12":
	{
		"cyan": 81,
		"magenta": 0,
		"yellow": 82,
		"black": 65
	}
}

