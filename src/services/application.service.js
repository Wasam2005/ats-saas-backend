import {
  createApplication,
  findApplicationById,
  findExistingApplication,
  findApplicationsByOrganization,
  findApplicationsByStage
} from "../repositories/application.repository.js";
import { findCandidateById } from "../repositories/candidate.repository.js";
import { findJobById } from "../repositories/job.repository.js";

import {logInfo,logWarn,logError} from "../utils/logger.util.js";


export const createApplicationService = async ({candidateId,jobId,organizationId,}) => {
    
const candidate = await findCandidateById(candidateId,organizationId);

    if (!candidate) {
      logWarn(
        "application_candidate_not_found",
        {
          candidateId,
          organizationId,
          source:"createApplicationService",
        }
      );

      throw new Error("CANDIDATE_NOT_FOUND");
    }

    // 🔹 Verify job exists
    const job = await findJobById(jobId,organizationId);

    if (!job) {
      logWarn("application_job_not_found", {
        jobId,
        organizationId,
        source: "createApplicationService",
      });

      throw new Error("JOB_NOT_FOUND");
    }

   
    if (job.status === "closed") {
      logWarn("application_job_closed", {
        jobId,
        organizationId,
        source: "createApplicationService",
      });

      throw new Error("JOB_CLOSED");
    }

    const existingApplication =
      await findExistingApplication({
        candidateId,
        jobId,
        organizationId,
      });

    if (existingApplication) {
      logWarn("duplicate_application_attempt",
        {
          candidateId,
          jobId,
          organizationId,
          source:"createApplicationService",
        }
      );

      throw new Error("APPLICATION_ALREADY_EXISTS");
    }

    try {
      
      const application =
        await createApplication({
          candidateId,
          jobId,
          organizationId,
          stage: "applied",
        });

      logInfo("application_created", {
        applicationId: application._id,
        candidateId,
        jobId,
        organizationId,
        source:"createApplicationService",
      });

      return application;
    } catch (error) {
      logError("application_creation_failed", error,
        {
          candidateId,
          jobId,
          organizationId,
          source: "createApplicationService",
        }
      );

      throw error;
    }
  };


export const getApplicationByIdService = async (applicationId,organizationId) =>{

const application = await findApplicationById(applicationId,organizationId);

    if (!application) {
      logWarn("application_not_found", {
        applicationId,
        organizationId,
        source:"getApplicationByIdService",
      });

      throw new Error("APPLICATION_NOT_FOUND");
    }

    return application;
  };


export const getApplicationsService = async (organizationId) => {
    return findApplicationsByOrganization(organizationId);
  };


export const getApplicationsByStageService =
  async (organizationId, stage) => {
    return findApplicationsByStage(organizationId,stage);
  };