import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[acomiOverCounted]',
})
export class OverCountedDirective implements OnInit {
  /**
   * Max value before over counted.
   */
  @Input() overCountWhenExceed = 9;
  /**
   * Value to be watch. Should be `string-number` or `number`
   */
  @Input() value: string | number = null;
  /**
   * character to set as over-counted character.
   */
  @Input() charOverCounted: '+' | string = '+';
  /**
   * position of the over counted character
   */
  @Input() charPosition: 'start' | 'end' = 'start';

  constructor(
    private elementRef: ElementRef<HTMLDivElement | HTMLSpanElement | HTMLParagraphElement>,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    const currentText = this.elementRef.nativeElement.textContent.trim();
    if (this.value == null) {
      this.value = currentText;
    }
    const renderNode:
      | HTMLDivElement
      | HTMLSpanElement
      | HTMLParagraphElement = this.renderer.selectRootElement(
      this.elementRef.nativeElement,
    );
    if (isNaN(+this.value)) {
      renderNode.textContent = String(this.value);
    }
    let overNumber = '9';
    while (overNumber.length < this.overCountWhenExceed) {
      overNumber = overNumber + '9';
    }
    if (+this.value <= +overNumber) {
      renderNode.textContent = String(this.value);
    } else {
      if (this.charPosition === 'start') {
        renderNode.textContent = this.charOverCounted + overNumber;
      } else {
        renderNode.textContent = overNumber + this.charOverCounted;
      }
    }
  }
}
