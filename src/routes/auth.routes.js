import express from "express";
import { registerUser,loginUser,refreshAccessToken } from "../controllers/auth.controller.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/validate-request.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login",validateLoginInput,loginUser);
router.post("/session/refresh", refreshAccessToken);

export default router;
