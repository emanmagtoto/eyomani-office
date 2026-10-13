import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const W=40,D=28,GOLD=0xd4af37;
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();let ROOT=scene;scene.background=new THREE.Color(0xeae8e4);
const camera=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,0.1,500);
camera.position.set(-24,33,33);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(1,0,-1.5);controls.enableDamping=true;controls.maxPolarAngle=1.45;controls.update();
scene.add(new THREE.HemisphereLight(0xffffff,0x8a8a8a,1.2));
const sun=new THREE.DirectionalLight(0xffe9c8,1.6);sun.position.set(-15,40,25);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30});scene.add(sun);
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.6});
const black=M(0x151515),gold=new THREE.MeshStandardMaterial({color:GOLD,metalness:.8,roughness:.3}),white=M(0xf4f3f0),wood=M(0x9a6a3a);
const glass=new THREE.MeshStandardMaterial({color:0xbfe3ee,transparent:true,opacity:.25,roughness:.05});
function box(w,h,d,mat,x,y,z,p=ROOT){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m}
function cyl(r,h,mat,x,y,z,p=ROOT,r2=r){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r2,h,20),mat);m.position.set(x,y,z);m.castShadow=true;p.add(m);return m}
// floor (concrete texture)
{const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#a9a9a8';g.fillRect(0,0,512,512);
for(let i=0;i<9000;i++){g.fillStyle=`rgba(${Math.random()<.5?60:255},${Math.random()<.5?60:255},${Math.random()<.5?60:255},.05)`;g.fillRect(Math.random()*512,Math.random()*512,2,2)}
g.strokeStyle='rgba(0,0,0,.12)';for(let i=0;i<=512;i+=128){g.beginPath();g.moveTo(i,0);g.lineTo(i,512);g.moveTo(0,i);g.lineTo(512,i);g.stroke()}
const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(W/8,D/8);
const f=new THREE.Mesh(new THREE.BoxGeometry(W,.3,D),new THREE.MeshStandardMaterial({map:t,roughness:.8}));f.position.y=-.15;f.receiveShadow=true;ROOT.add(f)}
// walls: back(-z) and left(-x) tall, front/right low with windows
const WH=7;
box(W+.6,WH,.3,white,0,WH/2,-D/2);box(.3,WH,D,white,W/2,WH/2,0);
box(W+.6,.9,.3,white,0,.45,D/2);box(.3,.9,D,white,-W/2,.45,0);
function windows(alongX,fixed,from,to){for(let s=from;s<to;s+=2.2){const g=alongX?box(2,4.4,.12,glass,s+1,3.5,fixed+.2):box(.12,4.4,2,glass,fixed+.2,3.5,s+1);
const fr=alongX?box(.08,4.5,.16,black,s,3.5,fixed+.2):box(.16,4.5,.08,black,fixed+.2,3.5,s)}}
windows(true,-D/2,-19.6,-14.5);windows(false,W/2-.4,-1,12);
// labels
function labelTex(text,w=512,h=128,fs=64,bg='#0c0c0c',fg='#d4af37'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(5,5,w-10,h-10);g.fillStyle=fg;g.font=`bold ${fs}px Helvetica,Arial`;g.textAlign='center';g.textBaseline='middle';
let s=fs;while(g.measureText(text).width>w-40&&s>10){s-=2;g.font=`bold ${s}px Helvetica,Arial`}g.fillText(text,w/2,h/2+2);const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t}
function zoneSign(text,x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;ROOT.add(g);
box(.15,.9,.15,black,0,.45,0,g);box(3.4,.95,.15,black,0,1.3,0,g);
const p=new THREE.Mesh(new THREE.PlaneGeometry(3.3,.85),new THREE.MeshBasicMaterial({map:labelTex(text)}));p.position.set(0,1.3,.08);g.add(p);
const p2=p.clone();p2.rotation.y=Math.PI;p2.position.z=-.08;g.add(p2)}
function rail(x1,z1,x2,z2){const len=Math.hypot(x2-x1,z2-z1),a=Math.atan2(z2-z1,x2-x1);const g=new THREE.Group();g.position.set((x1+x2)/2,0,(z1+z2)/2);g.rotation.y=-a;ROOT.add(g);
box(len,.25,.18,white,0,.125,0,g);box(len,1.1,.06,glass,0,.8,0,g);box(len,.05,.08,black,0,1.37,0,g);for(let s=-len/2;s<=len/2+.01;s+=len/Math.ceil(len/2))box(.05,1.2,.08,black,s,.75,0,g)}
// furniture
function chair(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;ROOT.add(g);
cyl(.25,.08,black,0,.05,0,g);cyl(.04,.4,black,0,.3,0,g);box(.55,.1,.55,black,0,.52,0,g);box(.55,.65,.1,black,0,.9,.25,g);box(.5,.03,.03,gold,0,1.23,.27,g);return g}
const screens=[];
function monitor(x,y,z,rot,w=.8,p=ROOT){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;p.add(g);box(.05,.3,.05,black,0,.15,0,g);
const sm=new THREE.MeshStandardMaterial({color:0x10141c,emissive:0x1a3a6a,emissiveIntensity:.25});const s=box(w,.48,.05,sm,0,.5,0,g);screens.push(sm);return sm}
function desk(x,z,rot=0,w=2.2,d=1.1){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;ROOT.add(g);
box(w,.08,d,black,0,.76,0,g);box(w,.03,.03,gold,0,.74,d/2,g);box(.08,.72,d,black,-w/2+.05,.36,0,g);box(.08,.72,d,black,w/2-.05,.36,0,g);box(w-.2,.5,.05,black,0,.45,-d/2+.05,g);return g}
function cabinet(x,z,w,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;ROOT.add(g);box(w,1.2,.6,black,0,.6,0,g);for(let i=0;i<w/0.8-.5;i++)box(.65,.9,.02,wood,-w/2+.5+i*.8,.65,.31,g)}
function plant(x,z){cyl(.25,.5,black,x,.25,z,ROOT,.2);const l=new THREE.Mesh(new THREE.IcosahedronGeometry(.45,0),M(0x3f7a3a));l.position.set(x,.95,z);ROOT.add(l)}
function poster(x,y,z,rot,col,title){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;ROOT.add(g);box(1.2,1.6,.06,black,0,0,0,g);
const c=document.createElement('canvas');c.width=192;c.height=256;const q=c.getContext('2d');const gr=q.createLinearGradient(0,0,0,256);gr.addColorStop(0,col);gr.addColorStop(1,'#050505');q.fillStyle=gr;q.fillRect(0,0,192,256);
q.fillStyle='#d4af37';q.font='bold 22px Helvetica';q.textAlign='center';q.fillText(title,96,220);q.beginPath();q.arc(96,100,45,0,7);q.fill();
const p=new THREE.Mesh(new THREE.PlaneGeometry(1.05,1.45),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));p.position.z=.04;g.add(p);
const L=new THREE.PointLight(0xffd9a0,4,4);L.position.set(0,1.1,.5);g.add(L)}
// wall decor
poster(-12,3,-D/2+.2,0,'#5a1d1d','EYOMANI');poster(-1,3,-D/2+.2,0,'#3a2a10','NOIR');poster(W/2-.2,3,-11,-Math.PI/2,'#26304a','HORIZON');
{const p=new THREE.Mesh(new THREE.PlaneGeometry(7,1.5),new THREE.MeshBasicMaterial({map:labelTex('EYOMANI',1024,220,150,'#f4f3f0'),transparent:false}));p.position.set(W/2-.17,4.8,-3);p.rotation.y=-Math.PI/2;ROOT.add(p)}
// warm ceiling-less lights
[[-12,-6],[0,-6],[12,-6],[-12,6],[0,6],[12,6]].forEach(([x,z])=>{const L=new THREE.PointLight(0xffd6a8,10,16,1.6);L.position.set(x,6,z);ROOT.add(L)});

