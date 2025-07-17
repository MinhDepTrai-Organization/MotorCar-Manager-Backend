import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';
import { EnumContact } from '../entities/contact.entity';

export default class QueryContactDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    type: String,
    description:
      'Từ khóa tìm kiếm theo tên khách hàng, ghi chú, email hoặc số điện thoại',
    example: '',
    required: false,
  })
  search?: string;

  @IsOptional()
  @IsEnum(EnumContact, {
    message: 'Dịch vụ không hợp lệ, vui lòng chọn dịch vụ hợp lệ',
  })
  @ApiProperty({
    type: String,
    enum: EnumContact,
    description: 'Dịch vụ liên hệ',
    example: EnumContact.Quote,
    required: false,
  })
  service?: EnumContact;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Ngày tạo liên hệ từ ngày cụ thể',
    example: '',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Ngày tạo liên hệ đến ngày cụ thể',
    example: '',
  })
  created_to?: string;
}
