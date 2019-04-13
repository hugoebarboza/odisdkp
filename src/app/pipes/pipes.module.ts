import { NgModule } from '@angular/core';

//PIPE
import { FileSizePipe } from './file-size.pipe';
import { HighlightSearch } from './highlight.pipe';
import { KeysPipe } from './keys.pipe';
import { SearchPipe } from './search.pipe';
import { SplitPipe } from './split.pipe';


@NgModule({
  declarations: [
    FileSizePipe,
    HighlightSearch,
    KeysPipe, 
    SearchPipe,
    SplitPipe
  ],
  imports: [
    
  ],
  exports: [
    FileSizePipe,
    HighlightSearch,
    KeysPipe, 
    SearchPipe,
    SplitPipe
  ]  
})
export class PipesModule { }
