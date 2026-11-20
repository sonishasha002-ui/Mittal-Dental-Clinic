import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  CLINIC_INFO,
  INITIAL_BRANCHES,
  type BranchInfo,
  type GalleryPhotoRecord,
} from '../data/clinicData';
import {
  db,
  handleFirestoreError,
  OperationType,
  reportFirestoreError,
} from '../firebase';

export type AppointmentStatus =
  | 'pending_clinic_confirmation'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface ClinicInfoData {
  name: string;
  city: string;
  description: string;
  phoneDisplay: string;
  whatsappNumber: string;
  updatedAt?: string;
}

export interface DoctorProfileData {
  name: string;
  qualification: string;
  roleTitle: string;
  bio: string;
  clinicalScope: string;
  portraitUrl: string;
  portraitCaption: string;
  updatedAt?: string;
}

export interface AdminAppointmentRecord {
  id: string;
  referenceCode: string;
  patientName: string;
  mobileNumber: string;
  branchId: 'civil-lines' | 'zero-road';
  branchName: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: AppointmentStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  role: 'admin';
  addedBy: string;
  createdAt: string;
}

export const DEFAULT_CLINIC_INFO: ClinicInfoData = {
  name: CLINIC_INFO.name,
  city: CLINIC_INFO.city,
  description: CLINIC_INFO.description,
  phoneDisplay: CLINIC_INFO.phoneDisplay,
  whatsappNumber: '919839580829',
};

export const DEFAULT_DOCTOR_PROFILE: DoctorProfileData = {
  name: CLINIC_INFO.doctor.name,
  qualification: CLINIC_INFO.doctor.qualification,
  roleTitle: 'Lead Dental Surgeon · Mittal Dental Clinic',
  bio: 'Dr. Rishabh Mittal leads patient care at Mittal Dental Clinic across both the Civil Lines and Zero Road centres in Prayagraj. Every consultation focuses on accurate diagnosis, plain-language explanation of treatment options, and attentive chairside comfort tailored to individual patient needs.',
  clinicalScope: 'Multispecialty & Orthodontic Care',
  portraitUrl: '',
  portraitCaption: 'Dr. Rishabh Mittal (BDS, Gold Medalist)',
};

function toIsoString(value: unknown, fallback = new Date().toISOString()): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return fallback;
}

function clampString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export function buildPhoneHref(phoneDisplay: string): string {
  const digits = phoneDisplay.replace(/\D/g, '');
  if (!digits) return CLINIC_INFO.phoneHref;
  if (digits.startsWith('91') && digits.length >= 12) return `tel:+${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `tel:+91${digits.slice(1)}`;
  if (digits.length === 10) return `tel:+91${digits}`;
  return `tel:${digits}`;
}

export function buildWhatsappHref(whatsappNumber: string): string {
  const digits = whatsappNumber.replace(/\D/g, '') || '919839580829';
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}?text=Hello%20Mittal%20Dental%20Clinic%2C%20I%20would%20like%20to%20enquire%20about%20a%20dental%20appointment.`;
}

function isValidImageSource(url: string): boolean {
  if (!url) return false;
  if (url.length > 450000) return false;
  return /^(https:\/\/.*|data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+)$/i.test(url);
}

export async function compressImageFileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (JPEG, PNG, or WebP).');
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.readAsDataURL(file);
  });

  if (
    /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(rawDataUrl) &&
    rawDataUrl.length <= 360000
  ) {
    return rawDataUrl;
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const imageEl = new Image();
    imageEl.onload = () => resolve(imageEl);
    imageEl.onerror = () => reject(new Error('Could not decode the selected image.'));
    imageEl.src = rawDataUrl;
  });

  const attempts: { maxDim: number; quality: number }[] = [
    { maxDim: 1200, quality: 0.82 },
    { maxDim: 1000, quality: 0.72 },
    { maxDim: 820, quality: 0.62 },
    { maxDim: 680, quality: 0.52 },
  ];

  for (const { maxDim, quality } of attempts) {
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser canvas image processing is unavailable.');
    }
    ctx.drawImage(img, 0, 0, width, height);
    const compressed = canvas.toDataURL('image/jpeg', quality);
    if (compressed.length <= 400000) {
      return compressed;
    }
  }

  throw new Error(
    'The selected photograph is too large even after compression. Please use a smaller image (under 4 MB) or an HTTPS image URL.',
  );
}

