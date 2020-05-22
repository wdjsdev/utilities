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

if(!valid)return;



//get the components
var devComponents = desktopPath + "automation/build_mockup/components";
var prodComponents = componentsPath + "build_mockup_beta";

var compFiles = includeComponents(devComponents,prodComponents,false);
if(compFiles.length)
{
	var curComponent;
	for(var cf=0,len=compFiles.length;cf<len;cf++)
	{
		curComponent = compFiles[cf].fullName;
		eval("#include \"" + curComponent + "\"");
		log.l("included: " + compFiles[cf].name);
	}
}
else
{
	errorList.push("Failed to find the necessary components.");
	log.e("No components were found.");
	valid = false;
	return valid;
}