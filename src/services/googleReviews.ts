export interface GoogleReviewsSummary {
  configured: boolean;
  status: string;
  rating: number | null;
  userRatingCount: number | null;
  placeId: string | null;
  displayName: string | null;
  formattedAddress: string | null;
  googleMapsUri: string | null;
}

const FALLBACK_SUMMARY: GoogleReviewsSummary = {
  configured: false,
  status: 'unavailable',
  rating: null,
  userRatingCount: null,
  placeId: null,
  displayName: null,
  formattedAddress: null,
  googleMapsUri: null,
};

export async function fetchGoogleReviewsSummary(
  signal?: AbortSignal,
): Promise<GoogleReviewsSummary> {
  try {
    const response = await fetch('/api/google-reviews', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      return FALLBACK_SUMMARY;
    }

    const data = (await response.json()) as Partial<GoogleReviewsSummary>;
    return {
      configured: Boolean(data.configured),
      status: typeof data.status === 'string' ? data.status : 'unavailable',
      rating:
        typeof data.rating === 'number' && Number.isFinite(data.rating)
          ? data.rating
          : null,
      userRatingCount:
        typeof data.userRatingCount === 'number' && Number.isFinite(data.userRatingCount)
          ? data.userRatingCount
          : null,
      placeId: typeof data.placeId === 'string' ? data.placeId : null,
      displayName: typeof data.displayName === 'string' ? data.displayName : null,
      formattedAddress:
        typeof data.formattedAddress === 'string' ? data.formattedAddress : null,
      googleMapsUri: typeof data.googleMapsUri === 'string' ? data.googleMapsUri : null,
    };
  } catch {
    return FALLBACK_SUMMARY;
  }
}
