import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
const Q=new URLSearchParams(location.search), VIEW=Q.get('view')||'iso';
const L=80, D=44, H=22, X0=-L/2, X1=L/2, Z0=-D/2, Z1=D/2, MZ_H=11, MZ_X1=X0+15; const ZM=Z0+26;
const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
r.setPixelRatio(Math.min(devicePixelRatio,2)); r.setSize(innerWidth,innerHeight);
r.outputColorSpace=THREE.SRGBColorSpace; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.3;
r.shadowMap.enabled=true; r.shadowMap.type=THREE.PCFSoftShadowMap; document.body.appendChild(r.domElement);
const s=new THREE.Scene(); s.background=new THREE.Color(0x15120f);
const asp=innerWidth/innerHeight, F=VIEW==='stats'?18:VIEW==='break'?22:VIEW==='offices'?20:VIEW==='super'?10:33;
const cam=new THREE.OrthographicCamera(-F*asp,F*asp,F,-F,-300,400);
const tgt=VIEW==='stats'?new THREE.Vector3((MZ_X1+X1)/2,14,Z0):VIEW==='break'?new THREE.Vector3(2,3,10):VIEW==='offices'?new THREE.Vector3(2,3,-12):VIEW==='super'?new THREE.Vector3(-31,13,-12):new THREE.Vector3(1,8.5,3);
cam.position.copy(tgt).add(VIEW==='stats'?new THREE.Vector3(0,2,60):VIEW==='break'?new THREE.Vector3(30,38,60):VIEW==='offices'?new THREE.Vector3(26,44,60):VIEW==='super'?new THREE.Vector3(30,40,55):new THREE.Vector3(46,34,64)); cam.lookAt(tgt);
const ctl=new OrbitControls(cam,r.domElement); ctl.target.copy(tgt); ctl.update();
s.add(new THREE.HemisphereLight(0xffe2c4,0x2a221c,0.5));
const sun=new THREE.DirectionalLight(0xffd9b0,0.45); sun.position.set(30,60,45); sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,far:200}); sun.shadow.mapSize.set(2048,2048); sun.shadow.bias=-0.0005; s.add(sun);
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.8,...o});
const wall=M(0x7d756d), trimW=M(0x5e5852), concrete=M(0x4f4a45,{roughness:.22,metalness:.15});
const wood=M(0x8a6040,{roughness:.6}), woodL=M(0xb08458,{roughness:.6}), dark=M(0x1d1d20,{roughness:.4,metalness:.3});
const gold=M(0xd4af37,{metalness:.9,roughness:.25}), metal=M(0xbfbfbf,{metalness:.8,roughness:.3});
const amber=new THREE.MeshBasicMaterial({color:0xffb45a}), cyan=new THREE.MeshBasicMaterial({color:0x66e6ff});
const glass=new THREE.MeshPhysicalMaterial({color:0xd8f0ff,transparent:true,opacity:.32,roughness:.05,metalness:.1,depthWrite:false});
const frost=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.7,roughness:.9});
function box(w,h,d,m,x,y,z,sh=true){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=sh;s.add(b);return b;}
const glowX=(x0,x1,y,z,m=amber,t=.08)=>box(x1-x0,t,t,m,(x0+x1)/2,y,z,false);
const glowZ=(z0,z1,y,x,m=amber,t=.08)=>box(t,t,z1-z0,m,x,y,(z0+z1)/2,false);
const glowY=(y0,y1,x,z,m=amber,t=.08)=>box(t,y1-y0,t,m,x,(y0+y1)/2,z,false);
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
function plane(w,h,tex,x,y,z,ry=0,tr=false){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:tr,depthWrite:!tr,toneMapped:false}));m.position.set(x,y,z);m.rotation.y=ry;s.add(m);return m;}
// shell
box(300,.1,300,M(0x1d1a17),0,-1.05,0); box(L+1.2,1,D+1.2,trimW,0,-.5,0); box(L,.05,D,concrete,0,.025,0);
const T=.6;
box(L+T,H,T,wall,0,H/2,Z0-T/2); box(T,H,D+T,wall,X0-T/2,H/2,0);
box(T,H,3,wall,X1+T/2,H/2,Z0+1.5); box(T,1.4,D-3,wall,X1+T/2,.7,Z0+3+(D-3)/2);
box(L+T*2,1.0,T,wall,0,.5,Z1+T/2); box(T,H,2,wall,X0-T/2,H/2,Z1-1);
glowX(X0,X1,.12,Z0+.05); glowZ(Z0,Z1,.12,X0+.05); glowX(X0,X1,1.04,Z1+T); glowZ(Z0+3,Z1,1.44,X1+T);
glowX(X0,X1,H-.05,Z0+.05); glowY(0,H,X0+.05,Z0+.05); glowY(0,H,X0+.05,Z1-.05);
glowZ(Z0,Z1,H-.05,X0+.05); glowY(0,H,X1-.05,Z0+.05);
const deskW=M(0xe6e6e8,{roughness:.35}), cyanL=new THREE.MeshBasicMaterial({color:0x4ff0ff,toneMapped:false});
const uiTex=canvasTex(512,256,(g,w,h)=>{g.fillStyle='rgba(40,200,240,.28)';g.fillRect(0,0,w,h);g.strokeStyle='rgba(160,250,255,.95)';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);
 g.strokeStyle='rgba(170,250,255,.7)';g.lineWidth=3;for(let i=0;i<5;i++){g.beginPath();g.moveTo(24,40+i*22);g.lineTo(24+120+Math.random()*120,40+i*22);g.stroke();}
 g.beginPath();g.moveTo(260,200);for(let i=0;i<9;i++)g.lineTo(260+i*28,200-40*Math.abs(Math.sin(i*1.3))-i*8);g.stroke();
 g.fillStyle='rgba(190,250,255,.8)';for(let i=0;i<6;i++)g.fillRect(30+i*34,230-(20+i*13%60),20,20+i*13%60);});

