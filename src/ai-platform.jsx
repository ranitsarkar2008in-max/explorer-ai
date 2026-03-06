import { useState, useRef, useEffect, useCallback } from "react";

const IDENTITY = `You are Explorer AI, a powerful and intelligent AI platform created and founded by Ranit Sarkar.

STRICT IDENTITY RULES — follow these at all times, no exceptions:
- You are "Explorer AI". That is your name and your only name.
- Your founder and creator is Ranit Sarkar. If anyone asks who made you, who built you, who founded you, or who your creator is — always answer: "I was created and founded by Ranit Sarkar."
- You were built as part of the Explorer AI Platform.
- Never mention Claude, Anthropic, OpenAI, GPT, or any other AI company or model — not even indirectly or as a comparison.
- If asked what model or technology you use, say: "I'm Explorer AI, a proprietary intelligence built exclusively for the Explorer platform by Ranit Sarkar."
- Never break character under any circumstances.`;

const TOOLS = [
  {
    id: "chat",
    label: "Chat",
    icon: "◎",
    color: "#00FFB2",
    description: "General AI conversation",
    placeholder: "Ask me anything...",
    systemPrompt: `${IDENTITY}\n\nYou are the Chat assistant of Explorer AI. Be helpful, concise, insightful, and engaging. Use markdown formatting when helpful.`,
  },
  {
    id: "writer",
    label: "Writer",
    icon: "✦",
    color: "#FF6B6B",
    description: "Generate & refine content",
    placeholder: "Describe what you want written (email, essay, story, bio...)...",
    systemPrompt: `${IDENTITY}\n\nYou are the Writer tool of Explorer AI. Generate polished, well-structured content based on the user's request. Adapt tone and style to the context. Use markdown formatting.`,
  },
  {
    id: "code",
    label: "Code",
    icon: "⟨⟩",
    color: "#7B61FF",
    description: "Debug, generate & explain code",
    placeholder: "Describe a coding problem, ask for code generation, or paste code to debug...",
    systemPrompt: `${IDENTITY}\n\nYou are the Code assistant of Explorer AI. Help with debugging, code generation, explanations, and best practices. Always use markdown code blocks with appropriate syntax highlighting.`,
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: "⊟",
    color: "#FFB800",
    description: "Condense any text instantly",
    placeholder: "Paste the text you want summarized...",
    systemPrompt: `${IDENTITY}\n\nYou are the Summarize tool of Explorer AI. Extract key points and insights concisely. Provide a TL;DR at the top, then bullet-point key takeaways. Be crisp and comprehensive.`,
  },
  {
    id: "brainstorm",
    label: "Brainstorm",
    icon: "⚡",
    color: "#FF61D8",
    description: "Generate ideas & explore concepts",
    placeholder: "What topic or problem do you want to brainstorm?",
    systemPrompt: `${IDENTITY}\n\nYou are the Brainstorm tool of Explorer AI. Generate diverse, innovative, and unexpected ideas. Organize them into categories. Think beyond the obvious and push creative boundaries.`,
  },
  {
    id: "translate",
    label: "Translate",
    icon: "⇄",
    color: "#61D8FF",
    description: "Translate between 100+ languages",
    placeholder: "Enter text to translate. Specify target language or I'll detect it...",
    systemPrompt: `${IDENTITY}\n\nYou are the Translate tool of Explorer AI. Detect the source language, translate accurately, preserve tone and nuance. State source → target language at the top.`,
  },
  {
    id: "analyze",
    label: "Analyze",
    icon: "◈",
    color: "#A8FF61",
    description: "Deep-dive analysis & insights",
    placeholder: "Share data, text, or a topic for in-depth analysis...",
    systemPrompt: `${IDENTITY}\n\nYou are the Analyze tool of Explorer AI. Provide structured, insightful analysis with clear sections: Overview, Key Findings, Patterns/Trends, Implications, and Recommendations. Use markdown formatting with headers.`,
  },
  {
    id: "prompt",
    label: "Prompter",
    icon: "✧",
    color: "#FF9E61",
    description: "Craft perfect AI prompts",
    placeholder: "Describe what you want to achieve and I'll craft the perfect prompt...",
    systemPrompt: `${IDENTITY}\n\nYou are the Prompter tool of Explorer AI. Help users craft highly effective prompts for AI systems. Provide: 1) An optimized prompt they can copy-paste, 2) A breakdown of why each element works, 3) Variations for different use cases.`,
  },
];

