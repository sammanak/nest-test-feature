import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { E } from '@common';

export class MediaBody {
  @IsNotEmpty()
  @IsEnum(E.ExtensionEnum)
  @ApiProperty({ type: 'enum', enum: E.ExtensionEnum })
  ext: E.ExtensionEnum;

  @IsNotEmpty()
  @IsEnum(E.MediaDirectoryEnum)
  @ApiProperty({ type: 'enum', enum: E.MediaDirectoryEnum })
  type: E.MediaDirectoryEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  filename: string;
}

export class PresignUrlBody {
  @IsArray()
  @ApiProperty({ type: [MediaBody] })
  @ArrayMinSize(1)
  media: MediaBody[];
}
