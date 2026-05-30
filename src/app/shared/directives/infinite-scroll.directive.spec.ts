import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollDirective } from './infinite-scroll.directive';

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<{ disabled: boolean }>;
  let scrolledToEnd: jasmine.Spy;

  let triggerIntersect: (visible: boolean) => void;

  beforeEach(async () => {
    scrolledToEnd = jasmine.createSpy('scrolledToEnd');

    window.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        triggerIntersect = (visible) =>
          callback([{ isIntersecting: visible } as IntersectionObserverEntry], null!);
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;

    @Component({
      imports: [InfiniteScrollDirective],
      template: `
        <div
          appInfiniteScroll
          [disabled]="disabled"
          (scrolledToEnd)="scrolledToEnd()"
        ></div>
      `,
    })
    class TestBedHost {
      disabled = false;
      scrolledToEnd = scrolledToEnd;
    }

    await TestBed.configureTestingModule({ imports: [TestBedHost] }).compileComponents();
    fixture = TestBed.createComponent(TestBedHost);
    fixture.detectChanges();
  });

  it('emits scrolledToEnd when sentinel is visible', () => {
    triggerIntersect(true);

    expect(scrolledToEnd).toHaveBeenCalled();
  });

  it('does not emit when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    triggerIntersect(true);

    expect(scrolledToEnd).not.toHaveBeenCalled();
  });
});
