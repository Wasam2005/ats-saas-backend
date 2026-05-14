import {
  createInterview,
  findExistingInterview,
  findInterviewById,
  getInterviews,
} from "../repositories/interview.repository.js";
import {findApplicationById} from "../repositories/application.repository.js";
import {findUserById,} from "../repositories/user.repository.js";
import {logInfo,logWarn} from "../utils/logger.util.js";

export const createInterviewService = 
async ({applicationId,interviewerId,scheduledAt,organizationId}) => {

 const application = await findApplicationById(applicationId,organizationId);

    if (!application) {
      logWarn("application_not_found",
        {
          applicationId,
          organizationId,
          source: "createInterviewService",
        }
      );

      throw new Error("APPLICATION_NOT_FOUND");
    }

   if (!["technical", "hr"].includes(application.stage)){
  logWarn("invalid_stage_for_interview",{
      applicationId,
      organizationId,
      stage:  application.stage,
      source: "createInterviewService",
    }
  );

  throw new Error("INVALID_INTERVIEW_STAGE");
}


const interviewer =await findUserById(interviewerId,organizationId);

    if (!interviewer) {
    logWarn("interviewer_not_found",
        {
          interviewerId,
          organizationId,
          source: "createInterviewService",
        }
      );

      throw new Error("INTERVIEWER_NOT_FOUND");
    }


    if (interviewer.role !=="interviewer") {
      logWarn("invalid_interviewer_role",
        {
          interviewerId,
          organizationId,
          role: interviewer.role,
          source: "createInterviewService",
        }
      );

      throw new Error( "INVALID_INTERVIEWER_ROLE");
    }



    const existingInterview = await findExistingInterview({
        applicationId,
        interviewerId,
        scheduledAt,
        organizationId,
      });

    if (existingInterview) {
      logWarn("duplicate_interview",
        {
          applicationId,
          interviewerId,
          organizationId,
          scheduledAt,
          source: "createInterviewService",
        }
      );

      throw new Error("INTERVIEW_ALREADY_EXISTS");
    }


  
    const interview = await createInterview({
        applicationId,
        interviewerId,
        scheduledAt,
        organizationId,
      });

    logInfo("interview_created",
      {
        interviewId:interview._id,
        applicationId,
        interviewerId,
        organizationId,
        source:"createInterviewService",
      }
    );

    return interview;
  };


export const getInterviewsService =async (organizationId) => {
    return getInterviews(organizationId);
  };


export const getInterviewByIdService =async (interviewId,organizationId) => {
    const interview = await findInterviewById(interviewId,organizationId);

    if (!interview) {
      logWarn("interview_not_found",
        {
          interviewId,
          organizationId,
          source: "getInterviewByIdService",
        }
      );

      throw new Error("INTERVIEW_NOT_FOUND");
    }

    return interview;
  };