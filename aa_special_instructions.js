var specialInstructions = {
	"rotate prepress pieces": function(pieces, rot)
	{
		var curSize, curLay, len = ppLay.layers.length,
			pieceLen = pieces.length;
		for (var si = 0; si < len; si++)
		{
			curLay = ppLay.layers[si];
			curSize = curLay.name;
			for (var p = 0; p < pieceLen; p++)
			{
				curLay.groupItems[curSize + " " + pieces[p]].rotate(rot);
			}
			// curLay.groupItems[curSize + " Front"].rotate(rot);
			// curLay.groupItems[curSize + " Back"].rotate(rot);
		}
	},

	"FD-4000": function(input)
	{
		var rot,
			pieces = ["Front", "Back"];

		if (input === "add artwork")
		{
			rot = 90;
		}
		else if (input === "rebuild")
		{
			rot = -90;
		}
		this["rotate prepress pieces"](pieces, rot);

	},

	"FD-2008": function(input)
	{
		var rot,
			pieces = ["Front", "Back"];

		if (input === "add artwork")
		{
			rot = 90;
		}
		else if (input === "rebuild")
		{
			rot = -90;
		}
		this["rotate prepress pieces"](pieces, rot);
	},

	"FD_250": function(input)
	{
		var rot = 180,
			pieces = ["Outside Cowl"];
		this["rotate prepress pieces"](pieces, rot);
	},
	"FD_250Y": function(input)
	{
		var rot = 180,
			pieces = ["Outside Cowl"];
		this["rotate prepress pieces"](pieces, rot);
	},
	"FD_5411": function(input)
	{
		var rot = 180,
			pieces = ["Outside Cowl"];
		this["rotate prepress pieces"](pieces, rot);
	},
	"FD_5411Y": function(input)
	{
		var rot = 180,
			pieces = ["Outside Cowl"];
		this["rotate prepress pieces"](pieces, rot);
	},
	"FD-5421": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5422": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5423": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5421Y": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5422Y": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5423Y": function(input)
	{
		var rot = 90;
		if (input === "rebuild")
		{
			rot = -rot;
		}
		var pieces = ["Right Cowl"];
		this["rotate prepress pieces"](pieces, rot);
		pieces = ["Left Cowl"];
		this["rotate prepress pieces"](pieces, -rot);
	},
	"FD-5080":function(input)
	{
		var rot = 2.32;
		if(input === "rebuild")
		{
			rot = -rot;
		} 
		var pieces = ["Right Side Panel"];
		this["rotate prepress pieces"](pieces,rot);
		pieces = ["Left Side Panel"];
		this["rotate prepress pieces"](pieces,-rot);
	}

}