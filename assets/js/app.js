const qs=id=>document.getElementById(id)
const box=qs('borderBox')

const STATE={
shape:'bar',
speed:10,
border:8,
mode:'themes',
colors:['#ffb3c6','#ff8fab','#bde0fe','#a2d2ff'],
hue:0
}

let themes={}

fetch('assets/data/themes.json')
.then(r=>r.json())
.then(j=>{
themes=j
const sel=qs('theme')
Object.keys(j).forEach(t=>{
const o=document.createElement('option')
o.value=t;o.textContent=t
sel.appendChild(o)
})
apply()
})

function apply(){
box.className='border '+STATE.shape
box.style.setProperty('--speed',STATE.speed+'s')
box.style.setProperty('--border',STATE.border+'px')
STATE.colors.forEach((c,i)=>box.style.setProperty('--c'+(i+1),c))
}

function rotateHue(hex,deg){
const c=document.createElement('canvas').getContext('2d')
c.fillStyle=hex
let col=c.fillStyle
let r=parseInt(col.substr(1,2),16)/255
let g=parseInt(col.substr(3,2),16)/255
let b=parseInt(col.substr(5,2),16)/255
let max=Math.max(r,g,b),min=Math.min(r,g,b)
let h,s,v=max,d=max-min
s=max==0?0:d/max
if(max==min)h=0
else{
switch(max){
case r:h=(g-b)/d+(g<b?6:0);break
case g:h=(b-r)/d+2;break
case b:h=(r-g)/d+4;break
}
h/=6
}
h=(h*360+deg)%360/360
let i=Math.floor(h*6)
let f=h*6-i
let p=v*(1-s)
let q=v*(1-f*s)
let t=v*(1-(1-f)*s)
switch(i%6){
case 0:r=v;g=t;b=p;break
case 1:r=q;g=v;b=p;break
case 2:r=p;g=v;b=t;break
case 3:r=p;g=q;b=v;break
case 4:r=t;g=p;b=v;break
case 5:r=v;g=p;b=q;break
}
return '#' + ((1<<24)+(Math.round(r*255)<<16)+(Math.round(g*255)<<8)+Math.round(b*255)).toString(16).slice(1)
}

/* UI */
qs('shape').onchange=e=>{STATE.shape=e.target.value;apply()}
qs('speed').oninput=e=>{STATE.speed=e.target.value;apply()}
qs('border').oninput=e=>{STATE.border=e.target.value;apply()}
qs('mode').onchange=e=>{
STATE.mode=e.target.value
qs('themeBox').style.display=STATE.mode==='themes'?'block':'none'
qs('manualBox').style.display=STATE.mode==='manual'?'block':'none'
qs('hueBox').style.display=STATE.mode==='hue'?'block':'none'
}

qs('theme').onchange=e=>{
STATE.colors=themes[e.target.value]
apply()
}

;['c1','c2','c3','c4'].forEach((id,i)=>{
qs(id).oninput=e=>{
STATE.colors[i]=e.target.value
apply()
}
})

qs('hue').oninput=e=>{
const base=['#ffb3c6','#ff8fab','#bde0fe','#a2d2ff']
STATE.colors=base.map(c=>rotateHue(c,e.target.value))
apply()
}

/* EXPORT LINK */
qs('export').onclick=()=>{
const data=btoa(JSON.stringify(STATE))
const base=location.href.split('?')[0]
const link=base+'?overlay=1&state='+data
qs('link').textContent=link
navigator.clipboard.writeText(link)
}

/* URL MODE */
const p=new URLSearchParams(location.search)
if(p.get('overlay')==='1')document.body.classList.add('overlay-only')
if(p.has('state')){
try{Object.assign(STATE,JSON.parse(atob(p.get('state'))));apply()}catch(e){}
}
