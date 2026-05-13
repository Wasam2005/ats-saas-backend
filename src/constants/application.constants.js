export const APPLICATION_STAGES = [
  "applied",
  "screening",
  "technical",
  "hr",
  "offer",
  "hired",
  "rejected",
];

export const ALLOWED_STAGE_TRANSITIONS = {
    
  applied: ["screening","rejected"],
  screening: ["technical","rejected"],
  technical: ["hr","rejected"],
  hr: [ "offer", "rejected"],
  offer: ["hired","rejected"],

  hired: [],
  rejected: [],
};