# Remove all id={theme} attributes from ResumeBuilder.jsx

$filePath = "src/pages/ResumeBuilder.jsx"
$content = Get-Content $filePath -Raw
$content = $content -replace '\s*id=\{theme\}', ''
Set-Content $filePath -Value $content
Write-Host "Removed all id={theme} attributes from ResumeBuilder.jsx"
