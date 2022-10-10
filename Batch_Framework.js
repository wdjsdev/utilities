/*
	batch_framework

	dependencies:
	UI_framework
*/


//this is the array of files that will be processed
var batchFiles = [];

//array of files to be closed when the batch is complete
//batch files will be handled on their own, but these may
//be other files created during the execution of the script
var filesToClose = [];

//variable to hold the window object
var w;

//variable to hold the batched files destination folder
var saveDest;

//boolean to indicate whether to close files after processing
var closeFilePref = true;


//initialization function
function batchInit ( func, readMeMsg, folderPath )
{

	if ( !folderPath )
	{
		w = createBatchPreferenceDialog();
		w.show();
	}
	else
	{
		var folder = Folder( folderPath );
		if ( folder.exists )
		{
			setDefaultLocation( folderPath );
			batchFiles = openBatchFiles( Folder( folderPath ), ".ai" );
		}
		else
		{
			alert( "No folder exists at: " + folderPath );
		}
	}


	if ( batchFiles.length )
	{
		executeBatch( func, closeFilePref );
		if ( readMeMsg !== "" )
		{
			writeReadMe( saveDest, readMeMsg );
		}
	}
}


/*
	Component Name: create_batch_preference_dialog
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		create a dialog box using the basic
		UI_framework with 3 standard options
	Arguments
		none
	Return value
		dialog window object

*/

function createBatchPreferenceDialog ()
{
	/* beautify ignore:start */
	var w = new Window( "dialog" );
	var topText = UI_staticText( w, "Which files do you want to process?" );
	var btnGroup = UI_group( w );
	btnGroup.orientation = "column";
	var currentDocBtn = UI_button( btnGroup, "Just active document", justThisDoc );
	var batchFolderBtn = UI_button( btnGroup, "Open a folder to batch", getBatchFiles );
	var batchOpenBtn = UI_button( btnGroup, "Batch open documents", getOpenFiles );
	var cancelBtn = UI_button( btnGroup, "Cancel", cancelDialog );
	return w;
	/* beautify ignore:end */
}



/*
	Component Name: cancel_dialog
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		close the dialog and do nothing
	Arguments
		none
	Return value
		void

*/

function cancelDialog ()
{
	w.close();
	valid = false;
}



/*
	Component Name: just_active_doc
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		push the active document to the batchFiles aray
	Arguments
		none
	Return value
		void

*/

function justThisDoc ()
{
	if ( app.documents.length )
	{
		log.h( "Batching a single document:" );
		log.l( app.activeDocument.name );
		batchFiles.push( app.activeDocument );
		closeFilePref = false;
	}
	else
	{
		errorList.push( "You must have at least one open document." );
		valid = false;
	}
	w.close();
}



/*
	Component Name: get_open_files
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		push all open documents to the batchFiles array
	Arguments
		none
	Return value
		void

*/

function getOpenFiles ()
{
	if ( app.documents.length )
	{
		for ( var x = 0, len = app.documents.length; x < len; x++ )
		{
			batchFiles.push( app.documents[ x ] );
		}
		log.h( "Batching the open documents:" )
		log.l( batchFiles.join( "::" ) );
	}
	else
	{
		errorList.push( "You must have at least one open document." );
		valid = false
	}
	w.close();
}


/*
	Component Name: get_default_location
	Author: William Dowling
	Creation Date: 11 January, 2019
	Description: 
		check to see what the last batch location folder was
		then return the parent folder
	Arguments
		none
	Return value
		folder object

*/

function getDefaultLocation ()
{
	log.h( "Getting the default save location." );
	var result;
	var contents = desktopPath + "Batched_Files";
	var defaultLocFile = File( documentsPath + "default_batch_folder.txt" );
	if ( defaultLocFile.exists )
	{
		defaultLocFile.open( "r" );
		contents = defaultLocFile.read();
		defaultLocFile.close();
		log.l( "Default location file existed. Default save location was: " + contents );
	}
	else
	{
		log.l( "No default location file existed. Using this as the default save location: " + contents );
	}

	result = Folder( contents );
	return result;
}

function setDefaultLocation ( path )
{
	log.h( "Setting the default save location." );
	log.l( "path = " + path );
	path = path.replace( userPathRegex, "/Volumes/Macintosh HD/" + user + "/" );

	log.l( "updated path = " + path );

	var defaultLocFile = File( documentsPath + "default_batch_folder.txt" );
	defaultLocFile.open( "w" );
	defaultLocFile.write( path );
	defaultLocFile.close();

	log.l( "wrote to default save location file." );
}