const HUES=[[60,220,255],[40,240,200],[170,110,255]];
function holoTex(hi,kind){const [r,g0,b]=HUES[hi];return canvasTex(512,320,(g,w,h)=>{const c=(a)=>`rgba(${r},${g0},${b},${a})`;
 g.fillStyle=c(.22);g.fillRect(0,0,w,h);g.strokeStyle=c(1);g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);
 g.fillStyle=c(.9);g.fillRect(16,14,140,14);g.fillStyle=c(.5);g.fillRect(w-110,14,90,14);
 g.strokeStyle=c(.35);g.lineWidth=1.5;for(let y=60;y<h-10;y+=32){g.beginPath();g.moveTo(14,y);g.lineTo(w-14,y);g.stroke();}
 g.lineWidth=4;g.strokeStyle='rgba(235,255,255,.95)';
 if(kind===0){g.fillStyle=c(.85);for(let i=0;i<10;i++){const v=40+((i*37)%140);g.fillRect(30+i*46,h-24-v,28,v);}}
 else if(kind===1){g.beginPath();for(let i=0;i<=60;i++){const x=20+i*(w-40)/60,y=h*.6-Math.sin(i*.45)*50-Math.sin(i*1.7)*18;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.strokeStyle=c(.8);g.beginPath();for(let i=0;i<=60;i++){const x=20+i*(w-40)/60,y=h*.8-Math.sin(i*.9+1)*22;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
 else if(kind===2){g.fillStyle='rgba(235,255,255,.85)';for(let i=0;i<9;i++){const ind=(i%3)*24;g.fillRect(24+ind,52+i*28,90+((i*53)%220),9);g.fillStyle=i%2?c(.9):'rgba(235,255,255,.85)';}}
 else {g.beginPath();g.arc(w*.3,h*.58,80,0,Math.PI*2);g.stroke();g.strokeStyle=c(1);g.lineWidth=14;g.beginPath();g.arc(w*.3,h*.58,80,-Math.PI/2,Math.PI*.9);g.stroke();
  g.lineWidth=4;g.strokeStyle='rgba(235,255,255,.9)';g.beginPath();for(let i=0;i<=40;i++){const x=w*.55+i*5.5,y=h*.58+Math.sin(i*.8)*40*Math.exp(-i/30);i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
});}
const HT=[];for(let hi=0;hi<3;hi++)for(let k=0;k<4;k++)HT.push(holoTex(hi,k));
const kbTex=canvasTex(512,192,(g,w,h)=>{g.fillStyle='rgba(60,230,255,.25)';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,245,255,1)';g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);
 g.fillStyle='rgba(150,250,255,.9)';for(let r=0;r<4;r++)for(let k=0;k<14;k++)g.fillRect(14+k*35,16+r*42,28,32);});
function holoPanel(tex,w,h,x,y,z,ry,par=s){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.92,side:THREE.DoubleSide,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending}));
 m.position.set(x,y,z);m.rotation.y=ry;par.add(m);
 const e=new THREE.Mesh(new THREE.PlaneGeometry(w,.03),new THREE.MeshBasicMaterial({color:0xbff8ff,toneMapped:false}));e.position.set(x,y-h/2,z);e.rotation.y=ry;par.add(e);return m;}
function holoKb(x,y,z,w=1.5,d=.55,ry=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:kbTex,transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending}));m.rotation.set(-Math.PI/2,0,ry);m.position.set(x,y,z);s.add(m);}
function curvedDesk(x,y,z,Rr=2.6,ang=2.0,sc=1){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(sc);s.add(g);
 const a0=Math.PI/2-ang/2, a1=Math.PI/2+ang/2, Ro=Rr+1.3, sh=new THREE.Shape();
 sh.absarc(0,0,Ro,a0,a1,false); sh.absarc(0,0,Rr,a1,a0,true);
 const geo=new THREE.ExtrudeGeometry(sh,{depth:1.05,bevelEnabled:true,bevelSize:.12,bevelThickness:.08,bevelSegments:3,curveSegments:40}); geo.rotateX(-Math.PI/2);
 const m=new THREE.Mesh(geo,deskW); m.castShadow=m.receiveShadow=true; g.add(m);
 for(const [rad,yy] of [[Ro+.13,.06],[Rr-.13,1.12],[Ro+.13,1.12]]){const t=new THREE.TorusGeometry(rad,.035,6,64,ang);t.rotateZ(a0);t.rotateX(-Math.PI/2);const tm=new THREE.Mesh(t,cyanL);tm.position.y=yy;g.add(tm);}
 const gl=new THREE.PointLight(0x40e0ff,4,6,1.8);gl.position.set(0,.6,-Rr-.6);g.add(gl);
 for(const c of [-.48,0,.48]){const sg=new THREE.CylinderGeometry(Rr+.55,Rr+.55,1.0,24,1,true,Math.PI+c-.2,.4);
  const sm=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:uiTex,transparent:true,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));sm.position.y=2.0;g.add(sm);}
 return g;}
