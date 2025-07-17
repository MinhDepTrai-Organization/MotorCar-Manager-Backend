import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public-route';
import { Tag } from './constants/api-tag.enum';
import { Roles } from './decorators/role-route';
import { RoleEnum } from './constants/role.enum';

export interface PermissionModuleResponseType {
  [name: string]: {
    [function_name: string]: {
      method: string;
      path: string;
      module: string;
    };
  };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
