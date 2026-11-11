import {useId} from 'react';
import type {ReactNode} from 'react';
export function Field({label,hint,value,onChange,multiline=false,placeholder='',maxLength=10000}:{label:string;hint?:string;value:string;onChange:(v:string)=>void;multiline?:boolean;placeholder?:string;maxLength?:number}) {
  const id=useId();
  return <div className="field"><label htmlFor={id}>{label}</label>{hint&&<p id={id+'-hint'} className="hint">{hint}</p>}{multiline?<textarea id={id} aria-describedby={hint?id+'-hint':undefined} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={5}/>:<input id={id} aria-describedby={hint?id+'-hint':undefined} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={Math.min(maxLength,200)} autoComplete="off"/>}</div>;
}
export function Choices({label,items,value,onChange,multiple=false}:{label:string;items:readonly string[];value:string|string[];onChange:(v:string)=>void;multiple?:boolean}) {
  const id=useId();return <fieldset className="field choices"><legend>{label}</legend><div className="choice-grid">{items.map(item=><label key={item} className={'choice '+((Array.isArray(value)?value.includes(item):value===item)?'selected':'')}><input type={multiple?'checkbox':'radio'} name={id} value={item} checked={Array.isArray(value)?value.includes(item):value===item} onChange={()=>onChange(item)}/><span>{item}</span></label>)}</div></fieldset>;
}
export function Note({children,kind='info'}:{children:ReactNode;kind?:'info'|'warm'}) {return <div className={'note '+kind}>{children}</div>;}
