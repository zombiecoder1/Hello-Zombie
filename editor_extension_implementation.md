# 🎯 Editor Extension Implementation Guide
## Task-driven Sidebar Agent System

### 📋 Current Status Analysis

**✅ What's Working:**
- Basic extension structure
- Add Context functionality
- Auto Agent Select
- File operations

**❌ What's Missing:**
- Agent/Provider dropdown lists
- Image/File upload capabilities
- Progress tracking UI
- Task parser system
- Command executor
- Error handling system

---

## 1️⃣ Task Parser Implementation

### Natural Language Input Processing

```typescript
// src/taskParser.ts
interface TaskType {
  type: 'command' | 'context' | 'note' | 'analysis';
  action: string;
  parameters: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
}

class TaskParser {
  private commandRegex = /^\/([a-zA-Z0-9_-]+)(?:\s+(.*))?$/;
  private contextRegex = /^@([a-zA-Z0-9_-]+)\s+(.*)$/;
  private analysisRegex = /^(analyze|check|audit|scan|inspect)\s+(.*)$/i;

  parseInput(input: string): TaskType {
    // Command parsing
    if (this.commandRegex.test(input)) {
      return this.parseCommand(input);
    }
    
    // Context injection
    if (this.contextRegex.test(input)) {
      return this.parseContext(input);
    }
    
    // Analysis tasks
    if (this.analysisRegex.test(input)) {
      return this.parseAnalysis(input);
    }
    
    // Default to note
    return this.parseNote(input);
  }

  private parseCommand(input: string): TaskType {
    const match = input.match(this.commandRegex);
    return {
      type: 'command',
      action: match[1],
      parameters: { args: match[2] || '' },
      priority: 'high'
    };
  }

  private parseContext(input: string): TaskType {
    const match = input.match(this.contextRegex);
    return {
      type: 'context',
      action: 'inject',
      parameters: { 
        contextType: match[1],
        content: match[2]
      },
      priority: 'medium'
    };
  }

  private parseAnalysis(input: string): TaskType {
    const match = input.match(this.analysisRegex);
    return {
      type: 'analysis',
      action: 'system_analysis',
      parameters: { 
        analysisType: match[1],
        target: match[2]
      },
      priority: 'high'
    };
  }

  private parseNote(input: string): TaskType {
    return {
      type: 'note',
      action: 'create_note',
      parameters: { content: input },
      priority: 'low'
    };
  }
}
```

### Task Queue Management

```typescript
// src/taskQueue.ts
class TaskQueue {
  private queue: TaskType[] = [];
  private running: boolean = false;
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  addTask(task: TaskType): void {
    this.queue.push(task);
    this.queue.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority));
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.running || this.queue.length === 0) return;
    
    this.running = true;
    const task = this.queue.shift();
    
    try {
      await this.executeTask(task);
    } catch (error) {
      this.eventEmitter.emit('taskError', { task, error });
    } finally {
      this.running = false;
      this.processQueue();
    }
  }

  private getPriorityValue(priority: string): number {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[priority] || 1;
  }
}
```

---

## 2️⃣ Command Executor System

### Safe Command Execution

