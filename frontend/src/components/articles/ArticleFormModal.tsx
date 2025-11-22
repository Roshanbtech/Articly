// src/components/articles/ArticleFormModal.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Tag, FolderTree } from 'lucide-react';
import type { Article } from '../../types/article.types';
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from '../../types/article.types';
import { createArticle, updateArticle } from '../../services/article.service';
import { ApiClientError } from '../../lib/apiClientError';
import { mapValidationErrors, type FieldErrorMap } from '../../lib/validation';
import Loader from '../common/Loader';
import { toast } from 'sonner';

export interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  categories: CategoryOption[];
  initialArticle?: Article | null;
  onClose: () => void;
  onArticleCreated?: (article: Article) => void;
  onArticleUpdated?: (article: Article) => void;
}

const GOLD_GRADIENT =
  'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)';

export default function ArticleFormModal({
  open,
  mode,
  categories,
  initialArticle,
  onClose,
  onArticleCreated,
  onArticleUpdated,
}: ArticleFormModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialArticle) {
      setTitle(initialArticle.title);
      setCategoryId(initialArticle.category);
      setDescription(initialArticle.description);
      setTagsInput(initialArticle.tags.join(', '));
      setImages([]);
    } else if (mode === 'create') {
      setTitle('');
      setCategoryId('');
      setDescription('');
      setTagsInput('');
      setImages([]);
    }
    setFieldErrors({});
    setGeneralError(null);
  }, [mode, initialArticle, open]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImages(arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (mode === 'create') {
        const payload: CreateArticlePayload = {
          title,
          description,
          category: categoryId,
          tags,
          images,
        };
        const created = await createArticle(payload);
        onArticleCreated?.(created);
        toast.success('Article created successfully.');
      } else if (mode === 'edit' && initialArticle) {
        const payload: UpdateArticlePayload = {
          title,
          description,
          category: categoryId,
          tags,
          images: images.length ? images : undefined,
        };
        const updated = await updateArticle(initialArticle.id, payload);
        onArticleUpdated?.(updated);
        toast.success('Article updated successfully.');
      }

      onClose();
    } catch (err: any) {
      console.error('Article form submit failed', err);
      if (err instanceof ApiClientError) {
        const apiErr = err as ApiClientError;
        const issues = (apiErr.data as any)?.errors;
        if (Array.isArray(issues)) {
          setFieldErrors(mapValidationErrors(issues));
        }
        setGeneralError(
          (apiErr.data as any)?.message ||
            apiErr.message ||
            'Something went wrong.'
        );
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
  {open && (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 backdrop-blur-xl overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        className="w-full max-w-2xl mt-20 mb-10 mx-4 md:mx-0 rounded-3xl border border-[#D4AF37]/40 bg-black/90 shadow-[0_0_50px_rgba(0,0,0,1)] p-6 md:p-8 relative max-h-[80vh] overflow-y-auto"
      >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 border border-zinc-700 flex items-center justify-center text-zinc-200 hover:border-[#D4AF37]/70 hover:text-[#D4AF37]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">
              {mode === 'create' ? 'Create New Article' : 'Edit Article'}
            </h2>
            <p className="text-sm text-zinc-400 mb-5">
              Share your knowledge with the community.
            </p>

            {generalError && (
              <div className="mb-4 rounded-xl border border-red-600/60 bg-red-900/30 px-3 py-2 text-sm text-red-100">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white px-3 py-2.5"
                  placeholder="Enter a compelling title"
                />
                {fieldErrors.title && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">
                  Category
                </label>
                <div className="relative">
                  <FolderTree className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white pl-9 pr-3 py-2.5 appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.category && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white px-3 py-2.5 resize-y"
                  placeholder="Write your article content here..."
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white pl-9 pr-3 py-2.5"
                    placeholder="Add tags separated by commas"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-1">
                  Images
                </label>
                <label className="flex items-center justify-between rounded-xl border border-dashed border-zinc-700 hover:border-[#D4AF37]/70 bg-black/60 px-4 py-3 text-sm text-zinc-300 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <ImagePlus className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {images.length
                        ? `${images.length} file(s) selected`
                        : 'Click to upload images (optional)'}
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm text-black font-medium shadow-[0_0_25px_rgba(212,175,55,0.7)] disabled:opacity-60"
                  style={{ background: GOLD_GRADIENT }}
                >
                  {submitting && <Loader />}
                  <span>{mode === 'create' ? 'Publish Article' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
