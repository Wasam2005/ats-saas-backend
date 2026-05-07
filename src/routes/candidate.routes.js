import express from "express";
import { createCandidate,getCandidates,getCandidateById} from "../controllers/candidate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateCandidateInput, validateObjectId } from "../middleware/validate-request.middleware.js";

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  authorizeRoles("owner", "admin", "recruiter"),
  validateCandidateInput,
  createCandidate
);


router.get(
  "/",
  authMiddleware,
  authorizeRoles("owner", "admin", "recruiter", "interviewer"),
  getCandidates
);


router.get(
  "/:candidateId",
  authMiddleware,
  authorizeRoles("owner", "admin", "recruiter", "interviewer"),
  validateObjectId("candidateId"),
  getCandidateById
);

export default router;