import {
  createJob,
  findJobById,
  findJobsByOrganization,
  findJobsByStatus,
   updateJobStatus
} from "../repositories/job.repository.js";
import { ALLOWED_JOB_TRANSITIONS} from "../constants/job.constant.js";
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

    logInfo("job_created", {
      jobId: job._id,
      organizationId,
      source: "createJobService",
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


export const updateJobStatusService = async ({jobId,organizationId,status}) => {

    const job = await findJobById(jobId,organizationId);

    if (!job) { 
      logWarn("job_not_found",
        {
          jobId,
          organizationId,
          source:"updateJobStatusService",
        }
      );

      throw new Error("JOB_NOT_FOUND");
    }


    const allowedTransitions = ALLOWED_JOB_TRANSITIONS[job.status];

    if (!allowedTransitions.includes(status)) {
      logWarn("invalid_job_transition",
        {
          jobId,
          currentStatus:job.status,
          nextStatus: status,
          organizationId,
          source:"updateJobStatusService",
        }
      );

      throw new Error("INVALID_JOB_TRANSITION");
    }
    
    const updatedJob = await updateJobStatus(jobId,organizationId,status);

    logInfo("job_status_updated",
      {
        jobId,
        previousStatus:job.status,
        newStatus:status,
        organizationId,
        source:"updateJobStatusService",
      }
    );

    return updatedJob;
  };