import { ApiProperty } from '@nestjs/swagger';

// voucher.dto.ts
export class VoucherDto {
  @ApiProperty({
    description: 'ID của voucher',
    example: '921101ae-58cf-4a82-801c-e04c99e01b7b',
  })
  id: string;

  @ApiProperty({
    description: 'Ngày tạo voucher',
    type: String,
    format: 'date-time',
    example: '2025-03-03T10:23:08.869Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Ngày cập nhật voucher mới nhất',
    type: String,
    format: 'date-time',
    example: '2025-05-03T08:36:45.409Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Ngày voucher bị xóa (nếu có)',
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  deletedAt: Date | null;

  @ApiProperty({ description: 'Mã code của voucher', example: 'VOUCHER123' })
  voucher_code: string;

  @ApiProperty({ description: 'Tên voucher', example: 'Discount 10%' })
  voucher_name: string;

  @ApiProperty({
    description: 'Mô tả về voucher',
    example: 'Giảm giá 10% cho mua sắm',
  })
  description: string;

  @ApiProperty({ description: 'Số lần đã sử dụng voucher', example: 0 })
  uses: number;

  @ApiProperty({
    description: 'Giới hạn tổng số lượt voucher có thể được lấy',
    example: 100,
  })
  limit: number;

  @ApiProperty({ description: 'Giới hạn số lượt mỗi người dùng', example: 5 })
  max_uses_user: number;

  @ApiProperty({
    description: 'Giá trị giảm (đơn vị tiền tệ)',
    example: '500000.00',
  })
  discount_amount: string;

  @ApiProperty({
    description: 'Nếu voucher có giá trị cố định (true/false)',
    example: false,
  })
  fixed: boolean;

  @ApiProperty({
    description: 'Trạng thái hiện tại của voucher',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Ngày bắt đầu voucher có hiệu lực',
    type: String,
    format: 'date',
    example: '2024-01-01',
  })
  start_date: Date;

  @ApiProperty({
    description: 'Ngày kết thúc voucher có hiệu lực',
    type: String,
    format: 'date',
    example: '2025-01-01',
  })
  end_date: Date;

  @ApiProperty({ description: 'Số người đã nhận voucher', example: 5 })
  count_user_get: number;
}

// user-voucher.dto.ts
export class UserVoucherDto {
  @ApiProperty({ description: 'mã id ', example: 5 })
  id: string;

  @ApiProperty()
  is_used: boolean;

  @ApiProperty({ nullable: true })
  used_at?: Date;

  @ApiProperty({ type: VoucherDto })
  voucher: VoucherDto;
}
