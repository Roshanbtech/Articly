export const categoryDTO = (category, options = {}) => {
  if (!category) return null;

  const base = {
    id: category._id,
    name: category.name,
    description: category.description,
    iconUrl: category.iconUrl,
  };

  if (options.includeAdminFields) {
    return {
      ...base,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      createdBy: category.createdBy,
    };
  }

  return base;
};
