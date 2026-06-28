import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import DBConnection from "./DB/dbConnection.js";
import AuthRoutes from "./Modules/Auth/auth.routes.js";
import noteRouter from "./Modules/Notes/note.routes.js";
import { globalErrorHandler } from "./Utils/ErrorHandling/globalErrorHandling.js";
import { notFoundHandler } from "./Utils/ErrorHandling/notFoundHandler.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // max 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const bootstrap = async (app, express) => {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use("/api", limiter);

  app.use(express.json({ limit: "10kb" }));

  app.use(morgan("dev"));

  await DBConnection();
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Note API",
    });
  });
  app.use("/api/v1/auth", AuthRoutes);
  app.use("/api/v1/notes", noteRouter);

  app.all("*name", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