function parseClinicInfoData(d: Record<string, unknown> | undefined): ClinicInfoData {
  if (!d) return { ...DEFAULT_CLINIC_INFO };
  return {
    name: clampString(d.name, 100) || DEFAULT_CLINIC_INFO.name,
    city: clampString(d.city, 100) || DEFAULT_CLINIC_INFO.city,
    description: clampString(d.description, 500) || DEFAULT_CLINIC_INFO.description,
    phoneDisplay: clampString(d.phoneDisplay, 25) || DEFAULT_CLINIC_INFO.phoneDisplay,
    whatsappNumber: clampString(d.whatsappNumber, 20) || DEFAULT_CLINIC_INFO.whatsappNumber,
    updatedAt: toIsoString(d.updatedAt),
  };
}

function parseDoctorProfileData(d: Record<string, unknown> | undefined): DoctorProfileData {
  if (!d) return { ...DEFAULT_DOCTOR_PROFILE };
  return {
    name: clampString(d.name, 100) || DEFAULT_DOCTOR_PROFILE.name,
    qualification: clampString(d.qualification, 120) || DEFAULT_DOCTOR_PROFILE.qualification,
    roleTitle: clampString(d.roleTitle, 120) || DEFAULT_DOCTOR_PROFILE.roleTitle,
    bio: clampString(d.bio, 1200) || DEFAULT_DOCTOR_PROFILE.bio,
    clinicalScope: clampString(d.clinicalScope, 120) || DEFAULT_DOCTOR_PROFILE.clinicalScope,
    portraitUrl: clampString(d.portraitUrl, 450000),
    portraitCaption: clampString(d.portraitCaption, 220),
    updatedAt: toIsoString(d.updatedAt),
  };
}

function parseBranchesSnapshot(branchesSnap: QuerySnapshot): BranchInfo[] {
  if (branchesSnap.empty) {
    return structuredClone(INITIAL_BRANCHES);
  }
  const loaded = new Map<string, BranchInfo>();
  branchesSnap.forEach((snap) => {
    const d = snap.data();
    const id = d.id === 'zero-road' || snap.id === 'zero-road' ? 'zero-road' : 'civil-lines';
    const fallback = INITIAL_BRANCHES.find((b) => b.id === id) || INITIAL_BRANCHES[0];
    loaded.set(id, {
      id,
      label: clampString(d.label, 60) || fallback.label,
      name: clampString(d.name, 120) || fallback.name,
      badge: clampString(d.badge, 100) || fallback.badge,
      addressLines:
        Array.isArray(d.addressLines) && d.addressLines.length > 0
          ? d.addressLines.map((line: unknown) => clampString(line, 140)).filter(Boolean)
          : fallback.addressLines,
      fullAddress: clampString(d.fullAddress, 300) || fallback.fullAddress,
      phone: clampString(d.phone, 25) || fallback.phone,
      mapsUrl: clampString(d.mapsUrl, 400) || fallback.mapsUrl,
      embedMapUrl: clampString(d.embedMapUrl, 600) || fallback.embedMapUrl,
      googleProfileUrl: clampString(d.googleProfileUrl, 400) || fallback.googleProfileUrl,
      hours: {
        mondayToSaturday:
          Array.isArray(d.mondayToSaturday) && d.mondayToSaturday.length > 0
            ? d.mondayToSaturday.map((s: unknown) => clampString(s, 60)).filter(Boolean)
            : fallback.hours.mondayToSaturday,
        sunday:
          Array.isArray(d.sunday) && d.sunday.length > 0
            ? d.sunday.map((s: unknown) => clampString(s, 60)).filter(Boolean)
            : fallback.hours.sunday,
        note: typeof d.hoursNote === 'string' ? clampString(d.hoursNote, 300) : fallback.hours.note,
        lastUpdated: toIsoString(d.updatedAt, fallback.hours.lastUpdated),
      },
    });
  });
  return INITIAL_BRANCHES.map((fallback) => loaded.get(fallback.id) || fallback);
}

