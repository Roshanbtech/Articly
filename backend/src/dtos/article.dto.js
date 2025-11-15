export const articleDTO = (article) => {
  if (!article) return null;

  return {
    id: article._id,
    title: article.title,
    description: article.description,
    images: article.images || [],
    tags: article.tags || [],
    category: article.category,
    author: article.author,
    likesCount: article.likesCount,
    dislikesCount: article.dislikesCount,
    blocksCount: article.blocksCount,
    isPublished: article.isPublished,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
