import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[acomiDirectiveParallax]'
})
export class ParallaxDirective implements AfterViewInit {
  @Input() parallaxRatio = 1;
  initialTop = 0;

  private parentElement: HTMLElement;

  constructor(private eleRef: ElementRef, private renderer2: Renderer2) {
  }

  @HostListener('document:scroll')
  onWindowScroll(): void {
    this.parallaxTopPos();
  }

  parallaxTopPos(currentTopFalling = this.initialTop): void {
    const heightElement =
      (this.parentElement.clientWidth /
        this.eleRef.nativeElement.naturalWidth) *
      this.eleRef.nativeElement.naturalHeight;
    const offsetBottomParent =
      heightElement -
      this.parentElement.clientHeight -
      currentTopFalling * this.parallaxRatio -
      5;
    if (offsetBottomParent > 0) {
      this.eleRef.nativeElement.style.top =
        this.initialTop - currentTopFalling * this.parallaxRatio + 'px';
    }
  }

  ngAfterViewInit(): void {
    this.initialTop = this.eleRef.nativeElement.offsetTop;
    this.parentElement = this.eleRef.nativeElement.parentElement;
    const currentPositionCSS = getComputedStyle(this.parentElement).position;
    if (currentPositionCSS !== 'relative') {
      this.renderer2.setStyle(this.parentElement, 'position', 'relative');
    }
  }
}
