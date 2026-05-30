import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PICSUM_THUMB } from '../../../core/constants/picsum.constants';
import { Photo } from '../../../core/models/photo.types';

@Component({
  selector: 'app-photo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  readonly photo = input.required<Photo>();
  readonly photoClick = output<Photo>();

  readonly thumbWidth = PICSUM_THUMB.width;
  readonly thumbHeight = PICSUM_THUMB.height;

  onClick(): void {
    this.photoClick.emit(this.photo());
  }
}