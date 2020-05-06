function test()
{
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	
	var prefsFile = File("~/Documents/mockup_clip_masks_prefs.js");

	var defaultPrefs =
	{
		"mockSize":"XL",
		"maskNames":["Front","Back"]
	}

	var prefs = getPrefs();

	function getPrefs()
	{
		
		if(!prefsFile.exists)
		{
			return defaultPrefs;
		}
		else
		{
			eval("#include \"" + prefsFile.fsName + "\"");
			return mockupMaskPrefs;
		}
	}

	function writePrefsFile()
	{
		prefsFile.open("w");
		prefsFile.write("var mockupMaskPrefs = " + JSON.stringify(prefs));
		prefsFile.close();
	}

	function updatePrefs(mockSize,maskNames)
	{
		maskNames = maskNames.replace(/[\s]*\,[\s]*/g,",");

		prefs.mockSize = mockSize.toUpperCase();
		prefs.maskNames = maskNames.split(',');
		writePrefsFile();
	}

	function displayPrefsDialog()
	{
		var w = new Window("dialog");
			var topTxt = UI_staticText(w,"Verify Preferences");
			
			var mockSizeGroup = UI_group(w);
				mockSizeGroup.orientation = "column";
				var mockSizetxt = UI_staticText(mockSizeGroup,"Mockup Size:");
				var mockSizeInput = UI_editText(mockSizeGroup,prefs.mockSize);
					mockSizeInput.characters = 20;
			
			var maskNamesGroup = UI_group(w);
				maskNamesGroup.orientation = "column";
				var maskNamestext = UI_staticText(maskNamesGroup,"Mask Names:");
				var maskNamesInput = UI_editText(maskNamesGroup,prefs.maskNames);
					maskNamesInput.characters = 100;
			
			var btnGroup = UI_group(w);
				btnGroup.orientation = "row";
				var submit = UI_button(btnGroup, "Use These Prefs", function()
				{
					w.close();
				});
				submit.active = true;
				var updatePrefsBtn = UI_button(btnGroup, "Change Prefs", function()
				{
					updatePrefs(mockSizeInput.text, maskNamesInput.text);
					w.close();
				});

			w.addEventListener("keydown",function(k)
			{
				if(k.keyName == "Enter")
				{
					w.close();
				}
			});

		w.show();
	}




	displayPrefsDialog();

	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var mockSizeLay = getPPLay(layers).layers[prefs.mockSize];
	var mockLay = layers[0].layers["Mockup"];

	for(var x=0;x<prefs.maskNames.length;x++)
	{
		var myMask = mockLay.pageItems[prefs.maskNames[x]];
		myMask.pageItems[1].remove();

		var art = mockSizeLay.groupItems[prefs.mockSize + " " + prefs.maskNames[x]];
		art.duplicate(myMask,ElementPlacement.PLACEATEND);
	}


}
test();