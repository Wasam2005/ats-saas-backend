import { 
  isNonEmptyString,
  isValidEmail, 
  isValidPassword ,
  isValidCompanyDomain, 
  isValidSkillsArray,
  isValidPhoneNumber,
  isValidTitle,
  isValidDescription,
  isValidJobStatus,
  isValidObjectId,
  isValidApplicationStage,
   isValidDate,
  isFutureDate,
} from "../utils/validators.util.js";
import { sanitizeString, sanitizeSkills, sanitizeJobStatus, sanitizeDate, } from "../utils/sanitizers.util.js";
import { badRequest } from "../utils/response.util.js";
import mongoose from "mongoose";
 import {JOB_STATUSES} from "../constants/job.constant.js";


// Validate and sanitize register input
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


if(!isNonEmptyString(organizationName)){
    return badRequest(res, {
      reason: "invalid_organization_name",
      source: "validateRegisterInput",
      message: "Valid organization name is required",
    });
}

  if (!isValidEmail(email)) {
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


// Validate and sanitize login input
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


// Validate and sanitize candidate input
export const validateCandidateInput = (req, res, next) => {
  let { name, email, phone, skills } = req.body;

  name = sanitizeString(name);
  email = email?.trim().toLowerCase();
  phone = phone?.trim();

  
  skills = sanitizeSkills(skills);


  if (!isNonEmptyString(name)) {
    return badRequest(res, {
      reason: "invalid_candidate_name",
      source: "validateCandidateInput",
      message: "Valid candidate name is required",
    });
  }

  if (!isValidEmail(email)) {
    return badRequest(res, {
      reason: "invalid_candidate_email",
      source: "validateCandidateInput",
      message: "Valid candidate email is required",
    });
  }

  if (!isValidSkillsArray(skills)) {
    return badRequest(res, {
      reason: "invalid_candidate_skills",
      source: "validateCandidateInput",
      message: "Skills must be a valid string array",
    });
  }

  if (phone && !isValidPhoneNumber(phone)) {
  return badRequest(res, {
    reason: "invalid_candidate_phone",
    source: "validateCandidateInput",
    message: "Valid candidate phone number is required",
  });
}
  

req.body.name = name;
req.body.email = email;
req.body.phone = phone;
req.body.skills = skills;
  next();
};

// Validate ObjectId
export const validateObjectId = (paramName ="id") => {
  return (req, res, next) => {
  const value = req.params?.[paramName];
    if(!isValidObjectId(value)){
      return badRequest(res, {
        reason:"invalid_object_id",
        source:"validateObjectId",
        message:"Invalid resource id"
      });
    }
    next();
  };
};


// Validate and sanitize job input
export const validateJobInput = (req,res,next) => {
  let { title, description } = req.body;

  title = sanitizeString(title);

  description =sanitizeString(description);

  if (!isValidTitle(title)){
    return badRequest(res, {
      reason: "invalid_job_title",
      source: "validateJobInput",
      message: "Job title must be between 3 and 100 characters",
    });
  }

  if (!isValidDescription(description)){
    return badRequest(res, {
      reason: "invalid_job_description",
      source: "validateJobInput",
      message: "Job description must be between 10 and 5000 characters",
    });
  }

  req.body.title = title;

  req.body.description = description;
  next();
};

export const validateJobStatus = (source = "body") => {
  return (req, res, next) =>{
 let status = req[source]?.status;
    if (status !== undefined) {
      status = sanitizeJobStatus(status);
    }
    if (!isValidJobStatus(status)) {
      return badRequest(res, {
        reason: "invalid_job_status",
        source: "validateJobStatus",
        message: "Invalid job status",
      });
    }
    req[source].status = status;
    next();
  };
  };

  // Validate application input
export const validateApplicationInput =(req, res, next) => {
    const { candidateId, jobId } = req.body;
   
  if (!isValidObjectId(candidateId)){
      return badRequest(res, {
        reason: "invalid_candidate_id",
        source: "validateApplicationInput",
        message: "Valid candidate id is required",
      });
    }

    if (!isValidObjectId(jobId)){
      return badRequest(res, {
        reason: "invalid_job_id",
        source:"validateApplicationInput",
        message:"Valid job id is required",
      });
    }

    next();
  };
  
  export const validateApplicationStageInput = (req, res, next) => {

    let { stage } = req.body;
    stage = sanitizeString(stage).toLowerCase();

    if (!isValidApplicationStage(stage)){
      return badRequest(res, {
        reason: "invalid_application_stage",
        source: "validateApplicationStageInput",
        message: "Valid application stage is required",
      });
    }

    req.body.stage = stage;
    next();
  };


export const validateInterviewInput = (req, res, next) => {
    let {applicationId,interviewerId,scheduledAt} = req.body;
   
    if (!isValidObjectId(applicationId)) {
      return badRequest(res, {
        reason:"invalid_application_id",
        source:"validateInterviewInput",
        message:"Valid application id is required",
      });
    }



    if (!isValidObjectId(interviewerId)) {
      return badRequest(res, {
        reason:"invalid_interviewer_id",
        source:"validateInterviewInput",
        message:"Valid interviewer id is required",
      });
    }

    scheduledAt = sanitizeDate(scheduledAt);
    if (!isValidDate(scheduledAt)) {
      return badRequest(res, {
        reason:"invalid_scheduled_time",
        source:"validateInterviewInput",
        message:"Invalid interview schedule time",
      });
    }

    if (!isFutureDate(scheduledAt)) {
      return badRequest(res, {
        reason:"past_interview_schedule",
        source:"validateInterviewInput",
        message: "Interview must be scheduled in future",
      });
    }
  
    req.body.scheduledAt = scheduledAt;

    next();
  };

