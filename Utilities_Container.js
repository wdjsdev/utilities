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
var DEV_LOGGING = false;


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

var beginScriptString = beginScriptMsg.join( "\n" )
var endScriptString = endScriptMsg.join( "\n" );

function initLog ()
{
	livePrintLog( beginScriptString );
}
function endLog ()
{
	livePrintLog( endScriptString );
}

function livePrintLog ( msg )
{
	var contents;
	for ( var l = 0, len = logDest.length; l < len; l++ )
	{
		logDest[ l ].open( "a" );
		logDest[ l ].write( msg );
		logDest[ l ].close();
	}
}

function getLogDest ( logName )
{
	var userLogPath = logsPath + user + "/";
	var userLogFolder = Folder( userLogPath );
	if ( !userLogFolder.exists )
	{
		userLogFolder.create();
	}

	var scriptLogFile;
	if ( logName )
	{
		scriptLogFile = File( userLogPath + logName + ".txt" );
	}
	else
	{
		scriptLogFile = File( userLogPath + scriptName + ".txt" );
	}
	return scriptLogFile;
}

function logTime ()
{
	var date = new Date();
	var m = date.getMonth() + 1;
	if ( m < 10 ) { m = "0" + m };
	var d = date.getDate();
	if ( d < 10 ) { d = "0" + d };
	var h = date.getHours();
	var min = date.getMinutes();
	if ( min < 10 ) { min = "0" + min };
	var s = date.getSeconds();
	if ( s < 10 ) { s = "0" + s };
	var y = date.getFullYear().toString();
	y = y.substring( 2, 4 );
	var time = m + "/" + d + "/" + y + "  " + h + ":" + min + ":" + s;

	return time;
}

function getDate ()
{
	var date = new Date();
	//month
	var m = date.getMonth() + 1;
	if ( m < 10 ) { m = "0" + m };
	//day
	var d = date.getDate();
	if ( d < 10 ) { d = "0" + d };
	//year
	var y = date.getFullYear().toString();
	y = y.substring( 2, 4 );
	var time = m + "." + d + "." + y;
	return time;
}

var log =
{
	h: function ( msg )
	{
		var result = "\n";
		msg = msg.split( "::" );


		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
		result += msg.join( "\n" );
		result += "\n";
		result += "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n";
		scriptLog += result;
		if ( LIVE_LOGGING )
		{
			livePrintLog( result );
		}
		if ( DEV_LOGGING )
		{
			$.writeln( result );
		}
	},
	bp: function ( msg )
	{
		var result = "";

		msg = msg.split( "::" );

		result += "Beginning process: " + msg.join( "\n" );
		result += "\n";

		scriptLog += result;
	},
	e: function ( msg )
	{
		var result = "\n";

		msg = msg.split( "::" );

		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n[error]: ";
		result += msg.join( "\n[error]: " );
		result += "\n";
		result += "**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR**ERROR";
		result += "\n\n";

		scriptLog += result;
		errorLog += result;

		if ( LIVE_LOGGING )
		{
			livePrintLog( result );
		}
		if ( DEV_LOGGING )
		{
			$.writeln( result );
		}
	},
	l: function ( msg )
	{
		var result = "";

		msg = ( msg + "" ).split( "::" );

		result += "[msg]: ";
		result += msg.join( "\n[msg]: " );
		result += "\n";

		scriptLog += result;
		if ( LIVE_LOGGING )
		{
			livePrintLog( result )
		}
		if ( DEV_LOGGING )
		{
			$.writeln( result );
		}
	},
	L: function ( msg )
	{
		var result = "";

		msg = msg.split( "::" );

		result += "[msg]>>>: ";
		result += msg.join( "\n[msg]>>>: " );
		result += "\n";

		scriptLog += result;
	},
	missingCT: function ( msg )
	{
		var result = "";

		msg = msg.split( "::" );

		result += msg.join( "\n" );
		result += "\n";
		templatesNeeded += result;
	}
}

function printLog ()
{
	if ( LIVE_LOGGING )
	{
		return;
	}
	var curTime = logTime();

	if ( logDest.length > 0 && scriptLog !== "" )
	{
		for ( var x = 0; x < logDest.length; x++ )
		{
			var thisDest = logDest[ x ];


			thisDest.open();
			var contents = thisDest.read();
			thisDest.close();

			thisDest.open( "w" );

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
			var logString = contents + newStr;

			//trim log so we only keep the most recent 10000 lines
			logString = logString.split( "\n" ).slice( -10000 ).join( "\n" );

			thisDest.write( logString );
			thisDest.close();
		}
	}
}

function printSpecialtyLog ( file, msg )
{
	file.open( "r" );
	var contents = file.read();
	file.close();

	file.open( "w" );
	file.write( contents + "\n" + msg );
	file.close();
}


//
//END LOGGING
//





//array.indexOf prototype
//Network Storage. Production version
var customizationPath;
var customizationDRPath;
if ( $.os.match( 'Windows' ) )
{
	var user = $.getenv( "USERNAME" );
	customizationPath = "//AD4/Customization/";
	customizationDRPath = "O:/"
	customizationPath = Folder( customizationDRPath ).exists ? customizationDRPath : customizationPath;
	var homeFolderPath = "C:/Users/" + user + "/";
	var homeFolder = Folder( homeFolderPath );
	var os = "windows";
}
else
{
	// MAC
	var user = $.getenv( "USER" )
	customizationPath = "/Volumes/Customization/";
	customizationDRPath = "/Volumes/CustomizationDR/";
	var homeFolderPath = "/Volumes/Macintosh HD/Users/" + user + "/";
	var homeFolder = new Folder( homeFolderPath );
	var os = "mac";
}

customizationPath = Folder( customizationDRPath ).exists ? customizationDRPath : customizationPath;
log.l( "Utilities Container setting customizationPath to: " + customizationPath );

////////////////////////
////////ATTENTION://////
//
//		array prototypes
//
////////////////////////

//array.indexOf()
Array.prototype.indexOf = function ( a, b, c )
{
	for ( c = this.length, b = ( c + ~~b ) % c; b < c && ( !( b in this ) || this[ b ] !== a ); b++ );
	return b ^ c ? b : -1;
}
Array.prototype.map = function ( callback )
{
	arr = [];
	for ( var i = 0; i < this.length; i++ )
		arr.push( callback( this[ i ], i, this ) );
	return arr;
};
Array.prototype.forEach = function ( callback, startPos, inc )
{
	inc = inc || 1;
	startPos = startPos || 0;
	for ( var i = startPos; i < this.length; i += inc )
		callback( this[ i ], i, this );
};
Array.prototype.backForEach = function ( callback, startPos, inc )
{
	inc = inc || 1;
	startPos = startPos || this.length - 1;
	for ( var i = startPos; i >= 0; i-- )
		callback( this[ i ], i, this );
};
Array.prototype.filter = function ( callback, context )
{
	arr = [];
	for ( var i = 0; i < this.length; i++ )
	{
		if ( callback.call( context, this[ i ], i, this ) )
		{
			arr.push( this[ i ] );

		}
	}
	return arr;
};
Array.prototype.reverse = function ()
{
	var arr = [];
	for ( var i = this.length - 1; i >= 0; i-- )
	{
		arr.push( this[ i ] );
	}
	return arr;
}


//
// Array.prototype.merge = function ( incomingArray )
// {

// 	for ( var i = 0; i < incomingArray.length; i++ )
// 	{
// 		this.push( incomingArray[ i ] );
// 	}
// 	return arr;
// }





////////////////////////
////////ATTENTION://////
//
//		array prototypes
//
////////////////////////


////////////////////////
////////ATTENTION://////
//
//		obj prototypes
//
////////////////////////

function objForEach ( obj, func )
{
	for ( var i in obj )
	{
		func( obj[ i ] );
	}
}

////////////////////////
////////ATTENTION://////
//
//		obj prototypes
//
////////////////////////


////////ATTENTION://////
//potentially removeable.. testing to see if just looking
//for the customizationDR drive is enough to accurately determine
//a dr user.. That way i won't need to maintain this list.
////////////////////////
//list of dr users
// var DR_USERS =
// 	[
// 		"medelyn.tavarez",
// 		"rafael.nolasco",
// 		"nicolas.nicasio",
// 		"arlan.grullon",
// 		"deivison.urena",
// 		"eliezer.lopez",
// 		"maximo.montesino",
// 		"danny.cabrera",
// 		"kelvin.ynoa",
// 		"julio.lora",
// 		"ismael.noesi",
// 		"raymond.fernandez",
// 		"isaac.martinez",
// 		"joshua.chevalier",
// 		"katherine.ramos",
// 		"enmanuel.mercado",
// 		"domingo.camilo",
// 		"lenin.tavarez",
// 		"franklyn.martin",
// 		"gricely.rivas"
// 	];



//boolean to determine whether to use the CustomizationDR drive for testing.
// var spoofDRUser = false;
// log.l( "Checking for dr user:" );
// if ( os.match( /mac/i ) && DR_USERS.indexOf( user ) > -1 || ( user === "will.dowling" && Folder( "/Volumes/CustomizationDR" ).exists ) )
// {
// 	log.l( "User is a DR user. using customizationDR path" );
// 	customizationPath = customizationPath.replace( "Customization", "CustomizationDR" );
// }

// log.l( "Customization path = " + customizationPath );









//specific fix for Sam Bateman's home computer..
//her username is "thell".
//And she typically works on the "D" drive instead of "C"
//then she has to manually move things from D over to C after
//a script is finished. let's just change her home folder to the
//D drive so she doesn't have to move everything after the script runs
if ( user === "thell" )
{
	homeFolderPath = homeFolderPath.replace( "C:", "D:" );
	homeFolder = Folder( homeFolderPath );
}











if ( typeof scriptName === "undefined" )
{
	//no scriptName variable existed. create one.
	alert( "Please tell william which script you ran before you got this message. Thanks!" );
	var scriptName = "unknown";
}





var desktopPath = homeFolderPath + "Desktop/";
var desktopFolder = new Folder( desktopPath );

var documentsPath = homeFolderPath + "Documents/";
var documentsFolder = new Folder( documentsPath );

var customizationFolder = new Folder( customizationPath );

var libraryPath = customizationPath + "Library/";
var libraryFolder = new Folder( libraryPath );

var graphicsPath = libraryPath + "Graphics/";
var graphicsFolder = new Folder( graphicsPath );

var prepressPath = libraryPath + "cads/prepress/";
var prepressFolder = new Folder( prepressPath );

var scriptsPath = libraryPath + "Scripts/";
var scriptsFolder = new Folder( scriptsPath );

var resourcePath = scriptsPath + "Script_Resources/";
var resourceFolder = new Folder( resourcePath );

var imagesPath = resourcePath + "Images/";
var imagesFolder = new Folder( imagesPath );

var componentsPath = resourcePath + "components/";
var componentsFolder = new Folder( componentsPath );

var dataPath = resourcePath + "Data/";
var dataFolder = new Folder( dataPath );

var logsPath = resourcePath + "Logs/";
var logsFolder = new Folder( logsPath );

var centralLibraryPath = dataPath + "central_library.js";
var centralLibraryFile = File( centralLibraryPath );

var btLibraryPath = dataPath + "build_template_library.js";
var btLibraryFile = File( btLibraryPath );

var aaSpecialInstructionsFile = File( dataPath + "aa_special_instructions.js" );

var userPathRegex = /(^\/Users\/[^\/]*\/)|(^.*~\/)/i;



//
//deprecated
//
//logs will now be placed into individual user folders
//instead of having one central log file for each script.
//
//log files
var centralLog = new File( dataPath + ".script_logs/central_log.txt" );
var importantLog = new File( dataPath + ".script_logs/important_log.txt" );
var centralErrorLog = new File( dataPath + ".script_logs/error_log.txt" );
var buildMockLog = new File( dataPath + ".script_logs/mockup_builder_log.txt" );
var missingTemplatesLog = new File( dataPath + ".script_logs/converted_templates_needed.txt" );
var changeCodeLog = new File( dataPath + ".script_logs/change_code_log.txt" );
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
// var NBD = netsuiteBuilderDataURL = "https://forms.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=908&deploy=1&compid=460511&h=940572c6865fbbe12e98&designId=";
var NBD = netsuiteBuilderDataURL = "https://460511.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=908&deploy=1&compid=460511&h=940572c6865fbbe12e98&designId=";





//stopwatch object for tracking task durations
var Stopwatch = function ()
{
	this.startTime = 0;
	this.endTime = 0;
	this.taskStart = 0;
	this.taskEnd = 0;
	this.stepLabel = "";

	this.currentTasks = {};

	this.logStart = function ()	
	{
		var curDate = new Date();
		this.startTime = curDate.getTime();
	}
	this.logEnd = function ()
	{
		var curDate = new Date();
		this.endTime = curDate.getTime();
	}
	this.beginTask = function ( label )
	{
		this.currentTasks[ label ] = { "label": label, "taskStart": new Date().getTime(), "taskEnd": undefined };
	}
	this.endTask = function ( label )
	{
		this.currentTasks[ label ].taskEnd = new Date().getTime();
		var stepDuration = this.currentTasks[ label ].taskEnd - this.currentTasks[ label ].taskStart;
		var msg = label + " step took " + stepDuration + " ms.";
		log.l( msg );
	}
	this.getElapsed = function ()
	{
		return "Elapsed Time: " + ( new Date().getTime() - this.startTime );
	}
	this.calculate = function ()
	{
		return ( this.endTime - this.startTime );
	}
}
var scriptTimer = new Stopwatch();
//initiate the start time
scriptTimer.logStart();








function getArea ( item )
{
	var b = getVisibleBounds( item );
	var w = b[ 2 ] - b[ 0 ];
	var h = b[ 1 ] - b[ 3 ];
	return w * h;
}

function getMaxDimension ( item )
{
	// var bounds = getVisibleBounds(item);
	// var bounds = item.visibleBounds;
	var w = item.width;
	var h = item.height;
	return w > h ? w : h;
}


