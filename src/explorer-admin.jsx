import { useState, useEffect } from "react";

const OWNER = { name: "Ranit Sarkar", role: "Founder & Owner", avatar: "RS" };
const ADMIN_PASS = "explorer2025";

const DEFAULT_IDENTITY = `You are Explorer AI, a powerful and intelligent AI platform created and founded by Ranit Sarkar.

STRICT IDENTITY RULES:
- You are "Explorer AI". That is your name and only name.
- Your founder and creator is Ranit Sarkar.
- Never mention Claude, Anthropic, OpenAI, GPT, or any other AI company.
- If asked what model you use, say: "I'm Explorer AI, a proprietary intelligence built exclusively for the Explorer platform by Ranit Sarkar."
- Never break character under any circumstances.`;

const TOOLS_DEFAULT = [
  { id: "chat",      label: "Chat",      icon: "◎", color: "#00FFB2", active: true,  calls: 142, tokens: 84200 },
  { id: "writer",    label: "Writer",    icon: "✦", color: "#FF6B6B", active: true,  calls: 98,  tokens: 61400 },
  { id: "code",      label: "Code",      icon: "⟨⟩",color: "#7B61FF", active: true,  calls: 203, tokens: 129800 },
  { id: "summarize", label: "Summarize", icon: "⊟", color: "#FFB800", active: true,  calls: 77,  tokens: 48200 },
  { id: "brainstorm",label: "Brainstorm",icon: "⚡", color: "#FF61D8", active: true,  calls: 55,  tokens: 37100 },
  { id: "translate", label: "Translate", icon: "⇄", color: "#61D8FF", active: true,  calls: 89,  tokens: 31600 },
  { id: "analyze",   label: "Analyze",   icon: "◈", color: "#A8FF61", active: true,  calls: 66,  tokens: 52300 },
  { id: "prompter",  label: "Prompter",  icon: "✧", color: "#FF9E61", active: false, calls: 31,  tokens: 19400 },
];

