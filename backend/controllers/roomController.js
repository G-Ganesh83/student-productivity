import mongoose from 'mongoose';

import Room from '../models/Room.js';

const getAuthenticatedUserId = (req) => req.user?._id || null;

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

const getRoomCreatorId = (room) => room.creator || room.createdBy || null;

const ensureRoomMembership = (room, userId) => {
  if (!Array.isArray(room.members)) {
    room.members = [];
  }

  if (isRoomMember(room, userId)) {
    return false;
  }

  room.members.push(userId);
  return true;
};

const ensureRoomOwnership = async (room) => {
  let hasChanges = false;
  const creatorId = getRoomCreatorId(room);

  if (creatorId && !room.creator) {
    room.creator = creatorId;
    hasChanges = true;
  }

  if (creatorId && !room.createdBy) {
    room.createdBy = creatorId;
    hasChanges = true;
  }

  if (creatorId && ensureRoomMembership(room, creatorId)) {
    hasChanges = true;
  }

  if (hasChanges) {
    await room.save();
  }

  return room;
};

const getPopulatedRoom = async (roomId) =>
  Room.findById(roomId)
    .populate('creator', 'name email')
    .populate('createdBy', 'name email')
    .populate('members', 'name email');

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
    const userId = getAuthenticatedUserId(req);
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

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
      creator: userId,
      createdBy: userId,
      members: [userId],
    });

    const populatedRoom = await getPopulatedRoom(room._id);

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: populatedRoom,
    });
  } catch (error) {
    console.error('createRoom error:', {
      error,
      hasUser: Boolean(req.user),
      userId: req.user?._id || null,
      body: req.body,
      params: req.params,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const rooms = await Room.find({
      members: userId,
    });

    await Promise.all(rooms.map((room) => ensureRoomOwnership(room)));

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error('getUserRooms error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

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

    await ensureRoomOwnership(room);

    if (isRoomMember(room, userId)) {
      const populatedRoom = await getPopulatedRoom(room._id);

      return res.status(200).json({
        success: true,
        message: 'User already in room',
        data: populatedRoom,
      });
    }

    ensureRoomMembership(room, userId);
    await room.save();
    const populatedRoom = await getPopulatedRoom(room._id);

    return res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: populatedRoom,
    });
  } catch (error) {
    console.error('joinRoom error:', {
      error,
      hasUser: Boolean(req.user),
      userId: req.user?._id || null,
      body: req.body,
      params: req.params,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    await ensureRoomOwnership(room);

    const isMember = room.members.some(
      (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please rejoin the room.',
      });
    }

    const populatedRoom = await getPopulatedRoom(room._id);

    return res.status(200).json({
      success: true,
      message: 'Room fetched successfully',
      data: populatedRoom,
    });
  } catch (error) {
    console.error('getRoomDetails error:', {
      error,
      hasUser: Boolean(req.user),
      userId: req.user?._id || null,
      body: req.body,
      params: req.params,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const roomId = req.params.id || req.body.roomId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    await ensureRoomOwnership(room);

    if (!isRoomMember(room, req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is not in this room',
      });
    }

    const creatorId = getRoomCreatorId(room);
    const isCreator = creatorId?.toString() === req.user._id.toString();

    if (isCreator) {
      await room.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Room deleted',
        deleted: true,
        left: false,
        data: null,
      });
    }

    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await room.save();

    return res.status(200).json({
      success: true,
      message: 'You left the room',
      deleted: false,
      left: true,
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    await ensureRoomOwnership(room);

    const creatorId = getRoomCreatorId(room);

    if (creatorId?.toString() !== req.user._id.toString()) {
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
