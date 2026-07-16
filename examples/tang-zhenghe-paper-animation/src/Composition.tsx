import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {ZhengHeStory} from "./ZhengHeStory";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type PaperLayerProps = {
  src: string;
  width: number;
  left: number;
  top: number;
  delay: number;
  enterFromX?: number;
  enterFromY?: number;
  startScale?: number;
  rotate?: number;
  zIndex: number;
  float?: number;
  flip?: boolean;
  shadow?: boolean;
  softShadow?: boolean;
  clipPath?: string;
};

const PaperLayer: React.FC<PaperLayerProps> = ({
  src,
  width,
  left,
  top,
  delay,
  enterFromX = 0,
  enterFromY = 55,
  startScale = 0.88,
  rotate = 0,
  zIndex,
  float = 5,
  flip = false,
  shadow = true,
  softShadow = false,
  clipPath,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(frame, [delay, delay + 0.72 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.18, 0.9, 0.22, 1.12),
  });
  const settle = Math.sin((frame - delay) / 19) * float * enter;
  const rotateFloat = Math.sin((frame - delay) / 31) * 0.45 * enter;

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
        transform: `translate(${(1 - enter) * enterFromX}px, ${
          (1 - enter) * enterFromY + settle
        }px) scale(${(flip ? -1 : 1) * (startScale + enter * (1 - startScale))}, ${
          startScale + enter * (1 - startScale)
        }) rotate(${rotate + rotateFloat}deg)`,
        filter: shadow
          ? softShadow
            ? "drop-shadow(0 20px 14px rgba(31,14,7,.38))"
            : "drop-shadow(4px 0 #f4ead1) drop-shadow(-4px 0 #f4ead1) drop-shadow(0 4px #f4ead1) drop-shadow(0 19px 12px rgba(31,14,7,.34))"
          : undefined,
        clipPath,
      }}
    />
  );
};

const PaperDust: React.FC<{seed: number; color: string; size: number; top: number}> = ({
  seed,
  color,
  size,
  top,
}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const x = ((frame * (0.55 + seed * 0.08) + seed * 247) % (width + 240)) - 120;
  const y = top + Math.sin(frame / (23 + seed)) * 12;
  const rotation = frame * (0.22 + seed * 0.03);
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size * 0.42,
        background: color,
        left: x,
        top: y,
        opacity: 0.55,
        transform: `rotate(${rotation}deg)`,
        clipPath: "polygon(4% 12%, 96% 0, 88% 92%, 0 75%)",
        boxShadow: "0 5px 10px rgba(30,10,0,.18)",
      }}
    />
  );
};