const agentDesk={};const meetSeats=[];
// MEETING ROOM (left)
{const x0=-14,z0=2;box(2.2,.1,8.5,black,x0,.78,z0);box(.04,.03,8.5,gold,x0+1.1,.76,z0);box(.04,.03,8.5,gold,x0-1.1,.76,z0);
box(.3,.74,6,black,x0,.37,z0);for(let i=0;i<5;i++){const zz=z0-3.4+i*1.7;chair(x0-1.5,zz,-Math.PI/2);chair(x0+1.5,zz,Math.PI/2);
meetSeats.push({x:x0-1.5,z:zz,ry:Math.PI/2},{x:x0+1.5,z:zz,ry:-Math.PI/2})}
plant(x0,z0+.4);rail(-9.5,-4,-9.5,5);rail(-19.8,-4,-9.5,-4);rail(-19.8,8,-12,8);zoneSign('MEETING ROOM',-14.5,9.2)}
// SUPERVISOR (top right, private)
{rail(8,-13.8,8,-6);rail(8,-6,19.8,-6);const rug=box(8,.02,5.5,M(0x8c7a64),14,.01,-10);
desk(14,-10,0,3.6,1.4);chair(14,-9.1,0);monitor(13.4,.8,-10.4,0);monitor(14.6,.8,-10.4,0);
agentDesk.Supervisor={x:14,z:-9.1,ry:Math.PI,sm:screens.at(-1)};zoneSign('SUPERVISOR',12,-5.2)}
// FINANCE
{desk(15,-1.5,0,3,1.2);chair(15,-.6,0);monitor(14.5,.8,-1.9,0);monitor(15.6,.8,-1.9,0);desk(15,2.6,0,3,1.2);chair(15,3.5,0);monitor(15,.8,2.2,0);
cabinet(19.4,1,3,-Math.PI/2);agentDesk.Finance={x:15,z:-.6,ry:Math.PI,sm:screens[screens.length-2]};zoneSign('FINANCE',15,5.2)}
// pods
const props={
 Videographer:(g)=>{const t=new THREE.Group();t.position.set(-1.8,0,0);g.add(t);for(let a=0;a<3;a++){const l=box(.04,1.4,.04,black,Math.cos(a*2.1)*.25,.68,Math.sin(a*2.1)*.25,t);l.rotation.z=Math.cos(a*2.1)*.18;l.rotation.x=-Math.sin(a*2.1)*.18}box(.4,.28,.22,black,0,1.5,0,t);cyl(.09,.2,M(0x333333),0,1.5,.2,t).rotation.x=Math.PI/2},
 Photographer:(g)=>{const t=new THREE.Group();t.position.set(-1.8,0,0);g.add(t);cyl(.03,1.7,black,0,.85,0,t);const sb=box(.9,.9,.12,new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xfff3dd,emissiveIntensity:.8}),0,1.9,.05,t);sb.rotation.x=.3},
 Editor:null,
 Writer:(g)=>{box(1.6,.9,.05,wood,0,1.6,-.6,g);['#f4e04d','#ff8a80','#80d8ff','#ccff90','#fff'].forEach((c,i)=>box(.22,.22,.02,M(new THREE.Color(c)),-.6+i*.3,1.6+(i%2)*.2,-.56,g))},
 Researcher:null,
 'Media Specialist':(g)=>{box(.12,.22,.02,black,.6,.82,.1,g);const r=new THREE.Mesh(new THREE.TorusGeometry(.3,.04,8,32),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1}));r.position.set(-1.6,1.6,0);g.add(r);cyl(.025,1.5,black,-1.6,.75,0,g)}
};
function pod(name,cx,cz,signRot=0){ // 4 desks: 2x2 back-to-back
 const pos=[[-1.15,-.6,0],[1.15,-.6,0],[-1.15,.6,Math.PI],[1.15,.6,Math.PI]];
 pos.forEach(([dx,dz,r],i)=>{const g=desk(cx+dx,cz+dz,r+Math.PI,2.2,1.1);
  const wide=name==='Editor';const sm=monitor(0,.8,.25,Math.PI,wide?1.7:.8,g);
  if(name==='Researcher'){monitor(-.6,.8,.3,Math.PI+.25,.6,g)}
  if(name==='Media Specialist'){box(.1,.2,.02,black,.5,.81,-.1,g)}
  const cz2=cz+dz+(dz<0?-1:1)*.95;chair(cx+dx,cz2,dz<0?Math.PI:0);
  if(i===((name==='Media Specialist'||name==='Researcher')?2:0)){agentDesk[name]={x:cx+dx,z:cz2,ry:dz<0?0:Math.PI,sm};}
 });
 if(name==='Researcher'){const tw=new THREE.Group();tw.position.set(cx,0,cz);ROOT.add(tw);box(.1,2,.1,black,0,1,0,tw);
  const c=document.createElement('canvas');c.width=256;c.height=128;const q=c.getContext('2d');q.fillStyle='#0b1420';q.fillRect(0,0,256,128);q.strokeStyle='#38e0a0';q.lineWidth=4;q.beginPath();
  for(let i=0;i<=16;i++)q.lineTo(i*16,110-i*5-Math.random()*25);q.stroke();const p=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));p.position.y=2.2;tw.add(p)}
 if(props[name]){const g=new THREE.Group();g.position.set(cx-1.2,0,cz);ROOT.add(g);props[name](g)}
 zoneSign(name.toUpperCase(),cx,cz+2.9,signRot)}
