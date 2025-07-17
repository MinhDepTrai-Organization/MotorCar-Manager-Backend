import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
@ApiTags(Tag.WAREHOUSE)
@Controller('warehouse')
@Public()
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Kho không tồn tại' })
  @ApiOperation({ summary: 'Lấy thông tin kho theo ID' }) // Mô tả chức năng API
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '85c388c6-2dae-4081-9b48-6cf083034aa8',
    description: 'ID của kho',
  })
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhât theo id ' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '85c388c6-2dae-4081-9b48-6cf083034aa8',
    description: 'ID của kho',
  })
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }
  @ApiOperation({ summary: 'Xóa theo id ' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '85c388c6-2dae-4081-9b48-6cf083034aa8',
    description: 'ID của kho',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
