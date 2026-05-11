import {
  createJobService,
  getJobByIdService,
  getJobsService,
  getJobsByStatusService,
} from "../services/job.service.js";
import { serializeJob } from "../utils/serializers.util.js";
import { badRequest, serverError} from "../utils/response.util.js";
import { logInfo } from "../utils/logger.util.js";

export const createJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    const organizationId = req.user.organizationId;

    const job = await createJobService({title,description,organizationId});


    return res.status(201).json({
      success: true,
      data: serializeJob(job),
      message: "Job created successfully",
    });
  } catch (error) {
    return serverError(res, {
      error,
      source: "createJob",
      context: "job_creation_failed",
    });
  }
};


export const getJobs = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const status = req.query.status;

 const jobs = status? await getJobsByStatusService(organizationId,status)
                : await getJobsService(organizationId);

    return res.status(200).json({
      success: true,
      data: jobs.map(serializeJob),
    });
  } catch (error) {
    return serverError(res, {
      error,
      source: "getJobs",
      context: "jobs_fetch_failed",
    });
  }
};


export const getJobById = async (req,res) => {
  try {
    const { jobId } = req.params;

    const organizationId = req.user.organizationId;

    const job = await getJobByIdService(jobId,organizationId);

    return res.status(200).json({
      success: true,
      data: serializeJob(job),
    });
  } catch (error) {
    if (error.message === "JOB_NOT_FOUND") {
      return badRequest(res, {
        reason: "job_not_found",
        source: "getJobById",
        message: "Job not found",
        log: false,
      });
    }

    return serverError(res, {
      error,
      source: "getJobById",
      context: "job_fetch_failed",
    });
  }
};