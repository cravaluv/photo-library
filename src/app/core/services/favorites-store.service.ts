import { inject, Injectable, signal } from '@angular/core';

import { Photo } from '../models/photo.types';
import { FavoritesStorage } from '../storage/favorites-storage';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(FavoritesStorage);

  private readonly favoritesState = signal<Photo[]>(this.loadInitial());

  readonly favorites = this.favoritesState.asReadonly();

  add(photo: Photo): boolean {
    if (this.favorites().some((f) => f.id === photo.id)) {
      return true;
    }

    const entry: Photo = { ...photo, addedAt: Date.now() };
    const next = [...this.favorites(), entry];

    if (!this.storage.save(next)) {
      return false;
    }

    this.favoritesState.set(next);
    return true;
  }

  remove(id: string): boolean {
    const next = this.favorites().filter((f) => f.id !== id);

    if (!this.storage.save(next)) {
      return false;
    }

    this.favoritesState.set(next);
    return true;
  }

  getById(id: string): Photo | undefined {
    return this.favorites().find((f) => f.id === id);
  }

  private loadInitial(): Photo[] {
    return this.storage.load();
  }
}
