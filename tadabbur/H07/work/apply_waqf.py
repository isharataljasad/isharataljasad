import json,collections
exec(open('waqf_overrides.py').read())
q={int(k):v for k,v in json.load(open('qwaqf.json')).items()}
M='ۖۗۚ'
def base(s): return ''.join(c for c in s if 'ء'<=c<='ي' or c=='ٱ')
log=[]
for v,word,act,mark,ev in OV:
    w=q[v].split(' ')
    idx=[i for i,x in enumerate(w) if base(x)==base(word)]
    if v==107: idx=[i for i in idx if i>0 and base(w[i-1])==base('رَحْمَةِ')]
    assert len(idx)==1,(v,word,idx)
    i=idx[0]
    if act=='set':
        assert i+1<len(w) and w[i+1] in M,(v,word); old=w[i+1]; w[i+1]=mark
    else:
        assert not(i+1<len(w) and w[i+1] in M),(v,word); old='—'; w.insert(i+1,mark)
    q[v]=' '.join(w); log.append((v,w[i],old,mark,ev))
json.dump(q,open('q_final.json','w'),ensure_ascii=False,indent=0)
json.dump(log,open('waqf_log.json','w'),ensure_ascii=False)
tz={}
for l in open('q.txt'):
    s,a,t=l.rstrip('\n').split('|',2); tz[int(a)]=t
bad=[i for i in range(92,172) if ''.join(c for c in q[i] if c not in M+'۞ ')!=tz[i].replace(' ','')]
print('letter-diff verses vs R01:',bad)
print(collections.Counter(c for i in range(92,172) for c in q[i] if c in M+'۞'))
for l in log: print(l[:4])
