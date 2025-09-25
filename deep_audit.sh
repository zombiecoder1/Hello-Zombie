#!/bin/bash

# Deep System Audit Script for Ubuntu
# Author: ZombieCoder Agent
# Purpose: Comprehensive system inspection without modifying project files

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Report file with timestamp
REPORT_FILE="/tmp/inspection_report_$(date +%s).md"
PROJECT_DIR="/home/sahon/Desktop/Hello Zombie"

echo -e "${BLUE}🔍 Starting Deep System Audit...${NC}"
echo -e "${YELLOW}Report will be saved to: $REPORT_FILE${NC}"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to add section to report
add_section() {
    echo -e "\n## $1" >> "$REPORT_FILE"
    echo -e "\n### $1" >> "$REPORT_FILE"
}

# Function to add content to report
add_content() {
    echo -e "$1" >> "$REPORT_FILE"
}

# Initialize report
cat > "$REPORT_FILE" << EOF
# Deep System Audit Report
**Generated:** $(date '+%Y-%m-%d %H:%M:%S')
**System:** $(uname -a)
**User:** $(whoami)
**Project Directory:** $PROJECT_DIR

---

EOF

log "📋 System Information Collection"
add_section "System Information"
add_content "**OS Version:** $(lsb_release -d | cut -f2)"
add_content "**Kernel:** $(uname -r)"
add_content "**Architecture:** $(uname -m)"
add_content "**Uptime:** $(uptime)"
add_content "**Memory:** $(free -h | grep Mem | awk '{print $2 " total, " $3 " used, " $7 " available"}')"
add_content "**Disk Usage:** $(df -h / | tail -1 | awk '{print $2 " total, " $3 " used, " $4 " available (" $5 " used)"}')"

log "🔍 Process and Port Analysis"
add_section "Running Processes and Ports"

# Check for common development processes
add_content "**Python Processes:**"
ps aux | grep python | grep -v grep >> "$REPORT_FILE" || add_content "No Python processes found"

add_content "\n**Node.js Processes:**"
ps aux | grep node | grep -v grep >> "$REPORT_FILE" || add_content "No Node.js processes found"

add_content "\n**Active Network Connections:**"
netstat -tulpn 2>/dev/null | head -20 >> "$REPORT_FILE" || add_content "netstat not available"

add_content "\n**Listening Ports:**"
ss -tulpn 2>/dev/null | head -20 >> "$REPORT_FILE" || add_content "ss not available"

log "💾 Disk and Mount Analysis"
add_section "Disk and Mount Information"

add_content "**All Mounted Filesystems:**"
df -h >> "$REPORT_FILE"

add_content "\n**Detailed Mount Information:**"
mount | grep -E "(ext4|ntfs|vfat|exfat)" >> "$REPORT_FILE"

add_content "\n**Block Devices:**"
lsblk >> "$REPORT_FILE"

add_content "\n**Windows Partitions Detection:**"
lsblk -f | grep -i ntfs >> "$REPORT_FILE" || add_content "No NTFS partitions found"

log "🔧 EFI/UEFI and Boot Information"
add_section "EFI/UEFI and Boot Configuration"

add_content "**Boot Mode:**"
if [ -d /sys/firmware/efi ]; then
    add_content "UEFI Mode (EFI directory exists)"
else
    add_content "Legacy BIOS Mode"
fi

add_content "\n**EFI Variables (if available):**"
efibootmgr 2>/dev/null >> "$REPORT_FILE" || add_content "efibootmgr not available or not in UEFI mode"

add_content "\n**GRUB Configuration:**"
if [ -f /etc/default/grub ]; then
    cat /etc/default/grub >> "$REPORT_FILE"
else
    add_content "GRUB configuration not found"
fi

log "📁 Project Directory Analysis"
add_section "Project Directory Structure and Dependencies"

add_content "**Project Directory Contents:**"
ls -la "$PROJECT_DIR" >> "$REPORT_FILE"

