/* تصميم تجربة التعلم: الأنشطة التفاعلية
   ملف مشترك بين صفحة المشاركين (index.html) ولوحة المقدّمة (board.html).
   المحتوى في LXD.ACT، والاتصال في LXD.connect. */
(function(){
'use strict';
const L=window.LXD={};
const NS='http://www.w3.org/2000/svg';
const C={ink:'#1F2430',yel:'#FFD84D',mint:'#7FE0C2',pink:'#FF9FB4',sky:'#8FB9FF',id:'#3D6BF2',lxd:'#13B394',grey:'#9A9DA8',pen:'#2F5BEA',before:'#8A90A2'};
L.C=C;L.NS=NS;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
L.reduce=reduce;

/* ---------- المحتوى: التصويت الأول (قبل المحطة الأولى وبعدها) ----------
   الخيارات نفسها في المرتين، وبالحروف نفسها، حتى تصح المقارنة. */
L.ACT={
  id:'v1',
  opts:[
    {k:'a',l:'أ',name:'ترادف',ds:'اسمان مختلفان لشيء واحد',dg:'syn'},
    {k:'b',l:'ب',name:'تطور',ds:'الجديد امتداد طبيعي للقديم',dg:'evo'},
    {k:'c',l:'ج',name:'احتواء',ds:'فلسفة تعمل داخل التصميم التعليمي',dg:'con'},
    {k:'d',l:'د',name:'تكامل',ds:'مجالان مختلفان يكمل أحدهما الآخر',dg:'int'},
    {k:'e',l:'هـ',name:'استقلال',ds:'مجال جديد قائم بذاته',dg:'ind'}
  ],
  rounds:{
    pre:{id:'v1-pre',n:1,tab:'التصويت الأول',when:'قبل المحطة الأولى',kick:'سؤال قبل أن نبدأ',
      q:'ما علاقة تصميم تجربة التعلم (<bdi dir="ltr">LXD</bdi>) بالتصميم التعليمي (<bdi dir="ltr">ID</bdi>) في رأيك؟',
      lead:'اختر إجابة واحدة بناءً على ما تعرفه'},
    post:{id:'v1-post',n:2,tab:'التصويت الثاني',when:'بعد المحطة الأولى',kick:'سؤال نعود إليه',
      q:'عدنا إلى السؤال: هل تغيّر رأيك؟',
      lead:'ما علاقة تصميم تجربة التعلم بالتصميم التعليمي في رأيك الآن؟'}
  }
};
L.opt=k=>L.ACT.opts.find(o=>o.k===k)||null;
L.roundOf=act=>act===L.ACT.rounds.pre.id?'pre':act===L.ACT.rounds.post.id?'post':null;

/* ---------- أيقونات ---------- */
const IC={
  check:'<path d="M5 12l5 5l10 -10"/>',
  x:'<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>',
  eye:'<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>',
  eyeoff:'<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"/><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"/><path d="M3 3l18 18"/>',
  qr:'<path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M7 17v.01"/><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M7 7v.01"/><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M17 7v.01"/><path d="M14 14h3"/><path d="M20 14v.01"/><path d="M14 14v3"/><path d="M14 20h3"/><path d="M17 17h3"/><path d="M20 17v3"/>',
  phone:'<path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"/><path d="M11 4h2"/><path d="M12 17v.01"/>',
  users:'<path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>',
  lock:'<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M8 11v-4a4 4 0 1 1 8 0v4"/>',
  play:'<path d="M7 4v16l13 -8z"/>',
  stop:'<path d="M5 7a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>',
  dots:'<path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>',
  max:'<path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2 -2v-2"/>',
  trash:'<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>',
  copy:'<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>',
  flask:'<path d="M9 3l6 0"/><path d="M10 9l4 0"/><path d="M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6"/>',
  chat:'<path d="M8 9h8"/><path d="M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/>',
  wifi:'<path d="M12 18l.01 0"/><path d="M9.172 15.172a4 4 0 0 1 5.656 0"/><path d="M6.343 12.343a8 8 0 0 1 11.314 0"/><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"/>',
  refresh:'<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>',
  link:'<path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/>',
  arrowL:'<path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/>'
};
L.ic=(n,cls)=>`<svg class="ic${cls?' '+cls:''}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;
L.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- المتعلم (الشخصية نفسها في العرض) ---------- */
const limb=(cls,ox,oy,x2,y2,inner)=>`<g class="p ${cls}" style="transform-origin:${ox}px ${oy}px"><line class="ln" x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}"/>${inner||''}</g>`;
const HAND=y=>`<ellipse class="ln fill" cx="70" cy="${y}" rx="4.6" ry="6.6"/>`,FOOT='<ellipse class="ln fill" cx="78" cy="293" rx="10.5" ry="4"/>';
const HAIR='<path class="fln hair" d="M60 18 q2 -7 7 -9 M65 15 q3 -7 10 -8 M72 15 q5 -6 12 -5 M79 17 q5 -4 11 -1"/>';
const QM='<g class="qm"><text x="102" y="20" font-size="26" font-family="Kufi,sans-serif" font-weight="700" fill="#1F2430">؟</text><text x="119" y="4" font-size="17" font-family="Kufi,sans-serif" font-weight="700" fill="#1F2430">؟</text></g>';
const EYES=(dx,dy,ry)=>`<ellipse class="dotf" cx="${76.5+dx}" cy="${33+dy}" rx="2.9" ry="${ry||5.2}"/><ellipse class="dotf" cx="${86+dx}" cy="${33+dy}" rx="2.9" ry="${ry||5.2}"/>`;
const F=(b,e,m,x)=>`<g class="brow">${b}</g>${e}${m}${x||''}`;
const FACES={
 happy:F('',EYES(0,0),'<path class="fln" d="M60 52 Q76 63 96 44"/>'),
 think:F('<path class="fln" d="M73 22 Q77 18.5 81 19.5 M84 24.5 L90 24"/>',EYES(1.5,-2.5,4.8),'<path class="fln" d="M73 55 q4 -2 8 0 q3 1.6 6 -0.4"/>'),
 thinko:F('<path class="fln" d="M73 22 Q77 18.5 81 19.5 M84 24.5 L90 24"/>',EYES(1.5,-2.5,4.8),'<ellipse class="ln fill" style="stroke-width:2.4" cx="81" cy="55" rx="3.6" ry="4.4"/>'),
 fthink:F('<path class="fln" d="M56 23 Q60 20 65 21.5 M74 22 L81 21"/>','<ellipse class="dotf" cx="61" cy="31" rx="2.9" ry="4.8"/><ellipse class="dotf" cx="76" cy="31" rx="2.9" ry="4.8"/>','<path class="fln" d="M62 55 q3.5 -2 7 0 q3 1.6 6 -0.4"/>'),
 ftalk:F('','<ellipse class="dotf" cx="62.5" cy="33" rx="2.9" ry="5.2"/><ellipse class="dotf" cx="77.5" cy="33" rx="2.9" ry="5.2"/>','<path class="ln fill" style="stroke-width:2.6" d="M59 48.5 Q70 51 81 48.5 Q78 61 70 61 Q62 61 59 48.5 Z"/>'),
 read:F('<path class="fln" d="M75 23.5 L81.5 23 M85.5 23 L92 24"/>',EYES(3,-1,4.6),'<ellipse class="ln fill mth" style="stroke-width:2.2" cx="83" cy="55" rx="3.3" ry="3.6"/>'),
 readc:F('<path class="fln" d="M75 23.5 L81.5 23 M85.5 23 L92 24"/>',EYES(3,-1,4.6),'<path class="fln" d="M77 55.5 Q83 57.5 89 55"/>'),
 puzzled:F('<path class="fln" d="M72 21.5 Q76 18 80.5 19 M84.5 25.5 L91 24"/>',EYES(0,0,4.8),'<path class="fln" d="M68 55 q3.5 -2.6 7 0 q3.5 2.6 7 0 q3 -2 6 -0.6"/>'),
 angry:F('<path class="fln" style="stroke-width:3.6" d="M71 23 L80 28.5 M93 23.5 L85 28.5"/>',EYES(0,1,3.4),'<path class="fln" d="M66 58 Q78 50 92 55"/>','<path class="vein" d="M99 8 l1.5 8 M105 7 l-1 8 M97.5 11.5 l10 -1.5 M98 15.5 l10 -1.5"/>'),
 shock:F('<path class="fln" d="M71 20 Q75 16 80 17 M83 17 Q88 16 92 20"/>',EYES(0,0,6.4),'<ellipse class="ln fill" style="stroke-width:2.8" cx="80" cy="56" rx="6" ry="7.5"/>','<path class="fln" d="M36 30 l-9 -4 M39 15 l-7 -7 M106 33 l9 -2 M104 17 l7 -7"/>'),
 scared:F('<path class="fln" d="M72 23 L80 20 M84 20 L92 23"/>','<ellipse class="ln fill" style="stroke-width:2.4" cx="76.5" cy="33" rx="4.4" ry="6.2"/><ellipse class="ln fill" style="stroke-width:2.4" cx="88" cy="33" rx="4.4" ry="6.2"/><circle class="dotf" cx="78" cy="34" r="2"/><circle class="dotf" cx="89.5" cy="34" r="2"/>','<path class="ln fill" style="stroke-width:2.4" d="M66 52 h24 v7 h-24 Z M72 52 v7 M78 52 v7 M84 52 v7"/>','<path class="fln" style="stroke-width:2.2" d="M33 40 q-5 4 0 8 M28 36 q-7 8 0 16 M107 40 q5 4 0 8"/>'),
 focus:F('<path class="fln" d="M73 25 L79.5 24.5 M84 24.5 L90.5 25"/>',EYES(0,4,3.6),'<path class="fln" d="M70 55 Q78 59 87 55.5"/><ellipse fill="#FF8FA3" cx="83.5" cy="57.6" rx="2.2" ry="1.8"/>'),
 front:F('','<ellipse class="dotf" cx="62.5" cy="34" rx="2.9" ry="5.2"/><ellipse class="dotf" cx="77.5" cy="34" rx="2.9" ry="5.2"/>','<path class="fln" d="M55 50 Q70 63 85 50"/>'),
 strain:F('<path class="fln" style="stroke-width:3.4" d="M71 25 L80 29 M93 25 L85 29"/>','<path class="fln" style="stroke-width:3" d="M73.5 30.5 l5 3 l-5 3 M90 30.5 l-5 3 l5 3"/>','<path class="ln fill" style="stroke-width:2.4" d="M66 51 h24 v7 h-24 Z M72 51 v7 M78 51 v7 M84 51 v7"/>','<path class="sweat" d="M101 19 q3.5 6 0 8 q-3.5 -2 0 -8 M108 31 q3 5 0 7 q-3 -2 0 -7"/>'),
 relief:F('<path class="fln" d="M73 23.5 Q77 21 81 22 M84 22 Q88 21 91 23.5"/>','<path class="fln" style="stroke-width:3" d="M73.5 34 q3 -4 6 0 M83 34 q3 -4 6 0"/>','<path class="fln" d="M64 51 Q78 62 93 47"/>','<path class="sweat" d="M101 19 q3.5 6 0 8 q-3.5 -2 0 -8"/>'),
 curious:F('<path class="fln" d="M56.5 22 Q61.5 17.5 67 20.5 M73 20.5 Q78.5 17.5 83.5 22"/>','<ellipse class="dotf" cx="62.5" cy="32" rx="2.9" ry="5.2"/><ellipse class="dotf" cx="77.5" cy="32" rx="2.9" ry="5.2"/>','<ellipse class="ln fill" style="stroke-width:2.6" cx="70" cy="52.5" rx="4.3" ry="5"/>'),
 smirk:F('<path class="fln" d="M73 23.5 Q77 22 81 23 M84 23 Q88 22 91 23.5"/>',EYES(0,0,4.8),'<path class="fln" d="M64 55 Q80 60 95 46"/>')
};
const PROPS='<g class="props write"><path class="ln" d="M120 150 h86 v90 h-86 Z"/><path class="fln" d="M128 148 h30 M131 145 h24"/><path class="ln" d="M36 116 q-6 30 6 56 M40 174 h56 M68 174 v42 M46 232 h46"/><circle class="ln fill" style="stroke-width:2.4" cx="48" cy="236" r="4"/><circle class="ln fill" style="stroke-width:2.4" cx="90" cy="236" r="4"/><path class="fln" d="M10 242 h205"/></g>';
function figMarkup(face){return `<g class="body">
 ${limb('lL',70,170,70,232,limb('sL',70,232,70,290,FOOT))}
 ${limb('lR',70,170,70,232,limb('sR',70,232,70,290,FOOT))}
 <line class="ln" x1="70" y1="70" x2="70" y2="170"/>
 <g class="tie"><path class="fln" d="M62 73 L70 79 L78 73"/><path class="dotf" d="M67.5 77 L72.5 77 L71.8 82 L68.2 82 Z"/><path class="dotf" d="M68.2 82 L71.8 82 L75 118 L70 126 L65 118 Z"/></g>
 <g class="xmarks"><path class="fln" style="stroke-width:2.2" d="M36 126 q-5 5 0 10 M104 126 q5 5 0 10"/></g>
 <g class="clip"><g transform="rotate(-12 112 149)"><rect class="ln fill" x="94" y="126" width="36" height="46" rx="3"/><path class="fln" style="stroke-width:2" d="M100 137 h24 M100 145 h19 M100 153 h22 M100 161 h13"/><rect class="ln fill" style="stroke-width:2.2" x="106" y="122" width="12" height="6" rx="2"/></g></g>
 ${limb('aL',70,88,70,136,limb('fL',70,136,70,180,HAND(186)))}
 ${limb('aR',70,88,70,136,limb('fR',70,136,70,180,'<g class="pen2"><path d="M73.5 180 L64 204" stroke="#1F2430" stroke-width="7" stroke-linecap="round"/><path d="M73.5 180 L64.6 202.5" stroke="#FFD84D" stroke-width="3.6" stroke-linecap="round"/><circle cx="63.6" cy="205" r="2.2" fill="#1F2430"/></g>'+HAND(186)+'<line class="ln pen" x1="73" y1="190" x2="66" y2="206"/>'))}
 <g class="p hd" style="transform-origin:70px 70px"><circle class="ln fill" cx="70" cy="42" r="28"/>${HAIR}<g class="face">${FACES[face]||FACES.happy}</g>${QM}<g class="qx"><text x="100" y="18" font-size="26" font-family="Kufi,sans-serif" font-weight="700" fill="#1F2430">؟</text><text x="117" y="6" font-size="24" font-family="Kufi,sans-serif" font-weight="700" fill="#1F2430">!</text><text x="30" y="10" font-size="20" font-family="Kufi,sans-serif" font-weight="700" fill="#1F2430">؟</text></g></g>
 <g class="marks"><path class="fln" style="stroke-width:2.4" d="M28 150 q-7 7 0 14 M20 144 q-9 10 0 22"/></g>
</g><g class="nprops"><g class="chair"><path class="ln" d="M36 116 q-6 30 6 56 M40 174 h56 M68 174 v42 M46 232 h46"/><circle class="ln fill" style="stroke-width:2.4" cx="48" cy="236" r="4"/><circle class="ln fill" style="stroke-width:2.4" cx="90" cy="236" r="4"/></g></g><g class="pdrop"><line class="ln" x1="186" y1="240" x2="210" y2="235"/></g><g class="speed"><path class="fln" style="stroke-width:2.4" d="M18 110 h-30 M10 140 h-38 M16 170 h-26 M8 205 h-34"/></g><g class="dust"><circle cx="112" cy="286" r="7"/><circle cx="128" cy="280" r="9"/><circle cx="146" cy="288" r="6"/><path class="fln" style="stroke-width:2.2" d="M30 297 h56 M40 301 h40"/></g>${PROPS}`}
const HAIRF='<path class="fln hair" d="M54 20 q3 -7 9 -8 M62 16 q4 -6 10 -6 M71 15 q5 -5 11 -2 M79 18 q4 -3 9 1"/>';
const ACC={
 hat:'<g class="acc"><ellipse class="ln fill" cx="70" cy="22" rx="37" ry="6.5"/><path class="ln fill" d="M49 22 Q46 -4 70 -6 Q94 -4 91 22 Q70 26 49 22 Z"/><path class="ln" style="stroke-width:2.6;fill:#FFD84D" d="M48.5 13 Q70 18 91.5 13 L91 21 Q70 25.5 49 21 Z"/></g>',
 phones:'<g class="acc"><path class="ln" style="stroke-width:5" d="M39.5 46 Q37 3 70 3 Q103 3 100.5 46"/><rect class="ln" style="fill:#7FE0C2" x="31" y="33" width="13" height="24" rx="5.5"/><rect class="ln" style="fill:#7FE0C2" x="96" y="33" width="13" height="24" rx="5.5"/></g>',
 glasses:'<g class="acc"><circle class="ln" style="stroke-width:2.6" cx="62" cy="33" r="8.2"/><circle class="ln" style="stroke-width:2.6" cx="78" cy="33" r="8.2"/><path class="fln" style="stroke-width:2.4" d="M70.2 32 Q70 29.5 69.8 32 M53.8 31.5 L43.5 28.5 M86.2 31.5 L96.5 28.5"/></g>'};
function setFace(svg,face){const g=svg.querySelector('.face');if(g)g.innerHTML=FACES[face]||FACES.happy;svg.dataset.face=face}

L.figSVG=(cls,face,w,h)=>`<svg class="fig ${cls||''}" data-face="${face||'happy'}" viewBox="0 0 140 300" ${w?`width="${w}" height="${h}"`:''} aria-hidden="true">${figMarkup(face||'happy')}</svg>`;
L.setFace=setFace;
L.setPose=(svg,pose,face)=>{if(!svg)return;svg.setAttribute('class','fig '+(pose||''));if(face&&svg.dataset.face!==face)setFace(svg,face)};
/* الحضور الصغار: رأس وجسم بخطوط اليد */
L.mini=(x,y,t,up)=>`<g transform="translate(${x} ${y})"><circle cx="0" cy="-26" r="7.5" fill="#fff" stroke="#1F2430" stroke-width="2.2" transform="rotate(${t} 0 -18)"/><path d="M0 -18 V6 M0 6 L-7 22 M0 6 L7 22 ${up?'M-9 -21 L0 -4 L9 -21':'M-9 -9 L0 -4 L9 -9'}" fill="none" stroke="#1F2430" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
/* ارتعاش الخطوط كما في العرض */
L.boil=function(){
  if(document.getElementById('boil'))return;
  document.body.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="boil" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence id="boilT" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="1.3" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
  if(!reduce){const t=document.getElementById('boilT');let n=1;setInterval(()=>{n=n%4+1;t.setAttribute('seed',n)},160)}
};

/* ---------- الرسم بخط اليد (rough.js) ---------- */
let seedN=11;
function seedOf(el){if(!el.dataset.seed)el.dataset.seed=seedN++;return +el.dataset.seed}
const base={stroke:C.ink,strokeWidth:2.2,roughness:1.35,bowing:1.1};
const NOTE={y:'#FFF5C9',s:'#E4EEFF',m:'#DAF6EC',p:'#FFE3EA'};
function sk(el){
  if(!el.isConnected||typeof rough==='undefined')return;
  const w=el.offsetWidth,h=el.offsetHeight;if(!w||!h)return;
  const key=el.dataset.sk+'|'+w+'x'+h;if(el._skKey===key)return;el._skKey=key;
  const old=el.querySelector(':scope>svg.rough');if(old)old.remove();
  const [kind,col]=el.dataset.sk.split(':'),pad=10;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','rough');svg.setAttribute('aria-hidden','true');
  svg.setAttribute('width',w+pad*2);svg.setAttribute('height',h+pad*2);svg.style.left=-pad+'px';svg.style.top=-pad+'px';
  const rc=rough.svg(svg),o={...base,seed:seedOf(el)};let n;
  if(kind==='note')n=rc.rectangle(pad,pad,w,h,{...o,fill:NOTE[col]||NOTE.y,fillStyle:'solid'});
  else if(kind==='box')n=rc.rectangle(pad,pad,w,h,{...o,fill:'#fff',fillStyle:'solid'});
  else if(kind==='mark')n=rc.rectangle(pad,pad+h*.5,w,h*.42,{...o,stroke:'none',fill:C[col],fillStyle:'hachure',hachureAngle:-12,hachureGap:3,fillWeight:6,roughness:1.6,bowing:.6});
  else if(kind==='pill')n=rc.rectangle(pad,pad,w,h,{...o,fill:C[col]||'#fff',fillStyle:'solid',strokeWidth:2,roughness:1.6});
  else if(kind==='dash')n=rc.rectangle(pad,pad,w,h,{...o,stroke:C.grey,strokeWidth:2,strokeLineDash:[9,9],roughness:1.1});
  else if(kind==='ink')n=rc.rectangle(pad,pad,w,h,{...o,fill:C.ink,fillStyle:'solid',roughness:1.1});
  else if(kind==='circle')n=rc.circle(pad+w/2,pad+h/2,w,{...o,fill:C[col]||'#fff',fillStyle:col?'hachure':'solid',hachureGap:4.5,fillWeight:2.6,strokeWidth:2.4});
  if(n)svg.appendChild(n);el.insertBefore(svg,el.firstChild);
}
L.sk=sk;
const ro=('ResizeObserver' in window)?new ResizeObserver(es=>es.forEach(e=>sk(e.target))):null;
L.draw=function(root){
  (root||document).querySelectorAll('[data-sk]').forEach(el=>{sk(el);if(ro&&!el._ro){el._ro=1;ro.observe(el)}});
  (root||document).querySelectorAll('[data-dg]').forEach(vdg);
};
L.restyle=(el,spec)=>{el.dataset.sk=spec;sk(el)};
L.rough=()=>typeof rough!=='undefined'?rough:null;
L.base=base;
function vdg(el){
  if(el.querySelector('svg'))return;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 180 80');svg.setAttribute('class','dgs');svg.setAttribute('aria-hidden','true');
  const rc=rough.svg(svg),o={...base,seed:seedOf(el),strokeWidth:2.2,roughness:1};
  const ID={...o,fill:'#AFC6FF',fillStyle:'solid'},LX={...o,fill:'#93E6CF',fillStyle:'solid'},thin={...o,strokeWidth:2};
  const add=n=>svg.appendChild(n);
  const t=(x,y,s,fs)=>{const e=document.createElementNS(NS,'text');e.setAttribute('x',x);e.setAttribute('y',y);e.setAttribute('text-anchor','middle');e.setAttribute('font-size',fs||13);e.setAttribute('font-weight','600');e.setAttribute('font-family','Plex Ar, sans-serif');e.setAttribute('fill','#1F2430');e.setAttribute('direction','ltr');e.textContent=s;svg.appendChild(e)};
  const head=(x,y,dx,dy)=>{const L=Math.hypot(dx,dy);dx/=L;dy/=L;[26,-26].forEach(a=>{const r=a*Math.PI/180,bx=-dx*Math.cos(r)+dy*Math.sin(r),by=-dx*Math.sin(r)-dy*Math.cos(r);add(rc.line(x,y,x+bx*8,y+by*8,thin))})};
  const pill=(x,y,s,st)=>{const w=s.length*9+16;add(rc.rectangle(x-w/2,y-10,w,20,{...st,strokeWidth:1.8}));t(x,y+4.5,s,12)};
  switch(el.dataset.dg){
    case'syn': /* two names, one thing */
      add(rc.circle(90,53,48,ID));add(rc.circle(90,53,48,{...o,stroke:'none',fill:'#3FC9A2',fillStyle:'hachure',hachureGap:4.5,fillWeight:1.6,hachureAngle:-45}));
      t(90,60,'=',22);pill(148,14,'ID',ID);pill(32,14,'LXD',LX);
      add(rc.curve([[146,25],[134,34],[115,42]],thin));head(115,42,-1,.45);
      add(rc.curve([[34,25],[46,34],[65,42]],thin));head(65,42,1,.45);break;
    case'evo': /* the old grows into the new */
      add(rc.circle(148,46,44,ID));t(148,50.5,'ID');
      add(rc.circle(36,42,60,LX));t(36,46.5,'LXD');
      add(rc.curve([[124,38],[100,20],[72,32]],thin));head(72,32,-1,.55);break;
    case'con': /* the new lives inside the old */
      add(rc.ellipse(90,40,170,74,ID));t(136,45,'ID',14);
      add(rc.circle(64,42,42,LX));t(64,46,'LXD',11.5);break;
    case'int': /* two fields that overlap */
      add(rc.circle(66,40,68,{...o,fill:'rgba(70,215,175,.5)',fillStyle:'solid'}));
      add(rc.circle(114,40,68,{...o,fill:'rgba(120,160,255,.5)',fillStyle:'solid'}));
      add(rc.path('M90 15.9A34 34 0 0 1 90 64.1A34 34 0 0 1 90 15.9Z',{...o,stroke:'none',fill:'#F5C400',fillStyle:'hachure',hachureGap:3.6,fillWeight:2,hachureAngle:-35}));
      t(134,44.5,'ID');t(46,44.5,'LXD');break;
    case'ind': /* two separate fields */
      add(rc.circle(146,40,54,ID));t(146,44.5,'ID');
      add(rc.circle(34,40,54,LX));t(34,44.5,'LXD');
      add(rc.line(90,6,90,74,{...o,stroke:C.grey,strokeWidth:2,strokeLineDash:[6,6],roughness:.6}));break;
  }
  el.appendChild(svg);
}

/* ---------- رمز QR بلون الحبر ---------- */
L.qrSVG=function(text,size){
  if(typeof qrcode==='undefined')return '';
  const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount();let d='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c} ${r}h1v1h-1z`;
  return `<svg viewBox="-2 -2 ${n+4} ${n+4}" width="${size}" height="${size}" role="img" aria-label="رمز الدخول إلى صفحة المشاركين" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n+4}" height="${n+4}" fill="#fff"/><path d="${d}" fill="#1F2430"/></svg>`;
};