//execute a generic shell script
//just pass in the exact text of the shell script
//no return values. just do a thing, like copy something..
//remove something.. just don't expect anything back
function genericShellScript ( scriptText )
{
	var localScriptPath = documentsPath + "Adobe_Helpers/shell_scripts/";
	var localScriptFolder = new Folder( localScriptPath );
	if ( !localScriptFolder.exists )
	{
		localScriptFolder.create();
	}
	var outputFilePath = localScriptPath + "generic_shell_script_output.txt";
	outputFilePath = outputFilePath.replace( /\s/g, "\\\\ " );
	// scriptText = "do shell script \"" + scriptText + " > " + outputFilePath + "\"";
	scriptText = "do shell script \"" + scriptText + "\"";


	scriptFile = File( localScriptPath + "generic_shell_script.scpt" );
	writeScriptFile( scriptFile, scriptText );
	executor = File( resourcePath + "generic_shell_script.app" );

	var executor = File( resourcePath + "generic_shell_script.app" );

	executor.execute();

	// var outputFile = File(outputFilePath);
	// outputFile.open("r");
	// var outputText = outputFile.read();
	// outputFile.close();


	function writeScriptFile ( file, txt )
	{
		file.open( "w" );
		file.write( txt );
		file.close();
	}
}


function group ( items, parent )
{
	if ( !items.length || !parent )
	{
		return;
	}
	var newGroup = parent.groupItems.add();
	items.backForEach( function ( item )
	{
		item.moveToBeginning( newGroup );
	} )
	return newGroup.pageItems.length ? newGroup : null;
}


//dig through a collection recursively and test each item
//against the callback function. callback function returns boolean
//if true, push the item to the array
function recursiveDig ( item, callback )
{
	var resultingItems = [];

	if ( item.typename.match( /document/i ) )
	{
		alert( "Don't dig recursively through the whole document... figure out a smarter way.." );
		return [];
	}

	dig( item );

	return resultingItems;



	function dig ( item )
	{
		if ( item.typename.match( /group|layer/i ) )
		{
			afc( item, "pageItems" ).forEach( function ( item ) { dig( item ) } );
		}
		else
		{
			if ( callback( item ) )
			{
				resultingItems.push( item );
			}
		}
	}

}



//release all pageItems from this group to a designated parent
//if no parent is specified, the item's parent is used
//digs recursively to move all non-group items to the parent
function ungroupAll ( item, parent )
{
	parent = parent || item.parent;
	item.locked = false;
	parent.locked = false;
	parent.typename == "Layer" ? parent.visible = true : parent.hidden = false;
	afc( item, "pageItems" ).reverse().forEach( function ( i )
	{
		moveItemToParent( i );
	} );

	function moveItemToParent ( item )
	{
		if ( item.typename == "GroupItem" )
		{
			ungroupAll( item, parent );
		}
		else
		{
			item.moveToBeginning( parent );
		}
	}
}

//ungroup function
//item is a groupItem or a layer to be ungrouped
//if a group is passed, only ungroup that group
//if a layer is passed, all layer children are ungrouped
//parent is the layer or group to which the ungrouped items will be moved
//depth is the number of levels of children to ungroup
// if depth is 0, dig recursively through all children and send them to parent
// if depth is greather than zero, continue digging until curDepth == depth
// so if depth is 1, basically just take all the top level pageItems
//callback is an optional function to determine what to do with the lowest level pageItems
//  the items can be deleted, expanded, ignored, or whatever based on their type
//curDepth is the current level of nesting. just leave it undefined in the initial function call
function ungroup ( item, dest, maxDepth, callback, curDepth )
{

	item.locked = item.hidden = false;
	item.visible = true;

	//optional verbose logging for debugging
	if ( 0 )
	{
		log.h( "Beginning of ungroup function:: item = " + item + "::dest = " + dest + "::maxDepth = " + maxDepth + "::callback = " + callback + "::curDepth = " + curDepth );
	}

	if ( item.guides )
	{
		return;
	}

	dest = dest || item.parent;
	maxDepth = maxDepth === undefined ? 1 : maxDepth;
	curDepth = curDepth === undefined ? 1 : ++curDepth;

	var keepDigging = maxDepth === 0 || curDepth <= maxDepth;

	if ( item.typename.match( /layer/i ) || ( item.typename.match( /group/i ) && item.pageItems.length && keepDigging ) )
	{
		afc( item, "pageItems" ).forEach( function ( i )
		{
			if ( !i )
			{
				return;
			}
			ungroup( i, dest, maxDepth, callback, curDepth );
		} );
		return;
		// if(item)
		// {
		// 	item.remove();
		// }
	}

	if ( item.typename.match( /symbol/i ) )
	{
		var tmpBreakSymbolGroup = dest.groupItems.add();
		tmpBreakSymbolGroup.name = "tmpbreaksymbolgroup";
		item.moveToBeginning( tmpBreakSymbolGroup );
		item.breakLink();
		if ( keepDigging )
		{
			ungroup( tmpBreakSymbolGroup, dest, maxDepth, callback, curDepth );
		}
		else
		{
			tmpBreakSymbolGroup.moveToEnd( dest );
		}
		try
		{
			tmpBreakSymbolGroup.remove();
		}
		catch ( e ) { };
		return;
	}

	if ( callback )
	{
		callback( item, dest );
	}
	else
	{
		item.moveToEnd( dest );
	}


	// if ( item && item.typename.match( /group/i ) )
	// {
	// 	// item.remove();
	// 	var leftoverGroupsDest = findSpecificPageItem( dest, "leftovergroups" ) || dest.groupItems.add();
	// 	leftoverGroupsDest.name = "leftovergroups";
	// 	item.duplicate( leftoverGroupsDest, ElementPlacement.PLACEATEND );
	// }


}


// function cleanupCompoundPath ( cp )
// {
// 	cp.parent.locked = cp.parent.hidden = false;
// 	cp.parent.visible = true;
// 	var newCp = cp.parent.compoundPathItems.add();

// }




//string.toTitleCase() 
//prototype function to convert entire string to titlecase
var titleCaseDotRegEx = /((\w\S)|(\w\.))*/g;
String.prototype.toTitleCaseAfterDots = function ()
{
	return this.replace( titleCaseDotRegEx, function ( txt ) { return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase(); } );
};

var titleCaseRegex = /\w\S*/g;
String.prototype.toTitleCase = function ()
{
	return this.replace( titleCaseRegex, function ( txt ) { return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase(); } );
};




//normalize local file path
//due to the strange way home folders are
//determined with our setup, file paths are
//usually rendered incorrectly by using
//a relative path to the home folder. this relative
//path leads to some network version of the user folder
//which is almost never what we want. this function will
//replace the relative file path with a hard coded path
//to the home folder.
function normalizeLocalFilePath ( path )
{
	return path.replace( /(^.*users\/[^\/]*\/)|(^~\/)/i, homeFolderPath );
}

//get unique from array
//pass in an array and this function
//returns only the unique elements
function getUnique ( arr )
{
	var tempResult = {};
	var result = [];

	for ( var x = 0, len = arr.length; x < len; x++ )
	{
		if ( !tempResult[ arr[ x ] ] )
		{
			tempResult[ arr[ x ] ] = 1;
		}
	}

	for ( var item in tempResult )
	{
		if ( !item.match( /extractDesign/i ) )
			result.push( item );
	}
	return result;
}

//////////////
/*

	JSON.stringify method declaration

*/

if ( !this.JSON ) { this.JSON = {} } ( function () { function f ( n ) { return n < 10 ? "0" + n : n } if ( typeof Date.prototype.toJSON !== "function" ) { Date.prototype.toJSON = function ( key ) { return isFinite( this.valueOf() ) ? this.getUTCFullYear() + "-" + f( this.getUTCMonth() + 1 ) + "-" + f( this.getUTCDate() ) + "T" + f( this.getUTCHours() ) + ":" + f( this.getUTCMinutes() ) + ":" + f( this.getUTCSeconds() ) + "Z" : null }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function ( key ) { return this.valueOf() } } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; function quote ( string ) { escapable.lastIndex = 0; return escapable.test( string ) ? '"' + string.replace( escapable, function ( a ) { var c = meta[ a ]; return typeof c === "string" ? c : "\\u" + ( "0000" + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 ) } ) + '"' : '"' + string + '"' } function str ( key, holder ) { var i, k, v, length, mind = gap, partial, value = holder[ key ]; if ( value && typeof value === "object" && typeof value.toJSON === "function" ) { value = value.toJSON( key ) } if ( typeof rep === "function" ) { value = rep.call( holder, key, value ) } switch ( typeof value ) { case "string": return quote( value ); case "number": return isFinite( value ) ? String( value ) : "null"; case "boolean": case "null": return String( value ); case "object": if ( !value ) { return "null" } gap += indent; partial = []; if ( Object.prototype.toString.apply( value ) === "[object Array]" ) { length = value.length; for ( i = 0; i < length; i += 1 ) { partial[ i ] = str( i, value ) || "null" } v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join( ",\n" + gap ) + "\n" + mind + "]" : "[" + partial.join( "," ) + "]"; gap = mind; return v } if ( rep && typeof rep === "object" ) { length = rep.length; for ( i = 0; i < length; i += 1 ) { k = rep[ i ]; if ( typeof k === "string" ) { v = str( k, value ); if ( v ) { partial.push( quote( k ) + ( gap ? ": " : ":" ) + v ) } } } } else { for ( k in value ) { if ( Object.hasOwnProperty.call( value, k ) ) { v = str( k, value ); if ( v ) { partial.push( quote( k ) + ( gap ? ": " : ":" ) + v ) } } } } v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join( ",\n" + gap ) + "\n" + mind + "}" : "{" + partial.join( "," ) + "}"; gap = mind; return v }return v } if ( typeof JSON.stringify !== "function" ) { JSON.stringify = function ( value, replacer, space ) { var i; gap = ""; indent = ""; if ( typeof space === "number" ) { for ( i = 0; i < space; i += 1 ) { indent += " " } } else { if ( typeof space === "string" ) { indent = space } } rep = replacer; if ( replacer && typeof replacer !== "function" && ( typeof replacer !== "object" || typeof replacer.length !== "number" ) ) { throw new Error( "JSON.stringify" ) } return str( "", { "": value } ) } } if ( typeof JSON.parse !== "function" ) { JSON.parse = function ( text, reviver ) { var j; function walk ( holder, key ) { var k, v, value = holder[ key ]; if ( value && typeof value === "object" ) { for ( k in value ) { if ( Object.hasOwnProperty.call( value, k ) ) { v = walk( value, k ); if ( v !== undefined ) { value[ k ] = v } else { delete value[ k ] } } } } return reviver.call( holder, key, value ) } text = String( text ); cx.lastIndex = 0; if ( cx.test( text ) ) { text = text.replace( cx, function ( a ) { return "\\u" + ( "0000" + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 ) } ) } if ( /^[\],:{}\s]*$/.test( text.replace( /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@" ).replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]" ).replace( /(?:^|:|,)(?:\s*\[)+/g, "" ) ) ) { j = eval( "(" + text + ")" ); return typeof reviver === "function" ? walk( { "": j }, "" ) : j } throw new SyntaxError( "JSON.parse" ) } } } )();


//convert a json object to formatted string
function jsonStr ( obj )
{
	var indentor = "  ";
	var curDepth = 0;
	var outputString = "";

	formatObject( obj, true );

	return outputString.replace( /,([\s\n\r]*[\]\}])/ig, "$1" || "," )


	function formatObject ( obj, top )
	{

		var val; // value of the current property

		outputString += "{";
		curDepth++;

		var values = [];
		var keys = [];

		for ( var key in obj )
		{
			if ( key === "" ) continue;

			val = obj[ key ];
			values.push( val );
			keys.push( key );
		}

		values.forEach( function ( val, i )
		{
			if ( top )
			{
				$.writeln( "processing top level object: " + i );
			}
			newLine();
			outputString += "\"" + keys[ i ] + "\": ";
			if ( val instanceof Array )
			{
				formatArray( val );
			}
			else if ( val instanceof Object )
			{
				newLine();
				formatObject( val );
			}
			else
			{
				outputString += "\"" + val + "\",";
			}

		} );
		curDepth--;
		newLine();
		outputString += "}";
		if ( curDepth > 0 )
		{
			outputString += ",";
		}

	}

	function formatArray ( arr, index )
	{
		var subObjects = arr.filter( function ( v ) { return v instanceof Object } );


		if ( subObjects.length )
		{
			//this is a nested array.. put the opening bracket on a new line
			//then call formatObject on each object in the array
			//then put the closing bracket on a new line followed by a comma
			newLine();
			outputString += "[";
			curDepth++;
			// newLine();
			subObjects.forEach( function ( subObject, i )
			{
				newLine();
				subObject instanceof Array ? formatArray( subObject ) : formatObject( subObject );
			} )
			curDepth--;
			newLine();


		}
		else
		{
			//this is a flat array. put the opening bracket on the same line
			//then put each value on the same line split by commas,
			//then put the closing bracket on the same line followed by a comma
			outputString += "[";
			arr.forEach( function ( v, i, thisArr )
			{
				outputString += v.toString() === v ? "\"" + v + "\"" : v + ",";
				// if ( i < thisArr.length - 1 ) outputString += ",";
			} );
		}

		outputString += "],";
		// if ( index < arr.length - 1 ) outputString += ",";
	}



	function newLine ()
	{
		outputString += "\n";
		indent();
	}

	function indent ()
	{
		for ( var i = 0; i < curDepth; i++ )
		{
			outputString += indentor;
		}
	}
}

//replacer function for the JSON.stringify() method
//this ensures that any arrays in the object are printed
//on one line instead of each element on a new line
function jsonArrayOnOneLineReplacerFunction ( k, v )
{
	if ( v instanceof Array )
	{
		return "[" + v.join( ", " ) + "]";
	}
	else if ( k === "" && !( v instanceof Object ) )
	{
		return undefined;
	}
	else
	{
		return v;
	}
}





