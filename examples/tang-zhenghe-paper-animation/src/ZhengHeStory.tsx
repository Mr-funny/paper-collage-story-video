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
import {ZhengHeCaptions} from "./ZhengHeCaptions";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type StickerProps = {
  src: string;
  width: number;
  left: number;
  top: number;
  delay: number;
  fromX?: number;
  fromY?: number;
  startScale?: number;
  zIndex: number;
  rotate?: number;
  float?: number;
  flip?: boolean;
};

const Sticker: React.FC<StickerProps> = ({
  src,
  width,
  left,
  top,
  delay,
  fromX = 0,
  fromY = 50,
  startScale = 0.9,
  zIndex,
  rotate = 0,
  float = 3,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(frame, [delay, delay + 0.7 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.18, 0.9, 0.22, 1.1),
  });
  const drift = Math.sin((frame - delay) / 21) * float * enter;

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width,
        left,
        top,
        zIndex,
        opacity: enter,
        transformOrigin: "50% 92%",
        transform: `translate(${(1 - enter) * fromX}px, ${
          (1 - enter) * fromY + drift
        }px) scale(${(flip ? -1 : 1) * (startScale + enter * (1 - startScale))}, ${
          startScale + enter * (1 - startScale)
        }) rotate(${rotate + Math.sin((frame - delay) / 33) * 0.35 * enter}deg)`,
        filter: "drop-shadow(0 18px 13px rgba(31,14,7,.38))",
      }}
    />
  );
};

const StoryTitle: React.FC<{
  label: string;
  title: string;
  note: string;
  start: number;
  align?: "left" | "right";
}> = ({label, title, note, start, align = "left"}) => {
  const frame = useCurrentFrame();
  const labelP = interpolate(frame, [start, start + 10], [0, 1], clamp);
  const titleP = interpolate(frame, [start + 3, start + 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const noteP = interpolate(frame, [start + 23, start + 38], [0, 1], clamp);
  const isRight = align === "right";

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 40,
        top: 68,
        left: isRight ? undefined : 86,
        right: isRight ? 86 : undefined,
        textAlign: align,
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
          opacity: labelP,
          transform: `translateY(${(1 - labelP) * -8}px)`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'STKaiti', 'KaiTi', serif",
          fontSize: 78,
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: 7,
          marginTop: 8,
          opacity: titleP,
          transformOrigin: isRight ? "100% 50%" : "0% 50%",
          transform: `translateY(${(1 - titleP) * -20}px) scale(${
            1.14 - titleP * 0.14
          })`,
          textShadow: "3px 3px 0 rgba(244,228,193,.92)",
        }}
      >
        {title}
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
          opacity: noteP,
          transform: `translateY(${(1 - noteP) * -10}px)`,
          clipPath: "polygon(2% 4%, 99% 0, 100% 88%, 3% 100%, 0 18%)",
        }}
      >
        {note}
      </div>
    </div>
  );
};

const SceneFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const NanjingDeparture: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 130], [1.02, 1.075], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#a83824"}}>
      <Img
        src={staticFile("assets/zhenghe/01-nanjing-bg.png")}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}}
      />
      <Sticker
        src="assets/zhenghe/01-treasure-ship.png"
        width={1030}
        left={600}
        top={465}
        delay={73}
        fromX={180}
        fromY={35}
        startScale={0.93}
        zIndex={5}
        float={4}
      />
      <Sticker
        src="assets/zhenghe/01-zhenghe.png"
        width={330}
        left={125}
        top={352}
        delay={18}
        fromX={-70}
        zIndex={9}
      />
      <Sticker
        src="assets/zhenghe/01-sailor-rope.png"
        width={235}
        left={470}
        top={475}
        delay={47}
        fromX={-65}
        zIndex={8}
      />
      <Sticker
        src="assets/zhenghe/01-sailor-flag.png"
        width={260}
        left={1540}
        top={448}
        delay={47}
        fromX={65}
        zIndex={8}
      />
      <StoryTitle label="永 乐 三 年 · 南 京" title="奉诏启航" note="一纸诏书 · 万里云帆" start={4} />
    </AbsoluteFill>
  );
};

