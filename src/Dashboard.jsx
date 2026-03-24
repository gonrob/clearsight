import { useState, useEffect } from "react";

const C = {
  bg: "#0D1117",
  card: "#161B22",
  border: "#30363D",
  text: "#E6EDF3",
  muted: "#8B949E",
  gold: "#C4922A",
  green: "#3FB950",
  red: "#F85149",
  blue: "#58A6FF",
};

const ADMIN_EMAIL = "gonrobtor@gmail.com";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const key = new URLSearchParams(window.location.search).get("key") || "";
      const r = await fetch("/api/dashboard?key=" + key);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      setStats(d);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (loading) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:32,height:32,border:`3px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.red,fontFamily:"monospace"}}>
      Error: {error}
    </div>
  );

  const s = stats || {};

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:"32px 24px"}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:700,color:C.text,margin:0}}>📋 DocPlain Dashboard</h1>
            <div style={{fontSize:13,color:C.muted,marginTop:4}}>
              Actualizado: {new Date().toLocaleTimeString("es-ES")}
            </div>
          </div>
          <button onClick={fetchStats}
            style={{padding:"8px 16px",background:C.card,border:`1px solid ${C.border}`,
              borderRadius:8,color:C.muted,cursor:"pointer",fontSize:13}}>
            ↻ Actualizar
          </button>
        </div>

        {/* KPI Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:32}}>
          <KPI title="Usuarios totales" value={s.totalUsers || 0} icon="👥" color={C.blue}/>
          <KPI title="Nuevos esta semana" value={s.newUsersWeek || 0} icon="✨" color={C.green}/>
          <KPI title="Suscriptores activos" value={s.activeSubscriptions || 0} icon="💳" color={C.gold}/>
          <KPI title="MRR (ingresos/mes)" value={`${s.mrr || 0}€`} icon="💰" color={C.gold}/>
        </div>

        {/* Stripe + Clerk side by side */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>

          {/* Últimos usuarios */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>👥 Últimos registros</div>
            {(s.recentUsers || []).length === 0 ? (
              <div style={{fontSize:13,color:C.muted}}>Sin datos</div>
            ) : (s.recentUsers || []).map((u, i) => (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:i < s.recentUsers.length-1?`1px solid ${C.border}`:"none"}}>
                <div>
                  <div style={{fontSize:13,color:C.text}}>{u.email}</div>
                  <div style={{fontSize:11,color:C.muted}}>{u.created}</div>
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
              </div>
            ))}
          </div>

          {/* Últimos pagos */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>💳 Últimos pagos</div>
            {(s.recentPayments || []).length === 0 ? (
              <div style={{fontSize:13,color:C.muted}}>Sin pagos aún — ¡pronto!</div>
            ) : (s.recentPayments || []).map((p, i) => (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:i < s.recentPayments.length-1?`1px solid ${C.border}`:"none"}}>
                <div>
                  <div style={{fontSize:13,color:C.text}}>{p.email}</div>
                  <div style={{fontSize:11,color:C.muted}}>{p.date} · {p.plan}</div>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:C.green}}>+{p.amount}€</div>
              </div>
            ))}
          </div>
        </div>

        {/* Links rápidos */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
          {[
            {label:"Clerk — Usuarios", url:"https://dashboard.clerk.com", icon:"🔐"},
            {label:"Stripe — Pagos", url:"https://dashboard.stripe.com", icon:"💳"},
            {label:"PostHog — Analytics", url:"https://eu.posthog.com", icon:"📊"},
            {label:"Vercel — Deploy", url:"https://vercel.com", icon:"▲"},
            {label:"GitHub — Código", url:"https://github.com/gonrob/clearsight", icon:"⚙️"},
          ].map((l,i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",
                background:C.card,border:`1px solid ${C.border}`,borderRadius:10,
                textDecoration:"none",color:C.muted,fontSize:12,fontWeight:500,
                transition:"border-color .2s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.gold}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{fontSize:16}}>{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({title, value, icon, color}) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
      <div style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:8}}>{title}</div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:24}}>{icon}</span>
        <div style={{fontSize:32,fontWeight:800,color}}>{value}</div>
      </div>
    </div>
  );
}