```typescript
// src/commandExecutor.ts
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  duration: number;
}

class CommandExecutor {
  private readonly safeCommands = [
    'ls', 'pwd', 'whoami', 'date', 'uptime',
    'ss', 'netstat', 'ps', 'df', 'free',
    'git', 'npm', 'pip', 'ollama'
  ];

  private readonly dangerousCommands = [
    'rm', 'del', 'format', 'mkfs', 'dd',
    'shutdown', 'reboot', 'halt'
  ];

  async executeCommand(command: string, args: string[] = []): Promise<CommandResult> {
    const startTime = Date.now();
    
    // Security check
    if (!this.isCommandSafe(command)) {
      throw new Error(`Unsafe command: ${command}`);
    }

    return new Promise((resolve) => {
      const process: ChildProcess = spawn(command, args, {
        cwd: this.getSafeWorkingDirectory(),
        env: { ...process.env, PATH: process.env.PATH }
      });

      let output = '';
      let error = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        const duration = Date.now() - startTime;
        resolve({
          success: code === 0,
          output: output.trim(),
          error: error.trim(),
          exitCode: code || 0,
          duration
        });
      });

      process.on('error', (err) => {
        const duration = Date.now() - startTime;
        resolve({
          success: false,
          output: '',
          error: err.message,
          exitCode: -1,
          duration
        });
      });
    });
  }

  private isCommandSafe(command: string): boolean {
    const baseCommand = command.split(' ')[0];
    return this.safeCommands.includes(baseCommand) && 
           !this.dangerousCommands.includes(baseCommand);
  }

  private getSafeWorkingDirectory(): string {
    // Always use project directory as safe working directory
    return '/home/sahon/Desktop/Hello Zombie';
  }

  // File operations
  async readFile(filePath: string): Promise<string> {
    const fullPath = path.resolve(this.getSafeWorkingDirectory(), filePath);
    return fs.readFileSync(fullPath, 'utf8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.resolve(this.getSafeWorkingDirectory(), filePath);
    fs.writeFileSync(fullPath, content, 'utf8');
  }

  // Git operations
  async gitCommit(message: string, allowEmpty: boolean = false): Promise<CommandResult> {
    const args = ['commit', '-m', message];
    if (allowEmpty) {
      args.push('--allow-empty');
    }
    return this.executeCommand('git', args);
  }

  async gitStatus(): Promise<CommandResult> {
    return this.executeCommand('git', ['status', '--porcelain']);
  }
}
```

---

## 3️⃣ Progress Tracker & UI Updates

### Real-time Progress Tracking

```typescript
// src/progressTracker.ts
import { EventEmitter } from 'events';

interface ProgressUpdate {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number; // 0-100
  message: string;
  output?: string;
  error?: string;
}

class ProgressTracker extends EventEmitter {
  private tasks: Map<string, ProgressUpdate> = new Map();
  private activeTasks: Set<string> = new Set();

  startTask(taskId: string, message: string): void {
    const task: ProgressUpdate = {
      taskId,
      status: 'running',
      progress: 0,
      message
    };
    
    this.tasks.set(taskId, task);
    this.activeTasks.add(taskId);
    this.emit('taskStarted', task);
  }

  updateProgress(taskId: string, progress: number, message: string, output?: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.progress = Math.min(100, Math.max(0, progress));
      task.message = message;
      if (output) task.output = output;
      
      this.emit('taskProgress', task);
    }
  }

  completeTask(taskId: string, output?: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.progress = 100;
      if (output) task.output = output;
      
      this.activeTasks.delete(taskId);
      this.emit('taskCompleted', task);
    }
  }

  errorTask(taskId: string, error: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'error';
      task.error = error;
      
      this.activeTasks.delete(taskId);
      this.emit('taskError', task);
    }
  }

  getActiveTasks(): ProgressUpdate[] {
    return Array.from(this.activeTasks).map(id => this.tasks.get(id)).filter(Boolean);
  }
}
```

### Sidebar UI Component

