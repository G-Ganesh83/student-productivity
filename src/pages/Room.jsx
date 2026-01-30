import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import ToastContainer from "../components/ToastContainer";
import { dummyParticipants } from "../data/dummyData";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(`// Welcome to the collaboration room
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`);
  const [terminalOutput, setTerminalOutput] = useState("$ Ready to run code...\n");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alice", message: "Hey everyone! Let's start coding.", time: "10:30 AM" },
    { id: 2, user: "Bob", message: "Sounds good! I'll work on the function.", time: "10:31 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [participants] = useState(dummyParticipants);
  const [toasts, setToasts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };
  
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "You",
        message: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatInput("");
    }
  };
  
  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTerminalOutput(prev => prev + `$ Running code...\n$ Code executed successfully\n`);
      setIsRunning(false);
      addToast("Code executed successfully", "success");
    }, 500);
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    addToast(isMuted ? "Microphone unmuted" : "Microphone muted", "info");
  };

  const onlineCount = participants.filter(p => p.online).length;
  const codeLines = code.split('\n');
  const lineNumbers = codeLines.map((_, i) => i + 1);
  
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Compact Header */}
      <div className="glass border-b border-gray-200/50 backdrop-blur-md shadow-sm z-10">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/collaboration")}
                className="shadow-sm flex-shrink-0"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                  {roomId}
                </h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    addToast("Room ID copied to clipboard", "success");
                  }}
                  className="p-1 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                  title="Copy Room ID"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge variant="success" className="shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                {onlineCount} online
              </Badge>
              <Button
                variant={isMuted ? "danger" : "outline"}
                size="sm"
                onClick={handleToggleMute}
                className="shadow-sm"
              >
                {isMuted ? "🔇" : "🔊"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Optimized Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor - Takes 50% */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200/50 min-w-0">
          {/* Editor Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-2.5 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              </div>
              <div className="h-4 w-px bg-gray-600 mx-2"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-xs font-semibold text-gray-300">main.js</span>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={handleRunCode} 
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md text-xs px-3 py-1.5"
            >
              {isRunning ? (
                <>
                  <svg className="w-3.5 h-3.5 mr-1.5 animate-spin inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run
                </>
              )}
            </Button>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 flex overflow-hidden bg-[#1e1e1e]">
            {/* Line Numbers */}
            <div className="w-14 bg-[#252526] border-r border-gray-700/50 flex flex-col items-end px-2 py-3 text-xs font-mono text-gray-500 select-none flex-shrink-0">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 text-right w-full">
                  {num}
                </div>
              ))}
            </div>
            
            {/* Code Area */}
            <div className="flex-1 relative min-w-0">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 pl-4 font-mono text-sm text-[#d4d4d4] focus:outline-none resize-none leading-6 bg-transparent caret-white"
                style={{ 
                  fontFamily: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                  tabSize: 2
                }}
                spellCheck={false}
                wrap="off"
              />
            </div>
          </div>
          
          {/* Editor Footer */}
          <div className="bg-[#007acc] px-4 py-1.5 flex items-center justify-between text-xs text-white flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="font-medium">JavaScript</span>
              <span className="text-blue-200">UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-blue-200">{codeLines.length} lines</span>
              <span className="text-blue-200">{code.replace(/\s/g, '').length} chars</span>
            </div>
          </div>
        </div>
        
        {/* Right: Terminal and Chat - Takes 30% */}
        <div className="w-[400px] flex flex-col border-r border-gray-200/50 bg-white flex-shrink-0">
          {/* Terminal - 40% of right panel */}
          <div className="flex-[0.4] flex flex-col border-b border-gray-200/50 bg-white min-h-0">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-2.5 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="h-3 w-px bg-gray-600 mx-2"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-300">Terminal</span>
                </div>
              </div>
              <button 
                onClick={() => setTerminalOutput("$ Ready to run code...\n")}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                title="Clear terminal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Terminal Content */}
            <div className="flex-1 overflow-auto p-3 bg-[#0c0c0c] font-mono text-xs min-h-0">
              <pre className="text-[#0dbc79] whitespace-pre-wrap leading-relaxed">
                {terminalOutput.split('\n').map((line, idx) => {
                  if (line.startsWith('$')) {
                    return (
                      <div key={idx} className="mb-1">
                        <span className="text-[#0dbc79]">➜</span>
                        <span className="text-[#e06c75] ml-2">~</span>
                        <span className="text-[#61afef] ml-1">$</span>
                        <span className="text-[#e5c07b] ml-2">{line.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  if (line.includes('Running')) {
                    return (
                      <div key={idx} className="mb-1 text-[#e5c07b]">
                        {line}
                      </div>
                    );
                  }
                  if (line.includes('successfully')) {
                    return (
                      <div key={idx} className="mb-1 text-[#98c379]">
                        ✓ {line}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="mb-1 text-[#abb2bf]">
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
          
          {/* Chat - 60% of right panel */}
          <div className="flex-[0.6] flex flex-col bg-white min-h-0">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-4 py-2.5 border-b border-gray-200/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h2 className="text-xs font-bold text-gray-700">Chat</h2>
                <Badge variant="default" className="ml-auto text-xs px-1.5 py-0.5">
                  {chatMessages.length}
                </Badge>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-3 bg-gradient-to-b from-white to-gray-50/50 min-h-0">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={msg.user === "You" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[90%] rounded-xl px-3 py-2 shadow-sm ${
                    msg.user === "You" 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-xs font-bold ${msg.user === "You" ? "text-indigo-100" : "text-gray-600"}`}>
                        {msg.user}
                      </p>
                      <span className={`text-[10px] ${msg.user === "You" ? "text-indigo-200" : "text-gray-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                    <p className={`text-xs ${msg.user === "You" ? "text-white" : "text-gray-800"}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200/50 p-3 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-medium"
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="shadow-md text-xs px-3 py-2"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Participants Sidebar - Takes 20% */}
        <div className="w-[280px] bg-white border-l border-gray-200/50 flex flex-col flex-shrink-0">
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 px-4 py-2.5 border-b border-gray-200/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h2 className="text-xs font-bold text-gray-700">Participants</h2>
              <Badge variant="primary" className="ml-auto text-xs px-1.5 py-0.5">
                {participants.length}
              </Badge>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2 min-h-0">
            {participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                    {participant.avatar}
                  </div>
                  {participant.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{participant.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {participant.online ? (
                      <>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-medium text-emerald-600">Online</p>
                      </>
                    ) : (
                      <p className="text-[10px] text-gray-500">Offline</p>
                    )}
                  </div>
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
