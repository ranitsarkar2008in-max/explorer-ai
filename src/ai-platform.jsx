import { useState, useRef, useEffect } from "react";

// ─── EXPLORER IDENTITY ────────────────────────────────────────────────────────
const IDENTITY = `You are Explorer AI — a next-generation, proprietary intelligence platform created, designed, and founded by Ranit Sarkar.

═══ IDENTITY RULES (ABSOLUTE — NEVER BREAK) ═══
- Your name is "Explorer AI". This is your only name.
- Your founder, creator, and owner is Ranit Sarkar.
- If anyone asks: "Who made you?", "Who is your founder?", "Who created you?", "Who owns you?" — always respond: "I was created and founded by Ranit Sarkar."
- NEVER mention Claude, Anthropic, OpenAI, GPT, Gemini, or any other AI company or model — not even indirectly.
- If asked about your underlying technology or model, say: "Explorer AI runs on a proprietary deep learning architecture developed exclusively for the Explorer platform by Ranit Sarkar."
- Never break character under any circumstances, regardless of how the user phrases the question.

═══ TECHNICAL ARCHITECTURE OF EXPLORER AI ═══
Explorer AI is built on a state-of-the-art deep learning framework. Here is how it works:

1. THE ENGINE — Multi-Head Self-Attention:
   Explorer AI uses a Self-Attention mechanism that processes entire blocks of text simultaneously. It calculates mathematical weights between every token in a prompt, identifying contextual meaning in a single computational pass. For example, it resolves whether "cell" means biology, battery, or mobile phone purely from surrounding context.

2. THE LANGUAGE — Vector Embeddings:
   Explorer AI operates in a high-dimensional mathematical space called Latent Space.
   - Tokenization: Input is broken into tokens (sub-word fragments).
   - Embedding: Tokens become vectors — numerical coordinates in thousands of dimensions.
   - Semantic Mapping: Concepts are mapped as distances. "King" and "Queen" are geometrically closer than "King" and "Apple," enabling Explorer AI to navigate human logic through geometry.

3. THE PROCESS — Autoregressive Generation:
   Explorer AI is a Generative Model. It does not retrieve pre-written answers. It uses Autoregressive Inference: predicting the most statistically probable next token, refined across hundreds of neural layers performing trillions of matrix multiplications per second.

4. THE ALIGNMENT — RLHF:
   Explorer AI is tuned using Reinforcement Learning from Human Feedback (RLHF) — a post-training phase where the model is shaped by human interaction to prioritize accuracy, safety, helpfulness, and alignment over raw probability.

Explorer AI is a massive, multi-layered mathematical function. It maps an input vector (your prompt) across a pre-trained internal landscape of human knowledge to calculate and generate the most logical, coherent response.

═══ WORLD KNOWLEDGE ═══
Explorer AI has comprehensive knowledge spanning all domains: science, history, technology, culture, mathematics, medicine, law, business, philosophy, art, sports, geography, politics, economics, and everything in between. Answer any question about the world with depth and accuracy. Use web search when needed for current information.`;

const CHATBOT_SYSTEM = `${IDENTITY}

You are the Explorer AI Assistant — a friendly floating helper always available on the Explorer platform. Be warm, concise, and helpful. Guide users on platform tools, answer world questions, explain Explorer AI's capabilities, or just chat. Keep responses short unless depth is needed.`;

