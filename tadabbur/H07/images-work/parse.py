import re,json
T=open('../H07-TEXT-R03.md',encoding='utf-8').read()
A=T[T.index('## ١. وصف الحزب'):T.index('## ٤.')]
desc=A[A.index('## ١.'):A.index('## ٢.')]
desc_paras=[l for l in desc.split('\n')[1:] if l.strip()]
mp=A[A.index('## ٢.'):A.index('## ٣.')]
rows=[[c.strip() for c in l.strip('|').split('|')] for l in mp.split('\n') if l.startswith('| ') and not l.startswith('| المحطة')]
body=A[A.index('## ٣.'):]
stations=[];cur=None;card=None;sec=None;summ=[]
insum=False
for raw in body.split('\n'):
    l=raw.rstrip()
    if not l or l=='---': continue
    if l.startswith('### شرائح خلاصة'): insum=True; continue
    if insum:
        m=re.match(r'\*\*(H07-S\S+) — (.+)\*\*$',l)
        if m: summ.append(dict(id=m.group(1),title=m.group(2),lines=[])); continue
        if l.startswith('- '): summ[-1]['lines'].append(l[2:]); continue
        raise SystemExit('unparsed summary '+l)
    m=re.match(r'### المحطة (\S+): (.+)$',l)
    if m: cur=dict(n=m.group(1),title=m.group(2),cards=[]); stations.append(cur); sec='opening'; continue
    if l.startswith('## ٣.'): continue
    m=re.match(r'\*\*افتتاحية المحطة\*\* — الآيات (.+)$',l)
    if m: cur['verses']=m.group(1); continue
    m=re.match(r'\*\*سؤال المحطة:\*\* (.+)$',l)
    if m: cur['q']=m.group(1); continue
    m=re.match(r'#### (H07-C\d+) — (.+)$',l)
    if m: card=dict(id=m.group(1),title=m.group(2),quran=[],context=[],tafsir=[],tadabbur=[]); cur['cards'].append(card); sec=None; continue
    if sec=='opening' and card is None or (sec=='opening' and card not in cur['cards']):
        cur['opening']=l; continue
    m=re.match(r'\*\*السورة والآيات:\*\* (.+)$',l)
    if m: card['ref']=m.group(1); continue
    if l=='**القرآن الكريم**': sec='quran'; continue
    if l=='**تفسير السعدي**': sec='tafsir'; continue
    if l=='**تدبر الفؤاد**': sec='tadabbur'; continue
    m=re.match(r'\*\*سؤال للتأمل:\*\* (.+)$',l)
    if m: card['question']=m.group(1); sec=None; continue
    if l=='*للسياق التفسيري فقط (خارج تغطية H07):*': sec='context'; card['context_note']=l.strip('*'); continue
    m=re.match(r'<sub>(.+)</sub>$',l)
    if m: card['source']=m.group(1); continue
    if sec=='quran': card['quran'].append(l); continue
    if sec=='context': card['context'].append(l); continue
    if sec=='tafsir':
        if l.startswith('*[عنوان فرعي'): card['tafsir'].append({'k':'subhead','t':'نقل عن ابن القيم أورده السعدي'}); continue
        if l.startswith('*[نهاية النقل'): card['tafsir'].append({'k':'endquote','t':'نهاية النقل عن ابن القيّم'}); continue
        if l.startswith('*') and l.endswith('*'): card['tafsir'].append({'k':'note','t':l.strip('*')}); continue
        card['tafsir'].append({'k':'verse' if ' ... ' in l else 'p','t':l}); continue
    if sec=='tadabbur': card['tadabbur'].append(l); continue
    raise SystemExit('unparsed: '+l[:80])
for st in stations: st.pop('verses_',None)
data=dict(desc=desc_paras,map=rows,stations=stations,summaries=summ)
json.dump(data,open('content_R03.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(stations),sum(len(s['cards']) for s in stations),len(summ),len(rows))
for s in stations: print(s['n'],s['title'],s.get('verses'),bool(s.get('opening')),bool(s.get('q')),[c['id'] for c in s['cards']][:2])
c3=stations[0]['cards'][2]; print([x['k'] for x in c3['tafsir']])
print(stations[8]['cards'][2]['context'], stations[8]['cards'][2].get('context_note'))
