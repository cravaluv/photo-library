export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  detailUrl: string;
  addedAt: number;
}

export interface PicsumPhotoDto {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
