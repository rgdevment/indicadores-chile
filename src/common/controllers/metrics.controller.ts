import { Controller, Get, Inject } from '@nestjs/common';
import { Registry } from 'prom-client';

@Controller()
export class MetricsController {
  constructor(@Inject('PrometheusRegistry') private readonly registry: Registry) {}

  @Get('/metrics')
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
