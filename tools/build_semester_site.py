"""Build a curriculum-first Semester 1 above the independently retained sources.

BAYT_GUARD — اقرأ قبل إعادة التشغيل.

هذا المولّد يعيد كتابة صفحات المواضيع الستة والعشرين من الصفر، فيمحو أقسام
بيت الفؤاد المدمجة فيها: الفهرس والأهداف والحدود والمتطلبات والشرح المرجعي
والرسم والجدول والشرح المتدرّج وأنماط الأسئلة. وهو يحتاج بايثون و lxml،
وكلاهما غير متاح على جهاز التطوير الحالي (سبتمبر 2026).

الترتيب الصحيح إن احتجت تشغيله:

    python tools/build_semester_site.py --i-will-rebuild-lessons
    node tools/connect-foundations.mjs
    node tools/connect-program.mjs
    node tools/build-semester-lessons.mjs   ← يعيد دروس بيت الفؤاد
    npm test

وبدون العَلَم يتوقف البناء، حمايةً من محو الدروس بلا قصد.
"""
import sys

if '--i-will-rebuild-lessons' not in sys.argv:
    sys.exit(
        'توقف: إعادة البناء تمحو دروس بيت الفؤاد من صفحات المواضيع. '
        'اقرأ التعليق أعلى هذا الملف، ثم أعد التشغيل مع --i-will-rebuild-lessons '
        'وأتبعه بـ node tools/build-semester-lessons.mjs'
    )

from pathlib import Path
from html import escape
import json
from copy import deepcopy
from lxml import html
from semester_curriculum import COURSES, FOUNDATIONS, PLAN, DESCRIPTION

ROOT=Path(__file__).resolve().parent.parent
SITE=ROOT
BASE=SITE/'semester-1'
ASSETS=BASE/'assets'
ASSETS.mkdir(parents=True,exist_ok=True)
resources={}
for course in ['ma101','phy101','chemistry']:
    resources[course]={}
    for provider in ['book','educator','pearson']:
        tree=html.fromstring((SITE/course/provider/'index.html').read_text(encoding='utf-8'))
        klass={'ma101':'math-lesson','phy101':'physics-lesson','chemistry':'chemistry-lesson'}[course]
        resources[course][provider]=[{'id':el.get('id'),'html':html.tostring(el,encoding='unicode')} for el in tree.xpath(f'//*[contains(@class,"{klass}")]')]
H=lambda x:escape(str(x),quote=True)

def header(active=''):
    links=''.join(f'<a href="/semester-1/{c["path"]}/"'+(' aria-current="page"' if active==c['id'] else '')+f'>{H(c["title"] if c["id"]=="ma101" else c["path"].title())}</a>' for c in COURSES)
    return f'<a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Semester 1 courses">{links}</nav><span class="semester">SEMESTER 1</span></header>'

def page(title,body,active='',attrs='',home=False):
    return f'''<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Yanbu Chemical Engineering Semester 1 science study: Calculus I, General Physics I and General Chemistry I."><title>{H(title)} | Yanbu Engineering Study</title><link rel="stylesheet" href="/semester-1/assets/curriculum.css"><script type="module" src="/semester-1/assets/app.js"></script></head><body {attrs}>{header(active)}<main id="main" class="{'home' if home else 'page'}">{body}</main><footer class="footer">Semester 1 science courses · Based on the published Yanbu plan, awaiting the student’s course outlines. <a href="{PLAN}" target="_blank" rel="noopener">College plan</a> · <a href="{DESCRIPTION}" target="_blank" rel="noopener">Course descriptions</a><br>Practice records are saved on this browser. Checks support learning and are not university grades.</footer></body></html>'''

def write(path,text):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(text,encoding='utf-8')

