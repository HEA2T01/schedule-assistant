'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  time: string;
}

export default function ScheduleAssistant() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // 从 localStorage 加载数据
  useEffect(() => {
    const saved = localStorage.getItem('schedule-assistant-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('schedule-assistant-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false,
          time: time || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setInput('');
      setTime('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* PWA 安装提示 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📲</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">安装到桌面</h2>
              <p className="text-blue-100 mb-3">将此应用安装为桌面应用，获得更好的体验！</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded">Chrome/Edge</span>
                  <span>点击地址栏右侧的安装图标</span>
                </div>
                <div className="text-blue-100">
                  安装后可在桌面直接打开，像原生应用一样使用
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 桌面日程助手</h1>
          <p className="text-gray-600">高效管理你的每一天</p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* 统计信息 */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
                <div className="text-sm text-gray-500">总计</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                <div className="text-sm text-gray-500">待办</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('zh-CN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加新日程..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              添加
            </button>
          </div>

          {/* 筛选按钮 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              待办
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已完成
            </button>
          </div>

          {/* 日程列表 */}
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无日程，开始添加你的第一条任务吧！
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    todo.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {todo.text}
                    </p>
                    {todo.time && (
                      <p className="text-sm text-gray-500">⏰ {todo.time}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💡 使用说明</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📱 安装到桌面（推荐）</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                <li>使用 Chrome 或 Edge 浏览器访问此页面</li>
                <li>点击地址栏右侧的 <strong>安装图标</strong>（或菜单中的"安装应用"）</li>
                <li>确认安装，应用将添加到桌面和开始菜单</li>
                <li>双击桌面图标即可启动，无需打开浏览器</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">🚀 设置开机自启动</h3>
              <p className="text-sm text-gray-600 mb-2">先安装 PWA，然后：</p>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                <li>找到桌面上的"日程助手"快捷方式</li>
                <li>按 <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Win + R</kbd>，输入 <code className="px-2 py-1 bg-gray-200 rounded text-xs">shell:startup</code></li>
                <li>将桌面快捷方式复制到打开的文件夹</li>
                <li>重启电脑，应用将自动启动</li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-2 text-sm">✨ 优势</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 数据保存在本地，不会丢失</li>
                <li>• 独立窗口，不受浏览器标签页影响</li>
                <li>• 更好的性能和响应速度</li>
                <li>• 可以在开始菜单和任务栏固定</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
