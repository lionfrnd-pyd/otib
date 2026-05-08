import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "otib.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const seedPosts = [
  {
    title: "접이식 의자 2개",
    category: "가구",
    price: 18000,
    floor: "8F",
    pickupSpot: "8층 엘리베이터 앞",
    seller: "디자인팀 민수",
    status: "available",
    description: "회의실 정리하면서 나온 제품입니다. 사용감 적고 바로 거래 가능해요.",
  },
  {
    title: "유선 기계식 키보드",
    category: "전자기기",
    price: 35000,
    floor: "12F",
    pickupSpot: "12층 카페 라운지",
    seller: "개발팀 지연",
    status: "reserved",
    description: "청축이라 타건감 좋아요. 점심시간 직거래 선호합니다.",
  },
  {
    title: "텀블러 500ml",
    category: "생활",
    price: 5000,
    floor: "5F",
    pickupSpot: "5층 출입게이트",
    seller: "재무팀 혜린",
    status: "available",
    description: "새 제품이고 색상은 아이보리입니다.",
  },
];

function timeAgoFromIso(isoString) {
  const createdAt = new Date(isoString).getTime();
  const diffSec = Math.max(1, Math.floor((Date.now() - createdAt) / 1000));

  if (diffSec < 60) {
    return "방금 전";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour}시간 전`;
  }

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
}

function normalizePost(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: row.price,
    floor: row.floor,
    pickupSpot: row.pickup_spot,
    seller: row.seller,
    status: row.status,
    postedAt: timeAgoFromIso(row.created_at),
    description: row.description,
  };
}

function createDb() {
  const db = new DatabaseSync(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      floor TEXT NOT NULL,
      pickup_spot TEXT NOT NULL,
      seller TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      description TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const countRow = db.prepare("SELECT COUNT(*) AS count FROM posts").get();
  if (countRow.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO posts (title, category, price, floor, pickup_spot, seller, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const post of seedPosts) {
      insertStmt.run(
        post.title,
        post.category,
        post.price,
        post.floor,
        post.pickupSpot,
        post.seller,
        post.status,
        post.description
      );
    }
  }

  return db;
}

const db = createDb();
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length === 0 ? true : allowedOrigins,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ service: "otib-api", ok: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, storage: "sqlite" });
});

app.get("/api/posts", (_req, res) => {
  const rows = db
    .prepare(`
    SELECT id, title, category, price, floor, pickup_spot, seller, status, description, created_at
    FROM posts
    ORDER BY datetime(created_at) DESC, id DESC
  `)
    .all();

  res.json(rows.map(normalizePost));
});

app.post("/api/posts", (req, res) => {
  const { title, category, price, floor, pickupSpot, seller, description } = req.body;

  if (!title || !category || !floor || !pickupSpot || !seller || !description) {
    return res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ message: "가격 형식이 올바르지 않습니다." });
  }

  const result = db
    .prepare(
    `
      INSERT INTO posts (title, category, price, floor, pickup_spot, seller, status, description)
      VALUES (?, ?, ?, ?, ?, ?, 'available', ?)
    `
    )
    .run(title, category, numericPrice, floor, pickupSpot, seller, description);

  const row = db
    .prepare(`
      SELECT id, title, category, price, floor, pickup_spot, seller, status, description, created_at
      FROM posts
      WHERE id = ?
    `)
    .get(result.lastInsertRowid);

  return res.status(201).json(normalizePost(row));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`OTIB API server running on http://localhost:${PORT}`);
});
