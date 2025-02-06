Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | ForEach-Object { 
    "[{0}]: ./{1}" -f $_.Name, $_.FullName.Replace($PWD.Path, "").TrimStart("\") 
    Get-Content $_.FullName
    "`n"
} | Out-File merged_code.txt -Encoding utf8
