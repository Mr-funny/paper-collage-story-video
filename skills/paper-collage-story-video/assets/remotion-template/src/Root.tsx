import type {CalculateMetadataFunction} from "remotion";
import {Composition, staticFile} from "remotion";
import {StoryVideo} from "./StoryVideo";
import type {StoryConfig, StoryVideoProps} from "./types";
import "./index.css";

const fallbackStory: StoryConfig = {
  title: "Paper Collage Story",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 360,
  scenes: [],
};

const calculateMetadata: CalculateMetadataFunction<StoryVideoProps> = async ({
  abortSignal,
}) => {
  const response = await fetch(staticFile("story/story.json"), {signal: abortSignal});
  const story = (await response.json()) as StoryConfig;
  return {
    durationInFrames: story.durationInFrames,
    fps: story.fps,
    width: story.width,
    height: story.height,
    props: {story},
    defaultOutName: "story-silent.mp4",
    defaultCodec: "h264",
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StoryVideo"
      component={StoryVideo}
      durationInFrames={fallbackStory.durationInFrames}
      fps={fallbackStory.fps}
      width={fallbackStory.width}
      height={fallbackStory.height}
      defaultProps={{story: fallbackStory}}
      calculateMetadata={calculateMetadata}
    />
  );
};
