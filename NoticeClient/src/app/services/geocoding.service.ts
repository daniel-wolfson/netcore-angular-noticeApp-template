import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

// NOTE: For production, DO NOT keep the API key in frontend code.
// Restrict the key by HTTP referrer at minimum or move this call to your backend.
// Replace the placeholder below with a properly secured key or inject via environment.
const GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface GoogleGeocodeResponse {
  status: string;
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
  error_message?: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  geocode(address: string): Observable<GeocodeResult | null> {
    if (!address.trim()) {
      return new Observable<GeocodeResult | null>((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }

    const params = new HttpParams().set('address', address).set('key', GOOGLE_MAPS_API_KEY);

    return this.http.get<GoogleGeocodeResponse>(this.endpoint, { params }).pipe(
      map((resp) => {
        if (resp.status !== 'OK' || !resp.results.length) {
          return null;
        }
        const first = resp.results[0];
        return {
          latitude: first.geometry.location.lat,
          longitude: first.geometry.location.lng,
          formattedAddress: first.formatted_address,
        } as GeocodeResult;
      })
    );
  }
}
