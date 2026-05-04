import { logWarn } from "../utils/logger.util.js";
import { forbidden } from "../utils/response.util.js";

export const authorizeRoles = (...allowedRoles) =>{
return (req,res,next) =>{
    const user= req.user;
    if(!user || !user.role){
        return forbidden( res,{
          reason:"missing_user_or_role",
          source:"authorizeRoles"
        });
    }

    
    if(!allowedRoles.includes(user.role)){
      
    return forbidden(res,
      {
        reason: "role_not_allowed",
        source:"authorizeRoles",
         meta:{
              userId: user.userId,
              role: user.role,
              allowedRoles,
        }
      }
      );
    }
    next();
};
};