import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[acomiIsOutside]'
})
export class ClickOutSideDirective {
  @Output()
  isOutside: EventEmitter<void> = new EventEmitter();

  @Input()
  whiteListClass = 'ngIfExceptionDirective';

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseEnter(event: MouseEvent): void {
    const domTarget = event.target as HTMLElement;
    const isExceptionDOM = domTarget.classList.contains(this.whiteListClass);
    const isClickedInside = this.elementRef.nativeElement.contains(domTarget);
    if (!isClickedInside && !isExceptionDOM) {
      this.isOutside.emit();
    }
  }
}
