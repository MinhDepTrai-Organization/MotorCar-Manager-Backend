import { Injectable } from '@nestjs/common';
import { CreateUserHasPermissionDto } from './dto/create-user_has_permission.dto';
import { UpdateUserHasPermissionDto } from './dto/update-user_has_permission.dto';

@Injectable()
export class UserHasPermissionService {
  create(createUserHasPermissionDto: CreateUserHasPermissionDto) {
    return 'This action adds a new userHasPermission';
  }

  findAll() {
    return `This action returns all userHasPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userHasPermission`;
  }

  update(id: number, updateUserHasPermissionDto: UpdateUserHasPermissionDto) {
    return `This action updates a #${id} userHasPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} userHasPermission`;
  }
}
