//these functions get and set size and position
//of all symbols on a prepress layer, specifically
//the ones nested inside of shirt pieces like Front Logo
//instructions:
//fix one file.. make any adjustments to symbols that are necessary (except naming)
//run the getSymbolData() function and copy the resulting data into the
//setSymbolData() function under the DATA variable.
//copy all files you want to fix to a local folder and then run setSymbolData()
//and point the script to that local folder.

function setSymbolData()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	

	////////////////////////
	////////ATTENTION://////
	//
	//		this variable should be populated with teh result
	//		of the getSymbolData() function.
	//
	////////////////////////
	var DATA = {
					"XXS Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000045,
						"left": 242.571305240294,
						"top": -458.713102329978
					},
					"XXS Left Sleeve Art":
					{
						"width": 21.6000000000022,
						"height": 21.6000000000013,
						"left": 377.392021124862,
						"top": -341.240071755115
					},
					"XXS Right Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000009,
						"left": 120.592673962855,
						"top": -459.014647299099
					},
					"XXS Right Sleeve Art":
					{
						"width": 21.5999999999985,
						"height": 21.6000000000058,
						"left": 377.397203015205,
						"top": -233.364619110458
					},
					"XXS Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461973,
						"top": -146.99409761556
					},
					"XXS Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241263,
						"top": -175.396079793025
					},
					"XXS Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.982569241263,
						"top": -153.796079793025
					},
					"XXS Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151189165351,
						"top": -214.896534758876
					},
					"XXS Front Logo":
					{
						"width": 72.0520359016245,
						"height": 14.4000000000005,
						"left": 147.525171214537,
						"top": -193.296534758875
					},
					"XS Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000055,
						"left": 242.5713052403,
						"top": -458.713453891001
					},
					"XS Left Sleeve Art":
					{
						"width": 21.6000000000022,
						"height": 21.6000000000013,
						"left": 377.393029949193,
						"top": -341.24007168284
					},
					"XS Right Cowl Art":
					{
						"width": 18,
						"height": 18,
						"left": 120.592795047014,
						"top": -459.014647299102
					},
					"XS Right Sleeve Art":
					{
						"width": 21.5999999999985,
						"height": 21.6000000000058,
						"left": 377.398202920787,
						"top": -233.365618996175
					},
					"XS Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.881744461973,
						"top": -146.835430948893
					},
					"XS Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.379327197219,
						"top": -177.014995950324
					},
					"XS Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.981569241263,
						"top": -155.414995950324
					},
					"XS Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.150262388872,
						"top": -214.891526467509
					},
					"XS Front Logo":
					{
						"width": 72.0520359016245,
						"height": 14.4000000000005,
						"left": 147.52424443806,
						"top": -193.291526467508
					},
					"S Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000055,
						"left": 242.572305240307,
						"top": -458.713856233455
					},
					"S Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.591604344796,
						"top": -337.641404781378
					},
					"S Right Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000009,
						"left": 120.592314568622,
						"top": -459.014647299099
					},
					"S Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.598369464329,
						"top": -229.766404799993
					},
					"S Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461966,
						"top": -146.834430948895
					},
					"S Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241259,
						"top": -179.30128915203
					},
					"S Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.98256924126,
						"top": -157.684473013375
					},
					"S Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151189128031,
						"top": -216.675346986275
					},
					"S Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.545247217557,
						"top": -195.066982297931
					},
					"M Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000055,
						"left": 242.57230524032,
						"top": -458.713340628457
					},
					"M Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.590580976052,
						"top": -337.641404781491
					},
					"M Right Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000009,
						"left": 120.592925506804,
						"top": -459.014647299099
					},
					"M Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.599369370202,
						"top": -229.767404781429
					},
					"M Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461973,
						"top": -146.834430948895
					},
					"M Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241263,
						"top": -179.322122485364
					},
					"M Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.982569241263,
						"top": -157.705306346709
					},
					"M Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.148205521013,
						"top": -216.673236797474
					},
					"M Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.542263610539,
						"top": -195.075288775796
					},
					"L Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000055,
						"left": 242.571305240328,
						"top": -458.713381714813
					},
					"L Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.592554016384,
						"top": -337.641404781493
					},
					"L Right Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000009,
						"left": 120.593095888814,
						"top": -459.014647299101
					},
					"L Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.599369276824,
						"top": -229.766404781314
					},
					"L Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461973,
						"top": -146.834430948895
					},
					"L Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241263,
						"top": -179.301289152031
					},
					"L Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.982569241263,
						"top": -157.684473013375
					},
					"L Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151617525168,
						"top": -216.725341615182
					},
					"L Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.545675614692,
						"top": -195.108643593504
					},
					"XL Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000045,
						"left": 242.573305240348,
						"top": -458.713682552564
					},
					"XL Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.59209150989,
						"top": -337.641404781514
					},
					"XL Right Cowl Art":
					{
						"width": 18,
						"height": 18,
						"left": 120.592557279962,
						"top": -459.0146472991
					},
					"XL Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.599369182444,
						"top": -229.766404781658
					},
					"XL Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461973,
						"top": -146.834430948896
					},
					"XL Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241263,
						"top": -179.301289152034
					},
					"XL Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.982569241263,
						"top": -157.684473013376
					},
					"XL Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151839986303,
						"top": -216.683692038356
					},
					"XL Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.545898075827,
						"top": -195.06699401668
					},
					"2XL Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000045,
						"left": 242.571305240352,
						"top": -458.713957949344
					},
					"2XL Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.590269039803,
						"top": -337.641404781526
					},
					"2XL Right Cowl Art":
					{
						"width": 18,
						"height": 18,
						"left": 120.591557640043,
						"top": -459.014647299098
					},
					"2XL Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.599369088108,
						"top": -229.771404781685
					},
					"2XL Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.882744461973,
						"top": -146.834430948896
					},
					"2XL Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.382569241263,
						"top": -179.3117058187
					},
					"2XL Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.982569241263,
						"top": -157.694889680042
					},
					"2XL Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151839986295,
						"top": -216.675353822206
					},
					"2XL Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.545898075819,
						"top": -195.066989133868
					},
					"3XL Left Cowl Art":
					{
						"width": 18,
						"height": 18.0000000000045,
						"left": 242.571305240358,
						"top": -458.714940285622
					},
					"3XL Left Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.1976668826965,
						"left": 375.594187104683,
						"top": -337.642404781443
					},
					"3XL Right Cowl Art":
					{
						"width": 18,
						"height": 18,
						"left": 120.591773727777,
						"top": -459.012647299101
					},
					"3XL Right Sleeve Art":
					{
						"width": 25.1976668826974,
						"height": 25.197666882701,
						"left": 375.599368994195,
						"top": -229.767404781416
					},
					"3XL Locker Tag Art":
					{
						"width": 16.2000000000007,
						"height": 16.1999999999998,
						"left": 587.881744461969,
						"top": -146.834430948899
					},
					"3XL Back Number Art":
					{
						"width": 79.2000000000007,
						"height": 79.1999999999998,
						"left": 556.381569241259,
						"top": -179.3429558187
					},
					"3XL Player Name Art":
					{
						"width": 72,
						"height": 14.3999999999996,
						"left": 559.981569241259,
						"top": -157.72613968004
					},
					"3XL Front Number":
					{
						"width": 64.8000000000002,
						"height": 64.8000000000002,
						"left": 151.151839986303,
						"top": -216.22536114643
					},
					"3XL Front Logo":
					{
						"width": 72.0118838209492,
						"height": 14.3919753834225,
						"left": 147.545898075827,
						"top": -194.858663124749
					}
				};


	function dig(item)
	{
		var name = item.name;
		if(item.typename === "SymbolItem")
		{
			if(item.name)
			{
				try
				{
					var curData = DATA[name];
					// $.writeln("before: " + name + ".width = " + item.width);
					item.width = curData.width;
					// $.writeln("after: " + name + ".width = " + item.width);

					// $.writeln("before: " + name + ".height = " + item.height);
					item.height = curData.height;
					// $.writeln("after: " + name + ".height = " + item.height);

					// $.writeln("before: " + name + ".left = " + item.left);
					item.left = curData.left;
					// $.writeln("after: " + name + ".left = " + item.left);

					// $.writeln("before: " + name + ".top = " + item.top);
					item.top = curData.top;
					// $.writeln("after: " + name + ".top = " + item.top);

				}
				catch(e)
				{
					errorList.push("Failed to find data for symbol called: " + name);
				}
			}
		}
		if(item.typename === "GroupItem")
		{
			for(var x=0,len=item.pageItems.length;x<len;x++)
			{
				dig(item.pageItems[x]);
			}
		}
	}

	function execute()
	{
		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var aB = docRef.artboards;
		var swatches = docRef.swatches;
		var obj = {};
		var arr = [];

		var ppLay = getPPLay(layers);
		ppLay.visible = true;
		ppLay.locked = false;

		for(var x=0,len=ppLay.layers.length;x<len;x++)
		{
			for(var y=0,ylen = ppLay.layers[x].groupItems.length;y<len;y++)
			{
				dig(ppLay.layers[x].groupItems[y]);
				app.redraw();
			}
		}

		ppLay.visible = false;


	}

	batchInit(execute,"fixing symbols");
	// execute();
}
setSymbolData();


function getSymbolData()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var aB = docRef.artboards;
	var swatches = docRef.swatches;
	var obj = {};
	var arr = [];

	var DATA = {};

	function dig(item)
	{
		if(item.typename === "SymbolItem")
		{
			if(item.name)
			{
				if(!DATA[item.name])
				{
					DATA[item.name] = {};
				}
				var curData = DATA[item.name];
				
				curData.width = item.width;
				curData.height = item.height;
				curData.left = item.left;
				curData.top = item.top;
			}
		}
		if(item.typename === "GroupItem")
		{
			for(var x=0,len=item.pageItems.length;x<len;x++)
			{
				dig(item.pageItems[x]);
			}
		}
	}



	var ppLay = layers[0].layers["Prepress"];

	for(var x=0,len=ppLay.layers.length;x<len;x++)
	{
		for(var y=0,ylen = ppLay.layers[x].groupItems.length;y<len;y++)
		{
			dig(ppLay.layers[x].groupItems[y]);
		}
	}

	$.writeln(JSON.stringify(DATA));
	
}
getSymbolData();