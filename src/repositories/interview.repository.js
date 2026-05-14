import Interview from "../models/interview.model.js";


export const createInterview = (payload) => {
    return Interview.create(payload);
  };

export const findInterviewById =(interviewId,organizationId) => {
    return Interview.findOne({ _id: interviewId,organizationId}).lean();
  };

export const getInterviews = (organizationId) => {
 return Interview.find({organizationId}).sort({scheduledAt: 1}).lean();
  };

export const findExistingInterview =({
    applicationId,interviewerId,scheduledAt,organizationId
}) =>{
    return Interview.findOne({
      applicationId,
      interviewerId,
      scheduledAt,
      organizationId,
      status: "scheduled",
    }).lean();
  };