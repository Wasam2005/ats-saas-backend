import {createCandidateService,getCandidatesService,getCandidateByIdService} from "../services/candidate.service.js";
import {badRequest,conflict,serverError} from "../utils/response.util.js";
import { logInfo } from "../utils/logger.util.js";


export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;

    
    const organizationId = req.user.organizationId;

    const candidate = await createCandidateService({
      name,
      email,
      phone,
      skills,
      organizationId,
    });

    logInfo("candidate_created", {
      candidateId: candidate._id,
      organizationId,
      source: "createCandidate",
    });

    return res.status(201).json({
      success: true,
      data: candidate,
      message: "Candidate created successfully",
    });
  } catch (error) {
    if (error.message === "CANDIDATE_ALREADY_EXISTS") {
      return conflict(res, {
        reason: "candidate_already_exists",
        source: "createCandidate",
        message: "Candidate already exists",
        log: false,
      });
    }

    return serverError(res, {
      error,
      source: "createCandidate",
      context: "candidate_creation_failed",
    });
  }
};


export const getCandidates = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const candidates = await getCandidatesService(organizationId);

    return res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    return serverError(res, {
      error,
      source: "getCandidates",
      context: "candidate_fetch_failed",
    });
  }
};


export const getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const organizationId = req.user.organizationId;

const candidate = await getCandidateByIdService(candidateId,organizationId);

    return res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    if (error.message === "CANDIDATE_NOT_FOUND") {
      return badRequest(res, {
        reason: "candidate_not_found",
        source: "getCandidateById",
        message: "Candidate not found",
        log: false,
      });
    }

    return serverError(res, {
      error,
      source: "getCandidateById",
      context: "candidate_fetch_failed",
    });
  }
};