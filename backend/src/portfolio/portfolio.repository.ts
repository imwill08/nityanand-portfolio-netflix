import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  /**
   * Find a single portfolio document matching the filter (defaults to first found)
   */
  async findOne(filter: FilterQuery<PortfolioDocument> = {}): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findOne(filter).exec();
  }

  /**
   * Find a portfolio document by its MongoDB _id
   */
  async findById(id: string | any): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findById(id).exec();
  }

  /**
   * Find all portfolio documents
   */
  async findAll(filter: FilterQuery<PortfolioDocument> = {}): Promise<PortfolioDocument[]> {
    return this.portfolioModel.find(filter).exec();
  }

  /**
   * Create and save a new portfolio document
   */
  async create(data: Partial<Portfolio>): Promise<PortfolioDocument> {
    const created = new this.portfolioModel(data);
    return created.save();
  }

  /**
   * Update a portfolio document by ID
   */
  async findByIdAndUpdate(
    id: string | any,
    update: UpdateQuery<PortfolioDocument>,
    options: QueryOptions = { new: true, runValidators: false },
  ): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findByIdAndUpdate(id, update, options).exec();
  }

  /**
   * Update a portfolio document matching a filter
   */
  async updateOne(
    filter: FilterQuery<PortfolioDocument>,
    update: UpdateQuery<PortfolioDocument>,
    options: QueryOptions = { new: true, runValidators: false },
  ): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findOneAndUpdate(filter, update, options).exec();
  }

  /**
   * Delete a portfolio document by ID
   */
  async delete(id: string | any): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findByIdAndDelete(id).exec();
  }
}

