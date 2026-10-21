import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Owner {
  @Prop({ default: 'Nityanand' })
  name: string;

  @Prop({ default: 'royanand729@gmail.com' })
  email: string;

  @Prop({ default: '+91 98375 06732' })
  phone: string;

  @Prop({ default: '+919837506732' })
  tel: string;

  @Prop({ default: 'https://www.linkedin.com/' })
  linkedin: string;

  @Prop({ default: 'https://github.com/' })
  github: string;
}

@Schema({ _id: false })
export class PortfolioCard {
  @Prop({ required: true })
  t: string;

  @Prop()
  d?: string;

  @Prop()
  r?: string;

  @Prop()
  o?: string;

  @Prop({ type: [String], default: [] })
  sc?: string[];

  @Prop()
  n?: number;

  @Prop()
  icon?: string;

  @Prop()
  go?: string;

  @Prop()
  dead?: boolean;

  @Prop()
  at?: number;
}

@Schema({ _id: false })
export class PortfolioRow {
  @Prop({ required: true })
  h: string;

  @Prop({ type: [Object], default: [] })
  cards: PortfolioCard[];
}

@Schema({ _id: false })
export class PortfolioChapter {
  @Prop({ required: true })
  k: number;

  @Prop({ default: 'film' })
  icon: string;

  @Prop({ type: [String], default: ['#E50914', '#5a050b'] })
  c: [string, string];

  @Prop({ default: 'Chapter' })
  label: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 98 })
  match: number;

  @Prop({ default: '2025' })
  year: string;

  @Prop({ default: 'Developer' })
  role: string;

  @Prop({ default: '' })
  where: string;

  @Prop({ default: '' })
  summary: string;

  @Prop({ type: [String], default: [] })
  points?: string[];

  @Prop({ type: [String], default: [] })
  scenes?: string[];

  @Prop({ type: [[String]], default: [['Play story', 'play'], ['Next chapter', 'next']] })
  buttons?: [string, 'play' | 'next' | 'mail'][];

  @Prop({ type: [Object], default: [] })
  rows?: PortfolioRow[];
}

import { HydratedDocument } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ type: Object, required: true })
  owner: Owner;

  @Prop({ type: [Object], default: [] })
  chapters: PortfolioChapter[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
