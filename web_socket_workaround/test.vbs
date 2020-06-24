Dim fso
Set fso = CreateObject("Scripting.FileSystemObject")

' Dim responseTextString as String
' Set responseTextString = "test"
responseTextString = "test"

Const ForReading = 1, ForWriting = 2, ForAppending = 8
Dim MyFile, FileName, TextLine

' Open the file for output.
FileName = "~/Documents/curlData/curlData.txt"


Set MyFile = fso.OpenTextFile(FileName, ForWriting, True)

' Write to the file.
MyFile.WriteLine responseTextString