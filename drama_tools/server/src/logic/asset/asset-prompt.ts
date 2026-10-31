import { AssetPromptResult } from '../generate/types';

/** 生图接口支持的比例档位。 */
export const RATIOS = ['16:9', '9:16', '4:3', '3:4', '1:1'] as const;
export type ImageRatio = (typeof RATIOS)[number];

/** 校验外部传入的比例，非法/缺省返回 null（由调用方回落到类型默认值）。 */
export function normalizeRatio(raw?: string | null): ImageRatio | null {
  if (!raw) return null;
  return (RATIOS as readonly string[]).includes(raw) ? (raw as ImageRatio) : null;
}

/**
 * 按资产类型构造文生图 prompt 与参数（UT-BE-03）。
 * - 角色：3:4（立绘更佳）；场景/道具：16:9。size 固定 '1K'。
 * - prompt 结构：[主体] + [风格] + [光照] + [构图] + [质量]。
 */
export function buildAssetPrompt(
  asset: { name: string; desc?: string },
  type: 'character' | 'scene' | 'prop',
  style?: string,
): AssetPromptResult {
  const ratio = type === 'character' ? '3:4' : '16:9';
  const subjectLabel = type === 'character' ? '角色' : type === 'scene' ? '场景' : '道具';
  const parts = [
    `${subjectLabel}：${asset.name}`,
    asset.desc ? `描述：${asset.desc}` : '',
    style ? `风格：${style}` : '',
    type === 'character'
      ? '半身立绘，干净背景，细节清晰，影视级质感'
      : type === 'scene'
        ? '宽幅全景，电影级构图，光照自然，细节丰富'
        : '静物特写，产品级布光，材质清晰，干净背景',
    '高质量，一致的角色/场景设定',
  ].filter(Boolean);
  return { prompt: parts.join('；'), ratio, size: '1K' };
}

/**
 * 四视图（正/侧/背 全身）prompt：详情页右栏的大图。
 * 明确要求白底、无阴影、多角度并排，避免模型自由发挥导致不可用。
 */
export function buildSheetPrompt(
  asset: { name: string; desc?: string },
  type: 'character' | 'scene' | 'prop',
  styleText?: string,
): AssetPromptResult {
  const parts = [
    `角色：${asset.name}`,
    asset.desc ? `设定：${asset.desc}` : '',
    styleText ? `风格：${styleText}` : '',
    '角色设定四视图：左侧正面头像特写，右侧依次为正面全身、侧面全身、背面全身',
    '纯白背景，无环境，无投影，全身立绘并排展示，比例一致',
    type === 'character' ? '服装与配饰在三视图中保持完全一致' : '',
    '高质量，角色一致性，设定稿',
  ].filter(Boolean);
  return { prompt: parts.join('；'), ratio: '16:9', size: '1K' };
}

/**
 * 把用户自定义描述 + 风格提示词拼成最终 prompt。
 * 风格 key 对应的提示词由调用方查库得到（保持纯函数无依赖）。
 */
export function composePrompt(
  base: string,
  customDesc?: string,
  stylePrompt?: string,
): string {
  return [base, customDesc?.trim() || '', stylePrompt?.trim() || '']
    .filter(Boolean)
    .join('；');
}