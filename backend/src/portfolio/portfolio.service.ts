import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { initialPortfolioData } from '../seed/initial-data';
import { UpdatePortfolioDto, UpdateProfileDto } from './dto/update-portfolio.dto';

function syncOwnerToChapters(owner: any, chapters: any[]) {
  if (!owner || !Array.isArray(chapters)) return chapters;
  return chapters.map((chap) => {
    let scenes = chap.scenes;
    if (Array.isArray(scenes)) {
      scenes = scenes.map((s: string) => {
        if (typeof s === 'string' && s.toLowerCase().startsWith('contact:')) {
          return `Contact: ${owner.email || ''}, ${owner.phone || ''}.`;
        }
        return s;
      });
    }

    let rows = chap.rows;
    if (Array.isArray(rows)) {
      rows = rows.map((r: any) => {
        if (r && (r.h === 'Get in touch' || r.h === 'Contact')) {
          const cards = (r.cards || []).map((card: any) => {
            if (!card) return card;
            if (card.t === 'Email' || card.icon === 'mail') {
              return { ...card, d: owner.email, go: `mailto:${owner.email}` };
            }
            if (card.t === 'Phone' || card.icon === 'phone') {
              return { ...card, d: owner.phone, go: `tel:${owner.tel || owner.phone}` };
            }
            if (card.t === 'LinkedIn' || card.icon === 'link') {
              return { ...card, go: owner.linkedin };
            }
            if (card.t === 'GitHub' || card.icon === 'file') {
              return { ...card, go: owner.github };
            }
            return card;
          });
          return { ...r, cards };
        }
        return r;
      });
    }

    return { ...chap, scenes, rows };
  });
}

function cleanCorruptedSymbols(chapters: any[]) {
  if (!Array.isArray(chapters)) return chapters;
  return chapters.map((c) => {
    if (!c) return c;
    const chap = typeof c.toObject === 'function' ? c.toObject() : { ...c };
    if (typeof chap.where === 'string') {
      chap.where = chap.where
        .replace(/[\uFFFD\uFEFF]/g, ' · ')
        .replace(/\s+\?\s+/g, ' · ')
        .replace(/(?:\s*·\s*)+/g, ' · ');
    }
    if (Array.isArray(chap.buttons)) {
      chap.buttons = chap.buttons.map(([label, act]: [any, any]) => {
        const cleanLabel =
          typeof label === 'string'
            ? label.replace(/^[\uFFFD▶►▸▷ⓘℹ️✉️?\s·-]+/u, '').replace(/[\uFFFD]/g, '').trim()
            : label;
        return [cleanLabel || (act === 'play' ? 'Play story' : act === 'next' ? 'Next chapter' : 'Email me'), act];
      });
    }
    return chap;
  });
}

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

  async getPortfolio(): Promise<any> {
    let doc = await this.portfolioModel.findOne().exec();
    if (!doc) {
      doc = await this.seedIfNeeded();
    }
    if (doc && Array.isArray(doc.chapters)) {
      const cleanedChapters = cleanCorruptedSymbols(doc.chapters);
      const str = JSON.stringify(doc.chapters);
      if (str.includes('? Appz') || str.includes('▶') || str.includes('ⓘ') || str.includes('\uFFFD')) {
        this.portfolioModel.findByIdAndUpdate(doc._id, { $set: { chapters: cleanedChapters } }).exec().catch(() => {});
      }
      return typeof doc.toObject === 'function' ? { ...doc.toObject(), chapters: cleanedChapters } : doc;
    }
    return doc;
  }

  async updatePortfolio(dto: UpdatePortfolioDto): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    const updateQuery: any = {};

    let ownerObj = doc.owner;
    if (dto.owner) {
      ownerObj = { ...doc.owner, ...dto.owner };
      updateQuery.owner = ownerObj;
    }

    let chaptersArr = Array.isArray(dto.chapters) ? dto.chapters : doc.chapters;
    if (dto.owner) {
      chaptersArr = syncOwnerToChapters(ownerObj, chaptersArr);
    }
    updateQuery.chapters = chaptersArr;

    const updated = await this.portfolioModel
      .findByIdAndUpdate(doc._id, { $set: updateQuery }, { new: true, runValidators: false })
      .exec();

    return updated || doc;
  }

  async updateProfile(ownerDto: UpdateProfileDto): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    const ownerObj = { ...doc.owner, ...ownerDto };
    const chaptersArr = syncOwnerToChapters(ownerObj, doc.chapters);

    const updated = await this.portfolioModel
      .findByIdAndUpdate(
        doc._id,
        { $set: { owner: ownerObj, chapters: chaptersArr } },
        { new: true, runValidators: false },
      )
      .exec();

    return updated || doc;
  }

  async updateChapters(chapters: any[]): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    const updated = await this.portfolioModel
      .findByIdAndUpdate(doc._id, { $set: { chapters } }, { new: true, runValidators: false })
      .exec();

    return updated || doc;
  }

  async resetToDefaults(): Promise<PortfolioDocument> {
    const doc = await this.getPortfolio();
    const updated = await this.portfolioModel
      .findByIdAndUpdate(
        doc._id,
        {
          $set: {
            owner: initialPortfolioData.owner,
            chapters: initialPortfolioData.chapters,
          },
        },
        { new: true, runValidators: false },
      )
      .exec();

    return updated || doc;
  }
}
