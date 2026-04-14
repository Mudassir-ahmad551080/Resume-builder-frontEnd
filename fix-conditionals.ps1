# PowerShell script to replace all theme conditionals with light theme version
# Pattern: isLight ? 'light-class' : 'dark-class' -> 'light-class'

$files = Get-ChildItem -Path "src", "old_resume.jsx" -Filter "*.jsx" -Recurse | Select-Object -ExpandProperty FullName

foreach ($file in $files) {
    if ((Select-String -Path $file -Pattern "isLight|isDark|theme ===" -Quiet) -and $file -ne "fix-theme.ps1") {
        $content = Get-Content $file -Raw
        
        # Pattern 1: isLight ? 'class1' : 'class2' -> 'class1'
        $content = $content -replace '\$\{isLight\s*\?\s*[''"]([^''"]*)['']\s*:\s*[''"]([^''"]*)[''"]', '$1'
        
        # Pattern 2: isLight ? "class1" : "class2" 
        $content = $content -replace '\$\{isLight\s*\?\s*\"([^\"]*)\"\s*:\s*\"([^\"]*)\"', '$1'
        
        # Pattern 3: isDark ? 'dark' : 'light' -> 'light'
        $content = $content -replace '\$\{isDark\s*\?\s*[''"]([^''"]*)['']\s*:\s*[''"]([^''"]*)[''"]', '$2'
        
        # Pattern 4: Without template literal - theme === 'ligth' ? 'light' : 'dark'
        $content = $content -replace "theme\s*===\s*[''']ligth['\'']\\s*\\?\\s*[''']([^''']*)['\'']\\s*:\\s*[''']([^''']*)['\'']", '$1'
        
        # Pattern 5: id={theme} -> remove these (they are used in templates)
        $content = $content -replace 'id=\{theme\}', ''
        
        # Pattern 6: isDark={isDark} prop
        $content = $content -replace ' isDark=\{isDark\}', ''
        
        # Pattern 7: Remove any leftover isDark/isLight references in conditionals
        $content = $content -replace '\$\{isDark.*?\}', ''
        
        Set-Content -Path $file -Value $content
        Write-Host "Fixed conditionals: $file"
    }
}

Write-Host "Done!"
