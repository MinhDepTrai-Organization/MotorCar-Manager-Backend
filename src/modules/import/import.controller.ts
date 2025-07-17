import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryImportDto } from './dto/query-import.dto';
import { Tag } from 'src/constants/api-tag.enum';

@ApiTags(Tag.IMPORT)
@ApiBearerAuth()
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách nhập kho',
  })
  async findAll(@Query() query: QueryImportDto) {
    return this.importService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin nhập kho bằng id',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.importService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa nhập kho',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.importService.remove(id);
  }
}
