"""One-off notation repair for the preserved collection units (run once, reviewed).
Writes subscripts in chemical formulas and physical symbols (H2O → H₂O, P1 → P₁)
and superscript charges (Ba2+ → Ba²⁺, NO3− → NO₃⁻) in text nodes only."""
import json, re, sys
SUB = str.maketrans('0123456789', '₀₁₂₃₄₅₆₇₈₉')
SUP = str.maketrans('0123456789+−-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁻')
TOKEN = re.compile(r'(?<![A-Za-z_.#])((?:[A-Z][a-z]?\d*|\((?:[A-Z][a-z]?\d*)+\)\d*)+)(\d*[+−](?![\dA-Za-z]))?')
def fix_token(m):
    body, charge = m.group(1), m.group(2) or ''
    if not re.search(r'\d', body) and not charge:
        return m.group(0)
    elements = re.findall(r'[A-Z][a-z]?', body)
    if charge and len(elements) == 1 and re.fullmatch(r'[A-Z][a-z]?\d+', body) and not charge[:-1]:
        # Monatomic ion such as Ba2+: the digit is the charge.
        sym, digits = re.match(r'([A-Z][a-z]?)(\d+)', body).groups()
        return sym + (digits + charge[-1]).translate(SUP)
    out = re.sub(r'(?<=[A-Za-z)])(\d+)', lambda d: d.group(1).translate(SUB), body)
    return out + charge.translate(SUP) if charge else out
def fix_text(t):
    t = TOKEN.sub(fix_token, t)
    t = re.sub(r'\](\d*)([+−])(?![\dA-Za-z])', lambda m: ']' + (m.group(1) + m.group(2)).translate(SUP), t)  # complex-ion charge
    return re.sub(r'(?<=[A-Za-z₀-₉)\]])([⁰¹²³⁴⁵⁶⁷⁸⁹])([+−])(?![\dA-Za-z])', lambda m: m.group(1) + m.group(2).translate(SUP), t)  # SO₄²− → SO₄²⁻
def fix_html(h):
    return re.sub(r'(>)([^<]+)(<)', lambda m: m.group(1) + fix_text(m.group(2)) + m.group(3), h)
if __name__ == '__main__':
    p = 'tools/data/study-library.json'
    L = json.load(open(p, encoding='utf-8'))
    changes = []
    for c in ('chemistry', 'phy101'):
        for r in L[c]:
            for u in L[c][r]['units']:
                for l in u['lessons']:
                    new = fix_html(l['html'])
                    if new != l['html']:
                        for a, b in zip(re.findall(r'>([^<]+)<', l['html']), re.findall(r'>([^<]+)<', new)):
                            if a != b: changes.append(f'{c}/{r}/{l["id"]}: {a.strip()[:90]}  →  {b.strip()[:90]}')
                        l['html'] = new
    print('\n'.join(changes))
    if '--write' in sys.argv:
        json.dump(L, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
