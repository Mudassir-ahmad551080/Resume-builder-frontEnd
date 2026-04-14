# Remove all id={theme} attributes from all template files

$templateDir = "src/components/templates"
$files = Get-ChildItem -Path $templateDir -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '\s*id=\{theme\}', ''
    Set-Content $file.FullName -Value $content
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "Completed removing id={theme} from all template files"
