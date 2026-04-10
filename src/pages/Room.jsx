import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ToastContainer from "../components/ToastContainer";
import { dummyParticipants } from "../data/dummyData";

const INITIAL_CODE = `// Welcome to the collaboration room
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(INITIAL_CODE);
  const [terminalOutput, setTerminalOutput] = useState("$ Ready to run code…\n");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alice", message: "Hey everyone! Let's start coding.", time: "10:30 AM" },
    { id: 2, user: "Bob", message: "Sounds good! I'll work on the function.", time: "10:31 AM" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [participants] = useState(dummyParticipants);
  const [toasts, setToasts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = {
      id: Date.now(),
      user: "You",
      message: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((p) => [...p, msg]);
    setChatInput("");
  };

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTerminalOutput((p) => p + "$ Running code…\n$ Executed successfully ✓\n");
      setIsRunning(false);
      addToast("Code executed successfully", "success");
    }, 600);
  };

  const toggleMute = () => {
    setIsMuted((p) => !p);
    addToast(isMuted ? "Microphone unmuted" : "Microphone muted", "info");
  };

  const onlineCount = participants.filter((p) => p.online).length;
  const codeLines = code.split("\n");

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-100">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ─── Top Bar ─────────────────────────── */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm z-10">
        <Button variant="ghost" size="xs" onClick={() => navigate("/collaboration")} className="gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-800 truncate">{roomId}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(roomId); addToast("Room ID copied", "success"); }}
            className="p-1 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex-shrink-0"
            title="Copy Room ID"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="success" dot size="sm">{onlineCount} online</Badge>
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg transition-all ${isMuted ? "bg-red-100 text-red-600 hover:bg-red-200" : "text-slate-500 hover:bg-slate-100"}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── Body ────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── Code Editor Panel ─────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e2e]">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244] flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Mac-style dots */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="w-px h-4 bg-[#45475a]" />
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#cdd6f4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-xs font-semibold text-[#a6adc8]">main.js</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#fab387] ml-1" title="Unsaved changes" />
              </div>
            </div>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#a6e3a1] text-[#1e1e2e] hover:bg-[#94e2d5] disabled:opacity-60 transition-all shadow-sm"
            >
              {isRunning ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Run
                </>
              )}
            </button>
          </div>

          {/* Editor body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers */}
            <div className="w-12 bg-[#181825] flex flex-col items-end px-2 pt-3 text-xs font-mono text-[#45475a] select-none flex-shrink-0 overflow-hidden">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-6 w-full text-right">{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <div className="flex-1 relative min-w-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-3 pl-4 font-mono text-sm text-[#cdd6f4] bg-transparent focus:outline-none resize-none leading-6 caret-[#f5c2e7] scrollbar-thin"
                style={{ fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace', tabSize: 2 }}
                spellCheck={false}
                wrap="off"
              />
            </div>
          </div>

          {/* Status bar */}
          <div className="h-6 bg-[#6366f1] px-4 flex items-center justify-between text-[11px] font-semibold text-white/90 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span>JavaScript</span>
              <span className="text-white/60">UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70">{codeLines.length} lines</span>
              <span className="text-white/70">{code.replace(/\s/g, "").length} chars</span>
            </div>
          </div>
        </div>

        {/* ─── Right Panel: Terminal + Chat ────── */}
        <div className="w-[360px] flex flex-col flex-shrink-0 bg-white border-l border-slate-200">

          {/* Terminal */}
          <div className="flex flex-col border-b border-slate-200" style={{ height: "38%" }}>
            {/* Terminal header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#181825] flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="w-px h-3 bg-[#45475a]" />
                <span className="text-[11px] font-bold text-[#a6adc8]">Terminal</span>
              </div>
              <button
                onClick={() => setTerminalOutput("$ Ready to run code…\n")}
                className="text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
                title="Clear"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Terminal output */}
            <div className="flex-1 overflow-auto p-3 bg-[#0c0c0c] font-mono text-[11px] scrollbar-thin min-h-0">
              <pre className="whitespace-pre-wrap leading-5">
                {terminalOutput.split("\n").map((line, i) => {
                  if (!line) return <div key={i} className="h-3" />;
                  if (line.startsWith("$")) return (
                    <div key={i} className="mb-0.5">
                      <span className="text-[#0dbc79]">➜</span>
                      <span className="text-[#e06c75] ml-1.5">~</span>
                      <span className="text-[#61afef] ml-1">$</span>
                      <span className="text-[#e5c07b] ml-1.5">{line.substring(1).trim()}</span>
                    </div>
                  );
                  if (line.includes("successfully") || line.includes("✓")) return (
                    <div key={i} className="mb-0.5 text-[#98c379]">{line}</div>
                  );
                  if (line.includes("Running")) return (
                    <div key={i} className="mb-0.5 text-[#e5c07b]">{line}</div>
                  );
                  return <div key={i} className="mb-0.5 text-[#abb2bf]">{line}</div>;
                })}
              </pre>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 flex-shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 pulse-dot" />
                <span className="text-xs font-bold text-slate-700">Team Chat</span>
              </div>
              <Badge variant="default" size="xs">{chatMessages.length}</Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-3 space-y-3 scrollbar-thin min-h-0">
              {chatMessages.map((msg) => {
                const isMe = msg.user === "You";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {!isMe && (
                        <span className="text-[10px] font-bold text-slate-500 px-1">{msg.user}</span>
                      )}
                      <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? "gradient-brand text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat input */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <button
                  onClick={sendMessage}
                  className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center text-white shadow-button hover:shadow-button-hover transition-all hover:-translate-y-0.5 flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Participants Panel ───────────────── */}
        <div className="w-[200px] flex flex-col flex-shrink-0 bg-white border-l border-slate-200">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <span className="text-xs font-bold text-slate-700">Participants</span>
            <Badge variant="primary" size="xs">{participants.length}</Badge>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1 scrollbar-thin">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                    {p.avatar}
                  </div>
                  {p.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                  <p className={`text-[10px] font-medium ${p.online ? "text-emerald-600" : "text-slate-400"}`}>
                    {p.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
