# 桌面日程助手 - 本地部署指南

## 一、环境要求

### 必需环境
- **Node.js**: >= 18.17.0 (推荐使用 Node.js 20 或 24)
- **包管理器**: pnpm (推荐) 或 npm
- **浏览器**: Chrome 或 Edge (用于安装 PWA)

### 检查环境
```bash
# 检查 Node.js 版本
node --version

# 检查 npm
npm --version

# 检查 pnpm (如果没有安装，运行: npm install -g pnpm)
pnpm --version
```

---

## 二、快速部署步骤

### 1. 创建项目目录
```bash
mkdir schedule-assistant
cd schedule-assistant
```

### 2. 创建 package.json
```json
{
  "name": "schedule-assistant",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 5000",
    "build": "next build",
    "start": "next start -p 5000"
  },
  "dependencies": {
    "next": "16.0.10",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "next-pwa": "5.6.0",
    "sharp": "0.34.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.0.10"
  }
}
```

### 3. 创建 Next.js 配置文件 `next.config.ts`
```typescript
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

### 4. 创建 TypeScript 配置 `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. 创建 Tailwind CSS 配置 `postcss.config.mjs`
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### 6. 创建目录结构
```bash
# 创建必要的目录
mkdir -p src/app public
```

### 7. 创建主页面 `src/app/page.tsx`
（使用之前提供的完整代码）

### 8. 创建布局文件 `src/app/layout.tsx`
（使用之前提供的代码）

### 9. 创建全局样式 `src/app/globals.css`
（使用之前提供的代码）

### 10. 创建 PWA 配置 `public/manifest.json`
（使用之前提供的代码）

### 11. 创建图标

你可以使用以下任一方式创建图标：

**方式一：使用在线工具**
- 访问 https://www.favicon-generator.org/ 或类似网站
- 上传你的图片，生成不同尺寸的图标
- 保存为 `public/icon-192.png` 和 `public/icon-512.png`

**方式二：使用 Node.js 脚本生成**

创建 `scripts/generate-icons.js`：
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
      <rect x="${size * 0.15}" y="${size * 0.25}" width="${size * 0.7}" height="${size * 0.55}" rx="${size * 0.04}" fill="white"/>
      <rect x="${size * 0.15}" y="${size * 0.25}" width="${size * 0.7}" height="${size * 0.15}" rx="${size * 0.04}" fill="#DBEAFE"/>
      <circle cx="${size * 0.35}" cy="${size * 0.325}" r="${size * 0.05}" fill="white"/>
      <circle cx="${size * 0.65}" cy="${size * 0.325}" r="${size * 0.05}" fill="white"/>
      <path d="M ${size * 0.35} ${size * 0.5} L ${size * 0.45} ${size * 0.6} L ${size * 0.65} ${size * 0.4}" stroke="#3B82F6" stroke-width="${size * 0.05}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `;

  const buffer = Buffer.from(svg);
  const pngBuffer = await sharp(buffer).png().toBuffer();
  return pngBuffer;
}

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const pngBuffer = await generateIcon(size);
    fs.writeFileSync(`public/icon-${size}.png`, pngBuffer);
    console.log(`Generated icon-${size}.png`);
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
```

运行生成图标：
```bash
npm install sharp
node scripts/generate-icons.js
```

### 12. 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 13. 启动开发服务器
```bash
# 开发模式（支持热更新）
pnpm dev

# 或 npm run dev
```

应用将在 `http://localhost:5000` 启动

---

## 三、生产环境部署

### 1. 构建应用
```bash
pnpm build
```

### 2. 启动生产服务器
```bash
pnpm start
```

### 3. 使用 PM2 管理进程（推荐）

安装 PM2：
```bash
pnpm add -g pm2
```

创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'schedule-assistant',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 5000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

启动 PM2：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

PM2 常用命令：
```bash
pm2 list              # 查看所有进程
pm2 logs schedule-assistant   # 查看日志
pm2 restart schedule-assistant  # 重启应用
pm2 stop schedule-assistant    # 停止应用
pm2 delete schedule-assistant  # 删除应用
```

---

## 四、安装为桌面应用 (PWA)

### 1. 使用 Chrome/Edge 浏览器访问应用
打开 `http://localhost:5000`

### 2. 安装 PWA

