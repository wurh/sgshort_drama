"""
Agnes-Image-2.5-Flash 图生图 · 角色拟人化出图脚本（KOF《格斗家世界》）

用途：拿"官方参照图 + 拟人化 prompt"走 Agnes 引擎，出"照片级真人"角色锁脸基准图。
- 全免费（1K/2K/3K/4K 输出 + 前 3 张输入参考图均 $0）
- 支持图生图（extra_body.image 传 base64 或 URL）
- 返回图片并下载到 05_资产库/AI生成图/agnes/

用法：
    python agnes_img2img.py <角色key> [size]
    角色key ∈ {nikido, kyo_black, daimon, iori, terry, andy, dongzhang, athena, orochi}
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
    "iori": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\八神庵_经典款_参照.png",  # 八神庵·KOF95-XI经典款
    "terry": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\特瑞博加德_经典款_参照.png",  # 特瑞·博加德·经典款
    "andy": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\安迪博加德_经典款_参照.png",  # 安迪·博加德·经典款
    "dongzhang": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\东丈_经典款_参照.png",  # 东丈/崔·东次·经典款
    "athena": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\麻宫雅典娜_经典款_参照.png",  # 麻宫雅典娜·经典款
    "kunkuragi": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\椎拳崇_经典款_参照.jpg",  # 椎拳崇·龙拳经典款
    "zhenyuanzhai": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\镇元斋_经典款_参照.jpg",  # 镇元斋·KOF中国队老拳师
    "harveyD": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\哈维D_经典款_参照.png",  # 哈维·D·美式拳击手·黑人
    "rocky": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\洛奇古洛巴_经典款_参照.png",  # 洛奇·古洛巴·篮球主题·黑人
    "bayern": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\拜仁巴特乐_经典款_参照.png",  # 拜仁·巴特乐·美式肌肉拳手·右肩金属罐
    "jinfan": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\金家藩_经典款_参照.png",  # 金家藩·KOF中国风·腿法/音速踢
    "guohan": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\陈国汉_经典款_参照.png",  # 陈国汉·KOF中国风·链拳Heavy Chain·赵豹之父
    "caibaojian": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\蔡宝健_经典款_参照.png",  # 蔡宝健·KOF中国僵尸街头格斗家·双手金属利爪·无特效
    "hadren": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\哈迪伦_经典款_参照.png",  # 哈迪伦·KOF军装格斗家·右眼黑眼罩·蓝军装·无特效
    "ralf": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\拉尔夫琼斯_经典款_参照.png",  # 拉尔夫·琼斯·KOF美式街头拳手·无特效
    "clark": r"D:\workspace\sgpro\sgshort_drama\kofworld\05_资产库\参考图\克拉克斯蒂尔_经典款_参照2.png",  # 克拉克·斯蒂尔·KOF美式街头拳手（特库摩3K队长）·无特效·蓝棒球帽+藏青padded马甲+黑露指手套+蓝工装裤
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
    "iori": (
        "Re-render this fighting character as a REAL lean East Asian young man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature outfit and low crouched fighting stance: deep wine-red LONG hair, chin-length falling behind the ears and over the nape (NOT short-cropped), with thick straight front bangs falling across the face and FULLY COVERING his left eye (his signature), a fitted SOLID BLACK half-buttoned collar jacket with a thin white crescent-moon crest on the back, an open white long shirt reaching to the thighs, dark maroon-red trousers with a red leather strap binding the shins, black boots, a black choker, a silver ring on the right ring finger. "
        "Cold narrow upturned eyes, dark violet-purple irises, a sharp jawline and thin lips with a subtle cruel smirk. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "terry": (
        "Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature outfit and stance: light BLONDE short hair with a slightly spiky fringe and ONE long blonde ponytail/braid hanging down the BACK of his head over his back (NOT a side-lock in front of the chest), a red-and-white snapback cap with a small red 'TERRY B.' fabric print on the front, a red SLEEVELESS vest with shredded white-fleece frayed edges over a plain white tank top, medium-blue straight jeans, a black belt, black hand wraps on both wrists, red high-top canvas sneakers, walking forward with fists at guard height. "
        "Light tanned Caucasian skin, a square jaw with a confident cocky grin, steel-blue eyes. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "andy": (
        "Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature outfit and stance: long light BLONDE straight hair falling to the shoulders, a white SLEEVELESS tank top with a RED FLAME-TIP trim along the neckline and hem, RED forearm wraps, a black waist belt, white shorts with RED leg wraps extending down the shins, tall RED leather boots with white laces, arms crossed over the chest. "
        "Light tanned Caucasian skin, a square jaw with a cold stern expression, steel-blue eyes. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "dongzhang": (
        "Re-render this martial-arts fighter as a REAL 24-year-old Korean taekwondo fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature outfit and stance: bare-chested with a real athletic tanned physique (toned but naturally proportioned, not bodybuilder-blocky), black short SPIKY hair with a few flyaway strands, a white cloth headband tied across the forehead with a small RED dot crest on the center, thick white hand wraps on both wrists and forearms, loose RED taekwondo shorts with a black waist belt, brown leg wraps on both shins, a wide stable fighting stance with both fists raised at guard height, an intense focused fierce expression. "
        "Light tanned skin with realistic pores and a subtle sweat sheen. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "athena": (
        "Re-render this female idol-psycho fighter as a REAL 20-year-old East Asian woman, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve her signature outfit and idol pose (one arm raised high, the other hand near her hip): long BLACK hair with a PINK/MAGENTA headband, a red and white cheerleader-style idol outfit (white puffy short-sleeve top under an open red vest, a pink beaded necklace, a pleated RED skirt, a red belt, RED tights, RED fingerless gloves with white cuffs, RED Mary-Jane shoes with white straps), a bright cheerful smile, big warm eyes, light-tanned East Asian skin with realistic pores. "
        "The face must be a naturally imperfect real adult female face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "kunkuragi": (
        "Re-render this martial-arts fighter as a REAL 20-year-old East Asian man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (right fist wrapped in white bandage raised overhead, left arm extended forward with open hand) and outfit: medium-length BROWN hair in a CENTER part, shorter on the sides with slightly messy loose strands hanging to the forehead and nape (NOT long-to-shoulders, NOT blue, NO goggles), a bright BLUE denim-style open cropped jacket with gold snap buttons over a WHITE hooded sweatshirt, matching bright BLUE athletic shorts, dark navy knee guards, grey-blue sneakers, white hand wraps, a confident focused expression. "
        "Light-tanned East Asian skin with realistic pores. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no goggles, no purple gi, no white jacket, no grey shorts, no long hair to the shoulders, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "zhenyuanzhai": (
        "Re-render this Chinese martial-arts master as a REAL East Asian elderly man in his 70s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature low crouching horse-stance pose and outfit: an olive-drab army-peaked cap with a small round embroidered crest on the front, a full WHITE beard and white mustache (long, weathered), wispy WHITE hair, an olive-green traditional Chinese mandarin-collar martial-arts tunic with matching olive trousers and thin WHITE trim on the collar, cuffs and trouser hems, a row of large round COPPER coins/medallions (gong-fu balls) strapped across his back, holding a short wooden staff/stick in both hands, a weathered elderly face. "
        "Deeply wrinkled realistic elderly skin with age spots, visible pores, uneven skin tone, the dignity of a seasoned old master. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "harveyD": (
        "Re-render this boxer as a REAL Black/African-American man in his 30s, a tall lean heavily-muscled professional boxer, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature boxer's stance (fists up at guard) and outfit: a tall high MOPPYCORN / mohawk hairstyle (sides shaved, a high vertical crest of black hair on top), black sunglasses, an OPEN black varsity/letterman jacket with RED and WHITE stripe trim on the collar, cuffs and hem (worn open, unbuttoned, revealing a bare well-defined chest and abs), black boxing shorts with a WHITE band at the hems, white fingerless boxing gloves with white wrist wraps, tall black high-top boxing boots, an intense focused expression. "
        "Dark rich brown Black skin with realistic pores and a subtle sheen. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity"
    ),
    "rocky": (
        "Re-render this basketball-themed fighter as a REAL Black/African-American man in his late 20s, a tall athletic professional basketball player physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (holding a single ORANGE basketball in one hand at his side, the other hand relaxed) and outfit: a PINK backwards baseball cap (brim facing the back), a color-blocked hoodie in PINK and NAVY with a large WHITE hood and a white chest panel with drawstrings, PINK basketball shorts with a WHITE band at the hems, thick white wrist wraps on both wrists, high-top sneakers in purple-pink with white soles, a confident relaxed street-athlete expression. "
        "Dark rich brown Black skin with realistic pores and a subtle sheen. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO letters, NO arrows, NO Japanese text, NO voice-actor captions. Full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no text, no letters, no arrows, no Japanese text, no face scars, no deformed hands, no extra fingers, no watermark, no 8k, consistent facial identity"
    ),
    "bayern": (
        "Re-render this heavyweight boxer as a REAL muscular 30-year-old man with a deeply tanned sun-bronzed / medium-brown complexion (NOT pale, NOT white), a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature punching pose (one straight punch extended, the other at guard) and outfit: short spiky REDDISH-ORANGE / ginger hair, a BLUE t-shirt with a large YELLOW five-pointed STAR on the chest and RED-WHITE striped cuffs, a SILVER METAL TANK / pressurized canister strapped to his right shoulder with a brown leather diagonal harness, thick white wrist wraps on both wrists, loose light-blue / teal trousers, white high-top sneakers with blue accents, an intense focused fierce expression. "
        "Heavy muscle definition, realistic skin pores and a subtle sheen. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "The metal tank is a real prop, NOT a weapon, NOT glowing. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity"
    ),
    "jinfan": (
        "Re-render this Chinese martial-arts kicker as a REAL 28-year-old East Asian man, lean and athletic with defined muscle, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature hands-on-hips pose and outfit: short dark-brown hair, a sleeveless off-white V-neck martial-arts gi / kimono top with NAVY trim on the collar and front opening and two small navy rectangular fastenings on the chest, a black fabric waist belt, navy wrist wraps on both wrists, loose off-white wide martial-arts trousers, navy straw sandals (barefoot), a confident calm focused expression. "
        "Warm light-tanned East Asian skin with realistic pores. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity"
    ),
    "guohan": (
        "Re-render this Chinese heavy-chain fighter as a REAL large, broad-shouldered, bald East Asian man in his 40s with a heavy strongman build and a thick black beard, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature low crouching pose (one hand gripping the top of a heavy iron chain that loops across his chest and shoulders, the other hand held to his head) and outfit: a bald head, a thick full black beard, an olive-grey / dark khaki military-style work jacket and matching dark trousers, a heavy IRON CHAIN wrapped around his torso and hanging across his shoulders (a real metal weapon, NOT glowing), barefoot, an intense fierce expression. "
        "Tanned sun-bronzed skin with visible pores and a subtle sheen. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity"
    ),
    "caibaojian": (
        "Re-render this Chinese street claw fighter as a REAL 32-year-old East Asian man, lean and wiry with a feral weathered look, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature pose (crouched, BOTH hands thrust forward, each hand wearing a wrist-mounted metal CLAW GLOVE with several long pointed FINGER CLAWS extended, a wild manic grin) and outfit: a brown wide-brim FEDORA / felt hat with a BLUE hat band, black square-frame sunglasses, a sleeveless off-white / light-grey vest with thin navy trim and a navy sash belt, loose dark-navy wide lantern trousers, brown work boots, an intense excited feral grin. "
        "Weathered tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale), realistic pores. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic, NOT a green-skinned cartoon zombie, NOT glowing. "
        "The claw gloves are real metal weapons, NOT glowing. No fire, no elemental effects, no green skin, no supernatural glow. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, NO Chinese text, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no green skin, no zombie caricature, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity"
    ),
    "hadren": (
        "Re-render this military-style fighter as a REAL 35-year-old East Asian man, lean and highly muscular with a disciplined military physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature stance (right hand raised with fingers curled, left hand at his side) and outfit: a BLUE military peaked cap with a small crest on the front, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses, just one eye covered), a fitted long-sleeved BLUE military / utility jacket with a small gold button and a RED-ORANGE padded shoulder patch on the right shoulder and a red-orange panel on the chest, a black inner undershirt, a black leather belt with a gold buckle, matching BLUE military trousers, tall black service boots, black full-finger combat gloves, an intense focused stern expression. "
        "Tanned sun-bronzed East Asian skin with visible pores. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, NO watermark, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no sunglasses, no green uniform, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity"
    ),
    "ralf": (
        "Re-render this American street fighter as a REAL 30-year-old muscular East Asian street fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature stance (right fist thrust forward in a straight punch, left fist at guard near the chin, one foot forward) and outfit: short dark-brown hair, a long RED headband with GREEN STAR / GREEN TRIANGLE pattern tied across his forehead with the long tail fluttering behind him, a dark PURPLE / aubergine SLEEVELESS tactical vest over a dark olive-green long-sleeved shirt, dark RED boxing gloves on both hands, a brown leather waist belt with a metal buckle, loose olive-drab CARGO military trousers with two large patch pockets on the thighs, tall brown leather combat boots, an intense fierce determined expression. "
        "Tanned sun-bronzed East Asian skin with heavy muscle definition and a subtle sheen of sweat, visible pores. "
        "The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity"
    ),
    "clark": (
        "Re-render this American street fighter as a REAL 30-year-old muscular Caucasian street fighter / street cop, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. "
        "Preserve his signature roaring stance (one foot forward, one arm crossed in front of the chest with the other gloved fist raised, mouth open in a loud defiant shout / wild grin) and outfit: a BLUE baseball cap, black wayfarer-style sunglasses, a fitted STEEL-BLUE / navy PADDED SLEEVELESS tactical vest with a raised collar, open front over a BLACK tank-top undershirt revealing a toned muscular chest and abs, dark black fingerless combat gloves on both hands, loose steel-blue work/cargo trousers with side pockets, dark brown leather shoes, tanned sun-bronzed skin with heavy muscle definition (visible chest, shoulders, arms). "
        "The face must be a naturally imperfect real adult male face: slightly dirty-blonde / light-golden hair peeking out from under the cap, slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. "
        "No fire, no elemental effects. Pure white seamless studio background, no cast shadow, NO text, NO watermark, full body. "
        "NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no brown vest, no white tank top, no blue boxing gloves, no grey cap, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no Chinese text, no 8k, consistent facial identity"
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
    # 统一重试：服务端临时错误（队列满/限流/瞬时404/重定向死循环）都扛过去
    transient = {301, 302, 303, 307, 308, 404, 429, 500, 502, 503, 504}
    max_attempts = 8
    interval = 90
    result = None
    for attempt in range(1, max_attempts + 1):
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                result = json.loads(resp.read().decode("utf-8"))
            print(f"OK on attempt {attempt}")
            break
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", "replace")
            print(f"HTTP_ERROR {e.code} on attempt {attempt}")
            print("ERR_BODY:", err_body[:800])
            if attempt == 1:
                print("BODY_BYTES_SENT:", len(json.dumps(body).encode('utf-8')))
                print("REF_BYTES:", os.path.getsize(ref))
            if e.code in transient and attempt < max_attempts:
                print(f"RETRY {attempt}/{max_attempts} in {interval}s...")
                time.sleep(interval)
                continue
            raise
    if result is None:
        raise RuntimeError("All retries failed (transient server errors)")
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
    if url:  # 兜底 url 下载（带浏览器 UA，CDN 常校验 UA；失败小重试）
        out = os.path.join(OUT_DIR, f"{char_key}.png")
        dl_ok = False
        for attempt in range(1, 4):
            dl_req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"})
            try:
                with urllib.request.urlopen(dl_req, timeout=120) as dlresp:
                    blob = dlresp.read()
                with open(out, "wb") as f:
                    f.write(blob)
                print(f"SAVED(url):", out, f"({len(blob)} bytes, attempt {attempt})")
                dl_ok = True
                break
            except Exception as de:
                print(f"URL download attempt {attempt} failed: {de}")
                time.sleep(5)
        if not dl_ok:
            print("URL_FINAL_FAIL:", url)
            raise RuntimeError("url download failed after retries; re-run to get b64_json")
        return out
    raise RuntimeError("No image in response")


if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else "nikido"
    size = sys.argv[2] if len(sys.argv) > 2 else "2K"
    ratio = sys.argv[3] if len(sys.argv) > 3 else "9:16"
    ref_ov = sys.argv[4] if len(sys.argv) > 4 else None
    gen(key, size, ratio, ref_ov)
