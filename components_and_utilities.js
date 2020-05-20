//get the utilities
function getUtilities()
{
	var result;
	var networkPath,utilPath;
	if($.os.match("Windows"))
	{
		networkPath = "//AD4/Customization/";
	}
	else
	{
		networkPath = "/Volumes/Customization/";
	}


	utilPath = decodeURI(networkPath + "Library/Scripts/Script Resources/Data/");

	
	if(Folder(utilPath).exists)
	{
		result = utilPath;
	}

	return result;

}

var utilitiesPath = getUtilities();
if(utilitiesPath)
{
	eval("#include \"" + utilitiesPath + "Utilities_Container.jsxbin" + "\"");
	eval("#include \"" + utilitiesPath + "Batch_Framework.jsxbin" + "\"");
}
else
{
	alert("Failed to find the utilities..");
	return false;	
}



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