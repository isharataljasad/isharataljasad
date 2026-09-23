import sys
from PIL import Image
out=sys.argv[1]; files=sys.argv[2:]; w=360; h=640; cols=min(5,len(files)); rows=(len(files)+cols-1)//cols
S=Image.new('RGB',(cols*w+(cols-1)*8,rows*h+(rows-1)*8),'#888')
for i,f in enumerate(files):
    im=Image.open(f).resize((w,h)); S.paste(im,((cols-1-i%cols)*(w+8),(i//cols)*(h+8)))
S.save(out)
