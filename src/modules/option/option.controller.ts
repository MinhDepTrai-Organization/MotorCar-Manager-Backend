import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { OptionResponseDto, OptionResponseDtoArray } from './dto/response_option.dto';

@Controller('option')
@ApiTags(Tag.OPTION)
@Public()
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thuộc tính mới' })
  @ApiCreatedResponse({
    description: 'Tạo thành công',
    type: OptionResponseDto,
  })
  @ApiResponse({ status: 201, description: 'Tạo thành công' }) // Mô tả response 201
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // Mô tả lỗi 400
  @ApiResponse({ status: 409, description: 'Tên thuộc tính đã tồn tại' }) // Thêm response 409
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionService.create(createOptionDto);
  }

  @Get()
  @ApiOkResponse({ type: OptionResponseDtoArray })
  @ApiOperation({ summary: 'Lấy danh sách thuộc tính ' })
  findAll() {
    return this.optionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm kiếm theo id ' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '1ac80854-7166-41a5-bcd8-3473be9264b8"',
    description: 'Tìm kiếm theo id',
  })
  @ApiResponse({ status: 200, description: 'Tìm thấy thuộc tính' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuộc tính' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  findOne(@Param('id') id: string) {
    return this.optionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật theo id ' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '1ac80854-7166-41a5-bcd8-3473be9264b8"',
    description: 'Cập nhật theo theo id',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuộc tính' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionService.update(id, updateOptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa theo id ' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '1ac80854-7166-41a5-bcd8-3473be9264b8"',
    description: 'Xóa theo theo id',
  })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuộc tính' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  remove(@Param('id') id: string) {
    return this.optionService.remove(id);
  }
}
