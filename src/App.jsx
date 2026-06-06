import { useState, useEffect, useRef } from "react";
import * as THREE from "three";


const AIMA_LOGO = "data:image/png;base64,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";

const C = {
  bg:"#06080F", night:"#0A0D18", card:"#111827", card2:"#131B35",
  border:"#1a2235", border2:"#1e2d45",
  indigo:"#4F46E5", vio2:"#7C3AED", cyan:"#06B6D4",
  white:"#EEF2FF", soft:"#94A3B8", muted:"#64748B",
  green:"#10B981", amber:"#F59E0B", pink:"#EC4899", red:"#EF4444",
};

/* ─── THREE.JS (vertex/fragment inline) ─── */
const VERT=`uniform float time;varying vec3 vN;varying vec3 vP;
vec3 m3(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 m4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 pm(vec4 x){return m4(((x*34.)+1.)*x);}vec4 ti(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float sn(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=m3(i);
vec4 p=pm(pm(pm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 xx=x_*ns.x+ns.yyyy;vec4 yy=y_*ns.x+ns.yyyy;
vec4 h=1.-abs(xx)-abs(yy);vec4 b0=vec4(xx.xy,yy.xy);vec4 b1=vec4(xx.zw,yy.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=ti(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
void main(){vN=normal;vP=position;float d=sn(position*2.+time*.5)*.2;gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*d,1.);}`;
const FRAG=`uniform vec3 color;uniform vec3 plp;varying vec3 vN;varying vec3 vP;
void main(){vec3 n=normalize(vN);float d=max(dot(n,normalize(plp-vP)),0.);float f=pow(1.-dot(n,vec3(0.,0.,1.)),2.);gl_FragColor=vec4(color*d+color*f*.5,.85);}`;

function ThreeScene(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const W=el.clientWidth||900,H=el.clientHeight||700;
    const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(75,W/H,.1,1000);cam.position.z=3;
    const rdr=new THREE.WebGLRenderer({antialias:true,alpha:true});
    rdr.setSize(W,H);rdr.setPixelRatio(Math.min(devicePixelRatio,2));rdr.setClearColor(0,0);el.appendChild(rdr.domElement);
    const geo=new THREE.IcosahedronGeometry(1.2,8);
    const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0},plp:{value:new THREE.Vector3(0,0,5)},color:{value:new THREE.Color(0x06B6D4)}},vertexShader:VERT,fragmentShader:FRAG,wireframe:true,transparent:true});
    const mesh=new THREE.Mesh(geo,mat);sc.add(mesh);
    const pl=new THREE.PointLight(0xffffff,1,100);pl.position.set(0,0,5);sc.add(pl);
    let rid;const t0=performance.now();
    const loop=()=>{mat.uniforms.time.value=(performance.now()-t0)*.0003;mesh.rotation.y+=.0005;mesh.rotation.x+=.0002;rdr.render(sc,cam);rid=requestAnimationFrame(loop);};loop();
    const onR=()=>{const w=el.clientWidth,h=el.clientHeight;if(w&&h){cam.aspect=w/h;cam.updateProjectionMatrix();rdr.setSize(w,h);}};
    const onM=(e)=>{const x=(e.clientX/innerWidth)*2-1,y=-(e.clientY/innerHeight)*2+1;const v=new THREE.Vector3(x,y,.5).unproject(cam);const pos=cam.position.clone().add(v.sub(cam.position).normalize().multiplyScalar(-cam.position.z/v.z));pl.position.copy(pos);mat.uniforms.plp.value.copy(pos);};
    window.addEventListener("resize",onR);window.addEventListener("mousemove",onM);
    return()=>{cancelAnimationFrame(rid);window.removeEventListener("resize",onR);window.removeEventListener("mousemove",onM);if(el.contains(rdr.domElement))el.removeChild(rdr.domElement);geo.dispose();mat.dispose();rdr.dispose();};
  },[]);
  return <div ref={ref} style={{position:"absolute",inset:0}}/>;
}