function intersects ( item, dest )
{
	//item coordinates
	var IL = item.left;
	var IT = item.top;
	var IR = item.left + item.width;
	var IB = item.top - item.height;


	//dest coordinates
	if ( dest.typename === "Artboard" )
	{
		var rect = dest.artboardRect;
		var DL = rect[ 0 ];
		var DT = rect[ 1 ];
		var DR = rect[ 2 ];
		var DB = rect[ 3 ];
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
	return !( IL > DR || IR < DL || IT < DB || IB > DT );

}

function isContainedWithin ( item, dest )
{
	var vb = getBoundsData( item );
	var IL = vb.left;
	var IT = vb.top;
	var IR = vb.right
	var IB = vb.bottom;

	var dvb = getBoundsData( dest );
	var DL = dvb.left;
	var DT = dvb.top;
	var DR = dvb.right;
	var DB = dvb.bottom;

	return ( IL >= DL && IR <= DR && IT <= DT && IB >= DB );

	// //item coordinates
	// var IL = item.left;
	// var IT = item.top;
	// var IR = item.left + item.width;
	// var IB = item.top - item.height;

	// //dest coordinates
	// if ( dest.typename === "Artboard" )
	// {
	// 	var rect = dest.artboardRect;
	// 	var DL = rect[ 0 ];
	// 	var DT = rect[ 1 ];
	// 	var DR = rect[ 2 ];
	// 	var DB = rect[ 3 ];
	// }
	// else
	// {
	// 	var DL = dest.left;
	// 	var DT = dest.top;
	// 	var DR = dest.left + dest.width;
	// 	var DB = dest.top - dest.height;
	// }

	// return ( IL >= DL && IR <= DR && IT <= DT && IB >= DB );
}

function isContainedWithinBuffer ( item, dest, buffer )
{
	//item coordinates
	var IL = item.left;
	var IT = item.top;
	var IR = item.left + item.width;
	var IB = item.top - item.height;

	//dest coordinates
	if ( dest.typename === "Artboard" )
	{
		var rect = dest.artboardRect;
		var DL = rect[ 0 ];
		var DT = rect[ 1 ];
		var DR = rect[ 2 ];
		var DB = rect[ 3 ];
	}
	else
	{
		var DL = dest.left;
		var DT = dest.top;
		var DR = dest.left + dest.width;
		var DB = dest.top - dest.height;
	}

	if ( !buffer ) buffer = 0;

	return ( IL >= DL - buffer && IR <= DR + buffer && IT <= DT + buffer && IB >= DB - buffer );
}

function findParentArtboard ( item, artboards )
{
	var result;
	for ( var x = 0, len = artboards.length; x < len; x++ )
	{
		if ( isContainedWithin( item, artboards[ x ] ) )
		{
			result = x;
		}
	}
	return result;
}


function zoomOutToRevealAllArtwork ()
{
	var doc = app.activeDocument;
	var layers = doc.layers;
	var bounds = [];

	//get an array of the layers in the document
	//and execute the dig() function on each one.
	afc( doc, "layers" ).forEach( function ( layer ) 
	{
		if ( layer.locked ) return;
		dig( layer )
	} );

	//separate the bounds into individual arrays
	var leftBounds = bounds.map( function ( bound ) { return bound[ 0 ] } );
	var topBounds = bounds.map( function ( bound ) { return bound[ 1 ] } );
	var rightBounds = bounds.map( function ( bound ) { return bound[ 2 ] } );
	var bottomBounds = bounds.map( function ( bound ) { return bound[ 3 ] } );


	var allArtBounds = [
		Math.min.apply( null, leftBounds ),
		Math.max.apply( null, topBounds ),
		Math.max.apply( null, rightBounds ),
		Math.min.apply( null, bottomBounds )
	];

	var artboard = doc.artboards.add( allArtBounds );
	app.executeMenuCommand( "fitall" );
	artboard.remove();

	//dig recursively through layers and add the bounds
	//of each visible art item to the bounds array
	function dig ( layer )
	{
		if ( !layer.visible ) return;
		//copy all the bounds of the art items in this layer
		afc( layer, "pageItems" ).forEach( function ( item )
		{
			if ( !item.hidden && !item.guides )
			{
				bounds.push( item.visibleBounds );
			}
		} );

		//dig through any sublayers
		afc( layer, "layers" ).forEach( function ( subLayer )
		{
			dig( subLayer );
		} );
	}
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

function printBounds ()
{
	var result = [];
	if ( !app.documents.length )
	{
		alert( "OPEN A DOCUMENT!" );
		return;
	}
	var docRef = app.activeDocument;
	var sel = docRef.selection;
	var buffer = 3;
	if ( sel.length === 1 )
	{
		sel = docRef.selection[ 0 ];
		result = [ sel.left, sel.top, sel.left + sel.width, sel.top - sel.height ];
	}
	else if ( sel.length > 1 )
	{
		var l, t, r, b;
		for ( var x = 0, len = sel.length; x < len; x++ )
		{
			if ( x > 0 )
			{
				if ( sel[ x ].left < l )
					l = sel[ x ].left;
				if ( sel[ x ].top > t )
					t = sel[ x ].top;
				if ( sel[ x ].left + sel[ x ].width > r )
					r = sel[ x ].left + sel[ x ].width;
				if ( sel[ x ].top - sel[ x ].height < b )
					b = sel[ x ].top - sel[ x ].height;
			}
			else
			{
				l = sel[ x ].left;
				t = sel[ x ].top;
				r = sel[ x ].left + sel[ x ].width;
				b = sel[ x ].top - sel[ x ].height;
			}

		}
		result = [ l, t, r, b ];
	}
	else
	{
		alert( "MAKE A SELECTION!!" );
	}

	if ( result )
	{
		result[ 0 ] -= buffer;
		result[ 1 ] += buffer;
		result[ 2 ] += buffer;
		result[ 3 ] -= buffer;
	}

	$.writeln( "[" + result + "];" )
}

// function getCode(layer)
// {
// 	var layName = layer.name;
// 	var pat = /(.*)([-_][\d]{3,}([-_][a-z])?)/i;

// 	return layName.match(pat)[1];
// }

function getRandom ( min, max )
{
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

function findChildByName ( parent, type, name )
{
	var result;
	var nameRegex = new RegExp( "^" + name + "$", "i" );
	var children = afc( parent, type ).filter( function ( child ) { return child.toString().match( nameRegex ) } );

	result = children[ 0 ] || null;
	return result;
}

//display a dialog with a listbox populated
//with an array of items. Return the selected
//items as an array
function chooseFromListbox ( items, msg, size )
{
	if ( !size )
	{
		size = [ 50, 50, 200, 200 ];
	}
	var result = [];
	var cfl = new Window( "dialog", "Choose the desired item(s)" );
	var topTxt = UI.static( cfl, msg );
	var topTxt2 = UI.static( cfl, "Use Control/Command to select multiple items." );
	var lbGroup = UI.group( cfl );
	var lb = UI.listbox( lbGroup, size, items, { multiselect: true } );

	var btnGroup = UI.group( cfl );
	var cancel = UI.button( btnGroup, "Cancel", function ()
	{
		result = undefined;
		cfl.close();
	} )
	var allBtn = UI.button( btnGroup, "Choose All", function ()
	{
		for ( var x = 0, len = lb.items.length; x < len; x++ )
		{
			result.push( lb.items[ x ].text )
		}
		cfl.close();
	} )
	var submit = UI.button( btnGroup, "Submit", function ()
	{
		if ( lb.selection && lb.selection.length )
		{
			result = lb.selection.map( function ( a ) { return a.text } );
		}
		else
		{
			alert( "Please make a selection." );
			return;
		}
		cfl.close();
	} )

	cfl.show();
	return result;
}


function graphicStyleFromItem ( item, name )
{
	app.activeDocument.selection = null;
	item.selected = true;
	createAction( "graphic_style_from_selection", GRAPHIC_STYLE_FROM_SELECTION_ACTION_STRING );

	app.doScript( "graphic_style_from_selection", "graphic_style_from_selection" );
	app.activeDocument.graphicStyles[ app.activeDocument.graphicStyles.length - 1 ].name = name;
	app.redraw();

	removeAction( "graphic_style_from_selection" );
}

/*
	Component Name: reset_graphic_styles_to_param_blocks
	Author: William Dowling
	Creation Date: 5 February, 2018
	Description: 
		use the given paramLayer to reset
		the graphic styles to match the style
		and name of each paramBlock on the paramLayer
	Arguments
		paramLayer
			layer object on the mockup layer of the first 
			garment in the document. 

			this layer holds the paramcolor blocks that hold
			the color information for the garment
	Return value
		success boolean

*/
function resetGraphicStylesToParamBlocks ( paramLayer )
{
	var doc = app.activeDocument;

	//check to make sure there's a valid param layer before
	//removing the existing graphic styles
	if ( !paramLayer || paramLayer.pageItems.length === 0 )
	{
		log.e( "paramLayer was undefined." );
		return false;
	}



	//first, delete any graphic styles that exist.
	//then replace them with graphic styles created
	//directly from the param blocks. this way we'll be
	//guaranteed to have the correct graphic styles
	// for(var x = uvFile.graphicStyles.length-1;x>=0;x--)
	// {
	// 	uvFile.graphicStyles[x].remove();
	// }

	//load the "create graphic style" action
	createAction( "graphic_style_from_selection", GRAPHIC_STYLE_FROM_SELECTION_ACTION_STRING );


	//loop the paramLayer pageItems 
	var curBlock, curName, gs;
	for ( var x = paramLayer.pageItems.length - 1; x >= 0; x-- )
	{
		doc.selection = null;
		curBlock = paramLayer.pageItems[ x ];
		curName = curBlock.name.replace( "paramcolor-", "" );

		if ( curBlock.name.indexOf( "param" ) === -1 )
		{
			curBlock.remove();
			continue;
		}


		gs = findSpecificGraphicStyle( doc, curName );
		if ( gs )
		{
			gs.remove();
		}

		curBlock.selected = true;



		app.doScript( "graphic_style_from_selection", "graphic_style_from_selection" );
		doc.graphicStyles[ doc.graphicStyles.length - 1 ].name = curName;
		app.redraw();
	}

	removeAction( "graphic_style_from_selection" );
	return true;
}

function findCharacterStyle ( name )
{
	return afc( app.activeDocument, "characterStyles" ).filter( function ( cs )
	{
		return cs.name === name
	} )[ 0 ] || undefined;
}

function createCharacterStyle ( name, attr, overwrite )
{
	var exCharStyle = findCharacterStyle( name );

	if ( exCharStyle && !overwrite )
	{
		return exCharStyle;
	}

	var newCharStyle = exCharStyle || app.activeDocument.characterStyles.add( name );

	for ( var prop in attr )
	{
		newCharStyle[ prop ] = attr[ prop ];
	}

	return newCharStyle;
}


function findSpecificGraphicStyle ( doc, name )
{
	var result;
	for ( var x = 0; x < doc.graphicStyles.length && !result; x++ )
	{
		if ( doc.graphicStyles[ x ].name === name )
		{
			result = doc.graphicStyles[ x ]
		}
	}
	return result;
}

function findSpecificSwatch ( doc, name )
{
	var result;
	for ( var x = 0; x < doc.swatches.length && !result; x++ )
	{
		if ( doc.swatches[ x ].toString() === "[Swatch " + name + "]" )
		{
			result = doc.swatches[ x ];
		}
	}
	return result;
}

function findLayersByName ( parent, name, crit )
{
	var result = [];

	crit = crit || "any";

	var regex;
	if ( crit === "any" )
	{
		regex = new RegExp( name, "i" );
	}
	else if ( crit === "imatch" )
	{
		regex = new RegExp( "^" + name + "$", "i" );
	}
	else if ( crit === "match" )
	{
		regex = new RegExp( "^" + name + "$" );
	}

	afc( parent, "layers" ).forEach( function ( lay )
	{
		if ( regex.test( lay.name ) )
		{
			result.push( lay );
		}
	} );

	return result;
}


//find a specific layer inside a given parent
//parent can be a document or a layer
//search term can be a string or a regex
function findSpecificLayer ( parent, searchTerm, crit )
{
	if ( !parent ) return;
	if ( !parent.typename.match( /layer|docum/i ) )
	{
		$.writeln( "findSpecificLayer: invalid parent type: " + parent.typename + "." );
		return;
	}
	//if the parent given was a "layers" collection, use the parent.parent instead
	//since we're just going to access the layers collection below anyway.
	//this way we always have a clean parent that at least has the potential
	//to have a layers collection.
	parent = parent.typename.match( /layers/i ) ? parent.parent : parent;

	var result;

	if ( typeof searchTerm === "string" )
	{
		//search term is a string. convert it to a regex based on the crit given
		var matchPats = {
			"any": new RegExp( searchTerm, "i" ),
			"imatch": new RegExp( "^" + searchTerm + "$", "i" ),
			"match": new RegExp( "^" + searchTerm + "$" )
		}
		searchTerm = matchPats[ crit || "any" ];
	}



	var layers = afc( parent, "layers" );

	result = layers.filter( function ( layer )
	{
		return layer.name.match( searchTerm );
	} )

	if ( result && result.length > 0 )
	{
		result = result[ 0 ];
	}
	else
	{
		result = undefined;
	}


	return result;
}

//parent = container object
//searchTerm = string or regex
//[crit] = string representing criteria for a match
//	"match" means the entire name must match exactly
//	"imatch" means name must match, but case doesn't matter
//	"any" means itemName must exist somewhere
//return a single object or undefined
function findSpecificPageItem ( parent, searchTerm, crit )
{
	if ( !parent )
	{
		log.e( "undefined parent" );
	}
	else if ( !parent.pageItems )
	{
		log.e( "parent has no pageItems" );
	}

	if ( typeof searchTerm === "string" )
	{
		//search term is a string. convert it to a regex based on the crit given
		var matchPats = {
			"any": new RegExp( searchTerm, "i" ),
			"imatch": new RegExp( "^" + searchTerm + "$", "i" ),
			"match": new RegExp( "^" + searchTerm + "$" )
		}
		searchTerm = matchPats[ crit || "any" ];
	}



	var items = afc( parent, "pageItems" );

	result = items.filter( function ( item )
	{
		return item.name.match( searchTerm );
	} )

	if ( result && result.length > 0 )
	{
		result = result[ 0 ];
	}
	else
	{
		result = undefined;
	}

	return result;



	// var result = [], curItem;
	// if ( parent.pageItems.length )
	// {
	// 	for ( var x = 0, len = parent.pageItems.length; x < len; x++ )
	// 	{
	// 		curItem = parent.pageItems[ x ];
	// 		if ( crit )
	// 		{
	// 			if ( crit === "match" && curItem.name === searchTerm )
	// 			{
	// 				result.push( curItem );
	// 			}
	// 			else if ( crit === "imatch" && curItem.name.toLowerCase() === searchTerm.toLowerCase() )
	// 			{
	// 				result.push( curItem );
	// 			}
	// 			else if ( crit === "any" && curItem.name.toLowerCase().indexOf( searchTerm.toLowerCase() ) > -1 )
	// 			{
	// 				result.push( curItem );
	// 			}
	// 		}
	// 		else if ( curItem.name.indexOf( searchTerm ) > -1 )
	// 		{
	// 			result.push( curItem );

	// 		}
	// 	}
	// }

	// if ( result.length )
	// {
	// 	// if(result.length > 1)
	// 	// {
	// 	// 	var msg = parent + " has multiple items matching the name " + itemName;
	// 	// 	result = chooseFromListbox(result,msg);
	// 	// }
	// 	result = result[ 0 ];
	// }
	// else
	// {
	// 	result = undefined;
	// }

	// return result;
}



//parent = container object
//itemName = string
//[crit] = string representing criteria for a match
//"match" means the entire name must match exactly
//"imatch" means name must match, but case doesn't matter
//"any" means itemName must exist somewhere
//return an array of objects that matched the criteria
function findAllPageItems ( parent, itemName, crit )
{
	var result = [], curItem;
	if ( parent.pageItems.length )
	{
		for ( var x = 0, len = parent.pageItems.length; x < len; x++ )
		{
			curItem = parent.pageItems[ x ];
			if ( crit )
			{
				if ( crit === "match" && curItem.name === itemName )
				{
					result.push( curItem );
				}
				else if ( crit === "imatch" && curItem.name.toLowerCase() === itemName.toLowerCase() )
				{
					result.push( curItem );
				}
				else if ( crit === "any" && curItem.name.toLowerCase().indexOf( itemName.toLowerCase() ) > -1 )
				{
					result.push( curItem );
				}
			}
			else if ( curItem.name.indexOf( itemName ) > -1 )
			{
				result.push( curItem );

			}
		}
	}

	return result;
}



//dig through the parent object recursively to find
//something of a specified type and name
function findSpecificItem ( parent, itemType, name )
{

	var resultItem;
	for ( var i = 0, len = parent.pageItems.length; i < len && !resultItem; i++ )
	{
		dig( parent.pageItems[ i ] )
	}

	return resultItem;

	function dig ( item )
	{
		if ( item.name === name )
		{
			resultItem = item;
			return;
		}
		if ( item.typename === "GroupItem" )
		{
			for ( var t = 0, len = item.pageItems.length; t < len && !resultItem; t++ )
			{
				if ( item.pageItems[ t ].name === name )
				{

					resultItem = item.pageItems[ t ];
				}
				else
				{
					dig( item.pageItems[ t ] );
				}
			}
		}
	}

}


//get an array of the currently selected objects
function getSel ()
{
	return afc( app.activeDocument, "selection" );
}



//array from object
//intended for getting an array of json objects out of a parent json object

function afo ( obj )
{
	var arr = [];
	for ( var x in obj )
	{
		// arr.push( { x: obj[ x ] } );
		arr.push( obj[ x ] );
	}
	return arr;
}



//container: container object that holds the child items   
//viable options: App, Layer, Doument, GroupItem, CompoundPathItem
//childType: string representing the type of collection to arrayify
//viable options:   "pageItems", "layers", "pathItems", "compoundPathItems", 
//                  "groupItems", "swatches", "textFonts", "textFrames", "placedItems",
//                  "rasterItems", "symbolItems", "pluginItems", "artboards", "selection"
//					"characterStyles", "paragraphStyles", "brushes"

function afc ( container, childType )
{
	if ( !container ) return [];
	var result = [];
	var ctn = container.typename;



	var defaultChildTypes = { "document": "layers", "swatchgroup": "swatches", "layer": "pageItems", "groupitem": "pageItems", "compoundpathitem": "pathItems", "textframe": "textRanges" }

	var defaultChildType = defaultChildTypes[ ctn.toLowerCase() ];
	if ( !childType )
	{
		// log.l( "no childType specified, using default: " + defaultChildType );
	}
	childType = childType || defaultChildType;
	if ( !container[ childType ] )
	{
		$.writeln( "ERROR: afc(" + container.name + "," + childType + ");" );
		$.writeln( "Can't make array from this container. Invalid child item type: " + childType );
		return [];
	}

	var items = container[ childType ];
	for ( var x = 0; x < items.length; x++ )
	{
		result.push( items[ x ] )
	}
	return result;
}
//alternate more verbose function name for easier code reading maybe?
function arrayFromContainer ( container, crit )
{
	return afc( container, crit );
}





//loop all the parent layers in the document
//and hide any prepress layers
function hidePPLay ()
{
	var doc = app.activeDocument;
	var layers = doc.layers;
	var ppLay;
	for ( var p = 0, len = layers.length; p < len; p++ )
	{
		ppLay = getPPLay( layers[ p ] );
		if ( ppLay )
		{
			for ( var s = 0, sLen = ppLay.layers.length; s < sLen; s++ )
			{
				ppLay.layers[ s ].visible = true;
				ppLay.layers[ s ].locked = false;
			}
			ppLay.visible = false;
		}
	}
}

function getPPLay ( parent )
{
	var result, len, lay, subLay, subLayLen;
	var pat = /^[a-z]*[-_].*/i;

	if ( parent.typename === "String" )
	{
		parent = app.activeDocument.layers[ parent ];
	}

	if ( parent.typename === "Layers" )
	{
		//parent = activeDocument.layers
		//search the entire document for a garment layer
		//then try to find a prepress layer within that garment layer
		len = parent.length;
		for ( var x = 0; x < len && !result; x++ )
		{
			lay = parent[ x ];
			if ( pat.test( lay.name ) )
			{
				subLayLen = lay.layers.length;
				for ( var y = 0; y < subLayLen && !result; y++ )
				{
					subLay = lay.layers[ y ];
					if ( subLay.name === "Prepress" && subLay.layers.length > 0 && subLay.layers[ 0 ].pageItems.length > 0 )
					{
						result = subLay;
					}
				}
			}
		}
	}
	else if ( parent.typename === "Layer" )
	{
		//parent = specific document layer
		//search a specific layer for a prepress layer
		//this condition requires a specific garment
		//layer to be passed as an argument

		if ( pat.test( parent.name ) )
		{
			len = parent.layers.length;
			for ( var x = 0; x < len && !result; x++ )
			{
				subLay = parent.layers[ x ];
				if ( subLay.name === "Prepress" && subLay.layers.length )
				{
					result = subLay;
				}
			}
		}

	}
	return result;
}


//for every layer in the active document
//look for a prepress layer, 
function touchEveryPrepressItem ( func )
{
	if ( !app.documents.length ) return false;

	var doc = app.activeDocument;
	var layers = doc.layers;


	var ppLay;
	var curLay;
	var curPpLay;
	var curPpItem
	for ( var x = 0; x < layers.length; x++ )
	{
		curLay = layers[ x ];
		ppLay = findSpecificLayer( curLay, "Prepress", "imatch" );
		if ( !ppLay ) continue;

		for ( var y = 0; y < ppLay.layers.length; y++ )
		{
			curPpLay = ppLay.layers[ y ];
			for ( var z = 0; z < curPpLay.pageItems.length; z++ )
			{
				curPpItem = curPpLay.pageItems[ z ];
				func( curPpItem );
			}
		}
	}


}






function coord ( ppLay )
{
	var coords = {};
	var curSize, thisPiece, pieceName;
	var ppLen = ppLay.layers.length;
	var subLen;
	var curBounds;

	if ( ppLen > 0 && ppLay.layers[ 0 ].pageItems.length > 0 )
	{
		for ( var a = 0; a < ppLay.layers.length; a++ )
		{
			curSize = ppLay.layers[ a ].name;
			coords[ curSize ] = {};
			subLen = ppLay.layers[ a ].groupItems.length;
			for ( var b = 0; b < subLen; b++ )
			{
				thisPiece = ppLay.layers[ a ].groupItems[ b ];
				curBounds = getVisibleBounds( thisPiece );
				pieceName = thisPiece.name;
				coords[ curSize ][ pieceName ] = [];
				coords[ curSize ][ pieceName ][ 0 ] = ( Math.floor( curBounds[ 0 ] * 1000 ) / 1000 );
				coords[ curSize ][ pieceName ][ 1 ] = ( Math.floor( curBounds[ 1 ] * 1000 ) / 1000 );
			}
		}
		return coords;
	}
	else
	{
		return false;
	}
}

function getCode ( layName )
{
	var pat = /(.*)([-_][a-z\d]{3,}([-_][a-z])?)/i;
	// var underscorePat = /([fpb][dsm])[_]/i;
	var underscorePat = /([a-z]*)[_]/i;
	var result = layName.match( pat )[ 1 ];
	while ( result.match( underscorePat ) )
	{
		result = result.replace( underscorePat, result.match( underscorePat )[ 1 ] + "-" );
	}
	return result;
}

function getStyleNum ( layName )
{
	var pat = /(.*)[-_]([a-z\d]{3,}([-_][a-z])?)/i;
	return layName.match( pat )[ 2 ];
}


//sendErrors Function Description
//Display any errors to the user in a preformatted list
function sendErrors ( errorList )
{
	alert( "The Following Errors Occurred:\n" + errorList.join( "\n" ) );
}


//sendScriptMessages function description
//display any messages generated by teh script to the user
//these will be instances where the user should be warned or alerted
//in some way, but they are not necessarily errors
//this could also be used for apologies. =)
function sendScriptMessages ( messageList )
{
	alert( "The script sent the following messages:\n" + messageList.join( "\n" ) );
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
function includeComponents ( dev, prod, ignorePrompt )
{
	var result;
	var compFolder, comps, thisComp;

	if ( user.toLowerCase() === "will.dowling" )
	{
		if ( ignorePrompt )
		{
			compFolder = new Folder( dev );
		}
		else
		{
			var w = new Window( "dialog", "Which components?" );
			var btnGroup = w.add( "group" );
			btnGroup.orientation = "column";
			var devBtn = btnGroup.add( "button", undefined, "Development" );
			devBtn.onClick = function ()
			{
				compFolder = new Folder( dev );
				w.close();
			}
			var prodBtn = btnGroup.add( "button", undefined, "Production" );
			prodBtn.onClick = function ()
			{
				compFolder = new Folder( prod );
				w.close();
			}
			var cancel = btnGroup.add( "button", undefined, "Cancel" );
			cancel.onClick = function ()
			{
				w.close();
			}
			w.show();
		}
	}
	else
	{
		compFolder = new Folder( prod );
	}

	if ( compFolder )
	{
		result = [];
		comps = compFolder.getFiles();
		var len = comps.length;
		for ( var c = 0; c < len; c++ )
		{
			if ( comps[ c ].name.indexOf( "js" ) > -1 )
			{
				result.push( comps[ c ] );
			}
		}
	}

	return result;
}



function getComponents ( path )
{
	var result = [];
	var compFolder, comps, thisComp;

	compFolder = new Folder( path );

	if ( compFolder && compFolder.exists )
	{
		comps = compFolder.getFiles();
		var len = comps.length;
		for ( var c = 0; c < len; c++ )
		{
			if ( comps[ c ].name.indexOf( "js" ) > -1 )
			{
				result.push( comps[ c ] );
			}
		}
	}
	else
	{
		errorList.push( "No components folder at: " + path );
	}

	if ( !result.length )
	{
		errorList.push( "No components found at: " + path );
	}
	return result;
}


//generic function to check for proper .ai[t] extension
//to be used with Folder.getFiles(isAiFile) method and
//Folder.openDlg("Title",isAiFile) method.
function isAiFile ( file )
{
	var aiPat = /.ai[t]?$/i;
	return aiPat.test( file.name );
}

//generic function to check for proper .ai[t] extension
//to be used with Folder.getFiles(isAiFile) method and
//Folder.openDlg("Title",isAiFile) method.
function isAiFileOrFolder ( file )
{
	var aiPat = /.ai[t]?$/i;
	return ( file instanceof Folder || aiPat.test( file.name ) );
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
function unlockDoc ( doc )
{
	doc.activate();
	log.h( "unlockDoc(" + doc.name + ")" );
	var result = true;

	var layers = doc.layers;
	var layLen = layers.length;
	for ( var ll = 0; ll < layLen; ll++ )
	{
		try
		{
			layers[ ll ].locked = false;
			layers[ ll ].visible = true;
			log.l( "layer " + layers[ ll ].name + " successfully revealed." );
		}
		catch ( e )
		{
			errorList.push( "Failed to unlock or un-hide the layer: \"" +
				layers[ ll ].name + "\", which was layer # " + ( ll + 1 ) + " of " + doc.name );

			log.e( "Failed to unlock or un-hide the layer: \"" +
				layers[ ll ].name + "\", which was layer # " + ( ll + 1 ) + " of " + doc.name +
				"::System error message was: " + e );

			result = false;
		}
	}
	try
	{
		app.executeMenuCommand( "unlockAll" );
		app.executeMenuCommand( "showAll" );
		log.l( "Successfully executed 'unlockAll' and 'showAll' menu commands." );
	}
	catch ( e )
	{
		errorList.push( "Failed while executing menu commands to unlock and unhide all sublayers and objects." );
		log.e( "Failed while executing menu commands to unlock and unhide all sublayers and objects.::System error message was: " + e );
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

function properTemplateSetup ( doc )
{
	log.h( "properTemplateSetup(" + doc.name + ")" );
	var result = true;

	doc.activate();

	var layers = doc.layers;
	var layLen = layers.length;
	// var garPat = /^[a-z]{2}[-_]/i;
	var garPat = /^[a-z]*[-_]/i;
	var thisLay, thisSubLay, layInfo;
	var templateLayers =
	{
		"Artwork Layer":
		{
			"locked": false,
			"visible": true
		},
		"Mockup":
		{
			"locked": false,
			"visible": true
		},
		"Prepress":
		{
			"locked": false,
			"visible": false
		},
		"Information":
		{
			"locked": true,
			"visible": true
		},
		"USA Collars":
		{
			"locked": true,
			"visible": false
		}

	}

	for ( var x = layLen - 1; x >= 0; x-- )
	{
		thisLay = layers[ x ];
		if ( garPat.test( thisLay.name ) )
		{
			log.l( "Looping sub layers for layer: " + thisLay.name );
			for ( var lay in templateLayers )
			{
				try
				{
					log.l( "Attempting to process the layer: " + lay );
					thisSubLay = thisLay.layers[ lay ];
					layInfo = templateLayers[ lay ];
					thisSubLay.locked = layInfo.locked;
					thisSubLay.visible = layInfo.visible;
					log.l( "Successfully set " + lay + " to " );
				}
				catch ( e )
				{
					log.l( "Failed to process " + lay );
				}
			}
		}
		else
		{
			try
			{
				thisLay.zOrder( ZOrderMethod.SENDTOBACK );
				thisLay.locked = true;
				thisLay.visible = true;

				log.l( "Sent " + thisLay.name + " to back." );
			}
			catch ( e )
			{
				log.e( "Failed to process " + thisLay.name + "::System error message: " + e );
			}
		}
	}

	log.l( "properTemplateSetup result = " + result );
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

function isTemplate ( parent )
{
	log.h( "Checking to see whether " + parent + " is a proper converted template." );

	var result = true,
		art,
		info,
		mock,
		prepress,
		searchLayer;

	if ( parent.typename === "Document" )
	{
		searchLayer = parent.layers[ 0 ];
	}
	else if ( parent.typename === "Layer" )
	{
		searchLayer = parent;
	}

	//Try/Catch Description:
	//set variables for known template layers
	//if they don't exist, it's not a template
	try
	{
		art = searchLayer.layers[ "Artwork Layer" ];
		info = searchLayer.layers[ "Information" ];
		mock = searchLayer.layers[ "Mockup" ];
		prepress = searchLayer.layers[ "Prepress" ];
		log.l( parent + " is a proper template. returning true" );
	}
	catch ( e )
	{
		//this doc is not a converted template.
		//setting srcIsTemplate to false
		result = false;

		if ( e.toString().indexOf( "MRAP" ) > -1 )
		{
			log.l( "MRAP error occurred." )
			errorList.push( "Failed to determine whether this file was a proper converted template because of an MRAP error." );
			errorList.push( "Please restart Illustrator and try again." );
		}
		else
		{
			log.l( parent + " is NOT a template.::Results of isTemplate function are as follows:" );
		}

		log.l( "art = " + art );
		log.l( "info = " + info );
		log.l( "mock = " + mock );
		log.l( "prepress = " + prepress + "\n\n" );
	}

	return result
}

function writeDatabase ( dbPath, contents )
{
	var dbFile = File( dbPath )
	dbFile.open( "w" );
	dbFile.write( contents );
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

function writeReadMe ( dest, msg )
{
	var result = true;
	if ( !dest.exists )
	{
		try
		{
			dest.create();
		}
		catch ( e )
		{
			errorList.push( "Failed to create destination folder at the following location:\n" + dest.fullName );
			return false;
		}
	}

	var readMeFile = new File( dest.fullName + "/READ_ME.txt" );
	//get any existing contents of the file to avoid overwriting
	readMeFile.open();
	var contents = readMeFile.read();
	readMeFile.close();

	//write the new read me message
	readMeFile.open( "w" );
	readMeFile.write( contents + logTime() + ": " + msg + "\n\n" );
	readMeFile.close();

}



//Alignment Functions
//
//given a key object and an an array of path items
//key : any pageItem
//otherObjects: Array of page items to align

//Known Issues:
// If you use these on items with clipping masks, the resulting
// alignment will be mathematically correct, but will likely be
// visually incorrect. This is because Illustrator includes clipped
// art in the dimensions of an object. =(




//align all elements of the array to the key object's center point
function alignObjectsToCenter ( key, otherObjects )
{
	var kp = [ key.left + key.width / 2, key.top - key.height / 2 ];

	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].left = kp[ 0 ] - otherObjects[ x ].width / 2;
		otherObjects[ x ].top = kp[ 1 ] + otherObjects[ x ].height / 2;
	}
}

//align all objects' vertical centers to the vertical center of key
function vAlignCenter ( key, otherObjects )
{
	var kp = key.top - key.height / 2;

	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].top = kp + otherObjects[ x ].height / 2;
	}
}

//align all objects to the top of key
function vAlignTop ( key, otherObjects )
{
	var kp = key.top;

	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].top = kp;
	}
}

//align all ojects to the bottom of key
function vAlignBottom ( key, otherObjects )
{
	var bounds = getBoundsData( key );
	var kp = bounds.b;

	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].top = kp + getBoundsData( otherObjects[ x ] ).h;
	}
}

//align all objects' center points to center point of key
function hAlignCenter ( key, otherObjects )
{
	var kp = key.left + key.width / 2;
	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].left = kp - otherObjects[ x ].width / 2;
	}
}

