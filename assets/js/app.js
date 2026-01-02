# ============================================
# OVERWRITE app.js — LOOP DE ANIMAÇÃO REAL
# ============================================

@"
const qs=id=>document.getElementById(id)
const box=qs('borderBox')

const STATE={
shape:'bar',
speed:1.2,        // VELOCIDADE REAL
border:8,
colors:['#ffb3c6','#ff8fab','#bde0fe','#a2d2ff'],
angle:0,
offset:0
}

/* APPLY STATE */
function apply(){
box.className='border '+STATE.shape
box.style.setProperty('--border',STATE.border+'px')
STATE.colors.forEach((c,i)=>{
box.style.setProperty('--c'+(i+1),c)
})
}

/* ======================
   ANIMATION LOOP (REAL)
====================== */
function animate(){
if(STATE.shape==='bar'){
STATE.offset+=STATE.speed
if(STATE.offset>100)STATE.offset=0
box.style.setProperty('--offset',STATE.offset+'%')
}else{
STATE.angle+=STATE.speed
if(STATE.angle>360)STATE.angle-=360
box.style.setProperty('--angle',STATE.angle+'deg')
}
requestAnimationFrame(animate)
}
animate()

/* ======================
   UI
====================== */
qs('shape').onchange=e=>{STATE.shape=e.target.value;apply()}
qs('speed').oninput=e=>{STATE.speed=parseFloat(e.target.value)}
qs('border').oninput=e=>{STATE.border=e.target.value;apply()}

/* ======================
   OBS MODE
====================== */
const p=new URLSearchParams(location.search)
if(p.get('overlay')==='1')document.body.classList.add('overlay-only')
if(p.has('state')){
try{
Object.assign(STATE,JSON.parse(atob(p.get('state'))))
apply()
}catch(e){}
}

/* ======================
   EXPORT LINK
====================== */
qs('export').onclick=()=>{
const data=btoa(JSON.stringify(STATE))
const base=location.href.split('?')[0]
const link=base+'?overlay=1&state='+data
navigator.clipboard.writeText(link)
alert('Link OBS copiado')
}

apply()
"@ | Out-File -Encoding utf8 "AGBG-PRO/assets/js/app.js"

Write-Host "✔ app.js sobrescrito (loop ativo)" -ForegroundColor Green
