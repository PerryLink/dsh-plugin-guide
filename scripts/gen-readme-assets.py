#!/usr/bin/env python3
"""README visuals for dsh-plugin-guide — v3 (1440x576 hero + 1100x660 flow).

GitHub renders README images ~880px wide; every canvas size below is chosen so
the on-screen type stays readable (title >= 45px, secondary >= 15px, meta >= 12px).
"""
import os
from html import escape
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs', 'assets')
FONT_CJK = r'C:\Windows\Fonts\msyh.ttc'
FONT_CJK_BOLD = r'C:\Windows\Fonts\msyhbd.ttc'
FONT_MONO = r'C:\Windows\Fonts\consola.ttf'
FONT_EN = r'C:\Windows\Fonts\segoeui.ttf'
FONT_EN_BOLD = r'C:\Windows\Fonts\segoeuib.ttf'
for _p in (FONT_CJK, FONT_CJK_BOLD, FONT_MONO):
    if not os.path.exists(_p):
        raise SystemExit(f'FATAL: font missing: {_p}')

SKIN = {
    'light': dict(bg_from='#f9f6fd', bg_to='#e4eaf8', card='#ffffff',
                  card_edge='#e4e1ee', text='#141419', sub='#4d5261',
                  faint='#8f94a4', accent='#4B67B4', accent2='#16a34a',
                  warn='#bc4c00', pill='#ece7f9', grid='#e7e4f0',
                  shadow=(32, 26, 64)),
    'dark': dict(bg_from='#131a2a', bg_to='#0c1016', card='#1b2231',
                 card_edge='#2e374b', text='#f0f3f9', sub='#a8b1c4',
                 faint='#737b8d', accent='#8496f5', accent2='#3fb950',
                 warn='#d29922', pill='#242d42', grid='#1e2636',
                 shadow=(0, 0, 0)),
}


def font(size, kind='cjk_bold'):
    return ImageFont.truetype({
        'cjk': FONT_CJK, 'cjk_bold': FONT_CJK_BOLD, 'mono': FONT_MONO,
        'en': FONT_EN, 'en_bold': FONT_EN_BOLD}[kind], size)


