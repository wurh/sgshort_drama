/** 大纲/分镜/资产等领域纯函数共享类型。 */

export interface OutlineEpisode {
  title: string;
  summary: string;
  seconds: number;
  characters: string[];
  scenes: string[];
}
export interface OutlineCharacter {
  name: string;
  desc: string;
  tags?: string[];
}
export interface OutlineName {
  name: string;
  desc: string;
}
export interface OutlineResult {
  episodes: OutlineEpisode[];
  characters: OutlineCharacter[];
  scenes: OutlineName[];
  props: OutlineName[];
}

/** 单条分镜脚本（keyframe 行）。 */
export interface KeyframeScript {
  seq: number;
  shot_type: string;
  camera: string;
  seconds: number;
  visual_desc: string;
  dialogue: string;
  characters: string[];
  scenes: string[];
  props: string[];
}

export interface AssetPromptResult {
  prompt: string;
  ratio: string;
  size: string;
}

export interface ImageParams {
  model: string;
  size: string;
  ratio?: string;
  extra_body: {
    /** 参考图；文生图（无参考图）时必须省略该字段，传空数组会被 API 拒绝。 */
    image?: string[];
    response_format: string;
  };
}

export interface VideoParams {
  model: string;
  mode: string;
  size: string;
  first_frame?: string;
  last_frame?: string;
  seconds: string;
  images?: string[];
  audios?: string[];
}
