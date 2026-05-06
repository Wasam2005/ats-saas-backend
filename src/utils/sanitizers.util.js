export const sanitizeString = (value) => {
  if (typeof value !== "string") return "";

  let sanitizedValue = value.trim();

  sanitizedValue = sanitizedValue.replace(/\s+/g, " ");

  sanitizedValue = sanitizedValue.replace(/<[^>]*>/g, "");

  return sanitizedValue;
};

export const sanitizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];

  return [
    ...new Set(
      skills
        .map((skill) =>
          sanitizeString(skill).toLowerCase()
        )
        .filter(Boolean)
    ),
  ];
};