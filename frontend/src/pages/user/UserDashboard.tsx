// src/pages/dashboard/UserDashboard.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import InteractiveBackground from '../../components/backgrounds/InteractiveBackground';
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import BannerCarousel from '../../components/common/BannerCarousel';
import FeedArticleCard from '../../components/articles/FeedArticleCard';
import ArticleFormModal, {
  type CategoryOption,
} from '../../components/articles/ArticleFormModal';
import { useAuth } from '../../hooks/useAuth';
import { useArticleFeed } from '../../hooks/useArticleFeed';
import { usePublicBanners } from '../../hooks/usePublicBanners';
import { listCategories } from '../../services/category.service'; // already exist in your project
import type { Article } from '../../types/article.types';
import { Search } from 'lucide-react';

export default function UserDashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );
  const {
    articles,
    setArticles,
    loading,
    error,
    page,
    totalPages,
    search,
    categoryId,
    setPage,
    setSearch,
    setCategoryId,
    reload,
  } = useArticleFeed({ initialPage: 1, initialLimit: 9 });

  const { banners } = usePublicBanners();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const result = await listCategories(); // result: Category[]
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


  const handleArticleUpdateFromCard = (updated: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleArticleCreated = () => {
    setPage(1);
    reload();
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
        currentPage="/user"
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] mb-1">
              Welcome back, {user.firstName}
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Discover articles tailored to your interests.
            </h1>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-black shadow-[0_0_25px_rgba(212,175,55,0.8)]"
            style={{
              background:
                'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)',
            }}
          >
            <span>＋ Create Article</span>
          </button>
        </header>

        {/* Filters */}
        <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-black/70 border border-zinc-700 focus:border-[#D4AF37] focus:ring-0 text-sm text-white pl-9 pr-3 py-2.5"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryId(null)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                !categoryId
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#f4e7b0]'
                  : 'border-zinc-700 bg-black/60 text-zinc-300 hover:border-[#D4AF37]/60'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  categoryId === c.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#f4e7b0]'
                    : 'border-zinc-700 bg-black/60 text-zinc-300 hover:border-[#D4AF37]/60'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* Banners carousel */}
        <BannerCarousel banners={banners} />

        {/* Articles grid */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
                <p className="mb-2">No articles found for this filter.</p>
                <p className="text-xs">
                  Try adjusting your search or categories, or create a new
                  article.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <FeedArticleCard
                    key={article.id}
                    article={article}
                    onArticleUpdated={handleArticleUpdateFromCard}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
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

      {/* Create article modal */}
      <ArticleFormModal
        open={createOpen}
        mode="create"
        categories={categories}
        onClose={() => setCreateOpen(false)}
        onArticleCreated={handleArticleCreated}
      />
    </div>
  );
}
