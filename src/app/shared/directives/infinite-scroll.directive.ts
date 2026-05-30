import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  host: {
    class: 'infinite-scroll-sentinel',
    style: 'display: block; block-size: 1px; inline-size: 100%;',
  },
})
export class InfiniteScrollDirective implements AfterViewInit, OnDestroy {
  readonly disabled = input(false);
  readonly scrolledToEnd = output<void>();

  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || this.disabled()) {
        return;
      }

      this.scrolledToEnd.emit();
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
