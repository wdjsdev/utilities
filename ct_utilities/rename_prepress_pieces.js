function test()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");

	function container()
	{

		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var aB = docRef.artboards;
		var swatches = docRef.swatches;
		var obj = {};
		var arr = ["Insert Right", "Insert Left"];


		var ppLay = getPPLay(layers);
		var curSize, curName, curLay, curItem;
		for (var x = 0, len = ppLay.layers.length; x < len; x++)
		{
			curLay = ppLay.layers[x];
			curSize = curLay.name;

			for(var y=0,yLen = arr.length;y<yLen;y++)
			{


				try
				{
					curName = curSize + " " + arr[y];
					curItem = curLay.groupItems[curName];
					curItem.name += " 1";

					curItem = curLay.groupItems[curName];
					curItem.name += " 2";
				}
				catch(e)
				{
					//just keep swimming
					//just keep swimming
					//just keep swimming swimming swimming
				}
			}
		}
	}

	batchInit(container,"renamed certain pieces to assure each piece has a unique name");
	// container();

}
test();