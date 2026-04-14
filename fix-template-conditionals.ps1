# Fix template literal conditionals with isLight/isDark

$files = Get-ChildItem -Path "src/components", "old_resume.jsx" -Filter "*.jsx" -Recurse -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "src/pages" -Filter "*.jsx" -Recurse -ErrorAction SilentlyContinue
$files += Get-Item "old_resume.jsx" -ErrorAction SilentlyContinue

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        
        # Only process files that contain isLight or isDark
        if ($content -match "isLight|isDark") {
            # Pattern: ${isLight ? 'light-value' : 'dark-value'}
            $content = [System.Text.RegularExpressions.Regex]::Replace(
                $content,
                '\$\{isLight\s*\?\s*[''"]([^''"]*)[''"]\s*:\s*[''"]([^''"]*)[''"]\s*\}',
                '$1'
            )
            
            # Pattern: isLight ? 'light' : 'dark' in className
            $content = $content -replace "isLight\s*\?\s*'([^']*)'\s*:\s*'([^']*)'", "'`$1'"
            $content = $content -replace 'isLight\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"', '"$1"'
            
            # Pattern: isDark ? 'dark' : 'light'
            $content = $content -replace "isDark\s*\?\s*'([^']*)'\s*:\s*'([^']*)'", "'`$2'"
            $content = $content -replace 'isDark\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"', '"$2"'
            
            # Remove isDark={isDark} and similar props
            $content = $content -replace '\s+isDark=\{isDark\}', ''
            
            # Remove references to undefined isDark in ${}
            $content = [System.Text.RegularExpressions.Regex]::Replace(
                $content,
                '\$\{isDark\s*\?\s*[''"]([^''"]*)[''"]\s*:\s*[''"]([^''"]*)[''"]\s*\}',
                '$2'
            )
            
            Set-Content -Path $file.FullName -Value $content
            Write-Host "Fixed: $($file.FullName)"
        }
    } catch {
        Write-Host "Error processing $($file.FullName): $_"
    }
}

Write-Host "Done!"
