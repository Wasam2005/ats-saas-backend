export const JOB_STATUSES = [
  "draft",
  "open",
  "closed",
];

export const ALLOWED_JOB_TRANSITIONS = {
  draft: ["open"],
  open: ["closed"],
  closed: [],
};