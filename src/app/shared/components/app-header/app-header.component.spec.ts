import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let routerUrl: string;
  let routerEvents: ReplaySubject<NavigationEnd>;

  function navigateTo(url: string): void {
    routerUrl = url;
    routerEvents.next(new NavigationEnd(1, url, url));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    routerUrl = '/';
    routerEvents = new ReplaySubject(1);
    routerEvents.next(new NavigationEnd(1, '/', '/'));

    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: Router,
          useValue: {
            get url() {
              return routerUrl;
            },
            events: routerEvents.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight Photos on root route', () => {
    expect(component.activeSection()).toBe('photos');
  });

  it('should highlight Favorites on favorites route', () => {
    navigateTo('/favorites');
    expect(component.activeSection()).toBe('favorites');
  });

  it('should highlight Favorites on photo detail route', () => {
    navigateTo('/photos/42');
    expect(component.activeSection()).toBe('favorites');
  });
});