/* ---------- الحساب: التوزيع والتحوّل ---------- */
L.tally=function(votes){
  const c={};L.ACT.opts.forEach(o=>c[o.k]=0);let n=0;
  Object.values(votes||{}).forEach(v=>{if(v&&c[v.o]!==undefined){c[v.o]++;n++}});
  return {c,n};
};
L.flows=function(pre,post){
  const M={};L.ACT.opts.forEach(a=>{M[a.k]={};L.ACT.opts.forEach(b=>M[a.k][b.k]=0)});
  let paired=0,changed=0;
  Object.keys(pre||{}).forEach(u=>{const a=pre[u]&&pre[u].o,b=post&&post[u]&&post[u].o;
    if(M[a]&&b&&M[a][b]!==undefined){M[a][b]++;paired++;if(a!==b)changed++}});
  const moves=[];L.ACT.opts.forEach(a=>L.ACT.opts.forEach(b=>{if(a.k!==b.k&&M[a.k][b.k])moves.push({a:a.k,b:b.k,n:M[a.k][b.k]})}));
  moves.sort((x,y)=>y.n-x.n);
  return {M,paired,changed,stayed:paired-changed,moves};
};
L.pct=(x,n)=>n?Math.round(x*100/n):0;

/* ---------- الاتصال ----------
   إن لم تُكتب إعدادات Firebase في config.js تعمل الصفحتان في «وضع التجربة»:
   البيانات تُحفظ في هذا المتصفح فقط، وتتزامن بين تبويباته. */
