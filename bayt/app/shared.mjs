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

/* القاعدة اللغوية تعيش في وحدة مستقلة بلا تبعيات، وتُعاد هنا
   حتى يبقى المستوردون الحاليون على حالهم. */
export { countNoun, nouns } from './arabic-count.mjs';