pod('Videographer',-4.5,-9.5);pod('Photographer',-4.5,-0.8);pod('Editor',3,-9.5);pod('Writer',3,-0.8);pod('Researcher',3,6.6);pod('Media Specialist',-4.5,6.6);
rail(-0.6,4.4,7,4.4);
// BLENDER (front-left desk)
{desk(-4.5,12.2,0,2.6,1.2);chair(-4.5,13.1,0);const sm=monitor(-4.5,.8,11.8,0,1.2);
 box(.25,.25,.25,new THREE.MeshStandardMaterial({color:0xf5792a,emissive:0xf5792a,emissiveIntensity:.35}),-3.6,.92,12,ROOT);
 agentDesk.Blender={x:-4.5,z:13.1,ry:Math.PI,sm};zoneSign('BLENDER',-0.6,12.2,Math.PI/2)}
// LOUNGE (bottom)
const cush=new THREE.MeshStandardMaterial({color:GOLD,roughness:.5});
function sofa(x,z,r,w=3){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r;ROOT.add(g);box(w,.45,1,black,0,.3,0,g);box(w,.7,.25,black,0,.75,-.4,g);box(.25,.6,1,black,-w/2,.45,0,g);box(.25,.6,1,black,w/2,.45,0,g);
  for(let i=0;i<w/1.2-.3;i++)box(.55,.45,.15,cush,-w/2+.7+i*1.1,.8,-.22,g)}
