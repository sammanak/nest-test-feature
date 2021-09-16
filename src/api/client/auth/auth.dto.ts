import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CustomerAuthBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accessToken: string;
}

export class AuthBody {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phoneOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class RegenerateRefreshTokenBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
