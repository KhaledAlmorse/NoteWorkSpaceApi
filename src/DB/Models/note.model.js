import mongoose from "mongoose";

export const noteCategory = {
  PERSONAL: "personal",
  WORK: "work",
  STUDY: "study",
  OTHER: "other",
};
export const noteStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
};

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(noteCategory),
      default: noteCategory.OTHER,
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(noteStatus),
      default: noteStatus.ACTIVE,
    },
    isPinned: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
