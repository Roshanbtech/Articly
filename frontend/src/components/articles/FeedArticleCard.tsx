// src/components/articles/FeedArticleCard.tsx
import { motion } from "framer-motion";
import {
  Heart,
  ThumbsDown,
  Slash,
  Tag,
  Clock,
  User as UserIcon,
} from "lucide-react";
import type { Article } from "../../types/article.types";
import {
  likeArticle,
  dislikeArticle,
  blockArticle,
} from "../../services/reaction.service";
import { useState } from "react";
import { toast } from "sonner";

interface FeedArticleCardProps {
  article: Article;
  onArticleUpdated?: (article: Article) => void;
  onOpenArticle?: (article: Article) => void;
}

const GOLD_GRADIENT =
  "linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)";

export default function FeedArticleCard({
  article,
  onArticleUpdated,
  onOpenArticle,
}: FeedArticleCardProps) {
  const [loading, setLoading] = useState(false);

  const primaryImage = article.images[0];

  const handleCardClick = () => {
    onOpenArticle?.(article);
  }

  const handleReact = async (type: "like" | "dislike" | "block") => {
    try {
      setLoading(true);
      let updated;
      if (type === "like") updated = await likeArticle(article.id);
      else if (type === "dislike") updated = await dislikeArticle(article.id);
      else updated = await blockArticle(article.id);

      onArticleUpdated?.(updated);
    } catch (err: any) {
      console.error("Reaction failed", err);
      toast.error(
        err?.message || "Unable to update reaction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const publishedAt = new Date(article.createdAt).toLocaleDateString();

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-2xl border border-[#D4AF37]/30 bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
      onClick={handleCardClick}
   >
      {primaryImage && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={primaryImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {article.categoryName && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-black"
              style={{ background: GOLD_GRADIENT }}
            >
              {article.categoryName}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-zinc-300/90 line-clamp-3">
            {article.description}
          </p>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#f5e9b8]"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/70 mt-auto">
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>
                {article?.authorName || "Unknown Author"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{publishedAt}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleReact("like");
              }}
              className="flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 disabled:opacity-50"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{article.likesCount}</span>
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleReact("dislike");
              }}
              className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 disabled:opacity-50"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{article.dislikesCount}</span>
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleReact("block");
              }}
              className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 disabled:opacity-50"
            >
              <Slash className="w-3.5 h-3.5" />
              <span>{article.blocksCount}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
