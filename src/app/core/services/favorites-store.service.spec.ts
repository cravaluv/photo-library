import { TestBed } from '@angular/core/testing';

import { FAVORITES_STORAGE_KEY } from '../constants/picsum.constants';
import { Photo } from '../models/photo.types';
import { FavoritesStorage } from '../storage/favorites-storage';
import { FavoritesStore } from './favorites-store.service';

describe('FavoritesStore', () => {
  let store: FavoritesStore;

  const photo: Photo = {
    id: '1',
    author: 'A',
    width: 100,
    height: 100,
    thumbnailUrl: 'https://picsum.photos/id/1/200/300',
    detailUrl: 'https://picsum.photos/id/1/400/600',
    addedAt: 0,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(FavoritesStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts empty when localStorage is empty', () => {
    expect(store.favorites()).toEqual([]);
  });

  it('adds photo with addedAt timestamp', () => {
    store.add(photo);

    expect(store.favorites()[0].addedAt).toBeGreaterThan(0);
  });

  it('does not duplicate when adding same id', () => {
    store.add(photo);
    store.add(photo);

    expect(store.favorites().length).toBe(1);
  });

  it('removes photo by id', () => {
    store.add(photo);
    store.remove('1');

    expect(store.favorites()).toEqual([]);
  });

  it('persists to localStorage on add and remove', () => {
    store.add(photo);
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBeTruthy();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloaded = TestBed.inject(FavoritesStore);

    expect(reloaded.favorites().length).toBe(1);
    expect(reloaded.getById('1')?.id).toBe('1');

    reloaded.remove('1');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloaded2 = TestBed.inject(FavoritesStore);

    expect(reloaded2.favorites()).toEqual([]);
  });

  it('getById returns undefined for unknown id', () => {
    expect(store.getById('missing')).toBeUndefined();
  });

  it('uses FavoritesStorage for persistence', () => {
    const storageSpy = spyOn(TestBed.inject(FavoritesStorage), 'save');

    store.add(photo);

    expect(storageSpy).toHaveBeenCalled();
  });
});
