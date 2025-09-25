"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZombieCoderIntegration = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const scroll_area_1 = require("@/components/ui/scroll-area");
const alert_1 = require("@/components/ui/alert");
const switch_1 = require("@/components/ui/switch");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
function ZombieCoderIntegration({ onConnectionChange, onAgentResponse, onStatusUpdate, }) {
    const [connection, setConnection] = (0, react_1.useState)({
        status: "disconnected",
        serverUrl: "http://localhost:5000",
        latency: 0,
        version: "",
        agents: [],
    });
    const [selectedAgent, setSelectedAgent] = (0, react_1.useState)("zombiecoder");
    const [autoConnect, setAutoConnect] = (0, react_1.useState)(true);
    const [isConnecting, setIsConnecting] = (0, react_1.useState)(false);
    const [customUrl, setCustomUrl] = (0, react_1.useState)("http://localhost:5000");
    // Available ZombieCoder agents
    const availableAgents = [
        {
            id: "zombiecoder",
            name: "ZombieCoder AI",
            description: "Main Bengali coding assistant",
            bengaliDescription: "প্রধান বাংলা কোডিং সহায়ক",
            status: "offline",
            capabilities: ["code-generation", "bengali-support", "voice-commands", "debugging"],
            icon: <lucide_react_1.Bot className="h-4 w-4"/>,
        },
        {
            id: "procoder",
            name: "Procoder",
            description: "Professional coding assistant",
            bengaliDescription: "পেশাদার কোডিং সহায়ক",
            status: "offline",
            capabilities: ["coding", "programming", "algorithms"],
            icon: <lucide_react_1.Code className="h-4 w-4"/>,
        },
        {
            id: "creative",
            name: "Creative Writer",
            description: "Creative content generator",
            bengaliDescription: "সৃজনশীল কন্টেন্ট জেনারেটর",
            status: "offline",
            capabilities: ["story-writing", "poetry", "creative-content"],
            icon: <lucide_react_1.FileText className="h-4 w-4"/>,
        },
        {
            id: "translator",
            name: "Translation Agent",
            description: "Language translation specialist",
            bengaliDescription: "ভাষা অনুবাদ বিশেষজ্ঞ",
            status: "offline",
            capabilities: ["translation", "language-support", "localization"],
            icon: <lucide_react_1.MessageSquare className="h-4 w-4"/>,
        },
        {
            id: "analyzer",
            name: "DB Analyzer",
            description: "Database analysis expert",
            bengaliDescription: "ডাটাবেস বিশ্লেষণ বিশেষজ্ঞ",
            status: "offline",
            capabilities: ["database-analysis", "data-processing", "optimization"],
            icon: <lucide_react_1.Database className="h-4 w-4"/>,
        },
        {
            id: "business",
            name: "Business Agent",
            description: "Business consultation assistant",
            bengaliDescription: "ব্যবসায়িক পরামর্শ সহায়ক",
            status: "offline",
            capabilities: ["business-advice", "consultation", "planning"],
            icon: <lucide_react_1.User className="h-4 w-4"/>,
        },
    ];
    // Connect to ZombieCoder server
    const connectToServer = (0, react_1.useCallback)(async () => {
        setIsConnecting(true);
        setConnection((prev) => ({ ...prev, status: "connecting" }));
        onStatusUpdate?.("🔗 Connecting to ZombieCoder server...");
        try {
            // Simulate connection attempt
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Simulate connection success/failure
            const success = Math.random() > 0.3; // 70% success rate
            if (success) {
                const connectedAgents = availableAgents.map((agent) => ({
                    ...agent,
                    status: Math.random() > 0.2 ? "online" : "offline",
                }));
                setConnection({
                    status: "connected",
                    serverUrl: customUrl,
                    latency: Math.floor(Math.random() * 100) + 50,
                    version: "v2.1.0",
                    agents: connectedAgents,
                });
                onConnectionChange?.(true);
                onStatusUpdate?.(`✅ Connected to ZombieCoder server (${customUrl})`);
            }
            else {
                setConnection((prev) => ({
                    ...prev,
                    status: "error",
                    agents: availableAgents.map((agent) => ({ ...agent, status: "offline" })),
                }));
                onConnectionChange?.(false);
                onStatusUpdate?.("❌ Failed to connect to ZombieCoder server");
            }
        }
        catch (error) {
            setConnection((prev) => ({
                ...prev,
                status: "error",
                agents: availableAgents.map((agent) => ({ ...agent, status: "offline" })),
            }));
            onConnectionChange?.(false);
            onStatusUpdate?.("❌ Connection error occurred");
        }
        setIsConnecting(false);
    }, [customUrl, onConnectionChange, onStatusUpdate]);
    // Disconnect from server
    const disconnectFromServer = (0, react_1.useCallback)(() => {
        setConnection((prev) => ({
            ...prev,
            status: "disconnected",
            latency: 0,
            agents: availableAgents.map((agent) => ({ ...agent, status: "offline" })),
        }));
        onConnectionChange?.(false);
        onStatusUpdate?.("❌ Disconnected from ZombieCoder server");
    }, [onConnectionChange, onStatusUpdate]);
    // Send message to agent
    const sendToAgent = (0, react_1.useCallback)(async (agentId, message) => {
        if (connection.status !== "connected")
            return;
        const agent = connection.agents.find((a) => a.id === agentId);
        if (!agent || agent.status !== "online")
            return;
        onStatusUpdate?.(`🤖 Sending to ${agent.name}: ${message.slice(0, 30)}...`);
        // Simulate agent processing
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Generate mock response
        const responses = [
            `আমি ${agent.name} হিসেবে আপনার প্রশ্নের উত্তর দিচ্ছি। আপনার কোড বিশ্লেষণ করে আমি সাহায্য করতে পারি।`,
            `${agent.bengaliDescription} হিসেবে আমি আপনাকে সহায়তা করব। আপনার প্রশ্নটি খুবই গুরুত্বপূর্ণ।`,
            `আপনার কোডিং সমস্যার সমাধান আমি দিতে পারি। ${agent.name} এর মাধ্যমে আরো ভালো ফলাফল পাবেন।`,
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        onAgentResponse?.(response);
        onStatusUpdate?.(`✅ Response from ${agent.name}`);
        // Update last used time
        setConnection((prev) => ({
            ...prev,
            agents: prev.agents.map((a) => (a.id === agentId ? { ...a, lastUsed: new Date() } : a)),
        }));
    }, [connection, onAgentResponse, onStatusUpdate]);
    // Auto-connect on mount
    (0, react_1.useEffect)(() => {
        if (autoConnect) {
            connectToServer();
        }
    }, [autoConnect, connectToServer]);
    const getStatusIcon = (status) => {
        switch (status) {
            case "connected":
                return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-400"/>;
            case "connecting":
                return <lucide_react_1.RefreshCw className="h-4 w-4 text-yellow-400 animate-spin"/>;
            case "error":
                return <lucide_react_1.XCircle className="h-4 w-4 text-red-400"/>;
            default:
                return <lucide_react_1.WifiOff className="h-4 w-4 text-gray-400"/>;
        }
    };
    const getAgentStatusIcon = (status) => {
        switch (status) {
            case "online":
                return <lucide_react_1.CheckCircle className="h-3 w-3 text-green-400"/>;
            case "busy":
                return <lucide_react_1.RefreshCw className="h-3 w-3 text-yellow-400"/>;
            case "error":
                return <lucide_react_1.XCircle className="h-3 w-3 text-red-400"/>;
            default:
                return <lucide_react_1.AlertTriangle className="h-3 w-3 text-gray-400"/>;
        }
    };
    const onlineAgents = connection.agents.filter((a) => a.status === "online");
    const selectedAgentData = connection.agents.find((a) => a.id === selectedAgent);
    return (<card_1.Card className="bg-slate-800 border-slate-700">
      <card_1.CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="text-sm flex items-center gap-2 text-white">
            <lucide_react_1.Bot className="h-4 w-4"/>
            ZombieCoder Integration
          </card_1.CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(connection.status)}
            <badge_1.Badge variant="outline" className={`text-xs ${connection.status === "connected"
            ? "border-green-600 text-green-300"
            : "border-red-600 text-red-300"}`}>
              {connection.status}
            </badge_1.Badge>
          </div>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        {/* Connection Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label_1.Label className="text-sm text-gray-300">Auto Connect:</label_1.Label>
            <switch_1.Switch checked={autoConnect} onCheckedChange={setAutoConnect}/>
          </div>

          <div className="space-y-2">
            <label_1.Label className="text-sm text-gray-300">Server URL:</label_1.Label>
            <div className="flex gap-2">
              <input_1.Input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="http://localhost:5000" className="bg-slate-700 border-slate-600 text-white text-xs" disabled={connection.status === "connected"}/>
              {connection.status === "connected" ? (<button_1.Button size="sm" onClick={disconnectFromServer} className="h-8 bg-red-600 hover:bg-red-700">
                  <lucide_react_1.WifiOff className="h-3 w-3"/>
                </button_1.Button>) : (<button_1.Button size="sm" onClick={connectToServer} disabled={isConnecting} className="h-8 bg-green-600 hover:bg-green-700">
                  {isConnecting ? (<lucide_react_1.RefreshCw className="h-3 w-3 animate-spin"/>) : (<lucide_react_1.Wifi className="h-3 w-3"/>)}
                </button_1.Button>)}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {connection.status === "connected" && (<alert_1.Alert className="bg-green-900/20 border-green-700">
            <lucide_react_1.Zap className="h-4 w-4"/>
            <alert_1.AlertDescription className="text-sm">
              <strong>Connected:</strong> {connection.serverUrl} 
              ({connection.latency}ms) • v{connection.version}
            </alert_1.AlertDescription>
          </alert_1.Alert>)}

        {/* Agent Selection */}
        {onlineAgents.length > 0 && (<div className="space-y-2">
            <label_1.Label className="text-sm text-gray-300">Active Agent:</label_1.Label>
            <select_1.Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <select_1.SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <div className="flex items-center gap-2">
                  {selectedAgentData?.icon}
                  <select_1.SelectValue />
                </div>
              </select_1.SelectTrigger>
              <select_1.SelectContent className="bg-slate-800 border-slate-600">
                {onlineAgents.map((agent) => (<select_1.SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      {agent.icon}
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-slate-400">{agent.bengaliDescription}</div>
                      </div>
                    </div>
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>
          </div>)}

        {/* Agents List */}
        <div className="space-y-2">
          <label_1.Label className="text-sm text-gray-300">Available Agents ({onlineAgents.length}):</label_1.Label>
          <scroll_area_1.ScrollArea className="h-48">
            <div className="space-y-2">
              {connection.agents.map((agent) => (<div key={agent.id} className={`border rounded p-3 space-y-2 ${selectedAgent === agent.id && agent.status === "online"
                ? "border-blue-600 bg-blue-900/10"
                : "border-slate-600"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {agent.icon}
                      <span className="text-sm font-medium text-white">
                        {agent.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAgentStatusIcon(agent.status)}
                      <badge_1.Badge variant="outline" className="text-xs border-slate-500 text-gray-300">
                        {agent.status}
                      </badge_1.Badge>
                    </div>
                  </div>

                  <div className="text-xs text-blue-300 bengali-text">
                    🇧🇩 {agent.bengaliDescription}
                  </div>

                  <div className="text-xs text-gray-400">
                    {agent.description}
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((capability) => (<badge_1.Badge key={capability} variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {capability}
                      </badge_1.Badge>))}
                  </div>

                  {/* Last Used */}
                  {agent.lastUsed && (<div className="text-xs text-gray-500">
                      Last used: {agent.lastUsed.toLocaleTimeString()}
                    </div>)}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {agent.status === "online" && (<>
                        {selectedAgent !== agent.id && (<button_1.Button size="sm" onClick={() => setSelectedAgent(agent.id)} className="h-6 text-xs bg-blue-600 hover:bg-blue-700">
                            <lucide_react_1.Zap className="h-3 w-3 mr-1"/>
                            Select
                          </button_1.Button>)}
                        <button_1.Button size="sm" onClick={() => sendToAgent(agent.id, "Hello, can you help me with coding?")} className="h-6 text-xs bg-purple-600 hover:bg-purple-700">
                          <lucide_react_1.MessageSquare className="h-3 w-3 mr-1"/>
                          Test
                        </button_1.Button>
                      </>)}
                  </div>
                </div>))}
            </div>
          </scroll_area_1.ScrollArea>
        </div>

        {/* Status Alert */}
        <alert_1.Alert className={`${connection.status === "connected"
            ? "bg-green-900/20 border-green-700"
            : "bg-red-900/20 border-red-700"}`}>
          <lucide_react_1.Settings className="h-4 w-4"/>
          <alert_1.AlertDescription className="text-sm">
            {connection.status === "connected" ? (<>
                <strong>ZombieCoder Active:</strong> {onlineAgents.length} agents online
                {selectedAgentData && ` • Using ${selectedAgentData.name}`}
              </>) : (<strong>ZombieCoder Offline:</strong>)} Configure connection to access Bengali AI agents
            )}
          </alert_1.AlertDescription>
        </alert_1.Alert>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.ZombieCoderIntegration = ZombieCoderIntegration;
exports.default = ZombieCoderIntegration;
//# sourceMappingURL=zombiecoder-integration.js.map