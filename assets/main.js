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

/* One opening timeline; all animation effects are removed at its end. */
(()=>{
  const root=document.documentElement;
  if(!root.classList.contains('entrance-pending'))return;

  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const compact=matchMedia('(max-width:699.98px)').matches;
  const ease='cubic-bezier(.22,1,.36,1)';
  const cardEase='cubic-bezier(.18,.9,.24,1)';
  const animations=[];
  const released=[];
  let readyTimer,finished=false;

  const finish=()=>{
    if(finished)return;
    finished=true;
    clearTimeout(readyTimer);
    clearTimeout(window.__entranceFallback);
    root.classList.remove('entrance-pending');
    for(const [node,opacity] of released)node.style.opacity=opacity;
    for(const animation of animations)animation.cancel();
    motion.removeEventListener('change',onMotionChange);
  };
  const onMotionChange=()=>{if(motion.matches)finish()};
  motion.addEventListener('change',onMotionChange);
  if(motion.matches||!Element.prototype.animate){finish();return}

  const soft=[
    {opacity:0,translate:'0 8px'},
    {opacity:1,translate:'0 0'}
  ];
  const line=[
    {opacity:1,clipPath:'inset(0 0 100% 0)',translate:'0 14px'},
    {opacity:1,clipPath:'inset(0 0 0 0)',translate:'0 0'}
  ];
  const card=[
    {opacity:1,clipPath:'inset(0 0 100% 0)',translate:'0 12px'},
    {opacity:1,clipPath:'inset(0 0 0 0)',translate:'0 0'}
  ];
  const plan=[
    ['.logo',soft,0,430,ease],
    ['.nav',[{opacity:0},{opacity:1}],80,450,ease],
    ['.actions',soft,130,450,ease],
    ['.h1 .l1',line,250,750,ease],
    ['.h1 .l2',line,390,800,ease],
    ['.h1 .l3',line,540,740,ease],
    ['.lede',soft,850,520,ease],
    ['.search',soft,1030,570,ease],
    ['.card.pink',card,compact?140:380,860,cardEase],
    ['.card.sky',card,compact?340:600,880,cardEase],
    ['.card.sage',card,compact?550:820,920,cardEase],
    ['.stats',soft,1250,500,ease]
  ];

  const inOpeningViewport=node=>{
    const box=node.getBoundingClientRect();
    return box.bottom>0&&box.top<innerHeight&&box.right>0&&box.left<innerWidth&&
      getComputedStyle(node).visibility!=='hidden';
  };

  const play=async()=>{
    try{
      const assets=[document.fonts.ready,...Array.from(document.querySelectorAll('.deck img'),img=>img.decode().catch(()=>{}))];
      await Promise.race([
        Promise.all(assets),
        new Promise(resolve=>{readyTimer=setTimeout(resolve,500)})
      ]);
      clearTimeout(readyTimer);
      if(finished)return;

      for(const [selector,frames,delay,duration,easing] of plan){
        if(compact&&!['.logo','.actions','.card.pink','.card.sky','.card.sage'].includes(selector))continue;
        const node=document.querySelector(selector);
        if(!node)continue;
        if(!inOpeningViewport(node)){
          released.push([node,node.style.opacity]);
          node.style.opacity='1';
          continue;
        }
        animations.push(node.animate(frames,{delay,duration,easing,fill:'both',iterations:1}));
      }
      await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
    }finally{finish()}
  };
  play().catch(finish);
})();
