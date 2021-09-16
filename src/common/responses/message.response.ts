import { ApiProperty } from '@nestjs/swagger';

export class MessageSuccessResponse {
  @ApiProperty()
  message: string;
}