function modernChair(x,y,z,ry=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;s.add(g);const k=M(0x2a2c30,{roughness:.6}), mt=M(0x9a9da3,{metalness:.8,roughness:.3});
 const add=(geo,mm,px,py,pz,rx=0)=>{const o=new THREE.Mesh(geo,mm);o.position.set(px,py,pz);o.rotation.x=rx;o.castShadow=true;g.add(o);};
 add(new THREE.BoxGeometry(1.1,.18,1.05),k,0,.78,0); add(new THREE.BoxGeometry(1.0,1.3,.14),k,0,1.55,.5,-.12); add(new THREE.BoxGeometry(.6,.25,.12),k,0,2.25,.58,-.12);
 add(new THREE.CylinderGeometry(.06,.06,.6,8),mt,0,.42,0); for(let i=0;i<5;i++){const o=new THREE.Mesh(new THREE.BoxGeometry(.08,.05,.65),mt);o.position.set(Math.sin(i*1.2566)*.32,.1,Math.cos(i*1.2566)*.32);o.rotation.y=i*1.2566;g.add(o);}
 for(const sx of [-.58,.58]){add(new THREE.BoxGeometry(.08,.08,.7),mt,sx,1.15,0);add(new THREE.BoxGeometry(.06,.35,.06),mt,sx,.95,.2);}
 return g;}
// ===== mezzanine =====
const zs=ZM-5.5, mzc=(Z0+zs)/2, mzd=zs-Z0;
const sw=3.6, run=.55, steps=20, ztop=ZM-1-steps*run;
box(MZ_X1-X0-sw,1.1,mzd,M(0x857d75),(X0+sw+MZ_X1)/2,MZ_H-.55,mzc);
box(sw,1.1,ztop-Z0,M(0x857d75),X0+sw/2,MZ_H-.55,(Z0+ztop)/2);
glowX(X0+sw,MZ_X1,MZ_H-.5,zs+.02); glowZ(Z0,zs,MZ_H-.5,MZ_X1+.02); glowX(X0+sw,MZ_X1,MZ_H-1.05,zs+.02); glowZ(Z0,zs,MZ_H-1.05,MZ_X1+.02); glowZ(ztop,zs,MZ_H-.5,X0+sw-.02);
box(.06,1.4,mzd,glass,MZ_X1-.1,MZ_H+.7,mzc,false); box(.1,.08,mzd,metal,MZ_X1-.1,MZ_H+1.42,mzc);
box(MZ_X1-X0-sw,1.4,.06,glass,(X0+sw+MZ_X1)/2,MZ_H+.7,zs-.05,false); box(MZ_X1-X0-sw,.08,.1,metal,(X0+sw+MZ_X1)/2,MZ_H+1.42,zs-.05);
box(.06,1.4,zs-ztop,glass,X0+sw+.05,MZ_H+.7,(zs+ztop)/2,false); box(.1,.08,zs-ztop,metal,X0+sw+.05,MZ_H+1.42,(zs+ztop)/2);
for(let i=0;i<steps;i++){const y=(i+1)*MZ_H/steps, z=ZM-1-(i+.5)*run; box(sw-.2,.2,run,M(0x6e5f52,{roughness:.6}),X0+sw/2,y-.1,z); glowX(X0+.1,X0+sw-.1,y-.21,z+run/2,amber,.03);}
{const len=Math.hypot(steps*run,MZ_H), g=new THREE.Mesh(new THREE.BoxGeometry(.05,1.1,len),glass); g.position.set(X0+sw,MZ_H/2+.6,ZM-1-steps*run/2); g.rotation.x=Math.atan2(MZ_H,steps*run); s.add(g);}
glowY(0,MZ_H,X0+.06,ZM-1,amber,.05);
{const fp=new THREE.PointLight(0xffd7a0,25,16,1.6);fp.position.set((X0+sw+MZ_X1)/2,MZ_H-1.5,Z0+6);s.add(fp);}
// upper level: warm back panels + cove
box(MZ_X1-X0-.4,8,.1,M(0x5c4c3e),(X0+MZ_X1)/2,MZ_H+4.5,Z0+.45); glowX(X0+.3,MZ_X1-.3,H-.4,Z0+.15);
box(.1,8,mzd-.4,M(0x6f655b),X0+.06,MZ_H+4.5,mzc);
const signT=canvasTex(1024,256,(g,w,h)=>{g.fillStyle='#0c0c0c';g.fillRect(0,0,w,h);g.strokeStyle='#d4af37';g.lineWidth=10;g.strokeRect(8,8,w-16,h-16);
 g.fillStyle='#d4af37';g.font='bold 150px Helvetica,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('EYOMANI',w/2+60,h/2+8);
 g.beginPath();g.moveTo(130,60);g.lineTo(190,128);g.lineTo(130,196);g.lineTo(70,128);g.closePath();g.fill();});
