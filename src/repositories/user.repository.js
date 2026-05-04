import User from "../models/user.model.js";

export const findUserForAuth = async (userId) => {
  return User.findById(userId)
    .select("_id role organizationId isActive")
    .lean();
};

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const findUserById = (userId) => {
  return User.findById(userId);
};

export const createUser = (data, session) => {
  return User.create([data], { session });
};