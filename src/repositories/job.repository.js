import Job from "../models/job.model.js";

export const createJob = (data) => {
    return Job.create(data);
}

export const findJobById = (jobId,organizationId) => {
    return Job.findOne({ _id: jobId, organizationId,}).lean();
};

export const findJobsByOrganization = (organizationId) => {
    return Job.find({ organizationId}).lean();
};

export const findJobsByStatus = (status, organizationId) => {
    return Job.find({ status, organizationId}).lean();
};