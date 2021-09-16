import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/auth.guard';
import { PresignUrlBody } from './upload.dto';
import { UploadService } from './upload.service';

@ApiTags('Uploads')
@Controller('/client/upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post('/presign')
  @UseGuards(ClientAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'presign url' })
  presign(@Body() body: PresignUrlBody, @Req() request) {
    const { authUser } = request;
    const accountId = authUser ? authUser.id : null;
    if (!accountId) throw new BadRequestException('Account not exist');
    return this.service.presignUrl(body, accountId);
  }
}
