import { inject, Injectable, signal } from '@angular/core';

import { Photo } from '../models/photo.types';
import { FavoritesStorage } from '../storage/favorites-storage';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(FavoritesStorage);

  private readonly favoritesState = signal<Photo[]>(this.loadInitial());

  readonly favorites = this.favoritesState.asReadonly();

  add(photo: Photo) {
    if (this.favorites().some((f) => f.id === photo.id)) {
      return;
    }

    const entry: Photo = { ...photo, addedAt: Date.now() };
    const next = [...this.favorites(), entry];

    this.setFavorites(next);
  }

  remove(id: string) {
    const next = this.favorites().filter((f) => f.id !== id);

    this.setFavorites(next);
  }

  getById(id: string): Photo | undefined {
    return this.favorites().find((f) => f.id === id);
  }

  private loadInitial(): Photo[] {
    return this.storage.load();
  }

  private setFavorites(next: Photo[]) {
    this.favoritesState.set(next);
    this.storage.save(next);
  }
}
