import express from "express";
import { createJob, getJobs, getJobById } from "../controllers/job.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateObjectId,validateJobInput } from "../middleware/validate-request.middleware.js";

const router = express.Router();


router.post( "/",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter"),
  validateJobInput,
  createJob
);


router.get("/",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter","interviewer"),
  getJobs
);


router.get("/:jobId",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter","interviewer"),
  validateObjectId("jobId"),
  getJobById
);

export default router;