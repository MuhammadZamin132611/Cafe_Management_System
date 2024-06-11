import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionDirective } from './accordions/accordion.directive';
import { AccordionLinkDirective } from './accordions/accordion-link.directive';
import { AccordionAnchorDirective } from './accordions/accordion-anchor.directive';
import { MenuItems } from './menu-items';
import { MaterialModule } from './material-module';



@NgModule({
  declarations: [
    AccordionDirective,
    AccordionLinkDirective,
    AccordionAnchorDirective
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    MaterialModule
  ],
  providers: [MenuItems]
})
export class SharedModule { }
