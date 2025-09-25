"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningJournal = void 0;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const textarea_1 = require("@/components/ui/textarea");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
function LearningJournal({ onEntryAdded }) {
    const [entries, setEntries] = (0, react_1.useState)([
        {
            id: "1",
            date: new Date(),
            title: "JavaScript Async/Await শিখেছি",
            content: "আজ async/await এর ব্যবহার শিখেছি। Promise এর চেয়ে অনেক সহজ এবং readable কোড লেখা যায়।",
            tags: ["javascript", "async", "promises"],
            difficulty: 3,
            type: "concept",
            codeSnippet: "async function fetchData() {\n  const response = await fetch('/api/data');\n  return response.json();\n}",
        },
        {
            id: "2",
            date: new Date(Date.now() - 86400000),
            title: "React useEffect Hook",
            content: "useEffect এর dependency array কিভাবে কাজ করে সেটা বুঝেছি। Empty array দিলে শুধু mount এ চলে।",
            tags: ["react", "hooks", "useeffect"],
            difficulty: 4,
            type: "concept",
        },
    ]);
    const [newEntry, setNewEntry] = (0, react_1.useState)({
        title: "",
        content: "",
        tags: [],
        difficulty: 3,
        type: "concept",
        codeSnippet: "",
    });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [selectedTags, setSelectedTags] = (0, react_1.useState)([]);
    // Get all unique tags
    const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));
    // Filter entries based on search and tags
    const filteredEntries = entries.filter((entry) => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => entry.tags.includes(tag));
        return matchesSearch && matchesTags;
    });
    const addEntry = (0, react_1.useCallback)(() => {
        if (!newEntry.title || !newEntry.content)
            return;
        const entry = {
            id: Date.now().toString(),
            date: new Date(),
            title: newEntry.title,
            content: newEntry.content,
            tags: newEntry.tags || [],
            difficulty: newEntry.difficulty || 3,
            type: newEntry.type || "concept",
            codeSnippet: newEntry.codeSnippet,
            relatedFiles: [],
        };
        setEntries((prev) => [entry, ...prev]);
        onEntryAdded(entry);
        // Reset form
        setNewEntry({
            title: "",
            content: "",
            tags: [],
            difficulty: 3,
            type: "concept",
            codeSnippet: "",
        });
    }, [newEntry, onEntryAdded]);
    const addTag = (0, react_1.useCallback)((tag) => {
        if (tag && !newEntry.tags?.includes(tag)) {
            setNewEntry((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), tag],
            }));
        }
    }, [newEntry.tags]);
    const removeTag = (0, react_1.useCallback)((tagToRemove) => {
        setNewEntry((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
        }));
    }, []);
    const toggleTagFilter = (0, react_1.useCallback)((tag) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    }, []);
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 1:
                return "bg-green-100 text-green-800";
            case 2:
                return "bg-blue-100 text-blue-800";
            case 3:
                return "bg-yellow-100 text-yellow-800";
            case 4:
                return "bg-orange-100 text-orange-800";
            case 5:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case "concept":
                return <lucide_react_1.BookOpen className="h-3 w-3"/>;
            case "code":
                return <code className="h-3 w-3">{"</>"}</code>;
            case "problem":
                return <lucide_react_1.Target className="h-3 w-3"/>;
            case "insight":
                return <lucide_react_1.Lightbulb className="h-3 w-3"/>;
            case "goal":
                return <lucide_react_1.TrendingUp className="h-3 w-3"/>;
            default:
                return <lucide_react_1.BookOpen className="h-3 w-3"/>;
        }
    };
    return (<div className="space-y-6">
      {/* Add New Entry */}
      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <card_1.CardTitle className="text-sm flex items-center gap-2">
            <lucide_react_1.Plus className="h-4 w-4"/>
            নতুন শেখার এন্ট্রি যোগ করুন
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input_1.Input value={newEntry.title || ""} onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))} placeholder="আজ আমি কী শিখেছি..."/>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select value={newEntry.type || "concept"} onChange={(e) => setNewEntry((prev) => ({ ...prev, type: e.target.value }))} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option value="concept">Concept</option>
                <option value="code">Code</option>
                <option value="problem">Problem</option>
                <option value="insight">Insight</option>
                <option value="goal">Goal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea_1.Textarea value={newEntry.content || ""} onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))} placeholder="বিস্তারিত লিখুন..." className="min-h-[100px]"/>
          </div>

          {newEntry.type === "code" && (<div>
              <label className="text-sm font-medium">Code Snippet</label>
              <textarea_1.Textarea value={newEntry.codeSnippet || ""} onChange={(e) => setNewEntry((prev) => ({ ...prev, codeSnippet: e.target.value }))} placeholder="// Your code here..." className="font-mono text-sm"/>
            </div>)}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2 mt-1">
                <input_1.Input placeholder="Add tag..." onKeyPress={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag(e.currentTarget.value);
                e.currentTarget.value = "";
            }
        }}/>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newEntry.tags?.map((tag) => (<badge_1.Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">
                      ×
                    </button>
                  </badge_1.Badge>))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((level) => (<button key={level} onClick={() => setNewEntry((prev) => ({ ...prev, difficulty: level }))} className={`p-1 rounded ${(newEntry.difficulty || 3) >= level ? "text-yellow-500" : "text-gray-300"}`}>
                    <lucide_react_1.Star className="h-4 w-4 fill-current"/>
                  </button>))}
              </div>
            </div>
          </div>

          <button_1.Button onClick={addEntry} disabled={!newEntry.title || !newEntry.content}>
            <lucide_react_1.Save className="h-3 w-3 mr-1"/>
            সংরক্ষণ করুন
          </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

      {/* Search and Filter */}
      <card_1.Card>
        <card_1.CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <lucide_react_1.Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <input_1.Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search entries..." className="pl-10"/>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (<badge_1.Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className="text-xs cursor-pointer" onClick={() => toggleTagFilter(tag)}>
                  <lucide_react_1.Tag className="h-3 w-3 mr-1"/>
                  {tag}
                </badge_1.Badge>))}
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Entries List */}
      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <card_1.CardTitle className="text-sm flex items-center gap-2">
            <lucide_react_1.BookOpen className="h-4 w-4"/>
            Learning Journal ({filteredEntries.length} entries)
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <scroll_area_1.ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredEntries.map((entry) => (<div key={entry.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(entry.type)}
                        <h3 className="font-medium text-sm">{entry.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <lucide_react_1.Calendar className="h-3 w-3"/>
                        {entry.date.toLocaleDateString()}
                        <badge_1.Badge className={`text-xs ${getDifficultyColor(entry.difficulty)}`}>
                          {Array.from({ length: entry.difficulty }, (_, i) => (<lucide_react_1.Star key={i} className="h-2 w-2 fill-current"/>))}
                        </badge_1.Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">{entry.content}</p>

                  {entry.codeSnippet && (<div className="bg-gray-50 p-3 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{entry.codeSnippet}</pre>
                    </div>)}

                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag) => (<badge_1.Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </badge_1.Badge>))}
                  </div>
                </div>))}

              {filteredEntries.length === 0 && (<div className="text-center py-8 text-gray-500">
                  <lucide_react_1.BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                  <p>No entries found</p>
                </div>)}
            </div>
          </scroll_area_1.ScrollArea>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.LearningJournal = LearningJournal;
//# sourceMappingURL=learning-journal.js.map