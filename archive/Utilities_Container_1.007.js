/*

Script Name: Utility Functions Container
Author: William Dowling
Build Date: 14 October, 2016
Description: Library to hold all abstract utility functions
Build number: 1.0

Progress:

	Version 1.001
		14 October, 2016
		Initial build.
	
	Version 1.002
		17 October, 2016
		Added "important log" priority.

	Version 1.003
		18 October, 2016
		Converted log into object where each priority is a value with a method attached.
		create log messages with: 
			log.priority("msg");
		create multiple lines on the same log message by using 2 colons where you want a line break:
			log.l("message 1::message2::message3");

	Version 1.004
		20 October, 2016
		included network storage version of log_layer_structure and commented local storage version.

	Version 1.005
		1 November, 2016
		changed "Begin script" to "Begin Log"
		implemented $.getenv("USER") to get more accurate user names.

	Version 1.006
		14 November, 2016
		Implemented conditional network path syntax to accomodate both windows and mac OS.

	Version 1.007
		8 December, 2016
		Added exist function.
			generic function that checks for the existence of a parent/child relationship
			and returns true or false.
			
		

*/



//Network Storage. Production version

	if($.os.match('Windows')){
		//PC
		var user = $.getenv("USERNAME")
		var centralLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\central_log.txt");
		var importantLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\important_log.txt");
		var centralErrorLog = new File("N:\\Library\\Scripts\\Script Resources\\Data\\.script_logs\\error_log.txt");
		
	} else {
		// MAC
		var user = $.getenv("USER")
		var centralLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/central_log.txt");
		var importantLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/important_log.txt");
		var centralErrorLog = new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/error_log.txt");
	}



var scriptLog = "";
var errorLog = "";


//Deprecated in favor of env.getUser() method.
// var user = getCorrectUser();

// function getCorrectUser()
// {
// 	var userFolder = new Folder("/Users/");
// 	var result;
// 	var userContents = userFolder.getFiles();
// 	if(userContents.length == 1)
// 	{
// 		result = userContents[0].name;
// 	}
// 	else if(userContents.length > 1)
// 	{
// 		for(var gu=0;gu<userContents.length;gu++)
// 		{
// 			var thisFile = userContents[gu];
// 			if(thisFile.name.indexOf("local")== -1 && thisFile.name.indexOf("DS_S")==-1)
// 			{
// 				result = thisFile.name;	
// 			}
			
// 		}
// 		if(result == null)
// 		{
// 			result = prompt("Enter your name please.");
// 		}
// 	}
// 	return result;
// }





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
	var time = m + "/" + d + "/" + y + "  " + h + ":" + min + ":" + s + ":";

	return time;
}

var log =
{
	h : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += "\n\n\n";
		result += curTime;
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += msg.join("\n");
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n";
		result += "\n";
		scriptLog += result;
	},
	bp : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		
		result += curTime + "\n";
		result += beginProcMsgString + "\n";	
		result += "Beginning process: " + msg.join("\n");
		result += "\n";
	
		

		scriptLog += result;
	},
	e : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "\n";
		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n";
		result += msg.join("\n");
		result += "\n";
		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n\n\n";

		scriptLog += result;
		errorLog += result;

	},
	l : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime + result += " msg: " + msg.join("\nmsg: ");
		result += "\n";

		scriptLog += result;
	},
	L : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "msg: >>> " + msg.join("\nmsg: >>> ");
		result += "\n";

		scriptLog += result;
	}
}

function printLog()
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
	newStr += user + "\n\n";
	newStr += scriptLog;
	newStr += endScriptString;
	var logString = contents + newStr ;
	// centralLog.write(newStr);
	centralLog.write(logString);
	centralLog.close();

	if(errorLog != "")
	{
		centralErrorLog.open();
		var contents = centralErrorLog.read();
		centralErrorLog.close();

		centralErrorLog.open("w");
		var newStr = "";
		newStr += "\n\n\n\n";
		newStr += user + " encountered an error:"
		newStr += "\n";
		newStr += errorLog;
		newStr += "\n";
		newStr += "--End--";
		newStr += "\n";
		var logString = contents + newStr;
		centralErrorLog.write(logString);
		centralErrorLog.close();
	}
}



function logLayerStructure(wearerLayers)
{
	log.bp("Beginning inspection of script template sublayers::Checking for locked and visible states.::Checking down to the group level to see whether everything is properly locked/unlocked");

	if(wearerLayers.length===0)
	{
		log.l("wearerLayers.length = 0")
		log.l("aborting")
		return true;
	}
	else
	{
		for(var x=0;x<wearerLayers.length;x++)
		{
			var thisWearer = wearerLayers[x];
			log.l("thisWearer.name = " + thisWearer.name);
			log.l("thisWearer.locked = " + thisWearer.locked);
			log.l("thisWearer.visible = " + thisWearer.visible);
			log.l("Setting prepress layer visible=true");
			thisWearer.layers["Prepress"].visible = true;
			log.l(thisWearer.name + " prepress layer.visible = " + thisWearer.layers["Prepress"].visible)
			
			log.l("Looping prepress layers.");
			for(var b=0;b<thisWearer.layers["Prepress"].layers.length;b++)
			{
				var thisSizeLayer= thisWearer.layers["Prepress"].layers[b];
				var curSize = thisSizeLayer.name;
				log.l("curSize: " + curSize);
				log.l("curSize.locked = " + thisSizeLayer.locked);
				log.l("curSize.visible = " + thisSizeLayer.visible);
				for(var c=0;c<thisSizeLayer.groupItems.length;c++)
				{
					var thisGroup = thisSizeLayer.groupItems[c];
					thisGroup.visible = true;
					log.l(curSize + ": groupItems[c] =" + thisGroup.name);
					log.l(curSize + ": " + thisGroup.name + ".locked = " + thisGroup.locked);
					log.l(curSize + ": " + thisGroup.name + ".visible = " + thisGroup.visible);

				}
				log.l("**end of " + curSize + " group loop**");
				log.l(" ::************::*************");
			}
			log.l("****end of " + thisWearer.name + " layer loop");
			log.l(" ::************::*************")
		}
		log.l("********end of " + wearerLayers + " layer loop");
		log.l(" ::************::*************")
	}
}



function exist(parent,child)
{
	var localValid;
	try
	{
		var test = parent[child];
		localValid = true;
	}
	catch(e)
	{
		localValid = false;
	}
	return localValid;
}