import { useState, useRef, useEffect } from "react";
import { useUser, useClerk, SignIn, SignUp } from "@clerk/clerk-react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#F7F5F0", paper:"#FFFFFF", ink:"#1A1A18", inkLight:"#6B6860",
  accent:"#2D5016", accentDim:"rgba(45,80,22,.10)",
  gold:"#C4922A", goldDim:"rgba(196,146,42,.12)",
  red:"#C0392B", redDim:"rgba(192,57,43,.08)",
  border:"#E2DDD6", shadow:"rgba(26,26,24,.08)",
};
const GG = "linear-gradient(135deg,#2D5016,#4A7C2F)";
const FREE_LIMIT = 2;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#F7F5F0;color:#1A1A18;font-family:'DM Sans',sans-serif;min-height:100vh}
  h1,h2,h3{font-family:'Lora',serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E2DDD6;border-radius:4px}
  input,button,textarea,select{font-family:'DM Sans',sans-serif}
  .fade{animation:fadeUp .35s ease both}
  .shimmer{background:linear-gradient(90deg,#E2DDD6 25%,#E8E4DC 50%,#E2DDD6 75%);background-size:400px 100%;animation:shimmer 1.4s ease-in-out infinite}
`;

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  es:{ flag:"🇪🇸", lp:"español",
    tagline:"Sube tu contrato y DocPlain te explica lo que firmas.",
    sub:"Contratos de alquiler, trabajo, préstamos — te decimos los riesgos, lo que puedes negociar y qué preguntar.",
    docTypes:["Alquiler","Trabajo","Préstamo","Multa","Cláusula","Otro"],
    docTypeLabel:"¿Qué tipo de documento?",
    uploadTitle:"Sube tu documento", uploadSub:"PDF o imágenes (varias páginas)",
    cameraBtn:"📷 Cámara", galleryBtn:"📎 PDF / Fotos",
    orText:"o escribe el texto directamente",
    textPh:"Pega aquí el texto del contrato o cláusula...",
    analyzeBtn:"Analizar documento ✦", analyzing:"Analizando...",
    addPage:"+ Añadir página", pages:n=>`${n} página${n>1?"s":""}`,
    summaryTitle:"Resumen en lenguaje claro",
    risksTitle:"🔴 Riesgos y cláusulas problemáticas",
    goodTitle:"🟢 Puntos favorables",
    watchTitle:"🟡 Cosas a tener en cuenta",
    negotiateTitle:"💬 Qué puedes negociar",
    questionsTitle:"❓ Preguntas que deberías hacer",
    newDoc:"← Analizar otro documento",
    listenBtn:"🔊 Escuchar resumen", listeningBtn:"🔊 Hablando...",
    exportBtn:"⬇ Exportar PDF",
    errorMsg:"Error al analizar. Inténtalo de nuevo.",
    dropHere:"Suelta aquí", fileReady:"listo",
    disclaimer:"⚠️ Orientativo. No sustituye asesoría legal.",
    logoutBtn:"Salir",
    limitTitle:"Límite semanal alcanzado",
    limitMsg:`Has usado tus ${FREE_LIMIT} análisis gratuitos esta semana.`,
    upgradeBtn:"Ver planes",
    pricingTitle:"Elige tu plan",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} análisis usados esta semana`,
    plans:[
      {id:"free",name:"Free",price:"Gratis",period:"",highlight:false,
        features:["2 análisis/semana","Solo texto","8 idiomas"],
        cta:"Plan actual"},
      {id:"personal",name:"Personal",price:"5€",period:"/mes",highlight:true,
        features:["Análisis ilimitados","PDF + fotos + cámara","Audio del resumen","Exportar PDF","8 idiomas"],
        cta:"Suscribirse",latam:"3€/mes en Latinoamérica"},
      {id:"empresa",name:"Empresa",price:"29€",period:"/mes",highlight:false,
        features:["Todo lo de Personal","Hasta 10 usuarios","Historial de documentos","API access","Soporte prioritario"],
        cta:"Suscribirse →",latam:"15€/mes en Latinoamérica"},
    ],
  },
  en:{ flag:"🇬🇧", lp:"English",
    tagline:"Upload your contract and DocPlain explains what you sign.",
    sub:"Rental, employment, loan contracts — we tell you the risks, what to negotiate and what to ask.",
    docTypes:["Rental","Employment","Loan","Fine","Clause","Other"],
    docTypeLabel:"What type of document?",
    uploadTitle:"Upload your document", uploadSub:"PDF or images (multiple pages)",
    cameraBtn:"📷 Camera", galleryBtn:"📎 PDF / Photos",
    orText:"or type the text directly",
    textPh:"Paste here the contract or clause you want to understand...",
    analyzeBtn:"Analyze document ✦", analyzing:"Analyzing...",
    addPage:"+ Add page", pages:n=>`${n} page${n>1?"s":""}`,
    summaryTitle:"Plain language summary",
    risksTitle:"🔴 Risks and problematic clauses",
    goodTitle:"🟢 Favorable points",
    watchTitle:"🟡 Things to watch out for",
    negotiateTitle:"💬 What you can negotiate",
    questionsTitle:"❓ Questions you should ask",
    newDoc:"← Analyze another document",
    listenBtn:"🔊 Listen to summary", listeningBtn:"🔊 Speaking...",
    exportBtn:"⬇ Export PDF",
    errorMsg:"Error analyzing. Please try again.",
    dropHere:"Drop here", fileReady:"ready",
    disclaimer:"⚠️ Informational only. Not legal advice.",
    logoutBtn:"Sign out",
    limitTitle:"Weekly limit reached",
    limitMsg:`You've used your ${FREE_LIMIT} free analyses this week.`,
    upgradeBtn:"See plans",
    pricingTitle:"Choose your plan",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} analyses used this week`,
    plans:[
      {id:"free",name:"Free",price:"Free",period:"",highlight:false,
        features:["2 analyses/week","Text only","8 languages"],
        cta:"Current plan"},
      {id:"personal",name:"Personal",price:"€5",period:"/mo",highlight:true,
        features:["Unlimited analyses","PDF + photos + camera","Audio summary","Export PDF","8 languages"],
        cta:"Subscribe",latam:"€3/mo in Latin America"},
      {id:"empresa",name:"Business",price:"€29",period:"/mo",highlight:false,
        features:["Everything in Personal","Up to 10 users","Document history","API access","Priority support"],
        cta:"Subscribe →",latam:"€15/mo in Latin America"},
    ],
  },
  fr:{ flag:"🇫🇷", lp:"français",
    tagline:"Téléchargez votre contrat et DocPlain vous explique ce que vous signez.",
    sub:"Baux, contrats de travail, prêts — on vous dit les risques, ce que vous pouvez négocier et quoi demander.",
    docTypes:["Bail","Travail","Prêt","Amende","Clause","Autre"],
    docTypeLabel:"Quel type de document?",
    uploadTitle:"Téléchargez votre document", uploadSub:"PDF ou images (plusieurs pages)",
    cameraBtn:"📷 Caméra", galleryBtn:"📎 PDF / Photos",
    orText:"ou tapez le texte directement",
    textPh:"Collez ici le texte du contrat que vous souhaitez comprendre...",
    analyzeBtn:"Analyser le document ✦", analyzing:"Analyse en cours...",
    addPage:"+ Ajouter une page", pages:n=>`${n} page${n>1?"s":""}`,
    summaryTitle:"Résumé en langage clair",
    risksTitle:"🔴 Risques et clauses problématiques",
    goodTitle:"🟢 Points favorables",
    watchTitle:"🟡 Points d'attention",
    negotiateTitle:"💬 Ce que vous pouvez négocier",
    questionsTitle:"❓ Questions à poser",
    newDoc:"← Analyser un autre document",
    listenBtn:"🔊 Écouter le résumé", listeningBtn:"🔊 En cours...",
    exportBtn:"⬇ Exporter PDF",
    errorMsg:"Erreur d'analyse. Réessayez.",
    dropHere:"Déposez ici", fileReady:"prêt",
    disclaimer:"⚠️ Indicatif uniquement. Ne remplace pas un avocat.",
    logoutBtn:"Déconnexion",
    limitTitle:"Limite hebdomadaire atteinte",
    limitMsg:`Vous avez utilisé vos ${FREE_LIMIT} analyses gratuites cette semaine.`,
    upgradeBtn:"Voir les plans",
    pricingTitle:"Choisissez votre plan",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} analyses utilisées cette semaine`,
    plans:[
      {id:"free",name:"Gratuit",price:"Gratuit",period:"",highlight:false,
        features:["2 analyses/semaine","Texte uniquement","8 langues"],
        cta:"Plan actuel"},
      {id:"personal",name:"Personnel",price:"5€",period:"/mois",highlight:true,
        features:["Analyses illimitées","PDF + photos + caméra","Résumé audio","Exporter PDF","8 langues"],
        cta:"S'abonner",latam:"3€/mois en Amérique latine"},
      {id:"empresa",name:"Entreprise",price:"29€",period:"/mois",highlight:false,
        features:["Tout Personnel","Jusqu'à 10 utilisateurs","Historique","Accès API","Support prioritaire"],
        cta:"S abonner →",latam:"15€/mois en Amérique latine"},
    ],
  },
  pt:{ flag:"🇧🇷", lp:"português",
    tagline:"Envie seu contrato e o DocPlain explica o que você assina.",
    sub:"Contratos de aluguel, trabalho, empréstimos — dizemos os riscos, o que negociar e o que perguntar.",
    docTypes:["Aluguel","Trabalho","Empréstimo","Multa","Cláusula","Outro"],
    docTypeLabel:"Que tipo de documento?",
    uploadTitle:"Envie seu documento", uploadSub:"PDF ou imagens (várias páginas)",
    cameraBtn:"📷 Câmera", galleryBtn:"📎 PDF / Fotos",
    orText:"ou escreva o texto diretamente",
    textPh:"Cole aqui o texto do contrato que você quer entender...",
    analyzeBtn:"Analisar documento ✦", analyzing:"Analisando...",
    addPage:"+ Adicionar página", pages:n=>`${n} página${n>1?"s":""}`,
    summaryTitle:"Resumo em linguagem clara",
    risksTitle:"🔴 Riscos e cláusulas problemáticas",
    goodTitle:"🟢 Pontos favoráveis",
    watchTitle:"🟡 Pontos de atenção",
    negotiateTitle:"💬 O que você pode negociar",
    questionsTitle:"❓ Perguntas que você deve fazer",
    newDoc:"← Analisar outro documento",
    listenBtn:"🔊 Ouvir resumo", listeningBtn:"🔊 Reproduzindo...",
    exportBtn:"⬇ Exportar PDF",
    errorMsg:"Erro ao analisar. Tente novamente.",
    dropHere:"Solte aqui", fileReady:"pronto",
    disclaimer:"⚠️ Informativo. Não substitui assessoria jurídica.",
    logoutBtn:"Sair",
    limitTitle:"Limite semanal atingido",
    limitMsg:`Você usou suas ${FREE_LIMIT} análises gratuitas desta semana.`,
    upgradeBtn:"Ver planos",
    pricingTitle:"Escolha seu plano",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} análises usadas esta semana`,
    plans:[
      {id:"free",name:"Grátis",price:"Grátis",period:"",highlight:false,
        features:["2 análises/semana","Somente texto","8 idiomas"],
        cta:"Plano atual"},
      {id:"personal",name:"Pessoal",price:"5€",period:"/mês",highlight:true,
        features:["Análises ilimitadas","PDF + fotos + câmera","Áudio do resumo","Exportar PDF","8 idiomas"],
        cta:"Assinar",latam:"3€/mês na América Latina"},
      {id:"empresa",name:"Empresa",price:"29€",period:"/mês",highlight:false,
        features:["Tudo do Pessoal","Até 10 usuários","Histórico","Acesso API","Suporte prioritário"],
        cta:"Assinar →",latam:"15€/mês na América Latina"},
    ],
  },
  de:{ flag:"🇩🇪", lp:"Deutsch",
    tagline:"Laden Sie Ihren Vertrag hoch und DocPlain erklärt, was Sie unterschreiben.",
    sub:"Miet-, Arbeits-, Kreditverträge — wir sagen Ihnen die Risiken, was Sie verhandeln und was Sie fragen können.",
    docTypes:["Mietvertrag","Arbeitsvertrag","Darlehen","Bußgeld","Klausel","Sonstiges"],
    docTypeLabel:"Was für ein Dokument?",
    uploadTitle:"Dokument hochladen", uploadSub:"PDF oder Bilder (mehrere Seiten)",
    cameraBtn:"📷 Kamera", galleryBtn:"📎 PDF / Fotos",
    orText:"oder Text direkt eingeben",
    textPh:"Fügen Sie hier den Vertragstext ein...",
    analyzeBtn:"Dokument analysieren ✦", analyzing:"Analysiere...",
    addPage:"+ Seite hinzufügen", pages:n=>`${n} Seite${n>1?"n":""}`,
    summaryTitle:"Zusammenfassung in einfacher Sprache",
    risksTitle:"🔴 Risiken und problematische Klauseln",
    goodTitle:"🟢 Günstige Punkte",
    watchTitle:"🟡 Worauf Sie achten sollten",
    negotiateTitle:"💬 Was Sie verhandeln können",
    questionsTitle:"❓ Fragen, die Sie stellen sollten",
    newDoc:"← Weiteres Dokument analysieren",
    listenBtn:"🔊 Zusammenfassung anhören", listeningBtn:"🔊 Wird abgespielt...",
    exportBtn:"⬇ PDF exportieren",
    errorMsg:"Analysefehler. Bitte erneut versuchen.",
    dropHere:"Hier ablegen", fileReady:"bereit",
    disclaimer:"⚠️ Informativ. Ersetzt keine Rechtsberatung.",
    logoutBtn:"Abmelden",
    limitTitle:"Wochenlimit erreicht",
    limitMsg:`Sie haben Ihre ${FREE_LIMIT} kostenlosen Analysen diese Woche verwendet.`,
    upgradeBtn:"Pläne ansehen",
    pricingTitle:"Wählen Sie Ihren Plan",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} Analysen diese Woche verwendet`,
    plans:[
      {id:"free",name:"Kostenlos",price:"Kostenlos",period:"",highlight:false,
        features:["2 Analysen/Woche","Nur Text","8 Sprachen"],
        cta:"Aktueller Plan"},
      {id:"personal",name:"Persönlich",price:"5€",period:"/Monat",highlight:true,
        features:["Unbegrenzte Analysen","PDF + Fotos + Kamera","Audio-Zusammenfassung","PDF exportieren","8 Sprachen"],
        cta:"Abonnieren",latam:"3€/Monat in Lateinamerika"},
      {id:"empresa",name:"Unternehmen",price:"29€",period:"/Monat",highlight:false,
        features:["Alles Persönlich","Bis zu 10 Nutzer","Verlauf","API-Zugang","Priority-Support"],
        cta:"Abonnieren →",latam:"15€/Monat in Lateinamerika"},
    ],
  },
  it:{ flag:"🇮🇹", lp:"italiano",
    tagline:"Carica il tuo contratto e DocPlain ti spiega cosa firmi.",
    sub:"Affitti, lavoro, prestiti — ti diciamo i rischi, cosa puoi negoziare e cosa chiedere.",
    docTypes:["Affitto","Lavoro","Prestito","Multa","Clausola","Altro"],
    docTypeLabel:"Che tipo di documento?",
    uploadTitle:"Carica il tuo documento", uploadSub:"PDF o immagini (più pagine)",
    cameraBtn:"📷 Fotocamera", galleryBtn:"📎 PDF / Foto",
    orText:"o scrivi il testo direttamente",
    textPh:"Incolla qui il testo del contratto che vuoi capire...",
    analyzeBtn:"Analizza documento ✦", analyzing:"Analisi in corso...",
    addPage:"+ Aggiungi pagina", pages:n=>`${n} pagina${n>1?"e":""}`,
    summaryTitle:"Riepilogo in linguaggio chiaro",
    risksTitle:"🔴 Rischi e clausole problematiche",
    goodTitle:"🟢 Punti favorevoli",
    watchTitle:"🟡 Cose a cui prestare attenzione",
    negotiateTitle:"💬 Cosa puoi negoziare",
    questionsTitle:"❓ Domande che dovresti fare",
    newDoc:"← Analizza un altro documento",
    listenBtn:"🔊 Ascolta il riepilogo", listeningBtn:"🔊 In riproduzione...",
    exportBtn:"⬇ Esporta PDF",
    errorMsg:"Errore di analisi. Riprova.",
    dropHere:"Trascina qui", fileReady:"pronto",
    disclaimer:"⚠️ Informativo. Non sostituisce la consulenza legale.",
    logoutBtn:"Esci",
    limitTitle:"Limite settimanale raggiunto",
    limitMsg:`Hai utilizzato le tue ${FREE_LIMIT} analisi gratuite questa settimana.`,
    upgradeBtn:"Vedi piani",
    pricingTitle:"Scegli il tuo piano",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} analisi usate questa settimana`,
    plans:[
      {id:"free",name:"Gratuito",price:"Gratuito",period:"",highlight:false,
        features:["2 analisi/settimana","Solo testo","8 lingue"],
        cta:"Piano attuale"},
      {id:"personal",name:"Personale",price:"5€",period:"/mese",highlight:true,
        features:["Analisi illimitate","PDF + foto + fotocamera","Audio riepilogo","Esporta PDF","8 lingue"],
        cta:"Abbonati",latam:"3€/mese in America Latina"},
      {id:"empresa",name:"Azienda",price:"29€",period:"/mese",highlight:false,
        features:["Tutto Personale","Fino a 10 utenti","Storico","Accesso API","Supporto prioritario"],
        cta:"Abbonati →",latam:"15€/mese in America Latina"},
    ],
  },
  ru:{ flag:"🇷🇺", lp:"русском языке",
    tagline:"Загрузите договор и DocPlain объяснит, что вы подписываете.",
    sub:"Аренда, работа, кредиты — скажем риски, что можно обсудить и что спросить.",
    docTypes:["Аренда","Работа","Кредит","Штраф","Пункт","Другое"],
    docTypeLabel:"Какой тип документа?",
    uploadTitle:"Загрузите документ", uploadSub:"PDF или изображения (несколько страниц)",
    cameraBtn:"📷 Камера", galleryBtn:"📎 PDF / Фото",
    orText:"или введите текст напрямую",
    textPh:"Вставьте сюда текст договора...",
    analyzeBtn:"Анализировать ✦", analyzing:"Анализируем...",
    addPage:"+ Добавить страницу", pages:n=>`${n} страниц${n===1?"а":n<5?"ы":""}`,
    summaryTitle:"Краткое изложение простым языком",
    risksTitle:"🔴 Риски и проблемные пункты",
    goodTitle:"🟢 Выгодные условия",
    watchTitle:"🟡 На что обратить внимание",
    negotiateTitle:"💬 Что можно обсудить",
    questionsTitle:"❓ Вопросы, которые стоит задать",
    newDoc:"← Анализировать другой документ",
    listenBtn:"🔊 Прослушать", listeningBtn:"🔊 Воспроизведение...",
    exportBtn:"⬇ Экспорт PDF",
    errorMsg:"Ошибка анализа. Попробуйте снова.",
    dropHere:"Перетащите сюда", fileReady:"готов",
    disclaimer:"⚠️ Ознакомительно. Не заменяет юридическую консультацию.",
    logoutBtn:"Выйти",
    limitTitle:"Недельный лимит исчерпан",
    limitMsg:`Вы использовали ${FREE_LIMIT} бесплатных анализа на этой неделе.`,
    upgradeBtn:"Посмотреть планы",
    pricingTitle:"Выберите план",
    docsUsed:(n)=>`${n}/${FREE_LIMIT} анализов использовано на этой неделе`,
    plans:[
      {id:"free",name:"Бесплатно",price:"Бесплатно",period:"",highlight:false,
        features:["2 анализа/неделю","Только текст","8 языков"],
        cta:"Текущий план"},
      {id:"personal",name:"Личный",price:"5€",period:"/мес",highlight:true,
        features:["Безлимитные анализы","PDF + фото + камера","Аудио резюме","Экспорт PDF","8 языков"],
        cta:"Подписаться",latam:"3€/мес в Латинской Америке"},
      {id:"empresa",name:"Бизнес",price:"29€",period:"/мес",highlight:false,
        features:["Всё из Личного","До 10 пользователей","История","API доступ","Приоритетная поддержка"],
        cta:"Подписаться →",latam:"15€/мес в Латинской Америке"},
    ],
  },
  zh:{ flag:"🇨🇳", lp:"中文",
    tagline:"上传合同，DocPlain为您解释签署内容。",
    sub:"租赁、劳动、贷款合同——告诉您风险、可协商内容和应提问题。",
    docTypes:["租赁","劳动","贷款","罚款","条款","其他"],
    docTypeLabel:"文件类型是什么？",
    uploadTitle:"上传您的文件", uploadSub:"PDF或图片（多页）",
    cameraBtn:"📷 摄像头", galleryBtn:"📎 PDF / 图片",
    orText:"或直接输入文字",
    textPh:"将合同文字粘贴至此...",
    analyzeBtn:"分析文件 ✦", analyzing:"分析中...",
    addPage:"+ 添加页面", pages:n=>`${n}页`,
    summaryTitle:"简明摘要",
    risksTitle:"🔴 风险与问题条款",
    goodTitle:"🟢 有利条款",
    watchTitle:"🟡 注意事项",
    negotiateTitle:"💬 可以协商的内容",
    questionsTitle:"❓ 您应该提出的问题",
    newDoc:"← 分析另一份文件",
    listenBtn:"🔊 收听摘要", listeningBtn:"🔊 播放中...",
    exportBtn:"⬇ 导出PDF",
    errorMsg:"分析出错，请重试。",
    dropHere:"拖放至此", fileReady:"已就绪",
    disclaimer:"⚠️ 仅供参考，不能替代专业法律建议。",
    logoutBtn:"退出",
    limitTitle:"已达每周限制",
    limitMsg:`您已使用本周的${FREE_LIMIT}次免费分析。`,
    upgradeBtn:"查看计划",
    pricingTitle:"选择您的计划",
    docsUsed:(n)=>`本周已使用${n}/${FREE_LIMIT}次分析`,
    plans:[
      {id:"free",name:"免费",price:"免费",period:"",highlight:false,
        features:["每周2次分析","仅文字","8种语言"],
        cta:"当前计划"},
      {id:"personal",name:"个人",price:"5€",period:"/月",highlight:true,
        features:["无限分析","PDF+照片+摄像头","音频摘要","导出PDF","8种语言"],
        cta:"订阅",latam:"拉丁美洲地区3€/月"},
      {id:"empresa",name:"企业",price:"29€",period:"/月",highlight:false,
        features:["个人版全部","最多10用户","文件历史","API访问","优先支持"],
        cta:"订阅 →",latam:"拉丁美洲地区15€/月"},
    ],
  },
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
function safeJson(txt) {
  try { return JSON.parse(txt.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim()); }
  catch { return null; }
}
function getWeekKey(uid) {
  const d = new Date();
  const w = Math.ceil(((d - new Date(d.getFullYear(),0,1))/86400000 + new Date(d.getFullYear(),0,1).getDay()+1)/7);
  return `cs_${d.getFullYear()}_w${w}_${uid}`;
}
function getUsage(uid) { try { return parseInt(localStorage.getItem(getWeekKey(uid))||"0"); } catch{return 0;} }
function incUsage(uid) { try { const n=(parseInt(localStorage.getItem(getWeekKey(uid))||"0")+1); localStorage.setItem(getWeekKey(uid),n); return n; } catch{return 1;} }
function fileToB64(file) {
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Logo({size=36}) {
  const s = size / 36;
  return (
    <svg width={size*5} height={size*5} viewBox="0 0 200 200" fill="none">
      <g transform="scale(1.1) translate(10,8)">
        <path d="M10 0 L80 0 L100 20 L100 120 L10 120 Z" fill="none" stroke="#C4922A" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M80 0 L80 20 L100 20" fill="none" stroke="#C4922A" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="22" y1="35" x2="68" y2="35" stroke="#C4922A" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="22" y1="48" x2="68" y2="48" stroke="#C4922A" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="22" y1="61" x2="54" y2="61" stroke="#C4922A" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="82" cy="92" r="30" fill="none" stroke="#C4922A" strokeWidth="2.2"/>
        <circle cx="82" cy="92" r="23" fill="none" stroke="#C4922A" strokeWidth="0.7" opacity="0.35"/>
        <rect x="58" y="81" width="20" height="16" rx="3" fill="none" stroke="#C4922A" strokeWidth="1.6"/>
        <path d="M63 89 l3 3.5 5.5-5.5" stroke="#C4922A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="82" y="81" width="20" height="16" rx="3" fill="none" stroke="#C4922A" strokeWidth="1.6"/>
        <path d="M86 84 l10 9 M96 84 l-10 9" stroke="#C4922A" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <line x1="104" y1="114" x2="116" y2="126" stroke="#C4922A" strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="114" y1="124" x2="126" y2="136" stroke="#C4922A" strokeWidth="7" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function Section({title,items,color,bg}) {
  if(!items?.length) return null;
  return (
    <div style={{background:bg||C.paper,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.border}`,marginBottom:12}}>
      <div style={{fontSize:14,fontWeight:700,color:color||C.ink,marginBottom:10}}>{title}</div>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:7}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:color||C.inkLight,flexShrink:0,marginTop:8}}/>
          <div style={{fontSize:13,color:C.ink,lineHeight:1.6}}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {[160,120,140,100].map((h,i)=>(
        <div key={i} className="shimmer" style={{height:h,borderRadius:14}}/>
      ))}
    </div>
  );
}