const SceneTitle: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  start: number;
  align?: "left" | "right";
  subtitleDelay?: number;
}> = ({eyebrow, title, subtitle, start, align = "left", subtitleDelay = 24}) => {
  const frame = useCurrentFrame();
  const eyebrowP = interpolate(frame, [start, start + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const titleP = interpolate(frame, [start + 3, start + 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const subtitleP = interpolate(
    frame,
    [start + subtitleDelay, start + subtitleDelay + 16],
    [0, 1],
    {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const inkPress = interpolate(
    frame,
    [start + 3, start + 9, start + 20],
    [0, 1, 0],
    clamp,
  );
  const isRight = align === "right";
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 30,
        top: 88,
        left: isRight ? undefined : 112,
        right: isRight ? 112 : undefined,
        textAlign: align,
        color: "#26150d",
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Songti SC', serif",
          fontSize: 21,
          letterSpacing: 8,
          color: "#7f1d19",
          fontWeight: 700,
          marginBottom: 10,
          opacity: eyebrowP,
          transform: `translateY(${(1 - eyebrowP) * -10}px)`,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "inline-block",
          fontFamily: "'STKaiti', 'KaiTi', serif",
          fontSize: 88,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: 8,
          opacity: titleP,
          transformOrigin: isRight ? "100% 50%" : "0% 50%",
          transform: `translateY(${(1 - titleP) * -24}px) scale(${1.16 - titleP * 0.16})`,
          textShadow: `${3 + inkPress * 5}px ${3 + inkPress * 4}px ${inkPress * 3}px rgba(245,232,204,.92), 0 ${inkPress * 5}px ${inkPress * 12}px rgba(62,20,12,.35)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: "Georgia, 'Songti SC', serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 5,
          color: "#6f1f19",
          background: "rgba(239,220,178,.94)",
          border: "2px solid rgba(111,41,28,.55)",
          padding: "9px 14px 8px",
          clipPath: "polygon(2% 5%, 98% 0, 100% 88%, 3% 100%, 0 18%)",
          boxShadow: `0 ${6 + (1 - subtitleP) * 8}px ${10 + (1 - subtitleP) * 8}px rgba(51,20,10,.28)`,
          opacity: subtitleP,
          transform: `translateY(${(1 - subtitleP) * -14}px) scale(${1.05 - subtitleP * 0.05})`,
          transformOrigin: isRight ? "100% 50%" : "0% 50%",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const Seal: React.FC<{left: number; top: number; text: string; delay: number}> = ({
  left,
  top,
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 29,
        left,
        top,
        width: 82,
        height: 82,
        border: "7px double #a92820",
        color: "#a92820",
        fontFamily: "'STKaiti', serif",
        fontSize: 25,
        fontWeight: 800,
        lineHeight: "33px",
        textAlign: "center",
        padding: 3,
        opacity: p * 0.86,
        transform: `scale(${p}) rotate(-8deg)`,
        boxSizing: "border-box",
        mixBlendMode: "multiply",
      }}
    >
      {text}
    </div>
  );
};

const SceneFadeIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const WideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 160], [1.02, 1.075], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#c43b25"}}>
      <Img
        src={staticFile("assets/wide-bg.svg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateX(${interpolate(frame, [0, 160], [0, -12])}px)`,
        }}
      />
      <PaperLayer
        src="assets/officials.svg"
        width={500}
        left={1320}
        top={560}
        delay={34}
        enterFromX={95}
        enterFromY={35}
        startScale={0.94}
        zIndex={3}
        float={2.5}
      />
      <PaperLayer
        src="assets/attendant.svg"
        width={265}
        left={390}
        top={495}
        delay={21}
        enterFromX={-80}
        enterFromY={42}
        startScale={0.9}
        rotate={-2}
        zIndex={6}
      />
      <PaperLayer
        src="assets/attendant.svg"
        width={245}
        left={1255}
        top={525}
        delay={27}
        enterFromX={76}
        enterFromY={42}
        startScale={0.91}
        rotate={2}
        zIndex={6}
        flip
      />
      <PaperLayer
        src="assets/emperor.svg"
        width={600}
        left={680}
        top={315}
        delay={6}
        enterFromY={82}
        startScale={0.84}
        zIndex={7}
        float={3.5}
      />
      <Img
        src={staticFile("assets/cloud-front.svg")}
        style={{
          position: "absolute",
          zIndex: 12,
          width: 2150,
          left: -110,
          bottom: -112 + Math.sin(frame / 25) * 7,
          filter: "drop-shadow(0 -8px 12px rgba(44,19,9,.18))",
        }}
      />
      <SceneTitle eyebrow="大 唐 · 长 安" title="盛世长安" subtitle="宫阙巍峨 · 四海宾服" start={12} />
      <Seal left={532} top={270} text="长安" delay={43} />
      <PaperDust seed={1} color="#e3b04b" size={55} top={178} />
      <PaperDust seed={2} color="#f1d69c" size={34} top={340} />
      <PaperDust seed={5} color="#8f2820" size={47} top={238} />
    </AbsoluteFill>
  );
};

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 155], [1.025, 1.09], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#8d1f1b"}}>
      <Img
        src={staticFile("assets/close-bg.svg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateY(${interpolate(frame, [0, 155], [0, -12])}px)`,
        }}
      />
      <PaperLayer
        src="assets/officials.svg"
        width={430}
        left={180}
        top={535}
        delay={29}
        enterFromX={-80}
        enterFromY={28}
        startScale={0.94}
        zIndex={3}
        float={2}
      />
      <PaperLayer
        src="assets/officials.svg"
        width={410}
        left={1335}
        top={555}
        delay={36}
        enterFromX={80}
        enterFromY={28}
        startScale={0.95}
        zIndex={3}
        float={2}
        flip
      />
      <PaperLayer
        src="assets/envoy.svg"
        width={570}
        left={690}
        top={275}
        delay={4}
        enterFromY={90}
        startScale={0.83}
        zIndex={8}
        float={3}
      />
      <PaperLayer
        src="assets/kneeling.svg"
        width={640}
        left={95}
        top={690}
        delay={19}
        enterFromX={-90}
        enterFromY={48}
        startScale={0.9}
        zIndex={10}
        float={2.5}
      />
      <PaperLayer
        src="assets/kneeling.svg"
        width={610}
        left={1230}
        top={708}
        delay={24}
        enterFromX={90}
        enterFromY={48}
        startScale={0.9}
        zIndex={10}
        float={2.5}
        flip
      />
      <Img
        src={staticFile("assets/cloud-front.svg")}
        style={{
          position: "absolute",
          zIndex: 14,
          width: 2200,
          left: -150,
          bottom: -145 + Math.sin(frame / 28) * 6,
          opacity: 0.88,
        }}
      />
      <SceneTitle eyebrow="贞 观 · 朝 会" title="万邦来朝" subtitle="丝路相逢 · 百川归海" start={10} align="right" />
      <Seal left={1375} top={280} text="万邦" delay={48} />
      <PaperDust seed={3} color="#e6b95d" size={48} top={188} />
      <PaperDust seed={4} color="#f0dcc0" size={34} top={385} />
      <PaperDust seed={6} color="#711d19" size={52} top={282} />
    </AbsoluteFill>
  );
};

const ImageWideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 160], [1.015, 1.065], clamp);

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#9b271d"}}>
      <Img
        src={staticFile("assets/imagegen/wide-bg.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateY(${interpolate(frame, [0, 160], [0, -8])}px)`,
        }}
      />
      <PaperLayer
        src="assets/imagegen/officials-cutout.png"
        width={455}
        left={1345}
        top={526}
        delay={84}
        enterFromX={92}
        enterFromY={32}
        startScale={0.94}
        zIndex={3}
        float={2}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/attendant-left.png"
        width={285}
        left={340}
        top={410}
        delay={50}
        enterFromX={-82}
        enterFromY={45}
        startScale={0.9}
        rotate={-1.5}
        zIndex={6}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/attendant-right.png"
        width={278}
        left={1285}
        top={425}
        delay={50}
        enterFromX={82}
        enterFromY={45}
        startScale={0.9}
        rotate={1.5}
        zIndex={6}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/emperor-cutout.png"
        width={620}
        left={650}
        top={248}
        delay={24}
        enterFromY={88}
        startScale={0.83}
        zIndex={8}
        float={3}
        softShadow
      />
      <div
        style={{
          position: "absolute",
          zIndex: 15,
          left: -50,
          right: -50,
          bottom: -74,
          height: 158,
          background: "#ead8ae",
          clipPath:
            "polygon(0 43%, 5% 31%, 11% 45%, 17% 25%, 23% 42%, 30% 21%, 38% 40%, 45% 18%, 53% 39%, 61% 22%, 68% 42%, 76% 26%, 84% 43%, 92% 25%, 100% 41%, 100% 100%, 0 100%)",
          boxShadow: "0 -12px 20px rgba(40,18,8,.16)",
          opacity: 0.88,
        }}
      />
      <SceneTitle
        eyebrow="大 唐 · 长 安"
        title="盛世长安"
        subtitle="宫阙巍峨 · 四海宾服"
        start={6}
        subtitleDelay={108}
      />
      <Seal left={535} top={273} text="长安" delay={122} />
      <PaperDust seed={1} color="#e4b34e" size={50} top={165} />
      <PaperDust seed={2} color="#efe0bd" size={32} top={338} />
    </AbsoluteFill>
  );
};

const ImageCloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 155], [1.015, 1.07], clamp);

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#6f1a17"}}>
      <Img
        src={staticFile("assets/imagegen/close-bg.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateY(${interpolate(frame, [0, 155], [0, -10])}px)`,
        }}
      />
      <PaperLayer
        src="assets/imagegen/officials-cutout.png"
        width={380}
        left={125}
        top={500}
        delay={60}
        enterFromX={-80}
        enterFromY={30}
        startScale={0.95}
        zIndex={3}
        float={1.8}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/officials-cutout.png"
        width={365}
        left={1425}
        top={515}
        delay={60}
        enterFromX={80}
        enterFromY={30}
        startScale={0.95}
        zIndex={3}
        float={1.8}
        flip
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/envoy-cutout.png"
        width={390}
        left={765}
        top={160}
        delay={26}
        enterFromY={88}
        startScale={0.84}
        zIndex={8}
        float={2.5}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/kneeling-left-v2.png"
        width={350}
        left={335}
        top={590}
        delay={92}
        enterFromY={55}
        startScale={0.9}
        zIndex={10}
        float={2}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/kneeling-center-v2.png"
        width={325}
        left={798}
        top={625}
        delay={112}
        enterFromY={55}
        startScale={0.9}
        zIndex={11}
        float={2}
        softShadow
      />
      <PaperLayer
        src="assets/imagegen/kneeling-right-v2.png"
        width={370}
        left={1210}
        top={586}
        delay={92}
        enterFromY={55}
        startScale={0.9}
        zIndex={10}
        float={2}
        softShadow
      />
      <div
        style={{
          position: "absolute",
          zIndex: 14,
          left: -60,
          right: -60,
          bottom: -90,
          height: 168,
          background: "#e5c993",
          clipPath:
            "polygon(0 38%, 6% 25%, 13% 43%, 20% 23%, 28% 42%, 36% 20%, 44% 39%, 52% 18%, 61% 42%, 69% 24%, 77% 43%, 85% 22%, 93% 41%, 100% 28%, 100% 100%, 0 100%)",
          opacity: 0.82,
        }}
      />
      <SceneTitle
        eyebrow="贞 观 · 朝 会"
        title="万邦来朝"
        subtitle="丝路相逢 · 百川归海"
        start={5}
        align="right"
        subtitleDelay={126}
      />
      <Seal left={1375} top={280} text="万邦" delay={136} />
      <PaperDust seed={3} color="#e6b95d" size={46} top={175} />
      <PaperDust seed={4} color="#f0dcc0" size={32} top={375} />
    </AbsoluteFill>
  );
};

export const TangPaperAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const firstOpacity = interpolate(frame, [139, 158], [1, 0], clamp);
  const paperFlash = interpolate(frame, [143, 150, 158], [0, 0.92, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: "#e9d7b5"}}>
      <AbsoluteFill style={{opacity: firstOpacity}}>
        <WideScene />
      </AbsoluteFill>
      <Sequence from={140} durationInFrames={160} premountFor={30}>
        <SceneFadeIn>
          <CloseScene />
        </SceneFadeIn>
      </Sequence>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: paperFlash,
          background:
            "linear-gradient(104deg, transparent 0 42%, rgba(247,232,201,.94) 44% 55%, transparent 58%)",
          zIndex: 50,
          transform: `translateX(${interpolate(frame, [140, 160], [-800, 820], clamp)}px) rotate(-3deg)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 60,
          boxShadow: "inset 0 0 125px rgba(37,14,7,.42)",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,.09) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 80%, rgba(48,20,8,.08) 0 1px, transparent 1.5px)",
          backgroundSize: "9px 9px, 13px 13px",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};

export const TangPaperImageAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const firstOpacity = interpolate(frame, [139, 158], [1, 0], clamp);
  const paperFlash = interpolate(frame, [143, 150, 158], [0, 0.9, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: "#e9d7b5"}}>
      <AbsoluteFill style={{opacity: firstOpacity}}>
        <ImageWideScene />
      </AbsoluteFill>
      <Sequence from={140} durationInFrames={160} premountFor={30}>
        <SceneFadeIn>
          <ImageCloseScene />
        </SceneFadeIn>
      </Sequence>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: paperFlash,
          background:
            "linear-gradient(104deg, transparent 0 42%, rgba(247,232,201,.94) 44% 55%, transparent 58%)",
          zIndex: 50,
          transform: `translateX(${interpolate(frame, [140, 160], [-800, 820], clamp)}px) rotate(-3deg)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 60,
          boxShadow: "inset 0 0 105px rgba(37,14,7,.34)",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,.07) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 80%, rgba(48,20,8,.06) 0 1px, transparent 1.5px)",
          backgroundSize: "9px 9px, 13px 13px",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    <Composition
      id="ZhengHeStory"
      component={ZhengHeStory}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="TangPaperImageAnimation"
      component={TangPaperImageAnimation}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="TangPaperAnimation"
      component={TangPaperAnimation}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
