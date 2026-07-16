#!/bin/bash
set -e

echo "📜 Paper Collage Story Video Skill 安装器"
echo "========================================"
echo ""

# 检查依赖
echo "🔍 检查系统依赖..."
missing=()

if ! command -v git &> /dev/null; then missing+=("git"); fi
if ! command -v python3 &> /dev/null; then missing+=("python3"); fi
if ! command -v ffmpeg &> /dev/null; then missing+=("ffmpeg"); fi
if ! command -v node &> /dev/null; then missing+=("node.js"); fi

if [ ${#missing[@]} -gt 0 ]; then
    echo "❌ 缺少以下工具：${missing[*]}"
    echo ""
    echo "请先安装它们："
    echo "  macOS:  brew install git python3 ffmpeg node"
    echo "  Linux:  apt install git python3 ffmpeg nodejs"
    echo "  Windows: 访问 nodejs.org 和 ffmpeg.org 下载安装程序"
    exit 1
fi

echo "✅ 所有依赖已安装"
echo ""

# 询问安装位置
echo "选择安装位置："
echo "  1. Codex (~/.codex/skills)"
echo "  2. Claude Code (~/.claude/skills)"
read -p "请选择 [1/2]: " choice

case "$choice" in
  1)
    SKILLS_DIR="${HOME}/.codex/skills"
    TARGET="Codex"
    ;;
  2)
    SKILLS_DIR="${HOME}/.claude/skills"
    TARGET="Claude Code"
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

echo "将安装到：$SKILLS_DIR"
echo ""

# 检查是否已安装
if [ -d "$SKILLS_DIR/paper-collage-story-video" ]; then
    echo "⚠️  已检测到旧版本，正在覆盖..."
    rm -rf "$SKILLS_DIR/paper-collage-story-video"
fi

# 创建目录
mkdir -p "$SKILLS_DIR"

# 下载并安装
echo "📥 下载 Skill..."
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

git clone --depth 1 https://github.com/Mr-funny/paper-collage-story-video.git "$TEMP_DIR/repo" 2>&1 | grep -v "Cloning\|Receiving\|Resolving\|Unpacking" || true

if [ ! -d "$TEMP_DIR/repo/skills/paper-collage-story-video" ]; then
    echo "❌ 下载失败，请检查网络连接"
    exit 1
fi

cp -R "$TEMP_DIR/repo/skills/paper-collage-story-video" "$SKILLS_DIR/"

echo ""
echo "========================================"
echo "✅ 安装完成！"
echo ""
echo "📍 安装路径："
echo "   $SKILLS_DIR/paper-collage-story-video"
echo ""
echo "🚀 后续步骤："
echo "   1. 重启 $TARGET 应用"
echo "   2. 新建任务，输入："
echo "      使用 \$paper-collage-story-video，把'孙中山建立民国'制作成纸片剪贴动画。"
echo ""
echo "📖 详细指南："
echo "   https://github.com/Mr-funny/paper-collage-story-video/blob/main/INSTALL.md"
echo ""
