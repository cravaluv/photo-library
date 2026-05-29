import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeaderComponent, RouterOutlet],
  template: `
    <div class="main-layout">
      <app-header />
      <main class="main-layout__content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
