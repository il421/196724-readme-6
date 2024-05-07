import { Controller, Get } from '@nestjs/common';

import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