//align all objects to the left edge of key
function hAlignLeft ( key, otherObjects )
{
	var kp = key.left;
	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].left = kp;
	}
}

// align all objects to the right edge of key
function hAlignRight ( key, otherObjects )
{
	var kp = key.left + key.width;
	for ( var x = 0; x < otherObjects.length; x++ )
	{
		otherObjects[ x ].left = kp - otherObjects[ x ].width;
	}
}



//send customized emails

function sendCustomEmail ( emailAddress, subject, msg )
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
	var tempScript = File( homeFolderPath + "/send_email.scpt" );
	tempScript.open( "w" );
	tempScript.write( scriptText.join( "\n" ) );
	tempScript.close();

	//run the executor script
	var executor = File( resourcePath + "send_email.app" );
	executor.execute();
}


/**********************/
/******UI Components***/
/**********************/

var STANDARD_LISTBOX_DIMENSIONS = [ 50, 50, 200, 200 ]
var UI =
{
	"window": function ( title, func )
	{
		var w = new Window( "dialog", title );

		w.addEventListener( "keydown", function ( k )
		{
			if ( k.keyName == "Enter" )
			{
				func();
			}
		} );

		return w;
	},
	"static": function ( parent, txt, len )
	{
		var result = parent.add( "statictext", undefined, txt );
		if ( len )
		{
			result.characters = len;
		}
		return result;
	},

	"edit": function ( parent, txt, len, func )
	{
		var result = parent.add( "edittext", undefined, txt );
		if ( len )
		{
			result.characters = len;
		}
		return result;
	},

	"group": function ( parent )
	{
		return parent.add( "group" );
	},
	"panel": function ( parent, title )
	{
		return parent.add( "panel", title );
	},

	"checkbox": function ( parent, txt, len )
	{
		var result = parent.add( "checkbox", undefined, txt );
		if ( len )
		{
			result.characters = len;
		}
		return result;
	},

	"button": function ( parent, txt, func, opt )
	{
		var result = parent.add( "button", undefined, txt, opt );
		if ( func )
		{
			result.onClick = func;
		}
		return result;
	},

	//img is a string representing absolute file path
	//to the image file
	//example:
	//var img = "/Volumes/Customization/Library/Scripts/Script Resources/Images/all.jpg";
	"iconButton": function ( parent, img, func )
	{
		var result = parent.add( "iconButton", undefined, img );
		if ( func )
		{
			result.onClick = func;
		}
		return result;
	},

	"image": function ( parent, img, func )
	{
		var result = parent.add( "image", undefined, File( img ) );
		if ( func )
		{
			result.onClick = func;
		}
		return result;
	},

	"listbox": function ( parent, dimensions, children, resourceString )
	{
		if ( !dimensions )
		{
			dimensions = STANDARD_LISTBOX_DIMENSIONS;
		}
		var result = parent.add( "listbox", dimensions, [], resourceString );
		if ( children )
		{
			for ( var x = 0, len = children.length; x < len; x++ )
			{
				result.add( "item", children[ x ] );
			}
		};
		return result;
	},

	"radio": function ( parent, txt, len )
	{
		var result = parent.add( "radiobutton", undefined, txt );
		if ( len )
		{
			result.characters = len;
		}
		return result;
	},

	"dropdown": function ( parent, children )
	{
		var result = parent.add( "dropdownlist", undefined, children );
		result.selection = 0;
		return result;
	},

	"closeButtonGroup": function ( parent, submitFunction, cancelFunction )
	{
		var result = parent.add( "group" );
		result.orientation = "row";
		var cancel = result.cancelButton = this.button( result, "Cancel", cancelFunction );
		var submit = result.submitButton = this.button( result, "Submit", submitFunction );
		return result;
	},

	"hseparator": function ( parent, width )
	{
		var result = parent.add( "panel" );
		result.preferredSize = [ width, 50 ];
		result.minimumSize.height = result.maximumSize.height = 3;
		return result
	},

	"vseparator": function ( parent, width )
	{
		var result = parent.add( "panel" );
		result.preferredSize = [ width, 50 ];
		result.minimumSize.width = result.maximumSize.width = 3;
		return result
	}

}

