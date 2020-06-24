Dim fso
Set fso = CreateObject("Scripting.FileSystemObject")

'setup the xmlhttp object'
Dim http
Set http = CreateObject("MSXML2.XMLHTTP")

url = "https://www.google.com/"


'go get the data'
http.open "GET", url, False
http.send

If http.Status = 200 Then
	responseTextString = http.responseText
Else
	responseTextString = "ERRCODE : " & http.status
End If


' Dim responseTextString as String
' Set responseTextString = "test"
' responseTextString = "something else"

Const ForReading = 1, ForWriting = 2, ForAppending = 8
Dim MyFile, FileName

' Open the file for output.
FileName = "C:\Users\Will.Dowling\Desktop\automation\utilities\web_socket_workaround\curlData.txt"


Set MyFile = fso.OpenTextFile(FileName, ForWriting, True)

MsgBox responseTextString

' Write to the file.
MyFile.WriteLine responseTextString