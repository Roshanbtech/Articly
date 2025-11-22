// src/pages/dashboard/UserArticles.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from '../../components/backgrounds/InteractiveBackground';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import MyArticleCard from '../../components/articles/MyArticleCard';
import ArticleFormModal, {
  type CategoryOption,
} from '../../components/articles/ArticleFormModal';
import { useAuth } from '../../hooks/useAuth';
import { useMyArticles } from '../../hooks/useMyArticles';
import { listCategories } from '../../services/category.service';
import type { Article } from '../../types/article.types';
import { Search } from 'lucide-react';

export default function UserArticlesPage({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    articles,
    setArticles,
    loading,
    error,
    page,
    totalPages,
    search,
    setPage,
    setSearch,
    reload,
  } = useMyArticles({ initialPage: 1, initialLimit: 10 });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

useEffect(() => {
  (async () => {
    try {
      const result = await listCategories(); // Category[]
      const mapped: CategoryOption[] = result.map((c) => ({
        id: c.id,
        name: c.name,
      }));
      setCategories(mapped);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  })();
}, []);

  const handleNavigate = useCallback((path: string) => navigate(path), []);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleUpdated = (updated: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleDeleted = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleArticleUpdatedFromModal = (updated: Article) => {
    handleUpdated(updated);
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <InteractiveBackground />
      <Navbar
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }}
        currentPage="/user/articles"
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] mb-1">
              My Articles
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Manage your published content.
            </h1>
          </div>

          <button
            onClick={() => {
              setEditingArticle(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-black shadow-[0_0_25px_rgba(212,175,55,0.8)]"
            style={{
              background:
                'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)',
            }}
          >
            <span>＋ New Article</span>
          </button>
        </header>

        <section className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search in my articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white pl-9 pr-3 py-2.5"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center w-10">
              <Loader />
            </div>
          )}
        </section>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-600/60 bg-red-900/30 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
                <p className="mb-2">You haven’t created any articles yet.</p>
                <p className="text-xs">
                  Start by creating a new article from the button above.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <MyArticleCard
                    key={article.id}
                    article={article}
                    onEdit={handleEdit}
                    onArticleUpdated={handleUpdated}
                    onArticleDeleted={handleDeleted}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 border border-zinc-700 text-zinc-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs text-zinc-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 border border-zinc-700 text-zinc-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create / Edit modal */}
      <ArticleFormModal
        open={modalOpen}
        mode={editingArticle ? 'edit' : 'create'}
        categories={categories}
        initialArticle={editingArticle ?? undefined}
        onClose={() => setModalOpen(false)}
        onArticleCreated={() => {
          setPage(1);
          reload();
        }}
        onArticleUpdated={handleArticleUpdatedFromModal}
      />
    </div>
  );
}
