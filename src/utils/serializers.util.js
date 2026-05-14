export const serializeCandidate = (candidate) => {
    return {
        id:candidate._id,
        name:candidate.name,
        email:candidate.email,
        phone:candidate.phone,
        skills:candidate.skills,
        createdAt:candidate.createdAt,
        updatedAt:candidate.updatedAt,
    };
};

export const serializeJob = (job) => {
  if (!job) return null;
  return {
    id: job._id,
    title: job.title,
    description: job.description,
    status: job.status,
    organizationId: job.organizationId,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

export const serializeApplication = (application) => {
  return {
    id: application._id,
    candidateId:application.candidateId,
    jobId: application.jobId,
    stage: application.stage,
    organizationId:application.organizationId,
    createdAt:application.createdAt,
    updatedAt: application.updatedAt,
  };
};

export const serializeInterview = (interview) => {
    return {
      id: interview._id,
      applicationId:interview.applicationId,
      interviewerId:interview.interviewerId,
      scheduledAt:interview.scheduledAt,
      status:interview.status,
      feedback: interview.feedback,
      score:interview.score,
      createdAt:interview.createdAt,
      updatedAt:interview.updatedAt,
    };
  };
