#target Illustrator
function test()
{
	var valid = true;
	

	function getUtilities()
	{
		var result = [];
		var utilPath = "/Volumes/Customization/Library/Scripts/Script_Resources/Data/";
		var ext = ".jsxbin"

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{	
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();
			if(prefContents === "true")
			{
				utilPath = "~/Desktop/automation/utilities/";
				ext = ".js";
			}
		}

		if($.os.match("Windows"))
		{
			utilPath = utilPath.replace("/Volumes/","//AD4/");
		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);

		if(!result.length)
		{
			valid = false;
			alert("Failed to find the utilities.");
		}
		return result;

	}

	var utilities = getUtilities();
	for(var u=0,len=utilities.length;u<len;u++)
	{
		eval("#include \"" + utilities[u] + "\"");	
	}

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

			for(var y=0;y<curLay.pageItems.length;y++)
			{
				curItem = curLay.pageItems[y];
				curItem.name = curItem.name.replace("Facing 1","Facing  1");
			}
		}
	}

	// batchInit(container,"renamed certain pieces to assure each piece has a unique name");
	container();

}
test();