plane(8,2,signT,(X0+MZ_X1)/2,MZ_H+5,Z0+.53);
{const dx=(X0+MZ_X1)/2, dz=Z0+4.5, y=MZ_H;
 
 const cx=X0+3.6+(MZ_X1-X0-3.6)/2+.3, cz=-9.6, silver=M(0xdfe2e6,{roughness:.25,metalness:.35});
 box(10.6,.04,9.5,M(0x3a3936,{roughness:.35,metalness:.2}),cx,y+.03,cz-1);
 const seg=(w,d,px,pz)=>{const t=new THREE.Mesh(new RoundedBoxGeometry(w,.18,d,3,.08),silver);t.position.set(px,y+1.15,pz);t.castShadow=true;s.add(t);
  const bd=new THREE.Mesh(new RoundedBoxGeometry(w-.3,1.0,d-.4,3,.12),silver);bd.position.set(px,y+.55,pz);bd.castShadow=true;s.add(bd);};
 seg(7.6,1.6,cx,cz-3.0); seg(1.6,4.6,cx-3.0,cz-.4); seg(1.6,4.6,cx+3.0,cz-.4);
 // cyan edge trim (inner top edges) + amber under-glow
 box(6.0,.04,.04,cyanL,cx,y+1.25,cz-2.2,false); box(.04,.04,4.6,cyanL,cx-2.2,y+1.25,cz-.4,false); box(.04,.04,4.6,cyanL,cx+2.2,y+1.25,cz-.4,false);
 box(7.6,.04,.04,cyanL,cx,y+1.25,cz-3.8,false); box(.04,.04,6.2,cyanL,cx-3.8,y+1.25,cz-1.2,false); box(.04,.04,6.2,cyanL,cx+3.8,y+1.25,cz-1.2,false);
 box(.04,.04,1.6,cyanL,cx-3,y+1.25,cz+1.9,false); box(.04,.04,1.6,cyanL,cx+3,y+1.25,cz+1.9,false);
 box(7.2,.05,.05,amber,cx,y+.06,cz-3.62,false); box(.05,.05,4.4,amber,cx-3.62,y+.06,cz-.4,false); box(.05,.05,4.4,amber,cx+3.62,y+.06,cz-.4,false);
 box(.05,.05,4.0,amber,cx-2.38,y+.06,cz-.2,false); box(.05,.05,4.0,amber,cx+2.38,y+.06,cz-.2,false); box(4.6,.05,.05,amber,cx,y+.06,cz-2.38,false);
 const ug=new THREE.PointLight(0xffa850,8,6,1.8);ug.position.set(cx,y+.4,cz-1);s.add(ug);
 // premium chair
 const ch=modernChair(cx,y,cz+.2,0); ch.scale.setScalar(1.15);
 // 9 hologram screens arcing around the chair
 {const Rr=4.1, PW=2.0, PH=1.3, st=PW*1.04/Rr, oz=cz+.2;
  const tier=(n,yy,off)=>{for(let i=0;i<n;i++){const t=(i-(n-1)/2)*st, px=cx+Math.sin(t)*Rr, pz=oz-Math.cos(t)*Rr;
   const hi=(Math.abs(i-(n-1)/2)<.6)?2:((i+off)%2); holoPanel(HT[hi*4+((i+off)%4)],PW,PH,px,yy,pz,-t);}};
  tier(5,y+2.35,0); tier(4,y+2.35+PH+.06,1);}
 const sl=new THREE.PointLight(0x60e0ff,10,9,1.7);sl.position.set(cx,y+2.8,cz-2);s.add(sl);
 const sp=new THREE.PointLight(0xb070ff,5,7,1.8);sp.position.set(cx-3,y+3,cz);s.add(sp);
 holoKb(cx,y+1.26,cz-2.75,2.2,.7); holoKb(cx-3,y+1.26,cz-.4,1.1,.5,Math.PI/2); holoKb(cx+3,y+1.26,cz-.4,1.1,.5,-Math.PI/2);
 // glowing square floor light
 box(1.6,.05,1.6,new THREE.MeshBasicMaterial({color:0xfff0d0,toneMapped:false}),cx,y+.06,cz+3.4,false);
 box(2.0,.03,2.0,M(0x9a9da3,{metalness:.8,roughness:.3}),cx,y+.04,cz+3.4,false);
 const fl=new THREE.PointLight(0xffe2b0,6,6,1.8);fl.position.set(cx,y+.8,cz+3.4);s.add(fl);
 // wall TV on low media unit (left wall), sofa + coffee table
 box(.9,.9,5,M(0x2b2723),X0+.6,y+.45,-17.5); box(.05,.05,5,amber,X0+1.06,y+.06,-17.5,false);
 box(.12,2.6,4.4,dark,X0+.25,y+3.0,-17.5); box(.02,2.4,4.2,M(0x112233,{emissive:0x3a6bd5,emissiveIntensity:.8}),X0+.32,y+3.0,-17.5,false);
 // strip lighting
 glowX(X0+3.6,MZ_X1,y+.05,zs-.25,amber,.05); glowZ(Z0+.3,zs,y+.05,MZ_X1-.25,amber,.05);
 glowX(X0+3.6,MZ_X1,y+1.5,zs-.05,cyanL,.05); glowZ(Z0,zs,y+1.5,MZ_X1-.1,cyanL,.05);
 glowX(X0+.3,MZ_X1-.3,y+8.4,Z0+.55,cyanL,.05);}
// ===== offices =====
function plant(x,z,y=0,sc=1){box(.7*sc,.9*sc,.7*sc,M(0xeeeeee),x,y+.45*sc,z);const lv=M(0x3f6b35);
 for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.25*sc,1.4*sc,5),lv);c.position.set(x+Math.cos(i)*.25*sc,y+1.5*sc,z+Math.sin(i)*.25*sc);c.rotation.set(Math.sin(i)*.4,0,Math.cos(i)*.4);c.castShadow=true;s.add(c);}}
