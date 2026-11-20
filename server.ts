import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import { getClinicGoogleReviewsSummary } from './server/googlePlacesService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'mittal-dental-clinic-web' });
  });

  app.get('/api/google-reviews', async (_req, res) => {
    try {
      const summary = await getClinicGoogleReviewsSummary();
      res.setHeader('Cache-Control', 'private, max-age=300');
      res.json(summary);
    } catch {
      res.json({
        configured: false,
        status: 'upstream_error',
        rating: null,
        userRatingCount: null,
        placeId: null,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
      });
    }
  });

  // Legacy unauthenticated local-JSON routes disabled: clinic data, admin mutations,
  // and appointment records are protected via Firebase Authentication and Firestore Rules.
  app.use('/api/*', (_req, res) => {
    res.status(410).json({
      error: 'Legacy endpoint retired. Clinic data and appointments are managed securely via Firebase.',
    });
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
