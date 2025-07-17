import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VourchersService } from './vourchers.service';
import { CreateVourcherDto } from './dto/create-vourcher.dto';
import { UpdateVourcherDto } from './dto/update-vourcher.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { CreateCustomer_VourcherDto } from './dto/create_customer_voucher.dto';

@ApiTags(Tag.VOUCHER)
@Controller('vourchers')
@ApiBearerAuth()
export class VourchersController {
  constructor(private readonly vourchersService: VourchersService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo voucher thành công . oki',
  })
  create(@Body() createVourcherDto: CreateVourcherDto) {
    return this.vourchersService.create(createVourcherDto);
  }

  @Get()
  @ApiOperation({
    summary: ' oki',
  })
  findAll() {
    return this.vourchersService.findAll();
  }
  @ApiOperation({
    summary: ' oki',
  })
  @ApiParam({
    name: 'id',
    example: '05cbef39-2c56-4cfd-9dc0-a45f38bbdb9c',
    type: String,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vourchersService.findOne(id);
  }
  @ApiParam({
    name: 'id',
    example: '87b9fcae-059e-4288-a03f-3941f250235e',
    type: String,
  })
  @ApiOperation({
    summary: " ' status : active' | 'inactive' | 'expired'",
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVourcherDto: UpdateVourcherDto,
  ) {
    return this.vourchersService.update(id, updateVourcherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vourchersService.remove(id);
  }

  @ApiParam({
    name: 'id',
    example: '87b9fcae-059e-4288-a03f-3941f250235e',
    type: String,
  })
  @Post('/give_customer/:id')
  @ApiOperation({
    summary: 'Quản lý Tặng voucher cho khách hàng',
  })
  createVoucher(
    @Param('id') id: string,
    @Body() createCustomer_VourcherDto: CreateCustomer_VourcherDto,
  ) {
    return this.vourchersService.give_for_customer(
      id,
      createCustomer_VourcherDto,
    );
  }

  @ApiOperation({
    summary: 'Danh sách khách hàng chưa nhận voucher chỉ thị',
  })
  @ApiParam({
    name: 'id',
    example: '921101ae-58cf-4a82-801c-e04c99e01b7b',
  })
  @Get('/customer_no_voucher/:id')
  getListCustomer_NoVoucher(@Param('id') id: string) {
    return this.vourchersService.getListCustomer_NoVoucher(id);
  }
}
