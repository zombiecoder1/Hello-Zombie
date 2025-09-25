/**
 * Hello Zombie VSCode Extension
 * Local AI coding assistant powered by Ollama
 */

import * as vscode from 'vscode';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

interface ChatRequest {
    agent: string;
    input: string;
    context?: any;
}

interface ChatResponse {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    model: string;
    success: boolean;
}

class HelloZombieProvider {
    private serverUrl: string;
    private requireConfirmation: boolean;
    private ollamaUrl: string;
    private enableOllamaFallback: boolean;
    private fallbackModel: string;
    private requestTimeoutMs: number;

    constructor() {
        const config = vscode.workspace.getConfiguration('helloZombie');
        this.serverUrl = config.get('serverUrl', 'http://localhost:12346');
        this.requireConfirmation = config.get('requireConfirmation', true);
        this.ollamaUrl = config.get('ollamaUrl', 'http://localhost:11434');
        this.enableOllamaFallback = config.get('enableOllamaFallback', true);
        this.fallbackModel = config.get('fallbackModel', 'gemma:2b');
        this.requestTimeoutMs = config.get('requestTimeoutMs', 30000);
    }

    private async makeHttpRequest(url: string, options: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                timeout: options.timeout || 5000
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (options.body) {
                req.write(JSON.stringify(options.body));
            }

            req.end();
        });
    }

    async checkServerHealth(): Promise<boolean> {
        try {
            const data = await this.makeHttpRequest(`${this.serverUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            return data.status === 'healthy';
        } catch (error) {
            console.error('Server health check failed:', error);
            return false;
        }
    }

    async sendChatMessage(input: string, context?: any): Promise<ChatResponse | null> {
        // Primary: attempt main server
        const payload: ChatRequest = {
            agent: 'hello_zombie',
            input: input,
            context: context
        };

        try {
            const data = await this.makeHttpRequest(`${this.serverUrl}/chat`, {
                method: 'POST',
                body: payload,
                timeout: this.requestTimeoutMs
            });
            return data as ChatResponse;
        } catch (primaryError) {
            console.error('Primary chat request failed:', primaryError);

            if (!this.enableOllamaFallback) {
                vscode.window.showErrorMessage(`Hello Zombie: ${primaryError}`);
                return null;
            }

            // Secondary: fallback to Ollama generate API
            try {
                const ollamaResp = await this.makeHttpRequest(`${this.ollamaUrl}/api/generate`, {
                    method: 'POST',
                    body: {
                        model: this.fallbackModel,
                        prompt: input,
                        stream: false
                    },
                    timeout: Math.min(this.requestTimeoutMs, 25000)
                });

                const now = new Date().toISOString();
                const fallback: ChatResponse = {
                    id: `ollama-${now}`,
                    author: 'ollama',
                    text: ollamaResp?.response ?? '',
                    timestamp: now,
                    model: this.fallbackModel,
                    success: true
                };

                vscode.window.showWarningMessage('Hello Zombie: Main server unavailable, used Ollama fallback.');
                return fallback;
            } catch (fallbackError) {
                console.error('Fallback to Ollama failed:', fallbackError);
                vscode.window.showErrorMessage('Hello Zombie: Both main server and Ollama fallback failed.');
                return null;
            }
        }
    }

    async executeTerminalCommand(command: string): Promise<void> {
        if (this.requireConfirmation) {
            const result = await vscode.window.showWarningMessage(
                `Hello Zombie wants to execute: ${command}`,
                'Allow',
                'Deny'
            );

            if (result !== 'Allow') {
                vscode.window.showInformationMessage('Command execution cancelled by user');
                return;
            }
        }

        const terminal = vscode.window.createTerminal('Hello Zombie');
        terminal.show();
        terminal.sendText(command);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Hello Zombie extension is now active!');

    const provider = new HelloZombieProvider();

    // Register commands
    const startChatCommand = vscode.commands.registerCommand('helloZombie.startChat', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'Ask Hello Zombie anything...',
            placeHolder: 'Type your question or request here'
        });

        if (input) {
            // Check server health first
            const isHealthy = await provider.checkServerHealth();
            if (!isHealthy) {
                vscode.window.showErrorMessage('Hello Zombie server is not responding. Please check if the main server is running.');
                return;
            }

            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Hello Zombie is thinking...",
                cancellable: false
            }, async (progress) => {
                const response = await provider.sendChatMessage(input);
                
                if (response && response.success) {
                    // Show response in a new document
                    const doc = await vscode.workspace.openTextDocument({
                        content: `Hello Zombie Response (${response.timestamp})\n\n${response.text}\n\n---\nModel: ${response.model}\nConversation ID: ${response.id}`,
                        language: 'markdown'
                    });
                    await vscode.window.showTextDocument(doc);
                }
            });
        }
    });

    const openPanelCommand = vscode.commands.registerCommand('helloZombie.openPanel', async () => {
        // Create and show a webview panel
        const panel = vscode.window.createWebviewPanel(
            'helloZombiePanel',
            'Hello Zombie Chat',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebviewContent(provider);

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'sendMessage':
                    const response = await provider.sendChatMessage(message.text);
                    if (response) {
                        panel.webview.postMessage({
                            command: 'response',
                            data: response
                        });
                    }
                    break;
                case 'executeCommand':
                    await provider.executeTerminalCommand(message.command);
                    break;
            }
        });
    });

    context.subscriptions.push(startChatCommand, openPanelCommand);

    // Show welcome message
    vscode.window.showInformationMessage('Hello Zombie is ready! Use Command Palette to start chatting.');
}

function getWebviewContent(provider: HelloZombieProvider): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello Zombie Chat</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
        }
        .chat-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .user-message {
            background-color: var(--vscode-input-background);
            border-left: 3px solid var(--vscode-focusBorder);
        }
        .ai-message {
            background-color: var(--vscode-editor-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
        }
        .input-container {
            display: flex;
            margin-top: 20px;
        }
        input[type="text"] {
            flex: 1;
            padding: 10px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
        }
        button {
            padding: 10px 20px;
            margin-left: 10px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .status {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2>🤖 Hello Zombie Chat</h2>
        <div class="status" id="status">Ready to chat with Hello Zombie!</div>
        <div id="messages"></div>
        <div class="input-container">
            <input type="text" id="messageInput" placeholder="Ask Hello Zombie anything..." />
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const status = document.getElementById('status');

        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user-message' : 'ai-message'}\`;
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text) return;

            addMessage(text, true);
            messageInput.value = '';
            status.textContent = 'Hello Zombie is thinking...';

            vscode.postMessage({
                command: 'sendMessage',
                text: text
            });
        }

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Handle messages from extension
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.command) {
                case 'response':
                    status.textContent = 'Ready to chat with Hello Zombie!';
                    addMessage(message.data.text);
                    break;
            }
        });
    </script>
</body>
</html>`;
}

export function deactivate() {
    console.log('Hello Zombie extension is now deactivated!');
}
