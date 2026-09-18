import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['link', 'pdf'],
      default: 'link',
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      maxlength: 2000,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
