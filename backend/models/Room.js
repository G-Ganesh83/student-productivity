import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    // Stores the last 50 chat messages for late-joining participants
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


roomSchema.pre('validate', function syncCreatorFields() {
  if (!this.creator && this.createdBy) {
    this.creator = this.createdBy;
  }

  if (!this.createdBy && this.creator) {
    this.createdBy = this.creator;
  }

  if (!Array.isArray(this.members)) {
    this.members = [];
  }

  if (
    this.creator &&
    !this.members.some((memberId) => memberId.toString() === this.creator.toString())
  ) {
    this.members.push(this.creator);
  }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
