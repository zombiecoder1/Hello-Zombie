"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileIndexer = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const scroll_area_1 = require("@/components/ui/scroll-area");
const alert_1 = require("@/components/ui/alert");
const switch_1 = require("@/components/ui/switch");
const label_1 = require("@/components/ui/label");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
function FileIndexer({ onIndexUpdate, onStatusUpdate }) {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(null);
    const [isIndexing, setIsIndexing] = (0, react_1.useState)(false);
    const [autoIndex, setAutoIndex] = (0, react_1.useState)(true);
    const [indexProgress, setIndexProgress] = (0, react_1.useState)(0);
    const [indexedFiles, setIndexedFiles] = (0, react_1.useState)([]);
    // Simulate file indexing
    const performIndexing = (0, react_1.useCallback)(async (filePath = "current-file.tsx") => {
        setIsIndexing(true);
        setIndexProgress(0);
        onStatusUpdate?.(`🔍 Indexing ${filePath}...`);
        // Simulate indexing progress
        for (let i = 0; i <= 100; i += 10) {
            setIndexProgress(i);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // Create mock file index
        const mockIndex = {
            filePath,
            lines: [
                {
                    number: 1,
                    content: "// ZombieCoder Bengali Privacy Editor",
                    type: "comment",
                    entities: ["ZombieCoder", "Bengali", "Privacy", "Editor"],
                    references: [],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 2,
                    content: "// আপনার ZombieCoder AI এর সাথে integrated",
                    type: "comment",
                    entities: ["আপনার", "ZombieCoder", "AI", "integrated"],
                    references: [],
                    language: "bengali",
                    indentation: 0,
                },
                {
                    number: 3,
                    content: "",
                    type: "empty",
                    entities: [],
                    references: [],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 4,
                    content: "import React from 'react';",
                    type: "import",
                    entities: ["React"],
                    references: ["react"],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 5,
                    content: "import { useState } from 'react';",
                    type: "import",
                    entities: ["useState"],
                    references: ["react"],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 6,
                    content: "",
                    type: "empty",
                    entities: [],
                    references: [],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 7,
                    content: "function BengaliGreeting(name) {",
                    type: "function",
                    entities: ["BengaliGreeting", "name"],
                    references: [],
                    language: "typescript",
                    indentation: 0,
                },
                {
                    number: 8,
                    content: "  // আমার সোনার বাংলা - আমি তোমায় ভালবাসি",
                    type: "comment",
                    entities: ["আমার", "সোনার", "বাংলা", "আমি", "তোমায়", "ভালবাসি"],
                    references: [],
                    language: "bengali",
                    indentation: 2,
                },
                {
                    number: 9,
                    content: '  console.log("Hello " + name);',
                    type: "code",
                    entities: ["console", "log", "Hello", "name"],
                    references: ["console"],
                    language: "typescript",
                    indentation: 2,
                },
                {
                    number: 10,
                    content: "  return `নমস্কার, ${name}! ZombieCoder এ স্বাগতম!`;",
                    type: "code",
                    entities: ["return", "নমস্কার", "name", "ZombieCoder", "স্বাগতম"],
                    references: ["name"],
                    language: "typescript",
                    indentation: 2,
                },
                {
                    number: 11,
                    content: "}",
                    type: "code",
                    entities: [],
                    references: [],
                    language: "typescript",
                    indentation: 0,
                },
            ],
            symbols: [
                {
                    name: "BengaliGreeting",
                    type: "function",
                    line: 7,
                    scope: "global",
                },
                {
                    name: "name",
                    type: "variable",
                    line: 7,
                    scope: "BengaliGreeting",
                },
            ],
            imports: [
                {
                    module: "react",
                    items: ["React"],
                    line: 4,
                },
                {
                    module: "react",
                    items: ["useState"],
                    line: 5,
                },
            ],
            metadata: {
                language: "typescript",
                totalLines: 11,
                codeLines: 6,
                commentLines: 3,
                emptyLines: 2,
                lastModified: new Date(),
                encoding: "utf-8",
                bengaliLines: 2,
            },
        };
        setCurrentIndex(mockIndex);
        setIndexedFiles((prev) => [...prev.filter((f) => f !== filePath), filePath]);
        setIsIndexing(false);
        setIndexProgress(100);
        onIndexUpdate?.(mockIndex);
        onStatusUpdate?.(`✅ Indexed ${filePath}: ${mockIndex.metadata.totalLines} lines, ${mockIndex.symbols.length} symbols`);
    }, [onIndexUpdate, onStatusUpdate]);
    // Auto-index on mount
    (0, react_1.useEffect)(() => {
        if (autoIndex) {
            performIndexing();
        }
    }, [autoIndex, performIndexing]);
    const getLineTypeIcon = (type) => {
        switch (type) {
            case "function":
                return <lucide_react_1.Code className="h-3 w-3 text-blue-400"/>;
            case "import":
                return <lucide_react_1.Hash className="h-3 w-3 text-purple-400"/>;
            case "comment":
                return <lucide_react_1.FileText className="h-3 w-3 text-green-400"/>;
            case "variable":
                return <lucide_react_1.Database className="h-3 w-3 text-yellow-400"/>;
            case "class":
                return <lucide_react_1.Folder className="h-3 w-3 text-red-400"/>;
            default:
                return <lucide_react_1.FileText className="h-3 w-3 text-gray-400"/>;
        }
    };
    return (<card_1.Card className="bg-slate-800 border-slate-700">
      <card_1.CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="text-sm flex items-center gap-2 text-white">
            <lucide_react_1.Search className="h-4 w-4"/>
            File Indexer ({indexedFiles.length})
          </card_1.CardTitle>
          <button_1.Button size="sm" onClick={() => performIndexing()} disabled={isIndexing} className="h-7 bg-purple-600 hover:bg-purple-700">
            {isIndexing ? (<lucide_react_1.RefreshCw className="h-3 w-3 animate-spin"/>) : (<lucide_react_1.RefreshCw className="h-3 w-3"/>)}
          </button_1.Button>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        {/* Auto Index Toggle */}
        <div className="flex items-center justify-between">
          <label_1.Label className="text-sm text-gray-300">Auto Index:</label_1.Label>
          <switch_1.Switch checked={autoIndex} onCheckedChange={setAutoIndex}/>
        </div>

        {/* Indexing Progress */}
        {isIndexing && (<div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Indexing Progress</span>
              <span className="text-gray-400">{indexProgress}%</span>
            </div>
            <progress_1.Progress value={indexProgress} className="h-2"/>
          </div>)}

        {/* Index Statistics */}
        {currentIndex && (<div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-lg font-bold text-blue-300">{currentIndex.metadata.totalLines}</div>
              <div className="text-gray-400">Total Lines</div>
            </div>
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-lg font-bold text-green-300">{currentIndex.symbols.length}</div>
              <div className="text-gray-400">Symbols</div>
            </div>
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-lg font-bold text-purple-300">{currentIndex.imports.length}</div>
              <div className="text-gray-400">Imports</div>
            </div>
            <div className="bg-slate-700 rounded p-2 text-center">
              <div className="text-lg font-bold text-orange-300">{currentIndex.metadata.bengaliLines}</div>
              <div className="text-gray-400">Bengali Lines</div>
            </div>
          </div>)}

        {/* Symbols List */}
        {currentIndex && (<div className="space-y-2">
            <label_1.Label className="text-sm text-gray-300">Symbols Found:</label_1.Label>
            <scroll_area_1.ScrollArea className="h-32">
              <div className="space-y-1">
                {currentIndex.symbols.map((symbol, index) => (<div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded text-xs">
                    <div className="flex items-center gap-2">
                      {getLineTypeIcon(symbol.type)}
                      <span className="text-white font-medium">{symbol.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <badge_1.Badge variant="outline" className="text-xs border-slate-500 text-gray-300">
                        {symbol.type}
                      </badge_1.Badge>
                      <badge_1.Badge variant="secondary" className="text-xs">
                        L{symbol.line}
                      </badge_1.Badge>
                    </div>
                  </div>))}
              </div>
            </scroll_area_1.ScrollArea>
          </div>)}

        {/* Indexed Files */}
        <div className="space-y-2">
          <label_1.Label className="text-sm text-gray-300">Indexed Files:</label_1.Label>
          <scroll_area_1.ScrollArea className="h-20">
            <div className="space-y-1">
              {indexedFiles.map((file, index) => (<div key={index} className="flex items-center gap-2 p-1 text-xs text-gray-300">
                  <lucide_react_1.FileText className="h-3 w-3"/>
                  <span>{file}</span>
                  <lucide_react_1.CheckCircle className="h-3 w-3 text-green-400 ml-auto"/>
                </div>))}
            </div>
          </scroll_area_1.ScrollArea>
        </div>

        {/* Status Alert */}
        <alert_1.Alert className={`${currentIndex ? "bg-green-900/20 border-green-700" : "bg-yellow-900/20 border-yellow-700"}`}>
          {currentIndex ? (<lucide_react_1.CheckCircle className="h-4 w-4"/>) : (<lucide_react_1.AlertTriangle className="h-4 w-4"/>)}
          <alert_1.AlertDescription className="text-sm">
            {currentIndex ? (<>
                <strong>Index Ready:</strong> {currentIndex.metadata.totalLines} lines analyzed
                {currentIndex.metadata.bengaliLines > 0 && ` • ${currentIndex.metadata.bengaliLines} Bengali lines detected`}
              </>) : (<strong>No Index:</strong>)} Click refresh to index current file
            )}
          </alert_1.AlertDescription>
        </alert_1.Alert>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.FileIndexer = FileIndexer;
exports.default = FileIndexer;
//# sourceMappingURL=file-indexer.js.map