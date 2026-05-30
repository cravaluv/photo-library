import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '../../core/models/photo.types';
import { FavoritesStore } from '../../core/services/favorites-store.service';

import { FavoritesComponent } from './favorites.component';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favorites: ReturnType<typeof signal<Photo[]>>;

  const photo: Photo = {
    id: '1',
    author: 'A',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://picsum.photos/id/1/200/300',
    detailUrl: 'https://picsum.photos/id/1/800/1200',
    addedAt: 100,
  };

  beforeEach(async () => {
    favorites = signal<Photo[]>([]);

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        {
          provide: FavoritesStore,
          useValue: { favorites },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with empty favorites', () => {
    expect(component.favorites()).toEqual([]);
  });

  it('exposes favorites from store sorted by addedAt desc', () => {
    const older: Photo = { ...photo, id: '1', addedAt: 100 };
    const newer: Photo = { ...photo, id: '2', addedAt: 200 };

    favorites.set([older, newer]);
    fixture.detectChanges();

    expect(component.favorites()).toEqual([newer, older]);
  });
});
