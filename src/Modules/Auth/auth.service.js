import ApiError from "../../Utils/ErrorHandling/ApiError.js";
import User from "../../DB/Models/user.model.js";
import { generateToken } from "../../Utils/token/token.js";
import { compareHash, hash } from "../../Utils/hashing/hash.js";
import cloudinary from "../../Utils/fileUploading/cloudinary.config.js";
import { Readable } from "stream";

export const RegisterService = async (userData) => {
  const { password } = userData;
  const hashedPassword = hash({ plainText: password });

  const user = await User.create({ ...userData, password: hashedPassword });
  if (!user) throw new ApiError("User Not Created", 400);

  const token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.JWT_EXPIRES_IN },
  });
  return { user, token };
};

export const loginService = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid Email or Password", 401);

  const isMatch = compareHash({ plainText: password, hash: user.password });
  if (!isMatch) throw new ApiError("Invalid Email or Password", 401);

  user.isLogin = true;
  await user.save();

  const token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.JWT_EXPIRES_IN },
  });
  return { user, token };
};

export const GetUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User Not Found", 404);

  return user;
};

export const UpdateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    runValidators: true,
    new: true,
  });
  if (!user) throw new ApiError("User Not Found", 404);

  return user;
};

export const UploadUserImage = async (userId, file) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  // Delete old image from Cloudinary if exists
  if (user.image?.public_id) {
    await cloudinary.uploader.destroy(user.image.public_id);
  }

  // Upload buffer to Cloudinary via stream
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `SmartNotes_WorkSpace/users/${userId}` },
      (error, result) => {
        if (error) reject(new ApiError(error.message, 500));
        else resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

  user.image = {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };

  await user.save();

  return user;
};
