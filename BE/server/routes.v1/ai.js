// routes.v1/ai.js
import { Router } from "express";
import axios from "axios";
import crypto from "crypto";

const router = Router();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

router.post("/promotions", async (req, res) => {
  const t0 = Date.now();
  try {
    // 0) env 체크
    const endpoint   = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/+$/,"");
    const apiKey     = process.env.AZURE_OPENAI_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-01";
    const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT;
    if (!endpoint || !apiKey || !deployment) {
      return res.status(401).json({ error: { code: "NO_AZURE_CONFIG", message: "Azure env not set" }});
    }

    // 1) 입력
    let { prompt = "", size = "1024x1024" } = req.body ?? {};
    prompt = String(prompt).trim().slice(0, 1500); // 과도한 길이 컷
    const ALLOWED_SIZES = new Set(["1024x1024","512x512","256x256"]);
    if (!prompt) return res.status(400).json({ error: { code:"BAD_REQUEST", message:"prompt is required" }});
    if (!ALLOWED_SIZES.has(size)) size = "1024x1024";

    // 2) 비동기 제출
    const submitUrl = `${endpoint}/openai/deployments/${deployment}/images/generations:submit?api-version=${apiVersion}`;
    const submitBody = {
      prompt: `${prompt}\n(밝고 친근함, 굵은 한글 타이포, 상업용 포스터 스타일)`,
      size,
      n: 1
    };

    const submitResp = await axios.post(submitUrl, submitBody, {
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      timeout: 60_000,
      validateStatus: () => true, // 상태코드 수동 처리
    });
    if (submitResp.status >= 400) {
      throw new Error(`submit failed: ${submitResp.status}`);
    }

    // 3) 결과/폴링
    let result = submitResp.data?.result;
    let opId   = submitResp.data?.id;

    if (!result && opId) {
      const opUrl = `${endpoint}/openai/operations/${opId}?api-version=${apiVersion}`;
      let succeeded = false;
      for (let i = 0; i < 20; i++) {  // ~30초
        await sleep(1500);
        const opResp = await axios.get(opUrl, { headers: { "api-key": apiKey }, timeout: 30_000 });
        const status = opResp.data?.status;
        if (status === "succeeded") {
          result = opResp.data?.result;
          succeeded = true;
          break;
        }
        if (status === "failed" || status === "cancelled") {
          throw new Error(`Azure image operation ${status}`);
        }
      }
      if (!succeeded) throw new Error("Azure image operation timeout");
    }

    const first = result?.data?.[0];
    if (!first) return res.status(500).json({ error: { code:"IMAGE_EMPTY", message:"no image returned" }});

    const imageUrl = first.url
      ? first.url
      : first.b64_json
        ? `data:image/png;base64,${first.b64_json}`
        : null;

    if (!imageUrl) return res.status(500).json({ error: { code:"IMAGE_FORMAT_UNKNOWN" }});

    return res.json({
      imageUrl,                 // ← 이름 통일
      provider: "azure-openai",
      deployment,
      request_id: crypto.randomUUID(),
      duration_ms: Date.now() - t0,
    });

  } catch (e) {
    const status = e?.response?.status || e?.status;
    const detail = e?.response?.data || e?.message || String(e);
    console.error("Azure OpenAI image error:", status, detail);
    return res.status(500).json({
      error: { code: "IMAGE_GEN_FAILED", message: "image generation failed", status }
    });
  }
});

export default router;
