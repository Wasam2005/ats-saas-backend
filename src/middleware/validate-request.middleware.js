import { isNonEmptyString, isValidEmail, isValidPassword ,isValidCompanyDomain} from "../utils/validators.util.js";
import { logWarn } from "../utils/logger.util.js";
import { sanitizeString } from "../utils/sanitizers.util.js";
import { badRequest } from "../utils/response.util.js";

export const validateRegisterInput = (req,res,next) =>{
let{ name, email, password, organizationName, companyDomain } = req.body;
name = sanitizeString(name);
organizationName=  sanitizeString(organizationName);
email=email?.trim().toLowerCase();
companyDomain=companyDomain?.trim().toLowerCase();

if(!isNonEmptyString(name)){
  return badRequest(res, {
      reason: "invalid_name",
      source: "validateRegisterInput",
      message: "Valid name is required",
    });
}

if(!isNonEmptyString(companyDomain)){
    return badRequest(res, {
      reason: "invalid_organization_name",
      source: "validateRegisterInput",
      message: "Valid organization name is required",
    });
}

if(!isNonEmptyString(organizationName)){
    return badRequest(res, {
      reason: "invalid_organization_name",
      source: "validateRegisterInput",
      message: "Valid organization name is required",
    });
}


  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    return badRequest(res, {
      reason: "invalid_email",
      source: "validateRegisterInput",
      message: "Valid email is required",
    });
  }



if(!isValidCompanyDomain(companyDomain)){
   return badRequest(res, {
      reason: "invalid_company_domain",
      source: "validateRegisterInput",
      message: "Valid company domain is required",
    });
}


if(!isValidPassword(password)){
  return badRequest(res, {
      reason: "invalid_password",
      source: "validateRegisterInput",
      message: "Password must be between 8 and 128 characters",
    });
  }
  
  req.body.name = name;
  req.body.email = email;
  req.body.organizationName = organizationName;
  req.body.companyDomain = companyDomain;

  next();
}



export const validateLoginInput = (req, res, next) => {
  let { email, password,companyDomain  } = req.body;

  email = email?.trim().toLowerCase();
  companyDomain=companyDomain?.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return badRequest(res, {
      reason: "invalid_email",
      source: "validateLoginInput",
      message: "Valid email is required",
    });
  }

  if (!isValidPassword(password)) {
     return badRequest(res, {
      reason: "invalid_password",
      source: "validateLoginInput",
      message: "Password must be between 8 and 128 characters",
    });
  }

  if (!isValidCompanyDomain(companyDomain)) {
  return badRequest(res, {
    reason: "invalid_company_domain",
    source: "validateLoginInput",
  });
}

  req.body.email = email;
  req.body.companyDomain = companyDomain;

  next();
};