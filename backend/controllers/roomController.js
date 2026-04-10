import Room from '../models/Room.js';

const generateRoomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let index = 0; index < 6; index += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

const isRoomMember = (room, userId) =>
  room.members.some((memberId) => memberId.toString() === userId.toString());

const createUniqueRoomCode = async () => {
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    code = generateRoomCode();
    const existingRoom = await Room.findOne({ code });

    if (!existingRoom) {
      isUnique = true;
    }
  }

  return code;
};

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Room name is required',
      });
    }

    const code = await createUniqueRoomCode();

    const room = await Room.create({
      name,
      code,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Room code is required',
      });
    }

    const room = await Room.findOne({ code: code.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (isRoomMember(room, req.user._id)) {
      return res.status(200).json({
        success: true,
        message: 'User already in room',
        data: room,
      });
    }

    room.members.addToSet(req.user._id);
    await room.save();

    return res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const isMember = room.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await room.populate('createdBy', 'name email');
    await room.populate('members', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Room fetched successfully',
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required',
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (!isRoomMember(room, req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is not in this room',
      });
    }

    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await room.save();

    return res.status(200).json({
      success: true,
      message: 'Left room successfully',
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only creator can delete',
      });
    }

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