function parseGallerySnapshot(gallerySnap: QuerySnapshot): GalleryPhotoRecord[] {
  return gallerySnap.docs.map((snap) => {
    const d = snap.data();
    return {
      id: snap.id,
      category: d.category as GalleryPhotoRecord['category'],
      title: clampString(d.title, 120),
      branchId: (d.branchId as GalleryPhotoRecord['branchId']) || 'both',
      caption: clampString(d.caption, 250),
      imageDataUrl: clampString(d.imageDataUrl, 450000),
      uploadedAt: toIsoString(d.createdAt),
    };
  });
}

function parseAppointmentsSnapshot(snap: QuerySnapshot): AdminAppointmentRecord[] {
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      referenceCode: clampString(d.referenceCode, 24) || docSnap.id,
      patientName: clampString(d.patientName, 120),
      mobileNumber: clampString(d.mobileNumber, 20),
      branchId: d.branchId === 'zero-road' ? 'zero-road' : 'civil-lines',
      branchName: clampString(d.branchName, 120),
      treatment: clampString(d.treatment, 120),
      preferredDate: clampString(d.preferredDate, 20),
      preferredTime: clampString(d.preferredTime, 60),
      message: clampString(d.message, 800),
      status: (d.status as AppointmentStatus) || 'pending_clinic_confirmation',
      adminNotes: clampString(d.adminNotes, 500),
      createdAt: toIsoString(d.createdAt),
      updatedAt: toIsoString(d.updatedAt),
    };
  });
}

export function subscribeClinicInfo(
  onData: (data: ClinicInfoData, fromServerDoc: boolean) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'clinic_info', 'main'),
    (snap) => {
      if (snap.exists()) {
        onData(parseClinicInfoData(snap.data()), true);
      } else {
        onData({ ...DEFAULT_CLINIC_INFO }, false);
      }
    },
    (error) => {
      const info = reportFirestoreError(error, OperationType.GET, 'clinic_info/main');
      onError?.(info.error);
    },
  );
}

export function subscribeDoctorProfile(
  onData: (data: DoctorProfileData, fromServerDoc: boolean) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'doctor_profile', 'main'),
    (snap) => {
      if (snap.exists()) {
        onData(parseDoctorProfileData(snap.data()), true);
      } else {
        onData({ ...DEFAULT_DOCTOR_PROFILE }, false);
      }
    },
    (error) => {
      const info = reportFirestoreError(error, OperationType.GET, 'doctor_profile/main');
      onError?.(info.error);
    },
  );
}

export function subscribeBranches(
  onData: (data: BranchInfo[], fromServerDocs: boolean) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, 'branches'),
    (snap) => {
      onData(parseBranchesSnapshot(snap), !snap.empty);
    },
    (error) => {
      const info = reportFirestoreError(error, OperationType.LIST, 'branches');
      onError?.(info.error);
    },
  );
}

export function subscribeGallery(
  onData: (data: GalleryPhotoRecord[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'gallery'), orderBy('createdAt', 'desc')),
    (snap) => {
      onData(parseGallerySnapshot(snap));
    },
    (error) => {
      const info = reportFirestoreError(error, OperationType.LIST, 'gallery');
      onError?.(info.error);
    },
  );
}

export function subscribeAppointments(
  onData: (data: AdminAppointmentRecord[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'appointments'), orderBy('createdAt', 'desc')),
    (snap) => {
      onData(parseAppointmentsSnapshot(snap));
    },
    (error) => {
      const info = reportFirestoreError(error, OperationType.LIST, 'appointments');
      onError?.(info.error);
    },
  );
}

export async function fetchPublicClinicState(): Promise<{
  clinicInfo: ClinicInfoData;
  doctorProfile: DoctorProfileData;
  branches: BranchInfo[];
  gallery: GalleryPhotoRecord[];
}> {
  try {
    const [clinicSnap, doctorSnap, branchesSnap, gallerySnap] = await Promise.all([
      getDoc(doc(db, 'clinic_info', 'main')),
      getDoc(doc(db, 'doctor_profile', 'main')),
      getDocs(collection(db, 'branches')),
      getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))),
    ]);

    return {
      clinicInfo: clinicSnap.exists() ? parseClinicInfoData(clinicSnap.data()) : { ...DEFAULT_CLINIC_INFO },
      doctorProfile: doctorSnap.exists()
        ? parseDoctorProfileData(doctorSnap.data())
        : { ...DEFAULT_DOCTOR_PROFILE },
      branches: parseBranchesSnapshot(branchesSnap),
      gallery: parseGallerySnapshot(gallerySnap),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'clinic_info|doctor_profile|branches|gallery');
  }
}

