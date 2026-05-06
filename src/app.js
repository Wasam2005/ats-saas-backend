import express from 'express';
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import candidateRoutes from "./routes/candidate.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);

export default app;