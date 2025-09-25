"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPManager = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const scroll_area_1 = require("@/components/ui/scroll-area");
const alert_1 = require("@/components/ui/alert");
const switch_1 = require("@/components/ui/switch");
const label_1 = require("@/components/ui/label");
const lucide_react_1 = require("lucide-react");
function MCPManager({ onProviderChange, onStatusUpdate }) {
    const [providers, setProviders] = (0, react_1.useState)([]);
    const [activeProvider, setActiveProvider] = (0, react_1.useState)(null);
    const [isScanning, setIsScanning] = (0, react_1.useState)(false);
    const [autoFallback, setAutoFallback] = (0, react_1.useState)(true);
    // Initialize providers
    (0, react_1.useEffect)(() => {
        const initialProviders = [
            {
                id: "zombiecoder-local",
                name: "ZombieCoder Local",
                type: "local",
                status: "disconnected",
                latency: 0,
                capabilities: ["code-generation", "bengali-support", "voice-commands"],
                modelPath: "localhost:5000",
                description: "Local ZombieCoder AI server",
            },
            {
                id: "ollama",
                name: "Ollama",
                type: "local",
                status: "disconnected",
                latency: 0,
                capabilities: ["code-generation", "chat", "completion"],
                modelPath: "localhost:11434",
                description: "Local Ollama server",
            },
            {
                id: "lm-studio",
                name: "LM Studio",
                type: "local",
                status: "disconnected",
                latency: 0,
                capabilities: ["code-generation", "chat"],
                modelPath: "localhost:1234",
                description: "LM Studio local server",
            },
            {
                id: "openai-fallback",
                name: "OpenAI Fallback",
                type: "cloud",
                status: "disconnected",
                latency: 0,
                capabilities: ["code-generation", "chat", "completion"],
                apiEndpoint: "https://api.openai.com/v1",
                description: "Cloud fallback option",
            },
        ];
        setProviders(initialProviders);
        scanProviders(initialProviders);
    }, []);
    // Scan for available providers
    const scanProviders = (0, react_1.useCallback)(async (providerList) => {
        const providersToScan = providerList || providers;
        setIsScanning(true);
        onStatusUpdate?.("🔍 Scanning for MCP providers...");
        // Simulate provider scanning
        for (const provider of providersToScan) {
            setProviders((prev) => prev.map((p) => (p.id === provider.id ? { ...p, status: "connecting" } : p)));
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Simulate connection results
            const isConnected = Math.random() > 0.6; // 40% success rate for demo
            const latency = isConnected ? Math.floor(Math.random() * 200) + 50 : 0;
            setProviders((prev) => prev.map((p) => p.id === provider.id
                ? {
                    ...p,
                    status: isConnected ? "connected" : "disconnected",
                    latency,
                }
                : p));
            if (isConnected && !activeProvider) {
                setActiveProvider(provider.id);
                onProviderChange?.(provider.id);
                onStatusUpdate?.(`✅ Connected to ${provider.name}`);
            }
        }
        setIsScanning(false);
        const connectedCount = providersToScan.filter((p) => providers.find((pr) => pr.id === p.id)?.status === "connected").length;
        onStatusUpdate?.(`🔍 Scan complete: ${connectedCount}/${providersToScan.length} providers available`);
    }, [providers, activeProvider, onProviderChange, onStatusUpdate]);
    // Connect to a specific provider
    const connectToProvider = (0, react_1.useCallback)(async (providerId) => {
        const provider = providers.find((p) => p.id === providerId);
        if (!provider)
            return;
        setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, status: "connecting" } : p)));
        onStatusUpdate?.(`🔗 Connecting to ${provider.name}...`);
        // Simulate connection
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const success = Math.random() > 0.3; // 70% success rate
        const newStatus = success ? "connected" : "error";
        const latency = success ? Math.floor(Math.random() * 200) + 50 : 0;
        setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, status: newStatus, latency } : p)));
        if (success) {
            setActiveProvider(providerId);
            onProviderChange?.(providerId);
            onStatusUpdate?.(`✅ Connected to ${provider.name} (${latency}ms)`);
        }
        else {
            onStatusUpdate?.(`❌ Failed to connect to ${provider.name}`);
            // Auto fallback if enabled
            if (autoFallback) {
                const fallbackProvider = providers.find((p) => p.id !== providerId && p.status === "connected");
                if (fallbackProvider) {
                    setActiveProvider(fallbackProvider.id);
                    onProviderChange?.(fallbackProvider.id);
                    onStatusUpdate?.(`🔄 Switched to fallback: ${fallbackProvider.name}`);
                }
            }
        }
    }, [providers, autoFallback, onProviderChange, onStatusUpdate]);
    // Disconnect from provider
    const disconnectProvider = (0, react_1.useCallback)((providerId) => {
        setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, status: "disconnected", latency: 0 } : p)));
        if (activeProvider === providerId) {
            setActiveProvider(null);
            onProviderChange?.(null);
            onStatusUpdate?.("❌ Disconnected from MCP provider");
        }
    }, [activeProvider, onProviderChange, onStatusUpdate]);
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
    const getTypeIcon = (type) => {
        switch (type) {
            case "local":
                return <lucide_react_1.Server className="h-4 w-4 text-blue-400"/>;
            case "cloud":
                return <lucide_react_1.Globe className="h-4 w-4 text-purple-400"/>;
            case "hybrid":
                return <lucide_react_1.Database className="h-4 w-4 text-green-400"/>;
            default:
                return <lucide_react_1.Server className="h-4 w-4 text-gray-400"/>;
        }
    };
    const connectedProviders = providers.filter((p) => p.status === "connected");
    const activeProviderData = providers.find((p) => p.id === activeProvider);
    return (<card_1.Card className="bg-slate-800 border-slate-700">
      <card_1.CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="text-sm flex items-center gap-2 text-white">
            <lucide_react_1.Wifi className="h-4 w-4"/>
            MCP Manager ({connectedProviders.length})
          </card_1.CardTitle>
          <button_1.Button size="sm" onClick={() => scanProviders()} disabled={isScanning} className="h-7 bg-blue-600 hover:bg-blue-700">
            {isScanning ? (<lucide_react_1.RefreshCw className="h-3 w-3 animate-spin"/>) : (<lucide_react_1.RefreshCw className="h-3 w-3"/>)}
          </button_1.Button>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        {/* Auto Fallback Toggle */}
        <div className="flex items-center justify-between">
          <label_1.Label className="text-sm text-gray-300">Auto Fallback:</label_1.Label>
          <switch_1.Switch checked={autoFallback} onCheckedChange={setAutoFallback}/>
        </div>

        {/* Active Provider */}
        {activeProviderData && (<alert_1.Alert className="bg-green-900/20 border-green-700">
            <lucide_react_1.Zap className="h-4 w-4"/>
            <alert_1.AlertDescription className="text-sm">
              <strong>Active:</strong> {activeProviderData.name} ({activeProviderData.latency}ms)
            </alert_1.AlertDescription>
          </alert_1.Alert>)}

        {/* Providers List */}
        <div className="space-y-2">
          <label_1.Label className="text-sm text-gray-300">Available Providers:</label_1.Label>
          <scroll_area_1.ScrollArea className="h-48">
            <div className="space-y-2">
              {providers.map((provider) => (<div key={provider.id} className={`border rounded p-3 space-y-2 ${activeProvider === provider.id
                ? "border-green-600 bg-green-900/10"
                : "border-slate-600"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(provider.type)}
                      <span className="text-sm font-medium text-white">
                        {provider.name}
                      </span>
                      <badge_1.Badge variant="outline" className="text-xs border-slate-500 text-gray-300">
                        {provider.type}
                      </badge_1.Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(provider.status)}
                      {provider.status === "connected" && (<badge_1.Badge variant="secondary" className="text-xs">
                          {provider.latency}ms
                        </badge_1.Badge>)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    {provider.description}
                  </div>

                  <div className="text-xs text-gray-400">
                    {provider.modelPath || provider.apiEndpoint}
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.map((capability) => (<badge_1.Badge key={capability} variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {capability}
                      </badge_1.Badge>))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {provider.status === "connected" ? (<>
                        {activeProvider !== provider.id && (<button_1.Button size="sm" onClick={() => {
                        setActiveProvider(provider.id);
                        onProviderChange?.(provider.id);
                    }} className="h-6 text-xs bg-blue-600 hover:bg-blue-700">
                            <lucide_react_1.Zap className="h-3 w-3 mr-1"/>
                            Activate
                          </button_1.Button>)}
                        <button_1.Button size="sm" variant="outline" onClick={() => disconnectProvider(provider.id)} className="h-6 text-xs border-slate-600">
                          <lucide_react_1.WifiOff className="h-3 w-3 mr-1"/>
                          Disconnect
                        </button_1.Button>
                      </>) : (<button_1.Button size="sm" onClick={() => connectToProvider(provider.id)} disabled={provider.status === "connecting"} className="h-6 text-xs bg-green-600 hover:bg-green-700">
                        {provider.status === "connecting" ? (<lucide_react_1.RefreshCw className="h-3 w-3 mr-1 animate-spin"/>) : (<lucide_react_1.Wifi className="h-3 w-3 mr-1"/>)}
                        Connect
                      </button_1.Button>)}
                  </div>
                </div>))}
            </div>
          </scroll_area_1.ScrollArea>
        </div>

        {/* Status Alert */}
        <alert_1.Alert className={`${connectedProviders.length > 0
            ? "bg-green-900/20 border-green-700"
            : "bg-red-900/20 border-red-700"}`}>
          <lucide_react_1.Server className="h-4 w-4"/>
          <alert_1.AlertDescription className="text-sm">
            {connectedProviders.length > 0 ? (<>
                <strong>MCP Active:</strong> {connectedProviders.length} provider(s) connected
                {autoFallback && " • Auto-fallback enabled"}
              </>) : ()}\
              <strong>No MCP Providers:</strong> Click scan to find available providers
            )}
          </alert_1.AlertDescription>
        </alert_1.Alert>
      </card_1.CardContent>
  </card_1.Card>);
}
exports.MCPManager = MCPManager;
exports.default = MCPManager;
//# sourceMappingURL=mcp-manager.js.map