export async function seedInitialClinicDataIfMissing(uid: string): Promise<void> {
  try {
    const [clinicSnap, doctorSnap, civilSnap, zeroSnap] = await Promise.all([
      getDoc(doc(db, 'clinic_info', 'main')),
      getDoc(doc(db, 'doctor_profile', 'main')),
      getDoc(doc(db, 'branches', 'civil-lines')),
      getDoc(doc(db, 'branches', 'zero-road')),
    ]);

    const writes: Promise<void>[] = [];

    if (!clinicSnap.exists()) {
      writes.push(
        setDoc(doc(db, 'clinic_info', 'main'), {
          ...DEFAULT_CLINIC_INFO,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        }),
      );
    }

    if (!doctorSnap.exists()) {
      writes.push(
        setDoc(doc(db, 'doctor_profile', 'main'), {
          ...DEFAULT_DOCTOR_PROFILE,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        }),
      );
    }

    if (!civilSnap.exists()) {
      const b = INITIAL_BRANCHES[0];
      writes.push(
        setDoc(doc(db, 'branches', b.id), {
          id: b.id,
          label: b.label,
          name: b.name,
          badge: b.badge,
          addressLines: b.addressLines,
          fullAddress: b.fullAddress,
          phone: b.phone,
          mapsUrl: b.mapsUrl,
          embedMapUrl: b.embedMapUrl,
          googleProfileUrl: b.googleProfileUrl,
          mondayToSaturday: b.hours.mondayToSaturday,
          sunday: b.hours.sunday,
          hoursNote: b.hours.note,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        }),
      );
    }

    if (!zeroSnap.exists()) {
      const b = INITIAL_BRANCHES[1];
      writes.push(
        setDoc(doc(db, 'branches', b.id), {
          id: b.id,
          label: b.label,
          name: b.name,
          badge: b.badge,
          addressLines: b.addressLines,
          fullAddress: b.fullAddress,
          phone: b.phone,
          mapsUrl: b.mapsUrl,
          embedMapUrl: b.embedMapUrl,
          googleProfileUrl: b.googleProfileUrl,
          mondayToSaturday: b.hours.mondayToSaturday,
          sunday: b.hours.sunday,
          hoursNote: b.hours.note,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        }),
      );
    }

    if (writes.length > 0) {
      await Promise.all(writes);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed_initial_clinic_data');
  }
}

export async function saveClinicInfo(data: ClinicInfoData, uid: string): Promise<ClinicInfoData> {
  const name = clampString(data.name, 100);
  const city = clampString(data.city, 100);
  const description = clampString(data.description, 500);
  const phoneDisplay = clampString(data.phoneDisplay, 25);
  const whatsappNumber = clampString(data.whatsappNumber.replace(/[^\d+]/g, ''), 20);

  if (name.length < 2) throw new Error('Clinic name must be at least 2 characters.');
  if (city.length < 2) throw new Error('City must be at least 2 characters.');
  if (description.length < 10) throw new Error('Description must be at least 10 characters.');
  if (phoneDisplay.length < 6) throw new Error('Enter a valid clinic phone number.');
  if (whatsappNumber.length < 10) throw new Error('WhatsApp number must have at least 10 digits.');

  try {
    await setDoc(doc(db, 'clinic_info', 'main'), {
      name,
      city,
      description,
      phoneDisplay,
      whatsappNumber,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
    return {
      name,
      city,
      description,
      phoneDisplay,
      whatsappNumber,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'clinic_info/main');
  }
}

export async function saveDoctorProfile(
  data: DoctorProfileData,
  uid: string,
): Promise<DoctorProfileData> {
  const name = clampString(data.name, 100);
  const qualification = clampString(data.qualification, 120);
  const roleTitle = clampString(data.roleTitle, 120);
  const bio = clampString(data.bio, 1200);
  const clinicalScope = clampString(data.clinicalScope, 120);
  const portraitUrl = clampString(data.portraitUrl, 450000);
  const portraitCaption = clampString(data.portraitCaption, 220);

  if (name.length < 2) throw new Error('Doctor name must be at least 2 characters.');
  if (qualification.length < 2) throw new Error('Qualification must be at least 2 characters.');
  if (roleTitle.length < 2) throw new Error('Role title must be at least 2 characters.');
  if (bio.length < 10) throw new Error('Biography must be at least 10 characters.');
  if (clinicalScope.length < 2) throw new Error('Clinical scope must be at least 2 characters.');
  if (portraitUrl && !isValidImageSource(portraitUrl)) {
    throw new Error('Portrait must be a compressed JPEG/PNG/WebP image (under 450 KB) or an HTTPS URL.');
  }

  try {
    await setDoc(doc(db, 'doctor_profile', 'main'), {
      name,
      qualification,
      roleTitle,
      bio,
      clinicalScope,
      portraitUrl,
      portraitCaption,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
    return {
      name,
      qualification,
      roleTitle,
      bio,
      clinicalScope,
      portraitUrl,
      portraitCaption,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'doctor_profile/main');
  }
}

export async function saveBranchRecord(branch: BranchInfo, uid: string): Promise<BranchInfo> {
  const label = clampString(branch.label, 60);
  const name = clampString(branch.name, 120);
  const badge = clampString(branch.badge, 100);
  const addressLines = branch.addressLines
    .map((line) => clampString(line, 140))
    .filter(Boolean)
    .slice(0, 5);
  const fullAddress = clampString(branch.fullAddress, 300);
  const phone = clampString(branch.phone, 25);
  const mapsUrl = clampString(branch.mapsUrl, 400);
  const embedMapUrl = clampString(branch.embedMapUrl, 600);
  const googleProfileUrl = clampString(branch.googleProfileUrl, 400);
  const mondayToSaturday = branch.hours.mondayToSaturday
    .map((s) => clampString(s, 60))
    .filter(Boolean)
    .slice(0, 6);
  const sunday = branch.hours.sunday
    .map((s) => clampString(s, 60))
    .filter(Boolean)
    .slice(0, 4);
  const hoursNote = clampString(branch.hours.note, 300);

  if (label.length < 2 || name.length < 2) throw new Error('Branch label and name are required.');
  if (addressLines.length === 0 || fullAddress.length < 10) {
    throw new Error('Please provide a complete branch address.');
  }
  if (!mapsUrl.startsWith('https://')) {
    throw new Error('Google Maps link must start with https://');
  }
  if (embedMapUrl && !embedMapUrl.startsWith('https://')) {
    throw new Error('Embedded Google Map URL must start with https:// or be blank.');
  }
  if (!googleProfileUrl.startsWith('https://')) {
    throw new Error('Google Business Profile link must start with https://');
  }
  if (mondayToSaturday.length === 0 || sunday.length === 0) {
    throw new Error('Provide at least one timing slot for Monday–Saturday and Sunday.');
  }

  try {
    await setDoc(doc(db, 'branches', branch.id), {
      id: branch.id,
      label,
      name,
      badge,
      addressLines,
      fullAddress,
      phone,
      mapsUrl,
      embedMapUrl,
      googleProfileUrl,
      mondayToSaturday,
      sunday,
      hoursNote,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });

    return {
      ...branch,
      label,
      name,
      badge,
      addressLines,
      fullAddress,
      phone,
      mapsUrl,
      embedMapUrl,
      googleProfileUrl,
      hours: {
        mondayToSaturday,
        sunday,
        note: hoursNote,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `branches/${branch.id}`);
  }
}

export async function createGalleryPhoto(
  input: {
    category: GalleryPhotoRecord['category'];
    title: string;
    branchId: GalleryPhotoRecord['branchId'];
    caption: string;
    imageDataUrl: string;
  },
  uid: string,
): Promise<GalleryPhotoRecord> {
  const title = clampString(input.title, 120);
  const caption = clampString(input.caption, 250);
  const imageDataUrl = clampString(input.imageDataUrl, 450000);

  if (title.length < 2) throw new Error('Photo title must be at least 2 characters.');
  if (!isValidImageSource(imageDataUrl)) {
    throw new Error('Image must be a valid JPEG/PNG/WebP upload (under 450 KB) or HTTPS URL.');
  }

  const photoId = `photo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  try {
    await setDoc(doc(db, 'gallery', photoId), {
      category: input.category,
      title,
      branchId: input.branchId,
      caption,
      imageDataUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });

    return {
      id: photoId,
      category: input.category,
      title,
      branchId: input.branchId,
      caption,
      imageDataUrl,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `gallery/${photoId}`);
  }
}

export async function updateGalleryPhoto(
  photoId: string,
  input: {
    category: GalleryPhotoRecord['category'];
    title: string;
    branchId: GalleryPhotoRecord['branchId'];
    caption: string;
    imageDataUrl: string;
  },
  uid: string,
): Promise<void> {
  const title = clampString(input.title, 120);
  const caption = clampString(input.caption, 250);
  const imageDataUrl = clampString(input.imageDataUrl, 450000);

  if (title.length < 2) throw new Error('Photo title must be at least 2 characters.');
  if (!isValidImageSource(imageDataUrl)) {
    throw new Error('Image must be a valid JPEG/PNG/WebP upload (under 450 KB) or HTTPS URL.');
  }

  try {
    await updateDoc(doc(db, 'gallery', photoId), {
      category: input.category,
      title,
      branchId: input.branchId,
      caption,
      imageDataUrl,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `gallery/${photoId}`);
  }
}

export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', photoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `gallery/${photoId}`);
  }
}

function normalizeIndianPhoneDigits(input: string): string {
  return input.replace(/[\s\-()]/g, '').replace(/^\+91/, '').replace(/^0/, '');
}

export async function submitAppointmentRequest(payload: {
  patientName: string;
  mobileNumber: string;
  branchId: 'civil-lines' | 'zero-road';
  branchName: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}): Promise<{
  referenceCode: string;
  patientName: string;
  mobileNumber: string;
  branchId: 'civil-lines' | 'zero-road';
  branchName: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending_clinic_confirmation';
  createdAt: string;
}> {
  const patientName = clampString(payload.patientName, 120);
  const digits = normalizeIndianPhoneDigits(payload.mobileNumber);
  const treatment = clampString(payload.treatment, 120);
  const branchName = clampString(payload.branchName, 120);
  const preferredDate = clampString(payload.preferredDate, 20);
  const preferredTime = clampString(payload.preferredTime, 60);
  const message = clampString(payload.message, 800);

  if (patientName.length < 2) {
    throw new Error('Please enter the patient’s full name (at least 2 characters).');
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number.');
  }
  if (!treatment) {
    throw new Error('Please select a treatment or consultation type.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    throw new Error('Please select a valid preferred appointment date.');
  }
  if (preferredTime.length < 3) {
    throw new Error('Please select a preferred time slot.');
  }

  const formattedMobile = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  const referenceCode = `MDC-${suffix.slice(-8)}`;
  const docId = referenceCode;

  try {
    await setDoc(doc(db, 'appointments', docId), {
      referenceCode,
      patientName,
      mobileNumber: formattedMobile,
      branchId: payload.branchId,
      branchName,
      treatment,
      preferredDate,
      preferredTime,
      message,
      status: 'pending_clinic_confirmation',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      referenceCode,
      patientName,
      mobileNumber: formattedMobile,
      branchId: payload.branchId,
      branchName,
      treatment,
      preferredDate,
      preferredTime,
      message,
      status: 'pending_clinic_confirmation',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `appointments/${docId}`);
  }
}

export async function fetchAppointments(): Promise<AdminAppointmentRecord[]> {
  try {
    const snap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')));
    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        referenceCode: clampString(d.referenceCode, 24) || docSnap.id,
        patientName: clampString(d.patientName, 120),
        mobileNumber: clampString(d.mobileNumber, 20),
        branchId: d.branchId === 'zero-road' ? 'zero-road' : 'civil-lines',
        branchName: clampString(d.branchName, 120),
        treatment: clampString(d.treatment, 120),
        preferredDate: clampString(d.preferredDate, 20),
        preferredTime: clampString(d.preferredTime, 60),
        message: clampString(d.message, 800),
        status: (d.status as AppointmentStatus) || 'pending_clinic_confirmation',
        adminNotes: clampString(d.adminNotes, 500),
        createdAt: toIsoString(d.createdAt),
        updatedAt: toIsoString(d.updatedAt),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'appointments');
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  adminNotes: string,
): Promise<void> {
  const cleanNotes = clampString(adminNotes, 500);
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status,
      adminNotes: cleanNotes,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `appointments/${appointmentId}`);
  }
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `appointments/${appointmentId}`);
  }
}
