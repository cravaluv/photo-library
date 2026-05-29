import { Injectable } from '@angular/core';

import { FAVORITES_STORAGE_KEY } from '../constants/picsum.constants';
import { Photo } from '../models/photo.types';

@Injectable({ providedIn: 'root' })
export class FavoritesStorage {
  load(): Photo[] {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as Photo[];
    } catch {
      return [];
    }
  }

  save(photos: Photo[]) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(photos));
  }
}
