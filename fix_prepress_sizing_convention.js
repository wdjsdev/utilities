/*
This script is for batch renaming all prepress
layers and child elements of each layer. For example
if a converted template is set up using the sizes "WS" and "WM",
but the database uses "S" and "M" instead, use this script to
rename all prepress elements per the doTheThing() function. 
change doTheThing to do whatever you want.. enjoy
*/

#target Illustrator
function test()
{
	var valid = true;
	//Production Utilities
	//eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	//eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	
	//Dev Utilities
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");
	


	//this is the function that will execute for each
	//layer and child item.

	var pat = /^w/i;
	function doTheThing(thing)
	{
		thing.name = thing.name.replace(pat,"");
	}




	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var swatches = docRef.swatches;
	var obj = {};
	var arr = [];

	var ppLay = getPPLay(layers);

	var curLay;
	var curItem;
	for(var p=0,len=ppLay.layers.length;p<len;p++)
	{
		curLay = ppLay.layers[p];
		doTheThing(curLay);
		for(var i=0,iLen=curLay.pageItems.length;i<iLen;i++)
		{
			curItem = curLay.pageItems[i];
			doTheThing(curItem);
		}
	}
}
test();