/*
	Component Name: get_batch_files
	Author: William Dowling
	Creation Date: 03 December, 2017
	Description: 
		prompt user for a folder to batch and
		then open all the .ai files in that
		directory. return an array of all files opened
	Arguments
		none
	Return value
		array of file objects

*/

function getBatchFiles ()
{
	log.h( "Getting the batch files." );
	// var folderToBatch = desktopFolder.selectDlg("Choose a folder to batch.");
	var folderToBatch = getDefaultLocation().selectDlg( "Choose a folder to batch." );
	if ( folderToBatch )
	{
		log.l( "Batch folder = " + folderToBatch );
		setDefaultLocation( folderToBatch.fsName.substring( 0, folderToBatch.fsName.lastIndexOf( "/" ) ) );
		batchFiles = openBatchFiles( folderToBatch, ".ai" );
	}
	else
	{
		errorList.push( "Couldn't determine the batch folder." );
		valid = false;
	}
	w.close();
}



/*
	Component Name: get_batch_dest
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		find the appropriate folder to save the batched documents into
	Arguments
		file
			first file object from the batchFiles array
	Return value
		folder object

*/

function getBatchDest ( file )
{
	log.h( "Getting batch dest." );
	var result;
	var path = file.path.fullName;
	log.l( "path = " + path );
	path = path.replace( userPathRegex, homeFolderPath + "/" );
	log.l( "after replacement, path = " + path );

	//first check to see whether the file has a proper file location 
	if ( path )
	{
		result = new Folder( path + "/Batched_Files" );
	}
	else
	{
		result = new Folder( desktopPath + "/Batched_Files" );
	}

	if ( !result.exists )
	{
		result.create();
	}

	log.l( "returning dest folder: " + result.fsName );
	return result;
}




/*
	Component Name: open_batch_files
	Author: William Dowling
	Creation Date: 13 November, 2017
	Description: 
		open all files in a given folder
		of a given extension
	Arguments
		folder object
		string representing valid file extension
	Return value
		array of files that have been opened

*/
function openBatchFiles ( folder, ext )
{
	var result = [];

	if ( !folder.exists )
	{
		errorList.push( "Failed to find the folder: " + folder.fsName );
		log.e( "Failed to find the folder: " + folder.fsName );
		return false;
	}

	var files = folder.getFiles();
	var len = files.length;
	for ( var x = 0; x < len; x++ )
	{
		if ( files[ x ].name.indexOf( ext ) === files[ x ].name.length - ext.length )
		{
			app.open( files[ x ] );
			result.push( app.activeDocument );
		}
	}

	if ( !result.length )
	{
		errorList.push( "No " + ext + " files were found in the folder." );
		valid = false;
	}

	return result;
}




/*
	Component Name: execute_batch
	Author: William Dowling
	Creation Date: 04 December, 2017
	Description: 
		run the given function on each of
		the given files, then save each
		file into the given destination folder
	Arguments
		func
			the function to be executed on each file
		closeFilePref
			boolean: whether or not to close the files after processing
	Return value
		void

*/

function executeBatch ( func, closeFilePref )
{
	var saveFile;
	var docRef;

	log.h( "Beginning Execute Batch" );

	saveDest = getBatchDest( batchFiles[ 0 ] );

	log.l( "Using the following saveDest: " + saveDest.fsName );

	for ( var x = batchFiles.length - 1; x >= 0; x-- )
	{
		log.l( "Processing file: " + batchFiles[ x ].name );
		docRef = batchFiles[ x ];
		docRef.activate();
		zoomOutToRevealAllArtwork();
		func();
		if ( closeFilePref )
		{
			saveFile = new File( saveDest.fsName + "/" + docRef.name );
			docRef.saveAs( saveFile );
		}
		log.l( "Successfully processed file: " + batchFiles[ x ].name + "::" );
	}

	if ( closeFilePref )
	{
		for ( var x = batchFiles.length - 1; x >= 0; x-- )
		{
			batchFiles[ x ].close( SaveOptions.DONOTSAVECHANGES )
			// batchFiles[x].activate();
			// docRef = app.activeDocument;
			// docRef.close(SaveOptions.DONOTSAVECHANGES);
		}

		for ( var x = filesToClose.length - 1; x >= 0; x-- )		
		{
			filesToClose[ x ].activate();
			docRef = app.activeDocument;
			docRef.close( SaveOptions.DONOTSAVECHANGES );
		}
	}

	if ( errorList.length )
	{
		sendErrors( errorList );
	}
}
