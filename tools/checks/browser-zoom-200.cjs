const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const Z=__dirname, BASE='https://www.isharataljasad.com';
const pages=[['entrance','/'],['math-derivative','/semester-1/math/derivative#formulas'],['physics-motion','/semester-1/physics/motion#formulas'],['chemistry-bonding','/semester-1/chemistry/bonding#idea'],['english-eng11','/semester-1/english/describe-a-chart-with-an-overview-and-accurate-comparisons#idea']];
(async()=>{
  const ctx=await chromium.launchPersistentContext(Z+'/profile2',{headless:false,executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',viewport:null,args:['--window-size=1280,900',`--disable-extensions-except=${Z}/ext`,`--load-extension=${Z}/ext`]});
  let [sw]=ctx.serviceWorkers(); if(!sw) sw=await ctx.waitForEvent('serviceworker');
  const page=ctx.pages()[0]||await ctx.newPage();
  const out=[];
  for(const [name,url] of pages){
    await page.goto(BASE+url,{waitUntil:'load'});
    const before=await page.evaluate(()=>({w:innerWidth,dpr:devicePixelRatio}));
    const zoom=await sw.evaluate(async()=>{const [t]=await chrome.tabs.query({active:true});await chrome.tabs.setZoom(t.id,2.0);return chrome.tabs.getZoom(t.id);});
    await page.waitForFunction(w=>innerWidth<w*0.6,before.w);
    await page.evaluate(async()=>{await document.fonts.ready});
    if(name.startsWith('english')||name==='physics-motion'){await page.evaluate(()=>{const d=document.querySelector('details.feedback');if(d)d.open=true;});}
    const m=await page.evaluate(()=>{const de=document.documentElement;const clipped=[];
      for(const el of document.querySelectorAll('main p, main li, main h1, main h2, main h3, main .button, main summary, main label, main td, main th, main .formula, .site-header nav a')){const r=el.getBoundingClientRect(); if(r.width>0 && (r.right>de.clientWidth+1||r.left<-1)) clipped.push(el.tagName+':'+(el.innerText||'').slice(0,30));}
      const wide=[...document.querySelectorAll('.table-wrap')].filter(t=>t.scrollWidth>t.clientWidth).length;
      return {innerWidth:innerWidth,dpr:devicePixelRatio,overflow:de.scrollWidth-de.clientWidth,clipped:clipped.slice(0,5),tablesScrollingInside:wide,bodyFont:getComputedStyle(document.querySelector('main p')||document.body).fontSize};});
    const cdp=await ctx.newCDPSession(page); const shot=await cdp.send('Page.captureScreenshot',{format:'png'}); require('fs').writeFileSync(`${Z}/shots2/zoom200-${name}.png`,Buffer.from(shot.data,'base64'));
    const nav=await page.evaluate(()=>[...document.querySelectorAll('.site-header nav a')].map(a=>{const r=a.getBoundingClientRect();return [a.innerText,Math.round(r.left),Math.round(r.right),Math.round(r.top)]}));
    if(name==='physics-motion'){await page.evaluate(()=>document.querySelector('details.feedback').scrollIntoView());await page.waitForTimeout(300);const s2=await cdp.send('Page.captureScreenshot',{format:'png'});require('fs').writeFileSync(`${Z}/shots2/zoom200-feedback-form.png`,Buffer.from(s2.data,'base64'));}
    if(name==='entrance'){await page.keyboard.press('Tab');await page.keyboard.press('Tab');}
    const reset=await sw.evaluate(async()=>{const [t]=await chrome.tabs.query({active:true});await chrome.tabs.setZoom(t.id,1.0);return chrome.tabs.getZoom(t.id);});
    out.push({name,zoomReported:zoom,innerWidth:m.innerWidth,dpr:m.dpr,overflow:m.overflow,clipped:m.clipped,tablesScrollingInside:m.tablesScrollingInside,nav,restoredZoom:reset});
  }
  for(const o of out)console.log(JSON.stringify(o));
  await ctx.close();
})().catch(e=>{console.error(e);process.exit(1);});
