import cloudinary from "../../Utils/fileUploading/cloudinary.config.js";
import * as authService from "./auth.service.js";
import asyncHandler from "express-async-handler";
import fs from "fs";

export const Register = asyncHandler(async (req, res) => {
  const userData = req.body;
  const { user, token } = await authService.RegisterService(userData);
  res.status(201).json({ success: true, user, token });
});

export const login = asyncHandler(async (req, res) => {
  const userData = req.body;
  const { user, token } = await authService.loginService(userData);
  res.status(200).json({ success: true, user, token });
});

export const GetMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await authService.GetUser(userId);
  res.status(200).json({ success: true, user });
});

export const UpdateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;
  const updatedUser = await authService.UpdateUser(userId, updateData);
  res.status(200).json({ success: true, user: updatedUser });
});

export const UploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("Image is required.", 400));
  }

  const updatedUser = await authService.UploadUserImage(req.user.id, req.file);

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully.",
    user: updatedUser,
  });
});
