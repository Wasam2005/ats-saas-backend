import express from "express";
import {
  createInterview,
  getInterviewById,
  getInterviews,
} from "../controllers/interview.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";
import {validateInterviewInput,validateObjectId} from "../middleware/validate-request.middleware.js";



const router =express.Router();

router.post("/",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter"),
  validateInterviewInput,
  createInterview
);

router.get("/",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter"),
  getInterviews
);


router.get("/:interviewId",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter"),
  validateObjectId("interviewId"),
  getInterviewById
);

export default router;