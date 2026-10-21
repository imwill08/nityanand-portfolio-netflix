import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { initialPortfolioData } from '../seed/initial-data';
import { UpdatePortfolioDto, UpdateProfileDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService implements OnModuleInit {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<Portfolio>,
  ) {}

  async onModuleInit() {
    await this.seedIfNeeded();
  }

  async seedIfNeeded(): Promise<PortfolioDocument> {
    try {
      const existing = await this.portfolioModel.findOne().exec();
      if (!existing) {
        this.logger.log('No portfolio found in MongoDB. Seeding initial data...');
        const created = new this.portfolioModel(initialPortfolioData);
        return await created.save();
      }
      return existing;
    } catch (err) {
      this.logger.error('Failed to seed portfolio database:', err);
      throw err;
    }
  }

  async getPortfolio(): Promise<PortfolioDocument> {
    let doc = await this.portfolioModel.findOne().exec();
    if (!doc) {
      doc = await this.seedIfNeeded();
    }
    return doc;
  }

  async updatePortfolio(dto: UpdatePortfolioDto): Promise<PortfolioDocument> {
    let doc = await this.getPortfolio();
    if (dto.owner) {
      doc.owner = { ...doc.owner, ...dto.owner };
    }
    if (Array.isArray(dto.chapters)) {
      doc.chapters = dto.chapters;
    }
    doc.markModified('owner');
    doc.markModified('chapters');
    return await doc.save();
  }

  async updateProfile(ownerDto: UpdateProfileDto): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    doc.owner = { ...doc.owner, ...ownerDto };
    doc.markModified('owner');
    return await doc.save();
  }

  async updateChapters(chapters: any[]): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    doc.chapters = chapters;
    doc.markModified('chapters');
    return await doc.save();
  }

  async resetToDefaults(): Promise<PortfolioDocument> {
    let doc = await this.getPortfolio();
    doc.owner = initialPortfolioData.owner as any;
    doc.chapters = initialPortfolioData.chapters as any;
    doc.markModified('owner');
    doc.markModified('chapters');
    return await doc.save();
  }
}
