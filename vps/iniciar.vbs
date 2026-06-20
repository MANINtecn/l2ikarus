Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "node C:\status-server\server.js > C:\status-server\log.txt 2>&1", 0, False
