"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartInputInterface = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const progress_1 = require("@/components/ui/progress");
const scroll_area_1 = require("@/components/ui/scroll-area");
const select_1 = require("@/components/ui/select");
const tooltip_1 = require("@/components/ui/tooltip");
const lucide_react_1 = require("lucide-react");
function SmartInputInterface({ onSubmit, onVoiceCommand, isProcessing = false, placeholder = "Write, @ for context, / for commands, # for files...", }) {
    const [input, setInput] = (0, react_1.useState)("");
    const [selectedAgent, setSelectedAgent] = (0, react_1.useState)("zombiecoder");
    const [contextItems, setContextItems] = (0, react_1.useState)([]);
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [cursorPosition, setCursorPosition] = (0, react_1.useState)(0);
    const [isAgentMode, setIsAgentMode] = (0, react_1.useState)(true);
    const inputRef = (0, react_1.useRef)(null);
    const suggestionRef = (0, react_1.useRef)(null);
    // Available agents
    const agents = [
        { id: "zombiecoder", name: "ZombieCoder AI", icon: <lucide_react_1.Bot className="h-4 w-4"/>, description: "বাংলা কোডিং সহায়ক" },
        { id: "procoder", name: "Procoder", icon: <lucide_react_1.Code className="h-4 w-4"/>, description: "কোডিং, প্রোগ্রামিং" },
        { id: "creative", name: "Creative Writer", icon: <lucide_react_1.FileText className="h-4 w-4"/>, description: "গল্প, কবিতা" },
        {
            id: "translator",
            name: "Translation Agent",
            icon: <lucide_react_1.MessageSquare className="h-4 w-4"/>,
            description: "ভাষা অনুবাদ",
        },
        { id: "analyzer", name: "DB Analyzer", icon: <lucide_react_1.Brain className="h-4 w-4"/>, description: "ডাটাবেস বিশ্লেষণ" },
    ];
    // Context suggestions based on input
    const contextSuggestions = [
        { id: "1", text: "current-file", type: "context", description: "বর্তমান ফাইল যোগ করুন", shortcut: "#" },
        { id: "2", text: "workspace", type: "context", description: "সম্পূর্ণ workspace", shortcut: "#" },
        { id: "3", text: "selection", type: "context", description: "নির্বাচিত কোড", shortcut: "#" },
        { id: "4", text: "git-changes", type: "context", description: "Git পরিবর্তনসমূহ", shortcut: "#" },
        { id: "5", text: "errors", type: "context", description: "Error লগ", shortcut: "#" },
    ];
    const commandSuggestions = [
        { id: "1", text: "explain", type: "command", description: "কোড ব্যাখ্যা করুন", shortcut: "/" },
        { id: "2", text: "fix", type: "command", description: "সমস্যা সমাধান করুন", shortcut: "/" },
        { id: "3", text: "optimize", type: "command", description: "কোড অপ্টিমাইজ করুন", shortcut: "/" },
        { id: "4", text: "translate", type: "command", description: "বাংলায় অনুবাদ করুন", shortcut: "/" },
        { id: "5", text: "generate", type: "command", description: "নতুন কোড তৈরি করুন", shortcut: "/" },
    ];
    const extensionSuggestions = [
        { id: "1", text: "prettier", type: "extension", description: "কোড ফরম্যাটিং", shortcut: "@" },
        { id: "2", text: "eslint", type: "extension", description: "কোড লিন্টিং", shortcut: "@" },
        { id: "3", text: "typescript", type: "extension", description: "TypeScript সাপোর্ট", shortcut: "@" },
        { id: "4", text: "react", type: "extension", description: "React ডেভেলপমেন্ট", shortcut: "@" },
        { id: "5", text: "git", type: "extension", description: "Git ইন্টিগ্রেশন", shortcut: "@" },
    ];
    // Handle input change and suggestions
    const handleInputChange = (0, react_1.useCallback)((value) => {
        setInput(value);
        const lastChar = value[value.length - 1];
        const words = value.split(" ");
        const currentWord = words[words.length - 1];
        // Show suggestions based on trigger characters
        if (currentWord.startsWith("#")) {
            setSuggestions(contextSuggestions);
            setShowSuggestions(true);
        }
        else if (currentWord.startsWith("/")) {
            setSuggestions(commandSuggestions);
            setShowSuggestions(true);
        }
        else if (currentWord.startsWith("@")) {
            setSuggestions(extensionSuggestions);
            setShowSuggestions(true);
        }
        else {
            setShowSuggestions(false);
        }
        // Update progress based on input length
        const progressValue = Math.min((value.length / 100) * 100, 100);
        setProgress(progressValue);
    }, []);
    // Handle suggestion selection
    const handleSuggestionSelect = (0, react_1.useCallback)((suggestion) => {
        const words = input.split(" ");
        const lastWordIndex = words.length - 1;
        const currentWord = words[lastWordIndex];
        // Replace the current word with the suggestion
        words[lastWordIndex] = suggestion.shortcut + suggestion.text;
        const newInput = words.join(" ") + " ";
        setInput(newInput);
        setShowSuggestions(false);
        // Add to context items
        const contextItem = {
            id: suggestion.id,
            type: suggestion.type,
            name: suggestion.text,
            description: suggestion.description,
            icon: getIconForType(suggestion.type),
        };
        setContextItems((prev) => [...prev, contextItem]);
        // Focus back to input
        inputRef.current?.focus();
    }, [input]);
    // Get icon for context type
    const getIconForType = (type) => {
        switch (type) {
            case "context":
                return <lucide_react_1.Hash className="h-3 w-3"/>;
            case "command":
                return <lucide_react_1.Slash className="h-3 w-3"/>;
            case "extension":
                return <lucide_react_1.AtSign className="h-3 w-3"/>;
            default:
                return <lucide_react_1.FileText className="h-3 w-3"/>;
        }
    };
    // Remove context item
    const removeContextItem = (0, react_1.useCallback)((id) => {
        setContextItems((prev) => prev.filter((item) => item.id !== id));
    }, []);
    // Handle form submission
    const handleSubmit = (0, react_1.useCallback)(() => {
        if (input.trim() && !isProcessing) {
            onSubmit(input.trim(), contextItems, selectedAgent);
            setInput("");
            setContextItems([]);
            setProgress(0);
        }
    }, [input, contextItems, selectedAgent, isProcessing, onSubmit]);
    // Handle voice recording
    const toggleRecording = (0, react_1.useCallback)(() => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            // Start recording
            onVoiceCommand("start_recording");
        }
        else {
            // Stop recording
            onVoiceCommand("stop_recording");
        }
    }, [isRecording, onVoiceCommand]);
    // Handle keyboard shortcuts
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
            }
            else if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleSubmit]);
    return (<tooltip_1.TooltipProvider>
      <card_1.Card className="bg-slate-900 border-slate-700 shadow-xl">
        <card_1.CardContent className="p-0">
          {/* Header with Agent Mode */}
          <div className="flex items-center justify-between p-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <lucide_react_1.Sparkles className="h-4 w-4 text-blue-400"/>
              <span className="text-sm font-medium text-white">
                {isAgentMode ? "Build with agent mode." : "Standard Mode"}
              </span>
              {isAgentMode && (<badge_1.Badge variant="outline" className="text-xs border-blue-600 text-blue-300">
                  AI responses may be inaccurate.
                </badge_1.Badge>)}
            </div>
            <button_1.Button size="sm" variant="ghost" onClick={() => setIsAgentMode(!isAgentMode)} className="h-6 w-6 p-0">
              <lucide_react_1.Settings className="h-3 w-3"/>
            </button_1.Button>
          </div>

          {/* Context Items */}
          {contextItems.length > 0 && (<div className="p-3 border-b border-slate-700">
              <div className="flex flex-wrap gap-2">
                {contextItems.map((item) => (<badge_1.Badge key={item.id} variant="secondary" className="flex items-center gap-1 bg-slate-700 text-slate-200 hover:bg-slate-600">
                    {item.icon}
                    <span className="text-xs">{item.name}</span>
                    <button_1.Button size="sm" variant="ghost" onClick={() => removeContextItem(item.id)} className="h-3 w-3 p-0 ml-1 hover:bg-slate-500">
                      <lucide_react_1.X className="h-2 w-2"/>
                    </button_1.Button>
                  </badge_1.Badge>))}
              </div>
            </div>)}

          {/* Main Input Area */}
          <div className="relative">
            <div className="flex items-start gap-2 p-3">
              {/* Agent Selector */}
              <select_1.Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <select_1.SelectTrigger className="w-40 h-8 bg-slate-800 border-slate-600 text-xs">
                  <div className="flex items-center gap-2">
                    {agents.find((a) => a.id === selectedAgent)?.icon}
                    <select_1.SelectValue />
                  </div>
                </select_1.SelectTrigger>
                <select_1.SelectContent className="bg-slate-800 border-slate-600">
                  {agents.map((agent) => (<select_1.SelectItem key={agent.id} value={agent.id} className="text-xs">
                      <div className="flex items-center gap-2">
                        {agent.icon}
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-xs text-slate-400">{agent.description}</div>
                        </div>
                      </div>
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>

              {/* Input Field */}
              <div className="flex-1 relative">
                <textarea ref={inputRef} value={input} onChange={(e) => handleInputChange(e.target.value)} placeholder={placeholder} className="w-full min-h-[80px] max-h-[200px] bg-transparent text-white placeholder-slate-400 border-none outline-none resize-none text-sm leading-relaxed" style={{ scrollbarWidth: "thin" }}/>

                {/* Progress Bar */}
                {progress > 0 && (<div className="absolute bottom-0 left-0 right-0">
                    <progress_1.Progress value={progress} className="h-1"/>
                  </div>)}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <tooltip_1.Tooltip>
                  <tooltip_1.TooltipTrigger asChild>
                    <button_1.Button size="sm" variant="ghost" onClick={toggleRecording} className={`h-8 w-8 p-0 ${isRecording ? "text-red-400 bg-red-900/20" : "text-slate-400"}`}>
                      {isRecording ? <lucide_react_1.MicOff className="h-4 w-4"/> : <lucide_react_1.Mic className="h-4 w-4"/>}
                    </button_1.Button>
                  </tooltip_1.TooltipTrigger>
                  <tooltip_1.TooltipContent>
                    <p>{isRecording ? "Stop Recording" : "Start Voice Input"}</p>
                  </tooltip_1.TooltipContent>
                </tooltip_1.Tooltip>

                <tooltip_1.Tooltip>
                  <tooltip_1.TooltipTrigger asChild>
                    <button_1.Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400">
                      <lucide_react_1.Paperclip className="h-4 w-4"/>
                    </button_1.Button>
                  </tooltip_1.TooltipTrigger>
                  <tooltip_1.TooltipContent>
                    <p>Attach Files</p>
                  </tooltip_1.TooltipContent>
                </tooltip_1.Tooltip>

                <button_1.Button size="sm" onClick={handleSubmit} disabled={!input.trim() || isProcessing} className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                  {isProcessing ? <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/> : <lucide_react_1.Send className="h-4 w-4"/>}
                </button_1.Button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (<div ref={suggestionRef} className="absolute bottom-full left-3 right-3 mb-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-48 overflow-hidden">
                <scroll_area_1.ScrollArea className="max-h-48">
                  <div className="p-2">
                    {suggestions.map((suggestion) => (<button_1.Button key={suggestion.id} variant="ghost" onClick={() => handleSuggestionSelect(suggestion)} className="w-full justify-start h-auto p-2 text-left hover:bg-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-slate-700 rounded">
                            {getIconForType(suggestion.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                {suggestion.shortcut}
                                {suggestion.text}
                              </span>
                              <badge_1.Badge variant="outline" className="text-xs">
                                {suggestion.type}
                              </badge_1.Badge>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{suggestion.description}</div>
                          </div>
                        </div>
                      </button_1.Button>))}
                  </div>
                </scroll_area_1.ScrollArea>
              </div>)}
          </div>

          {/* Footer with shortcuts */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-t border-slate-700">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <lucide_react_1.Hash className="h-3 w-3"/>
                files
              </span>
              <span className="flex items-center gap-1">
                <lucide_react_1.AtSign className="h-3 w-3"/>
                extensions
              </span>
              <span className="flex items-center gap-1">
                <lucide_react_1.Slash className="h-3 w-3"/>
                commands
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Enter</kbd>
              <span>to send</span>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </tooltip_1.TooltipProvider>);
}
exports.SmartInputInterface = SmartInputInterface;
exports.default = SmartInputInterface;
//# sourceMappingURL=smart-input-interface.js.map