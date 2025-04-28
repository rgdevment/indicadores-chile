import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  async ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
