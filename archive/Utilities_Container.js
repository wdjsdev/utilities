



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
var logDest;





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
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "msg: >>> " + msg.join("\nmsg: >>> ");
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
		newStr += curTime;
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
	}

	if(errorLog != "")
	{
		centralErrorLog.open();
		var contents = centralErrorLog.read();
		centralErrorLog.close();

		centralErrorLog.open("w");
		var newStr = "";
		newStr += curTime;
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
	if(logDest != undefined)
	{
		logDest.open();
		var contents = logDest.read();
		logDest.close();

		logDest.open("w");

		var newStr = "";
		newStr += curTime;
		newStr += "\n\n\n\n";
		newStr += beginScriptString;
		newStr += "\n";
		newStr += "Script executed by: ";
		newStr += user + "\n\n";
		newStr += scriptLog;
		newStr += endScriptString;
		var logString = contents + newStr ;

		logDest.write(logString);
		logDest.close();
	}

	if(templatesNeeded != "")
	{
		missingTemplatesLog.open();
		var contents = missingTemplatesLog.read();
		missingTemplatesLog.close();

		missingTemplatesLog.open("w");
		var newStr = "";
		newStr += "The following converted template was not found when running " + scriptName + " script.\n";
		newStr += templatesNeeded;
		newStr += "\n";
		var logString = contents + newStr;
		missingTemplatesLog.write(logString);
		missingTemplatesLog.close();
	}
}