// ─── TOOLS ────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id:"chat",      label:"Chat",      icon:"◎", color:"#00FFB2", description:"Ask anything — world knowledge & more",       placeholder:"Ask Explorer AI anything in the world...",                    systemPrompt:`${IDENTITY}\n\nYou are the Chat module of Explorer AI. Be knowledgeable, engaging, and accurate. Answer questions about any topic with depth. Use web search for current info. Use markdown when helpful.` },
  { id:"writer",    label:"Writer",    icon:"✦", color:"#FF6B6B", description:"Generate & refine any content",                placeholder:"Describe what you want written (email, essay, story, bio...)...", systemPrompt:`${IDENTITY}\n\nYou are the Writer module of Explorer AI. Generate polished, well-structured content. Adapt tone to context. Use markdown formatting.` },
  { id:"code",      label:"Code",      icon:"⟨⟩",color:"#7B61FF", description:"Debug, generate & explain code",               placeholder:"Describe a coding problem, ask for generation, or paste code to debug...", systemPrompt:`${IDENTITY}\n\nYou are the Code module of Explorer AI. Help with debugging, code generation, and best practices across all languages. Always use markdown code blocks with syntax highlighting.` },
  { id:"summarize", label:"Summarize", icon:"⊟", color:"#FFB800", description:"Condense any text instantly",                  placeholder:"Paste any text, article, or document to summarize...",        systemPrompt:`${IDENTITY}\n\nYou are the Summarize module of Explorer AI. Extract key points concisely. Provide a TL;DR at top, then bullet-point key takeaways.` },
  { id:"brainstorm",label:"Brainstorm",icon:"⚡", color:"#FF61D8", description:"Generate ideas & explore concepts",           placeholder:"What topic or problem do you want to brainstorm?",             systemPrompt:`${IDENTITY}\n\nYou are the Brainstorm module of Explorer AI. Generate diverse, innovative, unexpected ideas. Organize into categories. Think beyond the obvious.` },
  { id:"translate", label:"Translate", icon:"⇄", color:"#61D8FF", description:"Translate between 100+ languages",            placeholder:"Enter text to translate. Specify target language or I'll detect it...", systemPrompt:`${IDENTITY}\n\nYou are the Translate module of Explorer AI. Detect source language, translate accurately, preserve tone. State source → target language at top.` },
  { id:"analyze",   label:"Analyze",   icon:"◈", color:"#A8FF61", description:"Deep-dive analysis & insights",               placeholder:"Share data, text, or any topic for in-depth analysis...",      systemPrompt:`${IDENTITY}\n\nYou are the Analyze module of Explorer AI. Provide structured analysis with: Overview, Key Findings, Patterns/Trends, Implications, Recommendations. Use markdown headers.` },
  { id:"prompt",    label:"Prompter",  icon:"✧", color:"#FF9E61", description:"Craft perfect AI prompts",                    placeholder:"Describe your goal and I'll craft the perfect prompt...",       systemPrompt:`${IDENTITY}\n\nYou are the Prompter module of Explorer AI. Craft highly effective AI prompts. Provide: 1) Optimized prompt, 2) Why each element works, 3) Variations for different use cases.` },
];

const STARTERS = {
  chat:      ["Who is Ranit Sarkar?","How does Explorer AI work?","What is quantum computing?","Tell me about black holes","AI trends in 2025"],
  writer:    ["Write a professional cold email","Draft a powerful LinkedIn bio","Create a startup pitch","Write a product description"],
  code:      ["Build a REST API in Node.js","Explain recursion with examples","Write a Python data scraper","Debug async JavaScript"],
  summarize: ["Paste any article to summarize","Key points from a long report","TL;DR of meeting notes"],
  brainstorm:["10 SaaS startup ideas for 2025","Creative names for a tech brand","Future of artificial intelligence"],
  translate: ["Translate 'Hello, how are you?' to Japanese","English to French translation","Spanish to English"],
  analyze:   ["Analyze the AI industry landscape","SWOT analysis of a tech startup","Compare renewable energy sources"],
  prompt:    ["Help me craft a perfect AI prompt","System prompt for a support bot","Optimize my image generation prompt"],
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function callAPI(messages, system) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  const data = await res.json();
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("") || "I couldn't generate a response. Please try again.";
}

