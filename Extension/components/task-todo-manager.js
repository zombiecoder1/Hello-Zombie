"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTodoManager = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const scroll_area_1 = require("@/components/ui/scroll-area");
const select_1 = require("@/components/ui/select");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
function TaskTodoManager({ onTaskCreate, onTaskUpdate, onTodoCreate, onStatusUpdate }) {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [todos, setTodos] = (0, react_1.useState)([]);
    const [newTaskTitle, setNewTaskTitle] = (0, react_1.useState)("");
    const [newTaskDescription, setNewTaskDescription] = (0, react_1.useState)("");
    const [newTaskPriority, setNewTaskPriority] = (0, react_1.useState)("medium");
    const [newTaskCategory, setNewTaskCategory] = (0, react_1.useState)("coding");
    const [newTodoText, setNewTodoText] = (0, react_1.useState)("");
    const [newTodoPriority, setNewTodoPriority] = (0, react_1.useState)("medium");
    const [activeTab, setActiveTab] = (0, react_1.useState)("tasks");
    // Create new task
    const createTask = (0, react_1.useCallback)(() => {
        if (!newTaskTitle.trim())
            return;
        const task = {
            id: `task-${Date.now()}`,
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim() || undefined,
            status: "pending",
            priority: newTaskPriority,
            category: newTaskCategory,
            createdAt: new Date(),
            bengaliTitle: newTaskTitle.includes("বাংলা") ? newTaskTitle : undefined,
        };
        setTasks((prev) => [task, ...prev]);
        setNewTaskTitle("");
        setNewTaskDescription("");
        onTaskCreate?.(task);
        onStatusUpdate?.(`📋 Task created: ${task.title}`);
    }, [newTaskTitle, newTaskDescription, newTaskPriority, newTaskCategory, onTaskCreate, onStatusUpdate]);
    // Create new todo
    const createTodo = (0, react_1.useCallback)(() => {
        if (!newTodoText.trim())
            return;
        const todo = {
            id: `todo-${Date.now()}`,
            text: newTodoText.trim(),
            completed: false,
            createdAt: new Date(),
            priority: newTodoPriority,
            category: "quick",
            bengaliText: newTodoText.includes("বাংলা") ? newTodoText : undefined,
        };
        setTodos((prev) => [todo, ...prev]);
        setNewTodoText("");
        onTodoCreate?.(todo);
        onStatusUpdate?.(`✅ Todo added: ${todo.text}`);
    }, [newTodoText, newTodoPriority, onTodoCreate, onStatusUpdate]);
    // Update task status
    const updateTaskStatus = (0, react_1.useCallback)((taskId, status) => {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            const updatedTask = { ...task, status };
            onTaskUpdate?.(updatedTask);
            onStatusUpdate?.(`📝 Task ${status}: ${task.title}`);
        }
    }, [tasks, onTaskUpdate, onStatusUpdate]);
    // Toggle todo completion
    const toggleTodo = (0, react_1.useCallback)((todoId) => {
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)));
        const todo = todos.find((t) => t.id === todoId);
        if (todo) {
            onStatusUpdate?.(`${todo.completed ? "❌ Unchecked" : "✅ Completed"}: ${todo.text}`);
        }
    }, [todos, onStatusUpdate]);
    // Delete task
    const deleteTask = (0, react_1.useCallback)((taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (task) {
            onStatusUpdate?.(`🗑️ Task deleted: ${task.title}`);
        }
    }, [tasks, onStatusUpdate]);
    // Delete todo
    const deleteTodo = (0, react_1.useCallback)((todoId) => {
        const todo = todos.find((t) => t.id === todoId);
        setTodos((prev) => prev.filter((t) => t.id !== todoId));
        if (todo) {
            onStatusUpdate?.(`🗑️ Todo deleted: ${todo.text}`);
        }
    }, [todos, onStatusUpdate]);
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "urgent":
                return <lucide_react_1.AlertCircle className="h-3 w-3 text-red-500"/>;
            case "high":
                return <lucide_react_1.Flag className="h-3 w-3 text-orange-500"/>;
            case "medium":
                return <lucide_react_1.Clock className="h-3 w-3 text-yellow-500"/>;
            case "low":
                return <lucide_react_1.Clock className="h-3 w-3 text-green-500"/>;
            default:
                return <lucide_react_1.Clock className="h-3 w-3 text-gray-500"/>;
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case "coding":
                return <lucide_react_1.Code className="h-3 w-3 text-blue-400"/>;
            case "design":
                return <lucide_react_1.Settings className="h-3 w-3 text-purple-400"/>;
            case "testing":
                return <lucide_react_1.CheckSquare className="h-3 w-3 text-green-400"/>;
            case "documentation":
                return <lucide_react_1.FileText className="h-3 w-3 text-yellow-400"/>;
            case "meeting":
                return <lucide_react_1.User className="h-3 w-3 text-orange-400"/>;
            case "personal":
                return <lucide_react_1.Calendar className="h-3 w-3 text-pink-400"/>;
            default:
                return <lucide_react_1.Square className="h-3 w-3 text-gray-400"/>;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "border-green-600 text-green-300";
            case "in-progress":
                return "border-blue-600 text-blue-300";
            case "cancelled":
                return "border-red-600 text-red-300";
            default:
                return "border-gray-600 text-gray-300";
        }
    };
    const taskStats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
    };
    const todoStats = {
        total: todos.length,
        completed: todos.filter((t) => t.completed).length,
        pending: todos.filter((t) => !t.completed).length,
    };
    return (<card_1.Card className="bg-slate-800 border-slate-700">
      <card_1.CardHeader className="pb-3">
        <card_1.CardTitle className="text-sm flex items-center gap-2 text-white">
          <lucide_react_1.CheckSquare className="h-4 w-4"/>
          Task & Todo Manager
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <tabs_1.TabsTrigger value="tasks" className="text-xs">
              Tasks ({taskStats.total})
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="todos" className="text-xs">
              Todos ({todoStats.total})
            </tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="tasks" className="space-y-4 mt-4">
            {/* Task Creation */}
            <div className="space-y-3 p-3 bg-slate-700 rounded">
              <input_1.Input placeholder="Task title (Bengali or English)..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="bg-slate-800 border-slate-600 text-white"/>

              <textarea_1.Textarea placeholder="Task description (optional)..." value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} className="bg-slate-800 border-slate-600 text-white min-h-[60px]"/>

              <div className="flex gap-2">
                <select_1.Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value)}>
                  <select_1.SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent className="bg-slate-800 border-slate-600">
                    <select_1.SelectItem value="low">Low Priority</select_1.SelectItem>
                    <select_1.SelectItem value="medium">Medium Priority</select_1.SelectItem>
                    <select_1.SelectItem value="high">High Priority</select_1.SelectItem>
                    <select_1.SelectItem value="urgent">Urgent</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>

                <select_1.Select value={newTaskCategory} onValueChange={(value) => setNewTaskCategory(value)}>
                  <select_1.SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent className="bg-slate-800 border-slate-600">
                    <select_1.SelectItem value="coding">Coding</select_1.SelectItem>
                    <select_1.SelectItem value="design">Design</select_1.SelectItem>
                    <select_1.SelectItem value="testing">Testing</select_1.SelectItem>
                    <select_1.SelectItem value="documentation">Documentation</select_1.SelectItem>
                    <select_1.SelectItem value="meeting">Meeting</select_1.SelectItem>
                    <select_1.SelectItem value="personal">Personal</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>

                <button_1.Button onClick={createTask} disabled={!newTaskTitle.trim()} className="bg-blue-600 hover:bg-blue-700">
                  <lucide_react_1.Plus className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-blue-300">{taskStats.pending}</div>
                <div className="text-gray-400">Pending</div>
              </div>
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-yellow-300">{taskStats.inProgress}</div>
                <div className="text-gray-400">In Progress</div>
              </div>
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-300">{taskStats.completed}</div>
                <div className="text-gray-400">Completed</div>
              </div>
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-purple-300">{taskStats.total}</div>
                <div className="text-gray-400">Total</div>
              </div>
            </div>

            {/* Tasks List */}
            <scroll_area_1.ScrollArea className="h-64">
              <div className="space-y-2">
                {tasks.length === 0 ? (<div className="text-center py-8">
                    <lucide_react_1.CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-500"/>
                    <div className="text-xs text-gray-400">No tasks yet</div>
                    <div className="text-xs text-gray-500 mt-1">Create your first task above</div>
                  </div>) : (tasks.map((task) => (<div key={task.id} className={`border rounded p-3 space-y-2 ${getStatusColor(task.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(task.category)}
                          <span className="text-sm font-medium text-white">{task.title}</span>
                          {task.bengaliTitle && (<badge_1.Badge variant="outline" className="text-xs border-orange-600 text-orange-300">
                              🇧🇩
                            </badge_1.Badge>)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(task.priority)}
                          <badge_1.Badge variant="outline" className="text-xs border-slate-500 text-gray-300">
                            {task.status}
                          </badge_1.Badge>
                        </div>
                      </div>

                      {task.description && <div className="text-xs text-gray-400">{task.description}</div>}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">{task.createdAt.toLocaleDateString()}</div>
                        <div className="flex gap-1">
                          <select_1.Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                            <select_1.SelectTrigger className="h-6 text-xs bg-slate-700 border-slate-600">
                              <select_1.SelectValue />
                            </select_1.SelectTrigger>
                            <select_1.SelectContent className="bg-slate-800 border-slate-600">
                              <select_1.SelectItem value="pending">Pending</select_1.SelectItem>
                              <select_1.SelectItem value="in-progress">In Progress</select_1.SelectItem>
                              <select_1.SelectItem value="completed">Completed</select_1.SelectItem>
                              <select_1.SelectItem value="cancelled">Cancelled</select_1.SelectItem>
                            </select_1.SelectContent>
                          </select_1.Select>

                          <button_1.Button size="sm" variant="outline" onClick={() => deleteTask(task.id)} className="h-6 w-6 p-0 border-slate-600">
                            <lucide_react_1.Trash2 className="h-3 w-3"/>
                          </button_1.Button>
                        </div>
                      </div>
                    </div>)))}
              </div>
            </scroll_area_1.ScrollArea>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="todos" className="space-y-4 mt-4">
            {/* Todo Creation */}
            <div className="space-y-3 p-3 bg-slate-700 rounded">
              <div className="flex gap-2">
                <input_1.Input placeholder="Quick todo (Bengali or English)..." value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} className="bg-slate-800 border-slate-600 text-white" onKeyDown={(e) => e.key === "Enter" && createTodo()}/>

                <select_1.Select value={newTodoPriority} onValueChange={(value) => setNewTodoPriority(value)}>
                  <select_1.SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent className="bg-slate-800 border-slate-600">
                    <select_1.SelectItem value="low">Low</select_1.SelectItem>
                    <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                    <select_1.SelectItem value="high">High</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>

                <button_1.Button onClick={createTodo} disabled={!newTodoText.trim()} className="bg-green-600 hover:bg-green-700">
                  <lucide_react_1.Plus className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </div>

            {/* Todo Statistics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-yellow-300">{todoStats.pending}</div>
                <div className="text-gray-400">Pending</div>
              </div>
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-300">{todoStats.completed}</div>
                <div className="text-gray-400">Completed</div>
              </div>
              <div className="bg-slate-700 rounded p-2 text-center">
                <div className="text-lg font-bold text-purple-300">{todoStats.total}</div>
                <div className="text-gray-400">Total</div>
              </div>
            </div>

            {/* Todos List */}
            <scroll_area_1.ScrollArea className="h-64">
              <div className="space-y-2">
                {todos.length === 0 ? (<div className="text-center py-8">
                    <lucide_react_1.Square className="h-8 w-8 mx-auto mb-2 text-gray-500"/>
                    <div className="text-xs text-gray-400">No todos yet</div>
                    <div className="text-xs text-gray-500 mt-1">Add a quick todo above</div>
                  </div>) : (todos.map((todo) => (<div key={todo.id} className={`border rounded p-3 flex items-center justify-between ${todo.completed ? "border-green-600 bg-green-900/10" : "border-slate-600"}`}>
                      <div className="flex items-center gap-3">
                        <button_1.Button size="sm" variant="ghost" onClick={() => toggleTodo(todo.id)} className="h-6 w-6 p-0">
                          {todo.completed ? (<lucide_react_1.CheckSquare className="h-4 w-4 text-green-400"/>) : (<lucide_react_1.Square className="h-4 w-4 text-gray-400"/>)}
                        </button_1.Button>

                        <div className="flex-1">
                          <div className={`text-sm ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>
                            {todo.text}
                          </div>
                          {todo.bengaliText && (<div className="text-xs text-orange-300 bengali-text">🇧🇩 {todo.bengaliText}</div>)}
                          <div className="text-xs text-gray-500">{todo.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getPriorityIcon(todo.priority)}
                        <button_1.Button size="sm" variant="outline" onClick={() => deleteTodo(todo.id)} className="h-6 w-6 p-0 border-slate-600">
                          <lucide_react_1.Trash2 className="h-3 w-3"/>
                        </button_1.Button>
                      </div>
                    </div>)))}
              </div>
            </scroll_area_1.ScrollArea>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.TaskTodoManager = TaskTodoManager;
exports.default = TaskTodoManager;
//# sourceMappingURL=task-todo-manager.js.map