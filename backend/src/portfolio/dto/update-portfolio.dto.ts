export class UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  tel?: string;
  linkedin?: string;
  github?: string;
}

export class UpdatePortfolioDto {
  owner?: UpdateProfileDto;
  chapters?: any[];
}
