/*
	batch_framework

	dependencies:
	UI_framework
*/


//this is the array of files that will be processed
var batchFiles = [];

//variable to hold the window object
var w;

//variable to hold the batched files destination folder
var saveDest;


//initialization function
function batchInit(func,readMeMsg)
{
	w = createBatchPreferenceDialog();
	w.show();

	if(valid && batchFiles.length)
	{
		executeBatch(func);
		writeReadMe(saveDest,readMeMsg);
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

function createBatchPreferenceDialog()
{
	/* beautify ignore:start */
	var w = new Window("dialog");
		var topText = UI_staticText(w,"Which files do you want to process?");
		var btnGroup = UI_group(w);
			btnGroup.orientation = "column";
			var currentDocBtn = UI_button(btnGroup,"Just active document",justThisDoc);
			var batchFolderBtn = UI_button(btnGroup,"Open a folder to batch",getBatchFiles);
			var batchOpenBtn = UI_button(btnGroup,"Batch open documents",getOpenFiles);
			var cancelBtn = UI_button(btnGroup,"Cancel",cancelDialog);
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

function cancelDialog()
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

function justThisDoc()
{
	if (app.documents.length)
	{
		batchFiles.push(app.activeDocument);
	}
	else
	{
		errorList.push("You must have at least one open document.");
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

function getOpenFiles()
{
	if (app.documents.length)
	{
		for (var x = 0, len = app.documents.length; x < len; x++)
		{
			batchFiles.push(app.documents[x]);
		}
	}
	else
	{
		errorList.push("You must have at least one open document.");
		valid = false
	}
	w.close();
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

function getBatchFiles()
{
	var folderToBatch = desktopFolder.selectDlg("Choose a folder to batch.");
	if (folderToBatch)
	{
		batchFiles = openBatchFiles(folderToBatch, ".ai");
	}
	else
	{
		errorList.push("Couldn't determine the batch folder.");
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

function getBatchDest(file)
{
	var result;
	
	//first check to see whether the file has a proper file location
	if(file.path.fsName)
	{
		result = new Folder("Volumes/Macintosh\ HD/" + file.path + "/Batched_Files");
	}
	else
	{
		result = new Folder(desktopPath + "/Batched_Files");
	}
	result.create();

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
function openBatchFiles(folder,ext)
{
	var result = [];

	if(!folder.exists)
	{
		errorList.push("Failed to find the folder: " + folder.fsName);
		log.e("Failed to find the folder: " + folder.fsName);
		return false;
	}
	
	var files = folder.getFiles();
	var len = files.length;
	for(var x=0;x<len;x++)
	{
		if(files[x].name.indexOf(ext) === files[x].name.length - ext.length)
		{
			app.open(files[x]);
			result.push(app.activeDocument);
		}
	}

	if(!result.length)
	{	
		errorList.push("No " + ext + " files were found in the folder.");
		valid= false;
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
		batchFiles
			array of file objects
		func
			the function to be executed on each file
	Return value
		void

*/

function executeBatch(func)
{
	var saveFile;
	var docRef;

	saveDest = getBatchDest(batchFiles[0]);

	for (var x = batchFiles.length - 1; x >= 0; x--)
	{
		docRef = batchFiles[x];
		docRef.activate();
		try
		{
			func();
		}
		catch(e)
		{
			errorList.push("Failed to execute the batch function on the file: " + docRef.name);
		}
	}

	for (var x = batchFiles.length - 1; x >= 0; x--)
	{
		docRef = app.activeDocument;
		saveFile = new File(saveDest.fsName + "/" + docRef.name);
		docRef.saveAs(saveFile);
		docRef.close(SaveOptions.DONOTSAVECHANGES);
	}
}
