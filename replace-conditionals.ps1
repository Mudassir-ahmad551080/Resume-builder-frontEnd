# Find all JSX files in src/components and old_resume.jsx
$files = Get-ChildItem -Path "src/components" -Filter "*.jsx" -Recurse -ErrorAction SilentlyContinue
$files += Get-Item -Path "old_resume.jsx" -ErrorAction SilentlyContinue

Write-Host "Found $($files.Count) JSX files to process"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace isLight with single quotes - keep first value
    $content = $content -replace "isLight\s*\?\s*'([^']*)'\s*:\s*'([^']*)'", "'\$1'"
    
    # Replace isLight with double quotes - keep first value
    $content = $content -replace 'isLight\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"', '"$1"'
    
    # Replace isDark with single quotes - keep second value
    $content = $content -replace "isDark\s*\?\s*'([^']*)'\s*:\s*'([^']*)'", "'\$2'"
    
    # Replace isDark with double quotes - keep second value
    $content = $content -replace 'isDark\s*\?\s*"([^"]*)"\s*:\s*"([^"]*)"', '"$2"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    } else {
        Write-Host "No changes: $($file.FullName)"
    }
}

Write-Host "
Replacement complete!"
