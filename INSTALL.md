# 一键安装指南

## 📥 快速安装（所有系统通用）

### 方式 1：自动安装脚本（推荐）

#### macOS / Linux

```bash
#!/bin/bash
set -e

# 选择安装目标：Codex 或 Claude Code
read -p "安装到 Codex (c) 还是 Claude Code (cc)？[c/cc]: " choice

case "$choice" in
  c)  SKILLS_DIR="${HOME}/.codex/skills" ;;
  cc) SKILLS_DIR="${HOME}/.claude/skills" ;;
  *)  echo "无效选择"; exit 1 ;;
esac

mkdir -p "$SKILLS_DIR"

git clone https://github.com/Mr-funny/paper-collage-story-video.git /tmp/paper-collage-temp
cp -R /tmp/paper-collage-temp/skills/paper-collage-story-video "$SKILLS_DIR/"
rm -rf /tmp/paper-collage-temp

echo "✅ Skill 已安装到：$SKILLS_DIR/paper-collage-story-video"
echo "📖 重启后即可在新任务中使用 \$paper-collage-story-video"
```

#### Windows PowerShell

```powershell
# 选择安装目标
$choice = Read-Host "安装到 Codex (c) 还是 Claude Code (cc)？[c/cc]"
$skillsDir = if ($choice -eq "c") { "$env:USERPROFILE\.codex\skills" } else { "$env:USERPROFILE\.claude\skills" }

New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null

git clone https://github.com/Mr-funny/paper-collage-story-video.git "$env:TEMP\paper-collage-temp"
Copy-Item -Recurse -Force "$env:TEMP\paper-collage-temp\skills\paper-collage-story-video" -Destination $skillsDir
Remove-Item -Recurse -Force "$env:TEMP\paper-collage-temp"

Write-Host "✅ Skill 已安装到：$skillsDir\paper-collage-story-video"
Write-Host "📖 重启后即可在新任务中使用 `$paper-collage-story-video"
```

### 方式 2：手动安装

#### Codex

```bash
git clone https://github.com/Mr-funny/paper-collage-story-video.git
cp -R paper-collage-story-video/skills/paper-collage-story-video ~/.codex/skills/
```

#### Claude Code

```bash
git clone https://github.com/Mr-funny/paper-collage-story-video.git
cp -R paper-collage-story-video/skills/paper-collage-story-video ~/.claude/skills/
```

#### Windows（手动）

1. 在 [GitHub](https://github.com/Mr-funny/paper-collage-story-video) 上点 "Code → Download ZIP"
2. 解压到任意文件夹
3. 打开文件浏览器，进入：`%USERPROFILE%\.codex\skills`（Codex）或 `%USERPROFILE%\.claude\skills`（Claude Code）
4. 把 `paper-collage-story-video-main/skills/paper-collage-story-video` 文件夹复制进去
5. 重启应用

## 🧪 验证安装

### Codex

打开 Codex，开启一个新任务，输入：

```text
使用 $paper-collage-story-video，帮我把"苏武牧羊"制作成一条带故事字幕的纸片剪贴动画。
```

看到 AI 自动调用 Skill 并开始策划故事，说明安装成功。

### Claude Code

在 Claude Code 的新对话中，说：

```text
使用 $paper-collage-story-video 技能，把"孙中山建立民国"制作成一条15秒的三幕纸片剪贴视频。
```

## ⚙️ 依赖检查

Skill 正常工作需要本地安装这些工具。运行以下命令验证：

```bash
node --version      # Node.js 18+ 必需
python3 --version   # Python 3.9+ 必需
ffmpeg -version     # FFmpeg 必需
pnpm --version      # 推荐（npm 也能用，但 pnpm 更快）
```

如果某个工具缺失：

| 工具 | 安装命令 |
| --- | --- |
| **Node.js** | 访问 [nodejs.org](https://nodejs.org)，安装 LTS 版本 |
| **Python 3.9+** | 访问 [python.org](https://www.python.org) 或用包管理器 `brew install python3` |
| **FFmpeg** | `brew install ffmpeg` (macOS) / `choco install ffmpeg` (Windows) / `apt install ffmpeg` (Linux) |
| **pnpm** | `npm install -g pnpm` |

## 📍 安装位置参考

### Codex
- **macOS/Linux**: `~/.codex/skills/paper-collage-story-video/`
- **Windows**: `%USERPROFILE%\.codex\skills\paper-collage-story-video\`

### Claude Code
- **macOS/Linux**: `~/.claude/skills/paper-collage-story-video/`
- **Windows**: `%USERPROFILE%\.claude\skills\paper-collage-story-video\`

## 🆘 故障排除

### 问题：安装后看不到 Skill

**解决**：
1. 检查文件夹是否存在：`~/.codex/skills/paper-collage-story-video/SKILL.md` 应该存在
2. 重启 Codex / Claude Code 应用
3. 确认 SKILL.md 的 `name:` 字段是 `paper-collage-story-video`（小写字母、数字、连字符）

### 问题：任务中调用 Skill 时报错"找不到 Skill"

**解决**：
- 确保用的是 `$paper-collage-story-video` 格式（以 `$` 开头）
- 不要用 `$使用...` 的自然语言方式，直接说明你的需求，AI 会自动选择合适的 Skill

### 问题：运行时报错"找不到 python3"或"找不到 ffmpeg"

**解决**：
- 检查这些工具是否在系统 PATH 中：
  ```bash
  which python3  # 或 where python3（Windows）
  which ffmpeg   # 或 where ffmpeg（Windows）
  ```
- 如果找不到，按上面"依赖检查"表格重新安装

### 问题：Windows 上 PowerShell 报错"不允许执行脚本"

**解决**：
1. 以管理员身份打开 PowerShell
2. 运行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. 输入 `Y` 确认，再运行安装脚本

## 📚 后续

- 安装完成后，到 [README.md](README.md) 查看使用方式和工作原理
- 查看 [examples/three-heroes-vs-lu-bu](examples/three-heroes-vs-lu-bu) 和 [examples/tang-zhenghe-paper-animation](examples/tang-zhenghe-paper-animation) 了解完整示例
- 如有问题，在 [GitHub Issues](https://github.com/Mr-funny/paper-collage-story-video/issues) 提交反馈
