import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Import } from './entities/import.entity';
import { Repository } from 'typeorm';
import { QueryImportDto } from './dto/query-import.dto';
import { isUUID } from 'class-validator';
import { convertToTimeStampPostgres } from 'src/helpers/datetime.format';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Import)
    private readonly importRepository: Repository<Import>,
  ) {}

  async findAll(query: QueryImportDto) {
    try {
      const { current = 1, pageSize = 10, sortOrder, ...filters } = query;
      const skip = (current - 1) * pageSize;
      const take = pageSize;

      const queryBuilder = this.importRepository
        .createQueryBuilder('import')
        .leftJoinAndSelect('import.detail_imports', 'detail_imports')
        .leftJoinAndSelect('detail_imports.skus', 'skus')
        .leftJoinAndSelect('skus.product', 'products')
        .leftJoinAndSelect('products.brand', 'brands')
        .leftJoinAndSelect('detail_imports.warehouse', 'warehouses');

      if (filters.warehouse_id) {
        queryBuilder.andWhere('warehouses.id = :warehouse_id', {
          warehouse_id: filters.warehouse_id,
        });
      }

      if (filters.search && filters.search.trim() !== '') {
        const searchInput = filters.search.trim();

        if (isUUID(searchInput)) {
          queryBuilder.andWhere('import.id = :searchExact', {
            searchExact: searchInput,
          });
        }
        queryBuilder.andWhere(
          'import.note ILIKE :search OR brands.name ILIKE :search',
          {
            search: `%${searchInput}%`,
          },
        );
      }

      if (filters.start_date && filters.end_date) {
        const from = convertToTimeStampPostgres(filters.start_date);
        const to = convertToTimeStampPostgres(filters.end_date);
        if (from > to) {
          throw new BadRequestException(
            'Thời gian bắt đầu không được lớn hơn thời gian kết thúc',
          );
        }
        queryBuilder.andWhere(
          'import.createdAt BETWEEN :start_date AND :end_date',
          {
            start_date: from,
            end_date: to,
          },
        );
      }

      if (filters.product_id) {
        queryBuilder.andWhere('products.id = :product_id', {
          product_id: filters.product_id,
        });
      }

      if (filters.skus_id) {
        queryBuilder.andWhere('skus.id = :skus_id', {
          skus_id: filters.skus_id,
        });
      }

      const [data, total] = await queryBuilder
        .orderBy('import.updatedAt', 'DESC')
        .skip(skip)
        .take(take)
        .select([
          'import',
          'detail_imports',
          'skus',
          'warehouses',
          'products.title',
        ])
        .getManyAndCount();

      const totalPage = Math.ceil(total / pageSize);
      return {
        status: 200,
        message: 'Lấy danh sách nhập kho thành công',
        data: {
          data,
          meta: {
            current,
            pageSize,
            total,
            totalPage,
          },
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const importData = await this.importRepository.findOne({
        where: { id },
        relations: [
          'detail_imports',
          'detail_imports.skus',
          'detail_imports.warehouse',
        ],
      });

      if (!importData) {
        throw new BadRequestException(`Không tìm thấy phiếu nhập kho #${id}`);
      }

      return {
        status: 200,
        message: 'Lấy thông tin nhập kho thành công',
        data: importData,
      };
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      const importData = await this.importRepository.findOne({
        where: { id },
      });

      if (!importData) {
        throw new BadRequestException('Không tìm thấy phiếu nhập kho');
      }

      await this.importRepository.delete(id);

      return {
        status: 200,
        message: 'Xóa nhập kho thành công',
      };
    } catch (e) {
      throw e;
    }
  }
}
