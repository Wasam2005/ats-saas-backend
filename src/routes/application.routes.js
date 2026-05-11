import express from "express";
import {createApplication,getApplications,getApplicationById,} from "../controllers/application.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateApplicationInput, validateObjectId } from "../middleware/validate-request.middleware.js";


const router = express.Router();


router.post("/",
  authMiddleware,
  authorizeRoles( "owner", "admin", "recruiter"),
  validateApplicationInput,
  createApplication
);

// 🔹 Get Applications
router.get("/",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter","interviewer"),
  getApplications
);


router.get("/:applicationId",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter","interviewer"),
  validateObjectId("applicationId"),
  getApplicationById
);

export default router;