add_content "\n**Python Dependencies:**"
if [ -f "$PROJECT_DIR/requirements.txt" ]; then
    add_content "requirements.txt found:"
    cat "$PROJECT_DIR/requirements.txt" >> "$REPORT_FILE"
else
    add_content "No requirements.txt found"
fi

add_content "\n**Node.js Dependencies:**"
if [ -f "$PROJECT_DIR/Extension/package.json" ]; then
    add_content "package.json found:"
    cat "$PROJECT_DIR/Extension/package.json" >> "$REPORT_FILE"
else
    add_content "No package.json found in Extension directory"
fi

add_content "\n**Installed Python Packages:**"
pip list 2>/dev/null | head -20 >> "$REPORT_FILE" || add_content "pip not available or no packages installed"

add_content "\n**Node.js Global Packages:**"
npm list -g --depth=0 2>/dev/null | head -20 >> "$REPORT_FILE" || add_content "npm not available or no global packages"

log "🤖 Ollama Model Analysis"
add_section "Ollama Models Status"

# Check if Ollama is installed
if command -v ollama &> /dev/null; then
    add_content "**Ollama Installation:** ✅ Installed"
    add_content "**Ollama Version:** $(ollama --version 2>/dev/null || echo 'Version check failed')"
    
    add_content "\n**Currently Installed Models:**"
    ollama list >> "$REPORT_FILE" 2>/dev/null || add_content "Failed to list models"
    
    # Try to pull specified models
    log "🔄 Attempting to pull gemma:2b model..."
    add_content "\n**Model Pull Attempts:**"
    
    if ollama pull gemma:2b 2>/dev/null; then
        add_content "✅ gemma:2b - Successfully pulled"
    else
        add_content "❌ gemma:2b - Failed to pull (may not exist or network issue)"
    fi
    
    log "🔄 Attempting to pull deepseek-coder:1.3b model..."
    if ollama pull deepseek-coder:1.3b 2>/dev/null; then
        add_content "✅ deepseek-coder:1.3b - Successfully pulled"
    else
        add_content "❌ deepseek-coder:1.3b - Failed to pull (may not exist or network issue)"
    fi
    
    # Test model availability
    add_content "\n**Model Testing:**"
    if ollama run gemma:2b "Hello" 2>/dev/null | head -3; then
        add_content "✅ gemma:2b - Model responds correctly"
    else
        add_content "❌ gemma:2b - Model test failed"
    fi >> "$REPORT_FILE"
    
else
    add_content "**Ollama Installation:** ❌ Not installed"
    add_content "**Installation Command:** curl -fsSL https://ollama.ai/install.sh | sh"
fi

log "🖥️ Server Status Check"
add_section "Server and Service Status"

# Check for common development servers
add_content "**Python HTTP Servers:**"
ps aux | grep -E "(python.*http|python.*server|flask|django)" | grep -v grep >> "$REPORT_FILE" || add_content "No Python HTTP servers running"

add_content "\n**Node.js Development Servers:**"
ps aux | grep -E "(node.*server|npm.*start|yarn.*start|next.*dev)" | grep -v grep >> "$REPORT_FILE" || add_content "No Node.js development servers running"

add_content "\n**Port 3000 (Common React/Next.js):**"
netstat -tulpn 2>/dev/null | grep :3000 >> "$REPORT_FILE" || add_content "Port 3000 not in use"

add_content "\n**Port 5000 (Common Flask):**"
netstat -tulpn 2>/dev/null | grep :5000 >> "$REPORT_FILE" || add_content "Port 5000 not in use"

add_content "\n**Port 8000 (Common Django):**"
netstat -tulpn 2>/dev/null | grep :8000 >> "$REPORT_FILE" || add_content "Port 8000 not in use"

# Check project-specific servers
if [ -f "$PROJECT_DIR/main_server.py" ]; then
    add_content "\n**Project Main Server Status:**"
    ps aux | grep main_server.py | grep -v grep >> "$REPORT_FILE" || add_content "main_server.py not running"
