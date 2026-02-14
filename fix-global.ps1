$root = "f:\PROJECTS\Novamart\src\app"
$excludeDirs = @(
    "f:\PROJECTS\Novamart\src\app\(dashboard)\seller",
    "f:\PROJECTS\Novamart\src\app\(dashboard)\manufacturer"
)

Get-ChildItem -Path $root -Filter "*.tsx" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $skip = $false
    foreach ($exclude in $excludeDirs) {
        if ($filePath.StartsWith($exclude)) {
            $skip = $true
            break
        }
    }

    if (-not $skip) {
        $content = Get-Content $filePath -Raw
        $newContent = $content

        # Color replacements
        $newContent = $newContent -replace '#0F6CBD', '#067FF9'
        $newContent = $newContent -replace '#10367D', '#067FF9'
        $newContent = $newContent -replace 'bg-indigo-600', 'bg-primary'
        $newContent = $newContent -replace 'text-indigo-600', 'text-primary'

        # Border radius replacements
        $newContent = $newContent -replace 'rounded-2xl', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-xl(?!\[)', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-lg(?!\[)', 'rounded-[10px]'

        # Font size replacements
        $newContent = $newContent -replace 'text-\[10px\]', 'text-sm'
        $newContent = $newContent -replace 'text-\[9px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[8px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[11px\]', 'text-sm'

        if ($content -ne $newContent) {
            Set-Content $filePath $newContent -NoNewline
            Write-Output ("Fixed: " + $filePath)
        }
    }
}

Write-Output "Global Fix Done!"
