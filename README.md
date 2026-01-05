# 桌面日程助手

一个现代化的桌面日程管理应用，支持日历视图、精确时间管理和开机自启动。

## 功能特性

- ✅ **精确时间管理** - 支持年、月、日、时、分的精确设置
- ✅ **日历视图** - 直观的月历展示，一目了然
- ✅ **每日统计** - 显示每日的日程总数、待办和已完成
- ✅ **视图切换** - 支持日历视图和列表视图切换
- ✅ **数据持久化** - 使用 localStorage 本地存储，数据不丢失
- ✅ **PWA 支持** - 可安装到桌面，像原生应用一样使用
- ✅ **开机自启动** - 支持开机自动启动
- ✅ **响应式设计** - 美观界面，适配不同屏幕

## 快速开始

### 方式一：使用启动脚本

**Windows:**
```bash
双击 start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
pnpm start
```

应用将在 http://localhost:5000 启动

## 安装为桌面应用

1. 使用 Chrome 或 Edge 浏览器访问 http://localhost:5000
2. 点击地址栏右侧的安装图标
3. 确认安装

## 设置开机自启动

### Windows

**方法一：启动文件夹**
1. 找到桌面上的"日程助手"快捷方式
2. 按 `Win + R`，输入 `shell:startup`
3. 将快捷方式复制到打开的文件夹

**方法二：使用 PM2（推荐）**
```bash
pnpm add -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Mac/Linux

使用 Launchd 或 systemd 设置开机自启动，详见 `DEPLOYMENT.md`

## 项目结构

```
schedule-assistant/
├── src/app/          # 源代码
│   ├── page.tsx      # 主页面
│   ├── layout.tsx    # 布局
│   └── globals.css   # 样式
├── public/           # 静态资源
│   ├── manifest.json # PWA 配置
│   └── icon-*.png    # 应用图标
└── scripts/          # 工具脚本
```

## 技术栈

- **框架**: Next.js 16
- **UI**: React 19 + Tailwind CSS 4
- **语言**: TypeScript 5
- **PWA**: next-pwa 5
- **图标**: sharp

## 环境要求

- Node.js >= 18.17.0
- pnpm >= 8 (或 npm)

## 详细文档

- [部署指南](DEPLOYMENT.md) - 完整的本地部署说明
- [文件清单](FILE_CHECKLIST.md) - 所需文件列表

## 使用说明

1. **添加日程**: 输入内容，选择日期和时间，点击添加
2. **标记完成**: 点击日程左侧的圆圈
3. **删除日程**: 点击删除按钮
4. **切换视图**: 点击"日历视图"或"列表视图"
5. **查看统计**: 在日历中查看每日的日程统计

## 数据备份

数据存储在浏览器的 localStorage 中：

**导出数据:**
- 打开开发者工具（F12）
- Application → Local Storage → 选择网站
- 复制所有数据保存

**导入数据:**
- 在开发者工具中粘贴数据

## 常见问题

**Q: 端口 5000 被占用？**
A: 修改 `package.json` 中的端口号

**Q: PWA 无法安装？**
A: 确保在 localhost 访问，更新浏览器

**Q: 图标不显示？**
A: 运行 `node scripts/generate-icons.js` 重新生成

详见 [DEPLOYMENT.md](DEPLOYMENT.md)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受高效的日程管理！** 📅✨