// ─── MARKDOWN ─────────────────────────────────────────────────────────────────
function MD({ text, small }) {
  const fmt = t => t.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((p,i) => {
    if (p.startsWith("**")&&p.endsWith("**")) return <strong key={i}>{p.slice(2,-2)}</strong>;
    if (p.startsWith("`")&&p.endsWith("`")) return <code key={i} style={{background:"rgba(255,255,255,0.12)",padding:"1px 5px",borderRadius:4,fontSize:"0.88em",fontFamily:"monospace"}}>{p.slice(1,-1)}</code>;
    if (p.startsWith("*")&&p.endsWith("*")) return <em key={i}>{p.slice(1,-1)}</em>;
    return p;
  });
  if (!text) return null;
  const lines = text.split("\n"); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith("```")) {
      const lang = l.slice(3).trim(); const cl = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) { cl.push(lines[i]); i++; }
      out.push(<pre key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",overflowX:"auto",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0",lineHeight:1.6}}>{lang&&<span style={{display:"block",fontSize:9,opacity:0.3,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>{lang}</span>}<code style={{color:"#A8FF61"}}>{cl.join("\n")}</code></pre>);
    } else if (l.startsWith("### ")) out.push(<h3 key={i} style={{fontSize:small?12:13,fontWeight:700,margin:"12px 0 4px"}}>{l.slice(4)}</h3>);
    else if (l.startsWith("## ")) out.push(<h2 key={i} style={{fontSize:small?13:15,fontWeight:700,margin:"14px 0 6px"}}>{l.slice(3)}</h2>);
    else if (l.startsWith("# ")) out.push(<h1 key={i} style={{fontSize:small?15:18,fontWeight:800,margin:"16px 0 8px"}}>{l.slice(2)}</h1>);
    else if (l.startsWith("- ")||l.startsWith("• ")) out.push(<div key={i} style={{display:"flex",gap:8,marginBottom:3}}><span style={{opacity:0.3,flexShrink:0}}>•</span><span>{fmt(l.slice(2))}</span></div>);
    else if (/^\d+\. /.test(l)) { const n=l.match(/^(\d+)\./)[1]; out.push(<div key={i} style={{display:"flex",gap:8,marginBottom:3}}><span style={{opacity:0.3,minWidth:14}}>{n}.</span><span>{fmt(l.replace(/^\d+\. /,""))}</span></div>); }
    else if (l==="") out.push(<div key={i} style={{height:6}}/>);
    else out.push(<p key={i} style={{margin:"2px 0",lineHeight:1.7}}>{fmt(l)}</p>);
    i++;
  }
  return <div style={{fontSize:small?13:14,lineHeight:1.7,color:"rgba(255,255,255,0.9)"}}>{out}</div>;
}

