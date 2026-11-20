import { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import type { GalleryPhotoRecord } from '../../data/clinicData';
import { useAuth } from '../../context/AuthContext';
import { useClinic } from '../../context/ClinicContext';
import {
  compressImageFileToDataUrl,
  createGalleryPhoto,
  deleteGalleryPhoto,
  updateGalleryPhoto,
} from '../../services/clinicFirestore';

const CATEGORY_OPTIONS: { value: GalleryPhotoRecord['category']; label: string }[] = [
  { value: 'exterior', label: 'Clinic Exterior' },
  { value: 'reception', label: 'Reception & Interiors' },
  { value: 'treatment-area', label: 'Treatment Areas' },
  { value: 'equipment', label: 'Dental Equipment' },
  { value: 'doctor-portrait', label: 'Doctor Portrait' },
];

const BRANCH_OPTIONS: { value: GalleryPhotoRecord['branchId']; label: string }[] = [
  { value: 'civil-lines', label: 'Civil Lines (Primary)' },
  { value: 'zero-road', label: 'Zero Road (Second Branch)' },
  { value: 'both', label: 'Mittal Dental Clinic (Both)' },
];

export function AdminGallerySection() {
  const { user } = useAuth();
  const { gallery, addPhoto, updatePhotoState, deletePhoto } = useClinic();

  // Upload new photo form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [category, setCategory] = useState<GalleryPhotoRecord['category']>('exterior');
  const [branchId, setBranchId] = useState<GalleryPhotoRecord['branchId']>('civil-lines');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  // Edit existing photo state
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoRecord | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] =
    useState<GalleryPhotoRecord['category']>('exterior');
  const [editBranchId, setEditBranchId] =
    useState<GalleryPhotoRecord['branchId']>('civil-lines');
  const [editImageDataUrl, setEditImageDataUrl] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFilePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'new' | 'edit',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    if (target === 'new') setUploadError('');
    else setEditError('');

    try {
      const compressed = await compressImageFileToDataUrl(file);
      if (target === 'new') {
        setImageDataUrl(compressed);
        if (!title.trim()) {
          setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 80));
        }
      } else {
        setEditImageDataUrl(compressed);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Image optimization failed.';
      if (target === 'new') setUploadError(msg);
      else setEditError(msg);
    } finally {
      setCompressing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUploadError('');
    setStatusNotice('');
    setUploading(true);
    try {
      const created = await createGalleryPhoto(
        { category, title, branchId, caption, imageDataUrl },
        user.uid,
      );
      addPhoto(created);
      setTitle('');
      setCaption('');
      setImageDataUrl('');
      setShowUploadForm(false);
      setStatusNotice(`Uploaded "${created.title}" to the clinic gallery.`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (photo: GalleryPhotoRecord) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title);
    setEditCaption(photo.caption);
    setEditCategory(photo.category);
    setEditBranchId(photo.branchId);
    setEditImageDataUrl(photo.imageDataUrl);
    setEditError('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingPhoto) return;
    setEditError('');
    setStatusNotice('');
    setSavingEdit(true);
    try {
      await updateGalleryPhoto(
        editingPhoto.id,
        {
          category: editCategory,
          title: editTitle,
          branchId: editBranchId,
          caption: editCaption,
          imageDataUrl: editImageDataUrl,
        },
        user.uid,
      );
      updatePhotoState({
        ...editingPhoto,
        category: editCategory,
        title: editTitle.trim(),
        branchId: editBranchId,
        caption: editCaption.trim(),
        imageDataUrl: editImageDataUrl,
      });
      setStatusNotice(`Updated "${editTitle.trim()}".`);
      setEditingPhoto(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Could not update photo.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (photo: GalleryPhotoRecord) => {
    setDeletingId(photo.id);
    setStatusNotice('');
    try {
      await deleteGalleryPhoto(photo.id);
      deletePhoto(photo.id);
      setStatusNotice(`Removed "${photo.title}" from the gallery.`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gallery Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload, edit, or delete authentic clinic photographs displayed on the public Gallery and About pages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploadForm((v) => !v)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shrink-0 cursor-pointer"
        >
          {showUploadForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showUploadForm ? 'Close Uploader' : 'Upload New Photo'}</span>
        </button>
      </div>

      {statusNotice && (
        <div
          role="status"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Upload New Photo Panel */}
      {showUploadForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900">Add New Clinic Photograph</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryPhotoRecord['category'])}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Branch *
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value as GalleryPhotoRecord['branchId'])}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Photo Title *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Civil Lines Clinic Reception"
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Caption (Optional)
              </label>
              <input
                type="text"
                maxLength={250}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short description shown under the photo"
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <label className="block">
                <span className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:border-teal-500 text-xs font-semibold text-slate-700 cursor-pointer">
                  <ImagePlus className="w-4 h-4 text-teal-600" />
                  <span>{compressing ? 'Optimizing image...' : 'Choose JPEG / PNG / WebP File'}</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => void handleFilePick(e, 'new')}
                  className="sr-only"
                />
              </label>
              <input
                type="url"
                value={imageDataUrl.startsWith('https://') ? imageDataUrl : ''}
                onChange={(e) => setImageDataUrl(e.target.value)}
                placeholder="Or paste HTTPS image URL (https://...)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
              />
            </div>

            {imageDataUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/10] max-h-40">
                <img
                  src={imageDataUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-xs font-semibold text-red-600" role="alert">
              {uploadError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 min-h-[42px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || compressing || !imageDataUrl}
              className="inline-flex items-center gap-2 px-5 py-2 min-h-[42px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-55 text-white text-xs font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Save Photo'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Photos Grid */}
      {gallery.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">No clinic photographs uploaded yet</p>
          <p className="text-xs text-slate-500">
            Click &ldquo;Upload New Photo&rdquo; above to publish verified photographs of Civil Lines or Zero Road.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={photo.imageDataUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-teal-700">
                    <span>
                      {CATEGORY_OPTIONS.find((c) => c.value === photo.category)?.label ||
                        photo.category}
                    </span>
                    <span className="text-slate-400">
                      {photo.branchId === 'civil-lines'
                        ? 'Civil Lines'
                        : photo.branchId === 'zero-road'
                          ? 'Zero Road'
                          : 'Both'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{photo.title}</h3>
                  {photo.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2">{photo.caption}</p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(photo)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  disabled={deletingId === photo.id}
                  onClick={() => void handleDelete(photo)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 text-xs font-semibold text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingId === photo.id ? 'Removing...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Edit Gallery Photograph"
        >
          <form
            onSubmit={handleUpdate}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Photograph Details</h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                aria-label="Close edit dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={editImageDataUrl}
                  alt={editTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="block">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline cursor-pointer">
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Replace Photograph File</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => void handleFilePick(e, 'edit')}
                  className="sr-only"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as GalleryPhotoRecord['category'])
                    }
                    className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={editBranchId}
                    onChange={(e) =>
                      setEditBranchId(e.target.value as GalleryPhotoRecord['branchId'])
                    }
                    className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
                  >
                    {BRANCH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption</label>
                <input
                  type="text"
                  maxLength={250}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              {editError && (
                <p className="text-xs font-semibold text-red-600" role="alert">
                  {editError}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || compressing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
