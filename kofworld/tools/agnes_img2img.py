"""
Agnes-Image-2.5-Flash 图生图 · 角色拟人化出图脚本（KOF《格斗家世界》）

用途：拿"官方参照图 + 拟人化 prompt"走 Agnes 引擎，出"照片级真人"角色锁脸基准图。
- 全免费（1K/2K/3K/4K 输出 + 前 3 张输入参考图均 $0）
- 支持图生图（extra_body.image 传 base64 或 URL）
- 返回图片并下载到 05_资产库/AI生成图/agnes/

用法：
    python agnes_img2img.py <角色key> [size]
    角色key ∈ {nikido, kyo_black, daimon, orochi}
    size 默认 2K（1:1 档），竖版传 ratio（见下）

说明：脚本内置各角色的"不换引擎·拟人化配方"prompt（脸加瑕疵/不对称/毛孔 + 自然侧光 + 抓拍感 + 35mm胶片 + 去 8k + 强化 no anime/no cgi/no video game render）。
"""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://apihub.agnes-ai.com/v1/images/generations"
KEY = "sk-slZFHu4MzTzKb43fDIFZT99NY2gy9w5bmhan6tAuBZezuWBi"
OUT_DIR = r"D:/workspace/sgpro/sgshort_drama/kofworld/05_资产库/AI生成图/agnes"

# ---- 官方参照图路径（本地转 base64 Data URI 传给 Agnes）----
REF = {
    "nikido": r"C:\Users\Administrator\.workbuddy\clipboard-images\clipboard-2026-10-18T11-27-04-209Z-a756ce39.png",  # 二阶堂红丸·抹胸造型
    "kyo_black": r"D:\短剧业务\KOF\bba1cd11728b4710b9122ecd0b9bd4fdfc039245852e.png",  # 草薙京·黑衣版
    "daimon": r"D:\短剧业务\KOF\t04157768c0c226865b.jpg",  # 大门五郎
}

# ---- 各角色拟人化 prompt（Agnes 图生图结构：改变要求 + 保留元素）----
PROMPTS = {
    "nikido": (
        "Re-render this fighting character as a REAL adult Japanese-American mixed-heritage man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (both hands raised near his head) and outfit: BLOND spiky SHORT hair standing up with static flyaway strands (NOT long, NOT red), a black cropped sleeveless tank top revealing his toned midsection and abs, loose cream trousers with thin dark side stripes, black fingerless gloves with wrist wraps, a wide athletic stance, faint yellow-white ELECTRIC sparks at his fingertips. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "kyo_black": (
        "Re-render this fighting character as a REAL adult East Asian man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (right index finger raised pointing up) and outfit: reddish-brown SHORT hair, a white cloth headband tied across the forehead, a short open-front black jacket with gold buttons over a light-grey tank top, BRIGHT ORANGE elbow-to-wrist arm warmers, black fingerless gloves with a small gold sun emblem, a tan leather belt, straight-cut black trousers, silver shoes. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "daimon": (
        "Re-render this sumo-wrestler fighting character as a REAL heavyset Japanese man in his late 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (both arms raised, open palms outward) and outfit: bare-chested with a real sumo-wrestler physique (massive but naturally proportioned, not bodybuilder-blocky), tanned skin, short black hair, a white headband with a red circular crest on the forehead, white wrist wraps, a black belt, loose white sumo-style hakama trousers, wooden geta sandals, a wide stable sumo stance. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
}


def to_data_uri(path: str) -> str:
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    ext = os.path.splitext(path)[1].lower()
    mime = "image/png" if ext in (".png", ".webp") else "image/jpeg"
    return f"data:{mime};base64,{b64}"


def gen(char_key: str, size: str = "2K", ratio: str = "9:16", ref_override: str = None):
    ref = ref_override or REF[char_key]
    data_uri = to_data_uri(ref)
    body = {
        "model": "agnes-image-2.5-flash",
        "prompt": PROMPTS[char_key],
        "size": size,
        "ratio": ratio,
        "extra_body": {
            "image": [data_uri],
            "response_format": "b64_json",
        },
    }
    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", "replace")
        print(f"HTTP_ERROR {e.code}")
        print("ERR_BODY:", err_body[:800])
        print("BODY_BYTES_SENT:", len(json.dumps(body).encode('utf-8')))
        print("REF_BYTES:", os.path.getsize(ref))
        # 503 = 队列忙，自动重试
        if e.code == 503:
            for attempt in range(1, 6):
                print(f"RETRY {attempt}/5 in 60s...")
                time.sleep(60)
                try:
                    with urllib.request.urlopen(req, timeout=300) as resp2:
                        result = json.loads(resp2.read().decode("utf-8"))
                    print(f"RETRY {attempt} SUCCEEDED")
                    break
                except urllib.error.HTTPError as e2:
                    err_body2 = e2.read().decode("utf-8", "replace")
                    print(f"RETRY {attempt} FAILED: {e2.code} {err_body2[:400]}")
                    if e2.code != 503:
                        raise
            else:
                raise RuntimeError("All retries failed (503 queue full x5)")
        else:
            raise
    d0 = result["data"][0]
    b64 = d0.get("b64_json")
    url = d0.get("url")
    print("RAW_KEYS:", json.dumps({k: (v[:60] + "..." if isinstance(v, str) and len(v) > 60 else v) for k, v in d0.items()}, ensure_ascii=False))
    os.makedirs(OUT_DIR, exist_ok=True)

    if b64:  # b64_json = 纯 base64（可能带 data: 前缀）
        raw = b64.split(",", 1)[1] if b64.startswith("data:") else b64
        out = os.path.join(OUT_DIR, f"{char_key}.png")
        with open(out, "wb") as f:
            f.write(base64.b64decode(raw))
        print("SAVED(b64):", out)
        return out
    if url:  # 兜底 url 下载
        out = os.path.join(OUT_DIR, f"{char_key}.png")
        urllib.request.urlretrieve(url, out)
        print("SAVED(url):", out)
        return out
    raise RuntimeError("No image in response")


if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else "nikido"
    size = sys.argv[2] if len(sys.argv) > 2 else "2K"
    ratio = sys.argv[3] if len(sys.argv) > 3 else "9:16"
    ref_ov = sys.argv[4] if len(sys.argv) > 4 else None
    gen(key, size, ratio, ref_ov)
