import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { UpdatePortfolioDto, UpdateProfileDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Public endpoint for visitors & frontend
  @Get()
  async getPortfolio() {
    return this.portfolioService.getPortfolio();
  }

  // Admin protected endpoints
  @UseGuards(JwtAuthGuard)
  @Put()
  async updatePortfolio(@Body() dto: UpdatePortfolioDto) {
    return this.portfolioService.updatePortfolio(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Body() ownerDto: UpdateProfileDto) {
    return this.portfolioService.updateProfile(ownerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('chapters')
  async updateChapters(@Body() body: { chapters: any[] }) {
    return this.portfolioService.updateChapters(body.chapters || []);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  async resetToDefaults() {
    return this.portfolioService.resetToDefaults();
  }
}