L.configured=function(){
  const c=window.LXD_FIREBASE||{};
  if(/[?&]demo=1/.test(location.search))return false;
  return !!(c.apiKey&&c.databaseURL);
};
L.connect=async function(){return L.configured()?live(window.LXD_FIREBASE):demo()};

function demo(){
  const K='lxd-demo:';
  const mem={};
  const get=(k,d)=>{let s=null;try{s=localStorage.getItem(K+k)}catch(e){s=mem[k]||null}try{return s?JSON.parse(s):d}catch(e){return d}};
  const put=(k,v)=>{const s=JSON.stringify(v);try{localStorage.setItem(K+k,s)}catch(e){mem[k]=s}ping()};
  let uid=null;try{uid=sessionStorage.getItem(K+'uid')}catch(e){}
  if(!uid){uid='d'+Math.random().toString(36).slice(2,10);try{sessionStorage.setItem(K+'uid',uid)}catch(e){}}
  const subs=new Set();
  let bc=null;try{bc=new BroadcastChannel('lxd-demo')}catch(e){}
  const fire=()=>subs.forEach(f=>f());
  function ping(){fire();if(bc)try{bc.postMessage(1)}catch(e){}}
  if(bc)bc.onmessage=fire;
  addEventListener('storage',e=>{if(!e.key||e.key.startsWith(K))fire()});
  const watch=(read,cb)=>{let last;const f=()=>{const v=read(),j=JSON.stringify(v);if(j!==last){last=j;cb(v)}};subs.add(f);f();return()=>subs.delete(f)};
  const S={
    mode:'demo',uid,
    onConn:cb=>cb(true),
    onLive:cb=>watch(()=>get('live',null),cb),
    vote:async(act,o)=>{const lv=get('live',null);if(!lv||lv.act!==act||!lv.open)throw new Error('closed');
      const v=get('votes',{});(v[act]=v[act]||{})[uid]={o,t:Date.now()};put('votes',v)},
    onMine:(act,cb)=>watch(()=>{const v=get('votes',{});return v[act]&&v[act][uid]?v[act][uid].o:null},cb),
    here(){const beat=()=>{const h=get('here',{});h[uid]=Date.now();put('here',h)};beat();setInterval(beat,5000);
      addEventListener('pagehide',()=>{const h=get('here',{});delete h[uid];put('here',h)})},
    admin:async()=>true,
    onVotes:(act,cb)=>watch(()=>get('votes',{})[act]||{},cb),
    onHere:cb=>{const read=()=>{const h=get('here',{}),now=Date.now();return Object.values(h).filter(t=>now-t<12000).length};
      const off=watch(read,cb);setInterval(()=>cb(read()),5000);return off},
    setLive:async(act,open)=>put('live',{act,open,at:Date.now()}),
    clear:async()=>{put('votes',{});put('live',{act:'none',open:false,at:Date.now()})},
    /* أصوات تجريبية لمعاينة المقارنة */
    seed(){
      const R=L.ACT.rounds,ks=L.ACT.opts.map(o=>o.k);
      const pick=w=>{let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return ks[i]}return ks[ks.length-1]};
      const v=get('votes',{}),pre=v[R.pre.id]=v[R.pre.id]||{},post=v[R.post.id]=v[R.post.id]||{};
      const shift={a:[2,1,3,4,1],b:[0,4,3,3,1],c:[0,1,6,3,0],d:[0,0,1,8,1],e:[0,1,1,4,4]};
      for(let i=0;i<18;i++){const u='s'+i+Math.random().toString(36).slice(2,6),a=pick([3,5,4,3,2]);
        if(i<17)pre[u]={o:a,t:Date.now()};if(i>1)post[u]={o:i<17?pick(shift[a]):pick([1,1,2,3,1]),t:Date.now()}}
      put('votes',v);
    }
  };
  return S;
}

