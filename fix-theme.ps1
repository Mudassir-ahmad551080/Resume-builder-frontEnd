# PowerShell script to remove useTheme from all components

$files = @(
    'src/components/ResumeAnalyzer.jsx',
    'src/components/InterviewAgent.jsx',
    'src/components/Home/Banner.jsx',
    'src/components/Home/CallToaction.jsx',
    'src/components/Home/Footer.jsx',
    'src/components/Home/Test.jsx',
    'src/components/Home/Title.jsx',
    'src/components/Home/Testimonials.jsx',
    'src/components/templates/ClassicTemplate.jsx',
    'src/components/templates/MinimalTemplate.jsx',
    'src/components/templates/MinimalImageTemplate.jsx',
    'src/components/templates/ModernTemplate.jsx',
    'src/components/templates/SimpleTemplate.jsx',
    'src/components/templates/ExecutiveProTemplate.jsx',
    'src/pages/Dashboard.jsx',
    'old_resume.jsx'
)

foreach ($file in $files) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        # Remove useTheme import line
        $content = $content -replace 'import\s*{\s*useTheme\s*}\s*from\s*[''"].*?ThemContext.*?[''"]\s*;\s*\n?', ''
        
        # Remove const [theme] = useTheme() declaration
        $content = $content -replace 'const\s*\[theme\]\s*=\s*useTheme\(\)\s*;\s*\n?', ''
        
        # Remove isLight and isDark declarations
        $content = $content -replace 'const\s*isLight\s*=\s*theme\s*===\s*[''"]ligth[''"]\s*;\s*\n?', ''
        $content = $content -replace 'const\s*isDark\s*=\s*theme\s*===\s*[''"]dark[''"]\s*;\s*\n?', ''
        
        Set-Content -Path $path -Value $content
        Write-Host "Fixed: $file"
    } else {
        Write-Host "Not found: $file"
    }
}
