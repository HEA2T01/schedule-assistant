'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string; // ISO date string: YYYY-MM-DD
  time: string; // time string: HH:MM
}

export default function ScheduleAssistant() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
          date: date || new Date().toISOString().split('T')[0],
          time: time || '09:00'
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

  const getTodosForDate = (dateStr: string) => {
    return todos.filter(todo => todo.date === dateStr);
  };

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 is Sunday
    const daysInMonth = lastDay.getDate();
    return { firstDay, lastDay, startDay, daysInMonth };
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const pendingCount = todos.filter(t => !t.completed).length;

  const monthData = getMonthData(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthName = currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
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
              </div>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 桌面日程助手</h1>
          <p className="text-gray-600">高效管理你的每一天</p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-sm text-gray-500">总日程</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-gray-500">待办</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{todos.length - pendingCount}</div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString('zh-CN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setView('calendar')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📅 日历视图
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 列表视图
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 添加日程 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ 添加日程</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日程内容</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="输入日程..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addTodo}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                添加日程
              </button>
            </div>

            {/* 今日日程列表 */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">今日日程</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getTodosForDate(new Date().toISOString().split('T')[0]).length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">今日暂无日程</div>
                ) : (
                  getTodosForDate(new Date().toISOString().split('T')[0]).map(todo => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
                        todo.completed
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {todo.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {todo.text}
                        </p>
                        <p className="text-xs text-gray-500">{todo.time}</p>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                      >
                        删除
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 日历视图或列表视图 */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            {view === 'calendar' ? (
              <>
                {/* 月份导航 */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevMonth}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ◀
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">{monthName}</h2>
                  <button
                    onClick={nextMonth}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ▶
                  </button>
                </div>

                {/* 星期标题 */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日历网格 */}
                <div className="grid grid-cols-7 gap-1">
                  {/* 空白填充 */}
                  {Array.from({ length: monthData.startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg"></div>
                  ))}

                  {/* 日期 */}
                  {Array.from({ length: monthData.daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayTodos = getTodosForDate(dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                    return (
                      <div
                        key={day}
                        className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all ${
                          isToday
                            ? 'bg-blue-50 border-blue-300'
                            : dayTodos.length > 0
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        {dayTodos.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs text-blue-600 font-medium">
                              共 {dayTodos.length} 个
                            </div>
                            {dayTodos.filter(t => !t.completed).length > 0 && (
                              <div className="text-xs text-orange-600">
                                待办 {dayTodos.filter(t => !t.completed).length}
                              </div>
                            )}
                            {dayTodos.filter(t => t.completed).length > 0 && (
                              <div className="text-xs text-green-600">
                                已办 {dayTodos.filter(t => t.completed).length}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">所有日程</h2>
                  <div className="flex gap-2">
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
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      暂无日程，开始添加你的第一条任务吧！
                    </div>
                  ) : (
                    filteredTodos.sort((a, b) => {
                      const dateCompare = a.date.localeCompare(b.date);
                      if (dateCompare !== 0) return dateCompare;
                      return a.time.localeCompare(b.time);
                    }).map(todo => (
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
                          <p className="text-sm text-gray-500">
                            📅 {todo.date} ⏰ {todo.time}
                          </p>
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
              </>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💡 使用说明</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📱 安装到桌面（推荐）</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                <li>使用 Chrome 或 Edge 浏览器访问此页面</li>
                <li>点击地址栏右侧的安装图标</li>
                <li>确认安装，应用将添加到桌面</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🚀 设置开机自启动</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                <li>先安装 PWA 到桌面</li>
                <li>按 <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Win + R</kbd>，输入 <code className="px-2 py-1 bg-gray-200 rounded text-xs">shell:startup</code></li>
                <li>将桌面快捷方式复制到打开的文件夹</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