def source_material(course,t):
    out=[]
    for provider,label in [('educator','Another explanation'),('pearson','More decision practice'),('book','Reference and worked examples')]:
        if provider not in t['resources']: continue
        pieces=[]
        for id in t['resources'][provider]:
            record=next(x for x in resources[course['id']][provider] if x['id']==id)
            el=html.fromstring(record['html'])
            for item in el.xpath('//*[@id]'):
                item.set('id',f'{provider}-{item.get("id")}')
            for number in el.xpath('.//*[contains(@class,"lesson-number")]'):
                number.getparent().remove(number)
            pieces.append(html.tostring(el,encoding='unicode'))
        out.append(f'<details class="resource"><summary>{H(label)}</summary><p class="source-note">Adapted {H(provider.title())} material selected for this topic.</p>{"".join(pieces)}</details>')
    return ''.join(out)

def question(kind,obj):
    return f'''<section class="check" data-check="{kind}"><div class="section-label">{'TRY FIRST' if kind=='diagnostic' else 'CHECK A NEW EXAMPLE'}</div><h2>{'Start with a short challenge' if kind=='diagnostic' else 'Apply the idea independently'}</h2><p>{H(obj['prompt'])}</p><form data-question="{kind}"><label for="answer-{kind}">Your answer{(' in '+H(obj['unit'])) if obj['unit'] else ''}</label><div class="answer-row"><input id="answer-{kind}" name="answer" type="text" inputmode="decimal" autocomplete="off" placeholder="Enter a number" required><button type="submit">Check answer</button></div></form><p class="feedback" role="status" aria-live="polite"></p><button class="text-button reveal" type="button">Show the reasoning</button><div class="solution" hidden></div><noscript>Interactive checking needs JavaScript. You can still read the explanation and the worked source examples below.</noscript></section>'''

manifest={'schemaVersion':1,'programId':'yic-bsce','planVersion':'published-2023','activeSemester':1,
          'scopeStatus':'provisional-until-student-outline','sources':[PLAN,DESCRIPTION],'courses':[]}
for course in COURSES:
    c=deepcopy(course)
    c['semester']=1
    for i,t in enumerate(c['topics']):
        t['key']=f'{course["code"].replace(" ","")}.{t["id"]}'
        t['href']=f'/semester-1/{course["path"]}/{t["id"]}/'
        t['checkpointVersion']=1
        t['sequence']=i+1
        t['suggestedPrevious']=[c['topics'][i-1]['key']] if i else []
        t['evidence']=course['status']
    manifest['courses'].append(c)

write(BASE/'curriculum.json',json.dumps(manifest,ensure_ascii=False,indent=2))

cards=[]
for c in manifest['courses']:
    cards.append(f'''<article class="course-card"><span class="course-code">{c['code']} <span>{c['credits']} credits</span></span><h2>{c['title']}</h2><p>{c['tag']}</p><div class="course-progress"><span data-course-progress="{c['id']}">0</span> / {len(c['topics'])} topic checks passed</div><a class="button" href="/semester-1/{c['path']}/">Open {c['path'].title()} →</a></article>''')
body=f'''<section class="welcome"><div><p class="eyebrow">CHEMICAL ENGINEERING · YEAR 1</p><h1>One semester.<br>Three science courses.</h1><p class="lead">Choose the topic you need. Try a short problem, work through the explanation, then solve a new example.</p><p class="plan-note">Published course scope · Your lecturer’s sequence will take priority when it is available.</p></div><aside class="today"><span class="section-label">YOUR NEXT SESSION</span><h2>Start where you need help</h2><p id="resume-note">Pick one course below to begin.</p><a id="resume-link" class="button" href="/semester-1/math/">Start with Calculus I →</a><span class="small-note">Progress is stored on this browser.</span></aside></section><section class="course-grid" aria-label="Current courses">{''.join(cards)}</section><section class="support-strip"><div><h2>A basic step getting in the way?</h2><p>Use a short refresher in algebra, trigonometry, graphs, units or logarithms, then return to your topic.</p></div><a href="/semester-1/foundations/">Open foundation support →</a></section><section class="scope-strip"><h2>Your current scope</h2><p>These three science courses account for 12 credit hours in the published first-semester plan. Other university requirements are outside this study workspace. Later semesters will be added after their course scope is confirmed.</p></section>'''
# The programme builder owns the root page. After this legacy build, run
# connect-foundations.mjs and connect-program.mjs to restore shared navigation
# and explanation-first topic order.
write(BASE/'index.html',page('Semester 1 science courses',body,home=True))

