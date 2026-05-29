import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PICSUM_LIST_URL, PICSUM_PAGE_SIZE } from '../constants/picsum.constants';
import { PhotoApiService } from './photo-api.service';
import { PicsumPhotoDto } from '../models/photo.types';

describe('PhotoApiService', () => {
  let service: PhotoApiService;
  let httpMock: HttpTestingController;

  const mockDtos: PicsumPhotoDto[] = [
    {
      id: '1',
      author: 'A',
      width: 100,
      height: 100,
      url: 'https://example.com/1',
      download_url: 'https://picsum.photos/id/1/100/100',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoApiService,
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests list with page and limit params', fakeAsync(() => {
    let result: unknown;
    service.fetchPage(2, 5).subscribe((photos) => {
      result = photos;
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === PICSUM_LIST_URL &&
        r.params.get('page') === '2' &&
        r.params.get('limit') === '5',
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockDtos);
    tick(300);

    expect(result).toEqual([
      jasmine.objectContaining({
        id: '1',
        author: 'A',
        thumbnailUrl: 'https://picsum.photos/id/1/200/300',
        detailUrl: 'https://picsum.photos/id/1/800/1200',
      }),
    ]);
  }));

  it('uses default page size when limit omitted', fakeAsync(() => {
    let result: unknown;

    service.fetchPage(1).subscribe((photos) => {
      result = photos;
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === PICSUM_LIST_URL &&
        r.params.get('page') === '1' &&
        r.params.get('limit') === String(PICSUM_PAGE_SIZE),
    );

    req.flush([]);
    tick(300);

    expect(result).toEqual([]);
  }));
});
