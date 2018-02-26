function test()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var tmpLay,destLay;

	var dataFilePath = "~/Desktop/automation/local_data/mockup_grouping_data.js";

	//include the data file that contains the coordinate data
	eval("#include \"" + dataFilePath + "\"");
	

	function checkForConfigurationUpdate()
	{
		var configUpdated = false;
		var buffer = 3;
		if(!docRef.selection.length)
		{
			return;
		}

		var curSel,curName;
		for(var x=docRef.selection.length-1;x>=0;x--)
		{
			curSel = docRef.selection[x];
			if(curSel.name.indexOf("newmock")>-1)
			{
				if(!configUpdated)
				{
					groups = {};
				}
				curName = "Mockup " + curSel.name.substring(curSel.name.indexOf(" ")+1, curSel.name.length);
				groups[curName] = {};
				groups[curName].coords = 
				[
					curSel.left - buffer,
					curSel.top + buffer,
					curSel.left + curSel.width + buffer * 2,
					curSel.top - curSel.height - buffer * 2
				];
				configUpdated = true;
				curSel.remove();
			}
		}

		if(configUpdated)
		{
			writeDataFile();
		}

	}

	function writeDataFile()
	{
		var dataFile = File(dataFilePath);
		dataFile.open("w");
		dataFile.write("var groups = " + JSON.stringify(groups));
		dataFile.close();
		alert("Successfully updated mockup coordinates.");
	}

	function createGroups()
	{
		for(var prop in groups)
		{
			var curItems = tmpLay.pageItems;
			var curGroup = groups[prop].group;
			var curCoords = groups[prop].coords;
			var rectData = [];

			rectData.push(curCoords[0]);
			rectData.push(curCoords[1]);
			rectData.push(Math.abs(curCoords[2] - curCoords[0]));
			rectData.push(Math.abs(curCoords[1] - curCoords[3]));

			curGroup = destLay.groupItems.add();
			curGroup.name = prop;
			var tempRect = curGroup.pathItems.rectangle(rectData[1],rectData[0],rectData[2],rectData[3]);

			for(var x=curItems.length-1;x>=0;x--)
			{
				// if(curItems[x].name.indexOf("tmp")=== -1 && isContainedWithin(curItems[x],tempRect))
				if(isContainedWithin(curItems[x],tempRect))
				{
					curItems[x].moveToBeginning(curGroup);
				}
			}

			tempRect.remove();
			curGroup.selected = true;
		}
	}


	function moveArtToDestLay()
	{
		//remove all edges and info from mockup first
		docRef.selection = null;
		app.doScript("Remove Edges F1","Williams Actions");
		docRef.selection = null;

		//duplicate all the artwork to a temp layer
		app.executeMenuCommand("selectallinartboard");
		app.copy();
		tmpLay = layers.add();
		tmpLay.name = "tmpLay";
		app.executeMenuCommand("pasteInPlace");
		docRef.selection = null;

		destLay = layers.add();
		destLay.name = "resulting groups";
	}


	//check to see whether new coordinates should be logged
	checkForConfigurationUpdate();

	//make sure nothing is locked or hidden
	unlockDoc(docRef);

	moveArtToDestLay();

	createGroups();

	app.copy();


	tmpLay.remove();
	
}
test();