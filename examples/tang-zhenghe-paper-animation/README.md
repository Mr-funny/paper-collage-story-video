# 唐朝 · 郑和下西洋 纸片动画

这个项目是本仓库 Skill 的**前身实验场**：纸片剪贴风格、独立贴纸入场、压印式标题等规则都在这里打磨成型，之后才沉淀为 `paper-collage-story-video` Skill。

一个项目里注册了三个 Remotion 合成：

| 合成 ID | 内容 | 时长 | 素材来源 |
| --- | --- | --- | --- |
| `ZhengHeStory` | 郑和下西洋三幕故事，带六段叙事字幕 | 12 秒 | ImageGen 独立贴纸 |
| `TangPaperImageAnimation` | 盛世长安 + 万邦来朝双镜头 | 10 秒 | ImageGen 抠图人物 |
| `TangPaperAnimation` | 同款唐朝动画的矢量版 | 10 秒 | 手写 SVG |

均为 1920×1080、30fps、无音频。

## 预览

| 郑和 · 第一幕 | 郑和 · 第二幕 | 郑和 · 第三幕 |
| :---: | :---: | :---: |
| ![龙江造船](preview/zhenghe-75.jpg) | ![扬帆远航](preview/zhenghe-195.jpg) | ![万国来朝](preview/zhenghe-315.jpg) |

| 唐朝 · 盛世长安 | 唐朝 · 万邦来朝 |
| :---: | :---: |
| ![盛世长安](preview/preview-image-wide.jpg) | ![万邦来朝](preview/preview-image-close.jpg) |

## 运行

```bash
pnpm install
pnpm dev              # Remotion Studio 预览三个合成
```

## 渲染

```bash
pnpm run render:zhenghe   # 郑和下西洋（推荐先看这个）
pnpm run render:image     # 唐朝动画 · ImageGen 贴纸版
pnpm run render           # 唐朝动画 · SVG 版
```

每个脚本都会先渲染 H.264 MP4，再剥离音轨输出 `out/*-silent.mp4`。

## 素材说明

- `public/assets/zhenghe/`：郑和故事的 3 张场景底图 + 14 张独立贴纸，提示词见 [ZHENGHE_PROMPTS.md](ZHENGHE_PROMPTS.md)。
- `public/assets/imagegen/`：唐朝动画的人物抠图与底图，提示词见 [IMAGEGEN_PROMPTS.md](IMAGEGEN_PROMPTS.md)。
- `public/assets/*.svg`：SVG 版唐朝动画的矢量素材。
- `public/captions/zhenghe.json`：Remotion Caption 格式的郑和故事字幕。

素材工作流与 Skill 一致：每个镜头一张不含人物的场景底图，加一张贴纸素材表；素材表上每张贴纸完整、互不接触，抠图拆分后由 Remotion 依次放回底图。

## 修改

- 调整人物位置、尺寸、延迟：编辑 `src/Composition.tsx` 中的 `PaperLayer` 参数。
- 替换人物或背景：替换 `public/assets/` 下的同名 SVG/PNG。
- 修改标题：搜索 `SceneTitle` 的 `title`、`eyebrow`、`subtitle` 参数。

与 Skill 模板不同，这个项目的动画编排直接写在 `src/Composition.tsx` 和 `src/ZhengHeStory.tsx` 里，适合想看动画实现细节的读者；数据驱动的做法请看 [examples/three-heroes-vs-lu-bu](../three-heroes-vs-lu-bu)。
