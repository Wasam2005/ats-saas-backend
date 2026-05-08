import {
  createJob,
  findJobById,
  findJobsByOrganization,
  findJobsByStatus
} from "../repositories/job.repository.js";
import { logInfo, logWarn, logError} from "../utils/logger.util.js";


export const createJobService = async ({title,description,organizationId}) => {

  title = title?.trim();
  description = description?.trim();

  try {
    const job = await createJob({
      title,
      description,
      status: "draft",
      organizationId,
    });


    return job;
  } catch (error) {
    logError("job_creation_failed", error, {
      organizationId,
      source: "createJobService",
    });

    throw error;
  }
};



export const getJobByIdService = async (jobId,organizationId) => {
  const job = await findJobById( jobId, organizationId );

  if (!job) {
    logWarn("job_not_found", {
      jobId,
      organizationId,
      source: "getJobByIdService",
    });

    throw new Error("JOB_NOT_FOUND");
  }

  return job;
};


export const getJobsService = async (organizationId) => {
  return findJobsByOrganization(organizationId);
};


export const getJobsByStatusService = async (organizationId, status) => {
  return findJobsByStatus(status, organizationId);
};