import {
  createApplicationService,
  getApplicationByIdService,
  getApplicationsService,
  getApplicationsByStageService,
  updateApplicationStageService,
} from "../services/application.service.js";
import {badRequest,conflict,serverError} from "../utils/response.util.js";
import { serializeApplication } from "../utils/serializers.util.js";

export const createApplication =async (req, res) => {
    try {
      const {candidateId,jobId} = req.body;

      const organizationId = req.user.organizationId;

      const application = await createApplicationService({
          candidateId,
          jobId,
          organizationId,
        });

      return res.status(201).json({
        success: true,
        data: serializeApplication(application),
        message: "Application created successfully",
      });
    } catch (error) {

      if ( error.message ==="CANDIDATE_NOT_FOUND") {
        return badRequest(res, {
          reason:"candidate_not_found",
          source:"createApplication",
          message:"Candidate not found",
          log: false,
        });
      }
      if (error.message ==="JOB_NOT_FOUND") {
        return badRequest(res, {
          reason: "job_not_found",
          source:"createApplication",
          message: "Job not found",
          log: false,
        });
      }

      if (error.message ==="JOB_CLOSED") {
        return badRequest(res, {
          reason: "job_closed",
          source:"createApplication",
          message:"Applications are closed for this job",
          log: false,
        });
      }

      if (error.message ==="APPLICATION_ALREADY_EXISTS") {
        return conflict(res, {
          reason:"application_already_exists",
          source:"createApplication",
          message:"Application already exists",
          log: false,
        });
      }

      return serverError(res, {
        error,
        source:"createApplication",
        context:"application_creation_failed",
      });
    }
  };


export const getApplications = async (req, res) => {
    try {
      const organizationId = req.user.organizationId;

      const { stage } = req.query;

      const applications = stage
        ? await getApplicationsByStageService(organizationId,stage)
        : await getApplicationsService(organizationId);

      return res.status(200).json({
        success: true,
        data: applications.map(serializeApplication),
         message: "Applications fetched successfully",
      });
    } catch (error) {
      return serverError(res, {
        error,
        source: "getApplications",
        context:"applications_fetch_failed",
      });
    }
  };


export const getApplicationById =async (req, res) => {
    try {
      const { applicationId } = req.params;

      const organizationId = req.user.organizationId;

      const application = await getApplicationByIdService(
          applicationId,
          organizationId
        );

      return res.status(200).json({
        success: true,
        data: serializeApplication(application),
         message: "Applications fetched successfully",
       
      });
    } catch (error) {
      if (error.message ==="APPLICATION_NOT_FOUND") {
        return badRequest(res, {
          reason:"application_not_found",
          source: "getApplicationById",
          message: "Application not found",
          log: false,
        });
      }

      return serverError(res, {
        error,
        source:"getApplicationById",
        context:"application_fetch_failed",
      });
    }
  };

  export const updateApplicationStage = async (req, res) =>{
    try {
      const { applicationId } = req.params;
      const { stage } = req.body;
      const organizationId = req.user.organizationId;

  const application = await updateApplicationStageService({
          applicationId,
          organizationId,
          stage,
        });

    return res.status(200).json({
        success: true,
        data: serializeApplication(application),
        message:"Application stage updated successfully",
      });

    } catch (error) {

      if (error.message === "APPLICATION_NOT_FOUND") {
        return badRequest(res, {
          reason: "application_not_found",
          source:"updateApplicationStage",
          message:"Application not found",
          log: false,
        });
      }

      if (error.message ==="INVALID_STAGE_TRANSITION"){
        return badRequest(res,{
          reason:"invalid_stage_transition",
          source:"updateApplicationStage",
          message:"Invalid application stage transition",
          log: false,
        });
      }

      return serverError(res,{
        error,
        source:"updateApplicationStage",
        context: "application_stage_update_failed",
      });
    }
  };