import { CityData, CITIES_LIST } from '../data/bmsData';

export interface LocationDetectionResult {
  success: boolean;
  city: CityData;
  coords?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  localityName?: string;
  source: 'GPS_REVERSE_GEO' | 'GPS_NEAREST_MATCH' | 'FALLBACK';
  distanceKm?: number;
  message: string;
}

/**
 * Calculates distance between two coordinates in Kilometers using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest city in CITIES_LIST based on geographical coordinates.
 */
export function findNearestRegisteredCity(
  latitude: number,
  longitude: number
): { city: CityData; distanceKm: number } {
  let closestCity = CITIES_LIST[0];
  let minDistance = Infinity;

  for (const city of CITIES_LIST) {
    if (city.lat !== undefined && city.lng !== undefined) {
      const dist = calculateHaversineDistanceKm(latitude, longitude, city.lat, city.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }
  }

  return { city: closestCity, distanceKm: minDistance };
}

/**
 * Performs Live GPS Geolocation detection and reverse-geocodes with fallback.
 */
export async function detectUserLiveLocation(): Promise<LocationDetectionResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      city: CITIES_LIST[0],
      source: 'FALLBACK',
      message: 'Geolocation is not supported by your browser environment.'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearest = findNearestRegisteredCity(latitude, longitude);

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim or BigDataCloud
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: controller.signal }
          ).catch(() => null);

          clearTimeout(timeoutId);

          if (response && response.ok) {
            const data = await response.json();
            const detectedCityName = data.city || data.locality || data.principalSubdivision || '';
            const detectedCountry = data.countryName || 'India';
            const detectedState = data.principalSubdivision || '';

            // Check if matches an existing city in CITIES_LIST
            const exactMatch = CITIES_LIST.find((c) =>
              c.name.toLowerCase() === detectedCityName.toLowerCase() ||
              (detectedCityName && c.name.toLowerCase().includes(detectedCityName.toLowerCase())) ||
              (c.state && detectedState && c.state.toLowerCase() === detectedState.toLowerCase() && nearest.distanceKm < 80)
            );

            if (exactMatch) {
              resolve({
                success: true,
                city: exactMatch,
                coords: { latitude, longitude, accuracy },
                localityName: `${detectedCityName || exactMatch.name}, ${detectedState}`,
                source: 'GPS_REVERSE_GEO',
                distanceKm: nearest.distanceKm,
                message: `Live Location Pinpointed: ${exactMatch.name} (Nearest registered hub: ${nearest.distanceKm} km)`
              });
              return;
            }

            if (detectedCityName) {
              // Create dynamic live city instance
              const liveCustomCity: CityData = {
                id: `live-${detectedCityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: detectedCityName,
                state: detectedState || nearest.city.state,
                country: detectedCountry,
                region: detectedCountry.toLowerCase().includes('india') ? 'India' : nearest.city.region,
                isPopular: false,
                currency: detectedCountry.toLowerCase().includes('india') ? 'INR' : nearest.city.currency,
                currencySymbol: detectedCountry.toLowerCase().includes('india') ? '₹' : nearest.city.currencySymbol,
                flagEmoji: detectedCountry.toLowerCase().includes('india') ? '🇮🇳' : '📍',
                lat: latitude,
                lng: longitude
              };

              resolve({
                success: true,
                city: liveCustomCity,
                coords: { latitude, longitude, accuracy },
                localityName: `${detectedCityName}, ${detectedState || detectedCountry}`,
                source: 'GPS_REVERSE_GEO',
                distanceKm: nearest.distanceKm,
                message: `Live Location Detected: ${detectedCityName} (within ${nearest.distanceKm} km of ${nearest.city.name})`
              });
              return;
            }
          }
        } catch {
          // Ignore network reverse-geocode errors and fallback to nearest registered city
        }

        // Nearest Registered City Match
        resolve({
          success: true,
          city: nearest.city,
          coords: { latitude, longitude, accuracy },
          localityName: `${nearest.city.name}, ${nearest.city.state}`,
          source: 'GPS_NEAREST_MATCH',
          distanceKm: nearest.distanceKm,
          message: `Nearest Cinema Hub: ${nearest.city.name} (${nearest.distanceKm} km away)`
        });
      },
      (error) => {
        let errorMsg = 'Could not access location sensor.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Defaulting to Mumbai, India.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }

        resolve({
          success: false,
          city: CITIES_LIST[0],
          source: 'FALLBACK',
          message: errorMsg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 300000 // Cache for 5 mins
      }
    );
  });
}
