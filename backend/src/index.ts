import express, {
  type ErrorRequestHandler,
  type Express,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { config } from "./config.js";
import { seedIfEmpty } from "./seed.js";
import apiRouter from "./routes/api.js";

seedIfEmpty();

const app: Express = express();
app.use(
  cors({
    origin: [...config.corsOrigins],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "nexus-crm-backend",
    runtime: "express-typescript",
    language: "TypeScript",
    version: "1.0.0",
  });
});

app.use("/api/v1", apiRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ detail: "Internal server error" });
};
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Nexus CRM TypeScript API running on http://127.0.0.1:${config.port}`);
  console.log(`Health: http://127.0.0.1:${config.port}/health`);
  console.log(`Features: http://127.0.0.1:${config.port}/api/v1/modules/features`);
});
