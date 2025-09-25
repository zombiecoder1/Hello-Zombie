## Hello Zombie - Windows Install & Run

### 1) Clone (Windows branch)
```powershell
git clone -b windows https://github.com/zombiecoder1/Hello-Zombie.git
cd "Hello-Zombie"
```

### 2) Python server setup (PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r requirements.txt

# run main server
python .\main_server.py
# server: http://localhost:12346
```

### 3) Ollama check
```powershell
curl http://127.0.0.1:11434/api/tags
```

### 4) VS Code Extension (dev)
```powershell
cd Extension
npm install
npm install @vscode/webview-ui-toolkit
# Press F5 in VS Code to launch Extension Host
```

### 5) Build VSIX (optional)
```powershell
npm install -D vsce
npx vsce package
# In VS Code: Extensions → ... → Install from VSIX
```

### 6) Settings
- Hello Zombie → serverUrl: `http://localhost:12346`
- Fallback Ollama: `http://localhost:11434`, model: `gemma:2b`


