import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';

import { PICSUM_LIST_URL, PICSUM_PAGE_SIZE } from '../constants/picsum.constants';
import { mapPicsumToPhoto } from '../mappers/picsum-photo.mapper';
import { Photo, PicsumPhotoDto } from '../models/photo.types';

/** Emulated API latency in ms, default range [200, 300). */
export function randomApiDelayMs(min = 200, max = 300): number {
  return min + Math.random() * (max - min);
}

@Injectable({ providedIn: 'root' })
export class PhotoApiService {
  private readonly http = inject(HttpClient);

  fetchPage(page: number, limit = PICSUM_PAGE_SIZE): Observable<Photo[]> {
    return this.http
      .get<PicsumPhotoDto[]>(PICSUM_LIST_URL, { params: { page, limit } })
      .pipe(
        map((dtos) => dtos.map(mapPicsumToPhoto)),
        delay(randomApiDelayMs()),
      );
  }
}
