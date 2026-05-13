import Application from "../models/application.model.js";


export const createApplication = (data) => {
  return Application.create(data);
};


export const findApplicationById = (applicationId,organizationId) => {
  return Application.findOne({
    _id: applicationId,
    organizationId,
  }).lean();
};


export const findExistingApplication = ({candidateId,jobId,organizationId,}) => {
  return Application.findOne({
    candidateId,
    jobId,
    organizationId,
  }).lean();
};


export const findApplicationsByOrganization =(organizationId) => {
    return Application.find({organizationId}).lean();
  };

export const findApplicationsByStage = (organizationId,stage) => {
  return Application.find({
    organizationId,
    stage,
  }).lean();
};

export const findApplicationsByJob = (jobId,organizationId) => {
  return Application.find({
    jobId,
    organizationId,
  }).lean();
};

export const findApplicationsByCandidate =(candidateId, organizationId) => {
    return Application.find({
      candidateId,
      organizationId,
    }).lean();
  };

  export const updateApplicationStage = (applicationId,organizationId,stage) => {
    return Application.findOneAndUpdate(
      {_id: applicationId,organizationId},
      {stage},
      {new: true}
    ).lean();
  };