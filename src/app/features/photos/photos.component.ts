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
import { finalize } from 'rxjs';

import { Photo } from '../../core/models/photo.types';
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
}