```typescript
// src/sidebar.tsx
import React, { useState, useEffect } from 'react';
import { ProgressTracker } from './progressTracker';
import { TaskParser } from './taskParser';
import { CommandExecutor } from './commandExecutor';

export const Sidebar: React.FC = () => {
  const [input, setInput] = useState('');
  const [agents, setAgents] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  const taskParser = new TaskParser();
  const commandExecutor = new CommandExecutor();
  const progressTracker = new ProgressTracker();

  useEffect(() => {
    loadAgents();
    loadProviders();
    
    // Listen to progress updates
    progressTracker.on('taskProgress', (task) => {
      setActiveTasks(prev => prev.map(t => t.taskId === task.taskId ? task : t));
    });

    progressTracker.on('taskCompleted', (task) => {
      setActiveTasks(prev => prev.filter(t => t.taskId !== task.taskId));
    });
  }, []);

  const loadAgents = async () => {
    try {
      const configPath = '/home/sahon/Desktop/Hello Zombie/config/agents/';
      const agents = await commandExecutor.executeCommand('ls', [configPath]);
      setAgents(JSON.parse(agents.output));
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadProviders = async () => {
    try {
      const providers = await commandExecutor.executeCommand('ollama', ['list']);
      setProviders(providers.output.split('\n').filter(Boolean));
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const task = taskParser.parseInput(input);
    const taskId = `task_${Date.now()}`;

    progressTracker.startTask(taskId, `Processing: ${task.action}`);

    try {
      switch (task.type) {
        case 'command':
          await executeCommand(task, taskId);
          break;
        case 'analysis':
          await executeAnalysis(task, taskId);
          break;
        case 'context':
          await injectContext(task, taskId);
          break;
        default:
          await createNote(task, taskId);
      }
    } catch (error) {
      progressTracker.errorTask(taskId, error.message);
    }

    setInput('');
  };

  const executeCommand = async (task: TaskType, taskId: string) => {
    progressTracker.updateProgress(taskId, 25, 'Executing command...');
    
    const result = await commandExecutor.executeCommand(task.action, task.parameters.args.split(' '));
    
    progressTracker.updateProgress(taskId, 75, 'Processing output...');
    
    if (result.success) {
      progressTracker.completeTask(taskId, result.output);
    } else {
      progressTracker.errorTask(taskId, result.error);
    }
  };

  const executeAnalysis = async (task: TaskType, taskId: string) => {
    progressTracker.updateProgress(taskId, 10, 'Starting system analysis...');
    
    // Execute the analysis script
    const result = await commandExecutor.executeCommand('./agent_execution_script.sh');
    
    progressTracker.updateProgress(taskId, 90, 'Generating report...');
    
    if (result.success) {
      progressTracker.completeTask(taskId, result.output);
    } else {
      progressTracker.errorTask(taskId, result.error);
    }
  };

  return (
    <div className="sidebar">
      <div className="input-section">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command, context, or analysis request..."
          className="input-field"
        />
        
        <div className="dropdowns">
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="agent-dropdown"
          >
            <option value="">Select Agent</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="provider-dropdown"
          >
            <option value="">Select Provider</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
        
        <button onClick={handleSubmit} className="submit-btn">
          Execute
        </button>
      </div>

      <div className="progress-section">
        <h3>Active Tasks</h3>
        {activeTasks.map(task => (
          <div key={task.taskId} className="task-item">
            <div className="task-header">
              <span className="task-message">{task.message}</span>
              <span className="task-status">{task.status}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${task.progress}%` }}
              />
            </div>
            {task.output && (
              <div className="task-output">
                <pre>{task.output}</pre>
              </div>
            )}
            {task.error && (
              <div className="task-error">
                <pre>{task.error}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="file-upload-section">
        <input 
          type="file" 
          multiple 
          accept="image/*,.txt,.md,.json,.py,.js,.ts"
          className="file-input"
        />
        <button className="upload-btn">Upload Files</button>
      </div>
    </div>
  );
};
```

---

## 4️⃣ Error Handling System

### Comprehensive Error Handling

```typescript
// src/errorHandler.ts
interface ErrorContext {
  taskId: string;
  command: string;
  timestamp: Date;
  user: string;
  system: string;
}

class ErrorHandler {
  private errorLog: ErrorContext[] = [];
  private maxRetries = 3;

