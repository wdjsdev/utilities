Dim responseTextString
Dim url,tempFilePath

'parse the arguments and save them to variables'
If WScript.arguments.count>0 then
	url=WScript.arguments(0)
	tempFilePath = WScript.arguments(1)
End If


'setup the xmlhttp object'
Dim http
Set http = CreateObject("MSXML2.XMLHTTP")



'go get the data'
http.open "GET", url, False
http.send

If http.Status = 200 Then
	responseTextString = http.responseText
Else
	responseTextString = "ERRCODE : " & http.status
End If

MsgBox(responseTextString)

