import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IndicatorsRepositoryInterface } from './indicators.repository.interface';
import { AggregationResult } from '../interfaces/aggregation-result.interface';
import { IndicatorsType } from '../types/indicators.type';

@Injectable()
export abstract class IndicatorsRepository<T extends Document> implements IndicatorsRepositoryInterface<T> {
  protected constructor(protected readonly model: Model<T>) {}

  async findCurrentOrLastDayRecord(indicator: IndicatorsType): Promise<T> {
    const formattedDate = new Date().toISOString().split('T')[0];
    return this.model
      .findOne({
        indicator,
        date: { $lte: formattedDate },
      })
      .sort({ date: -1 })
      .exec();
  }

  async findFirstRecordOfMonth(indicator: IndicatorsType, now: Date = new Date()): Promise<T> {
    let day = 1;
    let record: T | null = null;

    while (!record && day <= 31) {
      const date = new Date(now.getUTCFullYear(), now.getUTCMonth(), day).toISOString().split('T')[0];
      record = await this.model
        .findOne({
          indicator,
          date,
        })
        .exec();
      day++;
    }

    return record;
  }

  async calculateAverageValueOfMonth(indicator: IndicatorsType, date: Date = new Date()): Promise<number> {
    const { startOfMonth, endOfMonth } = this.getMonthBounds(date);

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

  async findLastRecordOfMonth(indicator: IndicatorsType, now: Date = new Date()): Promise<T> {
    const endOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).toISOString().split('T')[0];
    return this.model
      .findOne({
        indicator,
        date: { $lte: endOfMonth },
      })
      .sort({ date: -1 })
      .exec();
  }

  async calculateAccumulatedValueLast12Months(indicator: IndicatorsType): Promise<number> {
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

  async calculateYearlyAccumulatedValue(indicator: IndicatorsType): Promise<number> {
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

  protected getMonthBounds(now: Date): { startOfMonth: Date; endOfMonth: Date } {
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