// lounge seats (idle agents rest here); ry = facing direction
const lounge1=[[8.6,10.7,Math.PI],[9.6,10.7,Math.PI],[10.6,10.7,Math.PI],[11.5,10.7,Math.PI],[7.3,8.5,Math.PI/2],[7.3,9.6,Math.PI/2],[12.7,8.5,-Math.PI/2],[12.7,9.6,-Math.PI/2],[9,7.75,0]].map(([x,z,ry])=>({x,z,ry}));
const lounge2=[[8.1,8.1,Math.PI],[9.2,8.1,Math.PI],[10.3,8.1,Math.PI],[6.6,6.1,Math.PI/2],[6.6,7.2,Math.PI/2]].map(([x,z,ry])=>({x,z,ry}));
{
 sofa(10,10.8,Math.PI,4);sofa(7,9,Math.PI/2,2.4);sofa(13,9,-Math.PI/2,2.4);box(1.6,.4,1,black,10,.2,9);box(1.6,.03,1,gold,10,.42,9);{const a=new THREE.Group();a.position.set(9,0,7.6);ROOT.add(a);box(1,.45,.9,black,0,.25,0,a);box(1,.6,.2,black,0,.7,-.4,a);box(.6,.12,.5,cush,0,.53,0,a)}plant(16,12);plant(5,12.5);
 rail(6.4,6.6,16,6.6);zoneSign('LOUNGE',11.8,7.1)}
