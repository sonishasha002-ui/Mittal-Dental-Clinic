import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'clinic-store.json');

interface BranchHours {
  mondayToSaturday: string[];
  sunday: string[];
  note: string;
  lastUpdated: string;
}

interface BranchRecord {
  id: 'civil-lines' | 'zero-road';
  label: string;
  name: string;
  badge: string;
  addressLines: string[];
  fullAddress: string;
  phone: string;
  mapsUrl: string;
  googleProfileUrl: string;
  hours: BranchHours;
}

interface AppointmentRequest {
  id: string;
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
}

interface GalleryPhoto {
  id: string;
  category: 'exterior' | 'reception' | 'treatment-area' | 'equipment' | 'doctor-portrait';
  title: string;
  branchId: 'civil-lines' | 'zero-road' | 'both';
  caption: string;
  imageDataUrl: string;
  uploadedAt: string;
}

interface ClinicStore {
  branches: BranchRecord[];
  appointments: AppointmentRequest[];
  gallery: GalleryPhoto[];
}

const DEFAULT_STORE: ClinicStore = {
  branches: [
    {
      id: 'civil-lines',
      label: 'Primary Branch',
      name: 'Mittal Dental Clinic — Civil Lines',
      badge: 'Primary Branch · Civil Lines',
      addressLines: [
        '5, 1A, Tej Bahadur Sapru Road,',
        'Agnipath Colony, Civil Lines,',
        'Prayagraj, Uttar Pradesh – 211001.',
      ],
      fullAddress:
        '5, 1A, Tej Bahadur Sapru Road, Agnipath Colony, Civil Lines, Prayagraj, Uttar Pradesh – 211001',
      phone: '098395 80829',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+5+1A+Tej+Bahadur+Sapru+Road+Agnipath+Colony+Civil+Lines+Prayagraj+211001',
      googleProfileUrl:
        'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+Civil+Lines+Prayagraj',
      hours: {
        mondayToSaturday: ['10:00 AM – 12:00 PM', '4:00 PM – 8:00 PM'],
        sunday: ['10:00 AM – 12:00 PM'],
        note: 'Listed clinic hours. Please call 098395 80829 to confirm branch-specific slot availability.',
        lastUpdated: '2026-11-16T00:00:00.000Z',
      },
    },
    {
      id: 'zero-road',
      label: 'Second Branch',
      name: 'Mittal Dental Clinic — Zero Road',
      badge: 'Second Branch · Zero Road',
      addressLines: [
        '90/78, Mahajani Tola,',
        'Near Sri Hatkeshwar Nath Mandir,',
        'Zero Road, Prayagraj, Uttar Pradesh – 211003.',
      ],
      fullAddress:
        '90/78, Mahajani Tola, Near Sri Hatkeshwar Nath Mandir, Zero Road, Prayagraj, Uttar Pradesh – 211003',
      phone: '098395 80829',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+90%2F78+Mahajani+Tola+Near+Sri+Hatkeshwar+Nath+Mandir+Zero+Road+Prayagraj+211003',
      googleProfileUrl:
        'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+Zero+Road+Prayagraj',
      hours: {
        mondayToSaturday: ['10:00 AM – 12:00 PM', '4:00 PM – 8:00 PM'],
        sunday: ['10:00 AM – 12:00 PM'],
        note: 'Timings shown from supplied listing. Independently editable for Zero Road branch confirmation.',
        lastUpdated: '2026-11-16T00:00:00.000Z',
      },
    },
  ],
  appointments: [],
  gallery: [],
};

function ensureStore(): ClinicStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<ClinicStore>;
    return {
      branches: Array.isArray(parsed.branches) && parsed.branches.length === 2
        ? parsed.branches
        : structuredClone(DEFAULT_STORE.branches),
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
    };
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
}

