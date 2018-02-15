function closeAllOpenDocs()
{
	
	while(app.documents.length)
	{
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);	
	}
}
closeAllOpenDocs();