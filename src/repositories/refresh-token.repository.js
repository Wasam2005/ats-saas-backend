import RefreshToken from "../models/refresh-token.model.js";

export const createRefreshToken = (data) => {
  return RefreshToken.create(data);
};

export const findAndDeleteRefreshTokenByHash = (hashedToken) => {
  return RefreshToken.findOneAndDelete(
    { token: hashedToken },
    {
      projection: { userId: 1, expiresAt: 1 }
    }
  ).lean();
};

export const deleteAllRefreshTokensByUser = (userId) => {
  return RefreshToken.deleteMany({ userId });
};