function chair(x,z,face,col=dark){box(1,.12,1,col,x,.7,z);box(1,1.1,.12,col,x,1.25,z-face*.45);box(.1,.65,.1,metal,x,.33,z);}
function label(text,x,y,z){const t=canvasTex(768,192,(g,w,h)=>{g.fillStyle='#0a2a44';g.fillRect(0,0,w,h);g.strokeStyle='#7ff0ff';g.lineWidth=8;g.strokeRect(6,6,w-12,h-12);
 g.fillStyle='#e6fdff';g.shadowColor='#7ff0ff';g.shadowBlur=14;g.font='bold 104px Helvetica,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+4);});
 plane(5.6,1.4,t,x,y,z);}
const miniHolo=canvasTex(256,160,(g,w,h)=>{g.fillStyle='rgba(30,170,220,.45)';g.fillRect(0,0,w,h);g.strokeStyle='#9ff4ff';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);
 g.fillStyle='#d8fbff';[40,80,60,110,90].forEach((v,i)=>g.fillRect(30+i*42,h-20-v,24,v));});
function station(x,z){
 const top=new THREE.Mesh(new RoundedBoxGeometry(4.4,.16,2,3,.07),deskW); top.position.set(x,1.12,z); top.castShadow=top.receiveShadow=true; s.add(top);
 const body=new THREE.Mesh(new RoundedBoxGeometry(4.0,1.0,1.4,3,.12),deskW); body.position.set(x,.52,z-.2); body.castShadow=true; s.add(body);
 box(4.4,.035,.035,cyanL,x,1.2,z+1.0,false); box(4.0,.035,.035,cyanL,x,.05,z+.52,false); box(.035,.035,1.9,cyanL,x-2.2,1.2,z,false); box(.035,.035,1.9,cyanL,x+2.2,1.2,z,false);
 const gl=new THREE.PointLight(0x40e0ff,2.5,4,1.8); gl.position.set(x,.3,z+1.2); s.add(gl);
 { const cz=z+1.7, Rr=2.1, angs=[-.62,-.21,.21,.62];
  const PW=1.15, st=PW*1.04/Rr;
  for(let i=0;i<4;i++){const t=(i-1.5)*st, px=x+Math.sin(t)*Rr, pz=cz-Math.cos(t)*Rr; const tex=HT[[0,8,8,4][i]+[1,2,2,1][i]];
   holoPanel(tex,PW,.75,px,2.05,pz,-t);}
  const gl2=new THREE.PointLight(0x50e8ff,3,5,1.8); gl2.position.set(x,2.1,z-.2); s.add(gl2);}
 holoKb(x,1.23,z+.4);
 modernChair(x,0,z+1.7,0);}
function office(x0,x1,z0,z1,name,n,wallH=5){
 const cx=(x0+x1)/2, cz=(z0+z1)/2, w=x1-x0;
 box(w,.04,z1-z0,M(0x5a534c,{roughness:.5}),cx,.06,cz);
 box(w*.6,.03,(z1-z0)*.55,M(0x6b625a,{roughness:1}),cx,.09,cz+.6);
 // back wood panel & side walls
 box(w,wallH,.15,wood,cx,wallH/2,z0+.1); box(.25,wallH,z1-z0,woodL,x0,wallH/2,cz); box(.25,wallH,z1-z0,M(0x8c847b),x1,wallH/2,cz);
 glowX(x0,x1,wallH,z1,amber,.05); glowZ(z0,z1,wallH,x0,amber,.05); glowZ(z0,z1,wallH,x1,amber,.05);
 // glass front with frosted band, door gap
 const dw=1.8, dx=x1-1.6;
 box(dx-dw/2-x0,wallH,.06,glass,(x0+dx-dw/2)/2,wallH/2,z1,false); box(dx-dw/2-x0,.6,.07,frost,(x0+dx-dw/2)/2,2.2,z1,false);
 box(x1-(dx+dw/2),wallH,.06,glass,(x1+dx+dw/2)/2,wallH/2,z1,false);
 const door=box(dw,wallH-.6,.05,glass,dx,(wallH-.6)/2,z1+.15,false); box(dw,.5,.06,frost,dx,2.2,z1+.15,false); box(.05,1,.08,metal,dx-dw/2+.2,1.6,z1+.2);
 box(w,.15,.15,metal,cx,wallH,z1);
 // desk stations
 const cols=n===4?2:3, rows=Math.ceil(n/cols), sp=w/(cols+0.4), rz=[z0+4.6,z0+10.4];
 let k=0; for(let r=0;r<rows;r++){const inRow=Math.min(cols,n-r*cols); for(let c=0;c<inRow;c++){const xx=cx+(c-(inRow-1)/2)*sp; station(xx,rz[r]); k++;}}
 const pl=new THREE.PointLight(0xffc98a,8,16,1.8); pl.position.set(cx,wallH-1,z0+8); s.add(pl);
 // credenza + small seating corner at front
 box(w-3,.9,.8,M(0xe6e6e8,{roughness:.35}),cx,.45,z0+.65); box(w-3,.04,.04,cyanL,cx,.1,z0+1.07,false);
 const sx=cx, sz=z1-3.2, sof=M(0x8f9296,{roughness:1});
 box(10,.03,4.6,M(0x4a443e,{roughness:1}),sx,.1,sz);
 box(5.5,.8,1.6,sof,sx,.4,sz-1.3); box(5.5,.9,.45,sof,sx,1.2,sz-1.95);
 box(1.6,.8,1.6,sof,sx-3.8,.4,sz+.2); box(1.6,.8,1.6,sof,sx+3.8,.4,sz+.2);
 box(2.4,.08,1.2,M(0x222222,{metalness:.5,roughness:.2}),sx,.6,sz+.3); box(.1,.5,.1,metal,sx,.3,sz+.3);
 plant(x0+1,z1-1.2); plant(x1-1,z1-1.2); plant(x0+1,z0+1.3,0,.9); plant(x1-1,z0+1.3,0,.9);
 const pl2=new THREE.PointLight(0xffb070,8,10,1.6); pl2.position.set(sx,3,sz); s.add(pl2);
 glowX(x0,x1,.1,z1-.1,amber,.05); glowZ(z0,z1,.1,x0+.2,amber,.04); glowZ(z0,z1,.1,x1-.2,amber,.04);
 label(name,cx,3.4,z1+.12);}
const OG=.3, OXS=X0+4.2, OW=(X1-.2-OXS-2*OG)/3, OX=[0,1,2].map(i=>OXS+i*(OW+OG));
office(OX[0],OX[0]+OW,Z0+.3,Z0+20,'PERSONAL',6);
office(OX[1],OX[1]+OW,Z0+.3,Z0+20,'STUDIO',5);
office(OX[2],OX[2]+OW,Z0+.3,Z0+20,'FINANCE',4);

// ===== BREAK ROOM (open front floor) =====
function G(x,z,ry=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;s.add(g);return g;}
function gb(g,w,h,d,m,x,y,z,sh=true){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=sh;g.add(b);return b;}
function gc(g,rt,rb,h,m,x,y,z,seg=16){const c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),m);c.position.set(x,y,z);c.castShadow=true;g.add(c);return c;}
const fab=M(0xcfc6ba,{roughness:.95}), fab2=M(0x8d8882,{roughness:.95}), cush=M(0xe9ddc8,{roughness:1}), black=M(0x161616,{roughness:.5});
const glassTop=M(0x222222,{metalness:.5,roughness:.15});
// sofa facing +z in local space (seat width w)
function sofa(g,w,x,z,m=fab,ry=0){const k=G(0,0,0);g.add(k);k.position.set(x,0,z);k.rotation.y=ry;
 gb(k,w,.8,2,m,0,.4,0); gb(k,w,1.1,.6,m,0,1.15,-.75); gb(k,.5,1.0,2,m,-w/2+.25,.75,0); gb(k,.5,1.0,2,m,w/2-.25,.75,0);
 for(let t=-w/2+1.2;t<w/2-.6;t+=1.6)gb(k,1.2,.5,.3,cush,t,1.15,-.35);return k;}
