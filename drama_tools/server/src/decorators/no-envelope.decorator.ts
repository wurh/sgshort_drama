import { SetMetadata } from '@nestjs/common';

/** 标记 key：该处理器不走统一 {code,msg,data} 信封（用于 SSE / 流式 / 手动 res 端点）。 */
export const NO_ENVELOPE = 'sgdrama:noEnvelope';

export const NoEnvelope = () => SetMetadata(NO_ENVELOPE, true);
