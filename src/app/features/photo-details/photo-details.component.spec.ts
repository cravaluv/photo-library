import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';
import { SNACKBAR_DURATION_MS } from '../../core/constants/ui.constants';

import { PhotoDetailsComponent } from './photo-details.component';

describe('PhotoDetailsComponent', () => {
  let fixture: ComponentFixture<PhotoDetailsComponent>;
  let component: PhotoDetailsComponent;
  let navigate: jasmine.Spy;
  let remove: jasmine.Spy;
  let getById: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;

  const photo: Photo = {
    id: '1',
    author: 'A',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://picsum.photos/id/1/200/300',
    detailUrl: 'https://picsum.photos/id/1/400/600',
    addedAt: 100,
  };

  beforeEach(async () => {
    navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
    remove = jasmine.createSpy('remove');
    getById = jasmine.createSpy('getById').and.returnValue(photo);
    snackBarOpen = jasmine.createSpy('open');

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsComponent],
      providers: [
        { provide: Router, useValue: { navigate } },
        { provide: FavoritesStore, useValue: { getById, remove } },
        { provide: MatSnackBar, useValue: { open: snackBarOpen } },
      ],
    }).compileComponents();
  });

  function createComponent(routeId?: string): void {
    fixture = TestBed.createComponent(PhotoDetailsComponent);
    component = fixture.componentInstance;

    if (routeId !== undefined) {
      fixture.componentRef.setInput('id', routeId);
    }

    fixture.detectChanges();
  }

  it('redirects to favorites when route id input is missing', () => {
    createComponent();

    expect(navigate).toHaveBeenCalledWith(['/favorites']);
    expect(component.photo()).toBeUndefined();
  });

  it('redirects to favorites when photo is not in store', () => {
    getById.and.returnValue(undefined);
    createComponent('1');

    expect(navigate).toHaveBeenCalledWith(['/favorites']);
    expect(component.photo()).toBeUndefined();
  });

  it('shows photo when it exists in favorites', () => {
    createComponent('1');

    expect(navigate).not.toHaveBeenCalled();
    expect(component.photo()).toEqual(photo);
    expect(fixture.nativeElement.querySelector('.photo-details__image')).toBeTruthy();
  });

  it('removes photo and navigates back to favorites', () => {
    createComponent('1');

    component.remove();

    expect(remove).toHaveBeenCalledWith('1');
    expect(snackBarOpen).toHaveBeenCalledWith('Photo removed from favorites', undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
