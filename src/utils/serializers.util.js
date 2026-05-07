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