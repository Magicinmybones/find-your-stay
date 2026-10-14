/* mobile menu: open/close, Escape, outside tap, link tap, focus return */
(()=>{
  const page=document.querySelector('.page'),btn=document.querySelector('.burger'),nav=document.getElementById('primary-nav');
  const mq=matchMedia('(max-width:659.98px), (max-width:699.98px) and (max-aspect-ratio:23/20)');
  const set=open=>{page.classList.toggle('nav-open',open);btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Menu');
    if(open){nav.querySelector('a').focus({preventScroll:true})}};
  btn.addEventListener('click',()=>set(btn.getAttribute('aria-expanded')!=='true'));
  nav.addEventListener('click',e=>{if(e.target.closest('a')&&mq.matches)set(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&page.classList.contains('nav-open')){set(false);btn.focus()}});
  document.addEventListener('pointerdown',e=>{if(page.classList.contains('nav-open')&&!nav.contains(e.target)&&!btn.contains(e.target))set(false)});
  mq.addEventListener('change',()=>set(false));
})();
