import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, finalize } from 'rxjs';

import {
  SNACKBAR_DURATION_MS,
  SNACKBAR_FAVORITES_SAVE_ERROR,
  SNACKBAR_LOAD_PHOTOS_ERROR,
} from '../../core/constants/ui.constants';
import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { PhotoApiService } from '../../core/services/photo-api.service';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator/loading-indicator.component';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-photos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InfiniteScrollDirective, LoadingIndicatorComponent, PhotoGridComponent],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosComponent implements OnInit {
  private readonly photoApi = inject(PhotoApiService);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = signal<Photo[]>([]);
  readonly page = signal(0);
  readonly loading = signal(false);
  readonly hasMore = signal(true);

  readonly showInitialLoader = computed(
    () => this.photos().length === 0 && this.loading(),
  );
  readonly showBottomLoader = computed(
    () => this.photos().length > 0 && this.loading() && this.hasMore(),
  );

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    this.loading.set(true);
    const nextPage = this.page() + 1;

    this.photoApi
      .fetchPage(nextPage)
      .pipe(
        catchError(() => {
          this.snackBar.open(SNACKBAR_LOAD_PHOTOS_ERROR, undefined, {
            duration: SNACKBAR_DURATION_MS,
          });
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((batch) => {
        if (batch.length === 0) {
          this.hasMore.set(false);
          return;
        }

        this.page.set(nextPage);
        this.photos.update((prev) => [...prev, ...batch]);
      });
  }

  onPhotoClick(photo: Photo): void {
    if (this.favoritesStore.getById(photo.id)) {
      this.snackBar.open('Photo already in favorites', undefined, {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    if (!this.favoritesStore.add(photo)) {
      this.snackBar.open(SNACKBAR_FAVORITES_SAVE_ERROR, undefined, {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    this.snackBar.open('Photo added to favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
  }
}
