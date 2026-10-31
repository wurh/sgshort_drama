/** 统一业务错误码（客户端只看到 {code,msg,data}，不泄堆栈）。 */
export class BizError extends Error {
  constructor(
    public readonly code: number,
    msg: string,
    public readonly httpStatus = 400,
  ) {
    super(msg);
    this.name = 'BizError';
  }
}

export const ERR = {
  CONTENT_BLOCKED: new BizError(40901, '内容合规拦截', 409),
  ASSET_REF_PROTECTED: new BizError(40910, '资产被镜头引用，不可硬删', 409),
  MODEL_UNAVAILABLE: new BizError(50001, '模型服务不可用', 500),
  /** 未配置 API Key：这是部署配置问题，不是用户输入问题，必须明确告知。 */
  MODEL_NOT_CONFIGURED: new BizError(
    50002,
    '模型服务未配置：缺少 AGNES_API_KEY，请在 server/.env 中填写后重启服务',
    503,
  ),
  /** 模型调用失败（限流/超时/上游 5xx），可重试，不应静默降级。 */
  MODEL_CALL_FAILED: new BizError(50004, '模型调用失败，请稍后重试', 502),
  /** 模型调用成功但产出不合规（JSON 解析失败等），可提示用户简化创意。 */
  MODEL_BAD_OUTPUT: new BizError(50003, '模型输出解析失败，请简化创意后重试', 502),
  FFMPEG_FAILED: new BizError(50010, 'ffmpeg 拼接失败', 500),
} as const;