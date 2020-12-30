import { NgModule } from '@angular/core';
import { DragNDropDirective } from './drag-n-drop.directive';

@NgModule({
  declarations: [DragNDropDirective],
  exports: [DragNDropDirective],
})
export class DragNDropModule {
}
