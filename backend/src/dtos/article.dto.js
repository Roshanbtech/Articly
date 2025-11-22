export const articleDTO = (article) => {
  if (!article) return null;

  const category = article.category;
  const author = article.author;

  const categoryId =
    category && typeof category === "object" ? category._id : category;

  const categoryName =
    category && typeof category === "object" ? category.name ?? null : null;

  const authorId =
    author && typeof author === "object" ? author._id : author;

  const authorName =
    author && typeof author === "object"
      ? [author.firstName, author.lastName].filter(Boolean).join(" ")
      : null;

  return {
    id: article._id,
    title: article.title,
    description: article.description,
    images: article.images || [],
    tags: article.tags || [],
    category: categoryId,          
    categoryName,                  
    author: authorId,             
    authorName,              
    likesCount: article.likesCount,
    dislikesCount: article.dislikesCount,
    blocksCount: article.blocksCount,
    isPublished: article.isPublished,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
