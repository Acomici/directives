import { NgModule } from '@angular/core';
import { OverCountedDirective } from './over-counted.directive';


@NgModule({
  declarations: [OverCountedDirective],
  exports: [OverCountedDirective],
})
export class OverCountedModule {
}