function PricingModal({t,onClose,userPlan}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.paper,borderRadius:20,padding:24,maxWidth:500,
        width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)",margin:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:20,color:C.ink}}>{t.pricingTitle}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.inkLight}}>✕</button>
        </div>
        {t.plans.map((plan,i)=>(
          <div key={plan.id} style={{border:`2px solid ${plan.highlight?C.accent:C.border}`,
            borderRadius:14,padding:"16px 18px",marginBottom:10,
            background:plan.highlight?C.accentDim:"transparent",position:"relative"}}>
            {plan.highlight && (
              <div style={{position:"absolute",top:-10,right:16,background:C.accent,
                color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",
                borderRadius:20,letterSpacing:".05em"}}>POPULAR</div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:17,fontWeight:700,color:C.ink}}>{plan.name}</div>
              <div>
                <span style={{fontSize:22,fontWeight:800,color:plan.highlight?C.accent:C.ink}}>{plan.price}</span>
                <span style={{fontSize:12,color:C.inkLight}}>{plan.period}</span>
              </div>
            </div>
            <ul style={{listStyle:"none",marginBottom:12}}>
              {plan.features.map((f,j)=>(
                <li key={j} style={{fontSize:13,color:C.ink,display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                  <span style={{color:C.accent,fontWeight:700}}>✓</span>{f}
                </li>
              ))}
            </ul>
            {plan.latam && <div style={{fontSize:11,color:C.gold,marginBottom:10}}>💛 {plan.latam}</div>}
            {plan.id==="free" ? (
              <div style={{padding:"9px",background:C.border,borderRadius:10,
                fontSize:13,fontWeight:600,textAlign:"center",color:C.inkLight}}>
                {plan.cta}
              </div>
            ) : plan.id==="empresa" ? (
              <a href="https://buy.stripe.com/8x29AVcty7j2gY80JBdwc02" target="_blank" rel="noopener noreferrer"
                style={{display:"block",padding:"10px",background:GG,color:"#fff",
                  borderRadius:10,fontSize:13,fontWeight:700,textAlign:"center",textDecoration:"none",display:"block"}}>
                {plan.cta}
              </a>
            ) : (
              <a href="https://buy.stripe.com/eVq3cx0KQgTCcHS77Zdwc01" target="_blank" rel="noopener noreferrer"
                style={{display:"block",padding:"10px",background:GG,color:"#fff",
                  borderRadius:10,fontSize:13,fontWeight:700,textAlign:"center",textDecoration:"none"}}>
                {plan.cta} →
              </a>
            )}
          </div>
        ))}
        <p style={{fontSize:11,color:C.inkLight,textAlign:"center",marginTop:4}}>
          🔒 Stripe · Pago seguro · Cancela cuando quieras
        </p>
        <p style={{fontSize:11,color:C.inkLight,textAlign:"center",marginTop:6}}>
          ¿Preguntas? <a href="mailto:gonrobtor@gmail.com" style={{color:C.accent}}>gonrobtor@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

function Camera({onCapture,onClose}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready,setReady] = useState(false);
  const [error,setError] = useState(false);

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})
      .then(stream=>{
        streamRef.current=stream;
        if(videoRef.current){
          videoRef.current.srcObject=stream;
          videoRef.current.onloadedmetadata=()=>{ videoRef.current.play(); setReady(true); };
        }
      }).catch(()=>setError(true));
    return ()=>{ streamRef.current?.getTracks().forEach(t=>t.stop()); };
  },[]);

  function capture(){
    const v=videoRef.current, c=canvasRef.current;
    if(!v||!c) return;
    c.width=v.videoWidth; c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    c.toBlob(blob=>{
      if(blob){
        streamRef.current?.getTracks().forEach(t=>t.stop());
        onCapture(new File([blob],`photo_${Date.now()}.jpg`,{type:"image/jpeg"}));
      }
    },"image/jpeg",0.92);
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#000",zIndex:2000,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      {error ? (
        <div style={{color:"#fff",textAlign:"center",padding:20}}>
          <div style={{fontSize:40,marginBottom:12}}>📷</div>
          <div style={{marginBottom:16}}>Cámara no disponible</div>
          <button onClick={onClose} style={{padding:"10px 24px",background:"#fff",color:"#000",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700}}>Cerrar</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} style={{width:"100%",maxWidth:600}} playsInline muted/>
          <canvas ref={canvasRef} style={{display:"none"}}/>
          <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"20px 20px 40px",
            display:"flex",gap:12,justifyContent:"center",background:"rgba(0,0,0,.6)"}}>
            <button onClick={onClose}
              style={{padding:"12px 20px",background:"rgba(255,255,255,.2)",color:"#fff",
                border:"1px solid rgba(255,255,255,.3)",borderRadius:12,fontSize:14,cursor:"pointer"}}>✕</button>
            <button onClick={capture} disabled={!ready}
              style={{padding:"12px 32px",background:ready?"#C4922A":"#555",color:"#fff",
                border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:ready?"pointer":"not-allowed"}}>
              📷 Capturar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── EXPORT PDF ───────────────────────────────────────────────────────────────
