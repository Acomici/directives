import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselDirective } from './carousel.directive';


@NgModule({
  declarations: [CarouselDirective],
  imports: [
    CommonModule,
  ],
  exports: [CarouselDirective],
})
export class CarouselModule {
}
