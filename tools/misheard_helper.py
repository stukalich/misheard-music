#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
misheard_helper.py — помощник для создания «ослышек» (misheard lyrics).

Ты ведёшь у себя файл с реальными строчками. Скрипт для каждого слова
предлагает фонетически похожие слова с сохранением ритмики (слоги, гласные),
а ты собираешь из них смешную «ослышку».

Установка:
    pip install wordfreq pymorphy3

Использование:
    # подсказки замен для каждого слова строки
    python3 misheard_helper.py suggest "твоя строка здесь"

    # оценить готовую пару оригинал/ослышка (насколько похоже звучит)
    python3 misheard_helper.py score "оригинальная строка" "твоя ослышка"

    # пакетный режим: файл строк -> JSON-заготовки карточек с кандидатами
    python3 misheard_helper.py batch lines.txt cards_draft.json

    # (первый запуск строит кэш словаря ~30-60 сек, дальше мгновенно)
"""

import sys
import os
import re
import json
import pickle
import unicodedata
from functools import lru_cache

try:
    from wordfreq import top_n_list, zipf_frequency
except ImportError:
    sys.exit("Нужен пакет wordfreq:  pip install wordfreq")

try:
    import pymorphy3
except ImportError:
    sys.exit("Нужен пакет pymorphy3:  pip install pymorphy3")

MORPH = pymorphy3.MorphAnalyzer()

VOWELS = "аеёиоуыэюя"
CACHE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".misheard_lexicon.pkl")
LEXICON_SIZE = 60000     # сколько частотных слов держим в словаре кандидатов
TOP_K = 12               # сколько кандидатов показывать на слово

# ----------------------------------------------------------------------------
# Фонетика
# ----------------------------------------------------------------------------

# Классы согласных: звонкие/глухие пары и близкие по звучанию сливаются,
# чтобы "болото"~"полоса" считались фонетически близкими по началу.
CONS_CLASS = {
    "б": "p", "п": "p",
    "в": "f", "ф": "f",
    "г": "k", "к": "k", "х": "k",
    "д": "t", "т": "t",
    "ж": "S", "ш": "S", "щ": "S",
    "з": "s", "с": "s", "ц": "s",
    "ч": "C",
    "л": "l", "р": "r",
    "м": "m", "н": "n",
    "й": "j",
}

# Классы гласных с учётом русской редукции безударных:
# о/а сливаются (аканье), е/и/э/ы сливаются (иканье), у/ю отдельно, ё ~ о.
VOWEL_CLASS = {
    "а": "A", "о": "A", "я": "A",
    "е": "E", "э": "E", "и": "E", "ы": "E",
    "у": "U", "ю": "U",
    "ё": "O",
}


def normalize(word: str) -> str:
    word = word.lower().replace("ё", "ё")  # keep ё distinct
    word = unicodedata.normalize("NFC", word)
    return re.sub(r"[^а-яё]", "", word)


def syllable_count(word: str) -> int:
    return sum(1 for ch in word if ch in VOWELS)


def vowel_skeleton(word: str) -> str:
    """Последовательность классов гласных: ритмико-фонетический скелет слова."""
    return "".join(VOWEL_CLASS.get(ch, "") for ch in word if ch in VOWELS)


def phonetic_form(word: str) -> str:
    """Грубая фонетическая транскрипция: согласные -> классы, гласные -> классы."""
    out = []
    for ch in word:
        if ch in VOWEL_CLASS:
            out.append(VOWEL_CLASS[ch])
        elif ch in CONS_CLASS:
            out.append(CONS_CLASS[ch])
        # ь/ъ и прочее опускаем
    return "".join(out)


def onset(word: str) -> str:
    """Класс первого согласного (или '' если слово начинается с гласной)."""
    for ch in word:
        if ch in CONS_CLASS:
            return CONS_CLASS[ch]
        if ch in VOWEL_CLASS:
            return ""
    return ""


def levenshtein(a: str, b: str) -> int:
    if len(a) < len(b):
        a, b = b, a
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def phonetic_similarity(a: str, b: str) -> float:
    """0..1: похожесть фонетических форм."""
    fa, fb = phonetic_form(a), phonetic_form(b)
    if not fa or not fb:
        return 0.0
    dist = levenshtein(fa, fb)
    return 1.0 - dist / max(len(fa), len(fb))


@lru_cache(maxsize=200000)
def lemma_of(word: str) -> str:
    p = MORPH.parse(word)
    return p[0].normal_form if p else word


@lru_cache(maxsize=200000)
def pos_of(word: str) -> str:
    p = MORPH.parse(word)
    return str(p[0].tag.POS) if p and p[0].tag.POS else "UNKN"


# ----------------------------------------------------------------------------
# Лексикон кандидатов (строится один раз, кэшируется на диск)
# ----------------------------------------------------------------------------

def build_lexicon():
    """{syllable_count: [(word, vowel_skeleton, phonetic_form, onset, pos, zipf)]}"""
    print(f"Строю словарь кандидатов ({LEXICON_SIZE} слов), это делается один раз...",
          file=sys.stderr)
    lex = {}
    words = top_n_list("ru", LEXICON_SIZE)
    for w in words:
        w = normalize(w)
        if len(w) < 2:
            continue
        syl = syllable_count(w)
        if syl == 0 or syl > 8:
            continue
        zf = zipf_frequency(w, "ru")
        if zf < 2.3:
            continue  # слишком редкое — звучит неестественно
        if not MORPH.word_is_known(w):
            continue  # мусор вне словаря отсекаем
        if "Abbr" in str(MORPH.parse(w)[0].tag):
            continue  # аббревиатуры ("овд", "яп") — не звучат как слова
        entry = (w, vowel_skeleton(w), phonetic_form(w), onset(w),
                 pos_of(w), round(zf, 2))
        lex.setdefault(syl, []).append(entry)
    with open(CACHE_PATH, "wb") as f:
        pickle.dump(lex, f)
    print("Словарь готов и закэширован.", file=sys.stderr)
    return lex


def load_lexicon():
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "rb") as f:
                return pickle.load(f)
        except Exception:
            pass
    return build_lexicon()


# ----------------------------------------------------------------------------
# Подбор кандидатов
# ----------------------------------------------------------------------------

def vowel_match_ratio(a_skel: str, b_skel: str) -> float:
    """Доля совпавших позиций гласных (скелеты одинаковой длины)."""
    if not a_skel or len(a_skel) != len(b_skel):
        return 0.0
    return sum(x == y for x, y in zip(a_skel, b_skel)) / len(a_skel)


def suggest_for_word(word: str, lexicon, top_k=TOP_K):
    """Кандидаты на замену слова: тот же слоговый размер, похожее звучание,
    но не то же слово/лемма (иначе будет слишком легко угадать)."""
    w = normalize(word)
    if not w:
        return []
    syl = syllable_count(w)
    if syl == 0:
        return []
    w_skel = vowel_skeleton(w)
    w_onset = onset(w)
    w_lemma = lemma_of(w)
    w_pos = pos_of(w)

    scored = []
    for cand, c_skel, c_phon, c_onset, c_pos, c_zipf in lexicon.get(syl, []):
        if cand == w or lemma_of(cand) == w_lemma:
            continue  # однокоренное/то же слово — угадывается мгновенно
        vm = vowel_match_ratio(w_skel, c_skel)
        if vm < 0.5:
            continue  # ритмика по гласным должна в основном совпадать
        ps = phonetic_similarity(w, cand)
        if ps < 0.35:
            continue
        # Точное совпадение ПОСЛЕДНЕЙ гласной буквы (не класса) — прокси на
        # совпадение ударного окончания: в песнях слух цепляется за конец слова.
        w_vlast = [ch for ch in w if ch in VOWELS]
        c_vlast = [ch for ch in cand if ch in VOWELS]
        last_vowel_exact = 1.0 if (w_vlast and c_vlast and w_vlast[-1] == c_vlast[-1]) else 0.0
        # Полное побуквенное совпадение всех гласных — идеальный ритм.
        vowels_exact = 1.0 if w_vlast == c_vlast else 0.0
        # Сильная разница в длине слова ломает темп чтения.
        len_penalty = min(abs(len(w) - len(cand)), 3) * 0.25
        # Сладкая зона: похоже, но не слишком. Слишком похожие чуть штрафуем,
        # чтобы ослышку не было "легко угадать".
        sweet = 1.0 - abs(ps - 0.68) * 1.2
        score = (
            2.0 * vm +                       # совпадение классов гласных = ритм
            1.2 * last_vowel_exact +         # то же ударное окончание
            0.8 * vowels_exact +             # идеально совпавшие гласные
            1.6 * sweet +                    # звучит похоже, но не в лоб
            0.8 * (1.0 if c_onset == w_onset else 0.0) +  # похожее начало слова
            0.5 * (1.0 if c_pos == w_pos else 0.0) +       # та же часть речи
            0.15 * c_zipf                    # частотное = звучит естественно
            - len_penalty
        )
        scored.append((score, cand, ps, vm, c_zipf))

    scored.sort(reverse=True)
    return scored[:top_k]


def tokenize(line: str):
    return re.findall(r"[а-яА-ЯёЁ]+", line)


# ----------------------------------------------------------------------------
# Режимы CLI
# ----------------------------------------------------------------------------

def cmd_suggest(line: str):
    lexicon = load_lexicon()
    words = tokenize(line)
    if not words:
        print("В строке не найдено русских слов.")
        return
    total_syl = sum(syllable_count(normalize(w)) for w in words)
    print(f"\nСтрока: {line}")
    print(f"Слогов всего: {total_syl}  |  слова: {len(words)}\n")
    for w in words:
        syl = syllable_count(normalize(w))
        cands = suggest_for_word(w, lexicon)
        print(f"— {w}  ({syl} сл., скелет {vowel_skeleton(normalize(w)) or '-'})")
        if not cands:
            print("    (кандидатов не нашлось — попробуй заменить руками или объединить со соседним словом)")
            continue
        for score, cand, ps, vm, zipf in cands:
            print(f"    {cand:<18} звучание {ps:.2f}  гласные {vm:.2f}")
        print()
    print("Подсказка: собери строку из кандидатов и проверь её командой score.")


def cmd_score(original: str, misheard: str):
    ow, mw = tokenize(original), tokenize(misheard)
    o_syl = sum(syllable_count(normalize(w)) for w in ow)
    m_syl = sum(syllable_count(normalize(w)) for w in mw)
    o_join = normalize("".join(ow))
    m_join = normalize("".join(mw))
    ps = phonetic_similarity(o_join, m_join)
    o_skel = vowel_skeleton(o_join)
    m_skel = vowel_skeleton(m_join)
    if len(o_skel) == len(m_skel) and o_skel:
        vm = sum(a == b for a, b in zip(o_skel, m_skel)) / len(o_skel)
    else:
        vm = 0.0

    print(f"\nОригинал : {original}   ({o_syl} сл.)")
    print(f"Ослышка  : {misheard}   ({m_syl} сл.)\n")
    print(f"Слоги совпадают : {'ДА' if o_syl == m_syl else f'НЕТ ({o_syl} vs {m_syl})'}")
    print(f"Совпадение гласных по позициям : {vm:.0%}")
    print(f"Фонетическая похожесть целиком : {ps:.0%}\n")

    verdict = []
    if o_syl != m_syl:
        verdict.append("ритм сломан — сравняй количество слогов")
    if vm < 0.55:
        verdict.append("гласные расходятся — ослышка звучит неправдоподобно")
    if ps > 0.85:
        verdict.append("слишком похоже — будет легко угадать")
    if ps < 0.45:
        verdict.append("слишком далеко — не поверят, что так послышалось")
    if not verdict:
        print("Вердикт: отличная ослышка — правдоподобно и не в лоб. Бери!")
    else:
        print("Вердикт: " + "; ".join(verdict) + ".")


def cmd_batch(infile: str, outfile: str):
    lexicon = load_lexicon()
    cards = []
    with open(infile, encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    for line in lines:
        words = tokenize(line)
        per_word = []
        for w in words:
            cands = suggest_for_word(w, lexicon, top_k=6)
            per_word.append({
                "word": w,
                "syllables": syllable_count(normalize(w)),
                "candidates": [c[1] for c in cands],
            })
        cards.append({
            "real": line,
            "mis": "",              # <- собери сам из candidates и впиши
            "artist": "",
            "title": "",
            "syllables_total": sum(syllable_count(normalize(w)) for w in words),
            "word_suggestions": per_word,
        })
    with open(outfile, "w", encoding="utf-8") as f:
        json.dump({"cards": cards}, f, ensure_ascii=False, indent=2)
    print(f"Готово: {len(cards)} заготовок -> {outfile}")
    print("Заполни поле 'mis' в каждой карточке, потом проверь пары командой score.")


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return
    cmd = args[0]
    if cmd == "suggest" and len(args) >= 2:
        cmd_suggest(" ".join(args[1:]))
    elif cmd == "score" and len(args) >= 3:
        cmd_score(args[1], args[2])
    elif cmd == "batch" and len(args) >= 3:
        cmd_batch(args[1], args[2])
    elif cmd == "rebuild-cache":
        if os.path.exists(CACHE_PATH):
            os.remove(CACHE_PATH)
        build_lexicon()
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
