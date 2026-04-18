import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ToastContainer from "../components/ToastContainer";
import { getCodeExecutionError, runCode as runCodeApi } from "../api/codeApi";
import { getApiErrorMessage, getRoomDetails, leaveRoom } from "../api/roomApi";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const nextIdRef = useRef(0);
  const latestCodeRef = useRef("");
  const codeChangeTimeoutRef = useRef(null);
  const hasConnectedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const currentUserIdRef = useRef(null);
  const memberDirectoryRef = useRef({});
  const isSendingMessageRef = useRef(false);

  const [roomName, setRoomName] = useState("Collaboration Room");
  const [roomCode, setRoomCode] = useState("");
  const [memberDirectory, setMemberDirectory] = useState({});
  const [code, setCode] = useState(() => localStorage.getItem(`room-${roomId}-code`) || "");
  const [executionOutput, setExecutionOutput] = useState("Run your Python code to see the output here.");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const getNextId = () => {
    nextIdRef.current += 1;
    return nextIdRef.current;
  };

  const addToast = (message, type = "success") => {
    const id = getNextId();
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`room-${roomId}-code`) || "";
    setCode(savedCode);
    latestCodeRef.current = savedCode;
  }, [roomId]);

  useEffect(() => {
    memberDirectoryRef.current = memberDirectory;
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        name: memberDirectory[user.id] || user.name,
      }))
    );
  }, [memberDirectory]);

  useEffect(() => {
    localStorage.setItem(`room-${roomId}-code`, code);
  }, [code, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    const loadRoomDetails = async () => {
      setIsRoomLoading(true);

      try {
        const room = await getRoomDetails(roomId);

        if (!isMounted) {
          return;
        }

        setRoomName(room?.name || "Collaboration Room");
        setRoomCode(room?.code || "");
        setMemberDirectory(
          (room?.members || []).reduce((acc, member) => {
            acc[member._id] = member.name;
            return acc;
          }, {})
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        addToast(
          getApiErrorMessage(error, "Unable to load room details."),
          "error"
        );
      } finally {
        if (isMounted) {
          setIsRoomLoading(false);
        }
      }
    };

    loadRoomDetails();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return undefined;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserIdRef.current = payload.id || payload._id || null;
    } catch {
      currentUserIdRef.current = null;
    }

    return undefined;
  }, []);

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const normalizeTime = (timestamp) =>
      new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleConnect = () => {
      const isReconnect = hasConnectedRef.current;

      hasConnectedRef.current = true;
      setLoading(false);
      setIsReconnecting(false);
      setUsers((prev) => {
        const selfId = currentUserIdRef.current || socket.id;
        const selfName = memberDirectoryRef.current[selfId] || "You";

        if (prev.some((user) => user.id === selfId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: selfId,
            name: selfName,
            online: true,
          },
        ];
      });
      socket.emit("join-room", { roomId });

      if (isReconnect && latestCodeRef.current.trim()) {
        socket.emit("sync-code", {
          roomId,
          code: latestCodeRef.current,
        });
      }
    };

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${message.userId}-${message.timestamp}`,
          userId: message.userId,
          message: message.message,
          time: normalizeTime(message.timestamp),
        },
      ]);
    };

    const handleReceiveCode = (incomingCode) => {
      const nextCode = incomingCode?.code || "";

      if (nextCode === latestCodeRef.current) {
        return;
      }

      if (codeChangeTimeoutRef.current) {
        clearTimeout(codeChangeTimeoutRef.current);
        codeChangeTimeoutRef.current = null;
      }

      if (incomingCode?.isFullSync) {
        setCode(nextCode);
        latestCodeRef.current = nextCode;
        return;
      }

      setCode(nextCode);
      latestCodeRef.current = nextCode;
    };

    const handleUserJoined = (data) => {
      console.log("User joined:", data);
      setUsers((prev) => {
        if (prev.some((user) => user.id === data.userId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: data.userId,
            name: memberDirectoryRef.current[data.userId] || `User ${String(data.userId).slice(-4)}`,
            online: true,
          },
        ];
      });

      if (!latestCodeRef.current.trim()) {
        return;
      }

      socket.emit("sync-code", {
        roomId,
        code: latestCodeRef.current,
      });
    };

    const handleReceiveOutput = (output) => {
      setExecutionOutput(output || "Code ran successfully with no output.");
    };

    const handleSocketError = (error) => {
      console.error(error);
      const id = getNextId();
      setToasts((prev) => [
        ...prev,
        { id, message: error.message || "Something went wrong", type: "error" },
      ]);
      setLoading(false);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
      setIsReconnecting(true);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("receive-message", handleReceiveMessage);
    socket.off("receive-code", handleReceiveCode);
    socket.off("receive-output", handleReceiveOutput);
    socket.off("user-joined", handleUserJoined);
    socket.off("socket-error", handleSocketError);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("receive-code", handleReceiveCode);
    socket.on("receive-output", handleReceiveOutput);
    socket.on("user-joined", handleUserJoined);
    socket.on("socket-error", handleSocketError);

    return () => {
      if (codeChangeTimeoutRef.current) {
        clearTimeout(codeChangeTimeoutRef.current);
      }
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("receive-code", handleReceiveCode);
      socket.off("receive-output", handleReceiveOutput);
      socket.off("user-joined", handleUserJoined);
      socket.off("socket-error", handleSocketError);
      disconnectSocket();
    };
  }, [roomId]);

  const handleSendMessage = (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSendingMessageRef.current) return;

    const socket = getSocket();
    isSendingMessageRef.current = true;
    socket.emit("send-message", {
      roomId,
      message: trimmedMessage,
    });
    setTimeout(() => {
      isSendingMessageRef.current = false;
    }, 300);
    setChatInput("");
  };

  const handleCodeChange = (newCode) => {
    if (newCode === latestCodeRef.current) {
      return;
    }

    const socket = getSocket();

    setCode(newCode);
    latestCodeRef.current = newCode;

    if (!socket.connected) {
      return;
    }

    if (codeChangeTimeoutRef.current) {
      clearTimeout(codeChangeTimeoutRef.current);
    }

    codeChangeTimeoutRef.current = setTimeout(() => {
      socket.emit("code-change", {
        roomId,
        code: newCode,
      });
    }, 200);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      addToast("Enter some Python code before running it.", "error");
      return;
    }

    setIsRunning(true);
    setExecutionOutput("Running Python code...");

    try {
      const result = await runCodeApi({
        language: "python",
        code,
      });

      const output = result?.output ?? "";

      setExecutionOutput(output || "Code ran successfully with no output.");
      getSocket().emit("code-output", {
        roomId,
        output: output || "Code ran successfully with no output.",
      });
      addToast("Code executed successfully", "success");
    } catch (error) {
      const message = getCodeExecutionError(error, "Code execution failed.");
      setExecutionOutput(message);
      getSocket().emit("code-output", {
        roomId,
        output: message,
      });
      addToast(message, "error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleLeaveRoom = async () => {
    setIsLeaving(true);

    try {
      await leaveRoom({ roomId });
      addToast("Left room successfully", "success");
      navigate("/collaboration");
    } catch (error) {
      addToast(
        getApiErrorMessage(error, "Unable to leave the room right now."),
        "error"
      );
    } finally {
      setIsLeaving(false);
    }
  };

  const getUserName = (userId) => {
    if (!userId) {
      return "User";
    }

    return memberDirectory[userId] || "User";
  };

  const onlineCount = users.filter((p) => p.online).length;
  const codeLines = code.split("\n");
  const displayedRoomName = isRoomLoading ? "Loading room..." : roomName;
  const displayedRoomCode = isRoomLoading ? "Loading..." : roomCode || roomId;

  return (
    <div className="fixed inset-0 flex flex-col bg-[radial-gradient(circle_at_top,_#eff6ff,_#e2e8f0_35%,_#cbd5e1_100%)]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {isReconnecting && !loading && (
        <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 border-b border-amber-200">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Reconnecting to the collaboration server...
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-slate-200 border-t-brand-500 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading room...</p>
          </div>
        </div>
      ) : (
        <>

      <header className="border-b border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/15">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Live Collaboration Room
              </p>
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-slate-900">{displayedRoomName}</h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(displayedRoomCode);
                    addToast("Room code copied", "success");
                  }}
                  className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
                  title="Copy Room Code"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="truncate text-sm text-slate-500">Room Code: {displayedRoomCode}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" dot size="sm">{onlineCount} online</Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/collaboration")}
            >
              Back
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeaveRoom}
              disabled={isLeaving}
            >
              {isLeaving ? "Leaving..." : "Leave Room"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-4 lg:p-5">
        <div className="flex h-full flex-col gap-4 xl:flex-row">

        {/* ─── Code Editor Panel ─────────────── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-900/80 bg-[#0f172a] shadow-[0_28px_80px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between border-b border-slate-700/70 bg-[#111827] px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2 min-w-0">
                <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">main.py</p>
                  <p className="text-xs text-slate-400">Python collaborative editor</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-900 transition-all hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden bg-[#0b1120]">
            <div className="flex w-14 flex-col items-end overflow-hidden bg-[#111827] px-3 pt-5 text-xs font-mono text-slate-500 select-none">
              {codeLines.map((_, i) => (
                <div key={i} className="w-full text-right leading-7">{i + 1}</div>
              ))}
            </div>

            <div className="relative flex-1 min-w-0">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="absolute inset-0 h-full w-full resize-none bg-transparent px-5 py-5 font-mono text-sm leading-7 text-slate-200 caret-cyan-300 focus:outline-none"
                style={{ fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace', tabSize: 2 }}
                spellCheck={false}
                wrap="off"
                placeholder="Start coding with your team..."
              />
            </div>
          </div>

          <div className="flex h-10 items-center justify-between border-t border-slate-700/70 bg-[#111827] px-4 text-[11px] font-semibold text-slate-300">
            <div className="flex items-center gap-4">
              <span>Python</span>
              <span className="text-slate-500">UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">{codeLines.length} lines</span>
              <span className="text-slate-400">{code.replace(/\s/g, "").length} chars</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-col gap-4 xl:w-[380px] xl:flex-shrink-0">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-800">Team Chat</span>
              </div>
              <Badge variant="default" size="xs">{messages.length}</Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="max-w-[220px] rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-5">
                    <p className="text-sm font-semibold text-slate-700">No messages yet</p>
                    <p className="mt-1 text-xs text-slate-500">Start the conversation with your team.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.userId === currentUserIdRef.current;

                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[85%] flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && (
                          <span className="px-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {getUserName(msg.userId)}
                          </span>
                        )}
                        <div
                          className={`rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? "rounded-br-md bg-slate-900 text-white"
                              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="px-1 text-[10px] font-medium text-slate-400">{msg.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                  placeholder="Send a message to the room..."
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <button
                  onClick={() => handleSendMessage(chatInput)}
                  disabled={!chatInput.trim()}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[34%] min-h-[220px] flex-col overflow-hidden rounded-[26px] border border-slate-900/80 bg-[#020617] shadow-[0_18px_48px_rgba(2,6,23,0.25)]">
            <div className="flex items-center justify-between border-b border-slate-700/80 bg-[#111827] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="w-px h-3 bg-slate-700" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Output</span>
              </div>
              <button
                onClick={() => setExecutionOutput("Run your Python code to see the output here.")}
                className="text-slate-500 transition-colors hover:text-slate-200"
                title="Clear"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#020617] p-4 font-mono text-xs min-h-0">
              <pre className="whitespace-pre-wrap leading-6 text-emerald-200">
                {executionOutput}
              </pre>
            </div>
          </div>
        </div>
      </div>
      </div>
        </>
      )}
    </div>
  );
}

export default Room;
