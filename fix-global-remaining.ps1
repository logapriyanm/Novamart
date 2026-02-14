$files = @(
    "f:\PROJECTS\Novamart\src\app\(public)\sellers\[id]\SellerClient.tsx",
    "f:\PROJECTS\Novamart\src\app\(public)\orders\[id]\review\page.tsx",
    "f:\PROJECTS\Novamart\src\app\(public)\sellers\[id]\page.tsx",
    "f:\PROJECTS\Novamart\src\app\(public)\blog\[slug]\page.tsx",
    "f:\PROJECTS\Novamart\src\app\(dashboard)\customer\orders\[id]\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path -LiteralPath $file) {
        $content = Get-Content -LiteralPath $file -Raw
        $newContent = $content

        $newContent = $newContent -replace '#0F6CBD', '#067FF9'
        $newContent = $newContent -replace '#10367D', '#067FF9'
        $newContent = $newContent -replace 'bg-indigo-600', 'bg-primary'
        $newContent = $newContent -replace 'text-indigo-600', 'text-primary'
        $newContent = $newContent -replace 'rounded-2xl', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-xl(?!\[)', 'rounded-[10px]'
        $newContent = $newContent -replace 'rounded-lg(?!\[)', 'rounded-[10px]'
        $newContent = $newContent -replace 'text-\[10px\]', 'text-sm'
        $newContent = $newContent -replace 'text-\[9px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[8px\]', 'text-xs'
        $newContent = $newContent -replace 'text-\[11px\]', 'text-sm'

        if ($content -ne $newContent) {
            Set-Content -LiteralPath $file $newContent -NoNewline
            Write-Output ("Fixed: " + $file)
        } else {
            Write-Output ("No changes: " + $file)
        }
    } else {
        Write-Output ("Not found: " + $file)
    }
}

Write-Output "Done!"
