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
			
		

*/

//Local Storage. Testing and development only.
var centralLog = new File("~/Desktop/automation/javascript/logging/central_log.txt");

//Network Storage. Production version

//var centralLog = new file("/Volumes/Customization/Library/Scripts/.script_logs/central_log.txt");

var scriptLog = "";

var userFolder = new Folder("/Users/");
var user = userFolder.getFiles()[0].name;




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


		result += curTime;
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += msg.join("\n");
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n";

		scriptLog += result;
	},
	bp : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "\nBEGINbeginBEGINbeginBEGINbeginBEGINbeginBEGINbegin\n"
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += "Beginning process: " + msg.join("\n");
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += "BEGINbeginBEGINbeginBEGINbeginBEGINbeginBEGINbegin"
		result += "\n\n\n";

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

	},
	l : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "\n";
		result += "msg: " + msg.join("\nmsg: ");
		result += "\n\n";

		scriptLog += result;
	},
	L : function(msg)
	{
		var result = "";
		var curTime = logTime();

		msg = msg.split("::");

		result += curTime;
		result += "\n";
		result += "msg: >>> " + msg.join("\nmsg: >>> ");
		result += "\n\n";

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
	newStr += "Script executed by: ";
	newStr += user + "\n\n";
	newStr += scriptLog;
	var logString = contents + newStr;
	// centralLog.write(newStr);
	centralLog.write(logString);
	centralLog.close();
}

