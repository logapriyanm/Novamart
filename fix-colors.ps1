$dirs = @(
    "f:\PROJECTS\Novamart\src\app\(dashboard)\seller",
    "f:\PROJECTS\Novamart\src\app\(dashboard)\manufacturer",
    "f:\PROJECTS\Novamart\src\client\components\features\negotiation"
)

foreach ($dir in $dirs) {
    Get-ChildItem -Path $dir -Filter "*.tsx" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $newContent = $content

        # Color replacements
        $newContent = $newContent -replace '#0F6CBD', '#067FF9'
        $newContent = $newContent -replace '#10367D', '#067FF9'
        $newContent = $newContent -replace '\[#1E293B\]', 'slate-900'

        # Border radius replacements (careful not to break rounded-[10px])
        $newContent = $newContent -replace 'rounded-2xl', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-xl(?!\[)', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-lg(?!\[)', 'rounded-[10px]'

        # Font size replacements
        $newContent = $newContent -replace 'text-\[10px\]', 'text-sm'
        $newContent = $newContent -replace 'text-\[9px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[8px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[11px\]', 'text-sm'

        if ($content -ne $newContent) {
            Set-Content $_.FullName $newContent -NoNewline
            Write-Output ("Fixed: " + $_.FullName)
        }
    }
}

Write-Output "Done!"