// ===== FLOOR 2: PERSONAL PROJECTS =====
const FH=WH+.3,F2=new THREE.Group();F2.position.y=FH;scene.add(F2);ROOT=F2;const FW=26,FD=20;
{box(FW+.6,.3,FD+.3,M(0xb9b6b1),0,-.15,0,F2);const H2=4.2;
 box(FW+.6,H2,.3,white,0,H2/2,-FD/2,F2);box(.3,H2,FD,white,FW/2,H2/2,0,F2);box(FW+.6,.9,.3,white,0,.45,FD/2,F2);box(.3,.9,FD,white,-FW/2,.45,0,F2);
 box(FW+.6,.08,.32,gold,0,.02,FD/2+.01,F2);box(.32,.08,FD,gold,-FW/2-.01,.02,0,F2);
 for(let s=-FD/2+1;s<FD/2-2;s+=2.2){box(.12,2.4,2,glass,FW/2-.2,2,s+1,F2);box(.16,2.5,.08,black,FW/2-.2,2,s,F2)}
 const p=new THREE.Mesh(new THREE.PlaneGeometry(12,1.6),new THREE.MeshBasicMaterial({map:labelTex('PERSONAL PROJECTS · FLOOR 2',1536,200,110)}));p.position.set(-3,3,-FD/2+.17);F2.add(p);
 [[-6,-4],[6,-4],[-6,5],[6,5]].forEach(([x,z])=>{const L=new THREE.PointLight(0xffd6a8,8,14,1.6);L.position.set(x,3.6,z);F2.add(L)});
 poster(8,2.4,-FD/2+.2,0,'#1d3a5a','PERSONAL');plant(-FW/2+1,-FD/2+1);plant(FW/2-1,FD/2-1);plant(-FW/2+1,FD/2-1);plant(FW/2-1,-FD/2+1);
 // oval table
 const RX=6,RZ=2.3;const top=cyl(1,.1,black,0,.78,0,F2);top.scale.set(RX,1,RZ);const rim=cyl(1.01,.04,gold,0,.72,0,F2);rim.scale.set(RX,1,RZ);
 for(const x of[-3,0,3]){cyl(.12,.7,black,x,.37,0,F2);const b=cyl(.6,.04,black,x,.02,0,F2);b.scale.z=.6}
 const rug=box(16,.02,9,M(0x8c7a64),0,.01,0,F2);
 const seats=[['Personal Writer',-3,-1],['Personal Blender 1',3,-1],['Personal Blender 2',-4.2,1],['Personal Photographer',0,1],['Personal Videographer',4.2,1]];
 const tint={'Personal Writer':0xf4e04d,'Personal Blender 1':0xf5792a,'Personal Blender 2':0xf5792a,'Personal Photographer':0xffffff,'Personal Videographer':0xff5050};
 for(const [n,x,side] of seats){const ez=side*RZ*Math.sqrt(Math.max(0,1-(x/RX)**2));const cz=ez+side*.95;
  chair(x,cz,side<0?Math.PI:0);const sm=monitor(x,.83,ez-side*.55,side<0?0:Math.PI,.55,F2);
  box(.18,.18,.18,new THREE.MeshStandardMaterial({color:tint[n],emissive:tint[n],emissiveIntensity:.3}),x+.6,.92,ez-side*.45,F2);
  agentDesk[n]={x,z:cz,ry:side<0?0:Math.PI,sm,p:F2,f2:true}}
 // LOUNGE (floor 2)
 sofa(9.2,8.5,Math.PI,3.6);sofa(6.2,6.6,Math.PI/2,2.4);box(1.4,.4,.9,black,8.8,.2,6.4,F2);box(1.4,.03,.9,gold,8.8,.42,6.4,F2);
 box(5.6,.02,4,M(0x6e5f4e),8.6,.012,7,F2);zoneSign('LOUNGE',10.5,4.6)
 zoneSign('PERSONAL PROJECTS',-8.5,6.5)}
ROOT=scene;
// ROBOTS

function nameTex(a){const c=document.createElement('canvas');c.width=512;c.height=150;return c}
function drawLabel(r){const c=r.lc,g=c.getContext('2d');g.clearRect(0,0,512,150);g.fillStyle='rgba(10,10,10,.85)';g.beginPath();g.roundRect(4,4,504,142,18);g.fill();g.strokeStyle='#d4af37';g.lineWidth=4;g.stroke();
 const col={working:'#3ddc84',meeting:'#ffb020',idle:'#9aa0a6'}[r.status]||'#9aa0a6';g.fillStyle=col;g.beginPath();g.arc(36,48,16,0,7);g.fill();
 g.fillStyle='#d4af37';let nf=52;g.font='bold 52px Helvetica';while(g.measureText(r.name).width>430&&nf>24){nf-=2;g.font=`bold ${nf}px Helvetica`}g.fillText(r.name,62,66);g.fillStyle='#fff';g.font='bold 32px Helvetica';
 let t=`${r.status.toUpperCase()} · ${r.task}`;while(g.measureText(t).width>480)t=t.slice(0,-2);if(t.length<`${r.status.toUpperCase()} · ${r.task}`.length)t+='…';g.fillText(t,24,118);r.lt.needsUpdate=true}
