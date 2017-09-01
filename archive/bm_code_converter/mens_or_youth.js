//findMensOrYouth Function Description
//read the bm code and determine whether the script 
//should attempt to determine whether to check for
//mens or youth sizes needed based on roster.
//if roster has no players, prompt the user
function findMensOrYouth(bmCode)
{

	//boolean to decide whether or not to look
	//at roster info to determine mens/youth/both
	var lookAtRoster = false;


	//list all of the garments that could be mens or youth....
	//this could take a while..
	//if the bmCode matches any of these,
	//then search the roster for size info and determine
	//that 

	switch(bmCode)
	{
		//basketball
		case "FD-137":
		case "FD-210":
		case "FD-211":
		case "FD-215":
		case "FD-217":
		case "FD-622":

		//compression
		case "FD-410":
		case "FD-412":
		case "FD-415":
		case "FD-420":
		case "FD-425":
		case "FD-430":

		//diamond sports
		case "FD-1000":
		case "FD-161":
		case "FD-163":
		case "FD-230":
		case "FD-233":
		case "FD-234":
		case "FD-3417":
		case "FD-609":
		case "FD-5014":
		
		//football
		case "FD-250":
		case "FD-5064":
		case "FD-5080":
		case "FD-5411":
		
		//lacrosse
		case "FD-2000":
		case "FD-2020":
		case "FD-260":
		case "FD-261":
		case "FD-3007":
		case "FD-3027":
		case "FD-3050":

		//soccer
		case "FD-3061":
		case "FD-3062":
		case "FD-3063":
		case "FD-3064":
		case "FD-3092":
		case "FD-857":
		case "FD-858":

		//spiritwear
		case "FD-164":
		case "FD-1873":
		case "FD-211":
		case "FD-477":
		case "FD-486":
		case "FD-487":
		case "FD-597":
		case "FD-6003":
		case "FD-6061":
		case "FD-6062":
		case "FD-6063":
		case "FD-611":
		case "FD-617":
		case "FD-648":
		case "FD-659":
		case "FD-682":
		case "FD-692":
		case "FD-7025":
		case "FD-828":
		case "FD-842":
		case "FD-862":
		case "FD-863":
		case "FD-872":

			lookAtRoster = true;
			break;
	}


	return lookAtRoster;
}