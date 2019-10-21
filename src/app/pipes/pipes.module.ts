import { NgModule } from '@angular/core';

// PIPE
import { DatePipe } from './countTime.pipe';
import { FileSizePipe } from './file-size.pipe';
import { HighlightSearch } from './highlight.pipe';
import { KeysPipe } from './keys.pipe';
import { SearchPipe } from './search.pipe';
import { SplitPipe } from './split.pipe';
import { TruncatePipe } from './truncate.pipe';


@NgModule({
  declarations: [
    DatePipe,
    FileSizePipe,
    HighlightSearch,
    KeysPipe,
    SearchPipe,
    SplitPipe,
    TruncatePipe
  ],
  imports: [
  ],
  exports: [
    DatePipe,
    FileSizePipe,
    HighlightSearch,
    KeysPipe,
    SearchPipe,
    SplitPipe,
    TruncatePipe
  ]
})
export class PipesModule { }
