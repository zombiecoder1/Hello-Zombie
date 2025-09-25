"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceProcessor = void 0;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const progress_1 = require("@/components/ui/progress");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
function VoiceProcessor({ onCodeGenerated, onVoiceCommand, isEnabled }) {
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [isSpeaking, setIsSpeaking] = (0, react_1.useState)(false);
    const [recordingProgress, setRecordingProgress] = (0, react_1.useState)(0);
    const [processingStage, setProcessingStage] = (0, react_1.useState)("");
    const [recentCommands, setRecentCommands] = (0, react_1.useState)([]);
    const [audioLevel, setAudioLevel] = (0, react_1.useState)(0);
    const recordingTimerRef = (0, react_1.useRef)();
    const audioLevelRef = (0, react_1.useRef)();
    // Bengali to English code translation patterns
    const translationPatterns = {
        // Function creation
        "ফাংশন বানাও": "create function",
        "ফাংশন লিখো": "write function",
        "একটা ফাংশন": "a function",
        // Variables
        ভেরিয়েবল: "variable",
        চলক: "variable",
        // Loops
        লুপ: "loop",
        পুনরাবৃত্তি: "iteration",
        চক্র: "cycle",
        // Conditions
        শর্ত: "condition",
        যদি: "if",
        নাহলে: "else",
        // Operations
        যোগ: "add",
        বিয়োগ: "subtract",
        গুণ: "multiply",
        ভাগ: "divide",
        // Data types
        সংখ্যা: "number",
        টেক্সট: "string",
        তালিকা: "array",
        অবজেক্ট: "object",
        // Actions
        "প্রিন্ট করো": "print",
        দেখাও: "show",
        "লগ করো": "log",
        "রিটার্ন করো": "return",
    };
    const codeTemplates = {
        function: (name, params = []) => `function ${name}(${params.join(", ")}) {\n  // Function body\n  return;\n}`,
        "for-loop": (variable, limit) => `for (let ${variable} = 0; ${variable} < ${limit}; ${variable}++) {\n  console.log(${variable});\n}`,
        "if-condition": (condition) => `if (${condition}) {\n  // Code here\n} else {\n  // Alternative code\n}`,
        variable: (name, value) => `const ${name} = ${value};`,
        array: (name, items = []) => `const ${name} = [${items.map((item) => `"${item}"`).join(", ")}];`,
    };
    const startRecording = (0, react_1.useCallback)(() => {
        if (!isEnabled)
            return;
        setIsRecording(true);
        setRecordingProgress(0);
        setAudioLevel(0);
        // Simulate audio level detection
        audioLevelRef.current = setInterval(() => {
            setAudioLevel(Math.random() * 100);
        }, 100);
        // Recording progress
        recordingTimerRef.current = setInterval(() => {
            setRecordingProgress((prev) => {
                if (prev >= 100) {
                    stopRecording();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    }, [isEnabled]);
    const stopRecording = (0, react_1.useCallback)(() => {
        setIsRecording(false);
        setRecordingProgress(0);
        setAudioLevel(0);
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
        }
        if (audioLevelRef.current) {
            clearInterval(audioLevelRef.current);
        }
        processVoiceInput();
    }, []);
    const processVoiceInput = (0, react_1.useCallback)(() => {
        setIsProcessing(true);
        setProcessingStage("🎙️ অডিও প্রসেসিং...");
        setTimeout(() => {
            setProcessingStage("🔤 বাংলা টেক্সট রূপান্তর...");
        }, 500);
        setTimeout(() => {
            setProcessingStage("🌐 ইংরেজি অনুবাদ...");
        }, 1000);
        setTimeout(() => {
            setProcessingStage("💻 কোড জেনারেশন...");
        }, 1500);
        setTimeout(() => {
            // Simulate voice recognition results
            const bengaliCommands = [
                {
                    bengali: "একটা ফাংশন বানাও যা দুইটা সংখ্যা যোগ করে",
                    english: "create a function that adds two numbers",
                    code: codeTemplates.function("addNumbers", ["a", "b"]).replace("// Function body", "return a + b;"),
                    type: "code-generation",
                },
                {
                    bengali: "একটা লুপ লিখো যা ১ থেকে ১০ পর্যন্ত প্রিন্ট করে",
                    english: "write a loop that prints from 1 to 10",
                    code: codeTemplates["for-loop"]("i", "11").replace("console.log(i)", "console.log(i + 1)"),
                    type: "code-generation",
                },
                {
                    bengali: "একটা অ্যারে বানাও ফলের নাম দিয়ে",
                    english: "create an array with fruit names",
                    code: codeTemplates.array("fruits", ["আম", "কলা", "আপেল", "কমলা"]),
                    type: "code-generation",
                },
                {
                    bengali: "এই কোডে কমেন্ট যোগ করো",
                    english: "add comments to this code",
                    code: "// Added comments for better code readability\n// TODO: Implement proper error handling",
                    type: "code-modification",
                },
                {
                    bengali: "এই ফাংশনটা কিভাবে কাজ করে?",
                    english: "how does this function work?",
                    code: "// This function explanation will be provided",
                    type: "question",
                },
            ];
            const randomCommand = bengaliCommands[Math.floor(Math.random() * bengaliCommands.length)];
            const voiceCommand = {
                id: Date.now().toString(),
                timestamp: new Date(),
                bengaliText: randomCommand.bengali,
                englishTranslation: randomCommand.english,
                codeGenerated: randomCommand.code,
                confidence: Math.floor(Math.random() * 20) + 80,
                type: randomCommand.type,
            };
            setRecentCommands((prev) => [voiceCommand, ...prev.slice(0, 4)]);
            onVoiceCommand(voiceCommand);
            if (voiceCommand.type === "code-generation" || voiceCommand.type === "code-modification") {
                onCodeGenerated(voiceCommand.codeGenerated);
            }
            setIsProcessing(false);
            setProcessingStage("");
        }, 2000);
    }, [onCodeGenerated, onVoiceCommand]);
    const speakText = (0, react_1.useCallback)((text) => {
        setIsSpeaking(true);
        // Simulate TTS processing
        setTimeout(() => {
            setIsSpeaking(false);
        }, 2000);
    }, []);
    const toggleRecording = (0, react_1.useCallback)(() => {
        if (isRecording) {
            stopRecording();
        }
        else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
            if (audioLevelRef.current) {
                clearInterval(audioLevelRef.current);
            }
        };
    }, []);
    return (<div className="space-y-4">
      {/* Voice Control Panel */}
      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <card_1.CardTitle className="text-sm flex items-center gap-2">
            <lucide_react_1.AudioWaveformIcon className="h-4 w-4"/>
            ভয়েস কন্ট্রোল
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center gap-3">
            <button_1.Button size="lg" variant={isRecording ? "destructive" : "default"} onClick={toggleRecording} disabled={!isEnabled || isProcessing} className="flex-1">
              {isRecording ? (<>
                  <lucide_react_1.MicOff className="h-4 w-4 mr-2"/>
                  রেকর্ডিং বন্ধ করুন
                </>) : (<>
                  <lucide_react_1.Mic className="h-4 w-4 mr-2"/>
                  বাংলায় বলুন
                </>)}
            </button_1.Button>

            <button_1.Button size="lg" variant="outline" onClick={() => speakText("আপনার কোড প্রস্তুত!")} disabled={isSpeaking}>
              {isSpeaking ? <lucide_react_1.VolumeX className="h-4 w-4"/> : <lucide_react_1.Volume2 className="h-4 w-4"/>}
            </button_1.Button>
          </div>

          {/* Recording Progress */}
          {isRecording && (<div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Recording...</span>
                <span>{Math.round(recordingProgress)}%</span>
              </div>
              <progress_1.Progress value={recordingProgress} className="h-2"/>

              {/* Audio Level Visualization */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 20 }, (_, i) => (<div key={i} className={`h-6 w-1 rounded ${audioLevel > (i * 5) ? "bg-green-500" : "bg-gray-200"}`}/>))}
              </div>
            </div>)}

          {/* Processing Status */}
          {isProcessing && (<div className="space-y-2">
              <div className="text-sm font-medium">{processingStage}</div>
              <progress_1.Progress value={66} className="h-2"/>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Recent Commands */}
      {recentCommands.length > 0 && (<card_1.Card>
          <card_1.CardHeader className="pb-3">
            <card_1.CardTitle className="text-sm flex items-center gap-2">
              <lucide_react_1.MessageSquare className="h-4 w-4"/>
              সাম্প্রতিক ভয়েস কমান্ড
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <scroll_area_1.ScrollArea className="h-48">
              <div className="space-y-3">
                {recentCommands.map((command) => (<div key={command.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <badge_1.Badge variant="outline" className="text-xs">
                        {command.type === "code-generation" && <lucide_react_1.Code className="h-3 w-3 mr-1"/>}
                        {command.type === "code-modification" && <lucide_react_1.Languages className="h-3 w-3 mr-1"/>}
                        {command.type === "question" && <lucide_react_1.MessageSquare className="h-3 w-3 mr-1"/>}
                        {command.type}
                      </badge_1.Badge>
                      <badge_1.Badge variant="secondary" className="text-xs">
                        {command.confidence}%
                      </badge_1.Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-blue-600">🗣️ {command.bengaliText}</div>
                      <div className="text-xs text-gray-600">🌐 {command.englishTranslation}</div>
                    </div>

                    {command.codeGenerated && (<div className="bg-gray-50 p-2 rounded text-xs font-mono">
                        <div className="text-gray-500 mb-1">Generated Code:</div>
                        <div className="text-gray-800">
                          {command.codeGenerated.split("\n")[0]}
                          {command.codeGenerated.split("\n").length > 1 && "..."}
                        </div>
                      </div>)}

                    <div className="text-xs text-gray-500">{command.timestamp.toLocaleTimeString()}</div>
                  </div>))}
              </div>
            </scroll_area_1.ScrollArea>
          </card_1.CardContent>
        </card_1.Card>)}
    </div>);
}
exports.VoiceProcessor = VoiceProcessor;
//# sourceMappingURL=voice-processor.js.map