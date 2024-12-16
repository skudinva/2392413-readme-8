import { IsOptional, IsString } from 'class-validator';

export class PostExtraPropertyDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  describe?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  announce?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
