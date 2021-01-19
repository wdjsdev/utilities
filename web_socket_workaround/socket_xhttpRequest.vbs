Dim fso
Set fso = CreateObject("Scripting.FileSystemObject")

Dim url,tempFilePath

'parse the arguments and save them to variables'
If WScript.arguments.count>0 then
	url=WScript.arguments(0)
	tempFilePath = WScript.arguments(1)
End If

' make the http call
'setup the xmlhttp object'
Dim http
Set http = CreateObject("MSXML2.XMLHTTP")
Dim responseTextString
'go get the data'
http.open "GET", url, False
http.send

If http.Status = 200 Then
	responseTextString = http.responseText
Else
	responseTextString = "ERRCODE : " & http.status
End If

'got the data.. time to write it to a local file
Const ForReading = 1, ForWriting = 2, ForAppending = 8
Dim MyFile, FileName, TextLine

' Open the file for output.
FileName = tempFilePath

Set MyFile = fso.OpenTextFile(FileName, ForWriting, True)

' Write to the file.
MyFile.WriteLine responseTextString