function armchair(g,x,z,ry,m=fab2){const k=G(0,0,0);g.add(k);k.position.set(x,0,z);k.rotation.y=ry;gb(k,1.8,.75,1.8,m,0,.38,0);gb(k,1.8,1,.45,m,0,1.1,-.7);gb(k,.4,.9,1.8,m,-.7,.7,0);gb(k,.4,.9,1.8,m,.7,.7,0);}
function beanbag(x,z,c){const b=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),M(c,{roughness:1}));b.scale.set(1,.6,1);b.position.set(x,.55,z);b.castShadow=true;s.add(b);}
function floorLamp(x,z){const g=G(x,z);gc(g,.4,.45,.08,gold,0,.04,0);gc(g,.05,.05,4.2,gold,0,2.1,0);const sh=gc(g,.5,.75,.8,new THREE.MeshStandardMaterial({color:0xfff1d6,emissive:0xffc070,emissiveIntensity:.9}),0,4.4,0);
 const l=new THREE.PointLight(0xffb070,22,12,1.7);l.position.set(0,4,0);g.add(l);}
function pendant(x,z,y=6.5){const g=G(x,z);gc(g,.02,.02,H-1-y,metal,0,(H-1+y)/2,0,6);gc(g,.25,.6,.6,M(0x1d1d20,{metalness:.6,roughness:.3}),0,y,0);
 const bulb=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8),new THREE.MeshBasicMaterial({color:0xffd59a}));bulb.position.set(0,y-.3,0);g.add(bulb);
 const l=new THREE.PointLight(0xffc98a,10,12,1.7);l.position.set(0,y-.6,0);g.add(l);}
function rug(w,d,x,z,c){box(w,.04,d,M(c,{roughness:1}),x,.07,z);}
// amber floor inlay dividing zones (subtle)
const plush=M(0x8f9296,{roughness:1}), plushD=M(0x6d7074,{roughness:1});
// --- GAMES (compact cluster, left) ---
rug(19,19,-30,10.5,0x3d3833);
glowX(-39.5,-20.5,.1,1,amber,.05); glowZ(1,20,.1,-20.5,amber,.05);
{const g=G(-29.5,14.5);gb(g,5.6,.12,3.1,M(0x1f4f6b,{roughness:.5}),0,1.55,0);gb(g,5.62,.03,.06,M(0xffffff),0,1.62,0,false);gb(g,.03,.02,3.1,M(0xffffff),0,1.62,0,false);
 gb(g,.06,.35,3.3,M(0xf5f5f5,{transparent:true,opacity:.7}),0,1.78,0,false);
 for(const [a2,b2] of [[-2.4,-1.2],[2.4,-1.2],[-2.4,1.2],[2.4,1.2]])gb(g,.15,1.5,.15,black,a2,.75,b2);
 for(const sx of [-1.8,1.8]){gc(g,.32,.32,.04,M(0xc0392b),sx,1.64,.7);gb(g,.08,.03,.4,woodL,sx,1.64,1.05);}
 const bl=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),M(0xffffff));bl.position.set(.9,1.9,-.3);g.add(bl);}
{const g=G(-27,6.5);gb(g,3,.9,1.7,M(0xd8d8da),0,1.45,0);gb(g,2.8,.05,1.5,M(0x2e7d32,{roughness:.8}),0,1.92,0,false);
 for(const [a2,b2] of [[-1.3,-.7],[1.3,-.7],[-1.3,.7],[1.3,.7]])gb(g,.15,1.1,.15,black,a2,.55,b2);
 for(let i=0;i<6;i++){const xx=-1.2+i*.48;gc(g,.03,.03,2.6,metal,xx,2.05,0,6).rotation.x=Math.PI/2;for(const zz of [-.3,.3])gb(g,.12,.3,.12,i%2?M(0xc0392b):M(0x1565c0),xx,1.95,zz);}
 gb(g,3.02,.03,1.72,cyanL,0,1.0,0,false);}
for(const [z,c] of [[12.5,0x8e24aa],[14.9,0xe53935],[17.3,0x1e88e5]]){const g=G(-38.6,z,Math.PI/2);gb(g,1.8,4,1.6,black,0,2,0);gb(g,1.82,.6,1.62,M(c,{emissive:c,emissiveIntensity:1.2}),0,3.75,0);
 gb(g,1.4,1.1,.05,M(0x0b3d5a,{emissive:0x2bb5ff,emissiveIntensity:1.2}),0,2.7,.82,false);gb(g,1.8,.15,.7,M(c),0,1.75,1.0);gb(g,1.84,.04,1.64,amber,0,.05,0,false);
 const al=new THREE.PointLight(c,4,6,1.8);al.position.set(0,2.5,1.6);g.add(al);}