const robots={};const bodyMat=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.15,clearcoat:1});
const faceMat=new THREE.MeshStandardMaterial({color:0x0a0d14,roughness:.2});const eyeMat=new THREE.MeshBasicMaterial({color:0x3fc8ff});
for(const name of Object.keys(agentDesk)){const d=agentDesk[name];const root=new THREE.Group();(d.p||scene).add(root);const b=new THREE.Group();root.add(b);
 const body=new THREE.Mesh(new THREE.SphereGeometry(.32,24,16),bodyMat);body.scale.set(1,1.1,.9);body.position.y=.85;body.castShadow=true;b.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.42,24,16),bodyMat);head.scale.set(1.1,.92,1);head.position.y=1.45;head.castShadow=true;b.add(head);
 const face=new THREE.Mesh(new THREE.SphereGeometry(.4,24,16,-0.9,1.8,0.95,1.2),faceMat);face.scale.set(1.12,.94,1.04);face.position.y=1.45;face.rotation.y=Math.PI/2- Math.PI/2;b.add(face);
 face.rotation.y=0;for(const ex of[-.13,.13]){const e=new THREE.Mesh(new THREE.SphereGeometry(.06,12,8),eyeMat);e.scale.set(1,1.3,.5);e.position.set(ex,1.47,.4);b.add(e)}
 cyl(.03,.18,gold,0,1.92,0,b);const tip=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),gold);tip.position.y=2.03;b.add(tip);
 const belt=new THREE.Mesh(new THREE.TorusGeometry(.3,.025,8,24),gold);belt.rotation.x=Math.PI/2;belt.position.y=.82;b.add(belt);
 for(const s of[-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.2,4,8),bodyMat);arm.position.set(s*.36,.85,.08);arm.rotation.x=-.9;b.add(arm)}
 const lc=document.createElement('canvas');lc.width=512;lc.height=150;const lt=new THREE.CanvasTexture(lc);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:lt,depthTest:true}));sp.scale.set(4.2,1.24,1);sp.position.y=2.75;sp.renderOrder=10;root.add(sp);
 if(d.f2)sp.scale.set(3.6,1.06,1);root.position.set(d.x,0,d.z);root.rotation.y=d.ry;if(name==='Supervisor'){sp.position.y=2.25;sp.position.z=-1.2}
 const r=robots[name]={name,root,b,lc,lt,sp,spY:sp.position.y,spS:sp.scale.x,status:'idle',task:'',home:d,target:{x:d.x,z:d.z,ry:d.ry},seat:null,phase:Math.random()*6};drawLabel(r)}
// status
{let i1=0,i2=0;for(const r of Object.values(robots))r.lounge=r.home.f2?lounge2[i2++%lounge2.length]:lounge1[i1++%lounge1.length];
 for(const r of Object.values(robots)){r.target={...r.lounge};r.root.position.set(r.lounge.x,0,r.lounge.z);r.root.rotation.y=r.lounge.ry}}
for(const r of Object.values(robots))if(r.name==='Supervisor'){r.lounge={x:r.home.x,z:r.home.z,ry:r.home.ry};r.target={...r.lounge};r.root.position.set(r.home.x,0,r.home.z);r.root.rotation.y=r.home.ry}
const SNAP=new URLSearchParams(location.search).has('snap');
const logl=document.getElementById('logl');
const GEN=st=>({working:'Working on a project',meeting:'In a meeting'})[st]||'Idle / in the lounge';
const IDLE_RE=/wait|ready|deliver|done|complete|locked|on hold|sent|swapped|approval|review|tracking|idle|paused|queued/i;
async function poll(){try{const s=await (await fetch('status.json?t='+Date.now(),{cache:'no-store'})).json();
 const used=new Set();for(const a of s.agents||[]){const r=robots[a.name];if(!r)continue;r.status=a.status||'idle';r.task=a.task||'';if(r.status==='idle'&&Date.now()-Date.parse(a.updated||0)<20*60e3&&r.task&&!IDLE_RE.test(r.task))r.status='working';r.task=GEN(r.status);drawLabel(r);
  if(r.status==='meeting'&&!r.home.f2){let i=r.seat!=null&&!used.has(r.seat)?r.seat:meetSeats.findIndex((_,k)=>!used.has(k)&&!Object.values(robots).some(o=>o!==r&&o.seat===k&&o.status==='meeting'));
   r.seat=i;used.add(i);const m=meetSeats[i];r.target={x:m.x,z:m.z,ry:m.ry}}else if(r.status==='working'){r.seat=null;r.target={x:r.home.x,z:r.home.z,ry:r.home.ry}}else{r.seat=null;r.target=r.name==='Supervisor'?{x:r.home.x,z:r.home.z,ry:r.home.ry}:{...r.lounge}}
  if(SNAP){r.root.position.set(r.target.x,0,r.target.z);r.root.rotation.y=r.target.ry}
  r.home.sm.emissiveIntensity=r.status==='working'?1.6:.25;r.home.sm.emissive.set(r.status==='working'?0x3fa8ff:0x1a3a6a)}
 logl.innerHTML=(s.log||[]).slice(-10).reverse().map(l=>`<li><b>${l.name}</b> · ${(l.time||'').slice(11,16)} — ${GEN(l.status)}</li>`).join('')}catch(e){console.warn(e)}}
