import express from "express";
import {createApplication,getApplications,getApplicationById, updateApplicationStage,} from "../controllers/application.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateApplicationInput, validateObjectId, validateApplicationStageInput, } from "../middleware/validate-request.middleware.js";


const router = express.Router();


router.post("/",
  authMiddleware,
  authorizeRoles( "owner", "admin", "recruiter"),
  validateApplicationInput,
  createApplication
);


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

router.patch( "/:applicationId/stage",
  authMiddleware,
  authorizeRoles("owner","admin","recruiter"),
  validateObjectId("applicationId"),
  validateApplicationStageInput,
 updateApplicationStage
);

export default router;