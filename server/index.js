import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const ADDITIONAL_CLIENT_ORIGIN =
  process.env.ADDITIONAL_CLIENT_ORIGIN || "http://127.0.0.1:5173";

app.use(
  cors({
    origin: [CLIENT_ORIGIN, ADDITIONAL_CLIENT_ORIGIN],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "online",
    codename: "Operation Streetlight",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", reportRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`311 Conspiracy Tracker API listening on port ${PORT}`);
});