poll();setInterval(poll,10000);
const clock=new THREE.Clock();
function loop(){const dt=Math.min(clock.getDelta(),.1),t=clock.elapsedTime;
 for(const r of Object.values(robots)){const p=r.root.position,dx=r.target.x-p.x,dz=r.target.z-p.z,dist=Math.hypot(dx,dz);
  if(dist>.05){const st=Math.min(dist,4*dt);p.x+=dx/dist*st;p.z+=dz/dist*st;r.root.rotation.y=Math.atan2(dx,dz);r.b.position.y=Math.abs(Math.sin(t*10))*.12}
  else{p.x=r.target.x;p.z=r.target.z;r.root.rotation.y=r.target.ry;const sp=r.status==='working'?6:2;r.b.position.y=Math.sin(t*sp+r.phase)*(r.status==='working'?.06:.04)}
  if(r.status==='working')r.home.sm.emissiveIntensity=1.2+Math.sin(t*4)*.4}
 for(const r of Object.values(robots)){const L=r.lounge&&r.name!=='Supervisor'&&r.target.x===r.lounge.x&&r.target.z===r.lounge.z;const li=L?(r.home.f2?lounge2:lounge1).indexOf(r.lounge):0;const k=L?.62:1;
  r.sp.scale.set(r.spS*k,r.spS*k*.295,1);r.sp.position.y=L?2.3+(li%2)*.75+(li>=4?.35:0):r.spY}
 controls.update();renderer.render(scene,camera);requestAnimationFrame(loop)}
loop();
// floor toggle
const VIEWS={'1':{p:[-24,33,33],t:[1,0,-1.5]},'2':{p:[-17,FH+24,24],t:[0,FH,0]},'all':{p:[-42,18,48],t:[1,FH*.6,0]}};
function setFloor(f){if(!VIEWS[f])f='1';const v=VIEWS[f];F2.visible=f!=='1';for(const o of scene.children)if(o!==F2&&!o.isLight&&!o.isCamera)o.visible=f!=='2';
 F2.traverse(o=>{if(o.isMesh)o.castShadow=f==='2'});const mob=innerWidth<innerHeight;camera.position.set(...(mob&&f==='1'?[-18,40,42]:v.p));controls.target.set(...(mob&&f==='1'?[3.5,0,1.5]:v.t));controls.update();
 document.querySelectorAll('#floors button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
 document.getElementById('hdr').textContent='EYOMANI STUDIO — '+{'1':'Floor 1','2':'Floor 2 · Personal Projects','all':'Building'}[f]}
document.querySelectorAll('#floors button').forEach(b=>b.onclick=()=>setFloor(b.dataset.f));
setFloor(new URLSearchParams(location.search).get('floor')||'1');
const fitFov=()=>{camera.fov=innerWidth<innerHeight?62:32};fitFov();camera.updateProjectionMatrix();if(innerWidth<760)document.getElementById('log').classList.add('c');
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;fitFov();camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

// ===== STAT BOARDS =====
const CAM_ROT=Math.atan2(camera.position.x,camera.position.z);
function makeBoard(w,h,px,x,y,z,rot,stand){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
 if(stand){box(.15,y,.15,black,-w/3,y/2,0,g);box(.15,y,.15,black,w/3,y/2,0,g);box(w*.8,.06,.6,black,0,.03,0,g)}
 box(w+.2,h+.2,.12,black,0,y+h/2,-.04,g);box(w+.24,.04,.14,gold,0,y+h+.1,-.04,g);box(w+.24,.04,.14,gold,0,y-.1,-.04,g);
 const c=document.createElement('canvas');c.width=px;c.height=Math.round(px*h/w);const t=new THREE.CanvasTexture(c);t.anisotropy=8;t.colorSpace=THREE.SRGBColorSpace;
 const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));p.position.set(0,y+h/2,.03);g.add(p);return {c,t,key:''}}
