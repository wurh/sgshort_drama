#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量生成《格斗家世界》第一季关键台词的粤语配音（edge-tts）。
输出到 06_粤语配音/，按 shot_镜号 命名，便于与分镜脚本对应。
"""
import asyncio, sys
from pathlib import Path

OUT = Path(r"D:/workspace/sgpro/sgshort_drama/kofworld/06_粤语配音")
OUT.mkdir(parents=True, exist_ok=True)

TONE = {
    "normal": ("+18%", "+8Hz"),
    "slow":   ("+0%",  "+8Hz"),
    "fast":   ("+24%", "+8Hz"),
    "angry":  ("+36%", "+12Hz"),
}
VOICE = {
    "男": "zh-HK-WanLungNeural",
    "女": "zh-HK-HiuMaanNeural",
}

# (shot, 角色, 粤语台词, 语气, 性别)
LINES = [
    ("002", "吴真",   "時光機？我玩咗廿幾年格鬥遊戲，今日真可以回到嗰個年代？", "fast", "男"),
    ("005", "吴真",   "南方市，南方。我真係回到咗游戏入面嘅年代。", "normal", "男"),
    ("008", "吴真",   "呢個唔係夢……係我玩過嘅世界！", "fast", "男"),
    ("010", "吴真",   "我玩過嘅，就贏唔到。呢招，我見過成百上千次。", "normal", "男"),
    ("014", "高人",   "你識招式，卻唔識『氣』。九四年嘅對手，比你記住嘅更快。", "slow", "男"),
    ("016", "吴真",   "去日本，闖進格鬥家大賽！呢世，我要做一個真正嘅格鬥家。", "fast", "男"),
    ("019", "吴真",   "京……拳崇……佢哋，全部喺度……", "slow", "男"),
    ("024", "紅丸",   "你眼光唔錯——一齊去打格鬥家大賽？", "fast", "男"),
    ("037", "吴真",   "呢招，我見過一百次——而家，輪到你啦！", "fast", "男"),
    ("044", "吴真",   "點解？！呢封信係邊個寫？", "angry", "男"),
    ("046", "吉斯",   "唔使急，遊戲仲未開始。", "slow", "男"),
    ("052", "八神",   "嚟。", "slow", "男"),
    ("061", "吴真",   "原來……『氣』先係招式背後嗰層。我『見』過嘅，只係招式本身。", "slow", "男"),
    ("064", "拳崇",   "你個腦，比我見過嘅手更可怕。", "slow", "男"),
    ("066", "吴真",   "時間錨……斷咗？返唔去？", "slow", "男"),
    ("070", "吴真",   "你話改唔到？我偏要試！", "angry", "男"),
    ("078", "吴真",   "我返唔到屋企——但我可以留下，改變呢個世界。", "normal", "男"),
    ("079", "吴真",   "第二季，我要打穿拳皇巔峰戰。", "fast", "男"),
    ("080", "吴真",   "呢世……我，吳真，係一個真正嘅格鬥家。", "slow", "男"),
]

async def main():
    import edge_tts
    for shot, who, text, tone, sex in LINES:
        rate, pitch = TONE[tone]
        vid = VOICE[sex]
        safe = "".join(c for c in text[:8] if c.isalnum() or c in " _-")
        fname = f"shot_{shot}_{who}_{safe}.mp3"
        fpath = OUT / fname
        comm = edge_tts.Communicate(text, vid, rate=rate, pitch=pitch)
        await comm.save(str(fpath))
        print(f"[OK] shot_{shot} {who} ({tone}) -> {fpath.name}  {fpath.stat().st_size/1024:.1f}KB")
    print(f"\n== 全部生成完成：{len(LINES)} 条 ==")

if __name__ == "__main__":
    asyncio.run(main())
