import {
  PICSUM_DETAIL,
  PICSUM_ORIGIN,
  PICSUM_THUMB,
} from '../constants/picsum.constants';
import { Photo, PicsumPhotoDto } from '../models/photo.types';

export function buildPicsumImageUrl(
  id: string,
  width: number,
  height: number,
): string {
  return `${PICSUM_ORIGIN}/id/${id}/${width}/${height}`;
}

export function mapPicsumToPhoto(dto: PicsumPhotoDto): Photo {
  return {
    id: dto.id,
    author: dto.author,
    width: dto.width,
    height: dto.height,
    thumbnailUrl: buildPicsumImageUrl(
      dto.id,
      PICSUM_THUMB.width,
      PICSUM_THUMB.height,
    ),
    detailUrl: buildPicsumImageUrl(
      dto.id,
      PICSUM_DETAIL.width,
      PICSUM_DETAIL.height,
    ),
    addedAt: 0,
  };
}