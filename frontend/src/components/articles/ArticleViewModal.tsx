// src/components/articles/ArticleViewModal.tsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  User as UserIcon,
  Clock,
  Tag as TagIcon,
  Heart,
  ThumbsDown,
  Slash,
} from 'lucide-react';
import type { Article } from '../../types/article.types';
import {
  likeArticle,
  dislikeArticle,
  blockArticle,
} from '../../services/reaction.service';
import { toast } from 'sonner';
import Loader from '../common/Loader';

const GOLD_GRADIENT =
  'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)';

interface ArticleViewModalProps {
  open: boolean;
  article: Article | null;
  onClose: () => void;
  onArticleUpdated?: (article: Article) => void;
}

export default function ArticleViewModal({
  open,
  article,
  onClose,
  onArticleUpdated,
}: ArticleViewModalProps) {
  const [current, setCurrent] = useState<Article | null>(article);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCurrent(article || null);
  }, [article]);

  // Close on ESC key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('[ArticleViewModal] ESC pressed -> close');
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleReact = async (type: 'like' | 'dislike' | 'block') => {
    if (!current) return;
    try {
      setBusy(true);
      let updated: Article;

      if (type === 'like') {
        updated = await likeArticle(current.id);
      } else if (type === 'dislike') {
        updated = await dislikeArticle(current.id);
      } else {
        updated = await blockArticle(current.id);
      }

      setCurrent(updated);
      onArticleUpdated?.(updated);
    } catch (err: any) {
      console.error('Reaction failed in view modal', err);
      toast.error(
        err?.message || 'Unable to update reaction. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const publishedAt = current
    ? new Date(current.createdAt).toLocaleString()
    : '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/80 backdrop-blur-2xl overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => {
            console.log('[ArticleViewModal] overlay click -> close');
            onClose();
          }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full max-w-3xl mt-16 mb-10 mx-4 md:mx-0 rounded-3xl border border-[#D4AF37]/40 bg-black/95 shadow-[0_0_60px_rgba(0,0,0,1)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()} // don't close when clicking content
          >
            {/* Close button */}
            <button
              onClick={() => {
                console.log('[ArticleViewModal] close button clicked');
                onClose();
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 border border-zinc-700 flex items-center justify-center text-zinc-200 hover:border-[#D4AF37]/70 hover:text-[#D4AF37]"
            >
              <X className="w-4 h-4" />
            </button>

            {!current ? (
              <div className="flex items-center justify-center py-16">
                <Loader />
              </div>
            ) : (
              <>
                {/* Hero image */}
                {current.images && current.images.length > 0 && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <motion.img
                      src={current.images[0]}
                      alt={current.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    {current.categoryName && (
                      <div
                        className="absolute bottom-4 left-5 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-black"
                        style={{ background: GOLD_GRADIENT }}
                      >
                        {current.categoryName}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 md:p-8 space-y-5">
                  {/* Title + meta */}
                  <div className="space-y-2">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-[#D4AF37]/80">
                      Featured Article
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">
                      {current.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>{current.authorName || 'Unknown Author'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{publishedAt}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {current.tags && current.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {current.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#f5e9b8]"
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description / content */}
                  <div className="mt-2 text-sm leading-relaxed text-zinc-200 whitespace-pre-line">
                    {current.description}
                  </div>

                  {/* Reactions summary */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/70">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{current.likesCount} likes</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ThumbsDown className="w-3.5 h-3.5 text-amber-300" />
                        <span>{current.dislikesCount} dislikes</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Slash className="w-3.5 h-3.5 text-red-300" />
                        <span>{current.blocksCount} blocks</span>
                      </span>
                    </div>

                    {/* Reaction buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy}
                        onClick={() => handleReact('like')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-emerald-200 bg-emerald-900/30 border border-emerald-500/60 hover:bg-emerald-800/60 disabled:opacity-50"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Like</span>
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleReact('dislike')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-amber-200 bg-amber-900/30 border border-amber-500/60 hover:bg-amber-800/60 disabled:opacity-50"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Dislike</span>
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleReact('block')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-red-200 bg-red-900/40 border border-red-500/70 hover:bg-red-800/70 disabled:opacity-50"
                      >
                        <Slash className="w-3.5 h-3.5" />
                        <span>Block</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
