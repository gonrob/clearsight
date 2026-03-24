import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const ADMIN_EMAIL = "gonrobtor@gmail.com";

const C = {
  bg:"#0D1117", card:"#161B22", border:"#30363D",
  text:"#E6EDF3", muted:"#8B949E",
  gold:"#C4922A", green:"#3FB950", blue:"#58A6FF",
};

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !isAdmin) { setError("Acceso denegado"); setLoading(false); return; }
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [isLoaded, isSignedIn]);

  async function fetchStats() {
    try {
      const key = new URLSearchParams(window.location.search).get("key") || "";
      const r = await fetch("/api/dashboard?key=" + key);
      if (!r.ok) throw new Error("HTTP " + r.status);
      setStats(await r.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (!isLoaded || loading) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:32,height:32,border:`3px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:"#F85149",fontFamily:"monospace",fontSize:16}}>
      {error}
    </div>
  );

  const s = stats || {};

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"-apple-system,sans-serif",padding:"32px 24px"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}`}</style>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:700,color:C.text,margin:0}}>📋 DocPlain Dashboard</h1>
            <div style={{fontSize:13,color:C.muted,marginTop:4}}>Actualizado: {new Date().toLocaleTimeString("es-ES")}</div>
          </div>
          <button onClick={fetchStats}
            style={{padding:"8px 16px",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:13}}>
            ↻ Actualizar
          </button>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:32}}>
          {[
            ["👥","Usuarios totales",s.totalUsers||0,C.blue],
            ["✨","Nuevos esta semana",s.newUsersWeek||0,C.green],
            ["💳","Suscriptores activos",s.activeSubscriptions||0,C.gold],
            ["💰","MRR",(s.mrr||0)+"€",C.gold],
          ].map(([icon,title,val,color],i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
              <div style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:8}}>{title}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{icon}</span>
                <div style={{fontSize:32,fontWeight:800,color}}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>👥 Últimos registros</div>
            {(s.recentUsers||[]).length===0?(
              <div style={{fontSize:13,color:C.muted}}>Sin usuarios aún</div>
            ):(s.recentUsers||[]).map((u,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<(s.recentUsers.length-1)?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:13,color:C.text}}>{u.email}</div>
                <div style={{fontSize:11,color:C.muted}}>{u.created}</div>
              </div>
            ))}
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>💳 Últimos pagos</div>
            {(s.recentPayments||[]).length===0?(
              <div style={{fontSize:13,color:C.muted}}>Sin pagos aún — ¡pronto!</div>
            ):(s.recentPayments||[]).map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<(s.recentPayments.length-1)?`1px solid ${C.border}`:"none"}}>
                <div>
                  <div style={{fontSize:13,color:C.text}}>{p.email}</div>
                  <div style={{fontSize:11,color:C.muted}}>{p.date} · {p.plan}</div>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:C.green}}>+{p.amount}€</div>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[
            ["🔐 Clerk","https://dashboard.clerk.com"],
            ["💳 Stripe","https://dashboard.stripe.com"],
            ["📊 PostHog","https://eu.posthog.com"],
            ["▲ Vercel","https://vercel.com"],
            ["⚙️ GitHub","https://github.com/gonrob/clearsight"],
          ].map(([label,url])=>(
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              style={{padding:"8px 14px",background:C.card,border:`1px solid ${C.border}`,
                borderRadius:8,textDecoration:"none",color:C.muted,fontSize:12,fontWeight:500}}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
