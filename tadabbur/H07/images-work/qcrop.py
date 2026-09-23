import json,glob,os
from PIL import Image, ImageDraw
m=json.load(open('manifest.json'))
os.makedirs('qcheck',exist_ok=True)
for f in glob.glob('qcheck/*.png'): os.remove(f)
pages=[x for x in m if any(i['seg'] in('quran','context') for i in x['items'])]
for x in pages:
    im=Image.open('out/'+x['file']).convert('RGB')
    def gold(y,c=(0xb0,0x8a,0x48)): p=im.getpixel((1015,y)); return all(abs(p[i]-c[i])<30 for i in range(3))
    ys=[y for y in range(300,1900) if gold(y)]
    y0,y1=min(ys),max(ys)
    if x['id']=='H07-C040':
        ys2=[y for y in range(y1,1900) if gold(y,(0xc9,0xb5,0x8c))]
        if ys2: y1=max(ys2)
    im.crop((60,y0,1020,y1)).save(f"qcheck/{x['id']}.png")
ids=sorted(glob.glob('qcheck/H07-C*.png')); groups=[];cur=[];h=0
for f in ids:
    H=Image.open(f).height+30
    if cur and h+H>1500: groups.append(cur); cur=[]; h=0
    cur.append(f); h+=H
groups.append(cur)
for gi,g in enumerate(groups):
    ims=[Image.open(f) for f in g]; H=sum(i.height+30 for i in ims)
    S=Image.new('RGB',(960,H),'white'); y=0; d=ImageDraw.Draw(S)
    for f,i in zip(g,ims):
        d.rectangle((0,y,960,y+28),fill='#ccc'); d.text((10,y+8),f.split('/')[-1],fill='black'); S.paste(i,(0,y+30)); y+=i.height+30
    S.save(f'qcheck/G{gi:02d}.png'); print(gi,[f.split('/')[-1][4:8] for f in g])
