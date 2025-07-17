import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Not, Repository } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { RoleEnum } from 'src/constants/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private PermissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, isActive, permissions } = createRoleDto;
    // Kiểm tra name đã tồn tại chưa
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new Error('Tên vai trò đã tồn tại. Vui lòng chọn tên khác!');
    }

    // Tìm các quyền theo danh sách ID
    const getpermissions =
      await this.PermissionRepository.findByIds(permissions);

    if (getpermissions.length !== permissions.length) {
      throw new Error('Một hoặc nhiều quyền không hợp lệ!');
    }

    const role = this.roleRepository.create({
      name,
      description,
      isActive,
      permissions: getpermissions,
    });

    try {
      return await this.roleRepository.save(role);
    } catch (error) {
      throw new Error(`Failed to create role`);
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    // const { name } = updateRoleDto;
    // // Kiểm tra name đã tồn tại chưa
    // const existingRole = await this.roleRepository.findOne({ where: { name } });
    // if (existingRole) {
    //   throw new Error('Tên vai trò đã tồn tại. Vui lòng chọn tên khác!');
    // }
    // await this.roleRepository.update(id, updateRoleDto);
    // return await this.findOne(id);
  }

  async deleteRole(id: string) {
    // Tìm role cùng với quan hệ
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new Error('Role không tồn tại!');
    }

    // Xóa liên kết với permissions
    if (role.permissions.length > 0) {
      await this.roleRepository
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(id)
        .remove(role.permissions.map((permission) => permission.id));
    }

    // Xóa liên kết với users
    if (role.users.length > 0) {
      await this.roleRepository
        .createQueryBuilder()
        .relation(Role, 'users')
        .of(id)
        .remove(role.users.map((user) => user.id));
    }

    // Cuối cùng xóa role
    return await this.roleRepository.delete(id);

    // xóa bảng role_permision
  }
  async deleteRole_permission_of_role(id: string, permission_ids: string[]) {
    // Kiểm tra role có tồn tại không
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    // Xóa từng quyền trong bảng trung gian
    for (const permissionId of permission_ids) {
      await this.roleRepository
        .createQueryBuilder()
        .relation('permissions')
        .of(id)
        .remove(permissionId);
    }

    return {
      status: 200,
      message: 'Deleted permissions successfully!',
    };
  }

  async updatePermission_of_role(
    id: string,
    name: RoleEnum,
    description: string,
    isActive: boolean,
    permissions: string[],
  ) {
    // check id chưa tồn tại

    const existingRoleByID = await this.roleRepository.findOne({
      where: { id: id },
    });
    if (!existingRoleByID) {
      throw new Error('Vai trò chưa tồn tại. Vui lòng chọn vai trò khác!');
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: name, id: Not(id) },
    });
    if (existingRole) {
      throw new Error('Tên vai trò đã tồn tại. Vui lòng chọn tên khác!');
    }
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (name !== undefined) {
      role.name = name;
    }
    if (description !== undefined) {
      role.description = description;
    }
    if (isActive !== undefined) {
      role.isActive = isActive;
    }
    // Lưu thay đổi vai trò
    await this.roleRepository.save(role);
    if (!role) {
      throw new Error('Role not found');
    }
    // Lấy đầy đủ danh sách quyền mới từ DB để tránh lỗi mapping
    const newPermissions = await this.PermissionRepository.findBy(
      permissions.map((permissionId) => ({
        id: permissionId,
      })),
    );

    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(id)
      .remove(role.permissions);

    // Thêm quyền mới (dùng object thay vì id string)
    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(id)
      .add(newPermissions);

    // Load lại dữ liệu mới
    const updatedRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    return {
      status: 200,
      message: 'Updated permissions successfully!',
      data: updatedRole?.permissions,
    };
  }
}
