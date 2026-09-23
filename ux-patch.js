// ═══ UX MEJORAS v2.0 - PATCH PARA worker.js ═══
// Aplicar estos cambios al archivo worker.js en el repositorio C5clavo5

// 1. CSS - Agregar antes de </style> (después de .footer-copy a{color:var(--accent);text-decoration:none;}):

/* ═══ UX MEJORAS v2.0 ═══ */
*{scroll-behavior:smooth;}
body{-webkit-text-size-adjust:100%;}
.modal-card,.dash-body,.cuaderno-lista,#solicitudes-lista,#carta-lista{-webkit-overflow-scrolling:touch;}
@keyframes skeletonShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.skeleton-cell{height:14px;border-radius:6px;background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:skeletonShimmer 1.5s ease-in-out infinite;}
.skeleton-cell.short{width:60px;}.skeleton-cell.medium{width:120px;}.skeleton-cell.long{width:180px;}.skeleton-cell.xlong{width:220px;}
.skeleton-card{padding:16px;border:1px solid var(--border);border-radius:14px;margin-bottom:10px;}
.skeleton-card .skeleton-cell{margin-bottom:8px;}
.ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.25);transform:scale(0);animation:rippleAnim .6s ease-out;pointer-events:none;}
@keyframes rippleAnim{to{transform:scale(3);opacity:0;}}
@media(max-width:600px){
.modal-overlay{align-items:flex-end;padding:0;}
.modal-box,.modal-card{border-radius:24px 24px 0 0;max-height:92vh;max-width:100%;width:100%;padding:28px 20px 32px;animation:sheetUp .35s cubic-bezier(.32,.72,0,1);}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-close{position:sticky;top:0;float:right;margin-right:-4px;z-index:5;}
}
@media(max-width:480px){
.toast{bottom:16px!important;left:12px!important;right:12px!important;transform:translateY(120px)!important;max-width:none!important;width:auto!important;padding:14px 18px!important;font-size:12px!important;}
.toast.show{transform:translateY(0)!important;}
}
body.modal-open{overflow:hidden;position:fixed;width:100%;}
.haptic:active{transform:scale(.97);}
@media(max-width:600px){
.page-btn,.acc-btn,.btn{min-height:44px;}
.tab-btn{min-height:44px;padding:10px 16px;}
}

// 2. CSS - Reemplazar .loading-row td{...} con:
// .loading-row td{...}.skeleton-wrap{padding:16px;}.skeleton-card{...}.skeleton-card .skeleton-cell{margin-bottom:8px;}

// 3. JS - Agregar antes de </script> (antes del cierre del HTML string):

// ── UX ENHANCEMENTS v2.0 ──
function haptic(ms){if(navigator.vibrate&&window.innerWidth<=600)navigator.vibrate(ms||15);}
document.addEventListener('click',function(e){var btn=e.target.closest('.btn,.acc-btn,.tab-btn,.page-btn');if(!btn)return;haptic(15);var rect=btn.getBoundingClientRect();var ripple=document.createElement('span');ripple.className='ripple';ripple.style.width=ripple.style.height=Math.max(rect.width,rect.height)+'px';ripple.style.left=(e.clientX-rect.left-rect.width/2)+'px';ripple.style.top=(e.clientY-rect.top-rect.height/2)+'px';ripple.style.position='absolute';btn.style.position='relative';btn.style.overflow='hidden';btn.appendChild(ripple);setTimeout(function(){ripple.remove();},600);},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.modal-overlay').forEach(function(m){if(m.style.display==='flex'){m.style.display='none';document.body.classList.remove('modal-open');}});}});
document.querySelectorAll('.modal-overlay').forEach(function(overlay){overlay.addEventListener('click',function(e){if(e.target===overlay){overlay.style.display='none';document.body.classList.remove('modal-open');}});});
var origCerrarModal=window.cerrarModal;window.cerrarModal=function(id){var m=document.getElementById(id);if(m)m.style.display='none';document.body.classList.remove('modal-open');if(id==='modal-nuevo'){personaEncontrada=null;window._personasEncontradas=null;}};
var _modalObserver=new MutationObserver(function(){var anyOpen=false;document.querySelectorAll('.modal-overlay').forEach(function(m){if(m.style.display==='flex')anyOpen=true;});document.body.classList.toggle('modal-open',anyOpen);});
document.querySelectorAll('.modal-overlay').forEach(function(m){_modalObserver.observe(m,{attributes:true,attributeFilter:['style']});});

// 4. JS - Reemplazar spinner+Cargando loading states con skeleton loaders:
// Buscar: <span class="spinner"></span> Cargando...</div>
// Reemplazar con: <div class="skeleton-card"><div class="skeleton-cell medium"></div><div class="skeleton-cell long"></div><div class="skeleton-cell short"></div></div><div class="skeleton-card"><div class="skeleton-cell medium"></div><div class="skeleton-cell xlong"></div></div></div>
