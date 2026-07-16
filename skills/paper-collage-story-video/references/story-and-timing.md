# Story, schema, and timing

## Story design

Use a three-act miniature documentary structure:

1. **Set-up:** identify the time, place, protagonist, and objective.
2. **Journey or action:** show the central difficulty, process, or achievement.
3. **Meaning:** show the outcome and explain why the event matters.

Write two captions per scene. The first introduces the scene's action; the second adds consequence or meaning. Keep each Chinese caption near 20–34 characters when possible. Use concrete verbs and facts.

## Default 12-second timeline

| Scene | Frames | Captions | Suggested entrances |
|---|---:|---:|---|
| Scene 1 | 0–129 | 0.25–1.90s, 1.90–3.90s | protagonist 18, pair 47, main object 73 |
| Scene 2 | 120–249 | 4.00–6.10s, 6.10–7.90s | main object 18, symmetrical pair 52, emblem 84 |
| Scene 3 | 240–359 | 8.00–10.10s, 10.10–12.00s | protagonist 18, symmetrical pair 48, result 78 |

Scenes overlap by ten frames for a paper-wipe transition. Sticker entry frames are local to their scene.

## `story.json`

```json
{
  "title": "郑和下西洋",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "durationInFrames": 360,
  "scenes": [
    {
      "id": "departure",
      "startFrame": 0,
      "durationInFrames": 130,
      "background": "assets/story/01-background.png",
      "backgroundColor": "#a83824",
      "title": {
        "label": "永 乐 三 年 · 南 京",
        "text": "奉诏启航",
        "note": "一纸诏书 · 万里云帆",
        "align": "left",
        "entryFrame": 4
      },
      "stickers": [
        {
          "id": "zheng-he",
          "src": "assets/story/01-zheng-he.png",
          "width": 330,
          "left": 125,
          "top": 352,
          "entryFrame": 18,
          "fromX": -70,
          "fromY": 50,
          "zIndex": 9
        },
        {
          "id": "sailor-left",
          "src": "assets/story/01-sailor-left.png",
          "width": 235,
          "left": 470,
          "top": 475,
          "entryFrame": 47,
          "entranceGroup": "sailor-pair",
          "zIndex": 8
        },
        {
          "id": "sailor-right",
          "src": "assets/story/01-sailor-right.png",
          "width": 260,
          "left": 1540,
          "top": 448,
          "entryFrame": 47,
          "entranceGroup": "sailor-pair",
          "zIndex": 8
        }
      ]
    }
  ]
}
```

Optional sticker fields are `startScale`, `rotate`, `float`, `flip`, and `entranceGroup`. Positions are pixels in the 1920×1080 composition.

## `captions.json`

Use the Remotion `Caption` shape exactly:

```json
[
  {
    "text": "公元1405年，郑和奉命率领宝船启航。",
    "startMs": 250,
    "endMs": 1900,
    "timestampMs": null,
    "confidence": null
  }
]
```

Do not overlap captions. Keep scene-boundary gaps under 250 ms. End the final caption exactly at or just before the composition duration.

## Visual pacing test

At each sticker entrance, ask: “Which words in the active caption does this object explain?” If there is no clear answer, remove the sticker or move its entrance. Use simultaneous entrances only when the two objects read as one symmetrical idea.
