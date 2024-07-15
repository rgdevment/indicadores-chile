import { Model, Document } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryInterface } from '../interfaces/base-repository.interface';
import { AggregationResult } from '../interfaces/aggregation-result.interface';
import { IndicatorsEnum } from './indicators.enum';

@Injectable()
export abstract class BaseRepository<T extends Document> implements BaseRepositoryInterface<T> {
  protected constructor(protected readonly model: Model<T>) {}

  async findCurrentOrLastDayRecord(indicator: IndicatorsEnum): Promise<T> {
    const formattedDate = new Date().toISOString().split('T')[0];
    return this.model
      .findOne({
        indicator,
        date: { $lte: formattedDate },
      })
      .sort({ date: -1 })
      .exec();
  }

  async findFirstRecordOfMonth(indicator: IndicatorsEnum): Promise<T> {
    const now = new Date();
    const date = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1).toISOString().split('T')[0];

    return this.model
      .findOne({
        indicator,
        date,
      })
      .exec();
  }

  async calculateAverageValueOfMonth(indicator: IndicatorsEnum): Promise<number> {
    const { startOfMonth, endOfMonth } = this.getMonthBounds();

    const results = await this.model.aggregate<AggregationResult>([
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

  async findLastRecordOfMonth(indicator: IndicatorsEnum): Promise<T> {
    const now = new Date();
    const endOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).toISOString().split('T')[0];
    return this.model
      .findOne({
        indicator,
        date: { $lte: endOfMonth },
      })
      .sort({ date: -1 })
      .exec();
  }

  async calculateAccumulatedValueLast12Months(indicator: IndicatorsEnum): Promise<number> {
    const lastRecord = await this.model.findOne({ indicator }).sort({ date: -1 }).exec();

    if (!lastRecord) {
      return null;
    }

    const lastRecordWithDate = lastRecord as unknown as { date: Date };
    const lastRecordDate = new Date(lastRecordWithDate.date);
    const utcFullYear = lastRecordDate.getUTCFullYear();
    const startOfLastRecordMonth = new Date(utcFullYear, lastRecordDate.getUTCMonth(), 1, 0, 0, 0, 0);
    const lastMonthYear = startOfLastRecordMonth.getUTCFullYear() - 1;
    const twelveMonthsAgo = new Date(lastMonthYear, startOfLastRecordMonth.getUTCMonth(), 1, 0, 0, 0, 0);

    const results = await this.model.aggregate<AggregationResult>([
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

  async calculateYearlyAccumulatedValue(indicator: IndicatorsEnum): Promise<number> {
    const { startOfYear, endOfYear } = this.getYearBounds();

    const results = await this.model.aggregate<AggregationResult>([
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

  protected getMonthBounds(): { startOfMonth: Date; endOfMonth: Date } {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    return {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
    };
  }

  protected getYearBounds(): { startOfYear: string; endOfYear: string } {
    const currentYear = new Date().getUTCFullYear();
    const startOfYear = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0));
    const endOfYear = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59, 999));
    return {
      startOfYear: startOfYear.toISOString(),
      endOfYear: endOfYear.toISOString(),
    };
  }

  protected parseAggregateResult(results: AggregationResult[]): number {
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
