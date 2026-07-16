import type {Caption} from "@remotion/captions";
import {useCallback, useEffect, useState} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const ZhengHeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender("Loading Zheng He captions"));

  const loadCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("captions/zhenghe.json"));
      const data = (await response.json()) as Caption[];
      setCaptions(data);
      continueRender(handle);
    } catch (error) {
      cancelRender(error);
    }
  }, [cancelRender, continueRender, handle]);

  useEffect(() => {
    loadCaptions();
  }, [loadCaptions]);

  if (!captions) {
    return null;
  }

  const currentMs = (frame / fps) * 1000;
  const active = captions.find(
    (caption) => currentMs >= caption.startMs && currentMs < caption.endMs,
  );

  if (!active) {
    return null;
  }

  const enter = interpolate(
    currentMs,
    [active.startMs, active.startMs + 180],
    [0, 1],
    {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)},
  );
  const exit = interpolate(
    currentMs,
    [active.endMs - 180, active.endMs],
    [1, 0],
    {...clamp, easing: Easing.in(Easing.cubic)},
  );
  const progress = Math.min(enter, exit);

  return (
    <AbsoluteFill
      style={{
        zIndex: 100,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 48,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1540,
          minWidth: 980,
          padding: "19px 54px 18px",
          background: "rgba(242,224,185,.96)",
          border: "3px solid rgba(95,36,24,.72)",
          color: "#2c1a13",
          fontFamily: "'STKaiti', 'KaiTi', 'Songti SC', serif",
          fontSize: 38,
          lineHeight: 1.36,
          fontWeight: 700,
          letterSpacing: 3,
          textAlign: "center",
          clipPath:
            "polygon(1% 8%, 99% 0, 100% 88%, 98% 100%, 2% 94%, 0 18%)",
          boxShadow: "0 14px 22px rgba(35,16,8,.3)",
          opacity: progress,
          transform: `translateY(${(1 - progress) * 22}px) scale(${
            1.04 - progress * 0.04
          })`,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 22,
            top: 15,
            color: "#9d2b20",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          史事
        </span>
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
