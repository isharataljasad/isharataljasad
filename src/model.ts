export const STORAGE_KEY = 'teacher-journey:v1';
export const taskTypes = ['مهمة استقصائية', 'مشروع', 'أخرى'] as const;
export const tools = ['التقويم الذاتي', 'تقويم الأقران', 'كلاهما'] as const;
export const evidenceTypes = ['ملاحظات صفية', 'تعليقات الطلاب', 'نماذج من أعمال الطلاب', 'نتائج استخدام أداة التقويم', 'ملاحظات عن المشاركة والسلوك المرتبط بالتعلم', 'أدلة أخرى'];
export const concepts = ['التقويم التكويني', 'استقلالية المتعلم', 'التعلم القائم على الاستقصاء', 'وضوح معايير التقويم', 'الدافعية والالتزام'];
export const achievementLevels = ['تحقق', 'تحقق جزئيًا', 'لم يتحقق بعد'];
export type Evidence = { id: string; kind: string; description: string };
export type Journey = {
  version: 1; id: string; updatedAt: string; step: number;
  name: string; school: string; subject: string; stage: string; grade: string;
  goal: string; rationale: string; taskTitle: string; taskDescription: string;
  taskType: string; otherTask: string; tool: string; plan: string; implemented: boolean;
  execution: string; evidence: Evidence[]; response: string; reflection: string;
  concepts: string[]; conceptExplanation: string; achievement: string;
  achievementEvidence: string; future: string; regularPractice: string;
  report: string; reportEdited: boolean; reportSource: string;
};
export type TextKey = { [K in keyof Journey]: Journey[K] extends string ? K : never }[keyof Journey];
export const newJourney = (): Journey => ({ version: 1, id: crypto.randomUUID(), updatedAt: new Date().toISOString(), step: 1,
  name:'', school:'', subject:'', stage:'', grade:'', goal:'', rationale:'', taskTitle:'', taskDescription:'', taskType:'', otherTask:'', tool:'', plan:'', implemented:false,
  execution:'', evidence:[], response:'', reflection:'', concepts:[], conceptExplanation:'', achievement:'', achievementEvidence:'', future:'', regularPractice:'', report:'', reportEdited:false, reportSource:'' });
