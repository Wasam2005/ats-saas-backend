import bcrypt from "bcrypt";
import {hashToken , issueTokens } from "../utils/token.util.js";
import { logWarn, logError, logInfo } from "../utils/logger.util.js";
import mongoose from "mongoose";
import { createOrganization, updateOrganizationOwner } from "../repositories/organization.repository.js";
import { createUser, findUserByEmail , findUserById} from "../repositories/user.repository.js";
import { createRefreshToken, findAndDeleteRefreshTokenByHash, deleteAllRefreshTokensByUser } from "../repositories/refresh-token.repository.js";


export const createOrganizationWithOwner= async({name,email,password,organizationName,companyDomain }) => {
    const session = await mongoose.startSession();

    const hashedPassword = await bcrypt.hash(password, 10);


  try {
    let createdUser;

    await session.withTransaction(async () => {
    const [organization] = await createOrganization(
  {
    name: organizationName,
    companyDomain,
    ownerId: null,
    status: "active",
  },
  session
);

const [user] = await createUser(
  {
    name,
    email,
    password: hashedPassword,
    role: "owner",
    organizationId: organization._id,
  },
  session
);

await updateOrganizationOwner(organization, user._id, session);
      createdUser = user;
    });

    return createdUser;
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        throw new Error("USER_EXISTS");
      }
      if (error.keyPattern?.companyDomain) {
        throw new Error("ORGANIZATION_ALREADY_EXISTS");
      }
    }

    throw error;
  } finally {
    session.endSession();
  }
};


 

export const authenticateUser = async ({ email, password }) => {
  const existingUser = await findUserByEmail(email);
 if (!existingUser) {
  logWarn("login_auth_failed", {
  email,
  reason: "USER_NOT_FOUND",
  source: "authenticateUser"
});
  throw new Error("USER_NOT_FOUND");
}
if (!existingUser.isActive) {
  logWarn("login_auth_failed", {
    email,
    reason: "USER_INACTIVE",
    source: "authenticateUser"
  });

  throw new Error("USER_INACTIVE");
}

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    logWarn("login_auth_failed", {
  email,
  reason: "PASSWORD_MISMATCH",
  source: "authenticateUser"
});
  throw new Error("PASSWORD_MISMATCH");
}


const {accessToken,rawRefreshToken,hashedToken,expiresAt} = issueTokens(existingUser._id);

try {
  await createRefreshToken({
    userId: existingUser._id,
    token: hashedToken,
    expiresAt,
  });
} catch (error) {
  logError("login_token_creation_failed", {
    userId: existingUser._id,
    reason: "token_creation_failed",
    source: "authenticateUser"
  });

  throw new Error("TOKEN_CREATION_FAILED");
}

return {
  accessToken,
  refreshToken: rawRefreshToken
}
  
};


export const refreshTokenService = async (refreshToken) => {
  const hashedIncomingToken = hashToken(refreshToken);

const existingToken = await findAndDeleteRefreshTokenByHash(hashedIncomingToken);

  if (!existingToken) {
      logWarn("refresh_token_reuse_detected", {
    reason: "token_not_found",
    message: "Refresh token reuse or invalid token detected",
    source: "refreshTokenService"
  });

    throw new Error("UNAUTHORIZED");
  }
const user = await findUserById(existingToken.userId);

if (!user || !user.isActive) {
  await deleteAllRefreshTokensByUser(existingToken.userId);

  logWarn("refresh_user_inactive", {
    userId: existingToken.userId,
    reason: "user_inactive_or_deleted",
    source: "refreshTokenService"
  });

  throw new Error("UNAUTHORIZED");
}

  if (existingToken.expiresAt < new Date()) {
     logWarn("refresh_token_expired", {
    userId: existingToken.userId,
    reason: "refresh_token_expired",
    source: "refreshTokenService"
  });

  
    throw new Error("EXPIRED");
  }

  const {accessToken,rawRefreshToken,hashedToken,expiresAt} =issueTokens(user._id);
try{ 
  await createRefreshToken({
  userId: user._id,
  token: hashedToken,
  expiresAt,
});
logInfo("refresh_token_rotated", {
  userId: user._id,
  message: "Refresh token rotated successfully",
  source: "refreshTokenService"
});
}catch(error){
  logError("refresh_token_creation_failed", {
      userId: user._id,
      reason: "refresh_token_creation_failed",
      message: "Session recovery required",
      source: "refreshTokenService"
    });

    throw new Error("SESSION_RECOVERY_REQUIRED");
}

  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};