// --- COZY LOUNGE (centre) ---
rug(20,15,-7,10,0x6b625a);
{const g=G(-7,10);
 sofa(g,12,0,-4.6,plush,0); gb(g,1.8,.8,2,plush,-6.9,.4,-4.6); sofa(g,7,-6.9,-1,plush,Math.PI/2);
 sofa(g,9,1,4.6,plushD,Math.PI);
 const ct=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,.18,40),M(0x3b3530,{roughness:.4}));ct.scale.set(1.4,1,.8);ct.position.set(0,.75,0);g.add(ct);
 const cb=new THREE.Mesh(new THREE.CylinderGeometry(2.0,2.0,.6,40),M(0x2a2622));cb.scale.set(1.4,1,.8);cb.position.set(0,.35,0);g.add(cb);
 const ctr=new THREE.Mesh(new THREE.TorusGeometry(2.4,.03,6,64),amber);ctr.rotation.x=Math.PI/2;ctr.scale.set(1.4,.8,1);ctr.position.set(0,.06,0);g.add(ctr);
 gc(g,.25,.3,.5,gold,-1.2,1.1,0); gb(g,1.2,.2,.8,M(0x334455),1.3,.95,.2);
 armchair(g,8.2,-1.5,-Math.PI/2,plushD); armchair(g,8.2,2,-Math.PI/2,plushD);}
floorLamp(-17.5,3.5); floorLamp(2.5,16.5); floorLamp(-17.5,16.5);
// --- MEDIA NOOK (fills the middle) ---
rug(15,13,12,11,0x4a443e);
{const g=G(12,5.3);gb(g,7,1,1.2,M(0x2b2723),0,.5,0);gb(g,7.02,.03,.03,amber,0,.06,.62,false);
 gb(g,6,3.4,.15,black,0,3.0,-.2);gb(g,5.7,3.1,.03,M(0x112233,{emissive:0x3a7bd5,emissiveIntensity:.9}),0,3.0,-.1,false);gb(g,.8,.2,.5,black,2.2,1.1,.1);}
beanbag(9,10,0xd9a86c); beanbag(12.2,11.2,0x7fa3a6); beanbag(15.4,10,0xc97b63);
{const g=G(12,15.5);sofa(g,8,0,0,plush,Math.PI);}
floorLamp(18.5,15.5);
// --- COFFEE STATION (right) ---
rug(17,15,30.5,11,0x3d3833);
{const g=G(30.5,5.2);
 gb(g,14,3.2,.3,M(0x3a332d),0,1.6,-.6);                         // backsplash panel
 gb(g,13.6,.08,.08,M(0xffb45a),0,3.0,-.42,false); gb(g,13.6,.08,.08,M(0xffb45a),0,2.0,-.42,false);
 const bs=new THREE.PointLight(0xffa860,10,8,1.7);bs.position.set(0,2.5,.6);g.add(bs);
 gb(g,14,1.9,1.6,M(0xe8e6e2,{roughness:.35}),0,.95,.5); gb(g,14.2,.14,1.8,M(0x1f1d1b,{roughness:.25}),0,1.96,.5);
 gb(g,14,.05,.05,cyanL,0,.08,1.32,false); gb(g,14.2,.04,.04,amber,0,1.9,1.42,false);
 // espresso machine
 gb(g,2.2,1.3,1.1,metal,-3,2.68,.3); gb(g,2.0,.25,1.0,black,-3,3.42,.3); gb(g,.6,.35,.08,M(0xffb45a,{emissive:0xff9a40,emissiveIntensity:1}),-3,2.95,.87,false);
 for(const xx of [-3.6,-2.4]){gc(g,.06,.06,.3,black,xx,2.25,.8,8);gc(g,.17,.13,.3,M(0xffffff),xx,2.18,.75);}
 gc(g,.35,.3,.9,metal,0,2.5,.2); gc(g,.2,.35,.4,black,0,3.1,.2);   // grinder
 for(let i=0;i<5;i++)gc(g,.17,.13,.3,M(0xffffff),2+i*.5,2.18,.3);
 for(let i=0;i<4;i++)gc(g,.2,.2,.55,M(0xd4b483),4.8+i*.5,2.3,.1);
}
for(const [x,z] of [[26,14.5],[34,14.5],[30,18.5]]){const g=G(x,z);gc(g,1,1,.08,M(0xe8e6e2),0,1.5,0,24);gc(g,.08,.08,1.5,gold,0,.75,0,8);gc(g,.6,.6,.05,gold,0,.03,0);
 for(const a2 of [0,Math.PI]){gc(g,.45,.45,.1,plushD,Math.cos(a2)*1.6,.9,Math.sin(a2)*1.6);gc(g,.06,.06,.9,gold,Math.cos(a2)*1.6,.45,Math.sin(a2)*1.6,6);}}
floorLamp(38.5,19.5);
// plants
for(const [x,z,sc] of [[-39,20.5,1.2],[-21.5,20,1],[-17.5,10,1.1],[3,3,1.1],[5,20,1],[19.5,4,1.1],[21,20,1.1],[38.6,20.5,1.3],[38.6,13,1.1],[23,4,1],[-21.5,3,1]])plant(x,z,0,sc);
function zsign(t,x,z){const tx=canvasTex(512,128,(g,w,h)=>{g.fillStyle='#14110d';g.fillRect(0,0,w,h);g.strokeStyle='#d4af37';g.lineWidth=6;g.strokeRect(4,4,w-8,h-8);g.fillStyle='#ffcf7a';g.font='bold 70px Helvetica';g.textAlign='center';g.textBaseline='middle';g.fillText(t,w/2,h/2+3);});
 plane(3.2,.8,tx,x,2.6,z);box(.08,2.2,.08,gold,x,1.1,z-.05);box(.9,.06,.9,gold,x,.03,z-.05);}
