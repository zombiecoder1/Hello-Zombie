# 🎯 এজেন্টের জন্য Deep System Analysis Instructions

## 📋 Task Overview
আপনাকে comprehensive system analysis করতে হবে যা Windows partition safety সহ সব aspects cover করবে।

---

## 1️⃣ Ports & Services Check

### Command Sequence:
```bash
# Main system ports check
ss -ltnp | grep -E "(LISTEN|ESTAB)"

# Specific service ports
ss -ltnp | grep -E "(3000|5000|8000|8080|11434|3306|5432|6379)"

# Process details for listening ports
ss -ltnp | awk '/LISTEN/ {print $4, $6}' | sort -u

# Service status check
systemctl list-units --type=service --state=running | grep -E "(mysql|postgres|redis|ollama|docker)"
```

### Expected Output Analysis:
- **Local Development**: Ports 3000, 5000, 8000, 8080
- **AI Services**: Port 11434 (Ollama)
- **Database**: Ports 3306 (MySQL), 5432 (PostgreSQL)
- **Cache**: Port 6379 (Redis)

### Report Format:
```
🔌 PORT MAPPING REPORT
=====================
Port 11434: Ollama AI Service (PID: XXXX)
Port 3306: MySQL Database (PID: XXXX)
Port 3000: Next.js Dev Server (PID: XXXX)
...
```

---

## 2️⃣ Extensions অবস্থান বিশ্লেষণ

### Directory Structure Analysis:
```bash
# Full extensions directory listing
find /home/sahon/Desktop/Hello\ Zombie/Extension -type f -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.py" | head -20

# Package.json analysis
cat /home/sahon/Desktop/Hello\ Zombie/Extension/package.json | jq '.'

# Requirements.txt check
find /home/sahon/Desktop/Hello\ Zombie -name "requirements.txt" -exec cat {} \;

# Extension manifest check
find /home/sahon/Desktop/Hello\ Zombie/Extension -name "*.json" -exec grep -l "contributes\|activationEvents" {} \;
```

### Dependency Verification:
```bash
# Node.js dependencies
cd /home/sahon/Desktop/Hello\ Zombie/Extension && npm list --depth=0

# Python dependencies
pip list | grep -E "(fastapi|uvicorn|httpx|pydantic)"

# Extension type detection
grep -r "vscode\|cursor" /home/sahon/Desktop/Hello\ Zombie/Extension/package.json
```

### Report Format:
```
📁 EXTENSIONS ANALYSIS
=====================
Extension Type: VSCode/Cursor Extension
Main Dependencies: 
- Node.js: @types/vscode, typescript
- Python: fastapi, uvicorn, httpx
- AI Integration: Ollama client

Architecture: Plugin-based with AI agent integration
```

---

## 3️⃣ Safe Git Commit

### Git Operations:
```bash
cd /home/sahon/Desktop/Hello\ Zombie

# Check git status
git status

# Create empty commit with timestamp
git commit --allow-empty -m "System audit completed - $(date '+%Y-%m-%d %H:%M:%S')"

# Get commit hash
COMMIT_HASH=$(git rev-parse HEAD)
echo "Commit Hash: $COMMIT_HASH"

# Show commit details
git log --oneline -1
```

### Report Format:
```
🔒 SAFE GIT COMMIT
=================
Status: ✅ Clean codebase maintained
Commit Hash: abc123def456...
Commit Message: System audit completed - 2025-09-25 10:30:21
Branch: main (or current branch)
```

---

## 4️⃣ Windows Mounts Handling

### Current Mount Status:
```bash
# Check all mounted filesystems
df -h | grep -E "(ntfs|vfat|exfat)"

# Detailed mount information
mount | grep -E "(ntfs|vfat|exfat)"

# Windows partition detection
lsblk -f | grep -i ntfs

# Check auto-mount settings
cat /etc/fstab | grep -E "(ntfs|vfat|exfat)" || echo "No auto-mount entries found"
```

### Disable Auto-mount (if needed):
```bash
# Check current fstab
sudo cat /etc/fstab

# Backup fstab
sudo cp /etc/fstab /etc/fstab.backup.$(date +%Y%m%d)

# Example: Comment out auto-mount entries
# sudo sed -i 's/^UUID=.*ntfs/#&/' /etc/fstab
```

