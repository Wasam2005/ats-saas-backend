const sanitize = (data) => {
  const blocked = ["password", "token", "refreshToken", "authorization"];

  return Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => !blocked.includes(key) && value != null
    )
  );
};

const createLog = (level, event, details = {}) => {
  if (!event || typeof event !== "string") {
    throw new Error("Logger event name is required");
  }

  const {
    source = "unknown",
    userId,
    requestId,
    reason,
    errorName,
    ...rest
  } = details;

  const log = {
    level,
    event,
    source,
    timestamp: new Date().toISOString(),
  };

  if (userId) log.userId = userId;
  if (requestId) log.requestId = requestId;
  if (reason) log.reason = reason;
  if (errorName) log.errorName = errorName;

  Object.assign(log, sanitize(rest));

  return log;
};

export const logInfo = (event, details = {}) => {
  console.log(JSON.stringify(createLog("info", event, details)));
};

export const logWarn = (event, details = {}) => {
  console.warn(JSON.stringify(createLog("warn", event, details)));
};

export const logError = (event, { error, ...details } = {}) => {
  console.error(
    JSON.stringify(
      createLog("error", event, {
        ...details,
        errorName: error?.name || "UnknownError",
        reason: details.reason || "internal_error",
        debugMessage:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      })
    )
  );
};