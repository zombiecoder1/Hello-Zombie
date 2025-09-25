#!/usr/bin/env python3
"""
🧟‍♂️ ZombieCoder AI - Smart Launcher
====================================
This script intelligently launches the ZombieCoder system with:
- Ollama integration and management
- FastAPI server with meta memory injection
- Real-time conversation monitoring
- Dynamic status updates
- Automatic memory cleanup
- One-click startup for all services
"""

import os
import sys
import subprocess
import socket
import time
import json
import threading
import psutil
import shutil
import platform
from pathlib import Path
import requests
import sqlite3
from datetime import datetime
import webbrowser
import signal

class ZombieCoderLauncher:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.server_dir = self.base_dir
        
        # Required ports for ZombieCoder
        self.ports = {
            "main_server": 12346,    # FastAPI server
            "ollama": 11434,         # Ollama server
        }
        
        # Required files and directories
        self.required_files = [
            "main_server.py",
            "requirements.txt",
            "index.html",
            "cmd.html",
            "config/agents/zombiecoder_meta.json",
            "config/agent_prompts/zombiecoder_system_prompt.txt",
            "data/memory",
            "logs"
        ]
        
        # Dependencies
        self.python_deps = [
            "fastapi", "uvicorn", "httpx", "pydantic", "pyyaml", "python-multipart"
        ]
        
        self.status = {
            "ports": {},
            "files": {},
            "dependencies": {},
            "services": {},
            "ollama_models": {},
            "conversations": 0,
            "memory_size": 0
        }
        
        self.processes = {}
        self.running = True
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        self.log("Received shutdown signal, cleaning up...", "INFO")
        self.running = False
        self.cleanup_processes()
        sys.exit(0)
        
    def log(self, message, level="INFO"):
        """Log messages with timestamp and emoji"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        emoji_map = {
            "INFO": "ℹ️",
            "SUCCESS": "✅", 
            "WARNING": "⚠️",
            "ERROR": "❌",
            "DEBUG": "🔍",
            "CHAT": "💬",
            "MEMORY": "🧠",
            "AGENT": "🧟‍♂️"
        }
        emoji = emoji_map.get(level, "ℹ️")
        print(f"[{timestamp}] {emoji} {level}: {message}")
        
    def kill_process_on_port(self, port):
        """Kill process running on specific port"""
        try:
            for proc in psutil.process_iter(['pid', 'name', 'connections']):
                try:
                    connections = proc.info['connections']
                    for conn in connections:
                        if conn.laddr.port == port:
                            self.log(f"Killing process {proc.info['name']} (PID: {proc.info['pid']}) on port {port}", "WARNING")
                            proc.terminate()
                            proc.wait(timeout=5)
                            self.log(f"Successfully killed process on port {port}", "SUCCESS")
                            return True
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
                    continue
        except Exception as e:
            self.log(f"Error killing process on port {port}: {e}", "ERROR")
        return False
        
    def check_port(self, port, service_name):
        """Check if port is available and kill conflicting processes"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                self.log(f"Port {port} ({service_name}) is in use", "WARNING")
                if self.kill_process_on_port(port):
                    time.sleep(2)  # Wait for process to fully terminate
                    # Re-check port
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(1)
                    result = sock.connect_ex(('localhost', port))
                    sock.close()
                    
            if result != 0:
                self.status["ports"][service_name] = True
                self.log(f"Port {port} ({service_name}) is available", "SUCCESS")
                return True
            else:
                self.status["ports"][service_name] = False
                self.log(f"Port {port} ({service_name}) is still in use after cleanup", "ERROR")
                return False
        except Exception as e:
            self.log(f"Error checking port {port}: {e}", "ERROR")
            return False
            
    def create_directory_structure(self):
        """Create necessary directory structure"""
        self.log("Creating directory structure...", "INFO")
        
        directories = [
            "data/memory", "logs", "config", "config/agents", 
            "config/agent_prompts", "scripts", "backup"
        ]
        
        for dir_path in directories:
            full_path = self.base_dir / dir_path
            if not full_path.exists():
                full_path.mkdir(parents=True, exist_ok=True)
                self.log(f"Created directory: {dir_path}", "SUCCESS")
                
    def check_required_files(self):
        """Check if all required files exist"""
        self.log("Checking required files...", "INFO")
        
        for file_path in self.required_files:
            full_path = self.base_dir / file_path
            if full_path.exists():
                self.status["files"][file_path] = True
                self.log(f"File exists: {file_path}", "SUCCESS")
            else:
                self.status["files"][file_path] = False
                self.log(f"Missing file: {file_path}", "WARNING")
                
    def check_python_dependency(self, package):
        """Check if Python package is installed"""
        try:
            __import__(package.replace('-', '_'))
            self.status["dependencies"][f"python_{package}"] = True
            self.log(f"Python package: {package}", "SUCCESS")
            return True
        except ImportError:
            self.status["dependencies"][f"python_{package}"] = False
            self.log(f"Missing Python package: {package}", "WARNING")
            return False
            
    def install_python_dependencies(self):
        """Install missing Python dependencies"""
        self.log("Installing Python dependencies...", "INFO")
        try:
            # Install requirements
            requirements_file = self.base_dir / "requirements.txt"
            if requirements_file.exists():
                subprocess.run([
                    sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
                ], check=True, capture_output=True)
                self.log("Python dependencies installed successfully", "SUCCESS")
                return True
            else:
                # Install individual packages
                for dep in self.python_deps:
                    subprocess.run([
                        sys.executable, "-m", "pip", "install", dep
                    ], check=True, capture_output=True)
                self.log("Python dependencies installed successfully", "SUCCESS")
                return True
        except subprocess.CalledProcessError as e:
            self.log(f"Failed to install Python dependencies: {e}", "ERROR")
            return False
            
    def check_ollama_installation(self):
        """Check if Ollama is installed and running"""
        self.log("Checking Ollama installation...", "INFO")
        try:
            # Check if ollama command exists
            result = subprocess.run(["ollama", "--version"], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                self.log("Ollama is installed", "SUCCESS")
                
                # Check if Ollama server is running
                try:
                    response = requests.get("http://localhost:11434/api/tags", timeout=5)
                    if response.status_code == 200:
                        self.log("Ollama server is running", "SUCCESS")
                        return True
                    else:
                        self.log("Ollama server is not running", "WARNING")
                        return False
                except:
                    self.log("Ollama server is not running", "WARNING")
                    return False
            else:
                self.log("Ollama is not installed", "ERROR")
                return False
        except Exception as e:
            self.log(f"Error checking Ollama: {e}", "ERROR")
            return False
            
    def start_ollama(self):
        """Start Ollama server"""
        self.log("Starting Ollama server...", "INFO")
        try:
            # Set environment variables for optimization
            env = os.environ.copy()
            env.update({
                "OLLAMA_MAX_LOADED_MODELS": "1",
                "OLLAMA_NUM_PARALLEL": "1",
                "OLLAMA_AUTO_CLEAN_MEMORY": "true",
                "OLLAMA_LAZY_LOAD": "true",
                "OLLAMA_MEMORY_LIMIT": "2GB"
            })
            
            ollama_process = subprocess.Popen(
                ["ollama", "serve"],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait for Ollama to start
            time.sleep(8)
            
            # Check if Ollama is running
            if self.check_server_running(11434):
                self.status["services"]["ollama"] = True
                self.processes["ollama"] = ollama_process
                self.log("Ollama server started successfully", "SUCCESS")
                return ollama_process
            else:
                self.log("Ollama server failed to start", "ERROR")
                return None
        except Exception as e:
            self.log(f"Error starting Ollama: {e}", "ERROR")
            return None
            
    def start_main_server(self):
        """Start the FastAPI main server"""
        self.log("Starting ZombieCoder Main Server...", "INFO")
        try:
            main_server_file = self.base_dir / "main_server.py"
            if main_server_file.exists():
                server_process = subprocess.Popen([
                    sys.executable, str(main_server_file)
                ], cwd=self.base_dir)
                
                # Wait for server to start
                time.sleep(5)
                
                # Check if server is running
                if self.check_server_running(12346):
                    self.status["services"]["main_server"] = True
                    self.processes["main_server"] = server_process
                    self.log("ZombieCoder Main Server started successfully", "SUCCESS")
                    return server_process
                else:
                    self.log("Main server failed to start", "ERROR")
                    return None
            else:
                self.log("main_server.py not found", "ERROR")
                return None
        except Exception as e:
            self.log(f"Error starting main server: {e}", "ERROR")
            return None
            
    def check_server_running(self, port):
        """Check if server is running on port"""
        try:
            response = requests.get(f"http://localhost:{port}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
            
    def get_ollama_models(self):
        """Get list of available Ollama models"""
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=10)
            if response.status_code == 200:
                data = response.json()
                models = [model["name"] for model in data.get("models", [])]
                self.status["ollama_models"] = models
                return models
            else:
                return []
        except:
            return []
            
    def get_conversation_stats(self):
        """Get conversation statistics"""
        try:
            db_path = self.base_dir / "data" / "memory" / "hello_zombie_memory.sqlite"
            if db_path.exists():
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                # Count conversations
                cursor.execute("SELECT COUNT(*) FROM conversations")
                count = cursor.fetchone()[0]
                
                # Get database size
                size = db_path.stat().st_size
                
                conn.close()
                
                self.status["conversations"] = count
                self.status["memory_size"] = size
                return count, size
            else:
                return 0, 0
        except Exception as e:
            self.log(f"Error getting conversation stats: {e}", "ERROR")
            return 0, 0
            
    def cleanup_old_memory(self):
        """Cleanup old conversation data"""
        try:
            db_path = self.base_dir / "data" / "memory" / "hello_zombie_memory.sqlite"
            if db_path.exists():
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                # Delete conversations older than 30 days
                cursor.execute("""
                    DELETE FROM conversations 
                    WHERE datetime(timestamp) < datetime('now', '-30 days')
                """)
                
                deleted_count = cursor.rowcount
                conn.commit()
                conn.close()
                
                if deleted_count > 0:
                    self.log(f"Cleaned up {deleted_count} old conversations", "MEMORY")
                return deleted_count
            else:
                return 0
        except Exception as e:
            self.log(f"Error cleaning up memory: {e}", "ERROR")
            return 0
            
    def open_dashboard(self):
        """Open the dashboard in browser"""
        try:
            webbrowser.open("file://" + str(self.base_dir / "index.html"))
            self.log("Dashboard opened in browser", "SUCCESS")
        except Exception as e:
            self.log(f"Could not open dashboard: {e}", "WARNING")
            
    def display_status(self):
        """Display current system status"""
        print("\n" + "="*60)
        print("🧟‍♂️ ZOMBIECODER SYSTEM STATUS")
        print("="*60)
        
        # Service Status
        print("📊 Service Status:")
        for service, status in self.status["services"].items():
            icon = "🟢" if status else "🔴"
            print(f"   {icon} {service.replace('_', ' ').title()}")
            
        # Port Status
        print("\n🔌 Port Status:")
        for service, port in self.ports.items():
            icon = "🟢" if self.status["ports"].get(service, False) else "🔴"
            print(f"   {icon} {service.replace('_', ' ').title()}: {port}")
            
        # Ollama Models
        models = self.status.get("ollama_models", [])
        print(f"\n🤖 Ollama Models: {len(models)}")
        for model in models[:3]:  # Show first 3 models
            print(f"   📦 {model}")
        if len(models) > 3:
            print(f"   ... and {len(models)-3} more")
            
        # Memory Stats
        conv_count, mem_size = self.get_conversation_stats()
        mem_size_mb = mem_size / (1024 * 1024)
        print(f"\n🧠 Memory Stats:")
        print(f"   💬 Conversations: {conv_count}")
        print(f"   💾 Database Size: {mem_size_mb:.2f} MB")
        
        print("="*60)
        
    def monitor_conversations(self):
        """Monitor real-time conversations"""
        last_count = 0
        last_cleanup = time.time()
        
        while self.running:
            try:
                # Get current conversation count
                current_count, _ = self.get_conversation_stats()
                
                # Check for new conversations
                if current_count > last_count:
                    new_conversations = current_count - last_count
                    self.log(f"New conversations detected: +{new_conversations}", "CHAT")
                    last_count = current_count
                    
                # Cleanup old memory every hour
                if time.time() - last_cleanup > 3600:  # 1 hour
                    cleaned = self.cleanup_old_memory()
                    if cleaned > 0:
                        self.log(f"Memory cleanup completed: {cleaned} old conversations removed", "MEMORY")
                    last_cleanup = time.time()
                    
                # Update status
                self.status["conversations"] = current_count
                
                time.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                self.log(f"Error in conversation monitoring: {e}", "ERROR")
                time.sleep(60)  # Wait longer on error
                
    def cleanup_processes(self):
        """Cleanup all processes"""
        self.log("Cleaning up processes...", "INFO")
        for name, process in self.processes.items():
            try:
                process.terminate()
                process.wait(timeout=5)
                self.log(f"Terminated {name}", "SUCCESS")
            except:
                try:
                    process.kill()
                    self.log(f"Force killed {name}", "WARNING")
                except:
                    pass
                    
    def run_system_check(self):
        """Run comprehensive system check"""
        self.log("Running ZombieCoder system check...", "INFO")
        
        # Create directory structure
        self.create_directory_structure()
        
        # Check required files
        self.check_required_files()
        
        # Check ports
        for service, port in self.ports.items():
            self.check_port(port, service)
            
        # Check dependencies
        for dep in self.python_deps:
            self.check_python_dependency(dep)
            
        # Install missing dependencies
        missing_deps = [k for k, v in self.status["dependencies"].items() if not v]
        if missing_deps:
            self.install_python_dependencies()
            
        # Check Ollama
        self.check_ollama_installation()
        
        self.log("System check completed", "SUCCESS")
        
    def launch_system(self):
        """Main launcher function"""
        print("🧟‍♂️ ZombieCoder AI - Smart Launcher")
        print("=" * 60)
        print(f"Platform: {platform.system()} {platform.release()}")
        print(f"Python: {sys.version}")
        print(f"Working Directory: {self.base_dir}")
        print("=" * 60)
        
        # Run system check
        self.run_system_check()
        
        # Start Ollama if not running
        if not self.check_server_running(11434):
            self.start_ollama()
            
        # Start main server
        self.start_main_server()
        
        # Get initial Ollama models
        self.get_ollama_models()
        
        # Open dashboard
        self.open_dashboard()
        
        # Display initial status
        self.display_status()
        
        # Start conversation monitoring in background thread
        monitor_thread = threading.Thread(target=self.monitor_conversations, daemon=True)
        monitor_thread.start()
        
        print("\n🚀 ZombieCoder system launched successfully!")
        print("💬 Real-time conversation monitoring active")
        print("🧠 Automatic memory cleanup enabled")
        print("📊 Status updates every 30 seconds")
        print("\nPress Ctrl+C to stop all services")
        
        # Keep the launcher running and display periodic status
        try:
            while self.running:
                time.sleep(60)  # Update status every minute
                
                # Check if services are still running
                for service, port in self.ports.items():
                    if not self.check_server_running(port):
                        self.log(f"{service} stopped, restarting...", "WARNING")
                        if service == "main_server":
                            self.start_main_server()
                        elif service == "ollama":
                            self.start_ollama()
                            
                # Display updated status
                self.display_status()
                
        except KeyboardInterrupt:
            self.log("Shutting down ZombieCoder system...", "INFO")
            self.cleanup_processes()
            print("\n👋 ZombieCoder system stopped. Goodbye!")

def main():
    """Main entry point"""
    launcher = ZombieCoderLauncher()
    launcher.launch_system()

if __name__ == "__main__":
    main()
