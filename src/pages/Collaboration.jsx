import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import ToastContainer from "../components/ToastContainer";
import { createRoom, getApiErrorMessage, joinRoom } from "../api/roomApi";

function Collaboration() {
  const navigate = useNavigate();
  const nextIdRef = useRef(0);

  const getNextId = () => {
    nextIdRef.current += 1;
    return nextIdRef.current;
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const addToast = (message, type = "success") => {
    const id = getNextId();
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const openCreate = () => {
    setCreateForm({ name: "", description: "" });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const openJoin = () => {
    setJoinCode("");
    setFormErrors({});
    setIsJoinOpen(true);
  };

  const handleCreateRoom = async () => {
    const trimmedName = createForm.name.trim();
    const errs = {};

    if (!trimmedName) {
      errs.name = "Room name is required";
    }

    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      addToast("Please enter a room name", "error");
      return;
    }

    setIsCreating(true);

    try {
      setError("");
      const room = await createRoom({ name: trimmedName });
      const roomId = room?._id;

      if (!roomId) {
        throw new Error("Room ID was not returned by the server.");
      }

      setCreateForm({ name: "", description: "" });
      setIsCreateOpen(false);
      setFormErrors({});
      addToast("Room created successfully", "success");
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log(error.response);
      const message = getApiErrorMessage(
        error,
        "Unable to create the room right now. Please try again."
      );

      setError(message);
      setFormErrors({ name: message });
      addToast(message, "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    const trimmedCode = joinCode.trim().toUpperCase();

    if (!trimmedCode) {
      setFormErrors({ code: "Room code is required" });
      addToast("Please enter a room code", "error");
      return;
    }

    setFormErrors({});
    setIsJoining(true);

    try {
      setError("");
      const room = await joinRoom({ code: trimmedCode });
      const roomId = room?._id;

      if (!roomId) {
        throw new Error("Room ID was not returned by the server.");
      }

      setIsJoinOpen(false);
      setJoinCode("");
      addToast("Joined room successfully", "success");
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log(error.response);
      const message =
        error?.response?.status === 404
          ? "Invalid room code. Please check the code and try again."
          : getApiErrorMessage(
              error,
              "Unable to join the room right now. Please try again."
            );

      setError(message);
      setFormErrors({ code: message });
      addToast(message, "error");
    } finally {
      setIsJoining(false);
    }
  };

  const isCreateDisabled = isCreating || !createForm.name.trim();
  const isJoinDisabled = isJoining || !joinCode.trim();

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ─── Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Collaboration</h1>
          <p className="text-slate-500 text-sm mt-1">Create or join rooms to code together</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={openJoin}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Join Room
          </Button>
          <Button onClick={openCreate}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
        {error && (
          <Card variant="subtle" padding="md" className="xl:col-span-2 border border-red-200 bg-red-50">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </Card>
        )}

        <Card variant="brand" padding="lg">
          <div className="py-2">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-5 shadow-button">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Start a collaboration room</h2>
            <p className="text-slate-600 text-sm leading-6 max-w-xl">
              Create a fresh room for your team or join an existing one with a room code.
              After entry, the app navigates using the room&apos;s MongoDB `_id`.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={openCreate}>Create Room</Button>
              <Button variant="secondary" onClick={openJoin}>Join Room</Button>
            </div>
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Room entry flow</h3>
              <p className="text-sm text-slate-500 mt-1">
                Use the room name to create. Use the room code only to join.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Create Room</p>
                <p className="text-xs text-slate-500 mt-1">
                  Sends <code>POST /api/rooms/create</code> with <code>{`{ name }`}</code> and
                  navigates to <code>/room/:id</code>.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Join Room</p>
                <p className="text-xs text-slate-500 mt-1">
                  Sends <code>POST /api/rooms/join</code> with <code>{`{ code }`}</code> and then
                  uses <code>room._id</code> for navigation.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Create Modal ─────────────────────── */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setFormErrors({}); }}
        title="Create New Room"
        description="Set up a collaboration space for your team"
      >
        <div className="space-y-4">
          <Input
            label="Room Name"
            value={createForm.name}
            onChange={(e) => {
              setCreateForm({ ...createForm, name: e.target.value });
              if (formErrors.name) {
                setFormErrors((prev) => ({ ...prev, name: "" }));
              }
            }}
            placeholder="e.g. CS Project Group"
            error={formErrors.name}
            required
          />
          <Textarea
            label="Description"
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            placeholder="What's this room for? (optional)"
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateOpen(false);
                setFormErrors({});
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} disabled={isCreateDisabled}>
              {isCreating ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Join Modal ───────────────────────── */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => {
          setIsJoinOpen(false);
          setFormErrors({});
        }}
        title="Join Room"
        description="Enter a room code to join an existing collaboration session"
      >
        <div className="space-y-4">
          <Input
            label="Room Code"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase());
              if (formErrors.code) {
                setFormErrors((prev) => ({ ...prev, code: "" }));
              }
            }}
            placeholder="e.g. A1B2C3"
            hint="Ask a team member to share the 6-character room code"
            error={formErrors.code}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsJoinOpen(false);
                setFormErrors({});
              }}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button onClick={handleJoinRoom} disabled={isJoinDisabled}>
              {isJoining ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Collaboration;
