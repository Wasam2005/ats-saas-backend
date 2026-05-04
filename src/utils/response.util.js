import { logWarn, logError } from "./logger.util.js";


const send = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};


export const badRequest = (
res,
  { reason, source = "unknown", message = "Invalid input", log = true, meta = {} }
) => {
  if (log) {
    logWarn("validation_failed", {
      reason,
      source,
      ...meta,
    });
  }

  return send(res, 400, message);
};


export const unauthorized = (
  res,
  { reason, source = "unknown", message = "Unauthorized", log = true, meta = {} }
) => {
  if (log) logWarn("auth_failed", { reason, source, ...meta });
  
  return send(res, 401, message);
};


export const forbidden = (
  res,
  { reason, source = "unknown", message = "Forbidden", log = true, meta = {} }
) => {
  if (log) logWarn("access_forbidden", { reason, source, ...meta });
  
  return send(res, 403, message);
};


export const conflict = (
  res,
  { reason, source = "unknown", message = "Conflict", log = true, meta = {} }
) => {
  if (log) logWarn("conflict_error", { reason, source, ...meta,});
  

  return send(res, 409, message);
};


export const serverError = (
  res,
  { error, source = "unknown", context = "internal_server_error", log = true, meta = {} }
) => {

  if (log)  logError(context, { error, source, ...meta, reason: context,});
  
  return send(res, 500 , "Server error");

};