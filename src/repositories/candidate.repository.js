import Candidate from "../models/candidate.model.js";

export const createCandidate = (data) => {
  return Candidate.create(data);
};


export const findCandidateByEmail = (email, organizationId) => {
  return Candidate.findOne({
    email,
    organizationId,
  }).lean();
};

export const findCandidateById = (candidateId, organizationId) => {
  return Candidate.findOne({
    _id: candidateId,
    organizationId,
  }).lean();
};


export const findCandidatesByOrganization = (organizationId) => {
  return Candidate.find({
    organizationId,
  }).lean();
};