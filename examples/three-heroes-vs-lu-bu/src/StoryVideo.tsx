import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {StoryCaptions} from "./StoryCaptions";
import type {SceneConfig, SceneTitleConfig, StickerConfig, StoryVideoProps} from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Sticker: React.FC<{sticker: StickerConfig}> = ({sticker}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(
    frame,
    [sticker.entryFrame, sticker.entryFrame + 0.7 * fps],
    [0, 1],
    {...clamp, easing: Easing.bezier(0.18, 0.9, 0.22, 1.1)},
  );
  const fromX = sticker.fromX ?? 0;
  const fromY = sticker.fromY ?? 50;
  const startScale = sticker.startScale ?? 0.9;
  const scale = startScale + progress * (1 - startScale);
  const drift = Math.sin((frame - sticker.entryFrame) / 21) * (sticker.float ?? 3) * progress;
  const rotate = (sticker.rotate ?? 0) + Math.sin((frame - sticker.entryFrame) / 33) * 0.35 * progress;

  return (
    <Img
      src={staticFile(sticker.src)}
      style={{
        position: "absolute",
        width: sticker.width,
        left: sticker.left,
        top: sticker.top,
        zIndex: sticker.zIndex,
        opacity: progress,
        transformOrigin: "50% 92%",
        transform: `translate(${(1 - progress) * fromX}px, ${(1 - progress) * fromY + drift}px) scale(${sticker.flip ? -scale : scale}, ${scale}) rotate(${rotate}deg)`,
        filter: "drop-shadow(0 18px 13px rgba(31,14,7,.38))",
      }}
    />
  );
};

const SceneTitle: React.FC<{title: SceneTitleConfig}> = ({title}) => {
  const frame = useCurrentFrame();
  const start = title.entryFrame ?? 4;
  const labelProgress = interpolate(frame, [start, start + 10], [0, 1], clamp);
  const titleProgress = interpolate(frame, [start + 3, start + 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.18, 0.9, 0.22, 1.1),
  });
  const noteProgress = interpolate(frame, [start + 22, start + 37], [0, 1], clamp);
  const right = title.align === "right";

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 40,
        top: 68,
        left: right ? undefined : 86,
        right: right ? 86 : undefined,
        textAlign: right ? "right" : "left",
        color: "#281610",
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Songti SC', serif",
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: 7,
          color: "#8f251d",
          opacity: labelProgress,
          transform: `scale(${1.08 - labelProgress * 0.08})`,
        }}
      >
        {title.label}
      </div>
      <div
        style={{
          fontFamily: "'STKaiti', 'KaiTi', serif",
          fontSize: 78,
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: 7,
          marginTop: 8,
          opacity: titleProgress,
          transformOrigin: right ? "100% 50%" : "0% 50%",
          transform: `scale(${1.15 - titleProgress * 0.15})`,
          textShadow: "3px 3px 0 rgba(244,228,193,.92)",
        }}
      >
        {title.text}
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 12,
          padding: "7px 12px",
          color: "#6f1f19",
          background: "rgba(240,220,177,.92)",
          border: "2px solid rgba(111,41,28,.5)",
          fontFamily: "'STKaiti', 'KaiTi', serif",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 4,
          opacity: noteProgress,
          transform: `scale(${1.06 - noteProgress * 0.06})`,
          clipPath: "polygon(2% 4%, 99% 0, 100% 88%, 3% 100%, 0 18%)",
        }}
      >
        {title.note}
      </div>
    </div>
  );
};

const StoryScene: React.FC<{scene: SceneConfig}> = ({scene}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1.015, 1.07], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: scene.backgroundColor, opacity: fade}}>
      <Img
        src={staticFile(scene.background)}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}}
      />
      {scene.stickers.map((sticker) => (
        <Sticker key={sticker.id} sticker={sticker} />
      ))}
      <SceneTitle title={scene.title} />
    </AbsoluteFill>
  );
};

const PaperWipes: React.FC<{boundaries: number[]}> = ({boundaries}) => {
  const frame = useCurrentFrame();
  let opacity = 0;
  let local = -100;
  for (const boundary of boundaries) {
    const candidate = interpolate(frame, [boundary - 7, boundary, boundary + 9], [0, 0.95, 0], clamp);
    if (candidate > opacity) {
      opacity = candidate;
      local = frame - (boundary - 7);
    }
  }
  return (
    <AbsoluteFill
      style={{
        zIndex: 80,
        pointerEvents: "none",
        opacity,
        background: "linear-gradient(102deg, transparent 0 38%, rgba(246,229,193,.98) 41% 58%, transparent 61%)",
        transform: `translateX(${interpolate(local, [0, 16], [-820, 830], clamp)}px) rotate(-2deg)`,
      }}
    />
  );
};

export const StoryVideo: React.FC<StoryVideoProps> = ({story}) => {
  return (
    <AbsoluteFill style={{backgroundColor: "#e8d6af"}}>
      {story.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          premountFor={30}
        >
          <StoryScene scene={scene} />
        </Sequence>
      ))}
      <PaperWipes boundaries={story.scenes.slice(1).map((scene) => scene.startFrame)} />
      <StoryCaptions />
      <AbsoluteFill
        style={{
          zIndex: 90,
          pointerEvents: "none",
          boxShadow: "inset 0 0 110px rgba(43,19,8,.3)",
          backgroundImage: "radial-gradient(circle at 25% 15%, rgba(255,255,255,.06) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 80%, rgba(48,20,8,.06) 0 1px, transparent 1.5px)",
          backgroundSize: "9px 9px, 13px 13px",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
