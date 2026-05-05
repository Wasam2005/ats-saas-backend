import { createOrganizationWithOwner,authenticateUser,refreshTokenService} from "../services/auth.service.js";
import { logWarn, logError, logInfo } from "../utils/logger.util.js";
import { conflict, serverError, unauthorized } from "../utils/response.util.js";


//User registeration controller
export const registerUser = async (req,res) =>
{
let {name , email , password,organizationName,companyDomain } = req.body ;
try{
await createOrganizationWithOwner({name , email , password,organizationName ,companyDomain});
logInfo("register_success", {
  email,
  message: "User registered successfully",
});
return res.status(201).json({
  success: true,
  message: "User registered successfully"})
}
catch(error){
   
if(error.message==="USER_EXISTS"){
   return conflict(res, {
    reason: "user_already_exists",
    source: "registerUser",
    message: "User already exists",
    meta: { email },
  });
}



if (error.message === "ORGANIZATION_ALREADY_EXISTS") {
  return conflict(res, {
    reason: "organization_already_exists",
    source: "registerUser",
    message: "Organization already exists",
    meta: { email },
  });
}

return serverError(res, {
  error,
  source: "registerUser",
  context: "register_server_error",
});
}
};



// User Login controller
export const loginUser = async (req, res) => {
  let { email, password, companyDomain } = req.body;
  try {
    const {accessToken,refreshToken}= await authenticateUser({ email, password,companyDomain });

   res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

logInfo("login_success", {
  email,
  message: "User logged in successfully",
  source: "loginUser",
});
    return res.status(200).json({
      success: true,
      data: {
        accessToken,
      
      },
      message: "User logged in successfully",
    });
  } catch (error) {

    if (error.message === "INVALID_CREDENTIALS") {
      return unauthorized(res, {
    reason: "invalid_credentials",
    source: "loginUser",
    message: "Invalid credentials",
  });
    }

if (error.message === "TOKEN_CREATION_FAILED") {
    return serverError(res, {
    error,
    source: "loginUser",
    context: "login_token_creation_failed",
    log: false,
  });
}

return serverError(res, {
  error,
  source: "loginUser",
  context: "login_server_error",
});

  }
};


// Handles refresh token request
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
   
    if (!refreshToken) {
       return unauthorized(res, {
    reason: "refresh_token_missing",
    source: "refreshAccessToken",
    message: "Refresh token cookie missing",
  });
}

    const result = await refreshTokenService(refreshToken);

   
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

  

  return res.status(200).json({
  success: true,
  data: {
    accessToken: result.accessToken,
  },
  message: "Token refreshed successfully",
});

  } catch (error) {

 if(error.message === "UNAUTHORIZED" || error.message === "EXPIRED") {
   return unauthorized(res, {
    reason: "invalid_refresh_token",
    source: "refreshAccessToken",
    log: false,
  });
}

 if (error.message === "SESSION_RECOVERY_REQUIRED") {
      return serverError(res, {
    error,
    source: "refreshAccessToken",
    context: "session_recovery_required",
    log: false,
  });
  }

   return serverError(res, {
  error,
  source: "refreshAccessToken",
  context: "refresh_token_server_error",
});
  }
};