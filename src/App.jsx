import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#F7F5F0",
  paper:    "#FFFFFF",
  ink:      "#1A1A18",
  inkLight: "#6B6860",
  accent:   "#2D5016",   // deep legal green
  accentL:  "#4A7C2F",
  accentDim:"rgba(45,80,22,.08)",
  gold:     "#C4922A",
  goldDim:  "rgba(196,146,42,.12)",
  red:      "#C0392B",
  redDim:   "rgba(192,57,43,.08)",
  border:   "#E2DDD6",
  shadow:   "rgba(26,26,24,.06)",
};

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
const LANGS = {
  es: {
    flag:"🇪🇸", name:"Español",
    tagline:"See through any contract.",
    sub:"Sube cualquier documento legal y te lo explicamos en lenguaje claro.",
    uploadTitle:"Sube tu documento",
    uploadSub:"PDF, imagen o foto de contrato",
    orText:"o escribe el texto directamente",
    textPh:"Pega aquí el texto del contrato, cláusula o documento que quieres entender...",
    analyzeBtn:"Analizar documento",
    analyzing:"Analizando...",
    docTypes:["Contrato de alquiler","Contrato de trabajo","Préstamo","Multa","Cláusula","Otro"],
    docTypeLabel:"¿Qué tipo de documento es?",
    langOutput:"Idioma del análisis",
    resultTitle:"Análisis del documento",
    summaryTitle:"Resumen en lenguaje claro",
    risksTitle:"🔴 Riesgos y cláusulas problemáticas",
    goodTitle:"🟢 Puntos favorables",
    watchTitle:"🟡 Cosas a tener en cuenta",
    negotiateTitle:"💬 Qué puedes negociar",
    questionsTitle:"❓ Preguntas que deberías hacer",
    newDoc:"Analizar otro documento",
    listenBtn:"🔊 Escuchar resumen",
    listeningBtn:"🔊 Hablando...",
    errorMsg:"Error al analizar. Inténtalo de nuevo.",
    dropHere:"Suelta el archivo aquí",
    fileReady:"Archivo listo",
    disclaimer:"⚠️ Este análisis es orientativo y no sustituye el consejo de un abogado.",
  },
  en: {
    flag:"🇬🇧", name:"English",
    tagline:"Understand what you sign.",
    sub:"Upload any legal document and we'll explain it in plain language.",
    uploadTitle:"Upload your document",
    uploadSub:"PDF, image or photo of contract",
    orText:"or type the text directly",
    textPh:"Paste here the text of the contract, clause or document you want to understand...",
    analyzeBtn:"Analyze document",
    analyzing:"Analyzing...",
    docTypes:["Rental contract","Employment contract","Loan","Fine","Clause","Other"],
    docTypeLabel:"What type of document is it?",
    langOutput:"Analysis language",
    resultTitle:"Document analysis",
    summaryTitle:"Plain language summary",
    risksTitle:"🔴 Risks and problematic clauses",
    goodTitle:"🟢 Favorable points",
    watchTitle:"🟡 Things to watch out for",
    negotiateTitle:"💬 What you can negotiate",
    questionsTitle:"❓ Questions you should ask",
    newDoc:"Analyze another document",
    listenBtn:"🔊 Listen to summary",
    listeningBtn:"🔊 Speaking...",
    errorMsg:"Error analyzing. Please try again.",
    dropHere:"Drop file here",
    fileReady:"File ready",
    disclaimer:"⚠️ This analysis is informational and does not replace legal advice.",
  },
  fr: {
    flag:"🇫🇷", name:"Français",
    tagline:"Comprenez ce que vous signez.",
    sub:"Téléchargez n'importe quel document juridique et nous vous l'expliquons clairement.",
    uploadTitle:"Téléchargez votre document",
    uploadSub:"PDF, image ou photo de contrat",
    orText:"ou tapez le texte directement",
    textPh:"Collez ici le texte du contrat, de la clause ou du document que vous souhaitez comprendre...",
    analyzeBtn:"Analyser le document",
    analyzing:"Analyse en cours...",
    docTypes:["Bail","Contrat de travail","Prêt","Amende","Clause","Autre"],
    docTypeLabel:"Quel type de document ?",
    langOutput:"Langue d'analyse",
    resultTitle:"Analyse du document",
    summaryTitle:"Résumé en langage clair",
    risksTitle:"🔴 Risques et clauses problématiques",
    goodTitle:"🟢 Points favorables",
    watchTitle:"🟡 Points d'attention",
    negotiateTitle:"💬 Ce que vous pouvez négocier",
    questionsTitle:"❓ Questions à poser",
    newDoc:"Analyser un autre document",
    listenBtn:"🔊 Écouter le résumé",
    listeningBtn:"🔊 En cours...",
    errorMsg:"Erreur d'analyse. Réessayez.",
    dropHere:"Déposez le fichier ici",
    fileReady:"Fichier prêt",
    disclaimer:"⚠️ Cette analyse est indicative et ne remplace pas l'avis d'un avocat.",
  },
  pt: {
    flag:"🇧🇷", name:"Português",
    tagline:"Entenda o que você assina.",
    sub:"Envie qualquer documento jurídico e explicamos em linguagem simples.",
    uploadTitle:"Envie seu documento",
    uploadSub:"PDF, imagem ou foto de contrato",
    orText:"ou escreva o texto diretamente",
    textPh:"Cole aqui o texto do contrato, cláusula ou documento que você quer entender...",
    analyzeBtn:"Analisar documento",
    analyzing:"Analisando...",
    docTypes:["Contrato de aluguel","Contrato de trabalho","Empréstimo","Multa","Cláusula","Outro"],
    docTypeLabel:"Que tipo de documento é?",
    langOutput:"Idioma da análise",
    resultTitle:"Análise do documento",
    summaryTitle:"Resumo em linguagem clara",
    risksTitle:"🔴 Riscos e cláusulas problemáticas",
    goodTitle:"🟢 Pontos favoráveis",
    watchTitle:"🟡 Pontos de atenção",
    negotiateTitle:"💬 O que você pode negociar",
    questionsTitle:"❓ Perguntas que você deve fazer",
    newDoc:"Analisar outro documento",
    listenBtn:"🔊 Ouvir resumo",
    listeningBtn:"🔊 Falando...",
    errorMsg:"Erro ao analisar. Tente novamente.",
    dropHere:"Solte o arquivo aqui",
    fileReady:"Arquivo pronto",
    disclaimer:"⚠️ Esta análise é orientativa e não substitui o conselho de um advogado.",
  },
  ru: {
    flag:"🇷🇺", name:"Русский",
    tagline:"Понимайте, что подписываете.",
    sub:"Загрузите любой юридический документ — объясним простым языком.",
    uploadTitle:"Загрузите документ",
    uploadSub:"PDF, изображение или фото договора",
    orText:"или введите текст напрямую",
    textPh:"Вставьте сюда текст договора, пункта или документа, который хотите понять...",
    analyzeBtn:"Анализировать документ",
    analyzing:"Анализируем...",
    docTypes:["Договор аренды","Трудовой договор","Кредит","Штраф","Пункт договора","Другое"],
    docTypeLabel:"Какой тип документа?",
    langOutput:"Язык анализа",
    resultTitle:"Анализ документа",
    summaryTitle:"Краткое изложение простым языком",
    risksTitle:"🔴 Риски и проблемные пункты",
    goodTitle:"🟢 Выгодные условия",
    watchTitle:"🟡 На что обратить внимание",
    negotiateTitle:"💬 Что можно обсудить",
    questionsTitle:"❓ Вопросы, которые стоит задать",
    newDoc:"Анализировать другой документ",
    listenBtn:"🔊 Прослушать резюме",
    listeningBtn:"🔊 Воспроизведение...",
    errorMsg:"Ошибка анализа. Попробуйте снова.",
    dropHere:"Перетащите файл сюда",
    fileReady:"Файл готов",
    disclaimer:"⚠️ Этот анализ носит ознакомительный характер и не заменяет юридическую консультацию.",
  },
  zh: {
    flag:"🇨🇳", name:"中文",
    tagline:"读懂您签署的文件。",
    sub:"上传任何法律文件，我们用简单易懂的语言为您解释。",
    uploadTitle:"上传您的文件",
    uploadSub:"PDF、图片或合同照片",
    orText:"或直接输入文字",
    textPh:"将合同、条款或您想了解的文件文字粘贴至此...",
    analyzeBtn:"分析文件",
    analyzing:"分析中...",
    docTypes:["租赁合同","劳动合同","贷款","罚款","条款","其他"],
    docTypeLabel:"文件类型是什么？",
    langOutput:"分析语言",
    resultTitle:"文件分析",
    summaryTitle:"简明摘要",
    risksTitle:"🔴 风险与问题条款",
    goodTitle:"🟢 有利条款",
    watchTitle:"🟡 注意事项",
    negotiateTitle:"💬 可以协商的内容",
    questionsTitle:"❓ 您应该提出的问题",
    newDoc:"分析另一份文件",
    listenBtn:"🔊 收听摘要",
    listeningBtn:"🔊 播放中...",
    errorMsg:"分析出错，请重试。",
    dropHere:"将文件拖放至此",
    fileReady:"文件已就绪",
    disclaimer:"⚠️ 本分析仅供参考，不能替代专业法律建议。",
  },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:${C.bg}; color:${C.ink}; font-family:'DM Sans',sans-serif; min-height:100vh; }
  h1,h2,h3 { font-family:'Lora',serif; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
  input,button,textarea,select { font-family:'DM Sans',sans-serif; }
  .fade { animation:fadeUp .4s ease both; }
  .shimmer {
    background: linear-gradient(90deg, ${C.border} 25%, #E8E4DC 50%, ${C.border} 75%);
    background-size:400px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }
`;

function GlobalCSS() { return <style dangerouslySetInnerHTML={{__html:CSS}}/>; }

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function LogoMark({size=32}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="4" width="28" height="36" rx="3" fill={C.accent} opacity=".15"/>
      <rect x="6" y="4" width="28" height="36" rx="3" stroke={C.accent} strokeWidth="2"/>
      <line x1="13" y1="14" x2="27" y2="14" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
      <line x1="13" y1="20" x2="27" y2="20" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
      <line x1="13" y1="26" x2="21" y2="26" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="36" cy="36" r="10" fill={C.gold}/>
      <path d="M31 36l3.5 3.5L41 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function Section({icon, title, items, color, bg}) {
  if (!items?.length) return null;
  return (
    <div style={{background:bg||C.paper, borderRadius:14, padding:"20px 22px",
      border:`1px solid ${C.border}`, marginBottom:14}}>
      <div style={{fontSize:15, fontWeight:700, color:color||C.ink,
        marginBottom:12, fontFamily:"'DM Sans',sans-serif"}}>{title}</div>
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        {items.map((item,i) => (
          <div key={i} style={{display:"flex", gap:10, alignItems:"flex-start"}}>
            <div style={{width:5, height:5, borderRadius:"50%", background:color||C.inkLight,
              flexShrink:0, marginTop:8}}/>
            <div style={{fontSize:14, color:C.ink, lineHeight:1.6}}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:14}}>
      {[180, 120, 150, 100].map((h,i) => (
        <div key={i} style={{height:h, borderRadius:14, overflow:"hidden"}}>
          <div className="shimmer" style={{width:"100%", height:"100%"}}/>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("es");
  const t = LANGS[lang];

  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null); // base64
  const [text, setText] = useState("");
  const [docType, setDocType] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── File handling ──
  function handleFile(f) {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setFileData({ base64, type: f.type, name: f.name });
    };
    reader.readAsDataURL(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  // ── Analyze ──
  async function analyze() {
    if (!text.trim() && !fileData) return;
    setError(null); setResult(null); setAnalyzing(true);

    const langMap = {es:"español",en:"English",fr:"français",pt:"português",ru:"русском языке",zh:"中文"};
    const outputLang = langMap[lang] || "español";

    let messages;

    if (fileData && (fileData.type.includes("pdf") || fileData.type.includes("image"))) {
      // Send as vision/document
      const mediaType = fileData.type.includes("pdf") ? "application/pdf" : fileData.type;
      messages = [{
        role: "user",
        content: [
          {
            type: fileData.type.includes("pdf") ? "document" : "image",
            source: { type: "base64", media_type: mediaType, data: fileData.base64 }
          },
          {
            type: "text",
            text: buildPrompt(outputLang, docType, "")
          }
        ]
      }];
    } else {
      // Text only
      const content = text.trim() || `Documento: ${fileData?.name || "sin nombre"}`;
      messages = [{ role: "user", content: buildPrompt(outputLang, docType, content) }];
    }

    try {
      const r = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 3000,
          system: `Eres un experto legal que ayuda a gente común a entender documentos legales. Responde en ${outputLang}. Responde SOLO con JSON válido sin markdown.`,
          messages
        })
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      const raw = (d.content || []).map(b => b.text || "").join("");
      const parsed = safeJson(raw);
      if (!parsed) throw new Error("Formato inválido");
      if (mountedRef.current) setResult(parsed);
    } catch(e) {
      console.error(e);
      if (mountedRef.current) setError(t.errorMsg + " (" + e.message + ")");
    }
    if (mountedRef.current) setAnalyzing(false);
  }

  function buildPrompt(outputLang, docType, content) {
    return `Analiza este documento legal${docType ? ` (${docType})` : ""} y responde en ${outputLang} con este JSON exacto:
{
  "title": "título breve del documento",
  "summary": "explicación clara en 3-4 frases para alguien sin conocimientos legales",
  "risks": ["riesgo o cláusula problemática 1", "riesgo 2", "riesgo 3"],
  "good": ["punto favorable 1", "punto favorable 2"],
  "watch": ["cosa a tener en cuenta 1", "cosa 2"],
  "negotiate": ["qué podrías intentar negociar 1", "punto 2"],
  "questions": ["pregunta que deberías hacer 1", "pregunta 2", "pregunta 3"],
  "verdict": "FAVORABLE | NEUTRO | DESFAVORABLE",
  "verdictReason": "una frase explicando el veredicto"
}

${content ? `DOCUMENTO:\n${content}` : "Analiza el documento adjunto."}`;
  }

  function safeJson(txt) {
    try {
      const clean = txt.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      return JSON.parse(clean);
    } catch { return null; }
  }

  // ── Audio ──
  async function listen() {
    if (!result?.summary || speaking) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setSpeaking(true);
    try {
      const r = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.summary, voiceId: "yiWEefwu5z3DQCM79clN" })
      });
      if (r.ok) {
        const blob = await r.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audioRef.current = audio;
        audio.onended = () => { if (mountedRef.current) setSpeaking(false); };
        audio.play();
      } else { setSpeaking(false); }
    } catch { setSpeaking(false); }
  }

  function reset() {
    setFile(null); setFileData(null); setText(""); setDocType("");
    setResult(null); setError(null); setAnalyzing(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setSpeaking(false);
  }

  const verdictColor = {FAVORABLE:C.accent, NEUTRO:C.gold, DESFAVORABLE:C.red,
    FAVORABLE:C.accent, NEUTRAL:C.gold, UNFAVORABLE:C.red,
    FAVORABLE:C.accent}[result?.verdict] || C.gold;

  const canAnalyze = (text.trim().length > 20 || fileData) && !analyzing;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalCSS/>
      <div style={{minHeight:"100vh", background:C.bg}}>

        {/* Header */}
        <header style={{background:C.paper, borderBottom:`1px solid ${C.border}`,
          padding:"0 20px", position:"sticky", top:0, zIndex:100,
          boxShadow:`0 2px 12px ${C.shadow}`}}>
          <div style={{maxWidth:680, margin:"0 auto", height:60,
            display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <LogoMark size={36}/>
              <div>
                <div style={{fontSize:17, fontWeight:700, fontFamily:"'Lora',serif",
                  color:C.ink, lineHeight:1}}>ClearSight</div>
                <div style={{fontSize:11, color:C.inkLight, letterSpacing:".04em"}}>
                  {t.tagline}
                </div>
              </div>
            </div>

            {/* Language selector */}
            <div style={{display:"flex", gap:4}}>
              {Object.entries(LANGS).map(([k,v]) => (
                <button key={k} onClick={() => setLang(k)}
                  style={{padding:"5px 9px", background:lang===k?C.accentDim:"transparent",
                    border:`1px solid ${lang===k?C.accent:C.border}`,
                    borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600,
                    color:lang===k?C.accent:C.inkLight, transition:"all .2s"}}>
                  {v.flag} {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main style={{maxWidth:680, margin:"0 auto", padding:"32px 20px 80px"}}>

          {/* Hero */}
          {!result && !analyzing && (
            <div className="fade" style={{textAlign:"center", marginBottom:36}}>
              <h1 style={{fontSize:"clamp(26px,5vw,38px)", fontWeight:700, color:C.ink,
                lineHeight:1.2, marginBottom:10}}>{t.tagline}</h1>
              <p style={{fontSize:16, color:C.inkLight, lineHeight:1.6}}>{t.sub}</p>
            </div>
          )}

          {/* Input area */}
          {!result && !analyzing && (
            <div className="fade">

              {/* Doc type */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13, fontWeight:600, color:C.inkLight,
                  marginBottom:8, letterSpacing:".03em"}}>{t.docTypeLabel}</div>
                <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                  {t.docTypes.map(dt => (
                    <button key={dt} onClick={() => setDocType(dt===docType?"":dt)}
                      style={{padding:"7px 14px", background:docType===dt?C.accentDim:C.paper,
                        border:`1px solid ${docType===dt?C.accent:C.border}`,
                        borderRadius:20, cursor:"pointer", fontSize:13, fontWeight:500,
                        color:docType===dt?C.accent:C.inkLight, transition:"all .2s"}}>
                      {dt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload zone */}
              <div
                onDragOver={e=>{e.preventDefault();setDragging(true);}}
                onDragLeave={()=>setDragging(false)}
                onDrop={handleDrop}
                onClick={()=>!file&&fileInputRef.current?.click()}
                style={{
                  border:`2px dashed ${dragging?C.accent:file?C.accentL:C.border}`,
                  borderRadius:16, padding:"28px 20px", textAlign:"center",
                  background:dragging?C.accentDim:file?`${C.accentDim}`:C.paper,
                  cursor:file?"default":"pointer", transition:"all .25s",
                  marginBottom:16
                }}>
                <input ref={fileInputRef} type="file" accept=".pdf,image/*"
                  style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                {file ? (
                  <div>
                    <div style={{fontSize:32, marginBottom:8}}>📄</div>
                    <div style={{fontSize:15, fontWeight:600, color:C.accent}}>{t.fileReady}</div>
                    <div style={{fontSize:13, color:C.inkLight, marginTop:4}}>{file.name}</div>
                    <button onClick={e=>{e.stopPropagation();setFile(null);setFileData(null);}}
                      style={{marginTop:10, padding:"5px 12px", background:"transparent",
                        border:`1px solid ${C.border}`, borderRadius:8, cursor:"pointer",
                        fontSize:12, color:C.inkLight}}>✕ Quitar</button>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize:40, marginBottom:10}}>
                      {dragging ? "📂" : "📎"}
                    </div>
                    <div style={{fontSize:15, fontWeight:600, color:C.ink}}>
                      {dragging ? t.dropHere : t.uploadTitle}
                    </div>
                    <div style={{fontSize:13, color:C.inkLight, marginTop:4}}>{t.uploadSub}</div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
                <div style={{flex:1, height:1, background:C.border}}/>
                <div style={{fontSize:13, color:C.inkLight}}>{t.orText}</div>
                <div style={{flex:1, height:1, background:C.border}}/>
              </div>

              {/* Text input */}
              <textarea
                value={text}
                onChange={e=>setText(e.target.value)}
                placeholder={t.textPh}
                rows={6}
                style={{width:"100%", padding:"14px 16px", background:C.paper,
                  border:`1.5px solid ${text?C.accent:C.border}`, borderRadius:14,
                  fontSize:14, color:C.ink, lineHeight:1.6, resize:"vertical",
                  outline:"none", transition:"border-color .2s",
                  fontFamily:"'DM Sans',sans-serif"}}
                onFocus={e=>e.target.style.borderColor=C.accent}
                onBlur={e=>e.target.style.borderColor=text?C.accent:C.border}
              />

              {/* Error */}
              {error && (
                <div style={{marginTop:12, padding:"12px 14px", background:C.redDim,
                  border:`1px solid ${C.red}`, borderRadius:10, fontSize:13, color:C.red}}>
                  {error}
                </div>
              )}

              {/* Analyze button */}
              <button onClick={analyze} disabled={!canAnalyze}
                style={{width:"100%", marginTop:16, padding:"15px",
                  background:canAnalyze?C.accent:"#C8C4BC",
                  color:"#fff", border:"none", borderRadius:14,
                  fontSize:16, fontWeight:700, cursor:canAnalyze?"pointer":"not-allowed",
                  transition:"all .2s", letterSpacing:".02em",
                  boxShadow:canAnalyze?`0 4px 16px rgba(45,80,22,.3)`:"none"}}>
                {t.analyzeBtn}
              </button>

              <p style={{textAlign:"center", fontSize:12, color:C.inkLight,
                marginTop:12, lineHeight:1.5}}>{t.disclaimer}</p>
            </div>
          )}

          {/* Loading */}
          {analyzing && (
            <div className="fade">
              <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:24,
                padding:"16px 20px", background:C.paper, borderRadius:14,
                border:`1px solid ${C.border}`}}>
                <div style={{width:20, height:20, border:`2.5px solid ${C.accent}`,
                  borderTopColor:"transparent", borderRadius:"50%",
                  animation:"spin .8s linear infinite", flexShrink:0}}/>
                <div style={{fontSize:15, fontWeight:600, color:C.ink}}>{t.analyzing}</div>
              </div>
              <Skeleton/>
            </div>
          )}

          {/* Results */}
          {result && !analyzing && (
            <div className="fade">
              {/* Verdict banner */}
              <div style={{background:C.paper, border:`2px solid ${verdictColor}`,
                borderRadius:16, padding:"20px 22px", marginBottom:20,
                display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12, fontWeight:700, color:verdictColor,
                    letterSpacing:".1em", textTransform:"uppercase", marginBottom:4}}>
                    {result.verdict}
                  </div>
                  <div style={{fontSize:18, fontWeight:700, fontFamily:"'Lora',serif",
                    color:C.ink, marginBottom:6}}>{result.title}</div>
                  <div style={{fontSize:14, color:C.inkLight}}>{result.verdictReason}</div>
                </div>
                <div style={{width:48, height:48, borderRadius:"50%",
                  background:`${verdictColor}18`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, flexShrink:0}}>
                  {result.verdict==="FAVORABLE"||result.verdict==="FAVORABLE"?"✅":
                   result.verdict==="DESFAVORABLE"||result.verdict==="UNFAVORABLE"?"⚠️":"⚖️"}
                </div>
              </div>

              {/* Summary */}
              <div style={{background:C.paper, borderRadius:14, padding:"20px 22px",
                border:`1px solid ${C.border}`, marginBottom:14}}>
                <div style={{fontSize:15, fontWeight:700, color:C.ink, marginBottom:10,
                  fontFamily:"'DM Sans',sans-serif"}}>{t.summaryTitle}</div>
                <p style={{fontSize:15, color:C.ink, lineHeight:1.7, fontFamily:"'Lora',serif",
                  fontStyle:"italic"}}>{result.summary}</p>
                <button onClick={listen} disabled={speaking}
                  style={{marginTop:14, padding:"8px 16px",
                    background:speaking?C.accentDim:C.accentDim,
                    border:`1px solid ${C.accent}`, borderRadius:8,
                    cursor:"pointer", fontSize:13, fontWeight:600, color:C.accent}}>
                  {speaking ? t.listeningBtn : t.listenBtn}
                </button>
              </div>

              <Section title={t.risksTitle} items={result.risks} color={C.red} bg={C.redDim}/>
              <Section title={t.goodTitle} items={result.good} color={C.accent} bg={C.accentDim}/>
              <Section title={t.watchTitle} items={result.watch} color={C.gold} bg={C.goldDim}/>
              <Section title={t.negotiateTitle} items={result.negotiate} color={C.accent}/>
              <Section title={t.questionsTitle} items={result.questions} color={C.inkLight}/>

              <p style={{fontSize:12, color:C.inkLight, textAlign:"center",
                marginTop:16, lineHeight:1.5}}>{t.disclaimer}</p>

              <button onClick={reset}
                style={{width:"100%", marginTop:16, padding:"14px",
                  background:"transparent", color:C.accent,
                  border:`1.5px solid ${C.accent}`, borderRadius:14,
                  fontSize:15, fontWeight:600, cursor:"pointer"}}>
                ← {t.newDoc}
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
