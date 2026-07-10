import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Database } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "db.json");

function emptyDb(): Database {
  return {
    organizations: [],
    users: [],
    leads: [],
    deals: [],
    contacts: [],
    companies: [],
    tasks: [],
    activities: [],
    notifications: [],
    automations: [],
    pipelineStages: [],
    pipelinePreferences: {
      viewMode: "board",
      compactCards: false,
      showProbability: true,
      showCloseDate: true,
      showTags: true,
      defaultSort: "value",
    },
    auditLogs: [],
  };
}

function ensureStore(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyDb(), null, 2));
  }
}

export function readDb(): Database {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Database;
}

export function writeDb(db: Database): void {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

export function updateDb(mutator: (db: Database) => void): Database {
  const db = readDb();
  mutator(db);
  writeDb(db);
  return db;
}
