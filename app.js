'use strict';
const svg=document.querySelector('#interaction'),list=document.querySelector('#state-list');
const ns='http://www.w3.org/2000/svg';
function el(tag,attrs={},parent=svg){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e;}
const defs=el('defs');const f=el('filter',{id:'illuminate','color-interpolation-filters':'sRGB'},defs);el('feComponentTransfer',{},f);
for(const c of ['R','G','B'])el('feFunc'+c,{type:'linear',slope:'1.85'},f.firstChild);
const lights=new Map(),hits=new Map(),buttons=new Map();let selected=null,hovered=null,focused=null;let archGlow=null;
function render(){const active=hovered||focused||selected;for(const s of window.GATEWAY_REGIONS){lights.get(s.id).classList.toggle('active',s.id===active);hits.get(s.id).setAttribute('aria-pressed',String(s.id===selected));buttons.get(s.id).setAttribute('aria-pressed',String(s.id===selected));}if(archGlow)archGlow.setAttribute('opacity',active==='missouri'?'0.55':'0');document.querySelector('#state-name').textContent=active?window.GATEWAY_REGIONS.find(s=>s.id===active).name:'Choose your state';document.querySelector('#state-info').textContent=active?'Teams to be announced.':'Select a state to view tournament information.';}
function select(id){selected=id;hovered=null;render();document.dispatchEvent(new CustomEvent('gateway:state-selected',{detail:{state:id}}));}
for(const s of window.GATEWAY_REGIONS){const clip=el('clipPath',{id:'clip-'+s.id},defs);el('path',{d:s.path},clip);const mask=el('mask',{id:'mask-'+s.id,maskUnits:'userSpaceOnUse',x:0,y:0,width:1536,height:1024},defs);el('image',{href:'assets/'+s.id+'-illumination-mask.png',width:1536,height:1024},mask);const group=el('g',{class:'light','data-state':s.id,'clip-path':'url(#clip-'+s.id+')',mask:'url(#mask-'+s.id+')'});el('image',{href:'assets/regional-map-original.png',width:1536,height:1024,filter:'url(#illuminate)'},group);lights.set(s.id,group);}
// Stationary halo from the original Arch pixels; never modify the master art.
const archMask=el('mask',{id:'stationary-arch-mask',maskUnits:'userSpaceOnUse',x:0,y:0,width:1536,height:1024},defs);
el('image',{href:'assets/arch-emblem-mask.png',width:1536,height:1024},archMask);
const archFilter=el('filter',{id:'stationary-arch-glow',filterUnits:'userSpaceOnUse',x:752,y:430,width:165,height:180,'color-interpolation-filters':'sRGB'},defs);
el('feGaussianBlur',{in:'SourceAlpha',stdDeviation:'3',result:'soft'},archFilter);
el('feFlood',{'flood-color':'#ffe5b5','flood-opacity':'.6',result:'warm'},archFilter);
el('feComposite',{in:'warm',in2:'soft',operator:'in',result:'halo'},archFilter);
const archMerge=el('feMerge',{},archFilter);el('feMergeNode',{in:'halo'},archMerge);el('feMergeNode',{in:'SourceGraphic'},archMerge);
archGlow=el('g',{id:'selected-arch-glow',filter:'url(#stationary-arch-glow)',opacity:0,'pointer-events':'none','aria-hidden':'true'});
el('image',{href:'assets/regional-map-original.png',width:1536,height:1024,mask:'url(#stationary-arch-mask)'},archGlow);
for(const s of window.GATEWAY_REGIONS){const hit=el('path',{d:s.path,class:'hit',id:'state-'+s.id,role:'button',tabindex:'0','aria-label':s.name,'aria-pressed':'false'});hits.set(s.id,hit);hit.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=s.id;render();}});hit.addEventListener('pointerleave',()=>{hovered=null;render();});hit.addEventListener('click',()=>select(s.id));hit.addEventListener('focus',()=>{focused=s.id;render();});hit.addEventListener('blur',()=>{focused=null;render();});hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(s.id);}const i=window.GATEWAY_REGIONS.indexOf(s);if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?8:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:8))%9;hits.get(window.GATEWAY_REGIONS[n].id).focus();}});const b=document.createElement('button');b.type='button';b.textContent=s.name;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(s.id));list.append(b);buttons.set(s.id,b);}
function clear(){selected=hovered=focused=null;render();}
document.querySelector('#clear').addEventListener('click',clear);document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.activeElement?.classList.contains('hit'))document.activeElement.blur();clear();}});render();
