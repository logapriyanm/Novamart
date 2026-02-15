$root = "f:\PROJECTS\Novamart\src\app"
$targets = @(
    "SellerClient.tsx",
    "review\page.tsx", 
    "sellers\[id]\page.tsx",
    "blog\[slug]\page.tsx",
    "customer\orders\[id]\page.tsx"
)

Write-Host "Starting robust style fix (Attempt 2)..."

$allFiles = Get-ChildItem -Path $root -Recurse -File -Include "*.tsx"

foreach ($target in $targets) {
    # Escape special regex chars in target path for matching
    $escapedTarget = [Regex]::Escape($target)
    
    # Check if any file path ends with the target string
    $matches = $allFiles | Where-Object { $_.FullName -match "$escapedTarget$" }

    if ($matches) {
        foreach ($file in $matches) {
            Write-Host "Processing: $($file.FullName)"
            $content = Get-Content -LiteralPath $file.FullName -Raw
            $newContent = $content

            # Color replacements
            $newContent = $newContent -replace '#0F6CBD', '#067FF9'
            $newContent = $newContent -replace '#10367D', '#067FF9'
            $newContent = $newContent -replace 'bg-indigo-600', 'bg-primary'
            $newContent = $newContent -replace 'text-indigo-600', 'text-primary'
            
            # Border radius standardization
            $newContent = $newContent -replace 'rounded-2xl', 'rounded-[10px]'
            $newContent = $newContent -replace 'rounded-xl(?!\[)', 'rounded-[10px]'
            $newContent = $newContent -replace 'rounded-lg(?!\[)', 'rounded-[10px]'
            
            # Font size standardizations
            $newContent = $newContent -replace 'text-\[10px\]', 'text-sm'
            $newContent = $newContent -replace 'text-\[9px\]', 'text-xs'
            $newContent = $newContent -replace 'text-\[8px\]', 'text-xs'
            $newContent = $newContent -replace 'text-\[11px\]', 'text-sm'

            if ($content -ne $newContent) {
                Set-Content -LiteralPath $file.FullName $newContent -NoNewline
                Write-Host "  -> FIXED" -ForegroundColor Green
            } else {
                Write-Host "  -> No changes needed" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "Target not found: $target" -ForegroundColor Yellow
    }
}

Write-Host "Done!"
