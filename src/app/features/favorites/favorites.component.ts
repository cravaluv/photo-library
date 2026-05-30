import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';

@Component({
  selector: 'app-favorites',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoGridComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly router = inject(Router);

  readonly favorites = computed(() =>
    [...this.favoritesStore.favorites()].sort((a, b) => b.addedAt - a.addedAt),
  );

  onPhotoClick(photo: Photo): void {
    void this.router.navigate(['/photos', photo.id]);
  }
}
