import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[acomiDragNDrop]',
})
export class DragNDropDirective implements OnDestroy {

  @Output() isFileOver = new EventEmitter<boolean>();
  @Output() fileDropped = new EventEmitter<DataTransfer>();
  @Output() fileDragging = new EventEmitter<Event>();
  @Output() fileInvalid = new EventEmitter<DataTransferItem>();

  /**
   * disable the drag event.
   */
  @Input() disabledWhen = false;
  /**
   * list of allowed mime types
   */
  @Input() allowFile: string[] = ['image/png'];

  private onDestroy = new Subject();

  /**
   *
   * @param elementRef: Current element that have this directive
   * @param IDocument: Host document to listen for file dragging
   */
  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private IDocument: Document) {
    fromEvent(IDocument, 'dragover').pipe(takeUntil(this.onDestroy)).subscribe(event => this.onDragging(event));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.disabledWhen) {
      return;
    }
    this.isFileOver.emit(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  onDragLeave(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    if (this.disabledWhen) {
      return;
    }
    this.isFileOver.emit(false);
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  ondrop(dropEvent: DragEvent): void {
    dropEvent.preventDefault();
    dropEvent.stopPropagation();
    if (this.disabledWhen) {
      return;
    }

    this.isFileOver.emit(false);
    if (dropEvent.dataTransfer?.files?.length > 0) {
      this.fileDropped.emit(dropEvent.dataTransfer);
    }
  }

  /**
   * Listen event user drag file into our application.
   * Check for file extension is valid or not
   * @param event : Event user drag file
   */
  onDragging(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.items[0];

    if (file && this.allowFile.indexOf(file.type) === -1) {
      this.fileInvalid.emit(file);
    }

    this.fileDragging.emit(event);
  }
}
