import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import {
  SNACKBAR_DURATION_MS,
  SNACKBAR_LOAD_PHOTOS_ERROR,
} from '../../core/constants/ui.constants';
import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { PhotoApiService } from '../../core/services/photo-api.service';
import { PhotosComponent } from './photos.component';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let fetchPage: jasmine.Spy;
  let favoritesAdd: jasmine.Spy;
  let favoritesGetById: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;

  const photos: Photo[] = [
    {
      id: '1',
      author: 'A',
      width: 100,
      height: 100,
      thumbnailUrl: 'https://picsum.photos/id/1/200/300',
      detailUrl: 'https://picsum.photos/id/1/400/600',
      addedAt: 0,
    },
  ];

  beforeEach(async () => {
    fetchPage = jasmine.createSpy('fetchPage').and.returnValue(of(photos));
    favoritesAdd = jasmine.createSpy('add').and.returnValue(true);
    favoritesGetById = jasmine.createSpy('getById').and.returnValue(undefined);
    snackBarOpen = jasmine.createSpy('open');

    await TestBed.configureTestingModule({
      imports: [PhotosComponent],
      providers: [
        { provide: PhotoApiService, useValue: { fetchPage } },
        {
          provide: FavoritesStore,
          useValue: { add: favoritesAdd, getById: favoritesGetById },
        },
        { provide: MatSnackBar, useValue: { open: snackBarOpen } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
  });

  it('loads first page on init', () => {
    component.ngOnInit();

    expect(fetchPage).toHaveBeenCalledWith(1);
    expect(component.photos()).toEqual(photos);
    expect(component.loading()).toBeFalse();
  });

  it('does not fetch when already loading', () => {
    component.ngOnInit();
    fetchPage.calls.reset();

    component.loading.set(true);
    component.loadMore();

    expect(fetchPage).not.toHaveBeenCalled();
  });

  it('does not fetch when there is no more data', () => {
    component.ngOnInit();
    fetchPage.calls.reset();

    component.hasMore.set(false);
    component.loadMore();

    expect(fetchPage).not.toHaveBeenCalled();
  });

  it('appends next page on loadMore', () => {
    const nextBatch: Photo[] = [
      {
        id: '2',
        author: 'B',
        width: 100,
        height: 100,
        thumbnailUrl: 'https://picsum.photos/id/2/200/300',
        detailUrl: 'https://picsum.photos/id/2/400/600',
        addedAt: 0,
      },
    ];

    fetchPage.and.returnValues(of(photos), of(nextBatch));

    component.ngOnInit();
    component.loadMore();

    expect(fetchPage).toHaveBeenCalledWith(2);
    expect(component.photos()).toEqual([...photos, ...nextBatch]);
  });

  it('stops loading when API returns empty page', () => {
    fetchPage.and.returnValues(of(photos), of([]));

    component.ngOnInit();
    component.loadMore();

    expect(component.hasMore()).toBeFalse();
    expect(component.photos()).toEqual(photos);
  });

  it('shows snackbar when photo fetch fails', () => {
    fetchPage.and.returnValue(throwError(() => new Error('network')));

    component.loadMore();

    expect(snackBarOpen).toHaveBeenCalledWith(SNACKBAR_LOAD_PHOTOS_ERROR, undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
    expect(component.loading()).toBeFalse();
  });

  it('adds photo to favorites on click', () => {
    component.onPhotoClick(photos[0]);

    expect(favoritesAdd).toHaveBeenCalledWith(photos[0]);
    expect(snackBarOpen).toHaveBeenCalledWith('Photo added to favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
  });

  it('shows snackbar when photo is already in favorites', () => {
    favoritesGetById.and.returnValue(photos[0]);

    component.onPhotoClick(photos[0]);

    expect(favoritesAdd).not.toHaveBeenCalled();
    expect(snackBarOpen).toHaveBeenCalledWith('Photo already in favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
  });
});
