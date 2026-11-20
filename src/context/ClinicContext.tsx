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
import {
  DEFAULT_CLINIC_INFO,
  DEFAULT_DOCTOR_PROFILE,
  fetchPublicClinicState,
  subscribeBranches,
  subscribeClinicInfo,
  subscribeDoctorProfile,
  subscribeGallery,
  type ClinicInfoData,
  type DoctorProfileData,
} from '../services/clinicFirestore';

interface ClinicContextValue {
  clinicInfo: ClinicInfoData;
  doctorProfile: DoctorProfileData;
  branches: BranchInfo[];
  gallery: GalleryPhotoRecord[];
  loading: boolean;
  syncError: string | null;
  refreshClinicData: () => Promise<void>;
  setClinicInfoState: (info: ClinicInfoData) => void;
  setDoctorProfileState: (profile: DoctorProfileData) => void;
  updateBranch: (updated: BranchInfo) => void;
  addPhoto: (photo: GalleryPhotoRecord) => void;
  updatePhotoState: (photo: GalleryPhotoRecord) => void;
  deletePhoto: (id: string) => void;
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfoData>(DEFAULT_CLINIC_INFO);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileData>(DEFAULT_DOCTOR_PROFILE);
  const [branches, setBranches] = useState<BranchInfo[]>(INITIAL_BRANCHES);
  const [gallery, setGallery] = useState<GalleryPhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const settled = new Set<'clinic' | 'doctor' | 'branches' | 'gallery'>();

    const markSettled = (stream: 'clinic' | 'doctor' | 'branches' | 'gallery') => {
      if (!active) return;
      settled.add(stream);
      if (settled.size >= 4) {
        setLoading(false);
      }
    };

    const unsubClinic = subscribeClinicInfo(
      (data) => {
        if (!active) return;
        setClinicInfo(data);
        setSyncError(null);
        markSettled('clinic');
      },
      (errMsg) => {
        if (!active) return;
        setSyncError(errMsg);
        markSettled('clinic');
      },
    );

    const unsubDoctor = subscribeDoctorProfile(
      (data) => {
        if (!active) return;
        setDoctorProfile(data);
        setSyncError(null);
        markSettled('doctor');
      },
      (errMsg) => {
        if (!active) return;
        setSyncError(errMsg);
        markSettled('doctor');
      },
    );

    const unsubBranches = subscribeBranches(
      (data) => {
        if (!active) return;
        setBranches(data);
        setSyncError(null);
        markSettled('branches');
      },
      (errMsg) => {
        if (!active) return;
        setSyncError(errMsg);
        markSettled('branches');
      },
    );

    const unsubGallery = subscribeGallery(
      (data) => {
        if (!active) return;
        setGallery(data);
        setSyncError(null);
        markSettled('gallery');
      },
      (errMsg) => {
        if (!active) return;
        setSyncError(errMsg);
        markSettled('gallery');
      },
    );

    return () => {
      active = false;
      unsubClinic();
      unsubDoctor();
      unsubBranches();
      unsubGallery();
    };
  }, []);

  const refreshClinicData = useCallback(async () => {
    try {
      const state = await fetchPublicClinicState();
      setClinicInfo(state.clinicInfo);
      setDoctorProfile(state.doctorProfile);
      setBranches(state.branches);
      setGallery(state.gallery);
      setSyncError(null);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Unable to sync clinic data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const setClinicInfoState = useCallback((info: ClinicInfoData) => {
    setClinicInfo(info);
  }, []);

  const setDoctorProfileState = useCallback((profile: DoctorProfileData) => {
    setDoctorProfile(profile);
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
    setGallery((prev) =>
      prev.some((p) => p.id === photo.id)
        ? prev.map((p) => (p.id === photo.id ? photo : p))
        : [photo, ...prev],
    );
  }, []);

  const updatePhotoState = useCallback((photo: GalleryPhotoRecord) => {
    setGallery((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setGallery((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo,
        doctorProfile,
        branches,
        gallery,
        loading,
        syncError,
        refreshClinicData,
        setClinicInfoState,
        setDoctorProfileState,
        updateBranch,
        addPhoto,
        updatePhotoState,
        deletePhoto,
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
