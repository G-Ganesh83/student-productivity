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
  
  // Load from localStorage or use dummy data
  const loadRooms = () => {
    const saved = localStorage.getItem("rooms");
    return saved ? JSON.parse(saved) : dummyRooms;
  };

  const [rooms, setRooms] = useState(loadRooms);

  // Save to localStorage whenever rooms change
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: ""
  });
  const [joinRoomId, setJoinRoomId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  const handleCreateRoom = () => {
    const errors = {};
    if (!createFormData.name.trim()) {
      errors.name = "Room name is required";
    }
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      addToast("Please enter a room name", "error");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newRoom = {
        id: `room-${Date.now()}`,
        name: createFormData.name,
        description: createFormData.description,
        participants: 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRooms([...rooms, newRoom]);
      setCreateFormData({ name: "", description: "" });
      setFormErrors({});
      setIsCreateModalOpen(false);
      setIsLoading(false);
      addToast("Room created successfully", "success");
      navigate(`/room/${newRoom.id}`);
    }, 300);
  };
  
  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) {
      addToast("Please enter a room ID", "error");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast("Joining room...", "info");
      navigate(`/room/${joinRoomId}`);
    }, 300);
  };
  
  const handleOpenCreateModal = () => {
    setCreateFormData({ name: "", description: "" });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };
  
  const handleOpenJoinModal = () => {
    setJoinRoomId("");
    setIsJoinModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Collaboration
          </h1>
          <p className="text-lg text-gray-600">Create or join collaboration rooms</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleOpenJoinModal} size="lg">
            Join Room
          </Button>
          <Button onClick={handleOpenCreateModal} size="lg" className="shadow-lg">
            <span className="mr-2">+</span> Create Room
          </Button>
        </div>
      </div>
      
      {/* Empty State */}
      {rooms.length === 0 ? (
        <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
          <div className="text-center py-16">
            <div className="text-7xl mb-6">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No collaboration rooms yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Create your first room to start collaborating</p>
            <Button onClick={handleOpenCreateModal} size="lg">
              Create Your First Room
            </Button>
          </div>
        </Card>
      ) : (
        /* Rooms Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
          <Card
            key={room.id}
            onClick={() => navigate(`/room/${room.id}`)}
            variant="gradient"
            className="bg-gradient-to-br from-white to-purple-50/30 border-0 hover-lift cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors flex-1 pr-2">
                  {room.name}
                </h3>
                <Badge variant="primary" className="shadow-sm">
                  {room.participants} members
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{room.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500">
                  📅 {new Date(room.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(room.id);
                      addToast("Room ID copied to clipboard", "success");
                    }}
                    title="Copy Room ID"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    📋
                  </button>
                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/room/${room.id}`);
                  }}>
                    Enter →
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          ))}
        </div>
      )}
      
      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormErrors({});
        }}
        title="Create New Room"
      >
        <div className="space-y-4">
          <Input
            label="Room Name"
            value={createFormData.name}
            onChange={(e) => {
              setCreateFormData({ ...createFormData, name: e.target.value });
              if (formErrors.name) {
                setFormErrors({ ...formErrors, name: "" });
              }
            }}
            placeholder="Enter room name"
            error={formErrors.name}
            required
          />
          
          <Textarea
            label="Description"
            value={createFormData.description}
            onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
            placeholder="Enter room description (optional)"
            rows={3}
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setFormErrors({});
            }} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Join Room Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join Room"
      >
        <div className="space-y-4">
          <Input
            label="Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            placeholder="Enter room ID"
            required
          />
          
          <p className="text-sm text-gray-600">
            Ask your team member for the room ID to join their collaboration session.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsJoinModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleJoinRoom} disabled={isLoading}>
              {isLoading ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Collaboration;

