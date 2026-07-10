import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "db.json");

function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        {
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
        },
        null,
        2,
      ),
    );
  }
}

export function readDb() {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export function writeDb(db) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

export function updateDb(mutator) {
  const db = readDb();
  const next = mutator(db) || db;
  writeDb(next);
  return next;
}
