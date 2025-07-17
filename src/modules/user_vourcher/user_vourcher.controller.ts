import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserVourcherService } from './user_vourcher.service';
import { CreateUserVourcherDto } from './dto/create-user_vourcher.dto';
import { UpdateUserVourcherDto } from './dto/update-user_vourcher.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { User } from 'src/decorators/current-user';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { UserVoucherDto } from './dto/response_user_voucher.dto';
@ApiTags(Tag.USER_VOUCHER)
@ApiBearerAuth()
@Controller('user-vourcher')
export class UserVourcherController {
  constructor(private readonly userVourcherService: UserVourcherService) {}

  @Post()
  create(@Body() createUserVourcherDto: CreateUserVourcherDto) {
    return this.userVourcherService.hanlegetVoucher(createUserVourcherDto);
  }

  @Get()
  findAll() {
    return this.userVourcherService.findAll();
  }

  @ApiOperation({
    summary: 'Lấy danh sách voucher khách hàng',
  })
  @ApiOkResponse({
    description: 'Lấy danh sách voucher khách hàng thành công',
    type: UserVoucherDto,
    isArray: true, // hiển thị response là mảng các object
  })
  @Get('/user_voucher')
  @ResponseMessage('Lấy danh sách voucher khách hàng thành công')
  find(@User() user) {
    return this.userVourcherService.findOne(user);
  }

  @ApiOperation({
    summary: 'Lấy danh sách voucher khách hàng',
  })
  @ApiOkResponse({
    description: 'Lấy voucher khách hàng thành công',
    type: UserVoucherDto,
    isArray: true, // hiển thị response là mảng các object
  })
  @Get(':id')
  @ResponseMessage('Lấy voucher của khách hàng  thành công')
  findOne_UserVoucher(@Param('id') id: string, @User() user) {
    return this.userVourcherService.findOne_UserVoucher(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserVourcherDto: UpdateUserVourcherDto,
  ) {
    return this.userVourcherService.update(+id, updateUserVourcherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVourcherService.remove(+id);
  }
}