function uiConfirm ( msg )
{
	var result;
	var w = UI.window( "Confirm", function ()
	{
		w.close();
	} );
	w.add( "statictext", undefined, msg );
	var btnGroup = UI.group( w );
	var cancelButton = UI.button( btnGroup, "Nevermind...", function () { result = false; w.close(); } );
	var submitButton = UI.button( btnGroup, "Duh!", function () { result = true; w.close(); } );

	w.show();
	return result;
}

//standard prompt window
function uiPrompt ( msg, title )
{
	var result;
	if ( !title ) { title = "" };
	var w = new Window( "dialog", title );
	w.orientation = "column";
	var topMsg = UI.static( w, msg );
	var input = UI.edit( w, "" );
	input.characters = 20;
	input.active = true;
	var btnGroup = UI.group( w );
	var cancel = UI.button( btnGroup, "Cancel", function ()
	{
		w.close();
	} );
	var submit = UI.button( btnGroup, "Submit", submitFunction );


	w.addEventListener( "keydown", function ( k )
	{
		if ( k.keyName == "Enter" )
		{
			submitFunction();
		}
	} );


	w.show();

	function submitFunction ()
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

function UI_staticText ( parent, txt, len )
{
	var result = parent.add( "statictext", undefined, txt );
	if ( len )
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

function UI_group ( parent )
{
	return parent.add( "group" );
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

function UI_checkbox ( parent, txt, len )
{
	var result = parent.add( "checkbox", undefined, txt );
	if ( len )
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

function UI_button ( parent, txt, func )
{
	var result = parent.add( "button", undefined, txt );
	if ( func )
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

function UI_editText ( parent, txt, len )
{
	var result = parent.add( "edittext", undefined, txt );
	if ( len )
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

function UI_listbox ( parent, dim )
{
	var result = parent.add( "listbox", dim, [] );
	result.onChange = function ()
	{
		if ( result.selection )
		{
			displayData( parent, result.selection.text );
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

function UI_tab ( parent, txt, name )
{
	var myTab = parent.add( "tab", undefined, txt );
	myTab.name = name;
	return myTab;
}



function findSwatch ( name )
{
	var regex = new RegExp( "\\\[Swatch " + name + "\\\]", "i" );
	var s = afc( app.activeDocument, "swatches" ).filter( function ( s )
	{
		return s.toString().match( regex );
	} );

	if ( s.length )
	{
		return s[ 0 ];
	}
	else
	{
		return undefined;
	}
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

// function makeNewSpotColor(name,colorType,colorValue,tint)
// {
// 	var doc = app.activeDocument;
// 	var swatches = doc.swatches;
// 	// try{return swatches[name];}catch(e){};
// 	var existingSwatch = findSwatch(name);
// 	if(existingSwatch && existingSwatch.toString().indexOf(name)>0)
// 	{
// 		return existingSwatch;
// 	}


// 	//attempts at identifying existing spot color without runtime errors
// 	//normally if the spot color does not exist, trying to access it by name
// 	//causes a runtime error. Try/catch can be used, but is not ideal.
// 	//the below are attempts to avoid try/catch.. but they are erroring out 
// 	//because this function isn't creating properly named swatches for some reason???
// 	//
// 	// var swatchArray = afc(doc,"swatches");
// 	// var swatchNameMatches = swatchArray.filter(function (swatch) {try{return swatch.name == name;}catch(e){return false;} });
// 	// if (swatchNameMatches.length) {
// 	// 	//perhaps an alert here to see if the user wants to use or edit the existing swatch?
// 	// 	//better to have another argument instead of an alert every time a swatch is found.
// 	// 	return swatchNameMatches[0];
// 	// }

// 	colorType = colorType || "CMYK";
// 	var defaultColorValue = colorType === "CMYK" ? {cyan:100,magenta:0,yellow:0,black:0} : {red:100,green:0,blue:0};
// 	colorValue = colorValue || BOOMBAH_APPROVED_COLOR_VALUES[name] || defaultColorValue;

// 	var newSpot = doc.spots.add();
// 	var newColor = (colorType === "CMYK") ? new CMYKColor() : new RGBColor();


// 	for (var color in colorValue) {
// 		newColor[color] = Math.round(colorValue[color]);
// 	}


// 	newSpot.name = name;
// 	newSpot.colorType = ColorModel.SPOT;
// 	newSpot.color = newColor;


// 	//make spot color
// 	var newSpotColor = new SpotColor();
// 	newSpotColor.spot = newSpot;
// 	newSpotColor.tint = tint || 100;

// 	return swatches[name];
// }

function makeNewSpotColor ( name, colorType, colorValue, tint )
{
	var doc = app.activeDocument;
	var swatches = doc.swatches;
	var newSpotSwatch;
	try
	{
		newSpotSwatch = swatches[ name ];
		return newSpotSwatch;
	}
	catch ( e ) { };


	// var newSpotSwatch = findChildByName( doc, "swatches", name );
	// if ( newSpotSwatch )
	// {
	// 	return newSpotSwatch;
	// }

	if ( !colorType )
	{
		colorType = "CMYK"
	}

	colorValue = colorValue || BOOMBAH_APPROVED_COLOR_VALUES[ name ] || { "cyan": 12, "magenta": 30, "yellow": 84, "black": 5 };
	tint = tint || 100;

	var newColor = ( colorType === "CMYK" ) ? new CMYKColor() : new RGBColor();
	for ( var color in colorValue )
	{
		newColor[ color ] = colorValue[ color ];
	}

	var newSpot = doc.spots.add();
	newSpot.name = name;
	newSpot.color = newColor;
	newSpot.colorType = ColorModel.SPOT;

	newSpotSwatch = new SpotColor();
	newSpotSwatch.spot = newSpot;
	newSpotSwatch = swatches[ name ];
	newSpotSwatch.tint = tint;
	return newSpotSwatch;
}

function mergeSwatches ( oldSwatchName, newSwatchName )
{
	var doc = app.activeDocument;
	var renameSuccess = false;
	var swatchGroup;
	var overlappingSwatches = false;


	//make sure this isn't an rgb document
	//if it is.. convert it to cmyk
	if ( app.activeDocument.documentColorSpace === DocumentColorSpace.RGB )
	{
		app.executeMenuCommand( "doc-color-cmyk" );
	}


	var swatch = makeNewSpotColor( oldSwatchName );
	try
	{
		swatch.name = newSwatchName;
		renameSuccess = true;
	}
	catch ( e )
	{
		var counter = 2;
		while ( !renameSuccess && counter < 22 )
		{
			try
			{
				swatch.name = newSwatchName + counter;
				renameSuccess = true;
				overlappingSwatches = true;
				counter++;
			}
			catch ( e )
			{
				counter++;
			}
		}
	}

	if ( overlappingSwatches )
	{
		for ( var x = 0, len = doc.swatchGroups.length; x < len; x++ )
		{
			if ( doc.swatchGroups[ x ].name === newSwatchName )
			{
				swatchGroup = doc.swatchGroups[ x ];
				break;
			}
		}

		if ( !swatchGroup )
		{
			swatchGroup = doc.swatchGroups.add();
			swatchGroup.name = newSwatchName;
		}

		swatchGroup.addSwatch( doc.swatches[ newSwatchName ] );
		swatchGroup.addSwatch( swatch );
	}


	var newColorValues;
	newColorValues = BOOMBAH_APPROVED_COLOR_VALUES[ newSwatchName ];

	if ( !newColorValues )
	{
		errorList.push( "Failed to find color values in the database for " + newSwatchName );
		errorList.push( "Please recolor the " + newSwatchName + " swatch manually." );
		newColorValues = {
			"cyan": 100,
			"magenta": 100,
			"yellow": 100,
			"black": 100
		}
	}


	for ( var color in swatch.color.spot.color )
	{
		swatch.color.spot.color[ color ] = newColorValues[ color ];
	}
}

//this function assumes that a clipping mask
//has been found in the group.
//this function returns an object that includes
//the 'overhang' of a clip mask. the part of the 
//clipped image that is not visible 
function getClippedAmount ( group )
{
	var result = { left: 0, top: 0 };
	var mask;
	var clippedArt = [];
	for ( var x = 0, len = group.pageItems.length; x < len; x++ )
	{
		if ( group.pageItems[ x ].clipped )
		{
			mask = group.pageItems[ x ];
		}
		else
		{
			clippedArt.push( group.pageItems[ x ] );
		}
	}

	if ( clippedArt.length )
	{
		var tmpGroup = group.parent.groupItems.add();
		for ( var x = 0, len = clippedArt.length; x < len; x++ )
		{
			tmpGroup.push( clippedart[ x ] );
		}
	}

	if ( mask )
	{
		result.left = tmpGroup.left - mask.left;
		result.top = tmpGroup.top - mask.top;
	}
	return result;

}


//stolen from Josh B Duncan.
//https://github.com/joshbduncan/adobe-scripts/blob/main/MatchObjects.jsx
function getVisibleBounds ( object )
{
	var bounds, clippedItem, sandboxItem, sandboxLayer;
	var curItem;
	if ( object.typename == "GroupItem" )
	{
		// if the object is clipped
		if ( object.clipped )
		{
			// check all sub objects to find the clipping path
			for ( var i = 0; i < object.pageItems.length; i++ )
			{
				curItem = object.pageItems[ i ];
				if ( curItem.clipping )
				{
					clippedItem = curItem;
					break;
				} else if ( curItem.typename == "CompoundPathItem" )
				{
					if ( !curItem.pathItems.length )
					{
						// catch compound path items with no pathItems via william dowling @ github.com/wdjsdev
						sandboxLayer = app.activeDocument.layers.add();
						sandboxItem = curItem.duplicate( sandboxLayer );
						app.activeDocument.selection = null;
						sandboxItem.selected = true;
						app.executeMenuCommand( "noCompoundPath" );
						sandboxLayer.hasSelectedArtwork = true;
						app.executeMenuCommand( "group" );
						clippedItem = app.activeDocument.selection[ 0 ];
						break;
					} else if ( curItem.pathItems[ 0 ].clipping )
					{
						clippedItem = curItem;
						break;
					}
				} else
				{
					clippedItem = curItem;
					break;
				}
			}
			bounds = clippedItem.geometricBounds;
			if ( sandboxLayer )
			{
				// eliminate the sandbox layer since it's no longer needed
				sandboxLayer.remove();
				sandboxLayer = undefined;
			}

		}
		else
		{
			// if the object is not clipped
			bounds = object.visibleBounds;

			//more thorough logic
			// var subObjectBounds;
			// var allBoundPoints = [ [], [], [], [] ];
			// // get the bounds of every object in the group
			// for ( var i = 0; i < object.pageItems.length; i++ )
			// {
			// 	curItem = object.pageItems[ i ];
			// 	subObjectBounds = getVisibleBounds( curItem );
			// 	allBoundPoints[ 0 ].push( subObjectBounds[ 0 ] );
			// 	allBoundPoints[ 1 ].push( subObjectBounds[ 1 ] );
			// 	allBoundPoints[ 2 ].push( subObjectBounds[ 2 ] );
			// 	allBoundPoints[ 3 ].push( subObjectBounds[ 3 ] );
			// }
			// // determine the groups bounds from it sub object bound points
			// bounds = [
			// 	Math.min.apply( Math, allBoundPoints[ 0 ] ),
			// 	Math.max.apply( Math, allBoundPoints[ 1 ] ),
			// 	Math.max.apply( Math, allBoundPoints[ 2 ] ),
			// 	Math.min.apply( Math, allBoundPoints[ 3 ] ),
			// ];
		}
	}
	else
	{
		bounds = object.visibleBounds;
	}
	return bounds;
}

function getBoundsData ( item )
{
	if ( !item ) return;
	var bounds = item.typename.match( /artboard/i ) ? item.artboardRect : getVisibleBounds( item );
	if ( !bounds )
	{
		$.writeln( "Error: " + item.name + " has no visible bounds." );
		return {};
	}
	var result = {};

	result.l = result.left = bounds[ 0 ]; //left
	result.t = result.top = bounds[ 1 ]; //top
	result.r = result.right = bounds[ 2 ]; //right
	result.b = result.bottom = bounds[ 3 ]; //bottom
	result.w = result.width = result.r - result.l; //width
	result.h = result.height = result.t - result.b; //height
	result.hh = result.halfHeight = result.h / 2; //half of item height
	result.hw = result.halfWidth = result.w / 2; //half of item width
	result.hc = result.horizontalCenter = result.l + result.halfWidth; //horizontal center
	result.vc = result.verticalCenter = result.t - result.halfHeight; //vertical center
	result.maxDimProp = result.w > result.h ? "width" : "height"; // larger dimension of width and height
	result.maxDim = result.maxDimProp.match( /w/i ) ? result.w : result.h; // larger dimension of width and height

	result.clipped = result.clippedArtwork = {}; //measurements of amount of artwork clipped/invisible
	result.clipped.left = result.clipped.l = result.l - item.left; // how much is clipped off the left side of the item
	result.clipped.top = result.clipped.t = item.top - result.t; // how much is clipped off the top of the item
	result.clipped.right = result.clipped.r = item.right - result.r; // how much is clipped off the right side of the item
	result.clipped.bottom = result.clipped.b = result.b - item.bottom; // how much is clipped off the bottom of the item

	return result;
}

function getCenterPoint ( item )
{
	try
	{
		for ( var x = 0, len = item.pageItems.length; x < len; x++ )
		{
			if ( item.pageItems[ x ].clipped )
			{
				item = item.pageItems[ x ];
				break;
			}
		}
	}
	catch ( e )
	{
		//item had no child items. just return the dimensions of the item
	}
	return [ item.left + item.width / 2, item.top - item.height / 2 ];
}

function setCenterPoint ( item, coords, dim )
{
	var vb = getVisibleBounds( item );
	var w = vb[ 2 ] - vb[ 0 ];
	var h = vb[ 1 ] - vb[ 3 ];
	if ( dim === "h" )
	{
		item.left = coords[ 0 ] - w / 2;
	}
	else if ( dim === "v" )
	{
		item.top = coords[ 1 ] + h / 2;
	}
	else
	{
		item.left = coords[ 0 ] - w / 2 - ( vb[ 0 ] - item.left );
		item.top = coords[ 1 ] + h / 2 - ( vb[ 1 ] - item.top );
	}

}



function asciiToHex ( str )
{
	var arr1 = [];
	for ( var n = 0, l = str.length; n < l; n++ )
	{
		var hex = Number( str.charCodeAt( n ) ).toString( 16 );
		arr1.push( hex );
	}
	return arr1.join( '' );
}



function getLibraryEntry ( lib, key )
{
	var result;
	if ( result = lib[ key ] )
	{
		return result;
	}
	else if ( result = lib[ key.replace( "_", "-" ) ] )
	{
		return result;
	}
	else if ( result = lib[ key.replace( "-", "_" ) ] )
	{
		return result;
	}
	else
	{
		return undefined;
	}
}

//given a compound path item, move it
//to a sandbox layer, release the compound paths until there are zero
//compound paths on the sandbox layer. then ungroup everything, and then
//rebuild the compound path out of the remaining shapes. then move the
//resulting compound path to "dest".
function cleanupCompoundPath ( item )
{
	var resultingItem;
	if ( !item.typename.match( /compoundpath/i ) ) return;

	var doc = app.activeDocument;
	var sboxLayer = doc.layers.add();
	item.duplicate( sboxLayer );
	doc.selection = null;

	var cPaths = afc( sboxLayer, "compoundPathItems" );
	while ( cPaths.length )
	{
		doc.selection = cPaths;
		app.executeMenuCommand( "noCompoundPath" );
		afc( sboxLayer, "groupItems" ).forEach( function ( g ) { ungroup( g, g.parent, 0 ) } )
		cPaths = afc( sboxLayer, "compoundPathItems" );
	}


	ungroup( sboxLayer, sboxLayer, 0 );

	var sboxItems = afc( sboxLayer, "pageItems" );

	if ( sboxItems.length < 1 )
	{
		sboxLayer.remove();
		item.remove();
		return;
	}

	resultingItem = sboxLayer.compoundPathItems.add();

	sboxItems.forEach( function ( i ) { i.move( resultingItem, ElementPlacement.PLACEATEND ) } ); //move all the items to the compound path

	resultingItem.move( item, ElementPlacement.PLACEAFTER );
	if ( item.name )
	{
		resultingItem.name = item.name;
	}
	item.remove();

	sboxLayer.remove();
	return resultingItem;
}


//basically just indexOf function but for a regex
//pass in the regex and the string to search and
//it will return the index of the regex just like
//if you used String.indexOf("test");
function regexIndexOf ( regex, string )
{
	var ph = "_placeholder_";
	var tmpStr = string;
	tmpStr = tmpStr.replace( regex, ph );
	return tmpStr.indexOf( ph );
}

//trim off all leading and trailing spaces for a 
//given string. this is single line only.. multi line
//strings will probably cause unpredictable behavior.
function trimSpaces ( str )
{
	str = str.replace( /^\s*/, "" );
	str = str.replace( /\s*$/, "" );
	return str;
}

//receive an array of strings and then trim the leading/trailing
//spaces of each element and then return a cleaned up array.
function trimSpacesArray ( arr )
{
	var result = [];
	for ( var x = 0, len = arr.length; x < len; x++ )
	{
		result.push( trimSpaces( arr[ x ] ) );
	}
	return result;
}

//create and load a new action
function createAction ( name, actionString )
{
	removeAction( name );
	var dest = new Folder( documentsPath );
	var actionFile = new File( decodeURI( dest + "/" + name + ".aia" ) );

	actionFile.open( "w" );
	actionFile.write( actionString.join( "\n" ) );
	actionFile.close();

	//load the action
	app.loadAction( actionFile );
}


//remove all instances of an action with a given name
function removeAction ( actionName )
{
	var localValid = true;

	while ( localValid )
	{
		try
		{
			app.unloadAction( actionName, "" );
		}
		catch ( e )
		{
			localValid = false;
		}
	}
}

//curl data from a specified url and return the data as an anonymous object
function curlData ( url, arg )
{
	var curlTimer = new Stopwatch();
	curlTimer.logStart();
	log.h( "Beginning execution of curlData(" + url + arg + ")" );
	var result, status = "empty";;
	var htmlRegex = /<html>/gmi;

	var scriptText,
		scriptFile,
		executor,
		killExecutor;



	url = url + arg;


	//variables for the local data stuff
	var curlDataPath = documentsPath + "curlData/"
	var curlDataFolder = new Folder( curlDataPath );
	if ( !curlDataFolder.exists )
	{
		curlDataFolder.create();
	}
	var localDataFile = File( curlDataPath + "curlData.txt" );


	//clear out the local data file..
	//make sure we always start with an empty string
	localDataFile.open( "w" );
	localDataFile.write( "" );
	localDataFile.close();


	curlTimer.beginTask( "getExecutor" );
	if ( $.os.match( "Windows" ) )
	{
		//write the bat file that will be
		//used to execute the vbs script
		writeVbsFile();

		//define the executor script
		//cscript.exe runs the .vbs file as though the CL is being used
		scriptText = "cscript.exe \"";

		//path to vbs script
		scriptText += curlDataPath + "socket_xhttpRequest.vbs\"";

		//vbs argument 1 = url
		scriptText += " \"" + url + "\" \"";

		//vbs argument 2 = path to curlData.txt file
		scriptText += curlDataPath + "curlData.txt";

		scriptFile = File( curlDataPath + "batFile.bat" );
		writeScriptFile( scriptFile, scriptText )

		executor = scriptFile;
	}
	else
	{
		scriptText = [
			"do shell script ",
			"\"curl \\\"" + url,
			"\\\" > \\\"",
			curlDataPath + "curlData.txt" + "\\\"\""
		].join( "" );

		log.l( "ATTN: scriptText= " + scriptText );

		scriptFile = File( curlDataPath + "curl_from_illustrator.scpt" );
		writeScriptFile( scriptFile, scriptText );
		executor = File( resourcePath + "curl_from_illustrator.app" );
		var localExecutor = File( documentsPath + "curlData/curl_from_illustrator.app" );
		if ( localExecutor.exists )
		{
			executor = localExecutor;
		}
	}
	curlTimer.endTask( "getExecutor" );

	log.l( "executor: " + executor.fullName );

	var maxExecutorCalls = 5;
	var currentExecutorCalls = 0;

	var checkDelay = 200;
	var numberOfChecks = 200;
	var totalChecks = 0;

	var parseFailResults = 0;

	curlTimer.beginTask( "executeExecutor" )
	do
	{
		totalChecks = 0;
		//go get the data
		log.h( "Executing executor for the " + ( ++currentExecutorCalls ) + "th time." );
		executor.execute();


		//check the data
		for ( var a = 0; a < numberOfChecks && status !== "valid"; a++ )
		{
			if ( status != "valid" )
			{
				checkData()
				totalChecks++;
			}
			else if ( status === "html" )
			{
				break;
			}
			$.sleep( checkDelay );
		}

		log.l( "Checked the data " + totalChecks + " times." );


	}
	while ( status !== "valid" && status !== "html" && currentExecutorCalls < maxExecutorCalls );

	curlTimer.endTask( "executeExecutor" );

	//validate
	if ( status === "html" || ( status === "empty" && parseFailResults.length ) )
	{
		errorList.push( "Netsuite returned invalid data for " + arg );
		log.e( "curl command failed. status = " + status + "::parseFailResults = " + parseFailResults );
		log.e( "dataFileContents = " + readDataFile() );
	}
	else if ( status === "valid" )
	{
		log.l( "Valid data." );
		log.l( readDataFile() );
	}

	return result;



	function readDataFile ()
	{
		var file = localDataFile;
		file.open( "r" );
		var contents = file.read();
		file.close();

		return contents;
	}

	function writeScriptFile ( file, txt )
	{
		file.open( "w" );
		file.write( txt );
		file.close();
	}

	function writeVbsFile ()
	{
		//go to the network and copy the contents of the
		//socket_xhttpRequest.vbs file
		//this allows me to manage updates by updating a
		//single central file, but each person will be executing
		//their own copy, which should avoid someone being denied
		//access because another person is already executing the file?

		//central file
		var srcFile = File( dataPath + "socket_xhttpRequest.vbs" );

		//local file
		var destFile = File( curlDataPath + "socket_xhttpRequest.vbs" );

		//read the source file's contents
		srcFile.open( "r" );
		var srcContents = srcFile.read();
		srcFile.close();

		//write the contents to the local file
		writeDatabase( destFile, srcContents );
	}

	function checkData ()
	{
		var contents = readDataFile();
		if ( contents === "" )
		{
			status = "empty";
		}
		else if ( contents.match( htmlRegex ) )
		{
			status = "html";
		}
		else
		{
			try
			{
				result = JSON.parse( contents );
				status = "valid";
			}
			catch ( e )
			{
				status = "parseFail";
				parseFailResults++;
				$.writeln( "Failed contents::: " + contents );
			}
		}
	}



}






// temporary windows workaround for the curlData function
//instead of using applescript and bash to get data from netsuite
//just populate a dialog with the URL to the data. The user will 
//paste the data into their browser, and copy the resulting data
//into an edit text box.
//validate and parse the data
//return JSON object.
function curlWorkaround ( url )
{
	var result;

	var w_dataInput = new Window( "dialog", "Enter the order data:" );

	//labels n such
	var labelGroup = UI.group( w_dataInput );
	labelGroup.orientation = "column";
	var topMsg = UI.static( labelGroup, "Copy this URL into your browser:" );
	var urlDisplay = UI.edit( labelGroup, url );

	//h separator
	UI.hseparator( w_dataInput, 400 )
	//input group
	var inputGroup = UI.group( w_dataInput );
	var inputMsg = UI.static( inputGroup, "Paste the contents of the browser window here:" )
	var input = UI.edit( inputGroup, "", 40 );
	input.active = true;

	//buttons
	var btnGroup = UI.group( w_dataInput );
	var cancel = UI.button( btnGroup, "Cancel", function ()
	{
		result = undefined;
		w_dataInput.close();
	} );
	var submit = UI.button( btnGroup, "Submit", function ()
	{
		if ( input.text !== "" )
		{
			result = JSON.parse( input.text );
			if ( !result )
			{
				alert( "Failed to parse the data.. Please try again." );
			}
			else
			{
				w_dataInput.close();
			}
		}
		else
		{
			alert( "Please paste the data into the box and try again." );
			return;
		}
	} )

	w_dataInput.show();

	return result;
}

function updateSwatchColor ( swatch, name, colors )
{
	swatch.name = name;
	for ( var color in swatch.color.spot.color )
	{
		swatch.color.spot.color[ color ] = colors[ color ];
	}
}

//for the given layer, check for pageItems on layer
//if one is found, select it, then deselect it.
//that should activate the parent layer so that a new
//item is placed inside of it instead of whatever layer
//was last selected by the user
function activateLayer ( layer )
{
	var result = false;
	var itemLocked = false, itemHidden = false;
	var items = layer.pageItems;
	if ( items.length )
	{
		if ( items[ 0 ].locked )
		{
			itemLocked = true;
			items[ 0 ].locked = false;
		}
		if ( items[ 0 ].hidden )
		{
			itemHidden = true;
			items[ 0 ].hidden = false;
		}
		items[ 0 ].selected = true;
		app.activeDocument.selection = null;
		items[ 0 ].locked = itemLocked;
		items[ 0 ].hidden = itemHidden;
		result = true;
	}
	else
	{
		result = false;
	}
	return result;
}


//in the active document, first check to see
//whether guides are locked. this will be done
//by drawing a rectangle in the document,
//converting it to guides, then trying to select
//that rectangle object. if it's not selected,
//then guides are locked and we should toggle
//the setting
function unlockGuides ()
{
	var doc = app.activeDocument;
	var layers = doc.layers;
	var activatedLayer;

	for ( var x = 0, len = layers[ 0 ].layers.length; x < len && !activatedLayer; x++ )
	{
		if ( activateLayer( layers[ 0 ].layers[ x ] ) )
		{
			activatedLayer = layers[ 0 ].layers[ x ];
		}
	}
	if ( activatedLayer )
	{
		if ( activatedLayer.locked )
		{
			activatedLayer.locked = false;
		}
		if ( !activatedLayer.visible )
		{
			activatedLayer.visible = true;
		}
		var rect = doc.pathItems.rectangle( -100, 0, 50, 50 );
		rect.guides = true;

		rect.selected = true;

		if ( !rect.selected )
		{
			log.l( "unlocking the guides." );
			app.executeMenuCommand( "lockguide" );
		}
		rect.remove();
	}






}

//this function is for the add artwork and rebuild template scripts
//
//loop the prepress layer to find any pieces
//matching the names in the rotationSets array
//rotationSets will look like this:
// 		[{"angle":-90,"pieces":["front","back"]},{"angle":90,"pieces":["Right Sleeve", "Left Sleeve"]}]
//parentLayer is the prepressLayer to rotate.
function rotatePieces ( rotationSets, parentLayer )
{
	rotationSets.forEach( function ( set )
	{
		var pieces = set.pieces;
		var angle = set.angle;
		arrayFromContainer( parentLayer, "layers" ).forEach( function ( sizeLay )
		{
			arrayFromContainer( sizeLay, "pageItems" ).forEach( function ( piece )
			{
				var splitName = piece.name.split( " " );
				if ( splitName.length < 2 || !piece.name )
					return;
				var pieceName = splitName.splice( 1, splitName.length ).join( " " );
				if ( pieceName && pieces.indexOf( pieceName ) !== -1 )
				{
					piece.rotate( angle );
				}
			} );
		} );
	} )


}


//
//action string arrays
//

const PATHFINDER_ACTION_STRING =
	[
		"/version 3",
		"/name [ 10",
		"	7061746866696e646572",
		"]",
		"/isOpen 1",
		"/actionCount 10",
		"/action-1 {",
		"	/name [ 5",
		"		756e697465",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 3",
		"				416464",
		"			]",
		"			/value 0",
		"		}",
		"	}",
		"}",
		"/action-2 {",
		"	/name [ 11",
		"		6d696e75735f66726f6e74",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 8",
		"				5375627472616374",
		"			]",
		"			/value 3",
		"		}",
		"	}",
		"}",
		"/action-3 {",
		"	/name [ 9",
		"		696e74657273656374",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 9",
		"				496e74657273656374",
		"			]",
		"			/value 1",
		"		}",
		"	}",
		"}",
		"/action-4 {",
		"	/name [ 7",
		"		6578636c756465",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 7",
		"				4578636c756465",
		"			]",
		"			/value 2",
		"		}",
		"	}",
		"}",
		"/action-5 {",
		"	/name [ 6",
		"		646976696465",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 6",
		"				446976696465",
		"			]",
		"			/value 5",
		"		}",
		"	}",
		"}",
		"/action-6 {",
		"	/name [ 4",
		"		7472696d",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 4",
		"				5472696d",
		"			]",
		"			/value 7",
		"		}",
		"	}",
		"}",
		"/action-7 {",
		"	/name [ 5",
		"		6d65726765",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 5",
		"				4d65726765",
		"			]",
		"			/value 8",
		"		}",
		"	}",
		"}",
		"/action-8 {",
		"	/name [ 4",
		"		63726f70",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 4",
		"				43726f70",
		"			]",
		"			/value 9",
		"		}",
		"	}",
		"}",
		"/action-9 {",
		"	/name [ 7",
		"		6f75746c696e65",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 7",
		"				4f75746c696e65",
		"			]",
		"			/value 6",
		"		}",
		"	}",
		"}",
		"/action-10 {",
		"	/name [ 10",
		"		6d696e75735f6261636b",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_pathfinder)",
		"		/localizedName [ 10",
		"			5061746866696e646572",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 10",
		"				4d696e7573204261636b",
		"			]",
		"			/value 4",
		"		}",
		"	}",
		"}"
	]

//cleanup swatches action
// const CLEANUP_SWATCHES_ACTION_STRING =
// 	[
// 		"/version 3",
// 		"/name [ 16",
// 		"	636c65616e75705f7377617463686573",
// 		"]",
// 		"/isOpen 1",
// 		"/actionCount 1",
// 		"/action-1 {",
// 		"	/name [ 16",
// 		"		636c65616e75705f7377617463686573",
// 		"	]",
// 		"	/keyIndex 5",
// 		"	/colorIndex 0",
// 		"	/isOpen 1",
// 		"	/eventCount 2",
// 		"	/event-1 {",
// 		"		/useRulersIn1stQuadrant 0",
// 		"		/internalName (ai_plugin_swatches)",
// 		"		/localizedName [ 8",
// 		"			5377617463686573",
// 		"		]",
// 		"		/isOpen 0",
// 		"		/isOn 1",
// 		"		/hasDialog 0",
// 		"		/parameterCount 1",
// 		"		/parameter-1 {",
// 		"			/key 1835363957",
// 		"			/showInPalette 4294967295",
// 		"			/type (enumerated)",
// 		"			/name [ 17",
// 		"				53656c65637420416c6c20556e75736564",
// 		"			]",
// 		"			/value 11",
// 		"		}",
// 		"	}",
// 		"	/event-2 {",
// 		"		/useRulersIn1stQuadrant 0",
// 		"		/internalName (ai_plugin_swatches)",
// 		"		/localizedName [ 8",
// 		"			5377617463686573",
// 		"		]",
// 		"		/isOpen 0",
// 		"		/isOn 1",
// 		"		/hasDialog 1",
// 		"		/showDialog 0",
// 		"		/parameterCount 1",
// 		"		/parameter-1 {",
// 		"			/key 1835363957",
// 		"			/showInPalette 4294967295",
// 		"			/type (enumerated)",
// 		"			/name [ 13",
// 		"				44656c65746520537761746368",
// 		"			]",
// 		"			/value 3",
// 		"		}",
// 		"	}",
// 		"}"
// 	]

const UNLOCK_GUIDES_ACTION_STRING = [
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

const TURN_OFF_OVERPRINT_ACTION_STRING =
	[
		"/version 3",
		"/name [ 18",
		"	7475726e5f6f66665f6f7665727072696e74",
		"]",
		"/isOpen 1",
		"/actionCount 1",
		"/action-1 {",
		"	/name [ 18",
		"		7475726e5f6f66665f6f7665727072696e74",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 2",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (adobe_attributePalette)",
		"		/localizedName [ 17",
		"			4174747269627574652053657474696e67",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1718185068",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"	}",
		"	/event-2 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (adobe_attributePalette)",
		"		/localizedName [ 17",
		"			4174747269627574652053657474696e67",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 1",
		"		/parameter-1 {",
		"			/key 1718185068",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"	}",
		"}"
	]

const GRAPHIC_STYLE_FROM_SELECTION_ACTION_STRING =
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
		"	/eventCount 1",
		"	/event-1 {",
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
		"}"
	];

const CLEAR_APPEARANCE_ACTION_STRING =
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

const ADD_NEW_FILL_ACTION_STRING =
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

const EXPORT_JPG_HIGH_QUALITY_ACTION_STRING =
	[
		"/version 3",
		"/name [ 10",
		"	6578706f7274206a7067",
		"]",
		"/isOpen 1",
		"/actionCount 1",
		"/action-1 {",
		"	/name [ 10",
		"		6578706f7274206a7067",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (adobe_exportDocument)",
		"		/localizedName [ 9",
		"			4578706f7274204173",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 1",
		"		/showDialog 0",
		"		/parameterCount 7",
		"		/parameter-1 {",
		"			/key 1885434477",
		"			/showInPalette 0",
		"			/type (raw)",
		"			/value < 100",
		"				0a00000001000000030000000200000000009600010000000000000001000000",
		"				69006d006100670065006d00610070000000610073007400650072005f004c00",
		"				420073004a00540074004800540075005400700032005f0054006f0070000000",
		"				00000100",
		"			>",
		"			/size 100",
		"		}",
		"		/parameter-2 {",
		"			/key 1851878757",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ **folder_char_length**",
		"				**hex_folder_path**",
		"			]",
		"		}",
		"		/parameter-3 {",
		"			/key 1718775156",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ 16",
		"				4a5045472066696c6520666f726d6174",
		"			]",
		"		}",
		"		/parameter-4 {",
		"			/key 1702392942",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ 12",
		"				6a70672c6a70652c6a706567",
		"			]",
		"		}",
		"		/parameter-5 {",
		"			/key 1936548194",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"		/parameter-6 {",
		"			/key 1935764588",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"		/parameter-7 {",
		"			/key 1936875886",
		"			/showInPalette 4294967295",
		"			/type (ustring)",
		"			/value [ 1",
		"				31",
		"			]",
		"		}",
		"	}",
		"}",


	]

const CLEANUP_SWATCHES_ACTION_STRING =
	[
		"/version 3",
		"/name [ 16",
		"	636c65616e75705f7377617463686573",
		"]",
		"/isOpen 1",
		"/actionCount 5",
		"/action-1 {",
		"	/name [ 13",
		"		64656c6574655f756e75736564",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
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
		"}",
		"/action-2 {",
		"	/name [ 8",
		"		6164645f75736564",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_swatches)",
		"		/localizedName [ 8",
		"			5377617463686573",
		"		]",
		"		/isOpen 1",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 2",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 15",
		"				416464205573656420436f6c6f7273",
		"			]",
		"			/value 9",
		"		}",
		"		/parameter-2 {",
		"			/key 1634495605",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"	}",
		"}",
		"/action-3 {",
		"	/name [ 16",
		"		636c65616e75705f7377617463686573",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 3",
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
		"	/event-3 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_swatches)",
		"		/localizedName [ 8",
		"			5377617463686573",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 2",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 15",
		"				416464205573656420436f6c6f7273",
		"			]",
		"			/value 9",
		"		}",
		"		/parameter-2 {",
		"			/key 1634495605",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 1",
		"		}",
		"	}",
		"}",
		"/action-4 {",
		"	/name [ 12",
		"		6164645f73656c6563746564",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 0",
		"	/eventCount 1",
		"	/event-1 {",
		"		/useRulersIn1stQuadrant 0",
		"		/internalName (ai_plugin_swatches)",
		"		/localizedName [ 8",
		"			5377617463686573",
		"		]",
		"		/isOpen 0",
		"		/isOn 1",
		"		/hasDialog 0",
		"		/parameterCount 2",
		"		/parameter-1 {",
		"			/key 1835363957",
		"			/showInPalette 4294967295",
		"			/type (enumerated)",
		"			/name [ 19",
		"				4164642053656c656374656420436f6c6f7273",
		"			]",
		"			/value 9",
		"		}",
		"		/parameter-2 {",
		"			/key 1634495605",
		"			/showInPalette 4294967295",
		"			/type (boolean)",
		"			/value 0",
		"		}",
		"	}",
		"}",
		"/action-5 {",
		"	/name [ 13",
		"		736f72745f7377617463686573",
		"	]",
		"	/keyIndex 0",
		"	/colorIndex 0",
		"	/isOpen 1",
		"	/eventCount 1",
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
		"			/name [ 12",
		"				536f7274204279204e616d65",
		"			]",
		"			/value 14",
		"		}",
		"	}",
		"}"

	]



//
//end action string arrays
//



var BUILDER_GRAPHIC_LOCATION_CODES =
{
	"Front Upper Right": "TFUR",
	"Front Upper Left": "TFUL",
	"Front Center": "TFCC",
	"Front Lower Right": "TFLR",
	"Front Lower Center": "TFLC",
	"Front Lower Left": "TFRL",
	"Back Locker Tag": "TBLT",
	"Back Player Name": "TBPL",
	"Back Player Number": "TBNM",
	"Back Large": "TBLB",
	"Right Shoulder": "TRSH",
	"Right Sleeve": "TRSL",
	"Left Shoulder": "TLSH",
	"Left Sleeve": "TLSL",
	"Right Hood": "TRHD",
	"Left Hood": "TLHD",
	"Back Center": "TBCB",
	"Back Ghosted Mascot": "TBGG",
	"Back Lower Back": "TBLC",
	"Front Right Leg": "BFRL",
	"Front Left Leg": "BFLL",
	"Back Right Leg": "BBRL",
	"Back Left Leg": "BBLL",
	"Right Side Leg": "BRSD",
	"Right Lower Leg": "BRLW",
	"Left Side Leg": "BLSD",
	"Left Lower Leg": "BLLW",
	"Back Waistband": "BBWB",
	"Left Waistband": "BFUL",
	"Right Waistband": "BFUR",
	"Right Hip": "BFRH",
	"Left Hip": "BFLH"
}


var BOOMBAH_APPROVED_COLORS =
	[
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
		"Fuschia Neon B",
		"Charcoal B",
		"Charcoal 2 B",
		"Wolf Gray B",
		"Arctic Gray B",
		"Storm B",
		"Slate B",
		"Gun Metal B",
		"Steel B copy",
		"Foliage B",
		"Cobalt B",
		"Azure B",
		"Peacock B",
		"Tropical Green B",
		"Turquoise B",
		"Aqua B",
		"Ice Blue B",
		"Desert B",
		"Khaki B",
		"Teak Brown B",
		"Oak Brown B",
		"Tree Bark B",
		"Sand B",
		"Coyote B",
		"Olive Drab B",
		"Kiwi B",
		"Forest Green B",
		"Mulch B",
		"Plum B",
		"Eggplant B",
		"Wine B",
		"Sangria B",
		"Violet B",
		"Amethyst Orchid B",
		"Fuschia B",
		"Dusty Rose B",
		"Hot Coral B",
		"Poppy B",
		"Autumn Glory B",
		"Electric Blue B"
	];

var BOOMBAH_PRODUCTION_COLORS =
	[
		'Thru-cut',
		'CUT LINE',
		'cut line',
		'Info B',
		'cutline',
		'CUTLINE',
		'SEW LINE',
		'SEW LINES',
		'SEWLINE',
		'EDGE',
		'EDGES',
		'Jock Tag B',
	];

var BUILDER_COLOR_CODES = {
	"B": "Black B",
	"BPU": "BRIGHT PURPLE B",
	"BN": "Brown B",
	"CRD": "Cardinal B",
	"C": "Charcoal 2 B",
	"CB": "Columbia B",
	"CY": "Cyan B",
	"DC": "Dark Charcoal B",
	"DF": "Dark Flesh B",
	"DG": "Dark Green B",
	"FLM": "FLAME B",
	"FL": "Flesh B",
	"FO": "FLO ORANGE B",
	"FY": "FLO YELLOW B",
	"FP": "FLO PINK B",
	"GD": "Athletic Gold B",
	"GY": "Gray 2 B",
	"HP": "Hot Pink B",
	"KG": "Kelly Green B",
	"LG": "Lime Green B",
	"MG": "Magenta 2 B",
	"MRN": "Maroon B",
	"MN": "MINT B",
	"N": "Navy 2 B",
	"NC": "NEON CORAL B",
	"OY": "Optic Yellow B",
	"O": "Orange B",
	"PK": "Pink B",
	"PU": "Purple B",
	"RD": "Red B",
	"RB": "Royal Blue B",
	"SP": "Soft Pink B",
	"STL": "Steel B",
	"TL": "Teal B",
	"TO": "Texas Orange B",
	"TW": "Twitch B",
	"VG": "Vegas Gold B",
	"W": "White B",
	"Y": "Yellow B",
	"YL": "Yellow B",
	'AO': 'Amethyst Orchid B',
	'AQ': 'Aqua B',
	'ARGY': 'Arctic Gray B',
	'AG': 'Autumn Glory B',
	'AZ': 'Azure B',
	'CO': 'Cobalt B',
	'COY': 'Coyote B',
	'D': 'Desert B',
	'DU': 'Dusty Rose B',
	'EG': 'Eggplant B',
	'FOL': 'Foliage B',
	'FG': 'Forest Green B',
	'F': 'Fuschia B',
	'GM': 'Gun Metal B',
	'HCR': 'Hot Coral B',
	'IB': 'Ice Blue B',
	'KH': 'Khaki B',
	'KW': 'Kiwi B',
	'MUL': 'Mulch B',
	'OKB': 'Oak Brown B',
	'OD': 'Olive Drab B',
	'PC': 'Peacock B',
	'PLM': 'Plum B',
	'PO': 'Poppy B',
	'SND': 'Sand B',
	'SNG': 'Sangria B',
	'SLT': 'Slate B',
	'STR': 'Storm B',
	'TKB': 'Teak Brown B',
	'TB': 'Tree Bark B',
	'TG': 'Tropical Green B',
	'TU': 'Turquoise B',
	'V': 'Violet B',
	'WI': 'Wine B',
	'WG': 'Wolf Gray B',
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
		"cyan": 65,
		"magenta": 57,
		"yellow": 56,
		"black": 34
	},
	"Charcoal B":
	{
		"cyan": 65,
		"magenta": 55,
		"yellow": 52,
		"black": 28

	},
	"Charcoal 2 B":
	{
		"cyan": 71,
		"magenta": 65,
		"yellow": 58,
		"black": 53

	},
	"Fuschia Neon B":
	{
		"cyan": 39.62,
		"magenta": 92.28,
		"yellow": 0,
		"black": 0
	},
	"Fuschia B":
	{
		"cyan": 39.62,
		"magenta": 92.28,
		"yellow": 0,
		"black": 0
	},
	"Khaki B":
	{
		"cyan": 29.88,
		"magenta": 33.12,
		"yellow": 43.39,
		"black": 0.52
	},
	"Wolf Gray B":
	{
		"cyan": 25.999,
		"magenta": 18,
		"yellow": 15,
		"black": 0
	},
	"Arctic Gray B":
	{
		"cyan": 17.187,
		"magenta": 11.933,
		"yellow": 10.245,
		"black": 0
	},
	"Storm B":
	{
		"cyan": 78.515,
		"magenta": 61.328,
		"yellow": 50,
		"black": 35.546
	},
	"Slate B":
	{
		"cyan": 67.186,
		"magenta": 52.355,
		"yellow": 44.663,
		"black": 17.541
	},
	"Gun Metal B":
	{
		"cyan": 57.918,
		"magenta": 47.446,
		"yellow": 46.933,
		"black": 13.687
	},
	"Steel B copy":
	{
		"cyan": 52.999,
		"magenta": 49,
		"yellow": 43,
		"black": 10
	},
	"Foliage B":
	{
		"cyan": 60.723,
		"magenta": 41.855,
		"yellow": 44.126,
		"black": 9.286
	},
	"Cobalt B":
	{
		"cyan": 100,
		"magenta": 98.626,
		"yellow": 17.767,
		"black": 5.581
	},
	"Azure B":
	{
		"cyan": 100,
		"magenta": 44.999,
		"yellow": 0,
		"black": 28.999
	},
	"Peacock B":
	{
		"cyan": 96.932,
		"magenta": 44.077,
		"yellow": 57.46,
		"black": 27.078
	},
	"Tropical Green B":
	{
		"cyan": 97.476,
		"magenta": 26.486,
		"yellow": 54.433,
		"black": 6.842
	},
	"Turquoise B":
	{
		"cyan": 64.831,
		"magenta": 0,
		"yellow": 32.208,
		"black": 0
	},
	"Aqua B":
	{
		"cyan": 66.03,
		"magenta": 0,
		"yellow": 21.423,
		"black": 0
	},
	"Ice Blue B":
	{
		"cyan": 33,
		"magenta": 10.999,
		"yellow": 10.999,
		"black": 9
	},
	"Desert B":
	{
		"cyan": 26.77,
		"magenta": 21.603,
		"yellow": 43.909,
		"black": 0
	},
	"Khaki B":
	{
		"cyan": 29.877,
		"magenta": 33.121,
		"yellow": 43.387,
		"black": 0.518
	},
	"Teak Brown B":
	{
		"cyan": 39.438,
		"magenta": 48.02,
		"yellow": 65.282,
		"black": 13.214
	},
	"Oak Brown B":
	{
		"cyan": 45.435,
		"magenta": 58.782,
		"yellow": 75.057,
		"black": 34.668
	},
	"Tree Bark B":
	{
		"cyan": 56.221,
		"magenta": 57.793,
		"yellow": 79.143,
		"black": 51.497
	},
	"Sand B":
	{
		"cyan": 39.682,
		"magenta": 34.406,
		"yellow": 71.59,
		"black": 6.134
	},
	"Coyote B":
	{
		"cyan": 45.77,
		"magenta": 38.055,
		"yellow": 90.24,
		"black": 13.464
	},
	"Olive Drab B":
	{
		"cyan": 60.073,
		"magenta": 42.697,
		"yellow": 87.249,
		"black": 28.442
	},
	"Kiwi B":
	{
		"cyan": 40.628,
		"magenta": 0,
		"yellow": 81.509,
		"black": 0
	},
	"Forest Green B":
	{
		"cyan": 72.707,
		"magenta": 50.804,
		"yellow": 87.2,
		"black": 59.761
	},
	"Mulch B":
	{
		"cyan": 63.897,
		"magenta": 66.124,
		"yellow": 63.466,
		"black": 61.669
	},
	"Plum B":
	{
		"cyan": 37.999,
		"magenta": 79,
		"yellow": 7.999,
		"black": 64.999
	},
	"Eggplant B":
	{
		"cyan": 33,
		"magenta": 62.999,
		"yellow": 27,
		"black": 64.999
	},
	"Wine B":
	{
		"cyan": 47.614,
		"magenta": 91.061,
		"yellow": 49.655,
		"black": 41.104
	},
	"Sangria B":
	{
		"cyan": 0,
		"magenta": 98,
		"yellow": 40,
		"black": 62
	},
	"Violet B":
	{
		"cyan": 81.493,
		"magenta": 100,
		"yellow": 11.581,
		"black": 1.724
	},
	"Amethyst Orchid B":
	{
		"cyan": 53.099,
		"magenta": 68.337,
		"yellow": 0,
		"black": 0
	},
	"Dusty Rose B":
	{
		"cyan": 11.999,
		"magenta": 50.999,
		"yellow": 38.999,
		"black": 28
	},
	"Hot Coral B":
	{
		"cyan": 0,
		"magenta": 82.999,
		"yellow": 66,
		"black": 0
	},
	"Poppy B":
	{
		"cyan": 2.999,
		"magenta": 91,
		"yellow": 86,
		"black": 0
	},
	"Autumn Glory B":
	{
		"cyan": 0,
		"magenta": 53.579,
		"yellow": 95.175,
		"black": 0
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
	},

}

