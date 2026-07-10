import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { seedIfEmpty } from "./seed.js";
import apiRouter from "./routes/api.js";

seedIfEmpty();

const app = express();
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "nexus-crm-backend",
    runtime: "express-node",
    version: "1.0.0",
  });
});

app.use("/api/v1", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ detail: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Nexus CRM Express API running on http://127.0.0.1:${config.port}`);
  console.log(`Health: http://127.0.0.1:${config.port}/health`);
  console.log(`Features: http://127.0.0.1:${config.port}/api/v1/modules/features`);
});
