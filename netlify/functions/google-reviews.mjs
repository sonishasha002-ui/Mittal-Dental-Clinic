const PLACES_API_BASE = 'https://places.googleapis.com/v1';
const SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
const DEFAULT_TEXT_QUERY = 'Mittal Dental Clinic, Civil Lines, Prayagraj, Uttar Pradesh';

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, max-age=300',
    },
  });
}

function isExpectedClinicMatch(displayName, formattedAddress) {
  const name = (displayName || '').toLowerCase();
  const address = (formattedAddress || '').toLowerCase();
  const matchesName = name.includes('mittal') && name.includes('dental');
  const matchesCity =
    address.length === 0 || address.includes('prayagraj') || address.includes('allahabad');
  return matchesName && matchesCity;
}

export default async function handler() {
  const apiKey = (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    ''
  ).trim();

  if (!apiKey) {
    return jsonResponse({
      configured: false,
      status: 'missing_api_key',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
      message: 'GOOGLE_PLACES_API_KEY is not configured in Netlify environment variables.',
    });
  }

  const placeId = (process.env.GOOGLE_PLACE_ID || '').trim();
  const textQuery = (process.env.GOOGLE_PLACE_TEXT_QUERY || DEFAULT_TEXT_QUERY).trim();

  try {
    if (placeId) {
      const response = await fetch(
        `${PLACES_API_BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-Maps-Solution-ID': SOLUTION_ID,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri',
          },
        },
      );

      if (response.status === 429) {
        return jsonResponse({
          configured: true,
          status: 'quota_exceeded',
          rating: null,
          userRatingCount: null,
          placeId,
          displayName: null,
          formattedAddress: null,
          googleMapsUri: null,
        });
      }

      if (!response.ok) {
        return jsonResponse({
          configured: true,
          status: response.status === 404 ? 'place_not_found' : 'upstream_error',
          rating: null,
          userRatingCount: null,
          placeId,
          displayName: null,
          formattedAddress: null,
          googleMapsUri: null,
        });
      }

      const data = await response.json();
      return jsonResponse({
        configured: true,
        status: 'ok',
        rating: typeof data.rating === 'number' ? data.rating : null,
        userRatingCount: typeof data.userRatingCount === 'number' ? data.userRatingCount : null,
        placeId: data.id || placeId,
        displayName: data.displayName?.text || null,
        formattedAddress: data.formattedAddress || null,
        googleMapsUri: data.googleMapsUri || null,
      });
    }

    const searchResponse = await fetch(`${PLACES_API_BASE}/places:searchText`, {
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

    if (searchResponse.status === 429) {
      return jsonResponse({
        configured: true,
        status: 'quota_exceeded',
        rating: null,
        userRatingCount: null,
        placeId: null,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
      });
    }

    if (!searchResponse.ok) {
      return jsonResponse({
        configured: true,
        status: 'upstream_error',
        rating: null,
        userRatingCount: null,
        placeId: null,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
      });
    }

    const payload = await searchResponse.json();
    const candidates = payload.places || [];
    const verified = candidates.find((p) =>
      isExpectedClinicMatch(p.displayName?.text, p.formattedAddress),
    );

    if (!verified) {
      return jsonResponse({
        configured: true,
        status: candidates.length === 0 ? 'place_not_found' : 'place_not_verified',
        rating: null,
        userRatingCount: null,
        placeId: null,
        displayName: null,
        formattedAddress: null,
        googleMapsUri: null,
      });
    }

    return jsonResponse({
      configured: true,
      status: 'ok',
      rating: typeof verified.rating === 'number' ? verified.rating : null,
      userRatingCount: typeof verified.userRatingCount === 'number' ? verified.userRatingCount : null,
      placeId: verified.id || null,
      displayName: verified.displayName?.text || null,
      formattedAddress: verified.formattedAddress || null,
      googleMapsUri: verified.googleMapsUri || null,
    });
  } catch {
    return jsonResponse({
      configured: true,
      status: 'upstream_error',
      rating: null,
      userRatingCount: null,
      placeId: null,
      displayName: null,
      formattedAddress: null,
      googleMapsUri: null,
    });
  }
}
