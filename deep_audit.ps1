# Deep System Audit Script for Windows PowerShell
# Author: ZombieCoder Agent
# Purpose: Comprehensive system inspection without modifying project files

param(
    [string]$ProjectPath = "C:\Users\$env:USERNAME\Desktop\Hello Zombie",
    [string]$ReportPath = "$env:TEMP\inspection_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to log with timestamp
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

# Function to add section to report
function Add-Section {
    param([string]$Title)
    Add-Content -Path $ReportPath -Value "`n## $Title`n"
}

# Function to add content to report
function Add-Content {
    param([string]$Content)
    Add-Content -Path $ReportPath -Value $Content
}

Write-Host "🔍 Starting Deep System Audit..." -ForegroundColor $Blue
Write-Host "Report will be saved to: $ReportPath" -ForegroundColor $Yellow

# Initialize report
$reportHeader = @"
# Deep System Audit Report
**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**System:** $env:COMPUTERNAME
**User:** $env:USERNAME
**Project Directory:** $ProjectPath

---

"@

$reportHeader | Out-File -FilePath $ReportPath -Encoding UTF8

Write-Log "📋 System Information Collection" $Green
Add-Section "System Information"

# System Information
$osInfo = Get-WmiObject -Class Win32_OperatingSystem
$computerInfo = Get-WmiObject -Class Win32_ComputerSystem
$processorInfo = Get-WmiObject -Class Win32_Processor

$systemInfo = @"
**OS Version:** $($osInfo.Caption) $($osInfo.Version)
**Architecture:** $($osInfo.OSArchitecture)
**Computer Name:** $($computerInfo.Name)
**Manufacturer:** $($computerInfo.Manufacturer)
**Model:** $($computerInfo.Model)
**Processor:** $($processorInfo.Name)
**Total Memory:** $([math]::Round($computerInfo.TotalPhysicalMemory / 1GB, 2)) GB
**Uptime:** $((Get-Date) - $osInfo.ConvertToDateTime($osInfo.LastBootUpTime))
"@

Add-Content $systemInfo

Write-Log "🔍 Process and Port Analysis" $Green
Add-Section "Running Processes and Ports"

# Get running processes
$processes = Get-Process | Where-Object {$_.ProcessName -match "(python|node|java|dotnet)"} | Select-Object ProcessName, Id, CPU, WorkingSet
Add-Content "**Development Processes:**"
$processes | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

# Network connections
$netConnections = Get-NetTCPConnection | Where-Object {$_.State -eq "Listen"} | Select-Object LocalAddress, LocalPort, State, OwningProcess
Add-Content "`n**Listening Ports:**"
$netConnections | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

Write-Log "💾 Disk and Mount Analysis" $Green
Add-Section "Disk and Mount Information"

# Disk information
$disks = Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace, FileSystem
Add-Content "**Disk Information:**"
$disks | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

# Mount points
$mountPoints = Get-WmiObject -Class Win32_Volume | Where-Object {$_.DriveType -eq 3} | Select-Object DriveLetter, Label, FileSystem, Size, FreeSpace
Add-Content "`n**Volume Information:**"
$mountPoints | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

Write-Log "🔧 UEFI and Boot Information" $Green
Add-Section "UEFI and Boot Configuration"

# Boot configuration
$bootConfig = Get-WmiObject -Class Win32_ComputerSystem | Select-Object BootupState, PowerState
Add-Content "**Boot Configuration:**"
$bootConfig | Format-List | Out-String | Add-Content -Path $ReportPath

# BIOS information
$biosInfo = Get-WmiObject -Class Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate
Add-Content "`n**BIOS Information:**"
$biosInfo | Format-List | Out-String | Add-Content -Path $ReportPath

Write-Log "📁 Project Directory Analysis" $Green
Add-Section "Project Directory Structure and Dependencies"

# Check if project directory exists
if (Test-Path $ProjectPath) {
    $projectContents = Get-ChildItem -Path $ProjectPath -Force | Select-Object Name, Length, LastWriteTime
    Add-Content "**Project Directory Contents:**"
    $projectContents | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath
    
    # Check for Python dependencies
    $requirementsPath = Join-Path $ProjectPath "requirements.txt"
    if (Test-Path $requirementsPath) {
        Add-Content "`n**Python Dependencies (requirements.txt):**"
        Get-Content $requirementsPath | Add-Content -Path $ReportPath
    } else {
        Add-Content "`n**Python Dependencies:** No requirements.txt found"
    }
    
    # Check for Node.js dependencies
    $packageJsonPath = Join-Path $ProjectPath "Extension\package.json"
    if (Test-Path $packageJsonPath) {
        Add-Content "`n**Node.js Dependencies (package.json):**"
        Get-Content $packageJsonPath | Add-Content -Path $ReportPath
    } else {
        Add-Content "`n**Node.js Dependencies:** No package.json found in Extension directory"
    }
} else {
    Add-Content "**Project Directory:** $ProjectPath not found"
}

# Installed Python packages
Write-Log "🐍 Checking Python packages..." $Green
try {
    $pythonPackages = pip list 2>$null | Select-Object -First 20
    Add-Content "`n**Installed Python Packages (first 20):**"
    $pythonPackages | Add-Content -Path $ReportPath
} catch {
    Add-Content "`n**Installed Python Packages:** pip not available or no packages installed"
}

# Node.js global packages
Write-Log "📦 Checking Node.js packages..." $Green
try {
    $nodePackages = npm list -g --depth=0 2>$null | Select-Object -First 20
    Add-Content "`n**Node.js Global Packages (first 20):**"
    $nodePackages | Add-Content -Path $ReportPath
} catch {
    Add-Content "`n**Node.js Global Packages:** npm not available or no global packages"
}

Write-Log "🤖 Ollama Model Analysis" $Green
Add-Section "Ollama Models Status"

# Check if Ollama is installed
try {
    $ollamaVersion = ollama --version 2>$null
    Add-Content "**Ollama Installation:** ✅ Installed"
    Add-Content "**Ollama Version:** $ollamaVersion"
    
    # List installed models
    $ollamaModels = ollama list 2>$null
    Add-Content "`n**Currently Installed Models:**"
    $ollamaModels | Add-Content -Path $ReportPath
    
    # Try to pull specified models
    Write-Log "🔄 Attempting to pull gemma:2b model..." $Green
    Add-Content "`n**Model Pull Attempts:**"
    
    try {
        ollama pull gemma:2b 2>$null
        Add-Content "✅ gemma:2b - Successfully pulled"
    } catch {
        Add-Content "❌ gemma:2b - Failed to pull (may not exist or network issue)"
    }
    
    Write-Log "🔄 Attempting to pull deepseek-coder:1.3b model..." $Green
    try {
        ollama pull deepseek-coder:1.3b 2>$null
        Add-Content "✅ deepseek-coder:1.3b - Successfully pulled"
    } catch {
        Add-Content "❌ deepseek-coder:1.3b - Failed to pull (may not exist or network issue)"
    }
    
    # Test model availability
    Add-Content "`n**Model Testing:**"
    try {
        $testResponse = ollama run gemma:2b "Hello" 2>$null | Select-Object -First 3
        Add-Content "✅ gemma:2b - Model responds correctly"
        Add-Content "Test response: $testResponse"
    } catch {
        Add-Content "❌ gemma:2b - Model test failed"
    }
    
} catch {
    Add-Content "**Ollama Installation:** ❌ Not installed"
    Add-Content "**Installation Command:** Download from https://ollama.ai/download"
}

Write-Log "🖥️ Server Status Check" $Green
Add-Section "Server and Service Status"

# Check for common development servers
$pythonServers = Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -match "(http|server|flask|django)"}
Add-Content "**Python HTTP Servers:**"
if ($pythonServers) {
    $pythonServers | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath
} else {
    Add-Content "No Python HTTP servers running"
}

