import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExportService } from './export.service';
import {
  CreateExportDto,
  CreateExportOrderDto,
  CreateMultipleExportDto,
} from './dto/create-export.dto';
import { UpdateExportDto } from './dto/update-export.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { User } from 'src/decorators/current-user';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import QueryExportDto from './dto/query-export-dto';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';

@ApiTags(Tag.EXPORT)
@Controller('export')
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo phiếu xuất kho đã oki : Luân chuyển kho A -> kho B ',
  })
  @ApiResponse({
    status: 201,
    description: 'Phiếu xuất kho được tạo thành công',
  })
  @ResponseMessage('Tạo phiếu xuất luân chuyển kho thành công  ')
  @ApiResponse({ status: 400, description: 'Lỗi đầu vào không hợp lệ' })
  create(@Body() createExportDto: CreateExportDto, @User() user) {
    return this.exportService.create(createExportDto, user);
  }

  @ApiOperation({
    summary: 'Lấy danh sách export và export_detail chi tiết',
  })
  @Get()
  @ResponseMessage('Lấy danh sách chi tiết phiếu xuất thành công  ')
  findAll(@Query() query: QueryExportDto) {
    return this.exportService.findAll(query);
  }
  @ApiOperation({
    summary: 'Lấy danh sách export và export_detail chi tiết theo id đã oki',
  })
  @ApiParam({
    name: 'id',
    example: 'd6c94605-abf7-41c6-b9d1-b0e8e0dc41eb',
  })
  @Get(':id')
  @ResponseMessage('Lấy chi tiết phiếu xuất kho thành công  ')
  findOne(@Param('id') id: string) {
    return this.exportService.findOne(id);
  }

  @ApiOperation({
    summary: 'Xuất đơn cho khách hàng từ order_id',
    description: 'Xuất với đơn hàng có trạng thái đang chờ xác nhận',
  })
  @ApiResponse({
    status: 201,
    description: 'Phiếu xuất kho được tạo thành công',
  })
  @Post('/Order')
  @ResponseMessage('Tạo phiếu xuất kho đơn hàng thành công  ')
  createExportOrder(@User() user, @Body() createExport: CreateExportOrderDto) {
    return this.exportService.createExportOrder(createExport, user);
  }

  @ApiOperation({
    summary: 'Xuất nhiều phiếu xuất kho cùng lúc',
  })
  @ApiResponse({
    status: 201,
    description: 'Phiếu xuất kho được tạo thành công',
  })
  @Post('/Orders')
  @ApiBody({
    type: [CreateMultipleExportDto],
    required: true,
    description: 'Danh sách phiếu xuất kho',
  })
  async createMultipleExport(
    @Body() createExport: CreateMultipleExportDto,
    @User() user: UserValidationType,
  ) {
    return this.exportService.createManyExport(createExport, user);
  }
  @ApiOperation({
    summary: 'Cập nhật phiếu xuất',
  })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    example: 'd6c94605-abf7-41c6-b9d1-b0e8e0dc41eb',
    required: true,
  })
  @ApiBody({
    type: UpdateExportDto,
    required: true,
    description: 'Thông tin phiếu xuất kho',
  })
  UpdateExport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() detail_Export: UpdateExportDto,
    @User() user,
  ) {
    return this.exportService.UpdateExport(id, detail_Export, user);
  }

  @ApiOperation({
    summary: 'Xóa phiếu xuất',
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: 'd6c94605-abf7-41c6-b9d1-b0e8e0dc41eb',
    required: true,
  })
  @ResponseMessage('Xóa phiếu xuất kho thành công  ')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.exportService.remove(id);
  }
}
