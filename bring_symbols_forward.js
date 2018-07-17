/*
	Bring Symbols Forward

	This is a short term utility script for digging
	recursively into the prepress layer and finding
	any symbol instances and then bring them up to the
	top level of its parent piece.

	No special requirements other than a proper converted template file


*/

function container()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	function bringSymbolsForward()
	{
		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var aB = docRef.artboards;
		var swatches = docRef.swatches;
		var obj = {};
		var arr = [];

		var ppLay = getPPLay(layers);
		ppLay.visible = true;
		var tmpLay = layers.add();

		// var symbolFound = false;
		var curLay;
		var curSize;
		var curPiece;
		for(var x=0,len=ppLay.layers.length;x<len;x++)
		{
			curLay = ppLay.layers[x];
			curSize = curLay.name;
			for(var y=0,yLen = curLay.pageItems.length;y<yLen;y++)
			{
				curPiece = curLay.pageItems[y];
				// symbolFound = false;
				for(var cp=curPiece.pageItems.length-1;cp>=0;cp--)
				{
					dig(curPiece.pageItems[cp]);
					replaceTemp(curPiece);
				}
			}
		}
		tmpLay.remove();
		ppLay.visible = false;

		function replaceTemp(piece)
		{
			for(var x = tmpLay.pageItems.length-1;x>=0;x--)
			{
				tmpLay.pageItems[x].moveToBeginning(piece);
			}
		}


		function dig(parent)
		{
			if(parent.typename === "SymbolItem")
			{
				parent.moveToBeginning(tmpLay);
				// symbolFound = true;
			}
			else if(parent.typename === "GroupItem")
			{
				for(var d=dLen = parent.pageItems.length-1;d>=0;d--)
				{
					dig(parent.pageItems[d]);
				}
			}
		}
	}

	batchInit(bringSymbolsForward,"Pulled all symbols to the top level of their parent piece");
	if(errorList.length)
	{
		sendErrors(errorList);
	}
}
container();