import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

function htmlUnitToFixed(strUnit: string): number {
  const regExp = /^-?\d+(\.\d+)?/g;
  const matching = strUnit.match(regExp);
  if (matching) {
    const toParsing = matching[0];
    return Number.parseFloat(toParsing);
  }
  return null;
}

@Directive({
  selector: '[acomiCarousel]',
})
export class CarouselDirective implements AfterViewInit, OnDestroy {
  @Input()
  contentCarousel: HTMLElement;

  @Input()
  leftTriggerElement: HTMLElement;

  @Input()
  rightTriggerElement: HTMLElement;

  @Input()
  /**
   * Allow the directive to handle moving the content of the carousel.
   * Directive will make the CSS of the content carousel:
   * - Make the container position relative and overflow hidden.
   * - Make the content position absolute
   * - Change `left` property to **some-number** + px
   */
  autoBindPosition = true;

  @Input()
  /**
   * give carousel the ability to control overflow attribute
   */
  carouselOverflowControl = true;

  @Input()
  /**
   * By default, each move action will scroll the **full width minus `105px`** of the content child.
   * increase this to control distance of moving.
   * Unit: Pixel
   */
  reducedStep = 105;

  @Output()
  leftPositionChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  isLeftTriggerMaxed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  isRightTriggerMaxed: EventEmitter<boolean> = new EventEmitter<boolean>();

  private maxLeft = 0;
  /**
   * Initialize position of the carousel.
   * Unit: Pixel
   */
  private currentLeft = 0;
  private onDestroyDirective: Subject<boolean> = new Subject();

  private containerCarousel: HTMLElement;

  constructor(
    private container: ElementRef<HTMLElement>,
    private renderer2: Renderer2,
  ) {
  }

  ngOnDestroy(): void {
    this.onDestroyDirective.next(true);
    this.onDestroyDirective.complete();
  }

  ngAfterViewInit(): void {
    this.containerCarousel = this.container.nativeElement;
    if (this.containerCarousel && this.contentCarousel) {
      this.setupCSSForDOM();
      const initPosition = this.calculateListPosition(
        this.containerCarousel,
        this.contentCarousel,
      );
      this.setPositionStates(
        initPosition.left,
        initPosition.max_calculated_left,
      );
    }

    if (this.leftTriggerElement) {
      fromEvent(this.leftTriggerElement, 'click')
        .pipe(
          takeUntil(this.onDestroyDirective),
          takeWhile(() => this.currentLeft < 0),
        )
        .subscribe((event) => {
          event.preventDefault();
          event.stopPropagation();
          const { max_calculated_left, new_left } = this.onMoveLeft(
            this.containerCarousel,
            this.contentCarousel,
            this.currentLeft,
            this.reducedStep,
          );
          this.setPositionStates(new_left, max_calculated_left);
        });
    }

    if (this.rightTriggerElement) {
      fromEvent(this.rightTriggerElement, 'click')
        .pipe(
          takeUntil(this.onDestroyDirective),
          takeWhile(() => this.currentLeft > this.maxLeft),
        )
        .subscribe((event) => {
          event.preventDefault();
          event.stopPropagation();
          const { new_left, max_calculated_left } = this.onMoveRight(
            this.containerCarousel,
            this.contentCarousel,
            this.currentLeft,
            this.reducedStep,
          );
          this.setPositionStates(new_left, max_calculated_left);
        });
    }
  }

  private setPositionStates(left: number, maxLef: number): void {
    this.maxLeft = maxLef;
    this.currentLeft = left;
    this.leftPositionChanged.emit(this.currentLeft);
    if (this.autoBindPosition) {
      this.setContentLeft(this.currentLeft);
    }
    setTimeout(() => {
      this.isLeftTriggerMaxed.emit(this.currentLeft >= 0);
      this.isRightTriggerMaxed.emit(this.currentLeft <= this.maxLeft);
    });
  }

