import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeVoucherService } from './type_voucher.service';
import { CreateTypeVoucherDto } from './dto/create-type_voucher.dto';
import { UpdateTypeVoucherDto } from './dto/update-type_voucher.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { ResponseMessage } from 'src/decorators/response_message.decorator';

@ApiTags(Tag.TYPE_VOUCHER)
@Public()
@Controller('type-voucher')
export class TypeVoucherController {
  constructor(private readonly typeVoucherService: TypeVoucherService) {}

  @Post()
  @ResponseMessage("Tạo voucher thành công")
  @ApiOperation({ summary: 'OKi' })
  create(@Body() createTypeVoucherDto: CreateTypeVoucherDto) {
    return this.typeVoucherService.create(createTypeVoucherDto);
  }

  @Get()
  @ResponseMessage("Lấy danh sách loại voucher thành công")
  @ApiOperation({ summary: 'OKi' })
  findAll() {
    return this.typeVoucherService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'OKi' })
  @ApiParam({
    example: 'cbc5679d-9a66-48a4-8ca4-e8d578837ad0',
    name: 'id',
  })
  @ResponseMessage("Tìm kiếm loại voucher thành công")
  findOne(@Param('id') id: string) {
    return this.typeVoucherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'OKi' })
  @ApiParam({
    example: 'cbc5679d-9a66-48a4-8ca4-e8d578837ad0',
    name: 'id',
  })
  @ApiBody({
    description: 'Dữ liệu để cập nhật loại voucher',
    type: UpdateTypeVoucherDto, // Kiểu của toàn bộ body
    examples: {
      default: {
        value: {
          name_type_voucher: 'cdnsjncj', // Sử dụng example bạn cung cấp
        },
      },
    },
  })
  @ResponseMessage("Cập nhật loại voucher thành công")
  update(
    @Param('id') id: string,
    @Body() updateTypeVoucherDto: UpdateTypeVoucherDto,
  ) {
    return this.typeVoucherService.update(id, updateTypeVoucherDto);
  }
  @ResponseMessage("Xóa loại voucher thành công")
  @ApiOperation({ summary: 'OKi' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeVoucherService.remove(id);
  }
}
