var specialInstructions =
{
	"rotate prepress pieces":function(pieces,rot)
	{
		var curSize,curLay,len = ppLay.layers.length;
		for(var si=0;si<len;si++)
		{
			curLay = ppLay.layers[si];
			curSize = curLay.name;
			curLay.groupItems[curSize + " Front"].rotate(rot);
			curLay.groupItems[curSize + " Back"].rotate(rot);
		}
	},

	"FD-4000": function(input)
	{
		var rot,
			pieces = ["Front","Back"];

		if(input === "add artwork")
		{
			rot = 90;	
		}
		else if(input === "rebuild")
		{
			rot = -90;
		}
		this["rotate prepress pieces"](pieces,rot);
		
	},
	"FD-2008": function(input)
	{
		var rot,
			pieces = ["Front","Back"];

		if(input === "add artwork")
		{
			rot = 90;	
		}
		else if(input === "rebuild")
		{
			rot = -90;
		}
		this["rotate prepress pieces"](pieces,rot);
	}
}