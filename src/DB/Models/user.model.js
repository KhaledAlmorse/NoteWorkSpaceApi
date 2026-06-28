import mongoose from "mongoose";

export const userRole = {
  ADMIN: "admin",
  USER: "user",
};

export const defaultSecureUrl =
  "https://res.cloudinary.com/dihye61vh/image/upload/v1782651027/defualt_onk4by.png";

export const defaultPublicId = "defualt_onk4by";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User Name Required..."],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Email Required.."],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please Fill a Valid Email Address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password Required..."],
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [userRole.USER, userRole.ADMIN],
      default: userRole.USER,
    },
    image: {
      secure_url: { type: String, default: defaultSecureUrl },
      public_id: { type: String, default: defaultPublicId },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
