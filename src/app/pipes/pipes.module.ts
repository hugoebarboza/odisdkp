import { NgModule } from '@angular/core';

//PIPE
import { DatePipe } from './countTime.pipe';
import { FileSizePipe } from './file-size.pipe';
import { HighlightSearch } from './highlight.pipe';
import { KeysPipe } from './keys.pipe';
import { SearchPipe } from './search.pipe';
import { SplitPipe } from './split.pipe';


@NgModule({
  declarations: [
    DatePipe,
    FileSizePipe,
    HighlightSearch,
    KeysPipe, 
    SearchPipe,
    SplitPipe
  ],
  imports: [
    
  ],
  exports: [
    DatePipe,
    FileSizePipe,
    HighlightSearch,
    KeysPipe, 
    SearchPipe,
    SplitPipe
  ]  
})
export class PipesModule { }
