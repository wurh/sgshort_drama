import { ImageParams } from './types';

/**
 * 构造 Agnes 生图参数（UT-BE-04）。
 * - response_format 必在 extra_body 内（勿放顶层），参考图放 extra_body.image 数组。
 * - 角色 3:4、场景/道具 16:9（由调用方传入 ratio）。
 * - 无参考图时**省略** extra_body.image：接口对空数组返回 400
 *   `extra_body.image must not be empty`，会直接打断文生图。
 * - size 支持 1K / 2K / 4K（设计稿「输出设置」下拉），非法值回落 1K。
 */
export const IMAGE_SIZES = ['1K', '2K', '4K'] as const;
export const DEFAULT_IMAGE_SIZE = '1K';

/** 归一化分辨率档位：'2k' / '2K' / ' 2k ' 都折算成 '2K'，其它回落 1K。 */
export function normalizeImageSize(raw?: string | null): string {
  if (!raw) return DEFAULT_IMAGE_SIZE;
  const up = String(raw).trim().toUpperCase();
  return (IMAGE_SIZES as readonly string[]).includes(up) ? up : DEFAULT_IMAGE_SIZE;
}

export function buildImageParams(
  refs: string[],
  opts: { ratio?: string; size?: string } = {},
): ImageParams {
  const image = (refs || []).filter((u) => typeof u === 'string' && u.length > 0);
  return {
    model: 'agnes-image-2.5-flash',
    size: normalizeImageSize(opts.size),
    ...(opts.ratio ? { ratio: opts.ratio } : {}),
    extra_body: {
      ...(image.length ? { image } : {}),
      response_format: 'url',
    },
  };
}