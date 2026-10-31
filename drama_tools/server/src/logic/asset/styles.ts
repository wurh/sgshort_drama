/**
 * 风格库静态清单（对应详情页「风格库」弹窗）。
 * category 与前端 Tab 对齐：all / 2d / 3d / real。
 * key 为稳定标识，落库到 asset.variants[].style_key；prompt 为该风格的提示词后缀。
 */
export type StyleCategory = '2d' | '3d' | 'real';

export interface StyleItem {
  key: string;
  label: string;
  category: StyleCategory;
  /** 中文风格名（展示用）。 */
  name: string;
  /** 追加到 prompt 末尾的风格描述。 */
  prompt: string;
  /** 封面占位：用渐变色块，避免依赖外链图。 */
  tint: string;
}

/**
 * 内置风格清单。前 4 个为常用「真人写实」变体，与截图风格库中的分类网格一致。
 * 注：不内置「自定义风格」条目，自定义由前端独立入口处理（V1 仅传自定义 prompt）。
 */
export const STYLE_LIBRARY: StyleItem[] = [
  // ---------- 真人 real ----------
  {
    key: 'real-film',
    label: '港风电影写实风',
    category: 'real',
    name: '港风电影写实风',
    prompt: '港风电影质感，霓虹街景，胶片颗粒，低饱和青橙调，真实光影',
    tint: '#1f3a4d',
  },
  {
    key: 'real-cinema',
    label: '电影感写实人像',
    category: 'real',
    name: '电影感写实人像',
    prompt: '电影级布光，浅景深，皮肤质感真实，写实摄影',
    tint: '#2d2a26',
  },
  {
    key: 'real-city',
    label: '现代都市写实',
    category: 'real',
    name: '现代都市写实',
    prompt: '现代都市写实摄影，自然光，通勤场景，干净构图',
    tint: '#25323b',
  },
  {
    key: 'real-vintage',
    label: '复古胶片人像',
    category: 'real',
    name: '复古胶片人像',
    prompt: '复古胶片色调，柔和颗粒，暖黄高光，年代感',
    tint: '#3a2f24',
  },
  {
    key: 'real-suspense',
    label: '冷调悬疑写实',
    category: 'real',
    name: '冷调悬疑写实',
    prompt: '冷蓝低照度，悬疑氛围，高对比侧光，写实',
    tint: '#1b2630',
  },
  {
    key: 'real-youth',
    label: '青春校园写实',
    category: 'real',
    name: '青春校园写实',
    prompt: '明亮自然光，青春校园，通透肤色，清新写实',
    tint: '#2f3a2a',
  },
  // ---------- 2D ----------
  {
    key: '2d-jp-anime',
    label: '日系动漫风',
    category: '2d',
    name: '日系动漫风',
    prompt: '日系动漫风格，赛璐璐上色，干净线条，明亮色彩',
    tint: '#3b2b4a',
  },
  {
    key: '2d-us-comic',
    label: '美式漫画风',
    category: '2d',
    name: '美式漫画风',
    prompt: '美式漫画风格，粗描边，强对比，网点阴影',
    tint: '#4a2b2b',
  },
  {
    key: '2d-ink',
    label: '国风水墨',
    category: '2d',
    name: '国风水墨',
    prompt: '国风水墨画，留白，墨色晕染，写意笔触',
    tint: '#2b2f33',
  },
  {
    key: '2d-flat',
    label: '扁平插画风',
    category: '2d',
    name: '扁平插画风',
    prompt: '扁平矢量插画，色块分明，无渐变，简洁造型',
    tint: '#2f4238',
  },
  {
    key: '2d-pixel',
    label: '像素复古风',
    category: '2d',
    name: '像素复古风',
    prompt: '像素艺术，16bit 复古游戏风，有限色板',
    tint: '#33304a',
  },
  {
    key: '2d-watercolor',
    label: '水彩绘本风',
    category: '2d',
    name: '水彩绘本风',
    prompt: '水彩绘本风格，柔和晕染，纸张纹理，淡雅配色',
    tint: '#3a3830',
  },
  // ---------- 3D ----------
  {
    key: '3d-blindbox',
    label: '盲盒手办风',
    category: '3d',
    name: '盲盒手办风',
    prompt: '3D 盲盒手办风格，光滑材质，圆润造型，柔和棚拍光',
    tint: '#3d3d3d',
  },
  {
    key: '3d-clay',
    label: '黏土定格风',
    category: '3d',
    name: '黏土定格风',
    prompt: '黏土定格动画风格，手捏质感，微缩场景，暖光',
    tint: '#453a2c',
  },
  {
    key: '3d-c4d',
    label: 'C4D 质感',
    category: '3d',
    name: 'C4D 质感',
    prompt: 'C4D 三维渲染，柔顺曲面，全局光照，干净背景',
    tint: '#2c3a44',
  },
  {
    key: '3d-anime',
    label: '3D 动漫风',
    category: '3d',
    name: '3D 动漫风',
    prompt: '3D 卡通渲染，赛璐璐描边，动漫比例，明亮色彩',
    tint: '#372b45',
  },
  {
    key: '3d-low-poly',
    label: '低多边形',
    category: '3d',
    name: '低多边形',
    prompt: '低多边形 3D 造型，硬边折面，纯色材质',
    tint: '#2b3b36',
  },
  {
    key: '3d-steampunk',
    label: '蒸汽朋克',
    category: '3d',
    name: '蒸汽朋克',
    prompt: '蒸汽朋克 3D，黄铜齿轮，做旧金属，暖褐调',
    tint: '#3d3225',
  },
];

export function listStyles(category?: string): StyleItem[] {
  if (!category || category === 'all') return STYLE_LIBRARY;
  return STYLE_LIBRARY.filter((s) => s.category === category);
}

export function findStyle(key?: string | null): StyleItem | undefined {
  if (!key) return undefined;
  return STYLE_LIBRARY.find((s) => s.key === key);
}