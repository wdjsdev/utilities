#target Illustrator
function test()
{

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

	
	var doc = app.activeDocument;
	//now let's get some properties of the document
	var layers = doc.layers;
	var swatches = doc.swatches;
	var artboards = doc.artboards;


	//let's make a new layer to work with
	var workingLayer = layers.add(); //creates a new empty, unnamed layer
	workingLayer.name = "Working Layer"; //change the name of the layer

	//now let's draw a rectangle on the artboard;
	var height = 50; //value in points.. every measurement in illustrator scripting is in points
	var width = 100; //value in points.
	var x = 100; //x coordinate of new rectangle's top left corner
	var y = -100 //y coordinate of new rectangle's top left corner

	//rectangle method takes at least 4 arguments
	//they are: (top coordinate, left coordinate, width, height)
	var myRect = workingLayer.pathItems.rectangle(y,x,width,height);
	
}
test();