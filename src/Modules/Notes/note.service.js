import Note from "../../DB/Models/note.model.js";
import ApiError from "../../Utils/ErrorHandling/ApiError.js";

export const GetAllNotes = async (userId, query) => {
  const {
    search,
    category,
    status,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filter = { userId };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category) filter.category = category;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ isPinned: -1, [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Note.countDocuments(filter),
  ]);

  return {
    notes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const GetNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new ApiError("Note not found.", 404);
  return note;
};

export const CreateNote = async (userId, noteData) => {
  const note = await Note.create({ ...noteData, userId });
  if (!note) throw new ApiError("Note not created.", 400);
  return note;
};

export const UpdateNote = async (noteId, userId, noteData) => {
  const note = await Note.findById(noteId);
  if (!note) throw new ApiError("Note not found.", 404);

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found.", 404);

  if (note.userId.toString() !== userId.toString()) {
    throw new ApiError("You are not authorized to update this note.", 403);
  }

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    noteData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedNote) throw new ApiError("Note not found.", 404);
  return updatedNote;
};

export const DeleteNote = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  if (!note) throw new ApiError("Note not found.", 404);

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found.", 404);

  if (note.userId.toString() !== userId.toString()) {
    throw new ApiError("You are not authorized to update this note.", 403);
  }

  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!deletedNote) throw new ApiError("Note not found.", 404);
  return deletedNote;
};
