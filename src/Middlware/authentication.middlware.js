import User from "../DB/Models/user.model.js";
import ApiError from "../Utils/ErrorHandling/ApiError.js";
import { verifyToken } from "../Utils/token/token.js";

const isAuthenticated = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(
      new ApiError("Token must be provided and start with 'Bearer'", 401),
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  const decoded = verifyToken({ token });

  const { id } = decoded;

  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (!user.isLogin) {
    return next(new ApiError("User is not logged in ,please login first", 401));
  }

  req.user = user;

  next();
};
export default isAuthenticated;
