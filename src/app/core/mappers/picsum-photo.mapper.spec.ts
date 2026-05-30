import { PicsumPhotoDto } from '../models/photo.types';
import { buildPicsumImageUrl, mapPicsumToPhoto } from './picsum-photo.mapper';

describe('picsum-photo.mapper', () => {
  const dto: PicsumPhotoDto = {
    id: '42',
    author: 'Jane Doe',
    width: 4000,
    height: 3000,
    url: 'https://unsplash.com/photos/42',
    download_url: 'https://picsum.photos/id/42/4000/3000',
  };

  describe('buildPicsumImageUrl', () => {
    it('builds URL with id and dimensions', () => {
      const url = buildPicsumImageUrl('42', 200, 300);

      expect(url).toBe('https://picsum.photos/id/42/200/300');
    });
  });

  describe('mapPicsumToPhoto', () => {
    it('maps DTO fields and builds thumb/detail URLs', () => {
      const photo = mapPicsumToPhoto(dto);

      expect(photo.id).toBe('42');
      expect(photo.author).toBe('Jane Doe');
      expect(photo.width).toBe(4000);
      expect(photo.height).toBe(3000);
      expect(photo.thumbnailUrl).toBe('https://picsum.photos/id/42/200/300');
      expect(photo.detailUrl).toBe('https://picsum.photos/id/42/400/600');
      expect(photo.addedAt).toBe(0);
    });
  });
});
