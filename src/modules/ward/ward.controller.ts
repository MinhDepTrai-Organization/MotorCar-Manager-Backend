import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { WardService } from './ward.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { OptionalValidationPipe } from 'src/pipe/optional-validation.pipe';
@Controller('ward')
@ApiTags(Tag.WARD)
@Public()
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all ward or search by name, districtId',
    description: `Get all ward filters by  \n
          districtId: id of the district(optional) \n
          page: page number(optional, default: 0) \n
          size: Number of records per page(optional, default: 1000) \n
          search: search by name (optional) \n
    `,
  })
  @ApiQuery({
    name: 'districtId',
    description: 'Id of district',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'page',
    description: 'page number',
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
    description: 'Search by name of ward',
    required: false,
    type: 'string',
    example: 'Hòa cường nam',
  })
  @UsePipes(OptionalValidationPipe)
  async getAllWard(
    @Query('districtId') districtId?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('query') query?: string,
  ) {
    return await this.wardService.getAllDistricts(
      districtId,
      page,
      size,
      query,
    );
  }
}