const fmtN=v=>(Number(v)||0).toLocaleString('en-US',{maximumFractionDigits:2});
const fmt$=v=>'$'+(Number(v)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function drawBoard(b,s){const key=JSON.stringify(s);if(key===b.key)return;b.key=key;
 const P=s.project||{},ph=s.photographer||{},v=s.videographer||{};
 const c=b.c,g=c.getContext('2d'),W2=c.width,H2=c.height;g.fillStyle='#050505';g.fillRect(0,0,W2,H2);g.strokeStyle='#d4af37';g.lineWidth=12;g.strokeRect(8,8,W2-16,H2-16);
 const head=(t,x,y,w)=>{g.fillStyle='#d4af37';let f=64;g.font=`bold ${f}px Helvetica`;while(g.measureText(t).width>w-10){f-=2;g.font=`bold ${f}px Helvetica`}g.textAlign='left';g.fillText(t,x,y);g.fillRect(x,y+16,w,5)};
 const row=(k,val,x,y,w)=>{g.textAlign='left';g.fillStyle='#d4af37';g.font='bold 42px Helvetica';g.fillText(k,x,y);g.textAlign='right';g.fillStyle='#fff';g.font='bold 64px Helvetica';g.fillText(val,x+w,y)};
 const sep=x=>{g.fillStyle='#d4af37';g.fillRect(x,40,4,H2-80)};
 // PROJECT column
 const X=50,PW=860;head('PROJECT',X,90,PW);
 g.fillStyle='#fff';g.font='bold 62px Helvetica';g.textAlign='left';let n=P.name?'Current project':'No active project';while(g.measureText(n).width>PW)n=n.slice(0,-2);g.fillText(n,X,180);
 const pct=Math.max(0,Math.min(100,Number(P.completion_pct)||0));const by=210,bh=64;g.fillStyle='#222';g.fillRect(X,by,PW,bh);g.fillStyle='#d4af37';g.fillRect(X,by,PW*pct/100,bh);
 g.strokeStyle='#d4af37';g.lineWidth=3;g.strokeRect(X,by,PW,bh);g.font='bold 46px Helvetica';g.textAlign='center';g.fillStyle=pct>50?'#000':'#fff';g.fillText(fmtN(pct)+'% COMPLETE',X+PW/2,by+49);
 row('Credits used',fmtN(P.credits_used),X,375,PW);row('Cost',fmt$(P.cost_usd),X,465,PW);row('Revenue',fmt$(P.revenue_usd),X,555,PW);
 sep(950);const CW=480,X2=990,X3=X2+CW+40;sep(X3-20);
 head('PHOTOGRAPHER',X2,90,CW);
 const big=(k,val,x,y)=>{g.textAlign='left';g.fillStyle='#d4af37';g.font='bold 42px Helvetica';g.fillText(k,x,y);g.fillStyle='#fff';g.font='bold 78px Helvetica';g.fillText(val,x,y+82)};
 big('Images generated',fmtN(ph.images_generated),X2,200);big('Credits used',fmtN(ph.credits_used),X2,400);
 head('VIDEOGRAPHER',X3,90,CW);
 big('Seconds generated',fmtN(v.seconds_generated),X3,190);big('Generations',fmtN(v.generations),X3,340);big('Credits used',fmtN(v.credits_used),X3,490);
 b.t.needsUpdate=true}
const supB=makeBoard(11,3.3,2040,14.1,.45,-13.78,0,false);
function renderStats(s){drawBoard(supB,s)}
renderStats({});
async function pollStats(){try{renderStats(await (await fetch('stats.json?t='+Date.now(),{cache:'no-store'})).json())}catch(e){console.warn(e)}}
pollStats();setInterval(pollStats,10000);

// ===== DOCS PANEL =====
const DOCS={
 Photographer:{docs:['studio-docs/eyomani-locked-prompt-templates.md','studio-docs/shot-maker.md','studio-docs/cinema-lens-optics-cheat-sheet.md']},
 Videographer:{docs:['studio-docs/seedance-maker-v2.md','studio-docs/previs-reference-prompt-block.md (BLOCKING MASTER v2, via other docs)','studio-docs/user-prompt-examples/ (via other docs)']},
 Editor:{docs:['studio-docs/sound-maker.md','studio-docs/editor/ (scripts)','Output: projects/<project>/edit/']},
 'Media Specialist':{docs:['studio-docs/launch-maker.md','Office status script']},
 Writer:{docs:['studio-docs/story-planner.md'],warn:'Setup points to the long story planner; should use story-planner-short.md'}};
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]);
const dp=document.createElement('div');dp.id='docs';dp.style.display='none';document.body.appendChild(dp);
function openDocs(n){const d=DOCS[n]||{docs:[]};dp.innerHTML=`<button id="docsx" aria-label="Close">✕</button><h4>${esc(n)}</h4>`+
 (d.warn?`<div class="warn">⚠ ${esc(d.warn)}</div>`:'')+(d.docs.length?`<ul>${d.docs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="none">No docs listed</p>');
 dp.style.display='block';dp.querySelector('#docsx').onclick=e=>{e.stopPropagation();dp.style.display='none'}}
const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8)return;
 ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ptr,camera);
 const vis=Object.values(robots).filter(r=>{let o=r.root;while(o){if(!o.visible)return false;o=o.parent}return true});
 const hits=ray.intersectObjects(vis.map(r=>r.root),true);
 if(hits.length){let o=hits[0].object;const r=vis.find(r=>{let p=o;while(p){if(p===r.root)return true;p=p.parent}return false});if(r){openDocs(r.name);return}}
 dp.style.display='none'});
{const q=new URLSearchParams(location.search).get('doc');if(q)openDocs(q)}
