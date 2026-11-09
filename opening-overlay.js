'use strict';
(() => {
 const frame=document.querySelector('.opening-frame'),image=frame.querySelector('img'),button=document.querySelector('#enter-classic');
 // Pixel bounds of the visual button in the approved 1104 x 1424 image.
 const target={x:358,y:1293,width:385,height:70};
 function align(){
  if(!image.naturalWidth||!image.naturalHeight||!frame.clientWidth||!frame.clientHeight)return;
  const r=image.getBoundingClientRect(),f=frame.getBoundingClientRect();
  if(!r.width||!r.height)return;
  const cover=getComputedStyle(image).objectFit==='cover';
  const scale=(cover?Math.max:Math.min)(r.width/image.naturalWidth,r.height/image.naturalHeight);
  const offsetX=(r.width-image.naturalWidth*scale)/2,offsetY=(r.height-image.naturalHeight*scale)/2;
  const x=offsetX+target.x*scale,y=offsetY+target.y*scale,w=target.width*scale,h=target.height*scale;
  const visible=x>=-.5&&y>=-.5&&x+w<=r.width+.5&&y+h<=r.height+.5;
  button.classList.toggle('image-button',visible);
  if(visible){
   button.style.setProperty('--image-button-x',`${r.left-f.left+x+w/2}px`);
   button.style.setProperty('--image-button-y',`${r.top-f.top+y+h/2}px`);
   button.style.setProperty('--image-button-width',`${w}px`);
   button.style.setProperty('--image-button-height',`${h}px`);
  }
  // In the approved wide-phone crop the baked button lies entirely outside
  // the photo viewport; retain the existing HTML button at its approved spot.
  button.classList.remove('image-button-pending');
 }
 image.addEventListener('load',align);new ResizeObserver(align).observe(frame);
 window.addEventListener('resize',align);window.visualViewport?.addEventListener('resize',align);
 if(image.complete)align();
})();
