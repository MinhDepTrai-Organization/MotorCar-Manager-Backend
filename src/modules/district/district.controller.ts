import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { DistrictService } from './district.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { OptionalValidationPipe } from 'src/pipe/optional-validation.pipe';

@Controller('district')
@ApiTags(Tag.DISTRICT)
@Public()
export class DistrictController {
  constructor(private districtService: DistrictService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all district or search by name, Id of province',
    description: `Get all district by filters \n
        provinceId: id of province \n
        page: current page (optional, default: 0) \n
        size: number of records per page (optional, default: 1000) \n
        query: search by name of district/commune (optional)
    `,
  })
  @ApiQuery({
    name: 'provinceId',
    description: 'Id of province',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'page',
    description: 'Number of records per page',
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
    description: 'Search by name of district/commune',
    required: false,
    type: 'string',
    example: 'Hải Châu',
  })
  @UsePipes(OptionalValidationPipe)
  async getAllDistricts(
    @Query('provinceId') provinceId?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('query') query?: string,
  ) {
    return await this.districtService.getAllDistricts(
      provinceId,
      page,
      size,
      query,
    );
  }
}
