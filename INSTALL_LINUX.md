## Hello Zombie - Linux Install & Run (Ubuntu)

### 1) Clone (Linux branch)
```bash
git clone -b linux https://github.com/zombiecoder1/Hello-Zombie.git
cd "Hello-Zombie"
```

### 2) Python server setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt

# run main server
python main_server.py
# server: http://localhost:12346
```

### 3) Ollama check
```bash
curl -s http://127.0.0.1:11434/api/tags | jq .models[].name
```

### 4) VS Code Extension (dev)
```bash
cd "Extension"
npm install
npm install @vscode/webview-ui-toolkit
# launch dev host from VS Code (F5)
```

### 5) Build VSIX (optional)
```bash
npm install -D vsce
npx vsce package
# then install in VS Code: Extensions → ... → Install from VSIX
```

### 6) Settings
- Hello Zombie → serverUrl: `http://localhost:12346`
- Fallback Ollama: `http://localhost:11434`, model: `gemma:2b`