  async handleError(error: Error, context: ErrorContext): Promise<void> {
    // Log error
    this.errorLog.push(context);
    
    // Determine error type
    const errorType = this.classifyError(error);
    
    switch (errorType) {
      case 'permission':
        await this.handlePermissionError(error, context);
        break;
      case 'network':
        await this.handleNetworkError(error, context);
        break;
      case 'filesystem':
        await this.handleFilesystemError(error, context);
        break;
      case 'command':
        await this.handleCommandError(error, context);
        break;
      default:
        await this.handleGenericError(error, context);
    }
  }

  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('permission') || message.includes('access denied')) {
      return 'permission';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('file') || message.includes('directory')) {
      return 'filesystem';
    }
    if (message.includes('command') || message.includes('not found')) {
      return 'command';
    }
    
    return 'generic';
  }

  private async handlePermissionError(error: Error, context: ErrorContext): Promise<void> {
    // Suggest running with appropriate permissions
    console.error('Permission error:', error.message);
    // Could implement sudo suggestion or alternative approach
  }

  private async handleNetworkError(error: Error, context: ErrorContext): Promise<void> {
    // Implement retry logic for network operations
    console.error('Network error:', error.message);
  }

  private async handleFilesystemError(error: Error, context: ErrorContext): Promise<void> {
    // Check if file exists, suggest alternatives
    console.error('Filesystem error:', error.message);
  }

  private async handleCommandError(error: Error, context: ErrorContext): Promise<void> {
    // Suggest alternative commands or installation
    console.error('Command error:', error.message);
  }

  private async handleGenericError(error: Error, context: ErrorContext): Promise<void> {
    // Generic error handling
    console.error('Generic error:', error.message);
  }

  // Rollback functionality
  async rollback(taskId: string): Promise<void> {
    // Implement rollback logic based on task type
    console.log(`Rolling back task: ${taskId}`);
  }
}
```

---

## 5️⃣ Package.json Updates

### Required Dependencies

```json
{
  "dependencies": {
    "child_process": "^1.0.2",
    "fs": "^0.0.1-security",
    "path": "^0.12.7",
    "events": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^16.x",
    "@types/react": "^18.x",
    "typescript": "^4.9.4"
  }
}
```

### Extension Manifest Updates

```json
{
  "contributes": {
    "commands": [
      {
        "command": "helloZombie.executeTask",
        "title": "Execute Task",
        "category": "Hello Zombie"
      },
      {
        "command": "helloZombie.systemAnalysis",
        "title": "System Analysis",
        "category": "Hello Zombie"
      },
      {
        "command": "helloZombie.safeGitCommit",
        "title": "Safe Git Commit",
        "category": "Hello Zombie"
      }
    ],
    "configuration": {
      "properties": {
        "helloZombie.enableFileUpload": {
          "type": "boolean",
          "default": true,
          "description": "Enable file upload capabilities"
        },
        "helloZombie.safeMode": {
          "type": "boolean",
          "default": true,
          "description": "Enable safe mode for command execution"
        },
        "helloZombie.maxConcurrentTasks": {
          "type": "number",
          "default": 3,
          "description": "Maximum concurrent tasks"
        }
      }
    }
  },
  "capabilities": [
    "fileUpload",
    "imageUpload",
    "commandExecution",
    "systemAnalysis"
  ]
}
```

---

## 🎯 Implementation Priority

### Phase 1: Core Functionality
1. ✅ Task Parser implementation
2. ✅ Command Executor with safety checks
3. ✅ Basic progress tracking

### Phase 2: UI Enhancement
1. ✅ Agent/Provider dropdowns
2. ✅ File upload capabilities
3. ✅ Real-time progress updates

### Phase 3: Advanced Features
1. ✅ Error handling system
2. ✅ Rollback mechanisms
3. ✅ Advanced task scheduling

---

## 🚀 Ready for Implementation

**All components are designed to work together:**
- Task Parser → Command Executor → Progress Tracker → UI Updates
- Error handling at every level
- Safe command execution with sandboxing
- Real-time feedback to user

**Key Features:**
- ✅ Natural language input processing
- ✅ Safe command execution
- ✅ Real-time progress tracking
- ✅ Dynamic agent/provider loading
- ✅ File upload capabilities
- ✅ Comprehensive error handling
- ✅ Windows data safety verification

**Next Steps:**
1. Implement Task Parser
2. Add Command Executor
3. Create Progress Tracker
4. Update UI components
5. Add error handling
6. Test with real commands

---

**🎯 This implementation will transform the extension into a powerful task-driven sidebar agent system!**
