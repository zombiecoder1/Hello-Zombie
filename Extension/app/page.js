"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const theme_provider_1 = require("@/components/theme-provider");
const sonner_1 = require("@/components/ui/sonner");
const sidebar_1 = require("@/components/ui/sidebar");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const tabs_1 = require("@/components/ui/tabs");
// Import our components
const agent_mode_interface_1 = __importDefault(require("@/components/agent-mode-interface"));
const smart_input_interface_1 = __importDefault(require("@/components/smart-input-interface"));
const bengali_voice_system_1 = __importDefault(require("@/components/bengali-voice-system"));
const agent_executor_1 = require("@/components/agent-executor");
const mcp_manager_1 = require("@/components/mcp-manager");
const file_indexer_1 = require("@/components/file-indexer");
const model_detector_1 = require("@/components/model-detector");
const task_todo_manager_1 = require("@/components/task-todo-manager");
const lucide_react_1 = require("lucide-react");
function Home() {
    const [activeTab, setActiveTab] = (0, react_1.useState)("chat");
    const [statusMessage, setStatusMessage] = (0, react_1.useState)("🇧🇩 ZombieCoder AI Ready - বাংলা কোডিং সহায়ক");
    // Handle status updates from components
    const handleStatusUpdate = (message) => {
        setStatusMessage(message);
    };
    // Handle voice commands
    const handleVoiceCommand = (command) => {
        console.log("Voice command received:", command);
        setStatusMessage(`🎙️ Voice: ${command.bengali}`);
    };
    // Handle code generation
    const handleCodeGenerate = (code) => {
        console.log("Generated code:", code);
        setStatusMessage("✨ Code generated successfully!");
    };
    // Handle message submission
    const handleMessageSubmit = (message, context, agent) => {
        console.log("Message submitted:", { message, context, agent });
        setStatusMessage(`💬 Processing with ${agent}...`);
    };
    return (<theme_provider_1.ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <sidebar_1.SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-slate-950">
          {/* Sidebar */}
          <sidebar_1.Sidebar className="border-slate-800">
            <sidebar_1.SidebarHeader className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <lucide_react_1.Bot className="h-5 w-5 text-white"/>
                </div>
                <div>
                  <h1 className="font-bold text-white">ZombieCoder AI</h1>
                  <p className="text-xs text-slate-400">Bengali Privacy Editor</p>
                </div>
              </div>
            </sidebar_1.SidebarHeader>

            <sidebar_1.SidebarContent className="p-4">
              <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <tabs_1.TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <tabs_1.TabsTrigger value="chat" className="text-xs">
                    <lucide_react_1.MessageSquare className="h-3 w-3 mr-1"/>
                    Chat
                  </tabs_1.TabsTrigger>
                  <tabs_1.TabsTrigger value="tools" className="text-xs">
                    <lucide_react_1.Settings className="h-3 w-3 mr-1"/>
                    Tools
                  </tabs_1.TabsTrigger>
                </tabs_1.TabsList>

                <tabs_1.TabsContent value="chat" className="mt-4 space-y-4">
                  {/* Smart Input Interface */}
                  <card_1.Card className="bg-slate-900 border-slate-700">
                    <card_1.CardHeader className="pb-2">
                      <card_1.CardTitle className="text-sm flex items-center gap-2 text-white">
                        <lucide_react_1.Sparkles className="h-4 w-4"/>
                        Smart Input
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <smart_input_interface_1.default onSubmit={handleMessageSubmit} onVoiceCommand={handleVoiceCommand} placeholder="Write in Bengali or English..."/>
                    </card_1.CardContent>
                  </card_1.Card>

                  {/* Bengali Voice System */}
                  <bengali_voice_system_1.default onVoiceCommand={handleVoiceCommand} onStatusUpdate={handleStatusUpdate} onCodeGenerate={handleCodeGenerate}/>

                  {/* Task & Todo Manager */}
                  <task_todo_manager_1.TaskTodoManager onStatusUpdate={handleStatusUpdate}/>
                </tabs_1.TabsContent>

                <tabs_1.TabsContent value="tools" className="mt-4 space-y-4">
                  {/* File Indexer */}
                  <file_indexer_1.FileIndexer onStatusUpdate={handleStatusUpdate}/>

                  {/* Model Detector */}
                  <model_detector_1.ModelDetector onStatusUpdate={handleStatusUpdate}/>

                  {/* Agent Executor */}
                  <agent_executor_1.AgentExecutor onStatusUpdate={handleStatusUpdate}/>

                  {/* MCP Manager */}
                  <mcp_manager_1.MCPManager onStatusUpdate={handleStatusUpdate}/>
                </tabs_1.TabsContent>
              </tabs_1.Tabs>
            </sidebar_1.SidebarContent>
          </sidebar_1.Sidebar>

          {/* Main Content */}
          <sidebar_1.SidebarInset className="flex-1">
            <div className="flex flex-col h-full">
              {/* Status Bar */}
              <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <badge_1.Badge variant="outline" className="border-green-600 text-green-300">
                    Online
                  </badge_1.Badge>
                  <span className="text-sm text-slate-300">{statusMessage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <badge_1.Badge variant="secondary" className="text-xs">
                    Bengali Mode
                  </badge_1.Badge>
                  <badge_1.Badge variant="secondary" className="text-xs">
                    Privacy First
                  </badge_1.Badge>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="flex-1">
                <agent_mode_interface_1.default onMessage={(message) => {
            console.log("New message:", message);
            setStatusMessage(`💬 ${message.type === "user" ? "You" : "AI"}: Message sent`);
        }}/>
              </div>
            </div>
          </sidebar_1.SidebarInset>
        </div>

        <sonner_1.Toaster />
      </sidebar_1.SidebarProvider>
    </theme_provider_1.ThemeProvider>);
}
exports.default = Home;
//# sourceMappingURL=page.js.map