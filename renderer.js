const defaultTiles = [
  {id:'explorer',name:'File Explorer',caption:'YOUR FILES',icon:'▣',target:'explorer.exe',type:'app',size:'large',color:'red'},
  {id:'browser',name:'Browser',caption:'THE WEB',icon:'◉',target:'https://www.google.com',type:'url',size:'wide',color:'graphite'},
  {id:'settings',name:'Settings',caption:'SYSTEM CONTROL',icon:'⚙',target:'ms-settings:',type:'app',size:'small',color:'silver'},
  {id:'notepad',name:'Notepad',caption:'QUICK NOTES',icon:'▤',target:'notepad.exe',type:'app',size:'small',color:'graphite'},
  {id:'calculator',name:'Calculator',caption:'QUICK MATH',icon:'＋',target:'calc.exe',type:'app',size:'small',color:'crimson'},
  {id:'terminal',name:'Terminal',caption:'POWER USER',icon:'⌘',target:'wt.exe',type:'app',size:'small',color:'graphite'},
  {id:'paint',name:'Paint',caption:'CREATIVE SPACE',icon:'✎',target:'mspaint.exe',type:'app',size:'wide',color:'silver'},
  {id:'downloads',name:'Downloads',caption:'RECENT FILES',icon:'↓',target:'%DOWNLOADS%',type:'folder',size:'small',color:'red'}
];
let tiles = loadTiles();
let draggedId = null;
const tileGrid = document.getElementById('tiles');
const modal = document.getElementById('modal');
const form = document.getElementById('tileForm');
const toastEl = document.getElementById('toast');

function loadTiles(){ try { const saved=JSON.parse(localStorage.getItem('redos-tiles')); return Array.isArray(saved)?saved:defaultTiles; } catch { return defaultTiles; } }
function save(){localStorage.setItem('redos-tiles',JSON.stringify(tiles));}
function toast(message){toastEl.textContent=message;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),2600);}
function render(){
  tileGrid.innerHTML='';
  tiles.forEach(item=>{
    const el=document.createElement('article');
    el.className=`tile ${item.size||'small'} ${item.color||'graphite'}`;
    el.draggable=true; el.dataset.id=item.id;
    const top=document.createElement('div');top.className='tile-top';
    const icon=document.createElement('div');icon.className='tile-icon';icon.textContent=item.icon||'◈';
    const kebab=document.createElement('button');kebab.className='tile-kebab';kebab.type='button';kebab.textContent='···';kebab.title='Tile options';
    kebab.addEventListener('click',e=>{e.stopPropagation();if(confirm(`Të fshihet tile "${item.name}"?`)){tiles=tiles.filter(t=>t.id!==item.id);save();render();}});
    top.append(icon,kebab);
    const bottom=document.createElement('div');bottom.className='tile-bottom';
    const text=document.createElement('div');
    const name=document.createElement('div');name.className='tile-name';name.textContent=item.name;
    const cap=document.createElement('div');cap.className='tile-caption';cap.textContent=item.caption||item.type.toUpperCase();
    text.append(name,cap);bottom.append(text);
    el.append(top,bottom);
    el.addEventListener('click',()=>launch(item));
    el.addEventListener('dragstart',()=>{draggedId=item.id;el.classList.add('dragging');});
    el.addEventListener('dragend',()=>{draggedId=null;el.classList.remove('dragging');document.querySelectorAll('.drag-over').forEach(n=>n.classList.remove('drag-over'));});
    el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drag-over');});
    el.addEventListener('dragleave',()=>el.classList.remove('drag-over'));
    el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drag-over');const from=tiles.findIndex(t=>t.id===draggedId),to=tiles.findIndex(t=>t.id===item.id);if(from<0||to<0||from===to)return;const [moved]=tiles.splice(from,1);tiles.splice(to,0,moved);save();render();});
    tileGrid.append(el);
  });
  document.getElementById('tileCount').textContent=`${String(tiles.length).padStart(2,'0')} ITEMS`;
}
async function launch(item){
  try{
    await window.redos.launch(item);
  }catch(err){toast(err.message||'Nuk u hap aplikacioni. Kontrollo target-in.');}
}
function openModal(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.getElementById('tileName').focus();}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');form.reset();}
document.getElementById('addTile').addEventListener('click',openModal);
document.getElementById('addTop').addEventListener('click',openModal);
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.getElementById('browseExe').addEventListener('click',async()=>{const selected=await window.redos.pickExe();if(selected)document.getElementById('tileTarget').value=selected;});
document.getElementById('tileType').addEventListener('change',e=>{document.getElementById('browseExe').style.display=e.target.value==='app'?'block':'none';document.getElementById('tileTarget').placeholder=e.target.value==='url'?'https://example.com':e.target.value==='folder'?'C:\\\\Users\\\\You\\\\Documents':'C:\\\\Path\\\\app.exe';});
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('tileName').value.trim(),type=document.getElementById('tileType').value,target=document.getElementById('tileTarget').value.trim();
  if(!name||!target)return;
  if(type==='url'&&!/^https?:\\/\\//i.test(target)){toast('Website duhet të fillojë me https:// ose http://');return;}
  tiles.unshift({id:'custom-'+Date.now(),name,caption:type==='url'?'WEB LINK':type==='folder'?'FOLDER':'APP',icon:type==='url'?'◎':type==='folder'?'▣':'◈',target,type,size:document.getElementById('tileSize').value,color:document.getElementById('tileColor').value});
  save();render();closeModal();toast('Tile u shtua me sukses.');
});
document.querySelectorAll('.rail-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.rail-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');if(btn.dataset.view==='settings')toast('Settings: përdor Add tile për personalizim.');else if(btn.dataset.view==='apps')toast('Të gjitha shortcut-et shfaqen në workspace.');}));
function tick(){
 const now=new Date();document.getElementById('clock').textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
 document.getElementById('date').textContent=now.toLocaleDateString('sq-AL',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase();
 const h=now.getHours();document.getElementById('greeting').textContent=h<12?'morning':h<18?'afternoon':'evening';
}
render();tick();setInterval(tick,1000);
