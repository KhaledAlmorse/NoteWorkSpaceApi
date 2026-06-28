import express from "express";
import * as authController from "./auth.controller.js";
import validationMiddleware from "../../Middlware/validation.middlware.js";
import {
  LoginValidation,
  RegisterValidation,
  UpdateUserValidation,
} from "./auth.validation.js";
import isAuthenticated from "../../Middlware/authentication.middlware.js";

import multerUpload from "../../Utils/fileUploading/multerCloud.js";
import uploadCloud from "../../Utils/fileUploading/multerCloud.js";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(RegisterValidation),
  authController.Register,
);

router.post(
  "/login",
  validationMiddleware(LoginValidation),
  authController.login,
);

router.get("/me", isAuthenticated, authController.GetMe);

router.patch(
  "/update-me",
  isAuthenticated,
  validationMiddleware(UpdateUserValidation),
  authController.UpdateMe,
);

router.patch(
  "/upload-img",
  isAuthenticated,
  uploadCloud().single("image"),
  authController.UploadImage,
);
export default router;