for c in manifest['courses']:
    rows=[]
    for t in c['topics']:
        rows.append(f'''<a class="topic-row" href="{t['href']}"><span class="sequence">{t['sequence']:02d}</span><div><h2>{H(t['title'])}</h2><p>{H(t['outcome'])}</p></div><span class="topic-state" data-state="{t['key']}">Not started</span><span aria-hidden="true">→</span></a>''')
    body=f'''<a class="back" href="/">← Semester 1</a><section class="course-heading"><p class="eyebrow">{c['code']} · {c['credits']} CREDITS</p><h1>{c['title']}</h1><p class="lead">{H(c['scope'])}</p><p class="plan-note">{H(c['status'])}. This is a learning sequence, not a weekly timetable.</p></section><div class="course-toolbar"><p><b data-course-progress="{c['id']}">0</b> of {len(c['topics'])} topic checks passed</p><a href="/semester-1/foundations/">Foundation support</a></div><section class="topic-list" aria-label="Topics">{''.join(rows)}</section>'''
    write(BASE/c['path']/'index.html',page(c['title'],body,c['id']))
    for i,t in enumerate(c['topics']):
        nextt=c['topics'][i+1] if i+1<len(c['topics']) else None
        nav=f'<a class="button" href="{nextt["href"]}">Next topic →</a>' if nextt else f'<a class="button" href="/semester-1/{c["path"]}/">Back to course →</a>'
        body=f'''<a class="back" href="/semester-1/{c['path']}/">← {H(c['title'])}</a><section class="topic-heading"><p class="eyebrow">{c['code']} · TOPIC {t['sequence']:02d}</p><h1>{H(t['title'])}</h1><p class="lead">{H(t['outcome'])}</p><nav class="steps" aria-label="Lesson steps"><a href="#try">Try</a><a href="#learn">Learn</a><a href="#transfer">Apply</a></nav></section><div id="try">{question('diagnostic',t['diagnostic'])}</div><section id="learn" class="explanation"><span class="section-label">THE IDEA</span><h2>Understand the decision</h2><p>{H(t['idea'])}</p><div class="worked"><h3>Worked example</h3><p>{H(t['example'])}</p></div><p class="engineering"><strong>Engineering connection</strong> {H(t['context'])}</p><a class="foundation-link" href="/semester-1/foundations/#{t['foundation']}">Need a refresher? {H(FOUNDATIONS[t['foundation']][0])} →</a></section><section class="more-help"><h2>Need more help with this topic?</h2><p>Open one explanation that helps. You do not need to complete every source.</p>{source_material(c,t)}</section><div id="transfer">{question('transfer',t['transfer'])}</div><div class="finish"><p id="topic-status" role="status">Complete the new example to record your practice.</p>{nav}</div>'''
        write(BASE/c['path']/t['id']/'index.html',page(t['title'],body,c['id'],f'data-topic="{t["key"]}"'))

found=[]
for key,(title,idea,worked,tryit,answer) in FOUNDATIONS.items():
    found.append(f'<section class="explanation" id="{key}"><h2>{H(title)}</h2><p>{H(idea)}</p><div class="worked"><strong>Example</strong><p>{H(worked)}</p></div><p><strong>Try it</strong> {H(tryit)}</p><details class="answer"><summary>Check your answer</summary><p>{H(answer)}</p></details></section>')
write(BASE/'foundations'/'index.html',page('Foundation support','<a class="back" href="/">← Semester 1</a><h1>Repair the step you need</h1><p class="lead">Choose the relevant refresher, then use your browser’s Back button to return to the topic.</p>'+''.join(found)))
print(f'Built 3 courses, {sum(len(c["topics"]) for c in COURSES)} topics, 5 foundation refreshers.')

