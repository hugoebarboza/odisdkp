import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTES
import { FootermainComponent } from './components/footermain/footermain.component';


@NgModule({
  declarations: [FootermainComponent],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [],
  bootstrap: [FootermainComponent]
})
export class FooterModule { }
