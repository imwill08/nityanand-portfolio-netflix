import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './portfolio.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Portfolio.name, schema: PortfolioSchema }]),
    AuthModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioRepository],
  exports: [PortfolioService, PortfolioRepository],
})
export class PortfolioModule { }