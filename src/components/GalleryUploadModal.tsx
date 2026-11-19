import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import type { GalleryPhotoRecord } from '../data/clinicData';

export function GalleryUploadModal() {
  const { uploaderOpen, uploaderCategory, closeUploader, addPhoto } = useClinic();

  const [category, setCategory] = useState<GalleryPhotoRecord['category']>(uploaderCategory);
  const [title, setTitle] = useState('');
  const [branchId, setBranchId] = useState<'civil-lines' | 'zero-road' | 'both'>('civil-lines');
  const [caption, setCaption] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setCategory(uploaderCategory);
  }, [uploaderCategory]);

  useEffect(() => {
    if (!uploaderOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeUploader();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [uploaderOpen, closeUploader]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Please select a JPEG, PNG, or WebP photograph.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Please choose an image smaller than 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!previewDataUrl) {
      setUploadError('Please choose an authentic clinic photograph to upload.');
      return;
    }
    setUploading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title,
          branchId,
          caption,
          imageDataUrl: previewDataUrl,
        }),
      });
      const data = (await res.json()) as { photo?: GalleryPhotoRecord; error?: string };
      if (!res.ok || !data.photo) {
        throw new Error(data.error || 'Could not upload photograph.');
      }
      addPhoto(data.photo);
      setTitle('');
      setCaption('');
      setPreviewDataUrl('');
      closeUploader();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {uploaderOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#061525]/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeUploader}
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-upload-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#082B48] border border-[#082B48]/15 dark:border-[#00D9FF]/30 shadow-2xl"
          >
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#061525] to-[#082B48] border-b border-[#00D9FF]/20 flex items-center justify-between text-white">
              <div>
                <h3 id="global-upload-modal-title" className="font-display text-lg font-bold">
                  Upload Authentic Clinic Photograph
                </h3>
                <p className="text-xs text-[#DFFAFF]/75 mt-0.5">
                  Saved directly to the clinic media library
                </p>
              </div>
              <button
                type="button"
                onClick={closeUploader}
                className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-[#00D9FF] hover:text-[#061525] transition-colors cursor-pointer"
                aria-label="Close upload dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as GalleryPhotoRecord['category'])
                    }
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white"
                  >
                    <option value="exterior">Clinic Exterior</option>
                    <option value="reception">Reception &amp; Interiors</option>
                    <option value="treatment-area">Treatment Areas</option>
                    <option value="equipment">Actual Equipment</option>
                    <option value="doctor-portrait">Doctor Portrait</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                    Branch
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) =>
                      setBranchId(e.target.value as 'civil-lines' | 'zero-road' | 'both')
                    }
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white"
                  >
                    <option value="civil-lines">Civil Lines Branch</option>
                    <option value="zero-road">Zero Road Branch</option>
                    <option value="both">General / Clinic Wide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                  Photograph Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Civil Lines Clinic Facade"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Brief description of this clinic space or equipment"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                  Select Image File (JPEG, PNG, WebP)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="w-full text-xs text-[#061525]/75 dark:text-[#DFFAFF]/80 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#DFFAFF] dark:file:bg-[#061525] file:text-[#061525] dark:file:text-[#00D9FF] hover:file:bg-[#00C6B7] hover:file:text-white cursor-pointer"
                />
              </div>

              {previewDataUrl && (
                <div className="rounded-xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/25 max-h-44 flex items-center justify-center bg-[#EDF7FC] dark:bg-[#061525]">
                  <img src={previewDataUrl} alt="Upload preview" className="max-h-44 object-contain" />
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-medium text-red-500" role="alert">
                  {uploadError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeUploader}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] disabled:opacity-60 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Save Photograph'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