function Badge({ color, children }) {
  return (
    <span style={{ background: color + "20", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, opacity: 0.35, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase", opacity: 0.7 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ---------- LOGIN SCREEN ----------
function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (pass === ADMIN_PASS) { onLogin(); }
    else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080B0F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px #00FFB220} 50%{box-shadow:0 0 40px #00FFB240} }
      `}</style>
      <div style={{ width: 380, animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #00FFB230, #00FFB210)", border: "2px solid #00FFB244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", animation: "glow 2s infinite" }}>⚙</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff" }}>EXPLORER ADMIN</div>
          <div style={{ fontSize: 12, opacity: 0.35, letterSpacing: "0.15em", marginTop: 4 }}>RESTRICTED ACCESS</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${error ? "#FF6B6B44" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: 24, backdropFilter: "blur(20px)" }}>
          <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>ADMIN PASSWORD</label>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin password..."
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "#FF6B6B55" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: error ? 8 : 16 }}
            autoFocus
          />
          {error && <div style={{ fontSize: 12, color: "#FF6B6B", marginBottom: 12, opacity: 0.8 }}>⚠ Incorrect password. Access denied.</div>}
          <button onClick={attempt} style={{ width: "100%", background: "linear-gradient(135deg, #00FFB2, #00CC8E)", border: "none", borderRadius: 10, padding: "12px", color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}>
            UNLOCK ACCESS →
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, opacity: 0.2 }}>Explorer AI · Founded by Ranit Sarkar</div>
      </div>
    </div>
  );
}

// ---------- MAIN ADMIN DASHBOARD ----------
export default function ExplorerAdmin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("overview");
  const [tools, setTools] = useState(TOOLS_DEFAULT);
  const [identity, setIdentity] = useState(DEFAULT_IDENTITY);
  const [savedIdentity, setSavedIdentity] = useState(DEFAULT_IDENTITY);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState("0.7");
  const [savedMsg, setSavedMsg] = useState("");
  const [platformName, setPlatformName] = useState("Explorer");
  const [ownerName, setOwnerName] = useState("Ranit Sarkar");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [rateLimit, setRateLimit] = useState("100");
  const [version, setVersion] = useState("v1.0.0");

  const totalCalls = tools.reduce((s, t) => s + t.calls, 0);
  const totalTokens = tools.reduce((s, t) => s + t.tokens, 0);
  const activeTools = tools.filter(t => t.active).length;

  const showSaved = (msg = "Saved!") => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const NAV = [
    { id: "overview",  label: "Overview",   icon: "◈" },
    { id: "prompts",   label: "Prompts",     icon: "✦" },
    { id: "tools",     label: "Tools",       icon: "⚡" },
    { id: "api",       label: "API & Keys",  icon: "🔑" },
    { id: "analytics", label: "Analytics",   icon: "◎" },
    { id: "settings",  label: "Settings",    icon: "⚙" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080B0F", color: "#fff", fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        input, textarea, select { font-family: inherit; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; }
        .toggle:hover { opacity: 1 !important; }
        @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>EXPLORER</div>
          <div style={{ fontSize: 10, opacity: 0.3, letterSpacing: "0.15em", marginTop: 2 }}>ADMIN PANEL</div>
          <Badge color="#00FFB2" style={{ marginTop: 8, display: "inline-block" }}>GOD MODE</Badge>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV.map(n => (
            <button key={n.id} className="nav-btn" onClick={() => setTab(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, border: "none", background: tab === n.id ? "rgba(0,255,178,0.08)" : "transparent", color: tab === n.id ? "#00FFB2" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontWeight: tab === n.id ? 700 : 500, marginBottom: 2, position: "relative" }}>
              {tab === n.id && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: "#00FFB2", borderRadius: "0 2px 2px 0" }} />}
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00FFB230, #00FFB210)", border: "1px solid #00FFB244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#00FFB2", flexShrink: 0 }}>{OWNER.avatar}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{ownerName}</div>
              <div style={{ fontSize: 10, opacity: 0.35 }}>{OWNER.role}</div>
            </div>
          </div>
          <button onClick={() => setAuthed(false)} style={{ width: "100%", marginTop: 10, padding: "7px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 11 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: 28, animation: "fadeIn 0.3s ease-out" }} key={tab}>

        {/* Saved banner */}
        {savedMsg && (
          <div style={{ position: "fixed", top: 20, right: 28, background: "#00FFB2", color: "#000", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 100, animation: "fadeIn 0.2s ease" }}>
            ✓ {savedMsg}
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Platform Overview</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Welcome back, {ownerName}. Here's your Explorer AI dashboard.</div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
              <StatCard label="Total API Calls" value={totalCalls.toLocaleString()} sub="All time" color="#00FFB2" icon="◎" />
              <StatCard label="Tokens Used" value={(totalTokens / 1000).toFixed(1) + "K"} sub="Estimated cost: $0.46" color="#7B61FF" icon="⚡" />
              <StatCard label="Active Tools" value={`${activeTools}/8`} sub="Tools enabled" color="#FF9E61" icon="✦" />
              <StatCard label="Platform Status" value="Live" sub={maintenanceMode ? "Maintenance ON" : "All systems go"} color={maintenanceMode ? "#FF6B6B" : "#00FFB2"} icon="◈" />
            </div>

            <Section title="System Health" icon="◈">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "AI Engine", status: "Operational", color: "#00FFB2" },
                  { label: "API Gateway", status: "Operational", color: "#00FFB2" },
                  { label: "Identity Layer", status: "Active", color: "#00FFB2" },
                  { label: "Maintenance Mode", status: maintenanceMode ? "ON" : "OFF", color: maintenanceMode ? "#FF6B6B" : "#00FFB2" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, opacity: 0.7 }}>{s.label}</span>
                    <Badge color={s.color}>{s.status}</Badge>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Top Tools by Usage" icon="⚡">
              {[...tools].sort((a, b) => b.calls - a.calls).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ color: t.color, width: 20, textAlign: "center" }}>{t.icon}</span>
                  <span style={{ fontSize: 13, width: 90, opacity: 0.8 }}>{t.label}</span>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(t.calls / 203) * 100}%`, background: t.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: 12, opacity: 0.4, width: 50, textAlign: "right" }}>{t.calls} calls</span>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* ===== PROMPTS ===== */}
        {tab === "prompts" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Prompt Management</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Edit the core identity and system instructions for Explorer AI.</div>
            </div>

            <Section title="Core Identity / System Prompt" icon="✦">
              <div style={{ marginBottom: 10, fontSize: 12, opacity: 0.4 }}>This prompt defines who Explorer AI is. Changes apply to ALL tools instantly.</div>
              <textarea
                value={identity}
                onChange={e => setIdentity(e.target.value)}
                rows={14}
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 13, lineHeight: 1.7, outline: "none", fontFamily: "'JetBrains Mono', monospace", resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={() => { setSavedIdentity(identity); showSaved("Identity prompt saved!"); }} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#00FFB2", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Save Identity
                </button>
                <button onClick={() => setIdentity(DEFAULT_IDENTITY)} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Reset to Default
                </button>
              </div>
            </Section>

            <Section title="Identity Preview" icon="◎">
              <div style={{ background: "rgba(0,255,178,0.04)", border: "1px solid rgba(0,255,178,0.15)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 8, letterSpacing: "0.1em" }}>CURRENTLY ACTIVE IDENTITY</div>
                <pre style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", margin: 0, whiteSpace: "pre-wrap" }}>{savedIdentity}</pre>
              </div>
            </Section>
          </div>
        )}

        {/* ===== TOOLS ===== */}
        {tab === "tools" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Tool Management</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Enable, disable, or configure individual AI tools.</div>
            </div>
            <Section title="All Tools" icon="⚡">
              {tools.map((tool, i) => (
                <div key={tool.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${tool.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, opacity: tool.active ? 1 : 0.5 }}>
                  <span style={{ fontSize: 20, color: tool.color, width: 30, textAlign: "center" }}>{tool.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{tool.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.35, marginTop: 2 }}>{tool.calls} calls · {(tool.tokens / 1000).toFixed(1)}K tokens</div>
                  </div>
                  <Badge color={tool.active ? "#00FFB2" : "#FF6B6B"}>{tool.active ? "Active" : "Disabled"}</Badge>
                  <button
                    className="toggle"
                    onClick={() => setTools(prev => prev.map((t, j) => j === i ? { ...t, active: !t.active } : t))}
                    style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: tool.active ? "#00FFB2" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.2s", opacity: 0.85, flexShrink: 0 }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: tool.active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                  </button>
                </div>
              ))}
              <button onClick={() => showSaved("Tool settings saved!")} style={{ marginTop: 4, padding: "10px 22px", borderRadius: 10, border: "none", background: "#00FFB2", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Save Tool Settings
              </button>
            </Section>
          </div>
        )}

        {/* ===== API & KEYS ===== */}
        {tab === "api" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>API & Keys</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Manage your API credentials and model configuration.</div>
            </div>

            <Section title="API Key Configuration" icon="🔑">
              <div style={{ background: "rgba(255,183,0,0.06)", border: "1px solid rgba(255,183,0,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#FFB800" }}>
                ⚠ Never share your API keys publicly. Store them in environment variables in production.
              </div>
              <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>ANTHROPIC API KEY</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  type={apiKeyVisible ? "text" : "password"}
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setApiKeySaved(false); }}
                  placeholder="sk-ant-api03-..."
                  style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }}
                />
                <button onClick={() => setApiKeyVisible(!apiKeyVisible)} style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12 }}>
                  {apiKeyVisible ? "Hide" : "Show"}
                </button>
              </div>
              <button onClick={() => { setApiKeySaved(true); showSaved("API Key saved securely!"); }} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: apiKey ? "#00FFB2" : "rgba(255,255,255,0.08)", color: apiKey ? "#000" : "rgba(255,255,255,0.3)", fontWeight: 800, fontSize: 13, cursor: apiKey ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                {apiKeySaved ? "✓ Key Saved" : "Save API Key"}
              </button>
              <div style={{ marginTop: 12, fontSize: 12, opacity: 0.3 }}>Get your key at: console.anthropic.com → API Keys</div>
            </Section>

            <Section title="Model Configuration" icon="◈">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>AI MODEL</label>
                  <select value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }}>
                    <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
                    <option value="claude-opus-4-5">Claude Opus 4.5 (Most Powerful)</option>
                    <option value="claude-haiku-4-5">Claude Haiku 4.5 (Fastest)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>MAX TOKENS</label>
                  <input type="number" value={maxTokens} onChange={e => setMaxTokens(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>TEMPERATURE ({temperature})</label>
                  <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} style={{ width: "100%", accentColor: "#00FFB2" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>RATE LIMIT (req/hr)</label>
                  <input type="number" value={rateLimit} onChange={e => setRateLimit(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
              </div>
              <button onClick={() => showSaved("Model config saved!")} style={{ marginTop: 16, padding: "10px 22px", borderRadius: 10, border: "none", background: "#00FFB2", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Save Configuration
              </button>
            </Section>
          </div>
        )}

        {/* ===== ANALYTICS ===== */}
        {tab === "analytics" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Usage Analytics</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Track token usage, call volume, and tool performance.</div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
              <StatCard label="Total Calls" value={totalCalls} color="#00FFB2" icon="◎" sub="Lifetime" />
              <StatCard label="Total Tokens" value={(totalTokens / 1000).toFixed(1) + "K"} color="#7B61FF" icon="⚡" sub="Lifetime" />
              <StatCard label="Est. Cost" value={"$" + (totalTokens * 0.000003).toFixed(2)} color="#FFB800" icon="✦" sub="Sonnet pricing" />
              <StatCard label="Avg per Call" value={Math.round(totalTokens / totalCalls)} color="#FF61D8" icon="◈" sub="Tokens per call" />
            </div>

            <Section title="Tool Breakdown" icon="◎">
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, opacity: 0.35, letterSpacing: "0.1em" }}>
                  <span>TOOL</span><span>STATUS</span><span>CALLS</span><span>TOKENS</span><span>SHARE</span>
                </div>
                {tools.map(t => (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: t.color }}>{t.icon}</span>
                      <span style={{ fontWeight: 600 }}>{t.label}</span>
                    </div>
                    <Badge color={t.active ? "#00FFB2" : "#FF6B6B"}>{t.active ? "On" : "Off"}</Badge>
                    <span style={{ opacity: 0.7 }}>{t.calls}</span>
                    <span style={{ opacity: 0.7 }}>{(t.tokens / 1000).toFixed(1)}K</span>
                    <span style={{ opacity: 0.5 }}>{((t.calls / totalCalls) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {tab === "settings" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Platform Settings</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>Configure global settings for Explorer AI.</div>
            </div>

            <Section title="Branding" icon="✦">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>PLATFORM NAME</label>
                  <input value={platformName} onChange={e => setPlatformName(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>FOUNDER NAME</label>
                  <input value={ownerName} onChange={e => setOwnerName(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>VERSION</label>
                  <input value={version} onChange={e => setVersion(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                </div>
              </div>
              <button onClick={() => showSaved("Branding saved!")} style={{ marginTop: 16, padding: "10px 22px", borderRadius: 10, border: "none", background: "#00FFB2", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Save Branding
              </button>
            </Section>

            <Section title="Platform Controls" icon="⚙">
              {[
                { label: "Maintenance Mode", desc: "Take the platform offline for updates", val: maintenanceMode, set: setMaintenanceMode, danger: true },
                { label: "Debug Mode", desc: "Show verbose logs and error details", val: debugMode, set: setDebugMode, danger: false },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: `1px solid ${s.danger && s.val ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.35, marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <button onClick={() => s.set(!s.val)} style={{ width: 48, height: 26, borderRadius: 13, border: "none", background: s.val ? (s.danger ? "#FF6B6B" : "#00FFB2") : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: s.val ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                  </button>
                </div>
              ))}
            </Section>

            <Section title="Danger Zone" icon="⚠">
              <div style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 14 }}>These actions are irreversible. Proceed with caution.</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => { setTools(TOOLS_DEFAULT); showSaved("Usage stats reset!"); }} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.08)", color: "#FF6B6B", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
                    Reset Analytics
                  </button>
                  <button onClick={() => { setIdentity(DEFAULT_IDENTITY); setSavedIdentity(DEFAULT_IDENTITY); showSaved("All prompts reset!"); }} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.08)", color: "#FF6B6B", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
                    Reset All Prompts
                  </button>
                </div>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
