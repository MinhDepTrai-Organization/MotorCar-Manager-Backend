import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionValueService } from './option_value.service';
import { CreateOptionValueDto } from './dto/create-option_value.dto';
import { UpdateOptionValueDto } from './dto/update-option_value.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';

@Public()
@ApiTags(Tag.OPTIONVALUE)
@Controller('option-value')
export class OptionValueController {
  constructor(private readonly optionValueService: OptionValueService) {}

  @Post()
  @ApiOperation({
    summary:
      ' Tạo  giá trị của thuộc tính của 1 sku của 1 sp ',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo option value thành công.',
  })
  @ApiResponse({
    status: 400,
    description: 'Value của Option value đã tồn tại hoặc request không hợp lệ.',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi server nội bộ.',
  })
  create(@Body() createOptionValueDto: CreateOptionValueDto) {
    return this.optionValueService.create(createOptionValueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lọc All' })
  findAll() {
    return this.optionValueService.findAll();
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Tìm theo id ' })
  // findOne(@Param('id') id: string) {
  //   return this.optionValueService.findOne(+id);
  // }
  @ApiParam({
    name: 'id',
    example: '4413699e-e91b-45f2-b173-fea11b6186d7',
    description: 'ID của sản phẩm',
  })
  @ApiOperation({ summary: 'Tìm theo id sản phẩm' })
  @Get('/ByIdProduct/:id')
  findOnebyIdproduct(@Param('id') id: string) {
    return this.optionValueService.findOnebyIdproduct(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOptionValueDto: UpdateOptionValueDto,
  // ) {
  //   return this.optionValueService.update(+id, updateOptionValueDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.optionValueService.remove(+id);
  // }
}
