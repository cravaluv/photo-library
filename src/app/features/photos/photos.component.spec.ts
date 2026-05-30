import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Photo } from '../../core/models/photo.types';
import { PhotoApiService } from '../../core/services/photo-api.service';

import { PhotosComponent } from './photos.component';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let fetchPage: jasmine.Spy;

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

    await TestBed.configureTestingModule({
      imports: [PhotosComponent],
      providers: [{ provide: PhotoApiService, useValue: { fetchPage } }],
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
});
