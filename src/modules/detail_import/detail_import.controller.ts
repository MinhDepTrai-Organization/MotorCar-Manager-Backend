import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DetailImportService } from './detail_import.service';
import { CreateImportDto } from '../import/dto/create-import.dto';
import { UpdateDetailImportDto } from './dto/update-detail_import.dto';
import { Tag } from 'src/constants/api-tag.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/decorators/current-user';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { DetailImport } from './entities/detail_import.entity';
import { UpdateRemainingQuantityDto } from './dto/update-remaining-quantity.dto';
import { UpdateImportDto } from '../import/dto/update-import.dto';

@ApiTags(Tag.DETAIL_IMPORT)
@ApiBearerAuth()
@Controller('detail-import')
@ApiExtraModels(DetailImport)
export class DetailImportController {
  constructor(private readonly detailImportService: DetailImportService) {}

  @Post()
  @ApiOperation({
    summary:
      'Chi tiết nhập kho biến thể tồn tại đã oki, data lấy file txt trong nhóm tele',
  })
  create(@Body() createDetailImportDto: CreateImportDto, @User() user) {
    return this.detailImportService.create(createDetailImportDto, user);
  }
  @ApiOperation({
    summary: 'Hiển thị danh sách nhập kho',
  })
  @Get()
  @ResponseMessage('Lấy danh sách chi tiết nhập kho thành công')
  findAll() {
    return this.detailImportService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Lấy chi tiết nhập kho thành công')
  @ApiOperation({
    summary: 'Tìm kiếm theo id  Chi tiết nhập kho đã oki',
  })
  findOne(@Param('id') id: string) {
    return this.detailImportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật Chi tiết nhập kho',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID của nhập kho cần cập nhật',
    example: 'fea4fa67-a7e5-49e1-aea1-a750129365a1',
  })
  @ResponseMessage('Cập nhật nhập kho thành công')
  @ApiBody({
    type: UpdateImportDto,
    description: 'Thông tin nhập kho cần cập nhật',
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateImport: UpdateImportDto,
    @User() user,
  ) {
    return this.detailImportService.update(id, updateImport, user);
  }
  @ApiOperation({
    summary: 'chưa làm ',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID của chi tiết nhập kho cần xóa',
    example: 'fea4fa67-a7e5-49e1-aea1-a750129365a1',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailImportService.remove(+id);
  }

  @Post('update-remaining-quantity')
  @ApiOperation({
    summary: 'Cập nhật số lượng còn lại của một mảng các chi tiết nhập kho',
  })
  @ApiBody({
    type: UpdateRemainingQuantityDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật số lượng còn lại thành công',
    schema: SuccessResponseBodySchema(
      200,
      'Update remaining quantity success',
      {
        id: 'fea4fa67-a7e5-49e1-aea1-a750129365a1',
        quantity_remaining: 100,
      },
      true,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'ID không hợp lệ',
    schema: ErrorResponseBodySchema(400, 'Invalid ID', '/detail-import/:id'),
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chi tiết nhập kho',
    schema: ErrorResponseBodySchema(
      404,
      'Detail import not found',
      '/detail-import/:id',
    ),
  })
  async updateRemainingQuantity(@Body() body: UpdateRemainingQuantityDto) {
    return this.detailImportService.updateRemainingQuantity(body.ids);
  }

  @Patch(':id/update-sold-quantity')
  @ApiOperation({
    summary: 'Cập nhật số lượng đã bán của chi tiết nhập kho',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'detail export id cần cập nhật số lượng đã bán',
    example: 'fea4fa67-a7e5-49e1-aea1-a750129365a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật số lượng đã bán thành công',
    schema: SuccessResponseBodySchema(
      200,
      'Update sold quantity success',
      {
        id: 'fea4fa67-a7e5-49e1-aea1-a750129365a1',
        quantity_sold: 100,
      },
      true,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi ID không hợp lệ',
    schema: ErrorResponseBodySchema(400, 'Invalid ID', '/detail-import/:id'),
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chi tiết nhập kho',
    schema: ErrorResponseBodySchema(
      404,
      'Detail import not found',
      '/detail-import/:id',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Trạng thái đơn hàng không hợp lệ',
    schema: ErrorResponseBodySchema(
      409,
      'Only SHIPPING or FAILED_DELIVERY order can update quantity sold',
      '/detail-import/:id',
    ),
  })
  async updateSoldQuantity(@Param('id', ParseUUIDPipe) id: string) {
    return this.detailImportService.updateQuantitySold(id);
  }
}
