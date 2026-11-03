import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [input, output, previewDir] = process.argv.slice(2);
if (!input || !output || !previewDir) throw new Error('Usage: node export_workbook.mjs checked.json chapter.xlsx preview-directory');
if (path.resolve(input) === path.resolve(output)) throw new Error('Do not overwrite input.');
try { await fs.access(output); throw new Error('Output already exists; select a new versioned filename.'); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
const data = JSON.parse(await fs.readFile(input,'utf8'));
if (data.format !== 'chapters-development.checked-v1' || data.passed !== true || !data.rows?.length) {
  throw new Error('Use a successful check_chapter.py output.');
}
const resolveFrom = process.env.CHAPTERS_NODE_MODULES
  ? path.join(process.env.CHAPTERS_NODE_MODULES,'__chapters_resolver.cjs') : import.meta.url;
const require = createRequire(resolveFrom);
const {Workbook,SpreadsheetFile} = await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const wb = Workbook.create();
const name = data.mode==='fragment' ? 'Example fragment' : `CH.${data.chapter}`;
const sheet=wb.worksheets.add(name);
sheet.showGridLines=false;
const safe=v=>typeof v==='string' && v.startsWith('=') ? "'"+v : v;
const values=[['Text Type','Character','Script','Emotion','Thought Bubble'],
  ...data.rows.map(r=>[r.text_type,r.character,r.script,r.emotion,r.thought_bubble].map(safe))];
sheet.getRange(`A1:E${values.length}`).values=values;
sheet.getRange(`A1:E${values.length}`).format.font={name:'Arial',size:11,color:'#18202A'};
sheet.getRange(`A1:E${values.length}`).format.wrapText=true;
sheet.getRange(`A1:E${values.length}`).format.verticalAlignment='center';
for (const [col,width] of [['A',25],['B',20],['C',88],['D',14],['E',18]]) sheet.getRange(`${col}1:${col}${values.length}`).format.columnWidth=width;
sheet.getRange(`A1:E${values.length}`).format.rowHeight=36;
sheet.getRange('A1:E1').format={fill:'#283B4E',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:32};
for (const r of data.rows) {
  const range=sheet.getRange(`A${r.excel_row}:E${r.excel_row}`);
  range.format.fill=r.color;
  if(r.kind==='button') range.format.font.bold=true;
  const textTypeLines=Math.ceil(r.text_type.length/22);
  const scriptLines=Math.ceil(r.script.length/80);
  range.format.rowHeight=Math.max(36,18*Math.max(textTypeLines,scriptLines)+10);
}
sheet.freezePanes.freezeRows(1);
sheet.getRange(`D2:D${values.length}`).dataValidation={rule:{type:'list',values:['neutral','smile','laughing','shy','angry','shocked','sad','flirty']}};
sheet.getRange(`E2:E${values.length}`).dataValidation={rule:{type:'list',values:['yes','no']}};
const map=wb.worksheets.add('Choice Map');
map.showGridLines=false;
const info=[['Workbook mode',data.mode==='fragment'?'Illustrative fragment, not a complete chapter':'Five-column writing draft, not a runtime import'],
 ['Title',data.title],['Core emotion',data.core_emotion],['Source SHA256',data.source_sha256],
 ['Count basis','Expanded authored rows; route counts include one selected button per menu.'],
 ['Runtime status','Conditional callbacks and entitlement reuse require engine verification.']];
map.getRange('A1:B6').values=info.map(row=>row.map(safe));
const header=['Excel Row','Node ID','Kind','Group ID','Branch ID','Parent Branch','Price (gems)','Depth','Color'];
map.getRange(`A8:I${data.rows.length+8}`).values=[header,...data.rows.map(r=>[
  r.excel_row,r.id,r.kind,r.group_id,r.branch_id,r.parent_branch,r.price,r.depth,r.color])];
map.getRange(`A1:I${data.rows.length+8}`).format.font={name:'Arial',size:10,color:'#18202A'};
map.getRange(`A1:I${data.rows.length+8}`).format.columnWidth=24;
map.getRange(`A1:I${data.rows.length+8}`).format.rowHeight=28;
map.getRange('B1:B6').format.columnWidth=44;
map.getRange('B1:I1').merge();map.getRange('B2:I2').merge();map.getRange('B3:I3').merge();
map.getRange('B4:I4').merge();map.getRange('B5:I5').merge();map.getRange('B6:I6').merge();
map.getRange('A8:I8').format={fill:'#283B4E',font:{bold:true,color:'#FFFFFF'},rowHeight:32};
for (let i=0;i<data.rows.length;i++) map.getRange(`A${i+9}:I${i+9}`).format.fill=data.rows[i].color;
map.freezePanes.freezeRows(8);
wb.recalculate();
const inspected=await wb.inspect({kind:'table',range:`'${name}'!A1:E6`,include:'values',tableMaxRows:6,tableMaxCols:5});
await fs.mkdir(previewDir,{recursive:true});
await fs.writeFile(path.join(previewDir,'inspection.ndjson'),inspected.ndjson);
for (let start=1;start<=values.length;start+=28) {
  const end=Math.min(values.length,start+27);
  const blob=await wb.render({sheetName:name,range:`A${start}:E${end}`,scale:1.3,format:'png'});
  await fs.writeFile(path.join(previewDir,`script-${start}-${end}.png`),new Uint8Array(await blob.arrayBuffer()));
}
const mapPreview=await wb.render({sheetName:'Choice Map',range:`A1:I${Math.min(data.rows.length+8,20)}`,scale:1,format:'png'});
await fs.writeFile(path.join(previewDir,'choice-map.png'),new Uint8Array(await mapPreview.arrayBuffer()));
await fs.mkdir(path.dirname(output),{recursive:true});
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
try { await fs.rename(`${output}.inspect.ndjson`,path.join(previewDir,'export-inspection.ndjson')); }
catch(e) { if(e.code!=='ENOENT') throw e; }
console.log(JSON.stringify({output,mode:data.mode,scriptRows:data.rows.length,previewDir}));
