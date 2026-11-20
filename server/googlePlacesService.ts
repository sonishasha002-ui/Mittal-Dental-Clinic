export interface GoogleReviewsSummaryResponse {
  configured: boolean;
  status:
    | 'ok'
    | 'missing_api_key'
    | 'quota_exceeded'
    | 'place_not_found'
    | 'place_not_verified'
    | 'upstream_error';
  rating: number | null;
  userRatingCount: number | null;
  placeId: string | null;
  displayName: string | null;
  formattedAddress: string | null;
  googleMapsUri: string | null;
  message?: string;
}

const PLACES_API_BASE = 'https://places.googleapis.com/v1';
const SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
const DEFAULT_TEXT_QUERY = 'Mittal Dental Clinic, Civil Lines, Prayagraj, Uttar Pradesh';

let inFlightPromise: Promise<GoogleReviewsSummaryResponse> | null = null;

function isExpectedClinicMatch(displayName?: string | null, formattedAddress?: string | null): boolean {
  const name = (displayName || '').toLowerCase();
  const address = (formattedAddress || '').toLowerCase();
  const matchesName = name.includes('mittal') && name.includes('dental');
  const matchesCity =
    address.length === 0 || address.includes('prayagraj') || address.includes('allahabad');
  return matchesName && matchesCity;
}

function getPlacesApiKey(): string {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    ''
  ).trim();
}

async function fetchPlaceDetailsById(
  placeId: string,
  apiKey: string,
): Promise<GoogleReviewsSummaryResponse> {
  const url = `${PLACES_API_BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-Maps-Solution-ID': SOLUTION_ID,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri',
    },
  });

  if (response.status === 429) {
    return {
      configured: true,
      status: 'quota_exceeded',
      rating: null,
      userRatingCount: null,
      placeId,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'Google Places API quota limit reached.',
    };
  }

  if (response.status === 404) {
    return {
      configured: true,
      status: 'place_not_found',
      rating: null,
      userRatingCount: null,
      placeId,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'The configured GOOGLE_PLACE_ID was not found in Google Places.',
    };
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    let upstreamStatus = '';
    try {
      const parsed = JSON.parse(errText);
      upstreamStatus = parsed?.error?.status || '';
    } catch {
      // Ignore parse error
    }
    if (upstreamStatus === 'RESOURCE_EXHAUSTED') {
      return {
        configured: true,
        status: 'quota_exceeded',
        rating: null,
        userRatingCount: null,
        placeId,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
        message: 'Google Places API quota limit reached.',
      };
    }
    return {
      configured: true,
      status: 'upstream_error',
      rating: null,
      userRatingCount: null,
      placeId,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: `Google Places API request failed (${response.status}). Check Places API (New) enablement, billing, and key restrictions.`,
    };
  }

  const data = (await response.json()) as {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
  };

  return {
    configured: true,
    status: 'ok',
    rating: typeof data.rating === 'number' ? data.rating : null,
    userRatingCount: typeof data.userRatingCount === 'number' ? data.userRatingCount : null,
    placeId: data.id || placeId,
    displayName: data.displayName?.text || null,
    formattedAddress: data.formattedAddress || null,
    googleMapsUri: data.googleMapsUri || null,
  };
}

async function fetchPlaceByTextSearch(
  textQuery: string,
  apiKey: string,
): Promise<GoogleReviewsSummaryResponse> {
  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-Maps-Solution-ID': SOLUTION_ID,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'en',
      regionCode: 'in',
      pageSize: 3,
    }),
  });

  if (response.status === 429) {
    return {
      configured: true,
      status: 'quota_exceeded',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'Google Places API quota limit reached.',
    };
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    let upstreamStatus = '';
    try {
      const parsed = JSON.parse(errText);
      upstreamStatus = parsed?.error?.status || '';
    } catch {
      // Ignore parse error
    }
    if (upstreamStatus === 'RESOURCE_EXHAUSTED') {
      return {
        configured: true,
        status: 'quota_exceeded',
        rating: null,
        userRatingCount: null,
        placeId: null,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
        message: 'Google Places API quota limit reached.',
      };
    }
    return {
      configured: true,
      status: 'upstream_error',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: `Google Places Text Search failed (${response.status}). Check Places API (New) enablement, billing, and key restrictions.`,
    };
  }

  const payload = (await response.json()) as {
    places?: Array<{
      id?: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
    }>;
  };

  const candidates = payload.places || [];
  if (candidates.length === 0) {
    return {
      configured: true,
      status: 'place_not_found',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'No matching Google Business listing found. Set GOOGLE_PLACE_ID explicitly.',
    };
  }

  const verified = candidates.find((p) =>
    isExpectedClinicMatch(p.displayName?.text, p.formattedAddress),
  );

  if (!verified) {
    return {
      configured: true,
      status: 'place_not_verified',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'Search result did not unambiguously match Mittal Dental Clinic, Prayagraj. Set GOOGLE_PLACE_ID explicitly.',
    };
  }

  return {
    configured: true,
    status: 'ok',
    rating: typeof verified.rating === 'number' ? verified.rating : null,
    userRatingCount: typeof verified.userRatingCount === 'number' ? verified.userRatingCount : null,
    placeId: verified.id || null,
    displayName: verified.displayName?.text || null,
    formattedAddress: verified.formattedAddress || null,
    googleMapsUri: verified.googleMapsUri || null,
  };
}

export async function getClinicGoogleReviewsSummary(): Promise<GoogleReviewsSummaryResponse> {
  const apiKey = getPlacesApiKey();
  if (!apiKey) {
    return {
      configured: false,
      status: 'missing_api_key',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'GOOGLE_PLACES_API_KEY is not configured on the server.',
    };
  }

  if (inFlightPromise) {
    return inFlightPromise;
  }

  const placeId = (process.env.GOOGLE_PLACE_ID || '').trim();
  const textQuery = (process.env.GOOGLE_PLACE_TEXT_QUERY || DEFAULT_TEXT_QUERY).trim();

  inFlightPromise = (placeId
    ? fetchPlaceDetailsById(placeId, apiKey)
    : fetchPlaceByTextSearch(textQuery, apiKey)
  ).finally(() => {
    inFlightPromise = null;
  });

  return inFlightPromise;
}
