import User from "../models/User.js";

export const findByEmailOrPhone = async (email, phone) => {
  return User.findOne({ $or: [{ email }, { phone }] });
};

export const findByIdentifier = async (identifier) => {
  const query = identifier.includes("@") ? { email: identifier } : { phone: identifier };
  return User.findOne(query);
};

export const findById = async (id) => {
  return User.findById(id);
};

export const createUser = async (data) => {
  return User.create(data);
};

export const updateById = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteById = async (id) => {
  return User.findByIdAndDelete(id);
};

export const findMany = async (filter, { skip, limit }) => {
  return User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const count = async (filter) => {
  return User.countDocuments(filter);
};