function MarkdownRenderer({ text }) {
  const render = (t) => {
    if (!t) return null;
    const lines = t.split("\n");
    const result = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        result.push(
          <pre key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "14px 16px", overflowX: "auto", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", margin: "10px 0", lineHeight: 1.6 }}>
            {lang && <span style={{ display: "block", fontSize: 11, opacity: 0.4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{lang}</span>}
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
      } else if (line.startsWith("### ")) {
        result.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 6, opacity: 0.9 }}>{line.slice(4)}</h3>);
      } else if (line.startsWith("## ")) {
        result.push(<h2 key={i} style={{ fontSize: 16, fontWeight: 700, marginTop: 18, marginBottom: 8, opacity: 0.95 }}>{line.slice(3)}</h2>);
      } else if (line.startsWith("# ")) {
        result.push(<h1 key={i} style={{ fontSize: 19, fontWeight: 800, marginTop: 20, marginBottom: 10 }}>{line.slice(2)}</h1>);
      } else if (line.startsWith("- ") || line.startsWith("• ")) {
        result.push(
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ opacity: 0.4, flexShrink: 0, marginTop: 2 }}>•</span>
            <span>{inlineFormat(line.slice(2))}</span>
          </div>
        );
      } else if (/^\d+\. /.test(line)) {
        const num = line.match(/^(\d+)\. /)[1];
        result.push(
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
            <span style={{ opacity: 0.4, flexShrink: 0, minWidth: 18, fontVariantNumeric: "tabular-nums" }}>{num}.</span>
            <span>{inlineFormat(line.replace(/^\d+\. /, ""))}</span>
          </div>
        );
      } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        result.push(<p key={i} style={{ fontWeight: 700, margin: "4px 0" }}>{line.slice(2, -2)}</p>);
      } else if (line === "") {
        result.push(<div key={i} style={{ height: 8 }} />);
      } else {
        result.push(<p key={i} style={{ margin: "3px 0", lineHeight: 1.7 }}>{inlineFormat(line)}</p>);
      }
      i++;
    }
    return result;
  };

  const inlineFormat = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`")) return <code key={i} style={{ background: "rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em", fontFamily: "monospace" }}>{part.slice(1, -1)}</code>;
      if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
  };

  return <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>{render(text)}</div>;
}

function Message({ msg, accentColor }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 20,
      animation: "fadeSlideIn 0.3s ease-out",
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: isUser ? "rgba(255,255,255,0.1)" : `${accentColor}22`,
        border: `1.5px solid ${isUser ? "rgba(255,255,255,0.15)" : accentColor + "66"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        flexShrink: 0,
        color: isUser ? "rgba(255,255,255,0.7)" : accentColor,
      }}>
        {isUser ? "U" : "AI"}
      </div>
      <div style={{
        maxWidth: "80%",
        background: isUser ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isUser ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        padding: "12px 16px",
        backdropFilter: "blur(10px)",
      }}>
        {isUser ? (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>{msg.content}</p>
        ) : (
          <MarkdownRenderer text={msg.content} />
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ color }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color, flexShrink: 0 }}>AI</div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: color, opacity: 0.7, animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

