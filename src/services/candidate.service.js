import { createCandidate, findCandidateByEmail, findCandidateById, findCandidatesByOrganization,} from "../repositories/candidate.repository.js";
import { logInfo, logWarn, logError } from "../utils/logger.util.js";


export const createCandidateService = async ({name,email,phone,skills,organizationId})=>{
  email = email?.trim().toLowerCase();
  name = name?.trim();
  phone = phone?.trim();

const existingCandidate = await findCandidateByEmail(email,organizationId);

  if (existingCandidate) {
    logWarn("candidate_creation_failed", {
      reason: "candidate_already_exists",
      organizationId,
      source: "createCandidateService",
    });

    throw new Error("CANDIDATE_ALREADY_EXISTS");
  }

  try {
    const candidate = await createCandidate({
      name,
      email,
      phone,
      skills,
      organizationId,
    });


    return candidate;
  } catch (error) {
    logError("candidate_creation_failed", {
      error,
      organizationId,
      source: "createCandidateService",
    });

    throw error;
  }
};


export const getCandidatesService = async (organizationId) => {
  return findCandidatesByOrganization(organizationId);
};


export const getCandidateByIdService = async (candidateId,organizationId) => {
const candidate = await findCandidateById(candidateId,organizationId);
  if (!candidate) {
    logWarn("candidate_not_found", {
      candidateId,
      organizationId,
      source: "getCandidateByIdService",
    });

    throw new Error("CANDIDATE_NOT_FOUND");
  }

  return candidate;
};