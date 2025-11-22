import React, {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderTree,
  Filter,
  Plus,
  Search,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "../../components/common/Navbar";
import InteractiveBackground from "../../components/backgrounds/InteractiveBackground";
import SkeletonCard from "../../components/skeletons/SkeletonCard";

import { useAuth } from "../../hooks/useAuth";
import { useAdminCategories } from "../../hooks/useAdminCategories";

import type { AdminCategory } from "../../types/category.types";
import type { ApiErrorResponse } from "../../types/api.types";
import { ApiClientError } from "../../lib/apiClientError";
import { mapValidationErrors, type FieldErrorMap } from "../../lib/validation";
import * as categoryService from "../../services/category.service";

interface AdminCategoriesProps {
  onLogout: () => void;
}

interface CategoryFormState {
  id?: string;
  name: string;
  description: string;
  iconFile: File | null;
  iconPreviewUrl?: string;
}

const INITIAL_FORM_STATE: CategoryFormState = {
  name: "",
  description: "",
  iconFile: null,
  iconPreviewUrl: undefined,
};

const GOLD_GRADIENT =
  "linear-gradient(135deg, #D4AF37 0%, #f4e7b0 40%, #D4AF37 100%)";

const AdminCategories: React.FC<AdminCategoriesProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    categories,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search,
    status,
    setPage,
    setSearch,
    setStatus,
    reload,
  } = useAdminCategories();

  const [formState, setFormState] =
    useState<CategoryFormState>(INITIAL_FORM_STATE);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const openCreateModal = () => {
    setFormState(INITIAL_FORM_STATE);
    setFieldErrors({});
    setFormGeneralError(null);
    setFormOpen(true);
  };

  const openEditModal = (category: AdminCategory) => {
    setFormState({
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      iconFile: null,
      iconPreviewUrl: category.iconUrl,
    });
    setFieldErrors({});
    setFormGeneralError(null);
    setFormOpen(true);
  };

  const closeModal = () => {
    setFormOpen(false);
    setFormState(INITIAL_FORM_STATE);
    setFieldErrors({});
    setFormGeneralError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormState((prev) => ({
        ...prev,
        iconFile: file,
        iconPreviewUrl: URL.createObjectURL(file),
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        iconFile: null,
      }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormSubmitting(true);
    setFieldErrors({});
    setFormGeneralError(null);

    try {
      const payload = {
        name: formState.name.trim(),
        description: formState.description.trim(),
        iconFile: formState.iconFile ?? undefined,
      };

      let result: AdminCategory;

      if (formState.id) {
        result = await categoryService.updateAdminCategory(
          formState.id,
          payload
        );
        toast.success(`Category "${result.name}" updated`);
      } else {
        result = await categoryService.createAdminCategory(payload);
        toast.success(`Category "${result.name}" created`);
      }

      closeModal();
      reload();
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const data = err.data as ApiErrorResponse | undefined;

        if (data?.errors && Array.isArray(data.errors)) {
          setFieldErrors(mapValidationErrors(data.errors));
        }
        const msg = data?.message || err.message || "Validation failed";
        setFormGeneralError(msg);
        toast.error(msg);
      } else {
        console.error("Category save failed", err);
        const msg = "Unexpected error occurred. Please try again.";
        setFormGeneralError(msg);
        toast.error(msg);
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleCategory = async (category: AdminCategory) => {
    try {
      const updated = await categoryService.toggleAdminCategory(category.id);
      toast.success(
        `Category "${updated.name}" is now ${
          updated.isActive ? "active" : "inactive"
        }`
      );
      reload();
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const msg = err.data?.message || err.message || "Toggle failed";
        toast.error(msg);
      } else {
        console.error("Toggle category failed", err);
        toast.error("Unexpected error while toggling category");
      }
    }
  };

  const emptyState = !loading && categories.length === 0;

  const rangeLabel = useMemo(() => {
    if (total === 0) return "0 of 0";
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `${start}–${end} of ${total}`;
  }, [page, limit, total]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <InteractiveBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <Navbar
          user={user}
          currentPage={location.pathname}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.55)] mb-3"
              style={{ background: GOLD_GRADIENT }}
            >
              <FolderTree className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-black">
                Admin Categories
              </span>
            </div>
            <h1 className="text-gray-100 mb-2 text-2xl font-semibold">
              Manage Categories
            </h1>
            <p className="text-sm text-gray-400">
              Create, update, and toggle article categories for Articly.
            </p>
          </motion.div>

          {/* Error banner */}
          {!loading && error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {/* Toolbar */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-[#D4AF37]/25 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                <button
                  type="button"
                  onClick={() => setStatus("all")}
                  className={`px-3 py-1 rounded-full border text-xs transition-all ${
                    status === "all"
                      ? "bg-[#D4AF37] text-black border-transparent"
                      : "border-[#D4AF37]/30 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`px-3 py-1 rounded-full border text-xs transition-all ${
                    status === "active"
                      ? "bg-emerald-500 text-black border-transparent"
                      : "border-emerald-500/40 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={`px-3 py-1 rounded-full border text-xs transition-all ${
                    status === "inactive"
                      ? "bg-red-500 text-black border-transparent"
                      : "border-red-500/40 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs border border-[#D4AF37]/30 text-gray-200 bg-black/60 hover:bg-white/5 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-black shadow-[0_0_24px_rgba(212,175,55,0.7)]"
                style={{ background: GOLD_GRADIENT }}
              >
                <Plus className="w-4 h-4" />
                New Category
              </button>
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-[#D4AF37]/25"
          >
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!loading && emptyState && (
              <div className="py-12 text-center text-sm text-gray-400">
                No categories found. Create your first category to get started.
              </div>
            )}

            {!loading && !emptyState && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
                        <th className="py-3 pr-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left hidden md:table-cell">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left hidden sm:table-cell">
                          Created
                        </th>
                        <th className="py-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-black/70 border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
                                {cat.iconUrl ? (
                                  <img
                                    src={cat.iconUrl}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-gray-100">
                                  {cat.name}
                                </p>
                                <p className="text-[11px] text-gray-500 md:hidden line-clamp-1">
                                  {cat.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {cat.description}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                                cat.isActive
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                  : "bg-red-500/15 text-red-300 border border-red-500/40"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  cat.isActive ? "bg-emerald-400" : "bg-red-400"
                                }`}
                              />
                              {cat.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className="text-xs text-gray-400">
                              {cat.createdAt
                                ? new Date(cat.createdAt).toLocaleDateString()
                                : "-"}
                            </span>
                          </td>
                          <td className="py-3 pl-4 pr-1">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(cat)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-black/60 text-gray-200 hover:bg-white/10 transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleCategory(cat)}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                                  cat.isActive
                                    ? "border-red-500/50 text-red-300 hover:bg-red-900/40"
                                    : "border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40"
                                }`}
                              >
                                {cat.isActive ? (
                                  <ToggleRight className="w-5 h-5" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                  <span>Showing {rangeLabel}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
                      Page {page} of {totalPages || 1}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl bg-[#050505] border border-[#D4AF37]/40 shadow-[0_0_45px_rgba(0,0,0,0.95)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  {formState.id ? "Edit Category" : "New Category"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {formState.id
                    ? "Update the category details and icon."
                    : "Create a new category for articles."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-xs text-gray-400 hover:text-gray-100"
              >
                Close
              </button>
            </div>

            {formGeneralError && (
              <div className="mb-3 rounded-lg border border-red-500/40 bg-red-900/40 px-3 py-2 text-xs text-red-100">
                {formGeneralError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
                  placeholder="e.g. Tech & Gadgets"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-red-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 resize-none"
                  placeholder="Short description of what content belongs to this category."
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-[11px] text-red-400">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black/70 border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
                    {formState.iconPreviewUrl ? (
                      <img
                        src={formState.iconPreviewUrl}
                        alt="Icon preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs text-gray-300"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      PNG/JPG, max 2MB. Optional but recommended.
                    </p>
                    {fieldErrors.iconUrl && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {fieldErrors.iconUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs border border-white/15 text-gray-200 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || !formState.name.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(212,175,55,0.7)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  {formSubmitting
                    ? "Saving..."
                    : formState.id
                      ? "Save changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