function exportPDF(result, lang) {
  const t = T[lang];
  const content = `
    <html><head><meta charset="utf-8">
    <style>
      body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#1A1A18;line-height:1.6}
      h1{font-size:24px;margin-bottom:4px}
      h2{font-size:16px;margin:20px 0 8px;color:#2D5016}
      .verdict{display:inline-block;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:16px}
      .favorable{background:#d4edda;color:#2D5016}
      .neutro{background:#fff3cd;color:#856404}
      .desfavorable{background:#f8d7da;color:#721c24}
      ul{padding-left:20px}li{margin-bottom:6px;font-size:14px}
      .summary{font-style:italic;font-size:15px;border-left:3px solid #C4922A;padding-left:16px;margin:16px 0}
      .footer{margin-top:40px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px}
    </style></head><body>
    <h1>${result.title || "Análisis de documento"}</h1>
    <span class="verdict ${(result.verdict||"").toLowerCase()}">${result.verdict}</span>
    <p style="color:#666;font-size:13px">${result.verdictReason||""}</p>
    <h2>${t.summaryTitle}</h2>
    <div class="summary">${result.summary||""}</div>
    ${result.risks?.length?`<h2>${t.risksTitle}</h2><ul>${result.risks.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
    ${result.good?.length?`<h2>${t.goodTitle}</h2><ul>${result.good.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
    ${result.watch?.length?`<h2>${t.watchTitle}</h2><ul>${result.watch.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
    ${result.negotiate?.length?`<h2>${t.negotiateTitle}</h2><ul>${result.negotiate.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
    ${result.questions?.length?`<h2>${t.questionsTitle}</h2><ul>${result.questions.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
    <div class="footer">DocPlain · docplain.com · ${new Date().toLocaleDateString()} · ${t.disclaimer}</div>
    </body></html>
  `;
  const win = window.open("","_blank");
  if(win){ win.document.write(content); win.document.close(); setTimeout(()=>win.print(),500); }
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const {user,isLoaded,isSignedIn} = useUser();
  const {signOut} = useClerk();
  const [lang,setLang] = useState("es");
  const t = T[lang];

  const [authMode,setAuthMode] = useState("signin");
  const [pages,setPages] = useState([]);
  const [text,setText] = useState("");
  const [docType,setDocType] = useState("");
  const [dragging,setDragging] = useState(false);
  const [showCamera,setShowCamera] = useState(false);
  const [analyzing,setAnalyzing] = useState(false);
  const [result,setResult] = useState(null);
  const [error,setError] = useState(null);
  const [usage,setUsage] = useState(0);
  const [showPricing,setShowPricing] = useState(false);
  const [limitHit,setLimitHit] = useState(false);
  const [speaking,setSpeaking] = useState(false);
  const [userPlan,setUserPlan] = useState("free");
  const audioRef = useRef(null);
  const mounted = useRef(true);
  const fileInputRef = useRef(null);

  useEffect(()=>{ mounted.current=true; return()=>{ mounted.current=false; }; },[]);
  useEffect(()=>{
    if(user){
      setUsage(getUsage(user.id));
      if(user.primaryEmailAddress?.emailAddress === "gonrobtor@gmail.com"){
        setUserPlan("personal");
      }
    }
  },[user]);

  async function addFiles(files) {
    for(const file of Array.from(files)){
      if(!file.type.startsWith("image/") && file.type!=="application/pdf") continue;
      const base64 = await fileToB64(file);
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      setPages(prev=>[...prev,{file,base64,type:file.type,preview,name:file.name}]);
    }
  }

  function handleDrop(e){ e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }

  async function analyze() {
    if(!isSignedIn||!user) return;
    if(usage>=FREE_LIMIT && user?.primaryEmailAddress?.emailAddress !== "gonrobtor@gmail.com" && userPlan === "free"){ setLimitHit(true); return; }
    if(!text.trim()&&pages.length===0) return;

    setError(null); setResult(null); setAnalyzing(true);

    const langMap={es:"español",en:"English",fr:"français",pt:"português",de:"Deutsch",it:"italiano",ru:"русском языке",zh:"中文"};
    const outputLang = langMap[lang]||"español";
    const schema = `{"title":"...","summary":"...en 3-4 frases simples...","risks":["..."],"good":["..."],"watch":["..."],"negotiate":["..."],"questions":["..."],"verdict":"FAVORABLE|NEUTRO|DESFAVORABLE","verdictReason":"..."}`;

    let messages;
    if(pages.length>0){
      const content=[];
      for(const p of pages){
        if(p.type==="application/pdf") content.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:p.base64}});
        else content.push({type:"image",source:{type:"base64",media_type:p.type,data:p.base64}});
      }
      if(text.trim()) content.push({type:"text",text:`Notas adicionales: ${text.trim()}`});
      content.push({type:"text",text:`Tipo: ${docType||"documento legal"}. Analiza todo el contenido. Responde SOLO este JSON en ${outputLang}: ${schema}`});
      messages=[{role:"user",content}];
    } else {
      messages=[{role:"user",content:`Tipo: ${docType||"documento legal"}.\n${text.trim()}\n\nResponde SOLO este JSON en ${outputLang}: ${schema}`}];
    }

    try{
      const r=await fetch("/api/anthropic",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:3000,
          system:`Experto legal. Ayuda a personas comunes. Responde SOLO JSON válido en ${outputLang} sin markdown.`,
          messages})
      });
      if(!r.ok) throw new Error("HTTP "+r.status);
      const d=await r.json();
      const raw=(d.content||[]).map(b=>b.text||"").join("");
      const parsed=safeJson(raw);
      if(!parsed) throw new Error("JSON inválido");
      const newUsage=incUsage(user.id);
      if(mounted.current){ setResult(parsed); setUsage(newUsage); }
    }catch(e){
      if(mounted.current) setError(t.errorMsg+" ("+e.message+")");
    }
    if(mounted.current) setAnalyzing(false);
  }

  async function listen(){
    if(!result?.summary||speaking) return;
    if(audioRef.current){ audioRef.current.pause(); audioRef.current.src=""; }
    setSpeaking(true);
    try{
      const r=await fetch("/api/elevenlabs",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text:result.summary.slice(0,500),voiceId:"yiWEefwu5z3DQCM79clN"})});
      if(!r.ok) throw new Error("HTTP "+r.status);
      const blob=await r.blob();
      const audio=new Audio(URL.createObjectURL(blob));
      audioRef.current=audio;
      audio.onended=()=>{ if(mounted.current) setSpeaking(false); };
      audio.onerror=()=>{ if(mounted.current) setSpeaking(false); };
      audio.play();
    }catch{ if(mounted.current) setSpeaking(false); }
  }

  function reset(){
    setPages([]); setText(""); setDocType(""); setResult(null); setError(null); setLimitHit(false);
    if(audioRef.current){ audioRef.current.pause(); audioRef.current.src=""; }
    setSpeaking(false);
  }

  const verdictColor={FAVORABLE:C.accent,NEUTRO:C.gold,DESFAVORABLE:C.red,NEUTRAL:C.gold,UNFAVORABLE:C.red}[result?.verdict]||C.gold;
  const canAnalyze=(text.trim().length>10||pages.length>0)&&!analyzing&&isSignedIn;

  // Header
  const Header=()=>(
    <header style={{background:C.paper,borderBottom:`1px solid ${C.border}`,padding:"0 16px",
      position:"sticky",top:0,zIndex:100,boxShadow:`0 2px 12px ${C.shadow}`}}>
      <div style={{maxWidth:680,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Logo size={18}/>
          <div style={{fontSize:17,fontWeight:400,fontFamily:"Georgia,'Times New Roman',serif",color:"#C4922A",letterSpacing:1,lineHeight:1}}>DocPlain</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{display:"flex",gap:2}}>
            {Object.entries(T).map(([k,v])=>(
              <button key={k} onClick={()=>setLang(k)}
                style={{padding:"3px 6px",background:lang===k?C.accentDim:"transparent",
                  border:`1px solid ${lang===k?C.accent:"transparent"}`,
                  borderRadius:6,cursor:"pointer",fontSize:13,color:lang===k?C.accent:C.inkLight}}>
                {v.flag}
              </button>
            ))}
          </div>
          {isSignedIn&&(
            <>
              <button onClick={()=>setShowPricing(true)}
                style={{padding:"4px 10px",background:C.accentDim,border:`1px solid ${C.accent}`,
                  borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,color:C.accent}}>
                ⭐ Plans
              </button>
              <button onClick={()=>signOut()}
                style={{padding:"4px 10px",background:"transparent",border:`1px solid ${C.border}`,
                  borderRadius:8,cursor:"pointer",fontSize:11,color:C.inkLight}}>
                {t.logoutBtn}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  if(!isLoaded) return(
    <><style dangerouslySetInnerHTML={{__html:CSS}}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>
      <div style={{width:32,height:32,border:`3px solid ${C.accent}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
    </div></>
  );

  if(!isSignedIn) return(
    <><style dangerouslySetInnerHTML={{__html:CSS}}/>
    <Header/>
    <div style={{maxWidth:520,margin:"24px auto",padding:"0 20px"}}>
      {/* Hero */}
      <div style={{textAlign:"center",marginBottom:24,padding:"28px 24px",
        background:"linear-gradient(135deg,#1a3a0a 0%,#2D5016 60%,#3d6b1f 100%)",
        borderRadius:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,
          borderRadius:"50%",background:"rgba(196,146,42,.15)"}}/>
        <div style={{fontSize:44,marginBottom:10}}>📋</div>
        <h1 style={{fontSize:"clamp(22px,5vw,30px)",fontWeight:800,color:"#fff",marginBottom:8,fontFamily:"'Lora',serif"}}>{t.tagline}</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:16,lineHeight:1.5}}>{t.sub}</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
          {["📄 "+t.plans[0].features[0],"🎙 "+t.plans[1].features[2],"🌍 "+t.plans[0].features[2],"⬇ "+t.plans[1].features[3]].map((f,i)=>(
            <span key={i} style={{padding:"4px 10px",background:"rgba(255,255,255,.15)",
              border:"1px solid rgba(255,255,255,.25)",
              borderRadius:20,fontSize:11,color:"#fff",fontWeight:600}}>{f}</span>
          ))}
        </div>
      </div>
      {/* Plans preview */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
        {t.plans.map((plan,i)=>(
          <div key={plan.id} style={{padding:"12px 10px",textAlign:"center",
            background:i===1?"linear-gradient(135deg,#2D5016,#4A7C2F)":C.paper,
            border:`1.5px solid ${i===1?C.accent:C.border}`,borderRadius:12,
            position:"relative"}}>
            {i===1&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",
              background:C.gold,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 8px",
              borderRadius:10,whiteSpace:"nowrap"}}>POPULAR</div>}
            <div style={{fontSize:16,fontWeight:800,color:i===1?"#fff":C.ink}}>{plan.price}</div>
            <div style={{fontSize:9,color:i===1?"rgba(255,255,255,.7)":C.inkLight}}>{plan.period||"forever"}</div>
            <div style={{fontSize:11,fontWeight:600,color:i===1?"#fff":C.ink,marginTop:4}}>{plan.name}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.paper,borderRadius:16,padding:24,border:`1px solid ${C.border}`,
        boxShadow:`0 4px 20px ${C.shadow}`}}>
        <div style={{display:"flex",marginBottom:20,background:C.bg,borderRadius:10,padding:4}}>
          {["signin","signup"].map(mode=>(
            <button key={mode} onClick={()=>setAuthMode(mode)}
              style={{flex:1,padding:"8px",background:authMode===mode?C.paper:"transparent",
                border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,
                color:authMode===mode?C.accent:C.inkLight,
                boxShadow:authMode===mode?`0 2px 8px ${C.shadow}`:"none"}}>
              {mode==="signin"?{es:"Entrar",en:"Sign in",fr:"Connexion",pt:"Entrar",de:"Anmelden",it:"Accedi",ru:"Войти",zh:"登录"}[lang]||"Sign in":{es:"Registrarse",en:"Sign up",fr:"Inscription",pt:"Cadastrar",de:"Registrieren",it:"Registrati",ru:"Регистрация",zh:"注册"}[lang]||"Sign up"}
            </button>
          ))}
        </div>
        {authMode==="signin"
          ? <SignIn routing="hash" afterSignInUrl="/"/>
          : <SignUp routing="hash" afterSignUpUrl="/"/>
        }
      </div>
      <button onClick={()=>setShowPricing(true)}
        style={{width:"100%",marginTop:16,padding:"12px",background:"transparent",
          border:`1px solid ${C.border}`,borderRadius:12,cursor:"pointer",
          fontSize:13,color:C.inkLight}}>
        {t.pricingTitle} →
      </button>
    </div>
    {showPricing&&<PricingModal t={t} onClose={()=>setShowPricing(false)}/>}
    </>
  );

  return(
    <><style dangerouslySetInnerHTML={{__html:CSS}}/>
    <Header/>
    {showCamera&&<Camera onCapture={f=>{setShowCamera(false);addFiles([f]);}} onClose={()=>setShowCamera(false)}/>}
    {showPricing&&<PricingModal t={t} onClose={()=>setShowPricing(false)}/>}

    {/* LIMIT HIT */}
    {limitHit&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:900,
        display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:C.paper,borderRadius:20,padding:28,maxWidth:380,textAlign:"center",
          boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          <div style={{fontSize:48,marginBottom:12}}>⏳</div>
          <h2 style={{fontSize:20,color:C.ink,marginBottom:8}}>{t.limitTitle}</h2>
          <p style={{fontSize:14,color:C.inkLight,marginBottom:20}}>{t.limitMsg}</p>
          <button onClick={()=>{setShowPricing(true);setLimitHit(false);}}
            style={{width:"100%",padding:"12px",background:GG,color:"#fff",border:"none",
              borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>
            {t.upgradeBtn}
          </button>
          <button onClick={()=>setLimitHit(false)}
            style={{width:"100%",padding:"10px",background:"transparent",color:C.inkLight,
              border:`1px solid ${C.border}`,borderRadius:12,fontSize:13,cursor:"pointer"}}>
            Cerrar
          </button>
        </div>
      </div>
    )}

    <main style={{maxWidth:680,margin:"0 auto",padding:"28px 16px 80px"}}>

      {/* Usage bar */}
      {!result&&!analyzing&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          marginBottom:16,padding:"8px 14px",background:C.paper,borderRadius:10,
          border:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.inkLight}}>{t.docsUsed(usage)}</span>
          <div style={{display:"flex",gap:4}}>
            {Array.from({length:FREE_LIMIT}).map((_,i)=>(
              <div key={i} style={{width:16,height:16,borderRadius:"50%",
                background:i<usage?C.accent:C.border}}/>
            ))}
          </div>
        </div>
      )}

      {/* FORM */}
      {!result&&!analyzing&&(
        <div className="fade">
          <div style={{textAlign:"center",marginBottom:24}}>
            <h1 style={{fontSize:"clamp(22px,5vw,34px)",fontWeight:700,color:C.ink,lineHeight:1.2}}>{t.tagline}</h1>
            <p style={{fontSize:14,color:C.inkLight,marginTop:6}}>{t.sub}</p>
          </div>

          {/* Doc type */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:600,color:C.inkLight,marginBottom:8,letterSpacing:".03em"}}>{t.docTypeLabel}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {t.docTypes.map(dt=>(
                <button key={dt} onClick={()=>setDocType(dt===docType?"":dt)}
                  style={{padding:"6px 12px",background:docType===dt?C.accentDim:C.paper,
                    border:`1px solid ${docType===dt?C.accent:C.border}`,borderRadius:20,
                    cursor:"pointer",fontSize:12,fontWeight:500,color:docType===dt?C.accent:C.inkLight}}>
                  {dt}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <button onClick={()=>setShowCamera(true)}
              style={{flex:1,padding:"10px",background:C.paper,border:`1px solid ${C.border}`,
                borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,color:C.inkLight}}>
              {t.cameraBtn}
            </button>
            <button onClick={()=>fileInputRef.current?.click()}
              style={{flex:1,padding:"10px",background:C.paper,border:`1px solid ${C.border}`,
                borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,color:C.inkLight}}>
              {t.galleryBtn}
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,image/*" multiple
              style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
          </div>

          {/* Drop zone */}
          <div onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)} onDrop={handleDrop}
            style={{border:`2px dashed ${dragging?C.accent:pages.length?C.accentL:C.border}`,
              borderRadius:14,padding:"20px 16px",textAlign:"center",
              background:dragging?C.accentDim:pages.length?`${C.accentDim}`:C.paper,
              transition:"all .2s",marginBottom:10,cursor:"pointer",minHeight:80}}
            onClick={()=>!pages.length&&fileInputRef.current?.click()}>
            {pages.length>0?(
              <div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:8}}>
                  {pages.map((p,i)=>(
                    <div key={i} style={{position:"relative"}}>
                      {p.preview?(
                        <img src={p.preview} alt="" style={{width:56,height:56,objectFit:"cover",borderRadius:8,border:`2px solid ${C.accent}`}}/>
                      ):(
                        <div style={{width:56,height:56,background:C.accentDim,borderRadius:8,
                          border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:20}}>📄</div>
                      )}
                      <button onClick={e=>{e.stopPropagation();setPages(prev=>prev.filter((_,j)=>j!==i));}}
                        style={{position:"absolute",top:-6,right:-6,width:18,height:18,
                          borderRadius:"50%",background:C.red,border:"none",color:"#fff",
                          cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  ))}
                  <button onClick={e=>{e.stopPropagation();fileInputRef.current?.click();}}
                    style={{width:56,height:56,borderRadius:8,border:`2px dashed ${C.border}`,
                      background:"transparent",cursor:"pointer",fontSize:20,color:C.inkLight}}>+</button>
                </div>
                <div style={{fontSize:12,color:C.accent,fontWeight:600}}>{t.pages(pages.length)} {t.fileReady}</div>
              </div>
            ):(
              <div>
                <div style={{fontSize:32,marginBottom:6}}>{dragging?"📂":"📎"}</div>
                <div style={{fontSize:14,fontWeight:600,color:C.ink}}>{dragging?t.dropHere:t.uploadTitle}</div>
                <div style={{fontSize:12,color:C.inkLight,marginTop:2}}>{t.uploadSub}</div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{flex:1,height:1,background:C.border}}/>
            <div style={{fontSize:12,color:C.inkLight}}>{t.orText}</div>
            <div style={{flex:1,height:1,background:C.border}}/>
          </div>

          {/* Text */}
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={t.textPh} rows={5}
            style={{width:"100%",padding:"12px 14px",background:C.paper,
              border:`1.5px solid ${text?C.accent:C.border}`,borderRadius:12,
              fontSize:13,color:C.ink,lineHeight:1.6,resize:"vertical",outline:"none",
              transition:"border-color .2s"}}
            onFocus={e=>e.target.style.borderColor=C.accent}
            onBlur={e=>e.target.style.borderColor=text?C.accent:C.border}/>

          {error&&(
            <div style={{marginTop:10,padding:"10px 14px",background:C.redDim,
              border:`1px solid ${C.red}`,borderRadius:10,fontSize:13,color:C.red}}>{error}</div>
          )}

          <button onClick={analyze} disabled={!canAnalyze}
            style={{width:"100%",marginTop:14,padding:"14px",
              background:canAnalyze?GG:"#C8C4BC",color:"#fff",border:"none",borderRadius:12,
              fontSize:16,fontWeight:700,cursor:canAnalyze?"pointer":"not-allowed",
              boxShadow:canAnalyze?"0 4px 16px rgba(45,80,22,.3)":"none"}}>
            {t.analyzeBtn}
          </button>

          <p style={{textAlign:"center",fontSize:11,color:C.inkLight,marginTop:10}}>{t.disclaimer}</p>
        </div>
      )}

      {/* LOADING */}
      {analyzing&&(
        <div className="fade">
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",
            background:C.paper,borderRadius:12,border:`1px solid ${C.border}`,marginBottom:16}}>
            <div style={{width:18,height:18,border:`2.5px solid ${C.accent}`,borderTopColor:"transparent",
              borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>
            <div style={{fontSize:14,fontWeight:600,color:C.ink}}>{t.analyzing}</div>
          </div>
          <Skeleton/>
        </div>
      )}

      {/* RESULTS */}
      {result&&!analyzing&&(
        <div className="fade">
          {/* Verdict */}
          <div style={{background:C.paper,border:`2px solid ${verdictColor}`,borderRadius:16,
            padding:"18px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:verdictColor,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>
                {result.verdict}
              </div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:"'Lora',serif",color:C.ink,marginBottom:4}}>{result.title}</div>
              <div style={{fontSize:13,color:C.inkLight}}>{result.verdictReason}</div>
            </div>
            <div style={{fontSize:32,flexShrink:0}}>
              {result.verdict==="FAVORABLE"?"✅":result.verdict==="DESFAVORABLE"||result.verdict==="UNFAVORABLE"?"⚠️":"⚖️"}
            </div>
          </div>

          {/* Summary */}
          <div style={{background:C.paper,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:10}}>{t.summaryTitle}</div>
            <p style={{fontSize:14,color:C.ink,lineHeight:1.7,fontFamily:"'Lora',serif",fontStyle:"italic"}}>{result.summary}</p>
            <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                            {(userPlan !== "free" || user?.primaryEmailAddress?.emailAddress === "gonrobtor@gmail.com") ? (
                <button onClick={listen} disabled={speaking}
                  style={{padding:"7px 14px",background:C.accentDim,
                    border:`1px solid ${C.accent}`,borderRadius:8,cursor:"pointer",
                    fontSize:12,fontWeight:600,color:C.accent}}>
                  {speaking?t.listeningBtn:t.listenBtn}
                </button>
              ) : (
                <button onClick={()=>setShowPricing(true)}
                  style={{padding:"7px 14px",background:C.accentDim,
                    border:`1px solid ${C.accent}`,borderRadius:8,cursor:"pointer",
                    fontSize:12,fontWeight:600,color:C.accent}}>
                  🔒 {t.listenBtn}
                </button>
              )}
              {(userPlan !== "free" || user?.primaryEmailAddress?.emailAddress === "gonrobtor@gmail.com") ? (
                <button onClick={()=>exportPDF(result,lang)}
                  style={{padding:"7px 14px",background:C.goldDim,border:`1px solid ${C.gold}`,
                    borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:C.gold}}>
                  {t.exportBtn}
                </button>
              ) : (
                <button onClick={()=>setShowPricing(true)}
                  style={{padding:"7px 14px",background:C.goldDim,border:`1px solid ${C.gold}`,
                    borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,color:C.gold}}>
                  🔒 {t.exportBtn}
                </button>
              )}
            </div>
          </div>

          <Section title={t.risksTitle} items={result.risks} color={C.red} bg={C.redDim}/>
          <Section title={t.goodTitle} items={result.good} color={C.accent} bg={C.accentDim}/>
          <Section title={t.watchTitle} items={result.watch} color={C.gold} bg={C.goldDim}/>
          <Section title={t.negotiateTitle} items={result.negotiate} color={C.accent}/>
          <Section title={t.questionsTitle} items={result.questions} color={C.inkLight}/>

          <p style={{fontSize:11,color:C.inkLight,textAlign:"center",marginTop:14,lineHeight:1.5}}>{t.disclaimer}</p>

          <div style={{textAlign:"center",marginTop:16,marginBottom:4}}>
            <a href="mailto:gonrobtor@gmail.com" style={{fontSize:11,color:C.inkLight,textDecoration:"none"}}>
              ✉️ gonrobtor@gmail.com
            </a>
          </div>
          <button onClick={reset}
            style={{width:"100%",marginTop:8,padding:"12px",background:"transparent",
              color:C.accent,border:`1.5px solid ${C.accent}`,borderRadius:12,
              fontSize:14,fontWeight:600,cursor:"pointer"}}>
            {t.newDoc}
          </button>
        </div>
      )}
    </main>
    </>
  );
}
