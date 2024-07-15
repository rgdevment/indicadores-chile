import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Economic } from './schemas/economic.schema';
import { EconomicEnum } from './economic.enum';
import { AggregationResult } from '../../interfaces/aggregation-result.interface';
import { EconomicRepositoryInterface } from './interfaces/economic-repository.interface';

@Injectable()
export class EconomicRepository implements EconomicRepositoryInterface {
  constructor(
    @InjectModel(Economic.name)
    private readonly economicModel: Model<Economic>,
  ) {}

  async findCurrentOrLastDayRecord(indicator: EconomicEnum): Promise<Economic> {
    const formattedDate = new Date().toISOString().split('T')[0];
    return this.economicModel
      .findOne({
        indicator,
        date: { $lte: formattedDate },
      })
      .sort({ date: -1 })
      .exec();
  }

  async findFirstRecordOfMonth(indicator: EconomicEnum): Promise<Economic> {
    const now = new Date();
    const date = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1).toISOString().split('T')[0];

    return this.economicModel
      .findOne({
        indicator,
        date,
      })
      .exec();
  }

  async calculateAverageValueOfMonth(indicator: EconomicEnum): Promise<number> {
    const { startOfMonth, endOfMonth } = this.getMonthBounds();

    const results = await this.economicModel.aggregate<AggregationResult>([
      {
        $match: {
          indicator,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$value' },
        },
      },
    ]);

    return this.parseAggregateResult(results);
  }

  async findLastRecordOfMonth(indicator: EconomicEnum): Promise<Economic> {
    const now = new Date();
    const endOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).toISOString().split('T')[0];
    return this.economicModel
      .findOne({
        indicator,
        date: { $lte: endOfMonth },
      })
      .sort({ date: -1 })
      .exec();
  }

  async calculateAccumulatedValueLast12Months(indicator: EconomicEnum): Promise<number> {
    const lastRecord = await this.economicModel.findOne({ indicator }).sort({ date: -1 }).exec();

    if (!lastRecord) {
      return null;
    }

    const lastRecordDate = new Date(lastRecord.date);
    const utcFullYear = lastRecordDate.getUTCFullYear();
    const startOfLastRecordMonth = new Date(utcFullYear, lastRecordDate.getUTCMonth(), 1, 0, 0, 0, 0);
    const lastMonthYear = startOfLastRecordMonth.getUTCFullYear() - 1;
    const twelveMonthsAgo = new Date(lastMonthYear, startOfLastRecordMonth.getUTCMonth(), 1, 0, 0, 0, 0);

    const results = await this.economicModel.aggregate<AggregationResult>([
      {
        $match: {
          indicator,
          date: { $gte: twelveMonthsAgo, $lt: startOfLastRecordMonth },
        },
      },
      {
        $group: {
          _id: null,
          sum: { $sum: '$value' },
        },
      },
    ]);

    return this.parseAggregateResult(results);
  }

  async calculateYearlyAccumulatedValue(indicator: EconomicEnum): Promise<number> {
    const { startOfYear, endOfYear } = this.getYearBounds();

    const results = await this.economicModel.aggregate<AggregationResult>([
      {
        $match: {
          indicator,
          date: { $gte: new Date(startOfYear), $lte: new Date(endOfYear) },
        },
      },
      {
        $group: {
          _id: null,
          sum: { $sum: '$value' },
        },
      },
    ]);

    return this.parseAggregateResult(results);
  }

  private getMonthBounds(): { startOfMonth: Date; endOfMonth: Date } {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    return {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
    };
  }

  private getYearBounds(): { startOfYear: string; endOfYear: string } {
    const currentYear = new Date().getUTCFullYear();
    const startOfYear = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0));
    const endOfYear = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59, 999));
    return {
      startOfYear: startOfYear.toISOString(),
      endOfYear: endOfYear.toISOString(),
    };
  }

  private parseAggregateResult(results: AggregationResult[]): number {
    if (results.length > 0) {
      const result = results[0].average ?? results[0].sum;
      if (result !== undefined) {
        const decimalString = result.toString();
        return parseFloat(parseFloat(decimalString).toFixed(2));
      }
    }
    return null;
  }
}
