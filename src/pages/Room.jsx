import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";
import { getCodeExecutionError, runCode as runCodeApi } from "../api/codeApi";
import { getApiErrorMessage, getRoomDetails, leaveRoom } from "../api/roomApi";
import { connectSocket, getSocket } from "../socket/socket";
import { decodeTokenPayload } from "../utils/auth";

const USER_COLOR_CLASSES = [
  {
    avatar: "bg-sky-100 text-sky-700",
    name: "text-sky-700",
    accent: "bg-sky-500",
  },
  {
    avatar: "bg-emerald-100 text-emerald-700",
    name: "text-emerald-700",
    accent: "bg-emerald-500",
  },
  {
    avatar: "bg-amber-100 text-amber-700",
    name: "text-amber-700",
    accent: "bg-amber-500",
  },
  {
    avatar: "bg-violet-100 text-violet-700",
    name: "text-violet-700",
    accent: "bg-violet-500",
  },
  {
    avatar: "bg-rose-100 text-rose-700",
    name: "text-rose-700",
    accent: "bg-rose-500",
  },
];

const FILE_TABS = [
  { id: "main.py", label: "main.py", active: true },
  { id: "readme.md", label: "README.md", active: false },
];

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { logout, token, user } = useAuth();
  const nextIdRef = useRef(0);
  const latestCodeRef = useRef("");
  const codeChangeTimeoutRef = useRef(null);
  const hasConnectedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const currentUserIdRef = useRef(null);
  const memberDirectoryRef = useRef({});
  const isSendingMessageRef = useRef(false);
  const editorTypingTimeoutRef = useRef(null);
  const isResizingChatRef = useRef(false);
  const outputPanelRef = useRef(null);
  const copyToastTimeoutRef = useRef(null);
  const hasRedirectedRef = useRef(false);
  const hasJoinedRoomRef = useRef(false);

  const [roomName, setRoomName] = useState("Collaboration Room");
  const [roomCode, setRoomCode] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [roomMembers, setRoomMembers] = useState([]);
  const [memberDirectory, setMemberDirectory] = useState({});
  const [code, setCode] = useState(() => localStorage.getItem(`room-${roomId}-code`) || "");
  const [executionOutput, setExecutionOutput] = useState("Run your Python code to see the output here.");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [isRoomValid, setIsRoomValid] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(true);
  const [isEditorTyping, setIsEditorTyping] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(380);
  const [isResizeHandleActive, setIsResizeHandleActive] = useState(false);
  const [isRoomCodeCopied, setIsRoomCodeCopied] = useState(false);

  const getNextId = useCallback(() => {
    nextIdRef.current += 1;
    return nextIdRef.current;
  }, []);

  const addToast = useCallback((message, type = "success") => {
    const id = getNextId();
    setToasts((p) => [...p, { id, message, type }]);
  }, [getNextId]);

  const removeToast = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  useEffect(() => {
    return () => {
      if (editorTypingTimeoutRef.current) {
        window.clearTimeout(editorTypingTimeoutRef.current);
      }
      if (copyToastTimeoutRef.current) {
        window.clearTimeout(copyToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    hasRedirectedRef.current = false;
    hasJoinedRoomRef.current = false;
    const savedCode = localStorage.getItem(`room-${roomId}-code`) || "";
    setCode(savedCode);
    latestCodeRef.current = savedCode;
    setIsRoomValid(false);
    setLoading(true);
    setIsRoomLoading(true);
  }, [roomId]);

  const redirectToCollaboration = useCallback((message, type = "error") => {
    if (hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    navigate("/collaboration", {
      replace: true,
      state: {
        roomToast: {
          message,
          type,
        },
      },
    });
  }, [navigate]);

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

  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      addToast("Enter some Python code before running it.", "error");
      return;
    }

    setIsRunning(true);
    setIsOutputExpanded(true);
    setExecutionOutput("Running Python code...");
    window.requestAnimationFrame(() => {
      outputPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

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
  }, [addToast, code, roomId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
        return;
      }

      const activeTagName = document.activeElement?.tagName;

      if (activeTagName === "INPUT") {
        return;
      }

      event.preventDefault();
      handleRunCode();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRunCode]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isResizingChatRef.current) {
        return;
      }

      const minWidth = 300;
      const maxWidth = Math.min(window.innerWidth * 0.42, 520);
      const nextWidth = window.innerWidth - event.clientX;
      const clampedWidth = Math.min(Math.max(nextWidth, minWidth), maxWidth);
      setChatPanelWidth(clampedWidth);
      setIsResizeHandleActive(true);
    };

    const handleMouseUp = () => {
      isResizingChatRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setIsResizeHandleActive(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const loadRoomDetails = useCallback(
    async ({ showLoading = true, showErrorToast = true } = {}) => {
      if (showLoading) {
        setIsRoomLoading(true);
      }

      try {
        const room = await getRoomDetails(roomId);

        if (!room || room.deleted) {
          redirectToCollaboration("Room no longer exists or was deleted");
          return;
        }

        const creator = room?.creator || room?.createdBy || null;
        const members = room?.members || [];

        setRoomName(room?.name || "Collaboration Room");
        setRoomCode(room?.code || "");
        setIsRoomValid(true);
        setCreatorId(creator?._id || creator?.id || creator || "");
        setRoomMembers(
          members.map((member) => ({
            id: member?._id || member?.id || member,
            name: member?.name || "Participant",
            email: member?.email || "",
          }))
        );
        setMemberDirectory(
          members.reduce((acc, member) => {
            const memberId = member?._id || member?.id || member;

            if (memberId) {
              acc[memberId] = member?.name || "Participant";
            }

            return acc;
          }, {})
        );
      } catch (error) {
        if (error?.response?.status === 404) {
          redirectToCollaboration("Room no longer exists or was deleted");
          return;
        }

        if (error?.response?.status === 403) {
          redirectToCollaboration("You no longer have access to this room");
          return;
        }

        const message = getApiErrorMessage(error, "Unable to load room details.");

        if (showErrorToast) {
          addToast(message, "error");
        }
      } finally {
        if (showLoading && !hasRedirectedRef.current) {
          setIsRoomLoading(false);
        }
      }
    },
    [addToast, redirectToCollaboration, roomId]
  );

  useEffect(() => {
    loadRoomDetails();
  }, [loadRoomDetails]);

  useEffect(() => {
    if (!token) {
      currentUserIdRef.current = null;
      return undefined;
    }

    const payload = decodeTokenPayload(token);
    currentUserIdRef.current = payload?.id || payload?._id || null;

    return undefined;
  }, [token]);

  useEffect(() => {
    connectSocket(token);
    const socket = getSocket();

    const normalizeTime = (timestamp) =>
      new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleConnect = () => {
      if (hasRedirectedRef.current) {
        return;
      }

      const isReconnect = hasConnectedRef.current;
      const canJoinRoom = Boolean(roomId && isRoomValid);

      hasConnectedRef.current = true;
      setLoading(false);
      setIsReconnecting(false);
      setUsers((prev) => {
        const selfId = currentUserIdRef.current || socket.id;
        const selfName = memberDirectoryRef.current[selfId] || user?.name || "You";

        if (prev.some((user) => user.id === selfId)) {
          return prev.map((existingUser) =>
            existingUser.id === selfId
              ? { ...existingUser, name: selfName, online: true }
              : existingUser
          );
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

      console.log("Socket connected:", socket.id);

      if (!canJoinRoom) {
        return;
      }

      console.log("Joining room:", roomId);
      socket.emit("join-room", { roomId });
      hasJoinedRoomRef.current = true;

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
      setUsers((prev) => {
        if (prev.some((user) => user.id === data.userId)) {
          return prev.map((existingUser) =>
            existingUser.id === data.userId
              ? { ...existingUser, online: true }
              : existingUser
          );
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

      if (data.userId !== currentUserIdRef.current) {
        addToast(`${memberDirectoryRef.current[data.userId] || "A participant"} joined the room`, "success");
      }

      loadRoomDetails({ showLoading: false, showErrorToast: false });

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
      const message = error?.message || "Something went wrong";

      console.error(error);

      if (message === "Room not found") {
        redirectToCollaboration("Room was deleted by host");
        return;
      }

      if (message === "Access denied") {
        redirectToCollaboration("You no longer have access to this room");
        return;
      }

      addToast(message, "error");
      setLoading(false);
    };

    const handleConnectError = (error) => {
      const message = error?.message || "Unable to connect to the collaboration server.";

      setLoading(false);
      setIsReconnecting(false);
      addToast(
        message === "Token expired" || message === "Invalid token"
          ? "Session expired. Please sign in again."
          : message,
        "error"
      );

      if (message === "Token expired" || message === "Invalid token") {
        logout();
        navigate("/login", { replace: true });
      }
    };

    const handleDisconnect = () => {
      if (hasRedirectedRef.current) {
        return;
      }

      hasJoinedRoomRef.current = false;
      setIsReconnecting(true);
    };

    if (socket.connected && isRoomValid && !hasJoinedRoomRef.current) {
      handleConnect();
    }

    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleConnectError);
    socket.off("receive-message", handleReceiveMessage);
    socket.off("receive-code", handleReceiveCode);
    socket.off("receive-output", handleReceiveOutput);
    socket.off("user-joined", handleUserJoined);
    socket.off("socket-error", handleSocketError);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
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
      socket.off("connect_error", handleConnectError);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("receive-code", handleReceiveCode);
      socket.off("receive-output", handleReceiveOutput);
      socket.off("user-joined", handleUserJoined);
      socket.off("socket-error", handleSocketError);
    };
  }, [addToast, isRoomValid, loadRoomDetails, logout, navigate, redirectToCollaboration, roomId, token, user?.name]);

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
    setIsEditorTyping(true);

    if (editorTypingTimeoutRef.current) {
      window.clearTimeout(editorTypingTimeoutRef.current);
    }

    editorTypingTimeoutRef.current = window.setTimeout(() => {
      setIsEditorTyping(false);
    }, 1200);

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

  const handleLeaveRoom = async () => {
    setIsLeaving(true);

    try {
      const response = await leaveRoom({ roomId });
      const successMessage = response?.deleted ? "Room deleted" : "You left the room";

      setIsLeaveDialogOpen(false);
      navigate("/collaboration", {
        state: {
          roomToast: {
            message: successMessage,
            type: "success",
          },
        },
      });
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

    if (userId === currentUserIdRef.current) {
      return user?.name || memberDirectory[userId] || "You";
    }

    return memberDirectory[userId] || "User";
  };

  const getUserColor = useCallback((userId) => {
    const value = String(userId || "user");
    const hash = Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
    return USER_COLOR_CLASSES[hash % USER_COLOR_CLASSES.length];
  }, []);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(displayedRoomCode);
    addToast("Room code copied", "success");
    setIsRoomCodeCopied(true);

    if (copyToastTimeoutRef.current) {
      window.clearTimeout(copyToastTimeoutRef.current);
    }

    copyToastTimeoutRef.current = window.setTimeout(() => {
      setIsRoomCodeCopied(false);
    }, 1600);
  };

  const activeUserMap = useMemo(
    () =>
      users.reduce((acc, participant) => {
        acc[participant.id] = participant;
        return acc;
      }, {}),
    [users]
  );
  const participantList = useMemo(() => {
    const participants = new Map();

    roomMembers.forEach((member) => {
      if (member?.id) {
        participants.set(member.id, {
          id: member.id,
          name: member.name || "Participant",
          email: member.email || "",
          online: Boolean(activeUserMap[member.id]?.online),
        });
      }
    });

    users.forEach((participant) => {
      if (!participant?.id) {
        return;
      }

      const existingParticipant = participants.get(participant.id);
      participants.set(participant.id, {
        id: participant.id,
        name:
          existingParticipant?.name ||
          memberDirectory[participant.id] ||
          participant.name ||
          "Participant",
        email: existingParticipant?.email || "",
        online: participant.online,
      });
    });

    return Array.from(participants.values()).map((participant) => {
      const isCurrentUser = participant.id === currentUserIdRef.current;
      const isCreator = participant.id === creatorId;
      const status = participant.online
        ? isCurrentUser && !isEditorTyping
          ? "idle"
          : "online"
        : "offline";

      return {
        ...participant,
        isCurrentUser,
        isCreator,
        status,
      };
    });
  }, [activeUserMap, creatorId, isEditorTyping, memberDirectory, roomMembers, users]);
  const activeUsers = participantList.filter((participant) => participant.online);
  const onlineCount = activeUsers.length;
  const codeLines = code.split("\n");
  const displayedRoomName = isRoomLoading ? "Loading room..." : roomName;
  const displayedRoomCode = isRoomLoading ? "Loading..." : roomCode || roomId;
  const isCurrentUserHost = creatorId === currentUserIdRef.current;
  const editorPresence = activeUsers.slice(0, 3).map((user) => ({
    ...user,
    activity:
      user.id === currentUserIdRef.current
        ? isEditorTyping
          ? "editing"
          : "viewing"
        : "viewing",
  }));
  const outputState = isRunning
    ? "running"
    : /(error|failed|traceback|exception)/i.test(executionOutput)
      ? "error"
      : "success";
  const typingIndicator = chatInput.trim()
    ? "You are typing..."
    : isEditorTyping
      ? "You are editing main.py"
    : activeUsers.length > 1
      ? `${activeUsers.length} collaborators online`
      : "Ready to collaborate";
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.userId === message.userId) {
        lastGroup.items.push(message);
        lastGroup.lastTime = message.time;
        return groups;
      }

      groups.push({
        id: message.id,
        userId: message.userId,
        lastTime: message.time,
        items: [message],
      });

      return groups;
    }, []);
  }, [messages]);
  const connectionLabel = isReconnecting ? "Reconnecting" : "Connected";
  const connectionClassName = isReconnecting ? "bg-amber-500" : "bg-emerald-500";
  const getParticipantStatusClassName = (status) => {
    if (status === "online") {
      return "bg-emerald-500";
    }

    if (status === "idle") {
      return "bg-amber-400";
    }

    return "bg-slate-300";
  };
  const getParticipantStatusLabel = (participant) => {
    if (participant.isCurrentUser && chatInput.trim()) {
      return "is typing...";
    }

    if (participant.status === "online") {
      return "online";
    }

    if (participant.status === "idle") {
      return "Idle (online)";
    }

    return "offline";
  };
  const isPageLoading = loading || isRoomLoading || !isRoomValid;

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-100">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Modal
        isOpen={isLeaveDialogOpen}
        onClose={() => {
          if (!isLeaving) {
            setIsLeaveDialogOpen(false);
          }
        }}
        title={isCurrentUserHost ? "Delete Room?" : "Leave Room?"}
        description={
          isCurrentUserHost
            ? "You are the host. Leaving will delete the room for everyone. Are you sure?"
            : "Are you sure you want to leave the room?"
        }
        size="sm"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {isCurrentUserHost
              ? "This room and its active collaboration session will close for all participants."
              : "You can rejoin later with the same room code as long as the host keeps the room active."}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsLeaveDialogOpen(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLeaveRoom}
              disabled={isLeaving}
            >
              {isLeaving
                ? isCurrentUserHost
                  ? "Deleting..."
                  : "Leaving..."
                : isCurrentUserHost
                  ? "Delete Room"
                  : "Leave Room"}
            </Button>
          </div>
        </div>
      </Modal>

      {isReconnecting && !loading && (
        <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 border-b border-amber-200">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Reconnecting to the collaboration server...
        </div>
      )}

      {isPageLoading ? (
        <div className="flex-1 overflow-hidden bg-slate-100 p-5">
          <div className="grid h-full min-h-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="animate-pulse border-b border-slate-200 px-5 py-4">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="mt-3 h-7 w-72 max-w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-44 rounded bg-slate-100" />
              </div>
              <div className="animate-pulse border-b border-slate-200 px-5 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-5 w-32 rounded bg-slate-200" />
                  <div className="h-9 w-28 rounded-xl bg-slate-200" />
                </div>
              </div>
              <div className="flex-1 animate-pulse bg-slate-950/95 p-5">
                <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-4">
                  <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="h-4 rounded bg-slate-800" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-4 rounded bg-slate-800/80"
                        style={{ width: `${70 + (index % 3) * 10}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="animate-pulse border-t border-slate-800 bg-slate-950 px-5 py-4">
                <div className="h-20 rounded-xl bg-slate-900" />
              </div>
            </div>

            <div className="hidden min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white xl:flex">
              <div className="animate-pulse border-b border-slate-200 px-4 py-4">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 animate-pulse p-4">
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-12 rounded-2xl bg-slate-100" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>

      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900">
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
                  onClick={handleCopyRoomCode}
                  className={`rounded-lg p-1.5 transition-all ${
                    isRoomCodeCopied
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  title="Copy Room Code"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="truncate text-sm text-slate-500">
                Room Code: {displayedRoomCode}
                <span className={`ml-2 text-xs font-medium ${isRoomCodeCopied ? "text-emerald-600" : "text-slate-400"}`}>
                  {isRoomCodeCopied ? "Copied" : "Click to copy"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 4).map((user) => (
                  <div
                    key={user.id}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-bold text-white"
                    title={user.name}
                  >
                    {(user.name || "U").slice(0, 1).toUpperCase()}
                  </div>
                ))}
                {activeUsers.length > 4 ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700">
                    +{activeUsers.length - 4}
                  </div>
                ) : null}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{onlineCount} online</p>
                <p className="text-xs text-slate-500">{typingIndicator}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              <span className={`h-2 w-2 rounded-full ${connectionClassName} ${isReconnecting ? "animate-pulse" : ""}`} />
              {connectionLabel}
            </div>
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
              onClick={() => setIsLeaveDialogOpen(true)}
              disabled={isLeaving}
            >
              {isLeaving ? (isCurrentUserHost ? "Deleting..." : "Leaving...") : "Leave Room"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col xl:flex-row">

        <div className="flex min-h-0 flex-1 flex-col bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0B1220] px-4 py-3">
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

          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-4 py-2">
            <div className="flex items-center gap-2">
              {FILE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`rounded-t-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    tab.active
                      ? "border-slate-700 border-b-slate-950 bg-slate-950 text-slate-100"
                      : "border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
                title="Add file"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="hidden items-center gap-2 lg:flex">
                {editorPresence.map((user) => {
                  const colors = getUserColor(user.id);

                  return (
                    <div key={user.id} className="flex items-center gap-1.5 rounded-full bg-slate-900/70 px-2.5 py-1">
                      <span className={`h-2 w-2 rounded-full ${user.activity === "editing" ? "bg-sky-400 animate-pulse" : colors.accent}`} />
                      <span className="text-slate-300">{user.name}</span>
                      <span className="text-slate-500">{user.activity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isEditorTyping ? "bg-sky-400 animate-pulse" : "bg-emerald-400"}`} />
                <span>{isEditorTyping ? "Editing live" : "Synced"}</span>
              </div>
              <span>Ctrl/Cmd + Enter to run</span>
            </div>
          </div>

          <div
            className="flex min-h-0 flex-1 overflow-hidden bg-[#0B1220]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
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

          <div className="border-t border-slate-800 bg-[#0B1220]">
            <button
              type="button"
              onClick={() => setIsOutputExpanded((current) => !current)}
              className="flex w-full items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-3 text-left transition-colors hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Output</span>
                <span className="text-xs text-slate-500">{isOutputExpanded ? "Visible" : "Hidden"}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setExecutionOutput("Run your Python code to see the output here.");
                  }}
                  className="text-slate-500 transition-colors hover:text-slate-200"
                  title="Clear"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${isOutputExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOutputExpanded ? (
              <div
                ref={outputPanelRef}
                className={`max-h-[220px] overflow-auto bg-[#020617] p-4 font-mono text-xs transition-all duration-200 ${
                  outputState === "running" ? "animate-pulse" : ""
                }`}
              >
                <pre
                  className={`whitespace-pre-wrap leading-6 transition-colors duration-200 ${
                    outputState === "error"
                      ? "text-rose-300"
                      : outputState === "running"
                        ? "text-amber-200"
                        : "text-emerald-200"
                  }`}
                >
                  {executionOutput}
                </pre>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={`hidden xl:block w-1 cursor-col-resize transition-colors ${
            isResizeHandleActive ? "bg-sky-300" : "bg-slate-200 hover:bg-sky-200"
          }`}
          onMouseDown={() => {
            isResizingChatRef.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            setIsResizeHandleActive(true);
          }}
        />

        <aside
          className="flex min-h-0 flex-col border-t border-slate-200 bg-white xl:border-l xl:border-t-0"
          style={{ width: typeof window !== "undefined" && window.innerWidth >= 1280 ? `${chatPanelWidth}px` : undefined }}
        >
          <div className="border-b border-slate-200 bg-white px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Participants <span className="text-slate-300">·</span> {onlineCount} active
              </h2>
              <span className="text-xs text-slate-400">{participantList.length} total</span>
            </div>

            <div className="space-y-3">
              {participantList.map((participant) => {
                const colors = getUserColor(participant.id);
                const roleLabel = participant.isCreator ? "Host" : "Participant";

                return (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${colors.avatar}`}>
                      {(participant.name || "U").slice(0, 1).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {participant.name}
                          {participant.isCurrentUser ? " (You)" : ""}
                        </p>
                        {participant.isCreator ? (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                            {roleLabel}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">{roleLabel}</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${getParticipantStatusClassName(participant.status)}`} />
                        <p className="text-xs text-slate-500">{getParticipantStatusLabel(participant)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {participantList.length === 1 ? (
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Waiting for others to join...
              </div>
            ) : null}
          </div>

          <div className="h-px bg-slate-100" />

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-800">Team Chat</span>
            </div>
            <Badge variant="default" size="xs">{messages.length}</Badge>
          </div>

          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              {typingIndicator}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto bg-white p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="max-w-[240px] px-4 py-5">
                    <p className="text-sm font-semibold text-slate-700">Start the room conversation</p>
                    <p className="mt-1 text-xs text-slate-500">Ask a question, share context, or coordinate the next code change.</p>
                  </div>
                </div>
              ) : (
                groupedMessages.map((group) => {
                  const isMe = group.userId === currentUserIdRef.current;

                  return (
                    <div key={group.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[88%] flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 px-1">
                          {!isMe ? (
                            <span className={`text-[11px] font-semibold ${getUserColor(group.userId).name}`}>
                              {getUserName(group.userId)}
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-sky-700">You</span>
                          )}
                          <span className="text-[10px] text-slate-400">{group.lastTime}</span>
                        </div>
                        <div className={`flex flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
                          {group.items.map((msg) => (
                            <div
                              key={msg.id}
                              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-colors ${
                                isMe
                                  ? "bg-slate-900 text-white"
                                  : "border border-slate-200 bg-slate-50 text-slate-800"
                              }`}
                            >
                              {msg.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(chatInput);
                    }
                  }}
                  placeholder="Send a message to the room..."
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
        </aside>
      </div>
      </div>
        </>
      )}
    </div>
  );
}

export default Room;