const OceanVoyage: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 130], [1.015, 1.07], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#183d45"}}>
      <Img
        src={staticFile("assets/zhenghe/02-ocean-bg.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateY(${interpolate(frame, [0, 130], [0, -10], clamp)}px)`,
        }}
      />
      <Sticker
        src="assets/zhenghe/02-main-ship.png"
        width={880}
        left={520}
        top={375}
        delay={18}
        fromY={70}
        startScale={0.88}
        zIndex={7}
        float={7}
      />
      <Sticker
        src="assets/zhenghe/02-escort-left.png"
        width={430}
        left={55}
        top={565}
        delay={52}
        fromX={-90}
        startScale={0.94}
        zIndex={6}
        float={6}
      />
      <Sticker
        src="assets/zhenghe/02-escort-right.png"
        width={430}
        left={1425}
        top={570}
        delay={52}
        fromX={90}
        startScale={0.94}
        zIndex={6}
        float={6}
      />
      <Sticker
        src="assets/zhenghe/02-compass.png"
        width={245}
        left={1540}
        top={160}
        delay={84}
        fromY={-45}
        startScale={0.82}
        rotate={-7}
        zIndex={12}
        float={2}
      />
      <StoryTitle label="浩 瀚 印 度 洋" title="七下西洋" note="乘季风 · 越万里" start={4} />
    </AbsoluteFill>
  );
};

const ForeignExchange: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 120], [1.015, 1.065], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#d69a54"}}>
      <Img
        src={staticFile("assets/zhenghe/03-port-bg.png")}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}}
      />
      <Sticker
        src="assets/zhenghe/03-zhenghe.png"
        width={310}
        left={135}
        top={305}
        delay={18}
        fromX={-70}
        zIndex={9}
      />
      <Sticker
        src="assets/zhenghe/03-envoy-gift.png"
        width={305}
        left={670}
        top={325}
        delay={48}
        fromY={58}
        zIndex={8}
      />
      <Sticker
        src="assets/zhenghe/03-envoy-welcome.png"
        width={305}
        left={1010}
        top={330}
        delay={48}
        fromY={58}
        zIndex={8}
      />
      <Sticker
        src="assets/zhenghe/03-giraffe.png"
        width={310}
        left={1470}
        top={255}
        delay={78}
        fromX={95}
        startScale={0.9}
        zIndex={7}
        float={2}
      />
      <StoryTitle
        label="万 里 交 好"
        title="海上丝路"
        note="以礼相交 · 与世界相见"
        start={4}
        align="right"
      />
    </AbsoluteFill>
  );
};

const PaperWipes: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe1 = interpolate(frame, [113, 120, 129], [0, 0.95, 0], clamp);
  const wipe2 = interpolate(frame, [233, 240, 249], [0, 0.95, 0], clamp);
  const opacity = Math.max(wipe1, wipe2);
  const local = frame < 180 ? frame - 113 : frame - 233;
  return (
    <AbsoluteFill
      style={{
        zIndex: 80,
        pointerEvents: "none",
        opacity,
        background:
          "linear-gradient(102deg, transparent 0 38%, rgba(246,229,193,.98) 41% 58%, transparent 61%)",
        transform: `translateX(${interpolate(local, [0, 17], [-820, 830], clamp)}px) rotate(-2deg)`,
      }}
    />
  );
};

export const ZhengHeStory: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#e8d6af"}}>
      <Sequence durationInFrames={130} premountFor={30}>
        <NanjingDeparture />
      </Sequence>
      <Sequence from={120} durationInFrames={130} premountFor={30}>
        <SceneFade>
          <OceanVoyage />
        </SceneFade>
      </Sequence>
      <Sequence from={240} durationInFrames={120} premountFor={30}>
        <SceneFade>
          <ForeignExchange />
        </SceneFade>
      </Sequence>
      <PaperWipes />
      <ZhengHeCaptions />
      <AbsoluteFill
        style={{
          zIndex: 90,
          pointerEvents: "none",
          boxShadow: "inset 0 0 110px rgba(43,19,8,.3)",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,.06) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 80%, rgba(48,20,8,.06) 0 1px, transparent 1.5px)",
          backgroundSize: "9px 9px, 13px 13px",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
