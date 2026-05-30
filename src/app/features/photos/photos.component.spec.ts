import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { PhotosComponent } from './photos.component';
import { SNACKBAR_DURATION_MS } from '../../core/constants/ui.constants';
import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { PhotoApiService } from '../../core/services/photo-api.service';

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
      detailUrl: 'https://picsum.photos/id/1/800/1200',
      addedAt: 0,
    },
  ];

  beforeEach(async () => {
    fetchPage = jasmine.createSpy('fetchPage').and.returnValue(of(photos));
    favoritesAdd = jasmine.createSpy('add');
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
