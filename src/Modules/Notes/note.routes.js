import express from "express";
import * as noteController from "./note.controller.js";
import validationMiddleware from "../../Middlware/validation.middlware.js";
import {
  CreateNoteValidation,
  UpdateNoteValidation,
} from "./note.validation.js";
import isAuthenticated from "../../Middlware/authentication.middlware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", noteController.GetAllNotes);
router.get("/:id", noteController.GetNoteById);
router.post(
  "/",
  validationMiddleware(CreateNoteValidation),
  noteController.CreateNote,
);
router.patch(
  "/:id",
  validationMiddleware(UpdateNoteValidation),
  noteController.UpdateNote,
);
router.delete("/:id", noteController.DeleteNote);

export default router;
