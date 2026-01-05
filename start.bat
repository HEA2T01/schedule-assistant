@echo off
chcp 65001 > nul
echo ========================================
echo    桌面日程助手 - 一键启动脚本
echo ========================================
echo.

echo 正在检查环境...

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 pnpm
    echo 正在安装 pnpm...
    npm install -g pnpm
)

echo ✅ 环境检查完成
echo.

:: 检查依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    pnpm install
    echo.
)

echo 🚀 正在启动桌面日程助手...
echo.
echo 应用地址: http://localhost:5000
echo 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

:: 启动开发服务器
pnpm dev
