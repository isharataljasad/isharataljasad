import json,hashlib,csv,re,collections
R='images-R04/'
m=json.load(open(R+'manifest.json')); C=json.load(open('images-work/content_R03.json'))
cards={c['id']:(st,c) for st in C['stations'] for c in st['cards']}
stn={f"H07-ST{i+1:02d}":st for i,st in enumerate(C['stations'])}
SEC={'quran':'القرآن الكريم','context':'سياق','tafsir':'تفسير السعدي','tadabbur':'تدبر الفؤاد','open':'افتتاحية المحطة','sq':'سؤال المحطة','desc':'وصف الحزب','sum':'خلاصة'}
NEG={'لا','لن','لم','لما','ما','ليس','ليست','غير','إلا','ولا','ولن','ولم','وما','فلا','فلن','فلم','فما'}
ar=lambda n:str(n).translate(str.maketrans('0123456789','٠١٢٣٤٥٦٧٨٩'))
rows=[];issues=[]
for p in m['pages']:
    f=p['file']; h=hashlib.sha256(open(R+f,'rb').read()).hexdigest()[:12]
    segs=[]
    for it in p.get('items',[]):
        s=it['seg']; lab=SEC.get(s,'خريطة المحطات' if s.startswith('map') else s)
        if it['k']=='question': lab='سؤال للتأمل'
        if lab not in segs: segs.append(lab)
        if it['split']=='head':
            w=re.sub('[ً-ْٰ]','',it['tail'].split()[-1])
            if w in NEG: issues.append(f"{f}: break after negation «{w}»")
    items=p.get('items',[])
    if items and all(i['k']=='question' for i in items): issues.append(f"{f}: question alone")
    st,c=cards.get(p['id'],(None,None))
    verses=c['ref'] if c else (stn[p['folder']]['verses'] if p['folder'] in stn else '')
    title=c['title'] if c else ''
    rows.append(dict(file=f,id=p['id'],part=f"{p['part']}/{p['of']}",folder=p['folder'],
        station_page=f"{p['stationPage']}/{p['stationTotal']}",l2=p['l2'],verses=verses,title=title,
        sections=' + '.join(segs),sha256_12=h))
# numbering sequence per folder
byf=collections.defaultdict(list)
for r in rows: byf[r['folder']].append(r)
for fo,rs in byf.items():
    tot=len(rs)
    for i,r in enumerate(rs,1):
        if r['station_page']!=f"{i}/{tot}": issues.append(f"{r['file']}: numbering {r['station_page']} expected {i}/{tot}")
# station ranges in l2
for fo,st in stn.items():
    rng=re.sub(r'\s*\(.*\)\s*','',st['verses'])
    for r in byf[fo]:
        if r['l2']!=f"المحطة {st['n']} من ٩ · آل عمران {rng}": issues.append(f"{r['file']}: l2 {r['l2']}")
for r in byf['H07-00-INTRO']:
    if r['l2']!='مقدمة الحزب': issues.append(r['file']+' l2')
for r in byf['H07-SUMMARY']:
    if r['l2']!='خلاصة المسار التدبري': issues.append(r['file']+' l2')
# all cards present
for cid in cards:
    if not any(r['id']==cid for r in rows): issues.append('missing '+cid)
with open('H07-IMAGES-R04-INDEX.csv','w',encoding='utf-8-sig',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
counts=collections.OrderedDict((fo,len(rs)) for fo,rs in byf.items())
json.dump({'counts':counts,'total':len(rows),'issues':issues},open('images-work/index_r04_summary.json','w'),ensure_ascii=False,indent=1)
md=['# فهرس صور الحزب السابع — الإصدار R04','',f'إجمالي الصور: **{len(rows)}** (PNG ‏1080×1920).','','## عدد الصور الفعلي لكل مجلد','','| المجلد | النطاق | عدد الصور |','|---|---|---|']
for fo,n in counts.items():
    rng=('آل عمران '+re.sub(r'\s*\(.*\)\s*','',stn[fo]['verses'])) if fo in stn else ('مقدمة الحزب' if 'INTRO' in fo else 'خلاصة المسار التدبري')
    md.append(f'| {fo} | {rng} | {n} |')
md+=['',f'| المجموع | | {len(rows)} |','','## الصور','','| الملف | المعرّف | الجزء | ترقيم المحطة | الآيات | العنوان | الأقسام |','|---|---|---|---|---|---|---|']
for r in rows: md.append(f"| {r['file']} | {r['id']} | {r['part']} | {r['station_page']} | {r['verses']} | {r['title']} | {r['sections']} |")
open('H07-IMAGES-R04-INDEX.md','w').write('\n'.join(md)+'\n')
print(counts,len(rows)); print('issues',issues)
