# Cursor AI Default Input Box - Quick Guide

## What this is
- Use Cursor’s default input box to chat/code with the Hello Zombie project.
- Works best with the main server routing (primary) and Ollama fallback (secondary).

## Recommended prompts
- Project-aware: "Open the Hello Zombie Extension and add a new command to call /chat"
- Branch-aware: "Switch to linux branch and update INSTALL_LINUX.md"
- Server tasks: "Start FastAPI main_server.py and verify /health is healthy"
- Extension tasks: "Run the VS Code extension host and open the sidebar"

## Ground rules for prompts
- Always mention the target branch: windows or linux
- Prefer non-interactive commands (use flags like --yes)
- Ask for verification logs (health, ports, curl output)

## Main server routing
- Primary: http://localhost:12346
- Fallback: http://127.0.0.1:11434 (Ollama, model: gemma:2b)
- The extension is already configured to use primary then fallback on failure.

## Useful checks
```bash
# Health
curl -s http://localhost:12346/health

# Chat test
curl -s -X POST http://localhost:12346/chat \
  -H 'Content-Type: application/json' \
  -d '{"agent":"hello_zombie","input":"Say hello","context":{"source":"cursor"}}'

# Ollama tags
curl -s http://127.0.0.1:11434/api/tags
```

## Safety
- Command execution in the editor requires confirmation (extension setting)
- Avoid destructive commands unless explicitly requested
