import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { Photo } from '../../core/models/photo.types';
import { SNACKBAR_DURATION_MS } from '../../core/constants/ui.constants';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { PhotoApiService } from '../../core/services/photo-api.service';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';

@Component({
  selector: 'app-photos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, PhotoGridComponent],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosComponent implements OnInit {
  private readonly photoApi = inject(PhotoApiService);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.photoApi
      .fetchPage(1)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(photos => this.photos.set(photos));
  }

  onPhotoClick(photo: Photo): void {
    if (this.favoritesStore.getById(photo.id)) {
      this.snackBar.open('Photo already in favorites', undefined, {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    this.favoritesStore.add(photo);
    this.snackBar.open('Photo added to favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
  }
}
