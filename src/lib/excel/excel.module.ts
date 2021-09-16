import { Global, Module } from '@nestjs/common';

import { ExcelDocumentService } from './excel.service';

@Global()
@Module({
  imports: [],
  providers: [ExcelDocumentService],
  exports: [ExcelDocumentService]
})
export class ExcelDocumentModule {}
