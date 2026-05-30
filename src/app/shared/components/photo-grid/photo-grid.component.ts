import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Photo } from '../../../core/models/photo.types';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
@Component({
  selector: 'app-photo-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoCardComponent],
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
})
export class PhotoGridComponent {
  readonly photos = input.required<Photo[]>();
  readonly photoClick = output<Photo>();
}