  /**
   * Move the content to the left of the screen (click button right -> content goes left)
   * By subtracting the `left` CSS value, the DOM will be moved to left
   * @param sectionContainer container elementRef instance
   * @param sectionContent content elementRef instance
   * @param currentLeftPosition current position `left` CSS
   * @param additionalStep subtract distance of each moving step, by default is `105` (in pixel).
   * By default it will move a distance equal with the clientWidth of the container, however, will subtract it with the
   * provided `additionalStep`
   * @private
   */
  private onMoveRight(
    sectionContainer: HTMLElement,
    sectionContent: HTMLElement,
    currentLeftPosition: number,
    additionalStep = 105,
  ): {
    max_calculated_left: number,
    new_left: number,
  } {
    let leftNew;
    const {
      container_width,
      max_calculated_left,
      left,
    } = this.calculateListPosition(sectionContainer, sectionContent);
    leftNew = left - (container_width - additionalStep);
    const maximumLeft = max_calculated_left;
    if (leftNew < 0 && leftNew < maximumLeft) {
      leftNew = maximumLeft;
    }
    if (leftNew !== currentLeftPosition) {
      currentLeftPosition = leftNew;
    }
    return {
      max_calculated_left: maximumLeft,
      new_left: currentLeftPosition,
    };
  }

  /**
   * Move the content to the right of the screen (click button left -> content goes right)
   * By adding the `left` CSS value, the dom will be pushed to right
   * @param sectionContainer container elementRef instance
   * @param sectionContent content elementRef instance
   * @param currentLeftPosition current position `left` CSS
   * @param additionalStep subtract distance of each moving step, by default is `105` (in pixel).
   * By default it will move a distance equal with the clientWidth of the container, however, will subtract it with the
   * provided `additionalStep`
   * @private
   */
  private onMoveLeft(
    sectionContainer: HTMLElement,
    sectionContent: HTMLElement,
    currentLeftPosition: number,
    additionalStep = 105,
  ): {
    max_calculated_left: number,
    new_left: number,
  } {
    let leftNew;
    const {
      container_width,
      max_calculated_left,
      left,
    } = this.calculateListPosition(sectionContainer, sectionContent);
    leftNew = left + (container_width - additionalStep);
    const maximumLeft = max_calculated_left;
    if (leftNew > 0) {
      leftNew = 0;
    }
    if (leftNew !== currentLeftPosition) {
      currentLeftPosition = leftNew;
    }
    return {
      max_calculated_left: maximumLeft,
      new_left: currentLeftPosition,
    };
  }

  /**
   * Get the current dimension of container, content, and its position based on the provided style CSS
   * @param sectionContainer
   * @param sectionContent
   * @private
   */
  private calculateListPosition(
    sectionContainer: HTMLElement,
    sectionContent: HTMLElement,
  ): {
    container_width: number,
    list_width: number,
    left: number,
    max_calculated_left: number,
  } {
    const containerWidth = sectionContainer.clientWidth;
    const listWidth = sectionContent.clientWidth;
    const currentLeftRaw = getComputedStyle(sectionContent).left;
    const currentLeft = htmlUnitToFixed(currentLeftRaw);
    return {
      container_width: containerWidth,
      list_width: listWidth,
      left: currentLeft,
      max_calculated_left: containerWidth - listWidth,
    };
  }

  private setupCSSForDOM(): void {
    // make container relative to contain absolute content
    console.log('set relative');
    this.setPosition(this.containerCarousel, 'relative');
    // set height container to prevent collapse (because of pos-absolute)
    this.setHeightContainer(
      htmlUnitToFixed(getComputedStyle(this.contentCarousel).height),
    );
    if (this.carouselOverflowControl) {
      // make overflow of the container become hidden
      this.renderer2.setStyle(this.containerCarousel, 'overflow', 'hidden');
    }

    // set the content to absolute
    this.setPosition(this.contentCarousel, 'absolute');
    // set the position left
    this.setContentLeft(this.currentLeft);
  }

  private setPosition(element: HTMLElement, to: 'relative' | 'absolute'): void {
    this.renderer2.setStyle(element, 'position', to);
  }

  private setContentLeft(to: number): void {
    this.renderer2.setStyle(this.contentCarousel, 'left', `${to}px`);
  }

  private setHeightContainer(to: number): void {
    this.renderer2.setStyle(this.containerCarousel, 'height', `${to}px`);
  }
}
