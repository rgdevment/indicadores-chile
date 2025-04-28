import { Controller, Get } from '@nestjs/common';

@Controller()
export class healthController {
  @Get('/health')
  async ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
