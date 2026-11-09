'use strict';
(() => {
 const opening=document.querySelector('#opening'),button=document.querySelector('#enter-classic'),website=document.querySelector('#website');
 let entered=false;
 button.addEventListener('click',()=>{
  if(entered)return;entered=true;button.disabled=true;website.hidden=false;website.inert=false;
  select('missouri');
  document.body.dataset.view='map';
  let finished=false;
  function settle(){if(finished)return;finished=true;opening.hidden=true;opening.inert=true;document.body.classList.remove('at-opening');website.focus({preventScroll:true});}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){settle();return;}
  opening.classList.add('leaving');opening.addEventListener('transitionend',settle,{once:true});setTimeout(settle,750);
 });
 document.body.dataset.view='opening';
})();
