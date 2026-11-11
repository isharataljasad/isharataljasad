import {Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, PageNumber, BorderStyle} from 'docx';
import type { Journey } from './model';
const paragraph=(text:string,heading=false)=>new Paragraph({bidirectional:true,alignment:AlignmentType.RIGHT,spacing:{after:heading?160:100,line:300},...(heading?{keepNext:true}:{}),children:[new TextRun({text,rightToLeft:true,font:'Arial',size:heading?28:23,bold:heading,color:heading?'17324D':'243746'})]});
export async function wordBlob(d:Journey,kind:'card'|'report') {
  const title=kind==='card'?'بطاقة تطبيقي الصفي':'تقرير مهمة التأمل والتعلم';
  const metadata=`المعلم: ${d.name}  |  المدرسة: ${d.school}\nالمادة: ${d.subject}  |  المرحلة: ${d.stage}  |  الصف: ${d.grade}`;
  const body=kind==='card'?[
    paragraph('هدفي المهني',true),paragraph(d.goal),paragraph('المهمة التعليمية',true),paragraph(`${d.taskTitle} — ${d.taskType==='أخرى'?d.otherTask:d.taskType}`),paragraph(d.taskDescription),paragraph('أداة التقويم وخطة استخدامها',true),paragraph(d.tool),paragraph(d.plan),
    paragraph('قائمة تذكير قبل التطبيق',true),...['شرح المهمة للطلاب.','توضيح معايير التقويم.','إتاحة الفرصة لاستخدام أداة التقويم.','جمع ملاحظات وأدلة من التطبيق.'].map(t=>paragraph(`□ ${t}`)),paragraph('ملاحظات التطبيق',true),paragraph('................................................................................................'),paragraph('................................................................................................'),paragraph('................................................................................................')
  ]:d.report.split('\n').map(t=>paragraph(t));
  const doc=new Document({creator:'رحلة المعلم',title,description:'مستند مبني على إجابات المعلم الأصلية',styles:{default:{document:{run:{font:'Arial',size:23,rightToLeft:true},paragraph:{alignment:AlignmentType.RIGHT}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1000,bottom:1000,left:1100,right:1100}}},headers:{default:new Header({children:[new Paragraph({bidirectional:true,alignment:AlignmentType.RIGHT,border:{bottom:{color:'168C91',style:BorderStyle.SINGLE,size:8,space:8}},children:[new TextRun({text:'رحلة المعلم  |  من التخطيط إلى التأمل',font:'Arial',size:20,color:'168C91',rightToLeft:true})]})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:18})]})]})},children:[paragraph(title,true),...metadata.split('\n').map(t=>paragraph(t)),paragraph(''),...body]}]});
  return Packer.toBlob(doc);
}
export function download(blob:Blob,name:string) {const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}

