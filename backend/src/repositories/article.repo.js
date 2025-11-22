import Article from "../models/Article.js";

const basePopulate = (query) =>
  query
    .populate("category", "name")
    .populate("author", "firstName lastName");

export const createArticle = async (data) => {
  const created = await Article.create(data);
  return basePopulate(Article.findById(created._id));
};

export const findById = (id) => {
  return basePopulate(Article.findById(id));
};

export const updateById = (id, data) => {
  return basePopulate(
    Article.findByIdAndUpdate(id, data, { new: true })
  );
};

export const deleteById = (id) => {
  return Article.findByIdAndDelete(id);
};

export const findMany = (filter, { skip, limit }) => {
  return basePopulate(
    Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  );
};

export const count = (filter) => {
  return Article.countDocuments(filter);
};
