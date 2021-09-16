import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { E } from '@common';

export class RegisterBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(E.GenderEnum)
  @ApiProperty({ type: 'enum', enum: E.GenderEnum })
  gender: E.GenderEnum;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  imageUrl: string = '';
}

export class UpdateInfoBody {
  @IsOptional()
  @ApiPropertyOptional()
  firstName: string;

  @IsOptional()
  @ApiPropertyOptional()
  lastName: string;

  @IsOptional()
  @IsEnum(E.GenderEnum)
  @ApiPropertyOptional({ type: 'enum', enum: E.GenderEnum })
  gender: E.GenderEnum;

  @IsOptional()
  @ApiPropertyOptional()
  imageUrl: string;
}

export class VerifyAccountBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp: string;
}

export class VerifyForgotPasswordBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}