async function live(cfg){
  const fb=await import('./lib/firebase.js');
  const app=fb.initializeApp(cfg);
  const auth=fb.getAuth(app),db=fb.getDatabase(app);
  await auth.authStateReady();
  const user=auth.currentUser||(await fb.signInAnonymously(auth)).user;
  let uid=user.uid; const R=p=>fb.ref(db,p==='.info/connected'?p:'lxd/'+p);
  const sub=(p,cb,err)=>fb.onValue(R(p),s=>cb(s.val()),e=>{if(err)err(e);else console.warn(p,e)});
  return {
    mode:'live',get uid(){return uid},
    onConn:cb=>sub('.info/connected',v=>cb(!!v)),
    onLive:(cb,err)=>sub('live',v=>cb(v||null),err),
    vote:(act,o)=>fb.set(R('votes/'+act+'/'+uid),{o,t:fb.serverTimestamp()}),
    onMine:(act,cb)=>sub('votes/'+act+'/'+uid,v=>cb(v&&v.o||null)),
    here(){const r=R('here/'+uid);sub('.info/connected',v=>{if(v)fb.onDisconnect(r).remove().then(()=>fb.set(r,true)).catch(()=>{})})},
    admin:async interactive=>{
      if(interactive){
        const provider=new fb.GoogleAuthProvider();
        const result=await fb.signInWithPopup(auth,provider);
        uid=result.user.uid;
      }
      try{await fb.get(R('access'));return true}catch(e){return false}
    },
    onVotes:(act,cb,err)=>sub('votes/'+act,v=>cb(v||{}),err),
    onHere:(cb,err)=>sub('here',v=>cb(v?Object.keys(v).length:0),err),
    setLive:(act,open)=>fb.set(R('live'),{act,open,at:fb.serverTimestamp()}),
    clear:async()=>{await fb.set(R('live'),{act:'none',open:false,at:fb.serverTimestamp()});const snapshot=await fb.get(R('votes'));const patch={votes:null,live:{act:'none',open:false,at:fb.serverTimestamp()}};if(snapshot.exists())patch['archives/'+Date.now()]=snapshot.val();await fb.update(R(''),patch)}
  };
}
})();
