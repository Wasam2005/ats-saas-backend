import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { logWarn, logError, logInfo } from "../utils/logger.util.js";
import { findUserForAuth } from "../repositories/user.repository.js";
import { unauthorized, serverError } from "../utils/response.util.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
     return unauthorized(res, {
        reason: "authorization_header_missing",
        source: "authMiddleware",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return unauthorized(res, {
        reason: "invalid_bearer_format",
        source: "authMiddleware",
      });
    }

    const token = parts[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (!decoded.userId) {
        return unauthorized(res, {
        reason: "missing_userId_in_payload",
        source: "authMiddleware",
      });
    }

const user = await findUserForAuth(decoded.userId);

    
if (!user || !user.isActive) {
   return unauthorized(res, {
        reason: "user_inactive_or_not_found",
        source: "authMiddleware",
      });
}

if (!user.organizationId) {
    return unauthorized(res, {
        reason: "user_without_organization",
        source: "authMiddleware",
      });
}
    req.user = {
      userId: user._id,
      role: user.role,
      organizationId: user.organizationId,
    };
  
    next();
  }
 catch (error) {
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
     return unauthorized(res, {
        reason: "invalid_or_expired_token",
        source: "authMiddleware",
      });
    }

  return serverError(res, {
      error,
      source: "authMiddleware",
      context: "auth_middleware_server_error",
    });
}
};