"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorCore = void 0;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const progress_1 = require("@/components/ui/progress");
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
function EditorCore({ code, onCodeChange, language, onSuggestionApplied }) {
    const [activeSuggestions, setActiveSuggestions] = (0, react_1.useState)([]);
    const [isAnalyzing, setIsAnalyzing] = (0, react_1.useState)(false);
    const [analysisProgress, setAnalysisProgress] = (0, react_1.useState)(0);
    const [cursorPosition, setCursorPosition] = (0, react_1.useState)({ line: 0, column: 0 });
    const editorRef = (0, react_1.useRef)(null);
    // Simulate advanced code analysis
    const analyzeCode = (0, react_1.useCallback)((codeContent) => {
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        const progressInterval = setInterval(() => {
            setAnalysisProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 20;
            });
        }, 200);
        setTimeout(() => {
            const suggestions = [];
            // Analyze for common patterns and improvements
            const lines = codeContent.split("\n");
            lines.forEach((line, index) => {
                // Check for console.log usage
                if (line.includes("console.log") && !line.includes("//")) {
                    suggestions.push({
                        id: `console-${index}`,
                        line: index,
                        column: line.indexOf("console.log"),
                        type: "refactor",
                        original: line.trim(),
                        suggested: line.replace("console.log", "logger.info"),
                        confidence: 85,
                        explanation: "Consider using a proper logging library instead of console.log",
                        bengaliExplanation: "console.log এর পরিবর্তে proper logging library ব্যবহার করুন",
                    });
                }
                // Check for missing error handling
                if (line.includes("fetch(") || (line.includes("await ") && !lines[index + 1]?.includes("catch"))) {
                    suggestions.push({
                        id: `error-${index}`,
                        line: index,
                        column: 0,
                        type: "error-fix",
                        original: line.trim(),
                        suggested: `try {\n  ${line.trim()}\n} catch (error) {\n  console.error('Error:', error);\n}`,
                        confidence: 92,
                        explanation: "Add error handling for async operations",
                        bengaliExplanation: "async operation এর জন্য error handling যোগ করুন",
                    });
                }
                // Check for optimization opportunities
                if (line.includes("for (") && line.includes(".length")) {
                    const arrayName = line.match(/(\w+)\.length/)?.[1];
                    if (arrayName) {
                        suggestions.push({
                            id: `optimize-${index}`,
                            line: index,
                            column: 0,
                            type: "optimization",
                            original: line.trim(),
                            suggested: line.replace(`${arrayName}.length`, `len = ${arrayName}.length; i < len`),
                            confidence: 78,
                            explanation: "Cache array length for better performance",
                            bengaliExplanation: "ভালো performance এর জন্য array length cache করুন",
                        });
                    }
                }
            });
            setActiveSuggestions(suggestions.slice(0, 3)); // Show top 3 suggestions
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }, 1000);
    }, []);
    // Auto-analyze code on changes
    (0, react_1.useEffect)(() => {
        if (code.length > 50) {
            const debounceTimer = setTimeout(() => {
                analyzeCode(code);
            }, 2000);
            return () => clearTimeout(debounceTimer);
        }
    }, [code, analyzeCode]);
    const applySuggestion = (0, react_1.useCallback)((suggestion) => {
        const lines = code.split("\n");
        lines[suggestion.line] = suggestion.suggested;
        const newCode = lines.join("\n");
        onCodeChange(newCode);
        onSuggestionApplied(suggestion);
        // Remove applied suggestion
        setActiveSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    }, [code, onCodeChange, onSuggestionApplied]);
    const dismissSuggestion = (0, react_1.useCallback)((suggestionId) => {
        setActiveSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    }, []);
    return (<div className="space-y-4">
      {/* Analysis Progress */}
      {isAnalyzing && (<card_1.Card>
          <card_1.CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <lucide_react_1.Brain className="h-4 w-4 animate-pulse text-blue-600"/>
              <span className="text-sm font-medium">কোড বিশ্লেষণ চলছে...</span>
            </div>
            <progress_1.Progress value={analysisProgress} className="h-2"/>
            <div className="text-xs text-gray-500 mt-1">Analyzing patterns, performance, and best practices...</div>
          </card_1.CardContent>
        </card_1.Card>)}

      {/* Active Suggestions */}
      {activeSuggestions.length > 0 && (<div className="space-y-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.Lightbulb className="h-4 w-4 text-yellow-600"/>
            <span className="text-sm font-medium">AI সাজেশন ({activeSuggestions.length})</span>
          </div>

          {activeSuggestions.map((suggestion) => (<alert_1.Alert key={suggestion.id} className="border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {suggestion.type === "completion" && <lucide_react_1.Code2 className="h-4 w-4 text-green-600"/>}
                  {suggestion.type === "refactor" && <lucide_react_1.GitBranch className="h-4 w-4 text-blue-600"/>}
                  {suggestion.type === "optimization" && <lucide_react_1.Zap className="h-4 w-4 text-yellow-600"/>}
                  {suggestion.type === "error-fix" && <lucide_react_1.FileCode className="h-4 w-4 text-red-600"/>}
                </div>

                <div className="flex-1 min-w-0">
                  <alert_1.AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <badge_1.Badge variant="secondary" className="text-xs">
                          Line {suggestion.line + 1}
                        </badge_1.Badge>
                        <badge_1.Badge variant="outline" className="text-xs">
                          {suggestion.confidence}% confident
                        </badge_1.Badge>
                        <badge_1.Badge variant={suggestion.type === "error-fix"
                    ? "destructive"
                    : suggestion.type === "optimization"
                        ? "default"
                        : "secondary"} className="text-xs">
                          {suggestion.type}
                        </badge_1.Badge>
                      </div>

                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{suggestion.bengaliExplanation}</div>
                        <div className="text-gray-600 text-xs mt-1">{suggestion.explanation}</div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                        <div className="text-red-600 mb-1">- {suggestion.original}</div>
                        <div className="text-green-600">+ {suggestion.suggested.split("\n")[0]}...</div>
                      </div>

                      <div className="flex gap-2">
                        <button_1.Button size="sm" onClick={() => applySuggestion(suggestion)} className="h-7">
                          <lucide_react_1.CheckCircle className="h-3 w-3 mr-1"/>
                          প্রয়োগ করুন
                        </button_1.Button>
                        <button_1.Button size="sm" variant="outline" onClick={() => dismissSuggestion(suggestion.id)} className="h-7">
                          <lucide_react_1.XCircle className="h-3 w-3 mr-1"/>
                          বাতিল
                        </button_1.Button>
                      </div>
                    </div>
                  </alert_1.AlertDescription>
                </div>
              </div>
            </alert_1.Alert>))}
        </div>)}
    </div>);
}
exports.EditorCore = EditorCore;
//# sourceMappingURL=editor-core.js.map