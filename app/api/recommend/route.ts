import { z } from "zod";
import { aiEnabled, recommendWithAI } from "@/lib/ai";
import { contextChips, recommendByRules } from "@/lib/rules";
import { safetyReasons } from "@/lib/safety";
import type { Answers, Recommendation } from "@/lib/types";

export const maxDuration = 30;

const AnswersSchema = z.object({
  concerns: z.array(z.enum(["tone", "lines", "acne", "volume", "hair", "other"])).min(1).max(2),
  details: z.string().max(300).default(""),
  downtime: z.enum(["none", "few", "week"]),
  budget: z.enum(["under5", "5to15", "over15", "unsure"]),
  safety: z.array(z.enum(["pregnant", "recent", "infection", "isotretinoin", "none"])).min(1),
});

export async function POST(req: Request) {
  const parsed = AnswersSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Some answers are missing. Please go back and check each step." }, { status: 400 });
  }
  const answers: Answers = parsed.data;

  // 1. Safety gate first, with no AI involved.
  const reasons = safetyReasons(answers);
  if (reasons.length) {
    const result: Recommendation = { kind: "consult", reasons, contextChips: contextChips(answers), engine: "rules" };
    return Response.json(result);
  }

  // 2. AI when a key is configured; rules when it isn't or the call fails.
  if (aiEnabled()) {
    try {
      return Response.json(await recommendWithAI(answers));
    } catch (err) {
      console.error("[recommend] AI failed, using rules:", err instanceof Error ? err.message : err);
    }
  }
  return Response.json(recommendByRules(answers));
}
