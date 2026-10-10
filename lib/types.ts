export type ConcernId = "tone" | "lines" | "acne" | "volume" | "hair" | "other";
export type DowntimeId = "none" | "few" | "week";
export type BudgetId = "under5" | "5to15" | "over15" | "unsure";
export type SafetyId = "pregnant" | "recent" | "infection" | "isotretinoin" | "none";

export type Answers = {
  concerns: ConcernId[];
  details: string;
  downtime: DowntimeId;
  budget: BudgetId;
  safety: SafetyId[];
};

export type Pick = { id: string; reason: string };

export type Engine = "ai" | "rules";

export type Recommendation =
  | {
      kind: "match";
      primary: Pick;
      secondary: Pick | null;
      howWePicked: string[];
      contextChips: string[];
      engine: Engine;
    }
  | {
      kind: "consult";
      reasons: string[];
      contextChips: string[];
      engine: Engine;
    };
