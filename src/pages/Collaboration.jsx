import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Badge from "../components/Badge";
import ToastContainer from "../components/ToastContainer";
import { dummyRooms } from "../data/dummyData";

function Collaboration() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("rooms");
    return saved ? JSON.parse(saved) : dummyRooms;
  });

  useEffect(() => { localStorage.setItem("rooms", JSON.stringify(rooms)); }, [rooms]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinId, setJoinId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const openCreate = () => { setCreateForm({ name: "", description: "" }); setFormErrors({}); setIsCreateOpen(true); };
  const openJoin = () => { setJoinId(""); setIsJoinOpen(true); };

  const handleCreate = () => {
    const errs = {};
    if (!createForm.name.trim()) errs.name = "Room name is required";
    setFormErrors(errs);
    if (Object.keys(errs).length) return addToast("Please enter a room name", "error");

    setIsLoading(true);
    setTimeout(() => {
      const room = {
        id: `room-${Date.now()}`,
        name: createForm.name,
        description: createForm.description,
        participants: 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRooms((p) => [room, ...p]);
      setCreateForm({ name: "", description: "" });
      setIsCreateOpen(false);
      setIsLoading(false);
      addToast("Room created!", "success");
      navigate(`/room/${room.id}`);
    }, 300);
  };

  const handleJoin = () => {
    if (!joinId.trim()) return addToast("Please enter a room ID", "error");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/room/${joinId}`);
    }, 300);
  };

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

      {/* ─── Empty State ─────────────────────── */}
      {rooms.length === 0 ? (
        <Card variant="brand" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-5 shadow-button">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No rooms yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Create your first collaboration room and invite your team</p>
            <Button onClick={openCreate} size="lg">Create Your First Room</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <Card
              key={room.id}
              variant="default"
              padding="none"
              onClick={() => navigate(`/room/${room.id}`)}
              className="group overflow-hidden cursor-pointer"
            >
              {/* Accent top bar */}
              <div className="h-1 w-full gradient-brand" />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex-1 pr-3 leading-snug">
                    {room.name}
                  </h3>
                  <Badge variant="primary" dot size="sm" className="flex-shrink-0">
                    {room.participants} member{room.participants !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {room.description && (
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{room.description}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(room.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { navigator.clipboard.writeText(room.id); addToast("Room ID copied", "success"); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                      title="Copy Room ID"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="px-3 py-1.5 text-xs font-bold gradient-brand text-white rounded-lg shadow-button hover:shadow-button-hover transition-all hover:-translate-y-0.5"
                    >
                      Enter →
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
            onChange={(e) => { setCreateForm({ ...createForm, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }}
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
            <Button variant="secondary" onClick={() => { setIsCreateOpen(false); setFormErrors({}); }} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Creating…" : "Create Room"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Join Modal ───────────────────────── */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        title="Join Room"
        description="Enter a room ID to join an existing collaboration session"
      >
        <div className="space-y-4">
          <Input
            label="Room ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="e.g. room-1700000000000"
            hint="Ask a team member to share the room ID with you"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsJoinOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleJoin} disabled={isLoading}>
              {isLoading ? "Joining…" : "Join Room"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Collaboration;