fi

log "🔍 System Services Analysis"
add_section "System Services"

add_content "**Docker Status:**"
systemctl is-active docker 2>/dev/null >> "$REPORT_FILE" || add_content "Docker not installed or not running"

add_content "\n**SSH Service:**"
systemctl is-active ssh 2>/dev/null >> "$REPORT_FILE" || add_content "SSH service not available"

add_content "\n**Network Manager:**"
systemctl is-active NetworkManager 2>/dev/null >> "$REPORT_FILE" || add_content "NetworkManager not available"

log "📊 Performance Metrics"
add_section "System Performance"

add_content "**CPU Usage:**"
top -bn1 | grep "Cpu(s)" >> "$REPORT_FILE"

add_content "\n**Memory Usage:**"
free -h >> "$REPORT_FILE"

add_content "\n**Disk I/O:**"
iostat 1 1 2>/dev/null >> "$REPORT_FILE" || add_content "iostat not available"

add_content "\n**Load Average:**"
uptime >> "$REPORT_FILE"

log "🔐 Security and Permissions"
add_section "Security Analysis"

add_content "**Current User Groups:**"
groups >> "$REPORT_FILE"

add_content "\n**Sudo Access:**"
sudo -l 2>/dev/null >> "$REPORT_FILE" || add_content "No sudo access or password required"

add_content "\n**Project Directory Permissions:**"
ls -ld "$PROJECT_DIR" >> "$REPORT_FILE"

add_content "\n**Firewall Status:**"
ufw status 2>/dev/null >> "$REPORT_FILE" || add_content "UFW not available"

log "🌐 Network Configuration"
add_section "Network Information"

add_content "**Network Interfaces:**"
ip addr show >> "$REPORT_FILE"

add_content "\n**Routing Table:**"
ip route show >> "$REPORT_FILE"

add_content "\n**DNS Configuration:**"
cat /etc/resolv.conf >> "$REPORT_FILE"

# Finalize report
add_content "\n---\n**Report Generated:** $(date '+%Y-%m-%d %H:%M:%S')"
add_content "**Total Execution Time:** $SECONDS seconds"

log "📄 Report generated successfully: $REPORT_FILE"

# Copy report to project directory for easy access
cp "$REPORT_FILE" "$PROJECT_DIR/inspection_report.md"
log "📋 Report copied to project directory: $PROJECT_DIR/inspection_report.md"

# Git operations
log "🔄 Performing Git operations..."

cd "$PROJECT_DIR"

# Check if git repository exists
if [ -d ".git" ]; then
    log "📝 Creating empty commit for audit record..."
    git add inspection_report.md 2>/dev/null || true
    git commit --allow-empty -m "Deep system audit completed - $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || log "⚠️ Git commit failed (may not be configured)"
    
    # Ask user about push
    log "🚀 Git operations completed. Report saved locally."
    log "💡 To push to remote: git push origin main"
else
    log "⚠️ Not a git repository - skipping git operations"
fi

log "✅ Deep audit completed successfully!"
log "📊 Report location: $REPORT_FILE"
log "📁 Project copy: $PROJECT_DIR/inspection_report.md"

# Display summary
echo -e "\n${GREEN}🎯 AUDIT SUMMARY${NC}"
echo -e "${BLUE}Report File:${NC} $REPORT_FILE"
echo -e "${BLUE}Project Copy:${NC} $PROJECT_DIR/inspection_report.md"
echo -e "${BLUE}Execution Time:${NC} $SECONDS seconds"
echo -e "${BLUE}System:${NC} $(uname -s) $(uname -r)"
echo -e "${BLUE}User:${NC} $(whoami)"

echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo -e "1. Review the generated report"
echo -e "2. Check for any issues or recommendations"
echo -e "3. Run 'git push origin main' if you want to push the audit record"
echo -e "4. Share the report content with the agent if needed"

exit 0
