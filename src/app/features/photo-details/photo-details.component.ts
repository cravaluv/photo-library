import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { PICSUM_DETAIL } from '../../core/constants/picsum.constants';
import {
  SNACKBAR_DURATION_MS,
  SNACKBAR_FAVORITES_REMOVE_ERROR,
} from '../../core/constants/ui.constants';
import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';

@Component({
  selector: 'app-photo-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatButtonModule],
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.scss',
})
export class PhotoDetailsComponent implements OnInit {
  readonly id = input<string>();

  private readonly router = inject(Router);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly photo = signal<Photo | undefined>(undefined);
  readonly detailWidth = PICSUM_DETAIL.width;
  readonly detailHeight = PICSUM_DETAIL.height;

  ngOnInit(): void {
    const photoId = this.id();

    if (!photoId) {
      void this.router.navigate(['/favorites']);
      return;
    }

    const found = this.favoritesStore.getById(photoId);

    if (!found) {
      void this.router.navigate(['/favorites']);
      return;
    }

    this.photo.set(found);
  }

  remove(): void {
    const current = this.photo();

    if (!current) {
      return;
    }

    if (!this.favoritesStore.remove(current.id)) {
      this.snackBar.open(SNACKBAR_FAVORITES_REMOVE_ERROR, undefined, {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    this.snackBar.open('Photo removed from favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
    void this.router.navigate(['/favorites']);
  }
}
