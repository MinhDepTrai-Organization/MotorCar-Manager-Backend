import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserHasPermissionService } from './user_has_permission.service';
import { CreateUserHasPermissionDto } from './dto/create-user_has_permission.dto';
import { UpdateUserHasPermissionDto } from './dto/update-user_has_permission.dto';

@Controller('user-has-permission')
export class UserHasPermissionController {
  constructor(private readonly userHasPermissionService: UserHasPermissionService) {}

  @Post()
  create(@Body() createUserHasPermissionDto: CreateUserHasPermissionDto) {
    return this.userHasPermissionService.create(createUserHasPermissionDto);
  }

  @Get()
  findAll() {
    return this.userHasPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userHasPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserHasPermissionDto: UpdateUserHasPermissionDto) {
    return this.userHasPermissionService.update(+id, updateUserHasPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userHasPermissionService.remove(+id);
  }
}
