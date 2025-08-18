// routes.ai.js
import { Router } from "express";
import OpenAI from "openai";

const router = Router();

/**
 * 1) 글 아이디어/카피 생성
 * POST /ai/insight
 * body: { prompt: string }
 * res: { text: string }
 */
router.post("/insight", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: "missing OPENAI_API_KEY" });
    }
    const { prompt = "" } = req.body ?? {};
    if (!prompt.trim()) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 가벼운 모델로 카피/문구 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "너는 한국어 마케팅 카피라이터야. 문장은 짧고 임팩트 있게, 5~7가지 버전으로 제안해.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "문구를 만들지 못했어요. 프롬프트를 바꿔보세요.";

    return res.json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "insight failed" });
  }
});

/**
 * 2) 홍보 이미지 생성
 * POST /ai/promo/generate
 * body: { prompt: string, size?: "512x512" | "768x768" | "1024x1024" }
 * res: { image: string }  // data:image/png;base64,... 형태
 */
router.post("/promo/generate", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: "missing OPENAI_API_KEY" });
    }
    const { prompt = "", size = "1024x1024" } = req.body ?? {};
    if (!prompt.trim()) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 이미지 생성 (OpenAI 공식 이미지 모델)
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size, // "1024x1024" 권장
      // background: "transparent", // 필요하면 주석 해제
    });

    const b64 = img.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ error: "no image returned" });
    }

    // RN에서 바로 보여줄 수 있게 data URL로 반환
    return res.json({ image: `data:image/png;base64,${b64}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "image generation failed" });
  }
});

/**
 * 3) (옵션) 업스케일/수정용 엔드포인트가 필요하면 여기에 추가
 * - 이미지 편집(edit) / 변형(variation)도 gpt-image-1로 가능
 */

export default router;
