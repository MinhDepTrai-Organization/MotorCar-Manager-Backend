import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import QueryPermissionDto from './dto/query-permission.dto';
import { SortOrder } from 'src/constants/sortOrder.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { path, method } = createPermissionDto;

    // Kiểm tra path và name đã tồn tại chưa
    const existingPermission = await this.permissionRepository.findOne({
      where: [{ path, method }],
    });

    if (existingPermission) {
      throw new Error('Path và Method đã tồn tại. Vui lòng chọn giá trị khác.');
    }

    try {
      const permission = this.permissionRepository.create(createPermissionDto);
      return this.permissionRepository.save(permission);
    } catch (error) {
      throw new Error(`Failed to create permission:`);
    }
  }

  async createManyPermissions(createPermissionDto: CreatePermissionDto[]) {
    try {
      // Lọc trùng trong chính mảng đầu vào
      const uniquePermissions = createPermissionDto.reduce((acc, item) => {
        const exists = acc.find(
          (perm) => perm.path === item.path && perm.method === item.method,
        );
        if (!exists) acc.push(item);
        return acc;
      }, []);

      // Lấy danh sách các quyền đã tồn tại trong DB
      const existingPermissions = await this.permissionRepository.find({
        where: uniquePermissions.map(({ path, method }) => ({ path, method })),
      });

      // Lọc ra những quyền chưa tồn tại trong DB
      const newPermissions = uniquePermissions.filter(
        (perm) =>
          !existingPermissions.some(
            (existPerm) =>
              existPerm.path === perm.path && existPerm.method === perm.method,
          ),
      );

      if (newPermissions.length === 0) {
        throw new Error(
          'Tất cả các quyền đã tồn tại. Không có quyền nào được tạo mới.',
        );
      }

      // Tạo và lưu các quyền mới
      const permissions = this.permissionRepository.create(newPermissions);
      const data = await this.permissionRepository.save(permissions);
      return data;
    } catch (error) {
      throw new Error(`Failed to create permissions: `);
    }
  }

  async findAll(query: QueryPermissionDto) {
    try {
      const {
        current = 1,
        pageSize = 10,
        sortOrder = SortOrder.DESC,
        ...filters
      } = query;

      const queryBuilder = this.permissionRepository
        .createQueryBuilder('permission')
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .orderBy(
          'permission.createdAt',
          sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
        );

      if (filters.method) {
        queryBuilder.andWhere('permission.method = :method', {
          method: filters.method,
        });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(permission.path ILIKE :search OR permission.name ILIKE :search)',
          { search: `%${filters.search.trim()}%` },
        );
      }
      if (filters.module) {
        queryBuilder.andWhere('permission.module ILIKE :module', {
          module: filters.module,
        });
      }

      const [permissions, total] = await queryBuilder.getManyAndCount();

      return {
        data: permissions,
        meta: {
          current,
          pageSize,
          total,
          pages: Math.ceil(total / pageSize),
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const { path, method } = updatePermissionDto;

    // Kiểm tra path và name có trùng không, ngoại trừ chính bản ghi đang cập nhật
    const existingPermission = await this.permissionRepository.findOne({
      where: [{ path, method }],
    });

    if (existingPermission && existingPermission.id !== id) {
      throw new Error('Path và Method đã tồn tại. Vui lòng chọn giá trị khác.');
    }

    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);

    const data = await this.permissionRepository.save(permission);
    return {
      message: 'Cập nhật thành công',
      data,
    };
  }

  async remove(id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    // Xóa liên kết Permission khỏi các Role
    if (permission.roles.length > 0) {
      permission.roles = [];
      await this.permissionRepository.save(permission); // cập nhật lại để gỡ liên kết
    }

    // Sau đó mới xóa chính permission
    await this.permissionRepository.delete(id);

    return {
      message: 'Xóa thành công',
    };
  }
}