function saveStore(store: ClinicStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function normalizePhone(input: string): string {
  return input.replace(/[\s\-()]/g, '').replace(/^\+91/, '').replace(/^0/, '');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '6mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'mittal-dental-clinic-backend' });
  });

  app.get('/api/clinic-data', (_req, res) => {
    const store = ensureStore();
    res.json({
      branches: store.branches,
      gallery: store.gallery,
      appointmentCount: store.appointments.length,
    });
  });

  app.patch('/api/branches/:id/hours', (req, res) => {
    const branchId = req.params.id;
    if (branchId !== 'civil-lines' && branchId !== 'zero-road') {
      res.status(404).json({ error: 'Branch not found.' });
      return;
    }

    const { mondayToSaturday, sunday, note, mapsUrl } = req.body as {
      mondayToSaturday?: string[];
      sunday?: string[];
      note?: string;
      mapsUrl?: string;
    };

    if (!Array.isArray(mondayToSaturday) || !Array.isArray(sunday)) {
      res.status(400).json({ error: 'Both mondayToSaturday and sunday timing lists are required.' });
      return;
    }

    const cleanMonSat = mondayToSaturday
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0)
      .slice(0, 4);
    const cleanSun = sunday
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);

    if (cleanMonSat.length === 0 || cleanSun.length === 0) {
      res.status(400).json({ error: 'Provide at least one timing entry for weekdays and Sunday.' });
      return;
    }

    const store = ensureStore();
    const branch = store.branches.find((b) => b.id === branchId);
    if (!branch) {
      res.status(404).json({ error: 'Branch not found.' });
      return;
    }

    branch.hours = {
      mondayToSaturday: cleanMonSat,
      sunday: cleanSun,
      note: typeof note === 'string' && note.trim() ? note.trim().slice(0, 220) : branch.hours.note,
      lastUpdated: new Date().toISOString(),
    };

    if (typeof mapsUrl === 'string' && mapsUrl.trim().startsWith('https://')) {
      branch.mapsUrl = mapsUrl.trim().slice(0, 400);
    }

    saveStore(store);
    res.json({ branch });
  });

  app.get('/api/appointments', (_req, res) => {
    const store = ensureStore();
    res.json({ appointments: store.appointments });
  });

  app.post('/api/appointments', (req, res) => {
    const {
      patientName,
      mobileNumber,
      branchId,
      treatment,
      preferredDate,
      preferredTime,
      message,
    } = req.body as {
      patientName?: string;
      mobileNumber?: string;
      branchId?: string;
      treatment?: string;
      preferredDate?: string;
      preferredTime?: string;
      message?: string;
    };

    const cleanName = typeof patientName === 'string' ? patientName.trim() : '';
    const rawPhone = typeof mobileNumber === 'string' ? mobileNumber.trim() : '';
    const digits = normalizePhone(rawPhone);
    const cleanTreatment = typeof treatment === 'string' ? treatment.trim() : '';
    const cleanDate = typeof preferredDate === 'string' ? preferredDate.trim() : '';
    const cleanTime = typeof preferredTime === 'string' ? preferredTime.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 800) : '';

    if (cleanName.length < 2) {
      res.status(400).json({ error: 'Please enter the patient’s full name (at least 2 characters).' });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      res.status(400).json({
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
      return;
    }
    if (branchId !== 'civil-lines' && branchId !== 'zero-road') {
      res.status(400).json({ error: 'Please select a valid clinic branch.' });
      return;
    }
    if (!cleanTreatment) {
      res.status(400).json({ error: 'Please select a treatment or consultation type.' });
      return;
    }
    if (!cleanDate) {
      res.status(400).json({ error: 'Please select a preferred appointment date.' });
      return;
    }
    if (!cleanTime) {
      res.status(400).json({ error: 'Please select a preferred time slot.' });
      return;
    }

    const store = ensureStore();
    const branch = store.branches.find((b) => b.id === branchId);
    const referenceNumber = `MDC-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const record: AppointmentRequest = {
      id: referenceNumber,
      patientName: cleanName.slice(0, 120),
      mobileNumber: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
      branchId,
      branchName: branch ? branch.name : branchId,
      treatment: cleanTreatment.slice(0, 120),
      preferredDate: cleanDate,
      preferredTime: cleanTime,
      message: cleanMessage,
      status: 'pending_clinic_confirmation',
      createdAt: new Date().toISOString(),
    };

    store.appointments.unshift(record);
    saveStore(store);

    res.status(201).json({
      appointment: record,
      notice:
        'Your appointment request has been received by Mittal Dental Clinic. Final slot confirmation will be provided by the clinic desk on 098395 80829.',
    });
  });

  app.post('/api/gallery', (req, res) => {
    const { category, title, branchId, caption, imageDataUrl } = req.body as {
      category?: string;
      title?: string;
      branchId?: string;
      caption?: string;
      imageDataUrl?: string;
    };

    const validCategories = ['exterior', 'reception', 'treatment-area', 'equipment', 'doctor-portrait'];
    if (!category || !validCategories.includes(category)) {
      res.status(400).json({ error: 'Select a valid clinic photo category.' });
      return;
    }
    if (typeof title !== 'string' || title.trim().length < 2) {
      res.status(400).json({ error: 'Please provide a descriptive title for the photograph.' });
      return;
    }
    if (
      typeof imageDataUrl !== 'string' ||
      !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(imageDataUrl)
    ) {
      res.status(400).json({ error: 'Upload a valid JPEG, PNG, or WebP photograph.' });
      return;
    }

    const store = ensureStore();
    const photo: GalleryPhoto = {
      id: `photo-${Date.now().toString(36)}`,
      category: category as GalleryPhoto['category'],
      title: title.trim().slice(0, 100),
      branchId: branchId === 'civil-lines' || branchId === 'zero-road' ? branchId : 'both',
      caption: typeof caption === 'string' ? caption.trim().slice(0, 220) : '',
      imageDataUrl,
      uploadedAt: new Date().toISOString(),
    };

    store.gallery.unshift(photo);
    saveStore(store);

    res.status(201).json({ photo });
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const store = ensureStore();
    const before = store.gallery.length;
    store.gallery = store.gallery.filter((item) => item.id !== req.params.id);
    if (store.gallery.length === before) {
      res.status(404).json({ error: 'Photograph not found.' });
      return;
    }
    saveStore(store);
    res.json({ deleted: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mittal Dental Clinic server listening on http://localhost:${PORT}`);
  });
}

startServer();
