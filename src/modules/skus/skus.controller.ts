import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { SkusService } from './skus.service';
import { CreateSkusDto } from './dto/create-skus.dto';
import { UpdateSkusDto } from './dto/update-skus.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import QuerySkusDto from './dto/query-skus.dto';
import GetSkusByOptionValuesIdsDto from './dto/getSkusByOptionValuesIds.dto';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';
import { User } from 'src/decorators/current-user';

@ApiTags(Tag.SKU)
@Controller('skus')
@ApiBearerAuth()
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Public()
  @ApiOperation({
    summary: 'Lấy ra danh sách biến thể ',
  })
  @Get()
  @ResponseMessage('Lấy ra danh sách biến thể thành công')
  findAll(@Query() query: QuerySkusDto) {
    return this.skusService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Tìm kiếm SKU biến thể thành công')
  @ApiOperation({
    summary: 'Tìm kiếm theo id của sku ',
  })
  @ApiParam({
    name: 'id',
    example: '387b1738-5734-427a-a217-82395122fc5f',
    description: 'Tìm kiếm SKU theo id ',
  })
  findOne(@Param('id') id: string) {
    return this.skusService.findOne(id);
  }

  @ApiOperation({
    summary: 'Cập nhật SKU biến thể : ma_sku và barcode là duy nhất',
  })
  @Public()
  @Patch(':id')
  @ApiOperation({
    description: 'Cập nhật SKU biến thể : ma_sku và barcode là duy nhất',
  })
  @ApiParam({
    name: 'id',
    example: '387b1738-5734-427a-a217-82395122fc5f',
    description: 'Cạp nhật SKU theo id ',
  })
  @ApiBody({
    description: 'Dữ liệu cập nhật SKU',
    schema: {
      type: 'object',
      properties: {
        masku: { type: 'string', example: 'SKU12345' },
        barcode: { type: 'string', example: 'BARCODE56789' },
        name: { type: 'string', example: 'Sản phẩm cập nhật' },
        pricesold: { type: 'number', example: 200000 },
        image: { type: 'string', example: 'link_anh_moi.jpg' },
        status: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật SKU thành công' })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc trùng mã',
  })
  @ResponseMessage('Cập nhật SKU biến thể thành công')
  @ApiResponse({ status: 404, description: 'Không tìm thấy SKU' })
  update(@Param('id') id: string, @Body() updateSkusDto: UpdateSkusDto) {
    return this.skusService.update(id, updateSkusDto);
  }

  @ApiOperation({
    summary: 'Chưa làm : Xóa sku theo id ',
  })
  @Public()
  @ResponseMessage('Xóa SKU biến thể thành công')
  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: '387b1738-5734-427a-a217-82395122fc5f',
    description: 'Xóa SKU theo id ',
  })
  @ApiOperation({
    description: 'Xóa SKU theo id',
  })
  async remove(@Param('id') id: string) {
    return this.skusService.remove(id);
  }

  @Get(':id/detail-import')
  @Public()
  @ApiOperation({
    summary: 'Lấy ra danh sách chi tiết nhập kho theo id sku',
  })
  async findDetailImportBySkuId(@Param('id', ParseUUIDPipe) id: string) {
    return this.skusService.findDetailImportBySkuId(id);
  }

  @Post('detail-imports-by-ids')
  @Public()
  @ApiBody({
    description: 'Danh sách id sku',
    type: String,
    isArray: true,
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2', 'id3'],
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Lấy ra danh sách chi tiết nhập kho theo mảng id sku',
  })
  async findDetailImportBySkuIds(@Body('ids') ids: string[]) {
    return this.skusService.findDetailImportBySkuIds(ids);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo mới SKU biến thể',
  })
  @ApiBody({
    type: CreateSkusDto,
    description: 'Thông tin SKU mới',
    required: true,
  })
  async createSkus(@Body() createSkusDto: CreateSkusDto) {
    return this.skusService.create(createSkusDto);
  }

  @Post('GetSkusByOptionValueIdsAlreadyLogin')
  @ApiOperation({
    summary: 'Lấy ra SKU theo mảng id của option value với user đã đăng nhập',
  })
  @ApiBody({
    type: GetSkusByOptionValuesIdsDto,
    required: true,
  })
  async getSkusByOptionValueAlreadyLoginIds(
    @Body() body: GetSkusByOptionValuesIdsDto,
    @User() user: UserValidationType,
  ) {
    return await this.skusService.getSkusByOptionValueAlreadyLoginIds(
      body,
      user,
    );
  }

  @Post('GetSkusByOptionValueIdsNoneLogin')
  @ApiOperation({
    summary: 'Lấy ra SKU theo mảng id của option value với user chưa đăng nhập',
  })
  @ApiBody({
    type: GetSkusByOptionValuesIdsDto,
    required: true,
  })
  @Public()
  async getSkusByOptionValueNoneLoginIds(
    @Body() body: GetSkusByOptionValuesIdsDto,
  ) {
    return await this.skusService.getSkusByOptionValueNoneLoginIds(body);
  }
}
