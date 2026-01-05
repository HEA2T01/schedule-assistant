#!/bin/bash

echo "========================================"
echo "   桌面日程助手 - 一键启动脚本"
echo "========================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  未检测到 pnpm"
    echo "正在安装 pnpm..."
    npm install -g pnpm
fi

echo "✅ 环境检查完成"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
    echo ""
fi

echo "🚀 正在启动桌面日程助手..."
echo ""
echo "应用地址: http://localhost:5000"
echo "按 Ctrl+C 停止服务器"
echo ""
echo "========================================"
echo ""

# 启动开发服务器
pnpm dev
