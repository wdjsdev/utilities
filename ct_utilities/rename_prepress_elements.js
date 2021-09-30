#target Illustrator
function fixPrepressSizing()
{
	var valid = true;
	//Production Utilities
	//eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	//eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	//Dev Utilities
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");
	
	//this is the function that does the stuff...
	//the rest of the stuff below just loops the prepress layers and pieces.
	//feed in the name of the thing that needs fixing
	//fix it and then return the fixed name.
	//typical use case is removing "W" from the beginning of sizes
	//	//for example, if a CT is set up using WM instead of M, we need to strip the "W"
	function fixerFunction(name)
	{
		var reg = /facing 1/;
		return name.replace(reg,"Facing  1");
	}


	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var swatches = docRef.swatches;
	var obj = {};
	var arr = [];

	var ppLay = getPPLay(layers[0]);

	var curlay,curPiece;
	for(var x=0,len=ppLay.layers.length;x<len;x++)
	{
		curLay = ppLay.layers[x];
		curLay.name = fixerFunction(curLay.name);
		for(var y=0,yLen=curLay.pageItems.length;y<yLen;y++)
		{
			curPiece = curLay.pageItems[y];
			curPiece.name = fixerFunction(curPiece.name);
		}
	}	
}
fixPrepressSizing();