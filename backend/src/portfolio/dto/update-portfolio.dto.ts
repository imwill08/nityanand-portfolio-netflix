import { IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  tel?: string;

  @IsOptional()
  linkedin?: string;

  @IsOptional()
  github?: string;

  @IsOptional()
  avatar?: string;
}

export class UpdatePortfolioDto {
  @IsOptional()
  owner?: UpdateProfileDto;

  @IsOptional()
  chapters?: any[];
}
