import {
  createInterviewService,
  getInterviewByIdService,
  getInterviewsService,
} from "../services/interview.service.js";
import {badRequest,conflict,serverError} from "../utils/response.util.js";
import { serializeInterview } from "../utils/serializers.util.js";


export const createInterview =async (req, res) => {
    try {
      const {applicationId,interviewerId,scheduledAt} = req.body;

      const organizationId = req.user.organizationId;

      const interview = await createInterviewService({
          applicationId,
          interviewerId,
          scheduledAt,
          organizationId,
        });

      return res.status(201).json({
        success: true,
        data:serializeInterview(interview),
        message:"Interview scheduled successfully",
      });

    } catch (error) {
      if (error.message ==="APPLICATION_NOT_FOUND") {
        return badRequest(res, {
          reason:"application_not_found",
          source:"createInterview",
          message:"Application not found",
          log: false,
        });
      }

      if (error.message ==="INVALID_INTERVIEW_STAGE") {
        return badRequest(res, {
          reason:"invalid_interview_stage",
          source:"createInterview",
          message:"Interview can only be scheduled during technical or hr stage",
          log: false,
        });
      }


      if (error.message ==="INTERVIEWER_NOT_FOUND") {
        return badRequest(res, {
          reason:"interviewer_not_found",
          source:"createInterview",
          message:"Interviewer not found",
          log: false,
        });
      }


      if (error.message === "INVALID_INTERVIEWER_ROLE") {
        return badRequest(res, {
          reason:"invalid_interviewer_role",
          source:"createInterview",
          message:"Assigned user is not an interviewer",
          log: false,
        });
      }


      if (error.message ==="INTERVIEW_ALREADY_EXISTS") {
        return conflict(res, {
          reason:"interview_already_exists",
          source:"createInterview",
          message:"Interview already scheduled",
          log: false,
        });
      }


      return serverError(res, {
        error,
        source:"createInterview",
        context:"interview_creation_failed",
      });
    }
  };

export const getInterviews = async (req, res) => {
    try {
      const organizationId =  req.user.organizationId;
      const interviews =await getInterviewsService(organizationId);

      return res.status(200).json({
        success: true,
        data:interviews.map(serializeInterviews),
      });

    }catch (error){
      return serverError(res, {
        error,
        source:"getInterviews",
        context:"interviews_fetch_failed",
      });
    }
  };


export const getInterviewById =async (req, res) => {
    try {
      const { interviewId } = req.params;

      const organizationId = req.user.organizationId;

      const interview = await getInterviewByIdService(interviewId,organizationId);

      return res.status(200).json({
        success: true,
        data:serializeInterview(interview),
      });

    } catch (error) {
      if (error.message ==="INTERVIEW_NOT_FOUND") {
        return badRequest(res, {
          reason:"interview_not_found",
          source:"getInterviewById",
          message:"Interview not found",
          log: false,
        });
      }

      return serverError(res, {
        error,
        source:"getInterviewById",
        context:"interview_fetch_failed",
      });
    }
  };