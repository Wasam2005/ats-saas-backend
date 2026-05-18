import mongoose from "mongoose";
import { APPLICATION_STAGES } from "../constants/application.constants.js";
import {JOB_STATUSES} from "../constants/job.constant.js";
export const isNonEmptyString = (value) => {
  if (typeof value !== "string") return false;

  if (value.trim() === "") return false;

  return true;
};

export const isValidCompanyDomain = (value) => {
  if (!isNonEmptyString(value)) return false;
  const normalizedValue = value.trim().toLowerCase();
   

  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;

  return domainRegex.test(normalizedValue);
};

export const isValidEmail = (email) => {
  if (!isNonEmptyString(email)) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(normalizedEmail);
};

export const isValidPassword = (password) => {
  if (typeof password !== "string") return false;

  if (password.length < 8 || password.length > 128) return false;

  return true;
};


export const isValidSkillsArray = (skills) => {
  if (!Array.isArray(skills)) return false;

  return skills.every(
    (skill) =>
      typeof skill === "string" &&
      skill.trim() !== ""
  );
};

export const isValidPhoneNumber = (phone) => {
  if (!isNonEmptyString(phone)) return false;

  const normalizedPhone = phone.trim();

  const phoneRegex = /^\+?[1-9]\d{7,14}$/;

  return phoneRegex.test(normalizedPhone);
};


export const isValidTitle = (title) => {
  if(!isNonEmptyString(title) || title.length < 3 || title.length > 100 ) return false;
   return true;
}
export const isValidDescription = (description) => {
  if (!isNonEmptyString(description) || description.length < 10 || description.length > 5000)
    return false;
  return true;
};



export const isValidJobStatus = (status) => {
    if (!isNonEmptyString(status)) {return false;}
    return JOB_STATUSES.includes(status);
  };


export const isValidObjectId = (value) => {
    if (!isNonEmptyString(value)) return false;
  
  return mongoose.Types.ObjectId.isValid(value);
};

export const isValidApplicationStage = (stage) => {

    if (!isNonEmptyString(stage))  return false;
    return APPLICATION_STAGES.includes(stage);
  };

  export const isValidDate = (value) =>{
  if (!value) return false;
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

export const isFutureDate = (value) => {
  if (!isValidDate(value)) return false;

  return (new Date(value) >  new Date());
};