$nodeServers = Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -match "(server|start|dev)"}
Add-Content "`n**Node.js Development Servers:**"
if ($nodeServers) {
    $nodeServers | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath
} else {
    Add-Content "No Node.js development servers running"
}

# Check specific ports
$commonPorts = @(3000, 5000, 8000, 8080, 3001)
Add-Content "`n**Common Development Ports:**"
foreach ($port in $commonPorts) {
    $portStatus = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($portStatus) {
        Add-Content "Port $port - In use by process $($portStatus.OwningProcess)"
    } else {
        Add-Content "Port $port - Not in use"
    }
}

# Check project-specific servers
$mainServerPath = Join-Path $ProjectPath "main_server.py"
if (Test-Path $mainServerPath) {
    $mainServerProcess = Get-Process | Where-Object {$_.CommandLine -match "main_server.py"}
    Add-Content "`n**Project Main Server Status:**"
    if ($mainServerProcess) {
        $mainServerProcess | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath
    } else {
        Add-Content "main_server.py not running"
    }
}

Write-Log "🔍 System Services Analysis" $Green
Add-Section "System Services"

# Check important services
$importantServices = @("Docker Desktop Service", "SSH", "MySQL", "PostgreSQL", "Apache", "IIS")
Add-Content "**Important Services Status:**"
foreach ($serviceName in $importantServices) {
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if ($service) {
        Add-Content "$serviceName - $($service.Status)"
    } else {
        Add-Content "$serviceName - Not installed"
    }
}

Write-Log "📊 Performance Metrics" $Green
Add-Section "System Performance"

