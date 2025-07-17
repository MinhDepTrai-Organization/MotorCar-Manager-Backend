import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { RoleEnum } from 'src/constants/role.enum';
import { Enum } from '@solana/web3.js';

@ApiTags(Tag.ROLE)
@Public()
@ApiBasicAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiOperation({
    summary: 'Tạo mới role',
  })
  @Post()
  @ResponseMessage('Tạo role thành công')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: 'Lấy danh sách các role',
  })
  @Get()
  @ResponseMessage('Lấy danh sách role thành công')
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({
    summary: 'Tìm kiếm role theo id',
  })
  @ApiParam({
    name: 'id',
    example: 'dfc15ab6-9828-43c9-a7e4-b26b9a75ce25',
  })
  @Get(':id')
  @ResponseMessage('Tìm kiếm role thành công')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({
    summary: 'update role',
  })
  @ApiParam({
    name: 'id',
    example: RoleEnum.DELIVERY_STAFF,
    type: Enum,
  })
  @ApiBody({
    type: UpdateRoleDto,
    examples: {
      updateExample: {
        summary: 'Example of updating a role',
        value: {
          name: 'Updated Role Name',
        },
      },
    },
  })
  @ResponseMessage('Cập nhật role thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({
    summary: 'delete role',
  })
  @ApiParam({
    name: 'id',
    example: 'b38ca2b1-95ea-4313-8615-cd12ab2c3707',
    type: String,
  })
  @Delete(':id')
  @ResponseMessage('Xóa role thành công')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @ApiOperation({
    summary: 'delete role_permission dựa vào role ',
  })
  @ApiParam({
    name: 'id',
    example: 'dfc15ab6-9828-43c9-a7e4-b26b9a75ce25',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permission_ids: {
          type: 'array',
          items: {
            type: 'string',
            example: '901db72b-bd32-4f5f-9232-1e04743537d5',
          },
        },
      },
    },
  })
  @ResponseMessage('Xóa permission của role thành công')
  @Delete('/delete_role_permision/:id')
  deleteRole_permission_of_role(
    @Param('id') id: string,
    @Body() body: { permission_ids: string[] },
  ) {
    return this.roleService.deleteRole_permission_of_role(
      id,
      body.permission_ids,
    );
  }

  @ApiOperation({
    summary:
      'cập nhật lại permission . FE: gửi lên permission_ids:["1","2"]. BE: Xóa hết permission cũ db , tạo permission mới  từ permission_ids:["1","2"]',
  })
  // cập nhật lại permission
  @ApiParam({
    name: 'id',
    example: 'dfc15ab6-9828-43c9-a7e4-b26b9a75ce25',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            example: '62150ab5-26aa-4653-948d-a769f7e6ac50',
          },
        },
        name: {
          type: 'string',
          example: 'Admin',
        },
        description: {
          type: 'string',
          example: 'admin thì full quyền ',
        },
        isActive: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ResponseMessage('Cập nhật permission của role thành công')
  @Put('/update_role_permission/:id')
  updatePermission_of_Role(
    @Param('id') id: string,
    @Body()
    body: {
      name: RoleEnum;
      description: string;
      isActive: boolean;
      permissions: string[];
    },
  ) {
    return this.roleService.updatePermission_of_role(
      id,
      body.name,
      body.description,
      body.isActive,
      body.permissions,
    );
  }
}