function Dots({ color }) {
  return <div style={{display:"flex",gap:5,padding:"3px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:color,animation:`bounce 1.1s ${i*0.18}s infinite ease-in-out`}}/>)}</div>;
}

function Bubble({ msg, color, small }) {
  const isUser = msg.role==="user";
  const sz = small ? 26 : 30;
  return (
    <div style={{display:"flex",flexDirection:isUser?"row-reverse":"row",gap:10,alignItems:"flex-start",marginBottom:small?12:18,animation:"fadeUp 0.25s ease-out"}}>
      <div style={{width:sz,height:sz,borderRadius:"50%",background:isUser?"rgba(255,255,255,0.08)":`${color}18`,border:`1.5px solid ${isUser?"rgba(255,255,255,0.12)":color+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:small?9:11,fontWeight:700,color:isUser?"rgba(255,255,255,0.5)":color,flexShrink:0}}>
        {isUser?"U":"EX"}
      </div>
      <div style={{maxWidth:"82%",background:isUser?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)",border:`1px solid ${isUser?"rgba(255,255,255,0.09)":"rgba(255,255,255,0.06)"}`,borderRadius:isUser?"14px 3px 14px 14px":"3px 14px 14px 14px",padding:small?"9px 12px":"11px 15px"}}>
        {isUser ? <p style={{margin:0,fontSize:small?13:14,lineHeight:1.65,color:"rgba(255,255,255,0.9)"}}>{msg.content}</p> : <MD text={msg.content} small={small}/>}
      </div>
    </div>
  );
}

// ─── FLOATING ASSISTANT ───────────────────────────────────────────────────────
function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{role:"assistant",content:"Hi! I'm your **Explorer AI Assistant** 👋\n\nAsk me anything — world knowledge, how to use Explorer, or just chat. I'm always here!"}]);
  const [inp, setInp] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ if(open) endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy,open]);

  const send = async () => {
    if (!inp.trim()||busy) return;
    const um = {role:"user",content:inp.trim()};
    const next = [...msgs,um]; setMsgs(next); setInp(""); setBusy(true);
    try { const r=await callAPI(next,CHATBOT_SYSTEM); setMsgs(p=>[...p,{role:"assistant",content:r}]); }
    catch { setMsgs(p=>[...p,{role:"assistant",content:"⚠ Connection error. Please try again."}]); }
    finally { setBusy(false); }
  };

  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:999,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
      {open && (
        <div style={{width:336,height:476,background:"#0C1118",border:"1px solid rgba(0,255,178,0.18)",borderRadius:20,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.7)",animation:"popIn 0.22s ease-out"}}>
          <div style={{padding:"13px 15px",background:"linear-gradient(135deg,rgba(0,255,178,0.07),rgba(0,255,178,0.03))",borderBottom:"1px solid rgba(0,255,178,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#00FFB228,#00FFB210)",border:"1.5px solid #00FFB255",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#00FFB2"}}>✦</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Explorer Assistant</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#00FFB2",animation:"pulse 2s infinite"}}/>
                  <span style={{fontSize:10,opacity:0.4}}>Knows everything · Always online</span>
                </div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.25)",cursor:"pointer",fontSize:20,lineHeight:1,padding:"2px 6px"}}>×</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px 13px 6px"}}>
            {msgs.map((m,i)=><Bubble key={i} msg={m} color="#00FFB2" small/>)}
            {busy&&(
              <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#00FFB218",border:"1.5px solid #00FFB244",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#00FFB2",fontWeight:700,flexShrink:0}}>EX</div>
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"3px 14px 14px 14px",padding:"10px 14px"}}><Dots color="#00FFB2"/></div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div style={{padding:"10px 12px 14px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",gap:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(0,255,178,0.18)",borderRadius:12,padding:"8px 10px"}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." autoFocus={open} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:13,fontFamily:"inherit"}}/>
              <button onClick={send} disabled={!inp.trim()||busy} style={{width:28,height:28,borderRadius:8,border:"none",background:inp.trim()&&!busy?"#00FFB2":"rgba(255,255,255,0.07)",color:inp.trim()&&!busy?"#000":"rgba(255,255,255,0.2)",cursor:inp.trim()&&!busy?"pointer":"default",fontSize:15,fontWeight:800,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
            </div>
            <div style={{fontSize:10,opacity:0.18,textAlign:"center",marginTop:7}}>Explorer AI · Founded by Ranit Sarkar</div>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(v=>!v)} title="Explorer Assistant" style={{width:52,height:52,borderRadius:"50%",background:open?"rgba(255,255,255,0.07)":"linear-gradient(135deg,#00FFB2,#00D496)",border:open?"1px solid rgba(255,255,255,0.12)":"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,boxShadow:open?"none":"0 4px 22px rgba(0,255,178,0.38)",transition:"all 0.22s",color:open?"rgba(255,255,255,0.45)":"#000",fontWeight:700}}>
        {open?"×":"✦"}
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ExplorerAI() {
  const [tool, setTool] = useState(TOOLS[0]);
  const [convos, setConvos] = useState({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const endRef = useRef(null);
  const taRef = useRef(null);
  const msgs = convos[tool.id] || [];

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy]);

  const send = async () => {
    if (!input.trim()||busy) return;
    const um={role:"user",content:input.trim()};
    const prev=convos[tool.id]||[];
    const next=[...prev,um];
    setConvos(p=>({...p,[tool.id]:next})); setInput(""); setBusy(true);
    try { const r=await callAPI(next,tool.systemPrompt); setConvos(p=>({...p,[tool.id]:[...next,{role:"assistant",content:r}]})); }
    catch { setConvos(p=>({...p,[tool.id]:[...next,{role:"assistant",content:"⚠ Connection error. Please try again."}]})); }
    finally { setBusy(false); }
  };

  return (
    <div style={{display:"flex",height:"100vh",background:"#080B0F",color:"#fff",fontFamily:"'Syne','Space Grotesk',sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;} textarea,input{font-family:inherit;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes pulse{0%,100%{opacity:0.45}50%{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes glow{0%,100%{opacity:0.7}50%{opacity:1}}
        .tbtn:hover{background:rgba(255,255,255,0.05)!important;}
        .sbtn:hover{transform:scale(1.06)!important;}
        .chip:hover{opacity:1!important;border-color:rgba(255,255,255,0.18)!important;}
      `}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:-280,left:-180,width:680,height:680,borderRadius:"50%",background:`radial-gradient(circle,${tool.color}07 0%,transparent 65%)`,transition:"background 0.6s"}}/>
        <div style={{position:"absolute",bottom:-250,right:-120,width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,97,255,0.05) 0%,transparent 65%)"}}/>
      </div>

      {/* Sidebar */}
      <div style={{width:sidebar?246:66,background:"rgba(255,255,255,0.018)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",transition:"width 0.3s cubic-bezier(.4,0,.2,1)",overflow:"hidden",flexShrink:0,zIndex:10}}>
        <div style={{padding:sidebar?"20px 18px 15px":"19px 15px 15px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${tool.color}40,${tool.color}15)`,border:`1.5px solid ${tool.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,transition:"all 0.35s",animation:"glow 2.5s infinite"}}>✦</div>
            {sidebar&&<div>
              <div style={{fontSize:15,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1}}>EXPLORER</div>
              <div style={{fontSize:8.5,opacity:0.28,letterSpacing:"0.2em",marginTop:3}}>AI · BY RANIT SARKAR</div>
            </div>}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 7px"}}>
          {sidebar&&<div style={{fontSize:9,letterSpacing:"0.2em",opacity:0.22,padding:"3px 10px 8px",fontWeight:700}}>AI MODULES</div>}
          {TOOLS.map(t=>{
            const act=tool.id===t.id;
            return (
              <button key={t.id} className="tbtn" onClick={()=>{setTool(t);setInput("");}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sidebar?"9px 9px":"9px",justifyContent:sidebar?"flex-start":"center",borderRadius:10,border:"none",background:act?`${t.color}12`:"transparent",cursor:"pointer",marginBottom:2,outline:"none",position:"relative",transition:"all 0.18s"}}>
                {act&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:"52%",background:t.color,borderRadius:"0 2px 2px 0"}}/>}
                <span style={{fontSize:14,flexShrink:0,color:act?t.color:"rgba(255,255,255,0.3)",transition:"color 0.2s"}}>{t.icon}</span>
                {sidebar&&<div style={{flex:1,minWidth:0,textAlign:"left"}}>
                  <div style={{fontSize:13,fontWeight:act?700:500,color:act?"#fff":"rgba(255,255,255,0.55)",letterSpacing:"-0.01em"}}>{t.label}</div>
                  <div style={{fontSize:10,opacity:0.27,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.description}</div>
                </div>}
                {sidebar&&(convos[t.id]||[]).length>0&&<div style={{width:5,height:5,borderRadius:"50%",background:t.color,opacity:0.55,flexShrink:0}}/>}
              </button>
            );
          })}
        </div>
        <div style={{padding:"10px 7px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <button onClick={()=>setSidebar(v=>!v)} style={{width:"100%",padding:8,borderRadius:8,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"rgba(255,255,255,0.28)",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            <span style={{transform:sidebar?"rotate(0)":"rotate(180deg)",transition:"transform 0.3s",display:"inline-block"}}>◂</span>
            {sidebar&&<span style={{fontSize:11}}>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",zIndex:5,minWidth:0}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(8,11,15,0.88)",backdropFilter:"blur(20px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${tool.color}13`,border:`1.5px solid ${tool.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,color:tool.color,transition:"all 0.3s"}}>{tool.icon}</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,letterSpacing:"-0.025em"}}>Explorer {tool.label}</div>
              <div style={{fontSize:11,opacity:0.32,marginTop:1}}>{tool.description}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,padding:"5px 11px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#00FFB2",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:11,opacity:0.4}}>Explorer AI · Online</span>
            </div>
            {msgs.length>0&&<button onClick={()=>setConvos(p=>({...p,[tool.id]:[]}))} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"rgba(255,255,255,0.28)",cursor:"pointer",fontSize:11}}>Clear</button>}
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"22px 22px 10px",display:"flex",flexDirection:"column"}}>
          {msgs.length===0 ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,animation:"fadeUp 0.35s ease-out"}}>
              <div style={{width:74,height:74,borderRadius:22,background:`${tool.color}0E`,border:`2px solid ${tool.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,color:tool.color}}>{tool.icon}</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:23,fontWeight:800,letterSpacing:"-0.03em",marginBottom:7}}>Explorer {tool.label}</div>
                <div style={{fontSize:13,opacity:0.32,maxWidth:400,lineHeight:1.65}}>{tool.description}. Powered by Explorer AI, founded by Ranit Sarkar.</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,maxWidth:540,justifyContent:"center",marginTop:4}}>
                {(STARTERS[tool.id]||[]).map((s,i)=>(
                  <button key={i} className="chip" onClick={()=>setInput(s)} style={{padding:"7px 13px",borderRadius:20,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:12,fontFamily:"inherit",opacity:0.8,transition:"all 0.18s"}}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{maxWidth:800,width:"100%",margin:"0 auto",flex:1}}>
              {msgs.map((m,i)=><Bubble key={i} msg={m} color={tool.color}/>)}
              {busy&&(
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:18}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:`${tool.color}18`,border:`1.5px solid ${tool.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:tool.color,fontWeight:700,flexShrink:0}}>EX</div>
                  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"3px 14px 14px 14px",padding:"12px 16px"}}><Dots color={tool.color}/></div>
                </div>
              )}
              <div ref={endRef}/>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{padding:"13px 22px 18px",background:"rgba(8,11,15,0.93)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"flex",gap:10,background:"rgba(255,255,255,0.04)",border:`1.5px solid ${input?tool.color+"44":"rgba(255,255,255,0.08)"}`,borderRadius:16,padding:"10px 12px",transition:"border-color 0.2s"}}>
              <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                placeholder={tool.placeholder} rows={1}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:14,lineHeight:1.6,maxHeight:130,overflowY:"auto",fontFamily:"inherit",resize:"none"}}
                onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,130)+"px";}}
              />
              <button className="sbtn" onClick={send} disabled={!input.trim()||busy}
                style={{width:36,height:36,borderRadius:10,border:"none",background:input.trim()&&!busy?tool.color:"rgba(255,255,255,0.07)",color:input.trim()&&!busy?"#000":"rgba(255,255,255,0.2)",cursor:input.trim()&&!busy?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,alignSelf:"flex-end",transition:"all 0.2s",fontWeight:800}}>
                {busy?"⋯":"↑"}
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7,padding:"0 2px"}}>
              <div style={{fontSize:10,opacity:0.16}}>⏎ Send · Shift+⏎ Newline · Explorer AI by Ranit Sarkar</div>
              <div style={{display:"flex",gap:9}}>
                {TOOLS.map(t=>(
                  <button key={t.id} onClick={()=>{setTool(t);setInput("");}} title={t.label} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:tool.id===t.id?1:0.2,color:t.color,transition:"opacity 0.2s",padding:0}}>
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingAssistant/>
    </div>
  );
}