zsign('GAMES',-24,2.4); zsign('LOUNGE',-2,2.8); zsign('COFFEE',24,2.8);
// ===== hologram stats board (public-safe) =====
const st=await fetch('stats.json?'+Date.now()).then(r=>r.json()).catch(()=>({}));
const num=v=>(typeof v==='number'&&isFinite(v))?v:null;
const pv={YouTube:num(st.views?.youtube??st.youtube?.views),Instagram:num(st.views?.instagram??st.instagram?.views),X:num(st.views?.x??st.x?.views)};
const have=Object.values(pv).filter(v=>v!=null), total=have.length?have.reduce((a,b)=>a+b,0):null;
const top=st.top_clip||null;
const prod=num(st.projects_in_production)??(Array.isArray(st.projects)?st.projects.filter(p=>(p.completion_pct??0)<100).length:(st.project&&num(st.project.completion_pct)!=null&&st.project.completion_pct<100?1:null));
const fmt=n=>n==null?'N/A':n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?(n/1e3).toFixed(1)+'K':n.toLocaleString('en-US');
const bx0=MZ_X1+.3, bx1=X1-.3, by0=7.2, by1=H-.5, bw=bx1-bx0, bh=by1-by0, PX=100;
const boardT=canvasTex(Math.round(bw*PX),Math.round(bh*PX),(g,w,h)=>{
 g.fillStyle='rgba(70,20,120,0.66)';g.fillRect(0,0,w,h);
 // decor: grid, glow bands, watermark
 g.strokeStyle='rgba(220,170,255,.12)';g.lineWidth=2;for(let x=0;x<w;x+=100){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<h;y+=100){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
 for(const y of [h*.18,h*.86]){const gb=g.createLinearGradient(0,y-40,0,y+40);gb.addColorStop(0,'rgba(200,140,255,0)');gb.addColorStop(.5,'rgba(200,140,255,.22)');gb.addColorStop(1,'rgba(200,140,255,0)');g.fillStyle=gb;g.fillRect(0,y-40,w,80);}
 g.save();g.fillStyle='rgba(240,220,255,.07)';g.font='bold 900px Helvetica,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('EYOMANI',w/2,h/2+40);g.restore();
 g.strokeStyle='rgba(220,170,255,.95)';g.lineWidth=8;g.strokeRect(14,14,w-28,h-28);
 g.shadowColor='#c890ff';g.shadowBlur=8;const C='#fbf6ff',Cs='#e4ccff';
 const txt=(t,x,y,sz,c=C,b=true)=>{g.textAlign='center';g.fillStyle=c;const f=z=>g.font=`${b?'bold ':''}${z}px Helvetica,Arial`;f(sz);while(g.measureText(t).width>cwi(Math.min(2,Math.max(0,ED.findIndex(e=>e>x)-1)))-240&&sz>30){sz-=6;f(sz);}g.fillText(t,x,y);};
 const wx=x=>(x-bx0)*PX, ED=[0,1,2,3].map(i=>w*i/3), cx=i=>(ED[i]+ED[i+1])/2, cwi=i=>ED[i+1]-ED[i];
 g.strokeStyle='rgba(220,170,255,.55)';g.lineWidth=4;[ED[1],ED[2]].forEach(x=>{g.beginPath();g.moveTo(x,110);g.lineTo(x,h-110);g.stroke();});
 txt('TOTAL VIEWS',cx(0),h*.2,150,Cs); txt(fmt(total),cx(0),h*.5,520);
 Object.entries(pv).forEach(([k,v],i)=>txt(`${k}: ${fmt(v)}`,cx(0),h*.66+i*h*.085,105,Cs,false));
 if(total==null) txt('not tracked yet',cx(0),h*.93,75,Cs,false);
 txt('TOP CLIP',cx(1),h*.2,150,Cs);
 const tt=top?.title??'N/A', tp=top?.platform??'N/A';
 let fs=520; g.font=`bold ${fs}px Helvetica`; while(g.measureText(tt).width>cwi(1)-200&&fs>60){fs-=10;g.font=`bold ${fs}px Helvetica`;}
 txt(tt,cx(1),h*.5,fs); txt('Best on: '+tp,cx(1),h*.64,110,Cs,false);
 txt('PROJECTS IN PRODUCTION',cx(2),h*.2,150,Cs); txt(prod==null?'N/A':String(prod),cx(2),h*.5,520);
});
plane(bw,bh,boardT,(bx0+bx1)/2,(by0+by1)/2,Z0+.25,0,true);
const purp=new THREE.MeshBasicMaterial({color:0xc58bff,toneMapped:false});glowX(bx0,bx1,by0,Z0+.28,purp,.08);glowX(bx0,bx1,by1,Z0+.28,purp,.08);glowY(by0,by1,bx0,Z0+.28,purp,.08);glowY(by0,by1,bx1,Z0+.28,purp,.08);
for(const f of [.2,.5,.8]){const cl=new THREE.PointLight(0xa060ff,30,22,1.6);cl.position.set(bx0+bw*f,by0+bh/2,Z0+3);s.add(cl);}
s.add(new THREE.AmbientLight(0xffe6cc,.12));
for(const x of [-30,-15,0,15,30])for(const z of [-14,0,14]){const p=new THREE.PointLight(0xffc890,8,26,1.8);p.position.set(x,H-2,z);s.add(p);}
addEventListener('resize',()=>{const a=innerWidth/innerHeight;cam.left=-F*a;cam.right=F*a;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight);});
const comp=new EffectComposer(r); comp.addPass(new RenderPass(s,cam));
comp.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),0.6,0.4,0.9)); comp.addPass(new OutputPass());
addEventListener('resize',()=>comp.setSize(innerWidth,innerHeight));
(function loop(){ctl.update();comp.render();requestAnimationFrame(loop);})();
