



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
		var desktopPath = "/Volumes/Macintosh HD/Users/" + user + "/Desktop/";
		var desktopFolder = new Folder(desktopPath);
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
var errorList = [];




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
	return !(IL > DR || IR < DL || IT < DB || IB > DT ) 

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

function getPPLay(layers)
{
	var len = layers.length;
	var result, lay, subLay, subLayLen;
	var pat = /^[a-z]{2}[-_].*/i;
	for(var x=0;x<len && !result;x++)
	{
		lay = layers[x];
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
	var pat = /(.*)([-_][\d]{3,}([-_][a-z])?)/i;
	return layName.match(pat)[1];
}

function getStyleNum(layName)
{
	var pat = /(.*)[-_]([\d]{3,}([-_][a-z])?)/i;
	return layName.match(pat)[2];
}


//sendErrors Function Description
//Display any errors to the user in a preformatted list
function sendErrors(errorList)
{
	alert("The Following Errors Occurred:\n" + errorList.join("\n"));
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
	if(ignorePrompt)
	{
		compFolder = new Folder(dev);
	}
	else if(user === "will.dowling")
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

//isTemplate Function Description
//check 
function isTemplate(doc)
{
	var result = true;
	var layers = doc.layers;

	var art;
	var info;
	var mock;
	
	//Try/Catch Description:
	//set variables for known template layers
	//if they don't exist, it's not a template
	try
	{
		art = layers[0].layers["Artwork Layer"];
		info = layers[0].layers["Information"];
		mock = layers[0].layers["Mockup"];
	}
	catch(e)
	{
		//this doc is not a converted template.
		//setting srcIsTemplate to false
		result = false;

		log.h("Source Document is NOT a template.::Results of isTemplate function are as follows:");
		log.l("art = " + art);
		log.l("info = " + info);
		log.l("mock = " + mock + "\n\n");
	}
	
	return result
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



/**********************/
/******UI Components***/
/**********************/



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