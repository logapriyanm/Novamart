$dirs = @(
    "f:\PROJECTS\Novamart\src\app\(dashboard)\seller",
    "f:\PROJECTS\Novamart\src\app\(dashboard)\manufacturer"
)

foreach ($dir in $dirs) {
    Get-ChildItem -Path $dir -Filter "*.tsx" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $newContent = $content

        # Replace indigo-600 with primary color equivalents
        $newContent = $newContent -replace 'text-indigo-600', 'text-primary'
        $newContent = $newContent -replace 'bg-indigo-600', 'bg-primary'
        $newContent = $newContent -replace 'hover:bg-indigo-700', 'hover:bg-primary/90'
        $newContent = $newContent -replace 'hover:text-indigo-800', 'hover:text-primary/80'
        $newContent = $newContent -replace 'bg-indigo-50', 'bg-primary/5'
        $newContent = $newContent -replace 'border-indigo-100', 'border-primary/10'
        $newContent = $newContent -replace 'text-indigo-300', 'text-primary/50'
        $newContent = $newContent -replace 'text-indigo-700', 'text-primary'
        $newContent = $newContent -replace 'border-l-indigo-600', 'border-l-primary'
        $newContent = $newContent -replace 'bg-indigo-500', 'bg-primary'
        $newContent = $newContent -replace 'hover:bg-indigo-100', 'hover:bg-primary/10'
        $newContent = $newContent -replace 'from-indigo-600/20', 'from-primary/20'
        $newContent = $newContent -replace 'shadow-indigo-500', 'shadow-primary'

        # Replace rounded-full on badges/pills (careful: only for small inline elements)
        # We leave rounded-full for actual circular elements (dots, avatars)

        if ($content -ne $newContent) {
            Set-Content $_.FullName $newContent -NoNewline
            Write-Output ("Fixed: " + $_.FullName)
        }
    }
}

Write-Output "Done!"
