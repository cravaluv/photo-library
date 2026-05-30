import { TestBed } from '@angular/core/testing';

import { FAVORITES_STORAGE_KEY } from '../constants/picsum.constants';
import { Photo } from '../models/photo.types';
import { FavoritesStorage } from './favorites-storage';

describe('FavoritesStorage', () => {
  let storage: FavoritesStorage;

  const photo: Photo = {
    id: '1',
    author: 'A',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://picsum.photos/id/1/200/300',
    detailUrl: 'https://picsum.photos/id/1/400/600',
    addedAt: 1000,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(FavoritesStorage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns empty array when nothing stored', () => {
    expect(storage.load()).toEqual([]);
  });

  it('saves and loads photos', () => {
    storage.save([photo]);
    expect(storage.load()).toEqual([photo]);
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe(
      JSON.stringify([photo]),
    );
  });

  it('returns empty array for corrupt JSON', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{not-json');
    expect(storage.load()).toEqual([]);
  });

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{"id":"1"}');
    expect(storage.load()).toEqual([]);
  });

  it('returns false when localStorage setItem fails', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError(
      new DOMException('quota', 'QuotaExceededError'),
    );

    expect(storage.save([photo])).toBeFalse();
  });
});
