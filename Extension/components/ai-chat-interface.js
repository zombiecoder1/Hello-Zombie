"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIChatInterface = void 0;
const react_1 = require("react");
const scroll_area_1 = require("@/components/ui/scroll-area");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const smart_input_interface_1 = __importDefault(require("./smart-input-interface"));
const lucide_react_1 = require("lucide-react");
function AIChatInterface({ onMessageSend, onVoiceInput, isVoiceActive = false, isProcessing = false, }) {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [currentProcessing, setCurrentProcessing] = (0, react_1.useState)(false);
    const scrollAreaRef = (0, react_1.useRef)(null);
    // Auto-scroll to bottom when new messages arrive
    (0, react_1.useEffect)(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);
    // Handle message submission
    const handleSubmit = (0, react_1.useCallback)(async (content, context, agent) => {
        const userMessage = {
            id: `msg-${Date.now()}`,
            type: "user",
            content,
            timestamp: new Date(),
            agent,
            context,
            metadata: {
                tokens: content.split(" ").length,
                language: /[\u0980-\u09FF]/.test(content) ? "bengali" : "english",
            },
        };
        setMessages((prev) => [...prev, userMessage]);
        setCurrentProcessing(true);
        onMessageSend?.(content, "chat");
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                `আমি ${agent} এজেন্ট হিসেবে আপনার প্রশ্নের উত্তর দিচ্ছি। আপনি যে context যোগ করেছেন তা খুবই সহায়ক। আমি আপনাকে নিম্নলিখিত সমাধান দিতে পারি:

1. **কোড অপ্টিমাইজেশন**: আপনার কোডে কিছু উন্নতি করা যেতে পারে
2. **বাংলা কমেন্ট**: কোডে বাংলা কমেন্ট যোগ করতে পারি
3. **পারফরম্যান্স**: আরো ভালো পারফরম্যান্স পেতে কিছু পরিবর্তন করা যেতে পারে

আপনার আরো কোনো প্রশ্ন থাকলে জানান!`,
                `Hello! As ${agent}, I can help you with your coding needs. Based on your message: "${content}"

I can provide assistance with:
- Code generation and optimization
- Bengali language support
- Voice command integration
- Task management

Would you like me to elaborate on any specific aspect?`,
                `আপনার প্রশ্নটি খুবই গুরুত্বপূর্ণ। ${agent} হিসেবে আমি আপনাকে সাহায্য করতে পারি।

\`\`\`javascript
// আপনার জন্য একটি উদাহরণ কোড
function bengaliGreeting(name) {
  // বাংলা অভিবাদন ফাংশন
  return \`নমস্কার, \${name}! আপনাকে স্বাগতম।\`;
}

// ব্যবহারের উদাহরণ
const message = bengaliGreeting("ডেভেলপার");
console.log(message);
\`\`\`

এই কোডটি আপনার কাজে লাগতে পারে। আরো সাহায্য প্রয়োজন হলে জানান!`,
            ];
            const assistantMessage = {
                id: `msg-${Date.now()}-response`,
                type: "assistant",
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                agent,
                metadata: {
                    tokens: Math.floor(Math.random() * 200) + 100,
                    confidence: Math.floor(Math.random() * 20) + 80,
                    language: "mixed",
                },
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setCurrentProcessing(false);
        }, 2000);
    }, [onMessageSend]);
    // Handle voice command
    const handleVoiceCommand = (0, react_1.useCallback)((command) => {
        onVoiceInput?.();
    }, [onVoiceInput]);
    // Copy message to clipboard
    const copyMessage = (0, react_1.useCallback)(async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            // You could add a toast notification here
        }
        catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }, []);
    // Provide feedback on message
    const provideFeedback = (0, react_1.useCallback)((messageId, feedback) => {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)));
    }, []);
    // Regenerate response
    const regenerateResponse = (0, react_1.useCallback)((messageId) => {
        const messageIndex = messages.findIndex((msg) => msg.id === messageId);
        if (messageIndex === -1)
            return;
        const userMessage = messages[messageIndex - 1];
        if (!userMessage || userMessage.type !== "user")
            return;
        // Remove the old response and regenerate
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setTimeout(() => {
            handleSubmit(userMessage.content, userMessage.context || [], userMessage.agent || "zombiecoder");
        }, 500);
    }, [messages, handleSubmit]);
    return (<div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <scroll_area_1.ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
        // Empty State
        <div className="flex items-center justify-center h-64">
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
        messages.map((message) => (<div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg p-4 ${message.type === "user"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                    {/* Message Header */}
                    <div className="flex items-center gap-2 mb-2">
                      {message.type === "assistant" ? (<lucide_react_1.Bot className="h-4 w-4 text-blue-400"/>) : (<lucide_react_1.User className="h-4 w-4 text-blue-300"/>)}
                      <span className="text-xs font-medium">
                        {message.type === "assistant" ? `${message.agent} Agent` : "You"}
                      </span>
                      {message.metadata?.language && (<badge_1.Badge variant="outline" className="text-xs">
                          {message.metadata.language === "bengali"
                    ? "🇧🇩"
                    : message.metadata.language === "mixed"
                        ? "🇧🇩🇺🇸"
                        : "🇺🇸"}
                        </badge_1.Badge>)}
                    </div>

                    {/* Message Content */}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>

                    {/* Context Items */}
                    {message.context && message.context.length > 0 && (<div className="flex flex-wrap gap-1 mt-2">
                        {message.context.map((item, index) => (<badge_1.Badge key={index} variant="secondary" className="text-xs">
                            {item.name}
                          </badge_1.Badge>))}
                      </div>)}

                    {/* Message Footer */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-600/50">
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.metadata?.tokens && <span>• {message.metadata.tokens} tokens</span>}
                        {message.metadata?.confidence && <span>• {message.metadata.confidence}% confidence</span>}
                      </div>

                      {/* Message Actions */}
                      <div className="flex items-center gap-1">
                        <button_1.Button size="sm" variant="ghost" onClick={() => copyMessage(message.content)} className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                          <lucide_react_1.Copy className="h-3 w-3"/>
                        </button_1.Button>

                        {message.type === "assistant" && (<>
                            <button_1.Button size="sm" variant="ghost" onClick={() => provideFeedback(message.id, "positive")} className={`h-6 w-6 p-0 opacity-70 hover:opacity-100 ${message.feedback === "positive" ? "text-green-400" : ""}`}>
                              <lucide_react_1.ThumbsUp className="h-3 w-3"/>
                            </button_1.Button>

                            <button_1.Button size="sm" variant="ghost" onClick={() => provideFeedback(message.id, "negative")} className={`h-6 w-6 p-0 opacity-70 hover:opacity-100 ${message.feedback === "negative" ? "text-red-400" : ""}`}>
                              <lucide_react_1.ThumbsDown className="h-3 w-3"/>
                            </button_1.Button>

                            <button_1.Button size="sm" variant="ghost" onClick={() => regenerateResponse(message.id)} className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                              <lucide_react_1.RefreshCw className="h-3 w-3"/>
                            </button_1.Button>
                          </>)}
                      </div>
                    </div>
                  </div>
                </div>)))}

            {/* Processing Indicator */}
            {currentProcessing && (<div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-[85%]">
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
        </scroll_area_1.ScrollArea>
      </div>

      {/* Input Interface */}
      <div className="border-t border-slate-700 p-4">
        <smart_input_interface_1.default onSubmit={handleSubmit} onVoiceCommand={handleVoiceCommand} isProcessing={currentProcessing || isProcessing} isVoiceActive={isVoiceActive} placeholder="Add context (#), extensions (@), commands (/), or ask anything in Bengali..."/>
      </div>
    </div>);
}
exports.AIChatInterface = AIChatInterface;
exports.default = AIChatInterface;
//# sourceMappingURL=ai-chat-interface.js.map