def hx(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def gradient(w, h, c1, c2):
    a = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(a)
    for y in range(h):
        t = 0.2 * (y / h) + 0.8 * (y / h) ** 1.5
        d.line([(0, y), (w, y)],
               fill=tuple(int(p + (q - p) * t) for p, q in zip(hx(c1), hx(c2))))
    return a


def glow(img, cx, cy, r, color, alpha=60):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(9, 0, -1):
        rr = r * i / 9
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                  fill=color + (int(alpha * (1 - i / 10)),))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def card(img, box, skin, radius=20, shadow=22):
    x0, y0, x1, y1 = box
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    for i in range(shadow, 0, -3):
        sd.rounded_rectangle([x0 - i // 4, y0 + i // 2, x1 + i // 4, y1 + i],
                             radius=radius + i // 4,
                             fill=skin['shadow'] + (int(8 * (1 - i / shadow)),))
    base = Image.alpha_composite(img.convert('RGBA'),
                                 sh.filter(ImageFilter.GaussianBlur(11)))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(box, radius=radius, fill=hx(skin['card']),
                        outline=hx(skin['card_edge']), width=2)
    return base.convert('RGB')


def pill(img, xy, text, skin, size=16, fg=None, bg=None, kind='cjk_bold'):
    d = ImageDraw.Draw(img)
    f = font(size, kind)
    tw = d.textlength(text, font=f)
    x, y = xy
    h = size + 18
    d.rounded_rectangle([x, y, x + tw + 32, y + h], radius=h // 2,
                        fill=hx(bg or skin['pill']))
    d.text((x + 16, y + 7), text, font=f, fill=hx(fg or skin['accent']))


def wrap(d, text, f, maxw):
    if ' ' in text:
        words, lines, cur = text.split(' '), [], ''
        for wd in words:
            cand = (cur + ' ' + wd) if cur else wd
            if d.textlength(cand, font=f) <= maxw or not cur:
                cur = cand
            else:
                lines.append(cur)
                cur = wd
        if cur:
            lines.append(cur)
        return lines
    lines, cur = [], ''
    for ch in text:
        if d.textlength(cur + ch, font=f) <= maxw or not cur:
            cur += ch
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    return lines


HERO = {
    'zh': dict(kicker='DeepSeek Harness · 指南层', title='dsh-plugin-guide',
               value=['先把检查问对，', '再交给判定工具'],
               sub='ENTRY / FLOW / BOOST 三层问题清单：\n解释要检查什么、为什么重要、判定归谁。',
               meta='指南层  ·  判定路由  ·  不认证不打分',
               levels=[('ENTRY', '入门', '能装上、能跑、不崩'),
                       ('FLOW', '顺畅', '日常任务顺、错误可恢复'),
                       ('BOOST', '加速', '提效证据可复现')],
               route='判定交给 dsh-standards',
               foot='Apache-2.0  ·  PerryLink DSH plugin family'),
    'en': dict(kicker='DeepSeek Harness · Guide layer', title='dsh-plugin-guide',
               value=['Ask the right checks', 'then route the verdict'],
               sub='ENTRY / FLOW / BOOST question lists:\nwhat to check, why it matters, who decides.',
               meta='Guide layer  ·  verdict routing  ·  no scoring',
               levels=[('ENTRY', 'start', 'installs, runs, does not crash'),
                       ('FLOW', 'flow', 'daily tasks work, errors recover'),
                       ('BOOST', 'boost', 'speed-up evidence is reproducible')],
               route='verdict belongs to dsh-standards',
               foot='Apache-2.0  ·  PerryLink DSH plugin family'),
}


def hero(lang, skin):
    s = SKIN[skin]
    w, h = 1440, 576
    img = gradient(w, h, s['bg_from'], s['bg_to'])
    img = glow(img, 1160, 90, 380, hx(s['accent']), 30 if skin == 'light' else 44)
    img = glow(img, 200, 540, 280, hx(s['accent2']), 12 if skin == 'light' else 18)
    H = HERO[lang]
    d = ImageDraw.Draw(img)
    m = 60
    pill(img, (m, m), H['kicker'], s, size=17)
    d = ImageDraw.Draw(img)
    tsize = 84
    while tsize > 44:
        tf = font(tsize, 'mono')
        if d.textlength(H['title'], font=tf) <= 540:
            break
        tsize -= 4
    tf = font(tsize, 'mono')
    d.text((m, 112 + (84 - tsize) // 2), H['title'], font=tf,
           fill=hx(s['text']))
    y = 228
    for line in H['value']:
        d.text((m, y), line, font=font(40, 'cjk_bold'), fill=hx(s['text']))
        y += 54
    fsub = font(26, 'cjk')
    lines = []
    for para in H['sub'].split('\n'):
        lines += wrap(d, para, fsub, 520)
    for i, ln in enumerate(lines):
        d.text((m + 2, 348 + i * 36), ln, font=fsub, fill=hx(s['sub']))
    meta_y = 348 + len(lines) * 36 + 18
    d.text((m + 2, meta_y), H['meta'], font=font(20, 'cjk'), fill=hx(s['faint']))
    d.line([m + 2, meta_y + 44, m + 540, meta_y + 44], fill=hx(s['grid']), width=2)
    d.text((m + 2, meta_y + 60), H['foot'], font=font(17, 'en'),
           fill=hx(s['faint']))

    # right: three level cards + routing bar
    ys = [(660, 52, 1380, 168), (660, 186, 1380, 302), (660, 320, 1380, 436)]
    for i, ((x0, y0, x1, y1), (code, name, desc)) in enumerate(zip(ys, H['levels'])):
        img = card(img, (x0, y0, x1, y1), s)
        d = ImageDraw.Draw(img)
        d.ellipse([x0 + 26, y0 + 30, x0 + 54, y0 + 58],
                  fill=hx(s['pill']))
        d.text((x0 + 40, y0 + 36), str(i + 1), anchor='mm',
               font=font(15, 'en_bold'), fill=hx(s['accent']))
        d.text((x0 + 70, y0 + 28), code, font=font(22, 'mono'),
               fill=hx(s['text']))
        d.text((x0 + 70, y0 + 58), f'{name} · {desc}', font=font(19, 'cjk'),
               fill=hx(s['sub']))
        pill(img, (x1 - 96, y0 + 22), '→ 检查', s, size=14, kind='cjk')
    img = card(img, (660, 452, 1380, 524), s)
    d = ImageDraw.Draw(img)
    d.text((686, 472), H['route'], font=font(22, 'cjk_bold'), fill=hx(s['accent']))
    d.text((686, 500), 'dsh-standards · DSH levels', font=font(15, 'mono'),
           fill=hx(s['faint']))
    d.polygon([(1310, 476), (1338, 488), (1310, 500)], fill=hx(s['accent']))
    img.save(os.path.join(OUT, f'dsh-plugin-guide-hero-{lang}-{skin}.webp'),
             'WEBP', quality=92)
    print(f'dsh-plugin-guide-hero-{lang}-{skin}.webp')


FLOW = {'light': dict(bg='#ffffff', zone='#f7f5fc', card='#ffffff',
                      edge='#e6e3f0', text='#141419', sub='#4d5261',
                      faint='#8f94a4', accent='#4B67B4', accent2='#16a34a',
                      grid='#f2f0f8', pill='#ece7f9'),
        'dark': dict(bg='#0d1117', zone='#121824', card='#161b26', edge='#2a3142',
                     text='#f0f3f9', sub='#a8b1c4', faint='#737b8d',
                     accent='#8496f5', accent2='#3fb950', grid='#182031',
                     pill='#242d42')}


def flow_svg(skin):
    s = FLOW[skin]
    W, H = 1100, 660
    solid = "0.10" if skin == 'light' else "0.55"
    levels = [('ENTRY', '入门 · 6 个问题', '能装上、能跑、不崩', 50, 150),
              ('FLOW', '顺畅 · 7 个问题', '日常任务顺、错误可恢复', 84, 268),
              ('BOOST', '加速 · 5 个问题', '提效证据可复现', 118, 386)]
    p = [f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="dsh-plugin-guide three-level ladder ending in a routing arrow">
<defs>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="200%">
    <feDropShadow dx="0" dy="9" stdDeviation="12" flood-color="#1b1735" flood-opacity="{solid}"/>
  </filter>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
    <circle cx="1.3" cy="1.3" r="1.3" fill="{s['grid']}"/>
  </pattern>
  <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" fill="{s['accent2']}"/>
  </marker>
</defs>
<rect width="{W}" height="{H}" fill="{s['bg']}"/>
<rect width="{W}" height="{H}" fill="url(#dots)" opacity=".5"/>
<text x="50" y="58" fill="{s['text']}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="32" font-weight="700">dsh-plugin-guide</text>
<text x="50" y="86" fill="{s['sub']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16">three levels, deepening questions · the guide asks, dsh-standards decides</text>
<text x="50" y="122" fill="{s['accent']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="1.5">ADOPTION DEPTH</text>
<line x1="38" y1="150" x2="38" y2="482" stroke="{s['accent']}" stroke-width="2" stroke-dasharray="4 6" opacity=".6"/>
''']
    for i, (code, sub, desc, x, y) in enumerate(levels):
        p.append(f'''<rect x="{x}" y="{y}" width="392" height="92" rx="18" fill="{s['card']}" stroke="{s['accent'] if i == 2 else s['edge']}" stroke-width="{2.4 if i == 2 else 1.3}" filter="url(#soft)"/>
<circle cx="{x + 32}" cy="{y + 46}" r="17" fill="{s['pill']}"/>
<text x="{x + 32}" y="{y + 52}" text-anchor="middle" fill="{s['accent']}" font-family="ui-monospace, monospace" font-size="14" font-weight="700">{i + 1}</text>
<text x="{x + 66}" y="{y + 36}" fill="{s['text']}" font-family="ui-monospace, monospace" font-size="20" font-weight="700">{code}</text>
<text x="{x + 66}" y="{y + 60}" fill="{s['sub']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15">{sub}</text>
<text x="{x + 66}" y="{y + 80}" fill="{s['faint']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12.5">{desc}</text>
<line x1="38" y1="{y + 46}" x2="{x}" y2="{y + 46}" stroke="{s['accent']}" stroke-width="1.6" opacity=".35"/>''')
    p.append(f'''<path d="M510 432 L690 432" stroke="{s['accent2']}" stroke-width="2.6" fill="none" marker-end="url(#arr)"/>
<text x="512" y="418" fill="{s['accent2']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13">verdict to</text>
<rect x="700" y="300" width="350" height="264" rx="20" fill="{s['card']}" stroke="{s['accent2']}" stroke-width="2.4" filter="url(#soft)"/>
<text x="726" y="334" fill="{s['accent2']}" font-family="ui-monospace, monospace" font-size="13" font-weight="700">dsh-standards</text>
<text x="726" y="366" fill="{s['text']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17">DSC-01...13 static checks</text>
<text x="726" y="394" fill="{s['text']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17">L1-L3 runtime measurement</text>
<text x="726" y="422" fill="{s['text']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17">dsh-levels verdict</text>
<line x1="726" y1="444" x2="1024" y2="444" stroke="{s['grid']}" stroke-width="2"/>
<text x="726" y="470" fill="{s['sub']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13">certification, scoring, ranking: none of them here</text>
<text x="726" y="494" fill="{s['faint']}" font-family="ui-monospace, monospace" font-size="12">guide asks · standards decides</text>
<text x="726" y="530" fill="{s['accent']}" font-family="ui-monospace, monospace" font-size="12">ENTRY / FLOW / BOOST</text>
<rect x="50" y="560" width="1000" height="52" rx="14" fill="{s['zone']}" stroke="{s['edge']}"/>
<text x="74" y="582" fill="{s['accent']}" font-family="ui-monospace, monospace" font-size="12.5" font-weight="700">route / dsh-levels</text>
<text x="74" y="602" fill="{s['sub']}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13">every question has an owner: the guide says what to check, the verdict belongs to the checker</text>
</svg>''')
    with open(os.path.join(OUT, f'dsh-plugin-guide-flow-v4-{skin}.svg'), 'w',
              encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(p) + '\n')
    print(f'dsh-plugin-guide-flow-v4-{skin}.svg')


def main():
    os.makedirs(OUT, exist_ok=True)
    for skin in ('light', 'dark'):
        for lang in ('zh', 'en'):
            hero(lang, skin)
        flow_svg(skin)


if __name__ == '__main__':
    main()
