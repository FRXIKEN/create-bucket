/* Logika aplikasi: render, drag & drop, pesanan, hitung harga, ekspor gambar. Membutuhkan js/data.js dimuat lebih dulu. */
const G=id=>A.find(a=>a.id===id);let items=[],sel=null,zc=0,pap=0,cat='main',order=null,uid=0;

const sc=document.getElementById('sc'),wrap=document.getElementById('wrap');
const NS='http://www.w3.org/2000/svg';
function mkPaper(cls,d,z,n){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 600 760');s.style.zIndex=z;const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('stroke','#0002');p.setAttribute('stroke-width','2');p.id=cls;s.append(p);sc.append(s);return p}
const pb=mkPaper('pb',PB,1),pf=mkPaper('pf',PF,500);
let wr=null;const WH=540,mk=(z)=>{const e=document.createElement('img');e.style.cssText='position:absolute;display:none;pointer-events:none;z-index:'+z;sc.append(e);return e},wb=mk(1),wf=mk(500),fl=document.createElement('div');fl.style.cssText='position:absolute;left:0;top:0;width:600px;height:760px;z-index:2;pointer-events:none';sc.append(fl);let wsel=0;
const wd=(w,c)=>'M'+c.pts.map(p=>p[0]*w+' '+p[1]*WH).join('L')+'L'+w+' '+WH+'L0 '+WH+'Z';
const wg=i=>{const c=WR[i],w=c.w*WH/c.h;return{c,w,l:300-w/2,t:752-WH}};
const ay=()=>wr==null?610:wg(wr).t+(WR[wr].pts.find(p=>p[0]===.5)[1]+.1)*WH;
function setPaper(i){pap=i;pb.setAttribute('fill',PAP[i][0]);pf.setAttribute('fill',PAP[i][1])}
function setWrap(k){const old=ay();if(k<3){wr=null;setPaper(k)}else wr=k-3;
const on=wr!=null;pb.parentNode.style.display=pf.parentNode.style.display=on?'none':'';
[wb,wf].forEach(e=>{e.style.display=on?'block':'none'});
if(on){const g=wg(wr);[wb,wf].forEach(e=>{e.src=g.c.src;e.style.left=g.l+'px';e.style.top=g.t+'px';e.style.width=g.w+'px';e.style.height=WH+'px'});wf.style.clipPath="path('"+wd(g.w,g.c)+"')"}
['','-webkit-'].forEach(p=>{const s=fl.style;if(false){const g=wg(wr);s.setProperty(p+'mask-image',"url('"+g.c.src+"')");s.setProperty(p+'mask-size',g.w+'px '+WH+'px');s.setProperty(p+'mask-position',g.l+'px '+g.t+'px');s.setProperty(p+'mask-repeat','no-repeat')}else['mask-image','mask-size','mask-position','mask-repeat'].forEach(q=>s.removeProperty(p+q))});
const dy=ay()-old;items.forEach(i=>{if(G(i.id).cat!=='acc'){i.y+=dy;draw(i)}});
wsel=k;tot();document.querySelectorAll('#wp button').forEach((b,j)=>b.setAttribute('aria-pressed',j===k))}
function wpick(){const w=document.getElementById('wp');
[['Pink','#f2a0ba'],['Hijau','#7fb594'],['Krem','#f3e3c3']].forEach(([n,c],j)=>{const b=document.createElement('button');b.innerHTML='<span style="width:44px;height:44px;border-radius:50%;background:'+c+';display:block;margin:10px 0"></span><span>'+n+'</span><small>'+rp(PRW[j])+'</small>';b.onclick=()=>setWrap(j);w.append(b)});
WR.forEach((c,j)=>{const b=document.createElement('button');b.innerHTML='<img alt="" style="height:64px" src="'+c.src+'"><span>'+c.name+'</span><small>'+rp(PRW[j+3])+'</small>';b.onclick=()=>setWrap(j+3);w.append(b)})}
function fit(){const k=wrap.clientWidth/600;sc.style.transform='scale('+k+')';return k}
new ResizeObserver(fit).observe(wrap);

const rp=n=>'Rp'+n.toLocaleString('id-ID');
function bill(){const m={};items.forEach(i=>{const n=G(i.id).name;m[n]=(m[n]||0)+1});const L=Object.entries(m).map(([n,q])=>[n+' ×'+q,PR[n]*q]);L.unshift(['Pembungkus: '+(wsel<3?WN[wsel]:WR[wsel-3].name),PRW[wsel]]);return{L,T:L.reduce((s,l)=>s+l[1],0)}}
function tot(){document.getElementById('tot').innerHTML='<span>Total harga</span><span>'+rp(bill().T)+'</span>'}
const ANG=[0,-12,12,-24,24,-35,35,-6,6,-18,18,-30,30];
function add(id){if(items.length>=30)return;const a=G(id),n=items.filter(i=>G(i.id).cat===a.cat).length;
const it={u:++uid,id,s:1,r:0,f:1,z:Z[a.cat]+(++zc),x:300,y:ay()};
if(['main','fill','leaf'].includes(a.cat)){const k=a.cat==='leaf'?1.3:a.cat==='fill'?1.1:.9;it.r=ANG[n%13]*k+(Math.random()*6-3);it.x=300+Math.random()*10-5;it.s=a.cat==='leaf'?1.08:.95+Math.random()*.15;if(wr!=null){it.r*=.8}}
else if(a.cat==='ribbon'){it.x=300;it.y=ay()-35}
else if(a.name.startsWith('Kartu')){it.x=150;it.y=660;it.r=-8;it.t='Selamat ya!'}
else{it.x=470;it.y=650}
const e=document.createElement('div');e.className='it';e.innerHTML='<img alt="'+a.name+'" src="'+a.src+'">';const host=['main','fill','leaf'].includes(a.cat)?fl:sc;
if(a.box){const t=document.createElement('div');t.className='tx';e.append(t);it.tx=t}
it.e=e;host.append(e);items.push(it);bind(it);draw(it);select(it);check()}
function draw(it){const a=G(it.id),b=B[a.cat],w=a.w*b*it.s,h=a.h*b*it.s,e=it.e,flower=['main','fill','leaf'].includes(a.cat);
e.style.width=w+'px';e.style.height=h+'px';e.style.zIndex=it.z;
if(flower){e.style.left=it.x-a.ax*w+'px';e.style.top=it.y-h+'px';e.style.transformOrigin=a.ax*w+'px '+h+'px'}
else{e.style.left=it.x-w/2+'px';e.style.top=it.y-h/2+'px';e.style.transformOrigin='50% 50%'}
e.style.transform='rotate('+it.r+'deg) scaleX('+it.f+')';
if(it.tx){const x=a.box;Object.assign(it.tx.style,{left:x[0]*100+'%',top:x[1]*100+'%',width:(x[2]-x[0])*100+'%',height:(x[3]-x[1])*100+'%',fontSize:h*.17+'px',transform:'scaleX('+it.f+')'});it.tx.textContent=it.t||''}}
function bind(it){const e=it.e;e.addEventListener('pointerdown',ev=>{ev.preventDefault();select(it);const k=fit(),sx=ev.clientX,sy=ev.clientY,ox=it.x,oy=it.y;e.setPointerCapture(ev.pointerId);e.style.cursor='grabbing';
const mv=m=>{it.x=Math.max(0,Math.min(600,ox+(m.clientX-sx)/k));it.y=Math.max(0,Math.min(760,oy+(m.clientY-sy)/k));draw(it);check()};
const up=()=>{e.removeEventListener('pointermove',mv);e.removeEventListener('pointerup',up);e.style.cursor=''};e.addEventListener('pointermove',mv);e.addEventListener('pointerup',up)})}
function select(it){sel=it;items.forEach(i=>i.e.classList.toggle('sel',i===it));const m=document.getElementById('msg');m.hidden=!(it&&it.tx);if(it&&it.tx)document.getElementById('mt').value=it.t||'';document.querySelectorAll('#tools button').forEach(b=>b.disabled=!it)}
wrap.addEventListener('pointerdown',e=>{if(e.target===wrap||e.target===sc)select(null)});
document.getElementById('mt').addEventListener('input',e=>{if(sel&&sel.tx){sel.t=e.target.value;draw(sel)}});
document.getElementById('tools').addEventListener('click',e=>{const a=e.target.dataset.a;if(!a||!sel)return;
if(a==='rl')sel.r-=8;if(a==='rr')sel.r+=8;if(a==='sm')sel.s=Math.max(.4,sel.s/1.1);if(a==='bg')sel.s=Math.min(2.4,sel.s*1.1);if(a==='fl')sel.f*=-1;
if(a==='fr')sel.z=Z[G(sel.id).cat]+(++zc);
if(a==='del'){sel.e.remove();items=items.filter(i=>i!==sel);select(null);check();return}draw(sel);check()});
document.addEventListener('keydown',e=>{if((e.key==='Delete'||e.key==='Backspace')&&sel&&document.activeElement.tagName!=='TEXTAREA'){document.querySelector('[data-a=del]').click()}});
function tabs(){const t=document.getElementById('tabs');t.innerHTML='';CATS.forEach(([k,n])=>{const b=document.createElement('button');b.textContent=n;b.setAttribute('role','tab');b.setAttribute('aria-selected',k===cat);b.onclick=()=>{cat=k;tabs()};t.append(b)});
const g=document.getElementById('grid');g.innerHTML='';A.filter(a=>a.cat===cat).forEach(a=>{const b=document.createElement('button');b.innerHTML='<img alt="" src="'+a.src+'"><span>'+a.name+'</span><small>'+rp(PR[a.name])+'</small>';b.onclick=()=>add(a.id);g.append(b)})}
const nm=n=>items.filter(i=>G(i.id).name===n).length,ct=c=>items.filter(i=>G(i.id).cat===c).length,card=()=>items.filter(i=>G(i.id).name.startsWith('Kartu')).length;
const ORD=[
{t:'Wisuda sahabat',d:'Kejutan manis untuk yang baru lulus.',r:[['3 bunga utama',()=>ct('main')>=3],['1 bunga pengisi',()=>ct('fill')>=1],['1 dedaunan',()=>ct('leaf')>=1],['Pita pink',()=>nm('Pita Pink')>0],['Boneka wisuda',()=>nm('Boneka Wisuda')>0],['Kartu ucapan',()=>card()>0]]},
{t:'Untuk ibu tercinta',d:'Lembut, penuh peony, dan wangi segar.',r:[['2 peony',()=>nm('Peony')>=2],['1 mawar',()=>nm('Mawar')>=1],['Baby’s Breath',()=>nm('Baby’s Breath')>0],['Eucalyptus',()=>nm('Eucalyptus')>0],['Pita cream',()=>nm('Pita Cream')>0]]},
{t:'Cinta pertama',d:'Merah merona dengan daun rimbun.',r:[['3 mawar',()=>nm('Mawar')>=3],['Ruscus',()=>nm('Ruscus')>0],['Limonium',()=>nm('Limonium')>0],['Pita merah',()=>nm('Pita Merah')>0],['Kartu ucapan',()=>card()>0]]},
{t:'Taman pink',d:'Tiga bunga pink dalam satu pelukan.',r:[['Lily',()=>nm('Lily')>0],['Tulip',()=>nm('Tulip')>0],['Peony',()=>nm('Peony')>0],['Daun apa saja',()=>ct('leaf')>0],['Pita pink',()=>nm('Pita Pink')>0]]},
{t:'Pagi yang cerah',d:'Hangat kuning bersama hijau segar.',r:[['2 bunga matahari',()=>nm('Bunga Matahari')>=2],['Solidago atau Statice',()=>nm('Solidago')+nm('Statice')>0],['Ruscus atau Eucalyptus',()=>nm('Ruscus')+nm('Eucalyptus')>0],['Pita putih atau cream',()=>nm('Pita Putih')+nm('Pita Cream')>0]]}];
function newOrder(){let o;do{o=ORD[Math.floor(Math.random()*ORD.length)]}while(o===order);order=o;check()}
function check(){tot();const el=document.getElementById('order');el.innerHTML='<h2>Pesanan: '+order.t+'</h2><p>'+order.d+'</p><ul>'+order.r.map(([l,f])=>'<li class="'+(f()?'ok':'')+'"><i>'+(f()?'✓':'')+'</i><span>'+l+'</span></li>').join('')+'</ul>'}
const imgs={},wim=WR.map(c=>{const i=new Image();i.src=c.src;return i});A.forEach(a=>{const i=new Image();i.src=a.src;imgs[a.id]=i});
function render(){const k=1.5,c=document.createElement('canvas');c.width=600*k;c.height=760*k;const xm=c.getContext('2d'),x=xm;x.scale(k,k);
const g=x.createRadialGradient(300,260,10,300,260,520);g.addColorStop(0,'#fff');g.addColorStop(1,'#fde6ec');x.fillStyle=g;x.fillRect(0,0,600,760);
const paper=(d,col)=>{const p=new Path2D(d);x.fillStyle=col;x.fill(p);x.strokeStyle='#0002';x.lineWidth=2;x.stroke(p)};
const dr=(it,X)=>{const x=X||xm;const a=G(it.id),b=B[a.cat],w=a.w*b*it.s,h=a.h*b*it.s,fl=['main','fill','leaf'].includes(a.cat);x.save();
const px=fl?it.x:it.x,py=fl?it.y:it.y;x.translate(px,py);x.rotate(it.r*Math.PI/180);x.scale(it.f,1);
const ox=fl?-a.ax*w:-w/2,oy=fl?-h:-h/2;x.drawImage(imgs[it.id],ox,oy,w,h);
if(it.tx&&it.t){const bx=a.box,fs=h*.17;x.font='600 '+fs+'px Caveat,cursive';x.fillStyle='#3a6b4d';x.textAlign='center';const cx=ox+(bx[0]+bx[2])/2*w,mw=(bx[2]-bx[0])*w;
const words=it.t.split(' ');let ln=[],cur='';words.forEach(wd=>{const t=cur?cur+' '+wd:wd;if(x.measureText(t).width>mw&&cur){ln.push(cur);cur=wd}else cur=t});ln.push(cur);
const y0=oy+(bx[1]+bx[3])/2*h-(ln.length-1)*fs*.5;ln.forEach((l,i)=>x.fillText(l,cx,y0+i*fs+fs*.3))}x.restore()};
const s=[...items].sort((a,b)=>a.z-b.z);const lo=s.filter(i=>i.z<500),hi=s.filter(i=>i.z>=500);
if(wr==null){paper(PB,PAP[pap][0]);lo.forEach(i=>dr(i));paper(PF,PAP[pap][1])}
else{const g=wg(wr);x.drawImage(wim[wr],g.l,g.t,g.w,WH);lo.forEach(i=>dr(i));x.save();x.translate(g.l,g.t);x.clip(new Path2D(wd(g.w,g.c)));x.drawImage(wim[wr],0,0,g.w,WH);x.restore()}
hi.forEach(i=>dr(i));return c.toDataURL('image/png')}
document.getElementById('done').onclick=()=>{select(null);const met=order.r.filter(([,f])=>f()).length,tot=order.r.length,n=met===0?0:Math.max(1,Math.round(3*met/tot));
document.getElementById('st').textContent='★'.repeat(n)+'☆'.repeat(3-n);
document.getElementById('rt').textContent=n===3?'Buket sempurna!':n===2?'Hampir pas, cantik sekali':n===1?'Manis, tapi belum sesuai':'Buketnya masih kosong';
document.getElementById('rd').textContent=met+' dari '+tot+' permintaan pesanan "'+order.t+'" terpenuhi.';
const bl=bill();document.getElementById('bill').innerHTML=bl.L.map(l=>'<div style="display:flex;justify-content:space-between;gap:10px"><span>'+l[0]+'</span><span>'+rp(l[1])+'</span></div>').join('')+'<div style="display:flex;justify-content:space-between;font-weight:800;color:var(--ink);border-top:1px solid var(--line);margin-top:4px;padding-top:4px"><span>Total</span><span>'+rp(bl.T)+'</span></div>';document.getElementById('ri').src=render();document.getElementById('dlg').showModal()};
document.getElementById('cl').onclick=()=>document.getElementById('dlg').close();
document.getElementById('clr').onclick=()=>{items.forEach(i=>i.e.remove());items=[];select(null);check()};
document.getElementById('nord').onclick=newOrder;
wpick();setWrap(0);tabs();select(null);newOrder();fit();
