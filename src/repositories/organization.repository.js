import Organization from "../models/organization.model.js";

export const createOrganization = (data, session) => {
  return Organization.create([data], { session });
};

export const updateOrganizationOwner = (organization, ownerId, session) => {
  organization.ownerId = ownerId;
  return organization.save({ session });
};