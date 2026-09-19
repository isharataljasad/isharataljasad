const search=document.querySelector('#course-search');
const semester=document.querySelector('#semester-filter');
const availability=document.querySelector('#availability-filter');
const count=document.querySelector('#filter-count');
const cards=[...document.querySelectorAll('[data-course-card]')];
if(search){
 search.closest('form').addEventListener('submit',event=>event.preventDefault());
 const query=new URLSearchParams(location.search);
 search.value=query.get('q')||'';
 if([...semester.options].some(o=>o.value===query.get('semester'))) semester.value=query.get('semester');
 if([...availability.options].some(o=>o.value===query.get('availability'))) availability.value=query.get('availability');
 function filter(){
  const term=search.value.trim().toLowerCase().replace(/\s+/g,'');
  let visible=0;
  for(const card of cards){
   const match=card.textContent.toLowerCase().replace(/\s+/g,'').includes(term)&&(!semester.value||card.dataset.semester===semester.value)&&(!availability.value||card.dataset.available===availability.value);
   card.hidden=!match;if(match)visible++;
  }
  document.querySelectorAll('[data-semester-section]').forEach(section=>{section.hidden=![...section.querySelectorAll('[data-course-card]')].some(c=>!c.hidden)});
  count.textContent=`${visible} of ${cards.length} courses shown${visible?'':'. Try a course code, a shorter title, or clear the filters.'}`;
  const params=new URLSearchParams();if(search.value)params.set('q',search.value);if(semester.value)params.set('semester',semester.value);if(availability.value)params.set('availability',availability.value);
  history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);
 }
 search.addEventListener('input',filter);semester.addEventListener('change',filter);availability.addEventListener('change',filter);
 document.querySelector('#clear-filters').addEventListener('click',()=>{search.value='';semester.value='';availability.value='';filter();search.focus()});
 document.querySelectorAll('a[href^="#semester-"]').forEach(link=>link.addEventListener('click',()=>{search.value='';availability.value='';semester.value=link.getAttribute('href').slice('#semester-'.length);filter()}));
 filter();
}
const storageKey='yanbu-study-bookmarks-v1';
const save=document.querySelector('[data-save-course]');
if(save){
 const note=document.querySelector('#save-note');
 const id=save.dataset.saveCourse;
 const read=()=>{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]};
 const paint=saved=>{save.textContent=saved?'Remove from my study list':'Save to my study list';save.setAttribute('aria-pressed',String(saved))};
 try{paint(read().includes(id))}catch{note.textContent='Browser storage is unavailable. You can still read every page.'}
 save.addEventListener('click',()=>{try{let saved=read();saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem(storageKey,JSON.stringify(saved));paint(saved.includes(id));note.textContent='Study list saved on this browser. This is not an academic completion record.'}catch{note.textContent='Could not save on this browser. Your course remains available.'}});
}
const studyList=document.querySelector('#saved-courses');
if(studyList){try{const ids=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(ids)){const selected=cards.filter(card=>ids.includes(card.dataset.courseCard));for(const card of selected){const item=document.createElement('li');const link=card.querySelector('.course-open').cloneNode(true);link.textContent=card.querySelector('h3').textContent;item.append(link);studyList.append(item)}if(!selected.length)document.querySelector('#saved-empty').hidden=false}}catch{document.querySelector('#saved-empty').hidden=false}}
