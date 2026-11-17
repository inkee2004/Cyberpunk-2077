function lockPad(on){var r=document.documentElement;if(on){var w=innerWidth-r.clientWidth;r.style.paddingRight=w>0?w+'px':''}else r.style.paddingRight=''}

(function(){
'use strict';

/* ================= ИНДЕКСЫ ================= */
var coll=new Intl.Collator('en',{sensitivity:'base',numeric:true});
var byName={},total=0;
CATS.forEach(function(c){
  c.mods.sort(function(a,b){return coll.compare(a[0],b[0])});
  c.mods.forEach(function(m){byName[m[0]]={name:m[0],id:m[1]};total++});
});

/* ================= ОТРИСОВКА ================= */
var board=document.getElementById('board');
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}

CATS.forEach(function(c,n){
  var card=el('article','card');card.style.gridColumn='span '+c.span;
  var ch=el('div','ch'),h=el('h2');
  h.appendChild(el('span','ix',('0'+(n+1)).slice(-2)));
  c.t.forEach(function(p,i){if(i){h.appendChild(el('i',null,' / / '))}h.appendChild(document.createTextNode(p))});
  ch.appendChild(h);ch.appendChild(el('span','ct',('0'+c.mods.length).slice(-2)));
  card.appendChild(ch);
  var list=el('div','list');list.style.setProperty('--r',c.rows);
  c.mods.forEach(function(m,i){
    var d=byName[m[0]];
    var a=el('a','mod');
    a.href='https://www.nexusmods.com/cyberpunk2077/mods/'+d.id;a.target='_blank';a.rel='noopener noreferrer';
    a.dataset.n=d.name;a.dataset.i=i;
    var nm=el('span','nm',d.name);
    a.appendChild(nm);
    var ar=el('span','ar','↗');ar.setAttribute('aria-hidden','true');a.appendChild(ar);
    list.appendChild(a);
  });
  card.appendChild(list);board.appendChild(card);
});
var tg=document.getElementById('tags');
[['Моды',String(total)],['Версия','2.5']].forEach(function(t){var w=el('div','tag');w.appendChild(el('small',null,t[0]));w.appendChild(el('b',null,t[1]));tg.appendChild(w)});

var activeName=null,hideT=null,hot=null;
function showFor(row){
  clearTimeout(hideT);
  var d=byName[row.dataset.n];if(!d)return;
  if(hot)hot.classList.remove('hot');hot=row;row.classList.add('hot');board.classList.add('focus');
  activeName=d.name;
}
function hideFor(){
  hideT=setTimeout(function(){
    if(hot)hot.classList.remove('hot');hot=null;board.classList.remove('focus');activeName=null;
  },80);
}
board.addEventListener('pointerover',function(e){
  if(e.pointerType==='touch')return;
  var a=e.target.closest&&e.target.closest('a.mod');if(!a||a.dataset.n===activeName)return;
  showFor(a);
});
board.addEventListener('pointerout',function(e){
  var a=e.target.closest&&e.target.closest('a.mod');if(!a)return;
  var to=e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('a.mod');
  if(!to)hideFor();
});
board.addEventListener('focusin',function(e){var a=e.target.closest('a.mod');if(a)showFor(a)});
board.addEventListener('focusout',hideFor);

})();

(function(){
  var dm=document.getElementById('dm'),dl=document.getElementById('dl'),go=document.getElementById('dmGo'),ok=document.getElementById('dmOk'),
      lb=document.getElementById('lb'),lbi=document.getElementById('lbi'),lbc=document.getElementById('lbc'),H=document.documentElement,last=null,
      imgs=[].slice.call(dm.querySelectorAll('img[data-src]'));
  function loadI(){imgs.forEach(function(i){if(i.dataset.src){i.src=i.dataset.src;i.removeAttribute('data-src')}})}
  function sync(){if(ok.checked){go.href=go.dataset.href;go.removeAttribute('aria-disabled')}else{go.removeAttribute('href');go.setAttribute('aria-disabled','true')}}
  ok.addEventListener('change',sync);
  function openM(){loadI();last=document.activeElement;lockPad(true);dm.classList.add('on');H.classList.add('mlock');dm.setAttribute('aria-hidden','false');dm.scrollTop=0;ok.checked=false;sync();setTimeout(function(){ok.focus({preventScroll:true})},60)}
  function closeM(){dm.classList.remove('on');H.classList.remove('mlock');lockPad(false);dm.setAttribute('aria-hidden','true');if(last&&last.focus)last.focus({preventScroll:true})}
  function openL(b){lbi.src=b.querySelector('img').src;lbc.textContent=b.dataset.cap;lb.classList.add('on');lb.setAttribute('aria-hidden','false')}
  function closeL(){lb.classList.remove('on');lb.setAttribute('aria-hidden','true')}
  ['pointerenter','focus','touchstart'].forEach(function(ev){dl.addEventListener(ev,loadI,{once:true,passive:true})});
  dl.addEventListener('click',openM);
  dm.addEventListener('click',function(e){if(e.target===dm)closeM()});
  [].forEach.call(dm.querySelectorAll('.gshot'),function(b){
    b.addEventListener('click',function(){openL(b)});
  });
  lb.addEventListener('click',closeL);
  addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    if(lb.classList.contains('on')){closeL();e.stopPropagation()}else if(dm.classList.contains('on'))closeM();
  },true);
})();
