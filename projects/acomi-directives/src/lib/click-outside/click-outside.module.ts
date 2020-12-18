import { NgModule } from '@angular/core';
import { ClickOutSideDirective } from './click-outside.directive';

@NgModule({
  declarations: [ClickOutSideDirective],
  exports: [ClickOutSideDirective],
})
export class ClickOutsideModule {
}
