import asyncHandler from "express-async-handler";
import * as noteService from "./note.service.js";
import ApiError from "../../Utils/ErrorHandling/ApiError.js";

export const GetAllNotes = asyncHandler(async (req, res) => {
  const { notes, pagination } = await noteService.GetAllNotes(
    req.user.id,
    req.query,
  );

  res.status(200).json({
    success: true,
    pagination,
    notes,
  });
});

export const GetNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.GetNoteById(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    note,
  });
});

export const CreateNote = asyncHandler(async (req, res) => {
  const note = await noteService.CreateNote(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Note created successfully.",
    note,
  });
});

export const UpdateNote = asyncHandler(async (req, res) => {
  const note = await noteService.UpdateNote(
    req.params.id,
    req.user.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Note updated successfully.",
    note,
  });
});

export const DeleteNote = asyncHandler(async (req, res) => {
  await noteService.DeleteNote(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Note deleted successfully.",
  });
});
