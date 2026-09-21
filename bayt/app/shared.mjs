/* أدوات مشتركة بين صفحات بيت الفؤاد. */
import { storageAvailable, hasDemo, clearDemo } from './state.mjs';

export const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children) if (child) node.append(child);
  return node;
};

/* شارة «تجريبي» تظهر على كل عنصر لم يُدخله الطالب بنفسه. */
export const demoTag = () => el('span', { class: 'demo-tag', text: 'تجريبي' });

/* يعرض تحذير التخزين وشريط البيانات التجريبية إن لزم، ويعيد الرسم بعد المسح. */
export function wireShell(render) {
  const warning = document.querySelector('[data-storage-warning]');
  if (warning && !storageAvailable()) warning.hidden = false;

  const bar = document.querySelector('[data-demo-bar]');
  const button = document.querySelector('[data-clear-demo]');
  const refresh = () => { if (bar) bar.hidden = !hasDemo(); };
  if (button) button.addEventListener('click', () => { clearDemo(); render(); refresh(); });
  refresh();
  return refresh;
}

/* العدد مع المعدود بالعربية. القاعدة: الواحد والاثنان لهما صيغتهما،
   ومن ثلاثة إلى عشرة جمع، وما فوقها مفرد منصوب.
   مثال: مهمة واحدة · مهمتان · 5 مهام · 15 مهمة. */
export function countNoun(n, { one, two, few, many }) {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
}

export const nouns = {
  task: { one: 'مهمة واحدة', two: 'مهمتان', few: 'مهام', many: 'مهمة' },
  sentence: { one: 'جملة واحدة', two: 'جملتان', few: 'جمل', many: 'جملة' },
  achievement: { one: 'إنجاز واحد', two: 'إنجازان', few: 'إنجازات', many: 'إنجازًا' },
  minute: { one: 'دقيقة واحدة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة' },
  word: { one: 'كلمة واحدة', two: 'كلمتان', few: 'كلمات', many: 'كلمة' },
  week: { one: 'أسبوع واحد', two: 'أسبوعان', few: 'أسابيع', many: 'أسبوعًا' },
  assumption: { one: 'افتراض واحد', two: 'افتراضان', few: 'افتراضات', many: 'افتراضًا' },
};