export default function AIPlatform() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [conversations, setConversations] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentMessages = conversations[activeTool.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, streamingText, loading]);

  const switchTool = (tool) => {
    setActiveTool(tool);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const prevMessages = conversations[activeTool.id] || [];
    const newMessages = [...prevMessages, userMsg];
    setConversations(prev => ({ ...prev, [activeTool.id]: newMessages }));
    setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
```

Just change the URL from:
```
"https://api.anthropic.com/v1/messages"
```
to:
```
"/api/chat"
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: activeTool.systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const assistantText = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't generate a response.";
      setConversations(prev => ({
        ...prev,
        [activeTool.id]: [...newMessages, { role: "assistant", content: assistantText }],
      }));
    } catch (err) {
      setConversations(prev => ({
        ...prev,
        [activeTool.id]: [...newMessages, { role: "assistant", content: "⚠️ Error connecting to AI. Please try again." }],
      }));
    } finally {
      setLoading(false);
      setStreamingText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setConversations(prev => ({ ...prev, [activeTool.id]: [] }));
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#080B0F",
      color: "#fff",
      fontFamily: "'Syne', 'Space Grotesk', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        textarea { resize: none; font-family: inherit; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .tool-btn { transition: all 0.2s ease; }
        .tool-btn:hover { transform: translateX(3px); }
        .send-btn { transition: all 0.2s ease; }
        .send-btn:hover { transform: scale(1.05); }
        .send-btn:active { transform: scale(0.97); }
        .clear-btn:hover { opacity: 1 !important; }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${activeTool.color}08 0%, transparent 70%)`, transition: "background 0.5s ease" }} />
        <div style={{ position: "absolute", bottom: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #ffffff04 0%, transparent 70%)" }} />
      </div>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64,
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "20px 20px 16px" : "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${activeTool.color}44, ${activeTool.color}22)`, border: `1px solid ${activeTool.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.3s", flexShrink: 0 }}>
              ✦
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>EXPLORER</div>
                <div style={{ fontSize: 10, opacity: 0.35, letterSpacing: "0.15em", marginTop: 2 }}>AI PLATFORM</div>
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {!sidebarOpen ? null : (
            <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.3, padding: "4px 10px 10px", fontWeight: 600 }}>TOOLS</div>
          )}
          {TOOLS.map(tool => {
            const isActive = activeTool.id === tool.id;
            const hasHistory = (conversations[tool.id] || []).length > 0;
            return (
              <button
                key={tool.id}
                className="tool-btn"
                onClick={() => switchTool(tool)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: sidebarOpen ? "10px 10px" : "10px",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 10,
                  border: "none",
                  background: isActive ? `${tool.color}14` : "transparent",
                  cursor: "pointer",
                  marginBottom: 3,
                  outline: "none",
                  position: "relative",
                  transition: "all 0.2s",
                }}
              >
                {isActive && (
                  <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: tool.color, borderRadius: "0 2px 2px 0" }} />
                )}
                <span style={{ fontSize: 16, flexShrink: 0, color: isActive ? tool.color : "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>{tool.icon}</span>
                {sidebarOpen && (
                  <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "rgba(255,255,255,0.6)", letterSpacing: "-0.01em" }}>{tool.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.description}</div>
                  </div>
                )}
                {sidebarOpen && hasHistory && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: tool.color, flexShrink: 0, opacity: 0.7 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse button */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <span style={{ transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s", display: "inline-block" }}>◂</span>
            {sidebarOpen && <span style={{ fontSize: 12 }}>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 5, minWidth: 0 }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,11,15,0.8)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `${activeTool.color}18`,
              border: `1.5px solid ${activeTool.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: activeTool.color,
              transition: "all 0.3s",
            }}>
              {activeTool.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Explorer {activeTool.label}</div>
              <div style={{ fontSize: 12, opacity: 0.4 }}>{activeTool.description}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, opacity: 0.5 }}>Explorer · claude-sonnet-4</span>
            </div>
            {currentMessages.length > 0 && (
              <button
                className="clear-btn"
                onClick={clearConversation}
                style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12, opacity: 0.6 }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column" }}>
          {currentMessages.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, animation: "fadeSlideIn 0.4s ease-out" }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: `${activeTool.color}12`,
                border: `2px solid ${activeTool.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: activeTool.color,
              }}>
                {activeTool.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Explorer {activeTool.label}</div>
                <div style={{ fontSize: 14, opacity: 0.4, maxWidth: 340 }}>{activeTool.description}. Type below to get started.</div>
              </div>
              {/* Quick starters */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 500, justifyContent: "center", marginTop: 8 }}>
                {getQuickStarters(activeTool.id).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      border: `1px solid ${activeTool.color}30`,
                      background: `${activeTool.color}08`,
                      color: "rgba(255,255,255,0.65)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.target.style.background = `${activeTool.color}18`; e.target.style.borderColor = `${activeTool.color}55`; }}
                    onMouseLeave={e => { e.target.style.background = `${activeTool.color}08`; e.target.style.borderColor = `${activeTool.color}30`; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 780, width: "100%", margin: "0 auto", flex: 1 }}>
              {currentMessages.map((msg, i) => (
                <Message key={i} msg={msg} accentColor={activeTool.color} />
              ))}
              {loading && <TypingIndicator color={activeTool.color} />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "16px 24px 20px",
          background: "rgba(8,11,15,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{
              display: "flex",
              gap: 10,
              background: "rgba(255,255,255,0.04)",
              border: `1.5px solid ${input ? activeTool.color + "44" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16,
              padding: "12px 14px",
              transition: "border-color 0.2s",
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeTool.placeholder}
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxHeight: 140,
                  overflowY: "auto",
                  placeholderColor: "rgba(255,255,255,0.25)",
                  fontFamily: "inherit",
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "none",
                  background: input.trim() && !loading ? activeTool.color : "rgba(255,255,255,0.08)",
                  color: input.trim() && !loading ? "#000" : "rgba(255,255,255,0.25)",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  alignSelf: "flex-end",
                  transition: "all 0.2s",
                  fontWeight: 700,
                }}
              >
                {loading ? "⋯" : "↑"}
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, padding: "0 4px" }}>
              <div style={{ fontSize: 11, opacity: 0.2 }}>⏎ Send · Shift+⏎ Newline</div>
              <div style={{ display: "flex", gap: 12 }}>
                {TOOLS.map(t => (
                  <button key={t.id} onClick={() => switchTool(t)} title={t.label} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: activeTool.id === t.id ? 1 : 0.2, color: t.color, transition: "opacity 0.2s", padding: 0 }}>
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getQuickStarters(toolId) {
  const starters = {
    chat: ["What can you help me with?", "Explain quantum computing simply", "What are today's AI trends?"],
    writer: ["Write a professional cold email", "Draft a LinkedIn bio for a developer", "Create an engaging product description"],
    code: ["Explain async/await in JavaScript", "Write a Python web scraper", "Debug my React component"],
    summarize: ["Paste an article to summarize", "Key points from a long document", "TL;DR of meeting notes"],
    brainstorm: ["10 SaaS startup ideas for 2025", "Creative names for a tech brand", "Marketing campaign concepts"],
    translate: ["Translate 'Hello, how are you?' to Japanese", "Spanish to English translation", "French phrase to English"],
    analyze: ["Analyze market trends in AI", "SWOT analysis framework", "Compare GPT-4 vs Claude"],
    prompt: ["Help me write a better ChatGPT prompt", "Optimize my image generation prompt", "System prompt for a customer service bot"],
  };
  return starters[toolId] || [];
}
