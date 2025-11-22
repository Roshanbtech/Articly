// src/components/articles/MyArticleCard.tsx
import { motion } from 'framer-motion';
import {
  Edit2,
  Trash2,
  Globe2,
  EyeOff,
  Clock,
  Tag,
} from 'lucide-react';
import type { Article } from '../../types/article.types';
import { togglePublish, deleteArticle } from '../../services/article.service';
import { useState } from 'react';
import { toast } from 'sonner';

interface MyArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onArticleUpdated: (article: Article) => void;
  onArticleDeleted: (id: string) => void;
}

const GOLD_GRADIENT =
  'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)';

export default function MyArticleCard({
  article,
  onEdit,
  onArticleUpdated,
  onArticleDeleted,
}: MyArticleCardProps) {
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const primaryImage = article.images[0];
  const publishedAt = new Date(article.createdAt).toLocaleDateString();

  const handleTogglePublish = async () => {
    try {
      setBusy(true);
      const updated = await togglePublish(article.id);
      onArticleUpdated(updated);
      toast.success(
        updated.isPublished ? 'Article published' : 'Article unpublished'
      );
    } catch (err: any) {
      console.error('Toggle publish failed', err);
      toast.error(err?.message || 'Unable to toggle publish state.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    try {
      setBusy(true);
      await deleteArticle(article.id);
      onArticleDeleted(article.id);
      toast.success('Article deleted');
    } catch (err: any) {
      console.error('Delete article failed', err);
      toast.error(err?.message || 'Unable to delete article.');
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-2xl border border-[#D4AF37]/30 bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
    >
      {primaryImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={primaryImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-zinc-300/90 line-clamp-2">
              {article.description}
            </p>
          </div>

          <button
            onClick={handleTogglePublish}
            disabled={busy}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition-all ${
              article.isPublished
                ? 'border-emerald-400/60 text-emerald-300 bg-emerald-900/30'
                : 'border-zinc-500/70 text-zinc-300 bg-zinc-900/60'
            }`}
          >
            {article.isPublished ? (
              <>
                <Globe2 className="w-3.5 h-3.5" />
                <span>Published</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Draft</span>
              </>
            )}
          </button>
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

        <div className="flex items-center justify-between border-t border-zinc-800/70 pt-3 mt-auto">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{publishedAt}</span>
            </span>
            <span className="text-[11px] text-zinc-500">
              {article.likesCount} likes · {article.dislikesCount} dislikes ·{' '}
              {article.blocksCount} blocks
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!confirmingDelete && (
              <>
                <button
                  onClick={() => onEdit(article)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-600/70 text-zinc-100 hover:border-[#D4AF37]/70 hover:text-[#D4AF37]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-900/30 border border-red-600/70 text-red-200 hover:bg-red-800/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {confirmingDelete && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  disabled={busy}
                  onClick={handleDelete}
                  className="px-3 py-1 rounded-lg bg-red-700 text-white hover:bg-red-600 text-xs"
                >
                  Confirm
                </button>
                <button
                  disabled={busy}
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