### Report Format:
```
💾 WINDOWS MOUNTS STATUS
========================
Currently Mounted:
- /dev/sdc2: Sarver (NTFS) - /media/sahon/Sarver
- /dev/sdb1: Word-Press (NTFS) - Not mounted
- /dev/sdb2: Videos (NTFS) - Not mounted

Auto-mount Status: ❌ Disabled (safe)
Recommendation: Keep current setup for data safety
```

---

## 5️⃣ Extensions Capabilities Analysis

### Extension Type Detection:
```bash
# Check extension manifest
cat /home/sahon/Desktop/Hello\ Zombie/Extension/package.json | jq '.contributes'

# Check for AI integration
grep -r "ollama\|ai\|agent" /home/sahon/Desktop/Hello\ Zombie/Extension/

# Check for provider patterns
find /home/sahon/Desktop/Hello\ Zombie -name "*.py" -exec grep -l "provider\|agent\|model" {} \;
```

### Capability Assessment:
```bash
# Check for lazy loading patterns
grep -r "lazy\|dynamic\|plugin" /home/sahon/Desktop/Hello\ Zombie/Extension/

# Check for modular architecture
find /home/sahon/Desktop/Hello\ Zombie -name "*.json" -exec grep -l "config\|settings" {} \;
```

### Report Format:
```
🚀 EXTENSIONS CAPABILITIES
==========================
Current Architecture: Hybrid (VSCode Extension + AI Agents)

Capabilities:
✅ Dynamic AI System Expansion
✅ Plugin Architecture Support
✅ Lazy Loading Ready
✅ Modular Provider System

Potential Enhancements:
- Browser/Frontend Extension Integration
- Custom AI Provider Addition
- Dev Workflow Automation
- Model Interaction Interface
```

---

## 6️⃣ Windows Data Safety Check

### Critical Safety Verification:
```bash
# Check for any write operations to Windows partitions
lsof | grep -E "(ntfs|vfat)" | grep -v "ro"

# Check mount options (should be read-only or safe)
mount | grep -E "(ntfs|vfat)" | grep -v "ro"

# Check for any scheduled operations
crontab -l | grep -E "(ntfs|vfat|windows)" || echo "No Windows-related cron jobs"

# Check for any backup operations that might affect Windows data
ps aux | grep -E "(rsync|tar|dd)" | grep -E "(ntfs|vfat|windows)" || echo "No Windows data operations running"
```

### Safety Report:
```
🛡️ WINDOWS DATA SAFETY
======================
Status: ✅ SAFE
- No write operations to Windows partitions
- All mounts are read-only or safe
- No scheduled operations affecting Windows data
- No backup operations targeting Windows partitions

Recommendation: Current setup is safe for Windows data
```

---

## 📋 Final Report Template

```
🎯 COMPREHENSIVE SYSTEM ANALYSIS REPORT
=======================================

📅 Generated: $(date '+%Y-%m-%d %H:%M:%S')
🖥️ System: $(uname -a)
👤 User: $(whoami)

🔌 PORTS & SERVICES
==================
[Port mapping details here]

📁 EXTENSIONS ANALYSIS  
=====================
[Extension details here]

🔒 SAFE GIT COMMIT
=================
[Git commit details here]

💾 WINDOWS MOUNTS
================
[Mount status here]

🚀 EXTENSIONS CAPABILITIES
==========================
[Capability analysis here]

🛡️ WINDOWS DATA SAFETY
======================
[Safety verification here]

📊 SUMMARY
==========
- Total Services Running: X
- Extensions Available: X
- Windows Partitions: X (Safe)
- Git Status: Clean
- Recommendations: [List key recommendations]
```

---

## ⚠️ Important Notes

1. **Windows Data Safety**: সবসময় Windows partitions read-only mount রাখুন
2. **Git Operations**: শুধুমাত্র empty commit ব্যবহার করুন
3. **Service Check**: সব running services-এর port mapping verify করুন
4. **Extension Analysis**: VSCode/Cursor plugin vs custom modules distinguish করুন
5. **Mount Safety**: Auto-mount disable করুন যদি Windows data safety প্রয়োজন

## 🎯 Expected Deliverables

1. ✅ Complete port mapping report
2. ✅ Extensions directory analysis
3. ✅ Git commit hash
4. ✅ Windows mount status
5. ✅ Extensions capability assessment
6. ✅ Windows data safety verification
7. ✅ Comprehensive final report

---

**🚀 Ready for Agent Execution!**
