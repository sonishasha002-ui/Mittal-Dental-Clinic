import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  INITIAL_BRANCHES,
  type BranchInfo,
  type GalleryPhotoRecord,
} from '../data/clinicData';

interface ClinicContextValue {
  branches: BranchInfo[];
  gallery: GalleryPhotoRecord[];
  loading: boolean;
  updateBranch: (updated: BranchInfo) => void;
  addPhoto: (photo: GalleryPhotoRecord) => void;
  deletePhoto: (id: string) => void;
  uploaderOpen: boolean;
  uploaderCategory: GalleryPhotoRecord['category'];
  openUploader: (category?: GalleryPhotoRecord['category']) => void;
  closeUploader: () => void;
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<BranchInfo[]>(INITIAL_BRANCHES);
  const [gallery, setGallery] = useState<GalleryPhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [uploaderCategory, setUploaderCategory] =
    useState<GalleryPhotoRecord['category']>('exterior');

  useEffect(() => {
    let active = true;
    fetch('/api/clinic-data')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { branches?: BranchInfo[]; gallery?: GalleryPhotoRecord[] } | null) => {
        if (!active || !data) return;
        if (Array.isArray(data.branches) && data.branches.length === 2) {
          setBranches(
            data.branches.map((b) => {
              const fallback = INITIAL_BRANCHES.find((init) => init.id === b.id);
              return {
                ...b,
                embedMapUrl: b.embedMapUrl || fallback?.embedMapUrl || '',
              };
            }),
          );
        }
        if (Array.isArray(data.gallery)) {
          setGallery(data.gallery);
        }
      })
      .catch(() => {
        // retain verified static defaults
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateBranch = useCallback((updated: BranchInfo) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === updated.id
          ? { ...updated, embedMapUrl: updated.embedMapUrl || b.embedMapUrl }
          : b,
      ),
    );
  }, []);

  const addPhoto = useCallback((photo: GalleryPhotoRecord) => {
    setGallery((prev) => [photo, ...prev]);
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setGallery((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const openUploader = useCallback((category: GalleryPhotoRecord['category'] = 'exterior') => {
    setUploaderCategory(category);
    setUploaderOpen(true);
  }, []);

  const closeUploader = useCallback(() => {
    setUploaderOpen(false);
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        branches,
        gallery,
        loading,
        updateBranch,
        addPhoto,
        deletePhoto,
        uploaderOpen,
        uploaderCategory,
        openUploader,
        closeUploader,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) {
    throw new Error('useClinic must be used within ClinicProvider');
  }
  return ctx;
}