const textKeys: TextKey[] = ['name','school','subject','stage','grade','goal','rationale','taskTitle','taskDescription','taskType','otherTask','tool','plan','execution','response','reflection','conceptExplanation','achievement','achievementEvidence','future','regularPractice','report','reportSource'];
export function parseJourney(raw: unknown): Journey {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('صيغة النسخة الاحتياطية غير صحيحة.');
  const x = raw as Record<string, unknown>;
  if (x.version !== 1 || typeof x.id !== 'string' || !x.id || x.id.length > 100 || typeof x.updatedAt !== 'string' || !Number.isFinite(Date.parse(x.updatedAt))) throw new Error('الملف ليس نسخة رحلة صالحة أو أن إصداره غير مدعوم.');
  const d = newJourney(); d.id=x.id; d.updatedAt=x.updatedAt;
  for (const key of textKeys) {
    if (typeof x[key] !== 'string' || (x[key] as string).length > (key === 'report' || key === 'reportSource' ? 100000 : 10000)) throw new Error('النسخة تحتوي حقولًا ناقصة أو نصوصًا تتجاوز الحد المسموح.');
    d[key] = x[key] as string;
  }
  if (!Number.isInteger(x.step) || (x.step as number)<1 || (x.step as number)>14 || typeof x.implemented!=='boolean' || typeof x.reportEdited!=='boolean') throw new Error('بيانات تقدم الرحلة غير صحيحة.');
  if (!['',...taskTypes].includes(d.taskType) || !['',...tools].includes(d.tool) || !['',...achievementLevels].includes(d.achievement)) throw new Error('تحتوي النسخة خيارات غير معروفة.');
  if (!Array.isArray(x.concepts) || x.concepts.length>5 || x.concepts.some(v=>typeof v!=='string'||!concepts.includes(v)) || new Set(x.concepts).size!==x.concepts.length) throw new Error('بيانات المفاهيم غير صحيحة.');
  if (!Array.isArray(x.evidence) || x.evidence.length>30) throw new Error('بيانات الأدلة غير صحيحة.');
  d.evidence=x.evidence.map((e: unknown)=>{
    if (!e || typeof e!=='object') throw new Error('بيانات الأدلة غير صحيحة.');
    const v=e as Record<string,unknown>;
    if (typeof v.id!=='string'||!v.id||v.id.length>100||typeof v.kind!=='string'||!evidenceTypes.includes(v.kind)||typeof v.description!=='string'||v.description.length>10000) throw new Error('يوجد دليل غير صالح في النسخة.');
    return {id:v.id,kind:v.kind,description:v.description};
  });
  if(new Set(d.evidence.map(e=>e.id)).size!==d.evidence.length) throw new Error('تحتوي النسخة أدلة مكررة.');
  d.step=x.step as number; d.implemented=x.implemented; d.reportEdited=x.reportEdited; d.concepts=x.concepts as string[];
  if (!d.implemented && d.step>5) d.step=5;
  return d;
}
export const stepTitles = ['','نتعارف أولًا','هدفي المهني','أصمّم سلم تقديري','خطة التطبيق','بطاقة التطبيق','وصف التنفيذ','أدلتي من الصف','استجابة الطلاب','النجاح والتحديات','من التجربة إلى المفهوم','أراجع هدفي','خطوتي القادمة','مراجعة اكتمال تقريري','تقريري النهائي'];
export const stations = [{title:'هدفي المهني',subtitle:'أحدد وجهتي',from:1,to:2}, {title:'أصمّم سلم تقديري',subtitle:'أبني معايير واضحة',from:3,to:5}, {title:'أوثّق تجربتي',subtitle:'أجمع ما يستحق التأمل',from:6,to:8}, {title:'أتأمل وأطوّر',subtitle:'أتعلم وأخطو للأمام',from:9,to:14}];
export const stationIndex = (step: number) => Math.max(0,stations.findIndex(s=>step>=s.from&&step<=s.to));
export function stepErrors(d: Journey, step: number): string[] {
  const missing: string[]=[];
  const need=(key: TextKey,label:string)=>{ if(!d[key].trim()) missing.push(label); };
  if(step===1) {need('name','اسم المعلم');need('school','المدرسة');need('subject','المادة الدراسية');need('stage','المرحلة الدراسية');need('grade','الصف الدراسي');}
  if(step===2) {need('goal','الهدف الشخصي');need('rationale','مبررات اختيار الهدف');}
  if(step===3) {need('taskDescription','وصف المهمة');need('tool','نوع التقويم');}
  if(step===4) {need('tool','أداة التقويم');need('plan','خطة استخدام الأداة');}
  if(step===5&&!d.implemented) missing.push('الإقرار بتنفيذ المهمة فعليًا قبل توثيق النتائج');
  if(step===6) need('execution','وصف التنفيذ الفعلي');
  if(step===7 && (!d.evidence.length||d.evidence.some(e=>!e.description.trim()))) missing.push('وصف محدد لكل دليل مضاف');
  if(step===8) need('response','استجابة الطلاب');
  if(step===9) need('reflection','تحليل النجاح والتحديات');
  if(step===10) {if(!d.concepts.length)missing.push('مفهوم من الحقيبة');need('conceptExplanation','تفسير المفهوم في ضوء التجربة والأدلة');}
  if(step===11) {need('achievement','مستوى تحقق الهدف');need('achievementEvidence','الأدلة التي تدعم الحكم');}
  if(step===12) {need('future','التعديل القادم وأسبابه');need('regularPractice','توظيف التقويم بانتظام');}
  return missing;
}
export function missingSteps(d: Journey) { return Array.from({length:12},(_,i)=>i+1).filter(s=>stepErrors(d,s).length>0); }
export function completion(d: Journey) { return Math.round((12-missingSteps(d).length)/12*100); }
export type ReviewItem = { name:string; state:'مكتمل ظاهريًا'|'يحتاج إلى توضيح'|'لم يُستكمل'; note:string; step:number };
const substantial=(t:string)=>t.trim().split(/\s+/).length>=12;
const specific=(t:string)=>/مثال|لاحظ|دليل|أظهر|أظهرت|أعمال|تعليق|نتائج|معيار|معايير|مقارن|طالب|طلاب|مجموع|نموذج|\d|[٠-٩]/.test(t);
const explanation=(t:string)=>/لأن|بسبب|يرجع|ساعد|أدى|أدّى|نتيجة|يفسر|يفسّر|لذلك|مما|حيث|إذ|بناء/.test(t);
export function review(d:Journey):ReviewItem[] {
  const make=(name:string,parts:string[],qualified:boolean,note:string,step:number):ReviewItem=>({name,state:parts.some(t=>!t.trim())?'لم يُستكمل':qualified?'مكتمل ظاهريًا':'يحتاج إلى توضيح',note,step});
  return [
    make('المواءمة مع الأهداف',[d.goal,d.rationale],substantial(d.rationale)&&/تقويم|استقصاء|معايير|استقلالية|دافعية|حقيبة/.test(d.goal+' '+d.rationale),'اربط هدفك بممارسة محددة وبما تعلمته في الحقيبة، ووضح كيف ستلاحظ تطورها.',2),
    make('وصف المهمة التأملية / الاستقصاء الصفي',[d.taskDescription,d.plan,d.execution],substantial(d.execution)&&specific(d.execution)&&/استقصا|مشروع/.test(d.taskType+' '+d.otherTask),'صف خطوات ما حدث فعلًا، وكيف قدمت الأداة والمعايير واستخدمها الطلاب.',6),
    make('جمع الأدلة وتوثيقها',d.evidence.length?d.evidence.map(e=>e.description):[''],d.evidence.every(e=>substantial(e.description)&&specific(e.description)),'اذكر دليلًا محددًا وما يوضحه عن التعلم أو استخدام أداة التقويم.',7),
    make('التقويم الذاتي في ضوء الأهداف وتوظيف الأدلة',[d.achievement,d.achievementEvidence],substantial(d.achievementEvidence)&&specific(d.achievementEvidence),'ما الذي لاحظته أو جمعته من أدلة يدعم حكمك بتحقق الهدف؟',11),
    make('التأمل النقدي',[d.reflection],substantial(d.reflection)&&specific(d.reflection)&&explanation(d.reflection),'حدد ما نجح وما واجهته من تحديات، وفسر الأسباب مستندًا إلى مثال أو دليل.',9),
    make('تطبيق المفاهيم الأساسية',[d.concepts.join('، '),d.conceptExplanation],substantial(d.conceptExplanation)&&specific(d.conceptExplanation)&&explanation(d.conceptExplanation),'كيف ظهر المفهوم في ممارسة فعلية؟ وكيف يساعدك على تفسير ما حدث؟',10),
    make('التوجهات المستقبلية',[d.future,d.regularPractice],substantial(d.future)&&explanation(d.future),'حدد تعديلًا عمليًا، واربط سبب اختياره بدليل من تجربتك، ووضح كيف ستستمر عليه.',12)
  ];
}
export function goalReview(goal:string) {
  const practice=/تقويم|معايير|استقصاء|تقييم|تدريس|تعلم|تعلّم/.test(goal);
  const observable=/ملاحظ|أعمال|دليل|أدلة|نتائج|مقارن|تعليق|أقيس|أرصد/.test(goal);
  return { strength:practice?'يتضمن هدفك إشارة إلى ممارسة تعليمية يمكن تطويرها.':'كتبت نقطة انطلاق يمكنك الآن تحديدها بصورة أدق.', note:!practice?'حدد الممارسة المهنية المقصودة وعلاقتها بمفاهيم الحقيبة.':!observable?'أضف كيف ستلاحظ تطور الممارسة، مثل دليل أو تغير يمكن رصده.':'تحقق من أن وسيلة الملاحظة المذكورة مناسبة لهدفك وقابلة للتطبيق.', suggestion:goal.trim() };
}
export function reportSource(d:Journey) { const {updatedAt,step,report,reportEdited,reportSource:_,...source}=d;return JSON.stringify(source); }
export function createReport(d:Journey) {
  const reasons=d.rationale.trim();
  return [
    `حددت هدفي المهني على النحو الآتي: ${d.goal.trim()}\nواخترت هذا الهدف للأسباب والارتباطات التالية: ${reasons}`,
    `خططت لتطبيق ${d.taskType==='أخرى'?d.otherTask:d.taskType} بعنوان «${d.taskTitle.trim()}». ${d.taskDescription.trim()}\nاخترت أداة التقويم: ${d.tool}. وكانت خطتي لتقديمها واستخدامها كما يأتي: ${d.plan.trim()}`,
    `خلال التنفيذ الفعلي: ${d.execution.trim()}\nوكانت استجابة الطلاب كما لاحظتها: ${d.response.trim()}`,
    `جمعت الأدلة الآتية لتوثيق التجربة:\n${d.evidence.map(e=>`${e.kind}: ${e.description.trim()}`).join('\n')}`,
    `عند مراجعة هدفي الشخصي، حكمت بأنه ${d.achievement}، واستندت في حكمي إلى ما يأتي: ${d.achievementEvidence.trim()}`,
    `وفي تأملي في جوانب النجاح والتحديات وأسبابها: ${d.reflection.trim()}`,
    `استعنت بالمفاهيم الآتية لتفسير التجربة: ${d.concepts.join('، ')}. ${d.conceptExplanation.trim()}`,
    `بناءً على هذه التجربة، حددت الخطوات المستقبلية الآتية: ${d.future.trim()}\nولجعل توظيف التقويم أكثر انتظامًا في ممارستي: ${d.regularPractice.trim()}`
  ].join('\n\n');
}
