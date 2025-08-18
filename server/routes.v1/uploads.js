// routes.v1/uploads.js
import axios from "axios";
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// --- 이미지 업로드 저장소 ---
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads/images");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".png");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

// --- 비디오 업로드 저장소 ---
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads/videos");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".mp4");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

// 이미지 업로드: POST /api/v1/uploads/images (form-data, key = "file")
router.post("/images", uploadImage.single("file"), (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: { code: "NO_FILE" } });
  res.json({
    url: `/uploads/images/${f.filename}`,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  });
});

// 비디오 업로드: POST /api/v1/uploads/videos (form-data, key = "file")
router.post("/videos", uploadVideo.single("file"), (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: { code: "NO_FILE" } });
  res.json({
    url: `/uploads/videos/${f.filename}`,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  });
});

// AI 이미지 생성 → 로컬 저장: POST /api/v1/uploads/ai-image (JSON {prompt, size?})
router.post("/ai-image", async (req, res) => {
  try {
    const { prompt = "", size = "1024x1024" } = req.body || {};
    if (!prompt.trim()) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "prompt is required" } });
    }

    // Azure OpenAI 설정
    const endpoint   = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/+$/, "");
    const apiKey     = process.env.AZURE_OPENAI_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-01";
    const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT; // 예: my-dall-e-3

    if (!endpoint || !apiKey || !deployment) {
      return res.status(500).json({ error: { code: "NO_AZURE_CONFIG" } });
    }

    // 1) 생성 요청 submit
    const submitUrl = `${endpoint}/openai/deployments/${deployment}/images/generations:submit?api-version=${apiVersion}`;
    const submitResp = await axios.post(
      submitUrl,
      { prompt, size, n: 1 },
      { headers: { "api-key": apiKey, "Content-Type": "application/json" }, timeout: 60_000 }
    );

    // 2) 폴링
    let result = submitResp.data?.result;
    let opId = submitResp.data?.id;
    if (!result && opId) {
      const opUrl = `${endpoint}/openai/operations/${opId}?api-version=${apiVersion}`;
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const opResp = await axios.get(opUrl, { headers: { "api-key": apiKey }, timeout: 30_000 });
        const status = opResp.data?.status;
        if (status === "succeeded") { result = opResp.data?.result; break; }
        if (status === "failed" || status === "cancelled") {
          return res.status(502).json({ error: { code: "AZURE_IMAGE_FAILED", detail: opResp.data } });
        }
      }
      if (!result) return res.status(504).json({ error: { code: "AZURE_IMAGE_TIMEOUT" } });
    }

    const first = result?.data?.[0];
    if (!first) return res.status(500).json({ error: { code: "IMAGE_EMPTY" } });

    // 3) 바이트 얻기
    let buffer; let ext = ".png";
    if (first.url) {
      const imgResp = await axios.get(first.url, { responseType: "arraybuffer", timeout: 60_000 });
      buffer = Buffer.from(imgResp.data);
      const ct = imgResp.headers["content-type"] || "";
      if (ct.includes("jpeg")) ext = ".jpg";
      else if (ct.includes("webp")) ext = ".webp";
    } else if (first.b64_json) {
      buffer = Buffer.from(first.b64_json, "base64");
    } else {
      return res.status(500).json({ error: { code: "IMAGE_FORMAT_UNKNOWN" } });
    }

    // 4) 저장
    const dir = path.join(process.cwd(), "uploads/images");
    ensureDir(dir);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    fs.writeFileSync(path.join(dir, filename), buffer);

    // 5) URL 반환
    res.json({ url: `/uploads/images/${filename}`, filename, size: buffer.length, prompt });
  } catch (e) {
    console.error("[AI_IMAGE]", e?.response?.data || e.message);
    res.status(500).json({ error: { code: "AI_IMAGE_UPLOAD_FAILED" } });
  }
});

export default router;
