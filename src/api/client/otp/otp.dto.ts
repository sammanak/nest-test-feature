import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { E } from '@common';

export class SendOtpBody {
  @IsNotEmpty()
  @IsEnum(E.OtpVerifyTypeEnum)
  @ApiProperty({ type: 'enum', enum: E.OtpVerifyTypeEnum, default: E.OtpVerifyTypeEnum.accountVerification })
  type: E.OtpVerifyTypeEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneOrEmail: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  hashCode: string;
}
