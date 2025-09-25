## Agent Brief: Routing and Branch Policy

### Conversation Routing
- Primary: main server at `http://localhost:12346` (`/chat`)
- Fallback: Ollama at `http://localhost:11434/api/generate` with configurable model
- Extension settings (in `Extension/package.json` contributes.configuration):
  - `helloZombie.serverUrl`
  - `helloZombie.ollamaUrl`
  - `helloZombie.enableOllamaFallback`
  - `helloZombie.fallbackModel`
  - `helloZombie.requestTimeoutMs`
  - `helloZombie.requireConfirmation`

### Branch Strategy
- `windows`: Windows-specific setup/scripts and configuration
- `linux`: Linux-specific setup/scripts and configuration
- `main`: stable, cross-platform tested; merge from `windows` and `linux`

### Implementation Notes
- VS Code extension now enforces main-server-first routing, with Ollama fallback on error/timeout.
- Terminal commands continue to respect `requireConfirmation`.

### Dependencies
- Server (Python): see `requirements.txt`
- Extension (VS Code): dev dependencies for TypeScript, ESLint, `vsce` for packaging

### Sidebar Workflow
- Activity Bar container: `helloZombieSidebar`, view: `helloZombieView` (Zombie Panel)
- Icon: `Extension/media/zombie-icon.svg`
- Provider: `ZombieSidebarProvider` registered in `src/extension.ts`
- UI: Agent dropdown, prompt input, file picker, submit/open panel buttons
- Actions:
  - Submit → triggers `helloZombie.startChat` (main server first, Ollama fallback)
  - Open Panel → opens the existing webview chat panel
  - Pick File → opens native picker; selected URI is posted back to webview