/* ─── DATA ─── */
const SVCS=[
  {name:"Optimización Instagram",price:"$380,000",desc:"Bio optimizada, highlights rediseñados, guía de tono de voz y 9 posts con copy listos para publicar."},
  {name:"Landing Page sin dominio",price:"$590,000",desc:"Página en Vercel o Netlify con servicios, galería, testimonios y botón WhatsApp integrado."},
  {name:"Página Web con dominio",price:"$1,500,000",desc:"Sitio de 4–6 páginas con dominio en GoDaddy, responsive, con WhatsApp, Google Maps y formulario."},
  {name:"Auditoría SEO Básica",price:"$280,000",desc:"Diagnóstico de visibilidad: palabras clave, velocidad del sitio, meta tags y reporte de oportunidades."},
  {name:"Auditoría SEO Médium",price:"$490,000",desc:"Análisis de competidores, backlinks, contenido optimizado y plan de mejora de posicionamiento local."},
  {name:"Auditoría SEO Full",price:"$890,000",desc:"Estrategia completa: técnico, on-page, off-page, contenido y seguimiento mensual de métricas."},
  {name:"Prospección B2B",price:"$450,000",desc:"Investigación de clientes potenciales locales o nacionales con primer contacto y seguimiento."},
];

const PKGS=[
  {name:"PRESENCIA",price:"$890,000",color:C.cyan,popular:false,
   feats:["Optimización Instagram","Landing Page sin dominio","Auditoría SEO Básica","Plan de contenido 30 días","Brochure digital","Soporte 15 días"]},
  {name:"DIGITAL",price:"$2,290,000",color:C.indigo,popular:true,
   feats:["Página Web con dominio","Auditoría SEO Médium","Optimización Instagram","Plan de contenido 60 días","Prospección B2B local","Brochure digital","Google My Business","Soporte 30 días"]},
  {name:"GROWTH",price:"$3,990,000",color:C.vio2,popular:false,
   feats:["Página Web completa con dominio","Auditoría SEO Full","Optimización Instagram","Estrategia contenido 3 meses","Prospección B2B nacional","Setup Google Ads","Brochure digital","Soporte 60 días"]},
];

const FEATS=[
  {label:"Optimización Instagram",   vals:[true,true,true]},
  {label:"Página web",               vals:["Landing sin dominio","Con dominio","Con dominio"]},
  {label:"Auditoría SEO",            vals:["Básica","Médium","Full"]},
  {label:"Plan de contenido",        vals:["30 días","60 días","3 meses"]},
  {label:"Brochure digital",         vals:[true,true,true]},
  {label:"Google My Business",       vals:[false,true,true]},
  {label:"Prospección B2B",          vals:[false,"Local","Nacional"]},
  {label:"Setup Google Ads",         vals:[false,false,true]},
  {label:"Soporte post-entrega",     vals:["15 días","30 días","60 días"]},
];

/* 8 cards: 2 por marca */
const BRANDS=[
  {name:"Club del Hincha",     ig:"@clubdelhincha_co",    ini:"CH",clr:"#E31E24",sector:"Comunidades · Colombia",
   text:"AIMA transformó nuestra presencia digital. Nuestra comunidad de hinchas creció orgánicamente con contenido que realmente conecta con la pasión futbolera colombiana."},
  {name:"Visitrack SAS",       ig:"@visitracksas",     ini:"VS",clr:"#4F46E5",sector:"Tecnología · Colombia",
   text:"La estrategia digital de AIMA nos permitió presentar nuestra plataforma de forma profesional ante clientes corporativos. Los resultados en visibilidad fueron inmediatos."},
  {name:"Maria Olano Pottery", ig:"@mariaolano.pottery",ini:"MP",clr:"#F59E0B",sector:"Artesanía · Colombia",
   text:"AIMA entendió la esencia de mi cerámica artesanal y la tradujo en una presencia digital elegante. Los pedidos online aumentaron desde las primeras semanas."},
  {name:"Maria Olano Boutique",ig:"@mariaolano.boutique",ini:"MB",clr:"#EC4899",sector:"Moda · Colombia",
   text:"Nuestra boutique proyecta exactamente la imagen premium que queríamos. La landing con WhatsApp integrado fue un game changer para nuestras ventas directas."},
  {name:"Club del Hincha",     ig:"@clubdelhincha_co",    ini:"CH",clr:"#E31E24",sector:"Comunidades · Colombia",
   text:"Teníamos seguidores pero sin estrategia. Después de trabajar con AIMA, cada publicación tiene propósito y nuestro engagement se disparó desde el primer mes."},
  {name:"Visitrack SAS",       ig:"@visitracksas",     ini:"VS",clr:"#4F46E5",sector:"Tecnología · Colombia",
   text:"La auditoría SEO fue reveladora. Identificaron oportunidades que no habíamos visto y ahora aparecemos en búsquedas clave del sector de eficiencia operacional."},
  {name:"Maria Olano Pottery", ig:"@mariaolano.pottery",ini:"MP",clr:"#F59E0B",sector:"Artesanía · Colombia",
   text:"El contenido visual que desarrollamos con AIMA le da vida a mi trabajo artesanal. Ahora mis piezas llegan a coleccionistas de toda Colombia y del exterior."},
  {name:"Maria Olano Boutique",ig:"@mariaolano.boutique",ini:"MB",clr:"#EC4899",sector:"Moda · Colombia",
   text:"AIMA rediseñó nuestro Instagram con identidad visual coherente. Ahora cada post refuerza la marca y atrae exactamente el perfil de clienta que buscamos."},
];
const col1=BRANDS.slice(0,4), col2=BRANDS.slice(4,8);