**Chrome 浏览器：**
- 点击地址栏右侧的安装图标（⊕）
- 或在菜单中选择"安装桌面日程助手"
- 点击"安装"

**Edge 浏览器：**
- 点击地址栏右侧的应用图标
- 选择"将此站点作为应用安装"
- 点击"安装"

### 3. 验证安装
- 桌面会出现"日程助手"图标
- 可以双击打开，独立窗口运行

---

## 五、设置开机自启动

### 方法一：Windows 启动文件夹

1. 找到桌面上的"日程助手"快捷方式
2. 按 `Win + R`，输入 `shell:startup`，回车
3. 将快捷方式复制到打开的文件夹中
4. 重启电脑测试

### 方法二：使用 Windows 任务计划程序（更稳定）

1. 打开"任务计划程序"（在开始菜单搜索）
2. 点击右侧"创建基本任务"
3. 输入名称"桌面日程助手"，点击下一步
4. 选择"当计算机启动时"，点击下一步
5. 选择"启动程序"，点击下一步
6. 程序路径：`C:\Program Files\nodejs\node.exe`
7. 添加参数：`C:\你的项目路径\node_modules\next\dist\bin\next start`
8. 起始于：`C:\你的项目路径`
9. 完成创建

---

## 六、数据备份

数据存储在浏览器的 localStorage 中，你可以：

### 导出数据
打开浏览器开发者工具（F12）→ Application → Local Storage → 选择你的网站
复制所有数据并保存到文件

### 导入数据
在开发者工具中，粘贴之前保存的数据

---

## 七、常见问题

### 问题 1：端口 5000 被占用
**解决方法：**
- 修改 `package.json` 中的端口
- 或关闭占用 5000 端口的程序：
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <进程ID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### 问题 2：依赖安装失败
**解决方法：**
```bash
# 清除缓存
pnpm store prune

# 删除 node_modules 和 pnpm-lock.yaml
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### 问题 3：PWA 无法安装
**原因：**
- 必须使用 HTTPS 或 localhost
- 检查浏览器是否支持 PWA

**解决方法：**
- 确保在 localhost 访问
- 更新浏览器到最新版本

### 问题 4：图标不显示
**解决方法：**
- 检查图标文件是否在 `public` 目录下
- 确保文件名正确：`icon-192.png` 和 `icon-512.png`
- 清除浏览器缓存后重试

---

## 八、更新和维护

### 更新应用
```bash
# 拉取最新代码
git pull

# 安装新依赖
pnpm install

# 重启服务
pm2 restart schedule-assistant
```

### 查看日志
```bash
# 开发环境
pnpm dev

# 生产环境（PM2）
pm2 logs schedule-assistant
```

---

## 九、文件目录结构

```
schedule-assistant/
├── src/
│   └── app/
│       ├── page.tsx          # 主页面
│       ├── layout.tsx        # 布局文件
│       └── globals.css       # 全局样式
├── public/
│   ├── manifest.json         # PWA 配置
│   ├── icon-192.png          # 192x192 图标
│   └── icon-512.png          # 512x512 图标
├── scripts/
│   └── generate-icons.js     # 图标生成脚本
├── next.config.ts            # Next.js 配置
├── tsconfig.json             # TypeScript 配置
├── postcss.config.mjs        # PostCSS 配置
├── package.json              # 项目配置
├── ecosystem.config.js       # PM2 配置（可选）
└── DEPLOYMENT.md             # 本文档
```

---

## 十、系统要求

### 最低配置
- CPU: 双核 2.0GHz+
- 内存: 2GB RAM
- 硬盘: 100MB 可用空间
- 操作系统: Windows 10/11, macOS 10.14+, Ubuntu 18.04+

### 推荐配置
- CPU: 四核 2.5GHz+
- 内存: 4GB RAM
- 硬盘: 500MB SSD
- 操作系统: Windows 11, macOS 12+, Ubuntu 20.04+

---

## 十一、安全建议

1. **不要在生产环境暴露开发工具**
2. **定期备份数据**
3. **使用 HTTPS 部署**（如果从外网访问）
4. **定期更新依赖包**：`pnpm update`
5. **设置防火墙规则**，只允许本地访问

---

## 技术支持

如有问题，请检查：
1. Node.js 和 pnpm 版本是否正确
2. 所有依赖是否成功安装
3. 端口 5000 是否可用
4. 浏览器是否支持 PWA

祝你使用愉快！🎉
