import { ApiProperty } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class PermissionResponse {
  // @ApiProperty({ example: 201 })
  // status: number;

  // @ApiProperty({ example: 'Tạo quyền thành công' })
  // message: string;

  @ApiProperty({ type: CreatePermissionDto, isArray: true })
  data: CreatePermissionDto[];
}
