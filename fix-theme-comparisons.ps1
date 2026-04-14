# Final fix - replace theme === 'ligth' conditionals and remove theme variable

$files = @(
    'src/components/Home/Banner.jsx',
    'src/components/Home/CallToaction.jsx',
    'src/components/Home/Footer.jsx',
    'src/components/Home/Test.jsx',
    'src/components/Home/Title.jsx'
)

foreach ($file in $files) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        # Pattern: theme === 'ligth' ? 'light-value' : 'dark-value'
        # Replace with just 'light-value'
        $content = $content -replace "theme\s*===\s*'ligth'\s*\?\s*'([^']*)'\s*:\s*'([^']*)'", "'`$1'"
        
        Set-Content -Path $path -Value $content
        Write-Host "Fixed: $file"
    }
}

Write-Host "Done!"
