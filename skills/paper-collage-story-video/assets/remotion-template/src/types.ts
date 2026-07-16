export type StickerConfig = {
  id: string;
  src: string;
  width: number;
  left: number;
  top: number;
  entryFrame: number;
  zIndex: number;
  fromX?: number;
  fromY?: number;
  startScale?: number;
  rotate?: number;
  float?: number;
  flip?: boolean;
  entranceGroup?: string;
};

export type SceneTitleConfig = {
  label: string;
  text: string;
  note: string;
  align?: "left" | "right";
  entryFrame?: number;
};

export type SceneConfig = {
  id: string;
  startFrame: number;
  durationInFrames: number;
  background: string;
  backgroundColor: string;
  title: SceneTitleConfig;
  stickers: StickerConfig[];
};

export type StoryConfig = {
  title: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  scenes: SceneConfig[];
};

export type StoryVideoProps = {
  story: StoryConfig;
};
