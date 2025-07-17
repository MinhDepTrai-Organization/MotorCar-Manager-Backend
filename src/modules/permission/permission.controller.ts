import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Tag } from 'src/constants/api-tag.enum';
import { PermissionResponse } from './dto/PermissionResponse.dto';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import QueryPermissionDto from './dto/query-permission.dto';

@ApiBearerAuth()
@ApiTags(Tag.PERMISSON)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới quyền' })
  @ApiResponse({
    status: 201,
    description: 'Tạo quyền thành công',
    type: Permission,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('/createArray')
  @ApiOperation({ summary: 'Tạo 1 mảng quyền' })
  @ApiBody({
    type: CreatePermissionDto,
    isArray: true, // Quan trọng để báo Swagger đây là mảng
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo quyền thành công',
    type: PermissionResponse,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Quyền đã tồn tại' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  createManyPermissions(@Body() createPermissionDto: CreatePermissionDto[]) {
    return this.permissionService.createManyPermissions(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách quyền' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách quyền',
    type: [Permission],
  })
  @ResponseMessage('Lấy danh sách permission thành công')
  findAll(@Query() query: QueryPermissionDto) {
    return this.permissionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy quyền theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin quyền',
    type: Permission,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của quyền cần tìm',
    example: '9b8ff58c-cabf-41b5-a6b7-3bd1bbe419e5',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    description: 'ID của quyền cần tìm',
    example: '9b8ff58c-cabf-41b5-a6b7-3bd1bbe419e5',
  })
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quyền' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: Permission,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền' })
  @ApiResponse({ status: 204, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}

// Mình đã thêm các mô tả API với @ApiOperation và @ApiResponse rồi! Khi chạy NestJS, bạn có thể truy cập `/api` để xem giao diện Swagger. Cần chỉnh sửa hay bổ sung gì nữa không? 🚀
