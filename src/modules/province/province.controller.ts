import { Controller, Get, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { Public } from 'src/decorators/public-route';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptionalValidationPipe } from 'src/pipe/optional-validation.pipe';
import { AddressAPI } from 'src/constants/address.enum';

@Public()
@ApiTags('Province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all provinces or search by name, slug',
    description: `Get provinces by filters\n
        page: current page (optional, default: 0) \n
        size: number of records per page (optional, default: 1000) \n
        query: search by name, slug (optional) 
    `,
  })
  @ApiQuery({
    name: 'page',
    description: 'Current page',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'size',
    description: 'Number of records per page',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'query',
    description: 'Search by name, slug',
    required: false,
    type: 'string',
  })
  @UsePipes(OptionalValidationPipe)
  async getAllProvinces(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('query') query?: string,
  ) {
    return await this.provinceService.getAllProvinces(page, size, query);
  }
}
