import * as vscode from 'vscode';

export class ZombieSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'helloZombieView';

    constructor(private readonly extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.extensionUri, 'media')
            ]
        };

        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'submit':
                    await vscode.commands.executeCommand('helloZombie.startChat');
                    break;
                case 'openPanel':
                    await vscode.commands.executeCommand('helloZombie.openPanel');
                    break;
                case 'pickFile':
                    const files = await vscode.window.showOpenDialog({ canSelectMany: false });
                    if (files && files[0]) {
                        webviewView.webview.postMessage({ command: 'filePicked', uri: files[0].toString() });
                    }
                    break;
            }
        });
    }

    private getHtml(webview: vscode.Webview): string {
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Zombie Sidebar</title>
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-sideBar-background); }
    .container { padding: 12px; }
    .row { margin-bottom: 8px; }
    label { display:block; margin-bottom:4px; }
    select, input[type=text] { width:100%; padding:6px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
    button { padding:6px 10px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; }
    button:hover { background: var(--vscode-button-hoverBackground); }
  </style>
  </head>
<body>
  <div class="container">
    <div class="row">
      <label>Agent</label>
      <select id="agent">
        <option value="hello_zombie">Hello Zombie</option>
        <option value="coder">Coder</option>
      </select>
    </div>
    <div class="row">
      <label>Prompt</label>
      <input id="prompt" type="text" placeholder="Describe your request..." />
    </div>
    <div class="row">
      <button id="pick">Pick File</button>
      <span id="fileLabel" style="margin-left:6px; font-size: 12px; color: var(--vscode-descriptionForeground);"></span>
    </div>
    <div class="row">
      <button id="submit">Send</button>
      <button id="openPanel" style="margin-left:6px;">Open Panel</button>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.getElementById('submit').addEventListener('click', () => {
      const agent = document.getElementById('agent').value;
      const prompt = document.getElementById('prompt').value;
      vscode.postMessage({ command: 'submit', agent, prompt });
    });
    document.getElementById('openPanel').addEventListener('click', () => {
      vscode.postMessage({ command: 'openPanel' });
    });
    document.getElementById('pick').addEventListener('click', () => {
      vscode.postMessage({ command: 'pickFile' });
    });
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.command === 'filePicked') {
        const label = document.getElementById('fileLabel');
        label.textContent = msg.uri;
      }
    });
  </script>
</body>
</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


