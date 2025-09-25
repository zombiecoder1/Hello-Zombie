"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModeInterface = void 0;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const scroll_area_1 = require("@/components/ui/scroll-area");
const smart_input_interface_1 = __importDefault(require("./smart-input-interface"));
const lucide_react_1 = require("lucide-react");
function AgentModeInterface({ onMessage }) {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    // Handle message submission
    const handleSubmit = async (content, context, agent) => {
        const userMessage = {
            id: `msg-${Date.now()}`,
            type: "user",
            content,
            timestamp: new Date(),
            agent,
            context,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsProcessing(true);
        // Simulate AI response
        setTimeout(() => {
            const assistantMessage = {
                id: `msg-${Date.now()}-response`,
                type: "assistant",
                content: `আমি ${agent} এজেন্ট হিসেবে আপনার প্রশ্নের উত্তর দিচ্ছি: "${content}"\n\nআপনার কোড বিশ্লেষণ করে আমি দেখতে পাচ্ছি যে এটি একটি দুর্দান্ত প্রশ্ন। আমি আপনাকে সাহায্য করতে পারি।`,
                timestamp: new Date(),
                agent,
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsProcessing(false);
            onMessage?.(assistantMessage);
        }, 2000);
        onMessage?.(userMessage);
    };
    // Handle voice commands
    const handleVoiceCommand = (command) => {
        console.log("Voice command:", command);
    };
    return (<div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.Sparkles className="h-5 w-5 text-blue-400"/>
            <h2 className="text-lg font-semibold text-white">ZombieCoder AI Chat</h2>
          </div>
          <badge_1.Badge variant="outline" className="border-green-600 text-green-300">
            Agent Mode Active
          </badge_1.Badge>
        </div>

        <div className="flex items-center gap-2">
          <button_1.Button size="sm" variant="ghost" className="text-slate-400">
            <lucide_react_1.RefreshCw className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button size="sm" variant="ghost" className="text-slate-400">
            <lucide_react_1.Download className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button size="sm" variant="ghost" className="text-slate-400">
            <lucide_react_1.Share className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button size="sm" variant="ghost" className="text-slate-400">
            <lucide_react_1.Settings className="h-4 w-4"/>
          </button_1.Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
        // Empty State
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4 mx-auto">
                <lucide_react_1.Bot className="h-8 w-8 text-blue-400"/>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Build with agent mode.</h3>
              <p className="text-slate-400 mb-4">AI responses may be inaccurate.</p>
              <button_1.Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                Generate instructions to onboard AI onto your codebase.
              </button_1.Button>
            </div>
          </div>) : (
        // Messages List
        <scroll_area_1.ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (<div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                    {message.type === "assistant" && (<div className="flex items-center gap-2 mb-2">
                        <lucide_react_1.Bot className="h-4 w-4 text-blue-400"/>
                        <span className="text-xs text-slate-400 font-medium">{message.agent} Agent</span>
                      </div>)}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>))}

              {isProcessing && (<div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <lucide_react_1.Bot className="h-4 w-4 text-blue-400"/>
                      <span className="text-xs text-slate-400">AI is thinking...</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </scroll_area_1.ScrollArea>)}

        {/* Input Interface */}
        <div className="p-4 border-t border-slate-700">
          <smart_input_interface_1.default onSubmit={handleSubmit} onVoiceCommand={handleVoiceCommand} isProcessing={isProcessing} placeholder="Add context (#), extensions (@), commands (/), or ask anything in Bengali..."/>
        </div>
      </div>
    </div>);
}
exports.AgentModeInterface = AgentModeInterface;
exports.default = AgentModeInterface;
//# sourceMappingURL=agent-mode-interface.js.map