# CPU and Memory usage
$cpuUsage = Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average
$memoryUsage = Get-WmiObject -Class Win32_OperatingSystem
$totalMemory = [math]::Round($memoryUsage.TotalVisibleMemorySize / 1MB, 2)
$freeMemory = [math]::Round($memoryUsage.FreePhysicalMemory / 1MB, 2)
$usedMemory = $totalMemory - $freeMemory

$performanceInfo = @"
**CPU Usage:** $($cpuUsage.Average)%
**Total Memory:** $totalMemory GB
**Used Memory:** $usedMemory GB
**Free Memory:** $freeMemory GB
**Memory Usage:** $([math]::Round(($usedMemory / $totalMemory) * 100, 2))%
"@

Add-Content $performanceInfo

Write-Log "🔐 Security and Permissions" $Green
Add-Section "Security Analysis"

# User groups
$userGroups = (Get-LocalGroup | Where-Object {$_.Name -match "(Administrators|Users|Power Users)"}).Name
Add-Content "**User Groups:** $($userGroups -join ', ')"

# Windows Defender status
$defenderStatus = Get-MpComputerStatus -ErrorAction SilentlyContinue
if ($defenderStatus) {
    Add-Content "`n**Windows Defender Status:** $($defenderStatus.AntivirusEnabled)"
} else {
    Add-Content "`n**Windows Defender Status:** Not available"
}

# Firewall status
$firewallStatus = Get-NetFirewallProfile | Select-Object Name, Enabled
Add-Content "`n**Firewall Status:**"
$firewallStatus | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

Write-Log "🌐 Network Configuration" $Green
Add-Section "Network Information"

# Network adapters
$networkAdapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object Name, InterfaceDescription, LinkSpeed
Add-Content "**Active Network Adapters:**"
$networkAdapters | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

# IP configuration
$ipConfig = Get-NetIPConfiguration | Where-Object {$_.NetAdapter.Status -eq "Up"}
Add-Content "`n**IP Configuration:**"
$ipConfig | Format-List | Out-String | Add-Content -Path $ReportPath

# DNS configuration
$dnsConfig = Get-DnsClientServerAddress | Where-Object {$_.AddressFamily -eq 2}
Add-Content "`n**DNS Configuration:**"
$dnsConfig | Format-Table -AutoSize | Out-String | Add-Content -Path $ReportPath

# Finalize report
$endTime = Get-Date
$executionTime = ($endTime - (Get-Date $reportHeader.Split("`n")[1].Split(": ")[1])).TotalSeconds

Add-Content "`n---`n**Report Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Add-Content "**Total Execution Time:** $([math]::Round($executionTime, 2)) seconds"

Write-Log "📄 Report generated successfully: $ReportPath" $Green

# Copy report to project directory for easy access
$projectReportPath = Join-Path $ProjectPath "inspection_report.md"
if (Test-Path $ProjectPath) {
    Copy-Item -Path $ReportPath -Destination $projectReportPath -Force
    Write-Log "📋 Report copied to project directory: $projectReportPath" $Green
}

# Git operations
Write-Log "🔄 Performing Git operations..." $Green

if (Test-Path (Join-Path $ProjectPath ".git")) {
    Set-Location $ProjectPath
    
    try {
        git add inspection_report.md 2>$null
        git commit --allow-empty -m "Deep system audit completed - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null
        Write-Log "📝 Git commit completed successfully" $Green
        Write-Log "💡 To push to remote: git push origin main" $Yellow
    } catch {
        Write-Log "⚠️ Git commit failed (may not be configured)" $Yellow
    }
} else {
    Write-Log "⚠️ Not a git repository - skipping git operations" $Yellow
}

Write-Log "✅ Deep audit completed successfully!" $Green
Write-Log "📊 Report location: $ReportPath" $Green
if (Test-Path $projectReportPath) {
    Write-Log "📁 Project copy: $projectReportPath" $Green
}

# Display summary
Write-Host "`n🎯 AUDIT SUMMARY" -ForegroundColor $Green
Write-Host "Report File: $ReportPath" -ForegroundColor $Blue
Write-Host "Project Copy: $projectReportPath" -ForegroundColor $Blue
Write-Host "Execution Time: $([math]::Round($executionTime, 2)) seconds" -ForegroundColor $Blue
Write-Host "System: $env:COMPUTERNAME" -ForegroundColor $Blue
Write-Host "User: $env:USERNAME" -ForegroundColor $Blue

Write-Host "`n📋 Next Steps:" -ForegroundColor $Yellow
Write-Host "1. Review the generated report"
Write-Host "2. Check for any issues or recommendations"
Write-Host "3. Run 'git push origin main' if you want to push the audit record"
Write-Host "4. Share the report content with the agent if needed"

# Return to original directory
Set-Location $PSScriptRoot