const QS=[
  {q:"¿Cuánto tiempo lleva activo tu negocio?",opts:["Menos de 6 meses","Entre 6 meses y 2 años","Más de 2 años"]},
  {q:"¿Tu negocio tiene página web actualmente?",opts:["No, solo redes sociales","Sí, pero desactualizada","Sí y funciona bien"]},
  {q:"¿Cuál es tu mayor dolor digital hoy?",opts:["No aparezco en Google","Pocos clientes nuevos","Mala imagen online"]},
];
const diagRes=(a)=>{
  if(a[0]===2)return{pkg:"GROWTH",clr:C.vio2,txt:"Con más de 2 años en el mercado, es hora de escalar. El paquete GROWTH combina web completa, SEO Full y prospección B2B nacional."};
  if(a[1]===2)return{pkg:"DIGITAL",clr:C.indigo,txt:"Ya tienes presencia pero necesitas optimizarla. El paquete DIGITAL incluye web con dominio, SEO Médium y prospección B2B local."};
  return{pkg:"PRESENCIA",clr:C.cyan,txt:"El primer paso es construir una base digital sólida. El paquete PRESENCIA te pone en línea rápido con Landing, Instagram y SEO básico."};
};

/* ─── CSS ─── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0A0D18}::-webkit-scrollbar-thumb{background:#4F46E5;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes aimascroll{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes floatind{0%,100%{transform:translateY(0) translateX(-50%)}50%{transform:translateY(-10px) translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.nav-lnk{color:#94A3B8;text-decoration:none;font-size:14px;transition:color .2s}.nav-lnk:hover{color:#EEF2FF}
.sv-card{background:#111827;border:1px solid #1a2235;border-radius:16px;padding:28px 26px;transition:transform .3s,border-color .3s,box-shadow .3s;display:flex;flex-direction:column}
.sv-card:hover{transform:translateY(-4px);border-color:#4F46E544;box-shadow:0 14px 36px rgba(79,70,229,.1)}
.dq-btn{background:#131B35;border:1px solid #1a2235;border-radius:12px;padding:15px 18px;color:#EEF2FF;font-size:15px;text-align:left;cursor:pointer;transition:border-color .2s,background .2s;font-family:'DM Sans',sans-serif;width:100%}
.dq-btn:hover{border-color:#4F46E5;background:rgba(79,70,229,.1)}
.btn-pr{background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;border:none;border-radius:10px;padding:13px 24px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;font-family:'DM Sans',sans-serif}
.btn-pr:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(79,70,229,.4)}
.btn-ou{background:transparent;border:1px solid #1a2235;color:#EEF2FF;border-radius:10px;padding:13px 24px;font-size:14px;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s;font-family:'DM Sans',sans-serif}
.btn-ou:hover{border-color:#4F46E5;background:rgba(79,70,229,.07)}
.inp{background:#111827;border:1px solid #1a2235;border-radius:10px;padding:14px 16px;color:#EEF2FF;font-size:15px;width:100%;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s}
.inp:focus{border-color:#4F46E5}.inp::placeholder{color:#64748B}

/* AI Chat — estilo imagen */
.ai-box{background:rgba(18,22,36,.7);border:1px solid rgba(255,255,255,.07);border-radius:18px;overflow:hidden;backdrop-filter:blur(16px)}
.ai-textarea{background:transparent;border:none;outline:none;color:#d0d7e8;font-size:16px;font-family:'DM Sans',sans-serif;resize:none;width:100%;padding:0;line-height:1.6;min-height:72px}
.ai-textarea::placeholder{color:#3a4560}
.ai-icon-btn{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#4a5568;font-size:16px;transition:all .2s}
.ai-icon-btn:hover{border-color:#4F46E566;color:#94A3B8;background:rgba(79,70,229,.1)}
.ai-send{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 20px;color:#94A3B8;font-size:14px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s;font-family:'DM Sans',sans-serif}
.ai-send:hover{background:rgba(79,70,229,.2);border-color:#4F46E566;color:#EEF2FF}
.ai-chip{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:9px 14px;font-size:13px;color:#64748B;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;display:flex;align-items:center;gap:7px}
.ai-chip:hover{border-color:rgba(79,70,229,.4);color:#94A3B8;background:rgba(79,70,229,.08)}
.ai-response{background:rgba(13,18,32,.8);border:1px solid #1a2235;border-radius:14px;padding:16px 20px;font-size:14px;color:#94A3B8;line-height:1.7;text-align:left;animation:fadeUp .4s ease}
`;

/* Brand card */
function BCard({name,sector,ini,clr,ig,text}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px 22px",width:276,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{width:44,height:44,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${clr}dd,${clr}88)`,border:`2px solid ${clr}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:17,color:"#fff"}}>{ini}</div>
        <div>
          <div style={{color:C.white,fontWeight:600,fontSize:13.5,lineHeight:1.3}}>{name}</div>
          <div style={{color:C.muted,fontSize:11.5,marginTop:2}}>{sector}</div>
        </div>
      </div>
      <p style={{color:C.soft,fontSize:13,lineHeight:1.65,fontStyle:"italic",marginBottom:12}}>"{text}"</p>
      <a href={`https://instagram.com/${ig.replace("@","")}`} target="_blank" rel="noopener noreferrer"
        style={{color:clr,fontSize:11.5,textDecoration:"none",fontFamily:"monospace"}}>{ig}</a>
    </div>
  );
}

function ScrollCol({items,dur}){
  const all=[...items,...items];
  return(
    <div style={{overflow:"hidden",flexShrink:0}}>
      <div style={{display:"flex",flexDirection:"column",gap:16,animation:`aimascroll ${dur}s linear infinite`}}>
        {all.map((b,i)=><BCard key={i} {...b}/>)}
      </div>
    </div>
  );
}

/* ─── AI CHAT SECTION ─── */
function AIChatSection(){
  const [query,setQuery]=useState("");
  const [response,setResponse]=useState(null);
  const [loading,setLoading]=useState(false);
  const taRef=useRef(null);

  const SYSTEM=`Eres el asistente virtual de AIMA Agency, agencia de marketing con Inteligencia Artificial para negocios colombianos. Respondes en español, de forma amigable, directa y concisa (máximo 3-4 oraciones cortas).

Servicios: Optimización Instagram $380,000 | Landing sin dominio $590,000 | Web con dominio $1,500,000 | SEO Básica $280,000 | SEO Médium $490,000 | SEO Full $890,000 | Prospección B2B $450,000 COP.

Paquetes: PRESENCIA $890,000 (Instagram+Landing+SEO Básica+Brochure+30d contenido) | DIGITAL $2,290,000 (Web+SEO Médium+Instagram+B2B local+Brochure+60d contenido) | GROWTH $3,990,000 (Web+SEO Full+Instagram+B2B nacional+Google Ads+Brochure+3 meses contenido).

Siempre entregamos en días, no semanas. Si el usuario quiere saber más, invítalo a contactar a hola@aimaagency.com.`;

  const ask=async(txt)=>{
    const q=txt||query; if(!q.trim()||loading)return;
    setLoading(true); setResponse(null);
    try{
      const res=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:SYSTEM,messages:[{role:"user",content:q}]}),
      });
      const data=await res.json();
      setResponse(data.content?.[0]?.text||"Escríbenos a hola@aimaagency.com");
    }catch{setResponse("Hubo un error. Escríbenos a hola@aimaagency.com");}
    setLoading(false);
  };

  const chips=[
    {icon:"🎯",label:"¿Qué paquete me recomiendas?"},
    {icon:"💸",label:"¿Cuánto cuesta una web?"},
    {icon:"📈",label:"¿En cuánto tiempo ven resultados?"},
    {icon:"✨",label:"¿Qué hace el SEO Full?"},
  ];

  return(
    <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
      {/* Glow background */}
      <div style={{position:"relative",zIndex:1}}>
        <div style={{fontSize:13,color:C.muted,fontFamily:"monospace",letterSpacing:".1em",textTransform:"uppercase",marginBottom:40}}>
          ¿Cómo puedo <span style={{color:C.white,fontWeight:600}}>ayudarte</span>{" "}
          <span style={{color:C.muted}}>hoy?</span>
        </div>

        {/* Giant title like image */}
        <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(32px,5.5vw,54px)",lineHeight:1.1,color:C.white,marginBottom:10}}>
          ¿Cómo puedo{" "}
          <span style={{color:"rgba(200,210,230,.9)",fontWeight:300}}>ayudarte</span>{" "}
          <span style={{color:C.muted,fontWeight:400}}>hoy?</span>
        </h2>
        <p style={{color:C.muted,fontSize:15,marginBottom:44}}>Escribe un comando o haz una pregunta</p>

        {/* The chat box */}
        <div className="ai-box" style={{marginBottom:20,textAlign:"left"}}>
          <div style={{padding:"22px 22px 14px"}}>
            <textarea ref={taRef} className="ai-textarea" rows={3}
              placeholder="Pregúntale a AIMA..."
              value={query} onChange={e=>{setQuery(e.target.value);setResponse(null);}}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask();}}}
            />
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,.06)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:8}}>
              <div className="ai-icon-btn">📎</div>
              <div className="ai-icon-btn" style={{fontFamily:"monospace",fontSize:12,letterSpacing:"-1px"}}>⌘K</div>
            </div>
            <button className="ai-send" onClick={()=>ask()} disabled={loading}>
              {loading
                ? <span style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${C.muted}`,borderTopColor:C.indigo,display:"inline-block",animation:"spin .7s linear infinite"}}/>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
              {loading?"Pensando...":"Enviar"}
            </button>
          </div>
        </div>

        {/* AI Response */}
        {response&&(
          <div className="ai-response" style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:24,height:24,borderRadius:6,background:`linear-gradient(135deg,${C.indigo},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",fontFamily:"Syne,sans-serif"}}>A</div>
              <span style={{color:C.muted,fontSize:12,fontWeight:500}}>AIMA Agency</span>
            </div>
            {response}
            <button className="btn-ou" onClick={()=>{setResponse(null);setQuery("");if(taRef.current)taRef.current.focus();}} style={{fontSize:12,padding:"8px 16px",marginTop:14}}>Nueva pregunta</button>
          </div>
        )}

        {/* Chips */}
        {!response&&(
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {chips.map(c=>(
              <button key={c.label} className="ai-chip" onClick={()=>{setQuery(c.label);ask(c.label);}}>
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function AIMA(){
  const [scrolled,setScrolled]=useState(false);
  const [dStep,setDStep]=useState(0);
  const [dAns,setDAns]=useState([]);
  const [dRes,setDRes]=useState(null);
  const [form,setForm]=useState({nombre:"",correo:"",tel:"",empresa:""});
  const [sent,setSent]=useState(false);

  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>60);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);

  const pick=(i)=>{const a=[...dAns,i];setDAns(a);if(dStep<2)setDStep(dStep+1);else{setDRes(diagRes(a));setDStep(4);}};
  const resetD=()=>{setDStep(0);setDAns([]);setDRes(null);};

  const sendForm=()=>{
    if(!form.nombre||!form.correo||!form.tel)return;
    const sub=`Nueva consulta AIMA — ${form.nombre}`;
    const body=`Nombre: ${form.nombre}\nCorreo: ${form.correo}\nTeléfono: ${form.tel}\n\nSobre su empresa:\n${form.empresa||"No especificado"}`;
    window.open(`mailto:hola@aimaagency.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`);
    setSent(true);
  };

  const G=(a,b)=>`linear-gradient(135deg,${a},${b})`;
  const Cell=({v})=>{
    if(v===true)return <span style={{color:C.green,fontSize:16}}>✓</span>;
    if(v===false)return <span style={{color:C.border2,fontSize:18}}>—</span>;
    return <span style={{color:C.soft,fontSize:13}}>{v}</span>;
  };

  return(
    <div style={{background:C.bg,color:C.white,fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",background:scrolled?"rgba(6,8,15,.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .4s"}}>
        <a href="#inicio" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <img src={AIMA_LOGO} alt="AIMA" style={{width:36,height:36,objectFit:"contain"}}/>
          <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:18,color:C.white}}>AIMA<span style={{color:C.cyan}}>.</span></span>
        </a>
        <div style={{display:"flex",gap:24}}>
          {[["#servicios","Servicios"],["#precios","Precios"],["#clientes","Clientes"],["#chat","Asistente IA"],["#contacto","Contacto"]].map(([h,l])=>(
            <a key={h} href={h} className="nav-lnk">{l}</a>
          ))}
        </div>
        <a href="#contacto" className="btn-pr" style={{textDecoration:"none",padding:"10px 20px",fontSize:13}}>Hablar con AIMA</a>
      </nav>

      {/* HERO */}
      <section id="inicio" style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <ThreeScene/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,rgba(6,8,15,.05) 0%,rgba(6,8,15,.4) 50%,${C.bg} 100%)`,zIndex:1}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:820,padding:"0 24px",animation:"fadeUp 1.2s ease both"}}>
          <span style={{display:"inline-block",padding:"5px 16px",borderRadius:20,border:`1px solid rgba(6,182,212,.4)`,color:C.cyan,fontSize:11,fontFamily:"monospace",letterSpacing:".14em",textTransform:"uppercase",marginBottom:28,background:"rgba(6,182,212,.07)"}}>Artificial Intelligence Marketing Agency · Colombia</span>
          <h1 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(36px,6vw,68px)",lineHeight:1.07,color:C.white,marginBottom:22}}>
            Más clientes.<br/>
            <span style={{background:G(C.indigo,C.cyan),WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Mejor presencia.</span><br/>
            Con Inteligencia Artificial.
          </h1>
          <p style={{color:C.soft,fontSize:18,lineHeight:1.65,maxWidth:560,margin:"0 auto 40px"}}>Desde Instagram hasta posicionamiento en Google. Entregas en días, no semanas.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#contacto" className="btn-pr" style={{textDecoration:"none",padding:"16px 32px",fontSize:16}}>Hablar con AIMA →</a>
            <a href="#servicios" className="btn-ou" style={{textDecoration:"none",padding:"16px 32px",fontSize:16}}>Ver servicios</a>
          </div>
        </div>
        <div style={{position:"absolute",bottom:28,left:"50%",zIndex:2,animation:"floatind 2.2s ease-in-out infinite",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <span style={{color:C.muted,fontSize:11,letterSpacing:".12em",fontFamily:"monospace"}}>SCROLL</span>
          <div style={{width:1,height:36,background:`linear-gradient(to bottom,${C.indigo},transparent)`}}/>
        </div>
      </section>

      {/* STRIP — marquee horizontal */}
      <div style={{background:C.night,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"14px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex",animation:"marquee 18s linear infinite",gap:0}}>
          {[...Array(2)].map((_,ri)=>(
            <span key={ri} style={{display:"inline-flex",alignItems:"center",gap:0}}>
              {["Entregas en días, no semanas","Potenciado por Inteligencia Artificial","Resultados medibles desde el día 1"].map((tx,i)=>(
                <span key={i} style={{display:"inline-flex",alignItems:"center",gap:0}}>
                  <span style={{color:C.soft,fontSize:14,fontWeight:500,padding:"0 40px"}}>{tx}</span>
                  <span style={{color:C.border2,fontSize:10}}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      <section id="servicios" style={{padding:"100px 48px",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{color:C.cyan,fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Servicios individuales</div>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,44px)",marginBottom:14}}>Todo lo que tu negocio <span style={{color:C.indigo}}>necesita online</span></h2>
          <p style={{color:C.soft,fontSize:16,maxWidth:500,margin:"0 auto"}}>Elige el servicio que necesitas o combínalos en un paquete.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {SVCS.map(s=>(
            <div key={s.name} className="sv-card">
              <span style={{fontFamily:"monospace",fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:".1em"}}>{s.name}</span>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:30,color:C.white,margin:"10px 0 4px"}}>{s.price}</div>
              <div style={{color:C.muted,fontSize:12,marginBottom:18}}>COP · pago único</div>
              <div style={{width:32,height:1,background:C.border,marginBottom:16}}/>
              <p style={{color:C.soft,fontSize:14,lineHeight:1.65,flexGrow:1}}>{s.desc}</p>
              <a href="#contacto" style={{textDecoration:"none",display:"block",marginTop:20}}>
                <button className="btn-pr" style={{width:"100%",fontSize:13}}>Contratar →</button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" style={{background:C.night,padding:"100px 48px"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{color:C.indigo,fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Paquetes</div>
            <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,44px)",marginBottom:14}}>Elige el plan que se ajuste <span style={{color:C.cyan}}>a tu empresa</span></h2>
            <p style={{color:C.soft,fontSize:16,maxWidth:420,margin:"0 auto"}}>Precios en COP, transparentes. Sin sorpresas.</p>
          </div>
          <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"200px 1fr 1fr 1fr",borderBottom:`1px solid ${C.border}`}}>
              <div style={{padding:"26px 20px"}}/>
              {PKGS.map((pkg,pi)=>(
                <div key={pkg.name} style={{padding:"26px 20px",borderLeft:`1px solid ${C.border}`,background:pkg.popular?`${C.indigo}10`:"transparent",position:"relative"}}>
                  {pkg.popular&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:G(C.indigo,C.vio2),padding:"3px 14px",borderRadius:"0 0 10px 10px",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:".08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Más popular</div>}
                  <div style={{color:pkg.color,fontSize:11,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,marginTop:pkg.popular?8:0}}>{pkg.name}</div>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:24,color:C.white,marginBottom:4}}>{pkg.price}</div>
                  <div style={{color:C.muted,fontSize:11,marginBottom:16}}>COP · pago único</div>
                  <a href="#contacto" style={{textDecoration:"none",display:"block"}}>
                    <button className="btn-pr" style={{width:"100%",fontSize:12,padding:"9px 0",background:pkg.popular?G(C.indigo,C.vio2):`${pkg.color}dd`}}>Empezar →</button>
                  </a>
                </div>
              ))}
            </div>
            {FEATS.map((f,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"200px 1fr 1fr 1fr",borderBottom:i<FEATS.length-1?`1px solid ${C.border}`:"none",background:i%2===0?"transparent":"rgba(255,255,255,.01)"}}>
                <div style={{padding:"13px 20px",fontSize:13,color:C.muted,display:"flex",alignItems:"center"}}>{f.label}</div>
                {f.vals.map((v,j)=>(
                  <div key={j} style={{padding:"13px 20px",display:"flex",alignItems:"center",borderLeft:`1px solid ${C.border}`,background:j===1&&PKGS[1].popular?`${C.indigo}05`:"transparent"}}>
                    <Cell v={v}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CLIENTES — 2 columnas, 4 marcas con testimonios */}
      <section id="clientes" style={{background:C.night,padding:"100px 0",overflow:"hidden"}}>
        <div style={{textAlign:"center",marginBottom:56,padding:"0 48px"}}>
          <div style={{color:C.vio2,fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Clientes</div>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,44px)",marginBottom:14}}>Empresas que confían en AIMA</h2>
          <p style={{color:C.soft,fontSize:16,maxWidth:400,margin:"0 auto"}}>Lo que dicen quienes ya dieron el salto digital.</p>
        </div>
        <div style={{display:"flex",gap:20,justifyContent:"center",padding:"0 20px",maskImage:"linear-gradient(to bottom,transparent,black 16%,black 84%,transparent)",WebkitMaskImage:"linear-gradient(to bottom,transparent,black 16%,black 84%,transparent)",height:560,overflow:"hidden"}}>
          <ScrollCol items={col1} dur={22}/>
          <ScrollCol items={col2} dur={28}/>
        </div>
      </section>

      {/* CHAT IA */}
      <section id="chat" style={{padding:"100px 48px",background:C.bg,position:"relative",overflow:"hidden"}}>
        {/* Subtle center glow */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:300,background:`radial-gradient(ellipse,rgba(79,70,229,.06) 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <AIChatSection/>
      </section>

      {/* CONTACTO — form */}
      <section id="contacto" style={{padding:"80px 48px 100px",background:C.night}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{color:C.cyan,fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Contacto</div>
            <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,44px)",marginBottom:14}}>Hablemos de tu <span style={{color:C.indigo}}>transformación digital</span></h2>
            <p style={{color:C.soft,fontSize:16}}>Cuéntanos sobre tu negocio y preparamos tu propuesta en 24 horas.</p>
          </div>
          {!sent?(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"44px 40px",boxShadow:`0 0 80px rgba(79,70,229,.07)`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
                <div>
                  <label style={{color:C.soft,fontSize:13,display:"block",marginBottom:8}}>Nombre completo *</label>
                  <input className="inp" placeholder="Tu nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
                </div>
                <div>
                  <label style={{color:C.soft,fontSize:13,display:"block",marginBottom:8}}>Correo electrónico *</label>
                  <input className="inp" type="email" placeholder="tu@correo.com" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})}/>
                </div>
              </div>
              <div style={{marginBottom:18}}>
                <label style={{color:C.soft,fontSize:13,display:"block",marginBottom:8}}>Teléfono / WhatsApp *</label>
                <input className="inp" placeholder="+57 300 000 0000" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})}/>
              </div>
              <div style={{marginBottom:28}}>
                <label style={{color:C.soft,fontSize:13,display:"block",marginBottom:8}}>Cuéntanos sobre tu empresa — ¿qué es y qué hace?</label>
                <textarea className="inp" placeholder="Describe tu negocio, a qué se dedica y cuál es tu mayor reto digital hoy..." value={form.empresa} onChange={e=>setForm({...form,empresa:e.target.value})} style={{minHeight:120,resize:"vertical",display:"block"}}/>
              </div>
              <button className="btn-pr" onClick={sendForm} style={{width:"100%",padding:18,fontSize:16}}>Enviar a AIMA Agency →</button>
              <p style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:14}}>📬 Tu mensaje llega a hola@aimaagency.com · Respondemos en máximo 24 horas</p>
            </div>
          ):(
            <div style={{background:C.card,border:`1px solid ${C.green}44`,borderRadius:24,padding:"72px 44px",textAlign:"center"}}>
              <div style={{fontSize:56,marginBottom:20}}>🚀</div>
              <h3 style={{fontFamily:"Syne,sans-serif",fontSize:28,color:C.green,marginBottom:12}}>¡Mensaje enviado!</h3>
              <p style={{color:C.soft,fontSize:16,marginBottom:32}}>Recibimos tu consulta. Te respondemos en máximo 24 horas con tu propuesta personalizada.</p>
              <button className="btn-ou" onClick={()=>{setSent(false);setForm({nombre:"",correo:"",tel:"",empresa:""});}}>Enviar otra consulta</button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"44px 48px 32px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:16}}>
          <img src={AIMA_LOGO} alt="AIMA" style={{width:40,height:40,objectFit:"contain"}}/>
          <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:20,color:C.white}}>AIMA<span style={{color:C.cyan}}>.</span></span>
        </div>
        <p style={{color:C.muted,fontSize:14,marginBottom:8}}>Artificial Intelligence Marketing Agency · Colombia</p>
        <p style={{color:C.muted,fontSize:13}}>hola@aimaagency.com · © 2025 AIMA Agency</p>
      </footer>
    </div>
  );
}
