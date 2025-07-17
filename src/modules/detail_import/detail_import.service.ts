import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateImportDto } from '../import/dto/create-import.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailImport } from './entities/detail_import.entity';
import { EntityManager, In, QueryFailedError, Repository } from 'typeorm';
import { Import } from '../import/entities/import.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Skus } from '../skus/entities/skus.entity';
import { Export } from '../export/entities/export.entity';
import {
  getStatusKeyByEnumType,
  order_status,
} from 'src/constants/order_status.enum';
import { UpdateImportDto } from '../import/dto/update-import.dto';
import dayjs from 'dayjs';
import { filterEmptyFields } from 'src/helpers/utils';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';

@Injectable()
export class DetailImportService {
  constructor(
    @InjectRepository(DetailImport)
    private readonly detailImportReposity: Repository<DetailImport>,

    @InjectRepository(Import)
    private readonly ImportReposity: Repository<Import>,
    @InjectRepository(Warehouse)
    private readonly WarehouseReposity: Repository<Warehouse>,

    @InjectRepository(Skus)
    private readonly SkusReposity: Repository<Skus>,
  ) {}

  async create(
    createDetailImportDto: CreateImportDto,
    user: UserValidationType,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Bạn chưa đăng nhập hoặc không có quyền truy cập',
      );
    }
    const { note, detail_import } = createDetailImportDto;
    try {
      return await this.ImportReposity.manager.transaction(async (manager) => {
        const createImport = manager.create(Import, {
          note,
          // user,
        });
        const newImport = await manager.save(createImport);

        const validDetails = [];
        const warehouse_ids = [
          ...new Set(detail_import.map((item) => item.warehouse_id)),
        ];
        const warehouses = await manager.find(Warehouse, {
          where: { id: In(warehouse_ids) },
        });

        const missingWarehouses = warehouse_ids.filter(
          (id) => !warehouses.some((warehouse) => warehouse.id === id),
        );
        if (missingWarehouses.length > 0) {
          throw new NotFoundException(
            `Warehouse with IDs ${missingWarehouses.map((item) => item).join(', ')} not found`,
          );
        }
        const warehouseMap = new Map(warehouses.map((item) => [item.id, item]));
        const sku_ids = [...new Set(detail_import.map((item) => item.skus_id))];
        const skus = await manager.find(Skus, {
          where: { id: In(sku_ids) },
          relations: ['product'],
        });
        const missingSkus = sku_ids.filter(
          (id) => !skus.some((sku) => sku.id === id),
        );
        if (missingSkus.length > 0) {
          throw new NotFoundException(
            `SKU with IDs ${missingSkus.map((item) => item).join(', ')} not found`,
          );
        }
        const skuMap = new Map(skus.map((item) => [item.id, item]));
        // Duyệt qua từng chi tiết nhập
        await Promise.all(
          detail_import.map(async (item) => {
            const sku = skuMap.get(item.skus_id);
            const productName = sku.product?.title || '';
            const warehouse = warehouseMap.get(item.warehouse_id);
            const lot_name =
              item.lot_name ||
              `${productName} - ${sku.name} - ${warehouse.name} - ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`;
            // Nếu SKU hợp lệ, thêm vào danh sách hợp lệ
            validDetails.push(
              manager.create(DetailImport, {
                price_import: item.price_import,
                quantity_import: item.quantity_import,
                quantity_sold: 0,
                import: newImport,
                skus: sku,
                warehouse,
                lot_name,
                quantity_remaining: item.quantity_import,
              }),
            );
          }),
        );

        // Lưu các chi tiết hợp lệ vào DB
        if (validDetails.length > 0) {
          await manager.save(DetailImport, validDetails);
        }

        return {
          status: 200,
          message: 'Import process completed',
          data: validDetails,
        };
      });
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const constraint = e.driverError.constraint;
        if (constraint === 'UQ_warehouse_lot_skus') {
          throw new BadRequestException(
            'Lô hàng của biến thể đã tồn tại trong kho',
          );
        }
      }
      throw e;
    }
  }

  async update(id: string, updateDetailImportDto: UpdateImportDto, user) {
    const { note, detail_import } = updateDetailImportDto;

    try {
      // Kiểm tra Import tồn tại
      const existingImport = await this.ImportReposity.findOne({
        where: { id },
      });

      if (!existingImport) {
        throw new NotFoundException(`Import with ID ${id} not found`);
      }

      return await this.ImportReposity.manager.transaction(async (manager) => {
        // Kiểm tra và lấy warehouse nếu warehouse_id được cung cấp
        const warehouse_ids = [
          ...new Set(detail_import.map((item) => item.warehouse_id)),
        ];
        const warehouses = await manager.find(Warehouse, {
          where: { id: In(warehouse_ids) },
        });
        const missingWarehouses = warehouse_ids.filter(
          (id) => !warehouses.some((warehouse) => warehouse.id === id),
        );
        if (missingWarehouses.length > 0) {
          throw new NotFoundException(
            `Warehouse with IDs ${missingWarehouses.join(', ')} not found`,
          );
        }
        const warehouseMap = new Map(warehouses.map((item) => [item.id, item]));

        // Cập nhật Import
        const updatedImport = manager.create(Import, {
          ...existingImport,
          note: note !== undefined ? note : existingImport.note,
        });

        const saveImport = await manager.save(updatedImport);
        const existingDetailImports = await manager.find(DetailImport, {
          where: {
            import: {
              id: saveImport.id,
            },
          },
        });
        const existingDetailImportMap = new Map(
          existingDetailImports.map((item) => [item.id, item]),
        );
        // Xóa các detail_import không còn tồn tại trong danh sách mới
        const detailImportToDelete = existingDetailImports
          .filter(
            (detail) =>
              !detail_import.some(
                (item) => item.detail_import_id === detail.id,
              ),
          )
          .map((detail) => detail.id);
        if (detailImportToDelete.length > 0) {
          await manager.delete(DetailImport, detailImportToDelete);
        }

        const skus_ids = [
          ...new Set(detail_import.map((item) => item.skus_id)),
        ];
        const skus = await manager.find(Skus, {
          where: { id: In(skus_ids) },
          relations: ['product'],
        });
        const missingSkus = skus_ids.filter(
          (id) => !skus.some((sku) => sku.id === id),
        );
        if (missingSkus.length > 0) {
          throw new NotFoundException(
            `SKU with IDs ${missingSkus.join(', ')} not found`,
          );
        }
        const skuMap = new Map(skus.map((item) => [item.id, item]));

        // Xử lý detail_import nếu được cung cấp
        const detailImportsToSave = detail_import.map((item) => {
          const existingDetail = existingDetailImportMap.get(
            item.detail_import_id,
          );
          const warehouse = warehouseMap.get(item.warehouse_id);
          const skusData = skuMap.get(item.skus_id);
          const productData = skusData.product;

          const lot_name =
            item.lot_name ||
            `${productData.title} - ${skusData.name} - ${warehouse.name} - ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`;
          const filteredFields = filterEmptyFields({
            price_import: item.price_import,
            quantity_import: item.quantity_import,
            lot_name: lot_name,
          });

          if (existingDetail) {
            const quantity_remaining =
              filteredFields.quantity_import > 0 &&
              filteredFields.quantity_import - existingDetail.quantity_sold > 0
                ? filteredFields.quantity_import - existingDetail.quantity_sold
                : filteredFields.quantity_import || 0;
            return {
              ...existingDetail,
              ...filteredFields,
              quantity_remaining: quantity_remaining,
              warehouse: warehouse,
              import: saveImport,
            };
          } else {
            // Tạo mới DetailImport
            return manager.create(DetailImport, {
              ...filteredFields,
              warehouse: warehouse,
              import: saveImport,
              skus: skusData,
              quantity_remaining: item.quantity_import,
            });
          }
        });

        // Lưu tất cả DetailImport (cập nhật và mới)
        if (detailImportsToSave.length > 0) {
          await manager.save(DetailImport, detailImportsToSave);
        }

        return {
          status: 200,
          message: 'Import updated successfully',
          data: saveImport,
        };
      });
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const constraint = e.driverError.constraint;
        if (constraint === 'UQ_warehouse_lot_skus') {
          throw new BadRequestException(
            'Lô hàng của biến thể đã tồn tại trong kho',
          );
        }
      }
      throw e;
    }
  }

  async findAll() {
    return await this.detailImportReposity
      .createQueryBuilder('detail_import')
      .leftJoinAndSelect('detail_import.skus', 'skus')
      .leftJoinAndSelect('detail_import.warehouse', 'warehouse')
      .getMany();
  }

  async getAllDetailImportID() {
    return await this.detailImportReposity
      .find({
        select: ['id'],
      })
      .then((res) => res.map((item) => item.id));
  }

  async findOne(id: string) {
    return await this.detailImportReposity.findOne({
      where: { id: id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} detailImport`;
  }

  // async updateRemainingQuantity(
  //   detailImportIDs: string[],
  //   baseManager?: EntityManager,
  // ) {
  //   const managerRepo = baseManager || this.detailImportReposity.manager;

  //   try {
  //     const executeUpdates = async (manager: EntityManager) => {
  //       const detailImports = await manager.find(DetailImport, {
  //         where: { id: In(detailImportIDs) },
  //         relations: ['detail_export'],
  //       });

  //       if (detailImports.length !== detailImportIDs.length) {
  //         const missingIDs = detailImportIDs.filter(
  //           (id) => !detailImports.some((di) => di.id === id),
  //         );
  //         throw new NotFoundException(
  //           `Không tìm thấy detail import với IDs: ${missingIDs.join(', ')}`,
  //         );
  //       }

  //       // Tính toán quantity_remaining cho tất cả detailImports
  //       const updatedDetailImports = detailImports.map((detailImport) => {
  //         const quantity_import = detailImport.quantity_import;
  //         const quantity_export = detailImport.detail_export
  //           ? detailImport.detail_export.reduce(
  //               (total, current) => total + current.quantity_export,
  //               0,
  //             )
  //           : 0;
  //         detailImport.quantity_remaining = quantity_import - quantity_export;
  //         return detailImport;
  //       });

  //       await manager.save(DetailImport, updatedDetailImports);

  //       return updatedDetailImports.map((di) => ({
  //         id: di.id,
  //         quantity_remaining: di.quantity_remaining,
  //       }));
  //     };

  //     if (!baseManager) {
  //       return await managerRepo.transaction(async (manager) => {
  //         return await executeUpdates(manager);
  //       });
  //     } else {
  //       return await executeUpdates(managerRepo);
  //     }
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // Cron job chạy lúc 2h sáng mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncInventory() {
    try {
      // Lấy danh sách DetailImport cần đồng bộ
      const detailImportIDs = await this.detailImportReposity
        .createQueryBuilder('di')
        .innerJoin('di.detail_export', 'de')
        .where('de.updated_at > :date', {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 giờ trước
        })
        .select('di.id')
        .distinct(true)
        .getRawMany()
        .then((results) => results.map((r) => r.di_id));

      if (detailImportIDs.length === 0) {
        return;
      }

      await this.updateRemainingQuantity(detailImportIDs);
    } catch (error) {}
  }

  async updateRemainingQuantity(
    detailImportIDs: string[],
    baseManager?: EntityManager,
  ) {
    const managerRepo = baseManager || this.detailImportReposity.manager;

    try {
      const executeUpdates = async (manager: EntityManager) => {
        // 1. Tải DetailImport và tính tổng quantity_export
        const detailImports = await manager
          .createQueryBuilder(DetailImport, 'di')
          .leftJoin('di.detail_export', 'de')
          .where('di.id IN (:...ids)', { ids: detailImportIDs })

          .select([
            'di.id',
            'di.quantity_import',
            'di.quantity_remaining',
            'SUM(de.quantity_export) AS total_export',
          ])
          .groupBy('di.id')
          .getRawAndEntities();

        // 2. Kiểm tra sự tồn tại
        const foundIds = new Set(detailImports.entities.map((di) => di.id));
        const missingIDs = detailImportIDs.filter((id) => !foundIds.has(id));
        if (missingIDs.length > 0) {
          throw new NotFoundException(
            `Không tìm thấy DetailImport với IDs: ${missingIDs.join(', ')}`,
          );
        }

        // 3. Lưu giá trị quantity_remaining gốc
        const originalQuantities = new Map(
          detailImports.entities.map((di) => [di.id, di.quantity_remaining]),
        );

        // 4. Tính toán và kiểm tra quantity_remaining
        const updatedDetailImports = detailImports.entities.map(
          (detailImport, index) => {
            const raw = detailImports.raw[index];
            const quantity_import = detailImport.quantity_import;
            const quantity_export = parseFloat(raw.total_export || '0');

            // Tính quantity_remaining
            const newQuantityRemaining =
              quantity_import - quantity_export > 0
                ? quantity_import - quantity_export
                : 0;

            detailImport.quantity_remaining = newQuantityRemaining;
            return detailImport;
          },
        );

        // 5. Cập nhật chỉ các DetailImport có thay đổi
        const changedDetailImports = updatedDetailImports.filter(
          (di) => di.quantity_remaining !== originalQuantities.get(di.id),
        );
        if (changedDetailImports.length > 0) {
          await manager.save(changedDetailImports);
        }

        // 6. Trả về kết quả
        return updatedDetailImports.map((di) => ({
          id: di.id,
          quantity_import: di.quantity_import,
          quantity_remaining: di.quantity_remaining,
          total_quantity_export: parseFloat(
            detailImports.raw.find((r) => r.di_id === di.id)?.total_export ||
              '0',
          ),
        }));
      };

      if (!baseManager) {
        return await managerRepo.transaction(async (manager) => {
          return await executeUpdates(manager);
        });
      } else {
        return await executeUpdates(managerRepo);
      }
    } catch (e) {
      throw e;
    }
  }

  async updateQuantitySold(
    exportID: string,
    baseManager?: EntityManager,
    isReturnRequest: boolean = false,
  ) {
    const managerRepo = baseManager || this.detailImportReposity.manager;

    try {
      const updateQuantity = async (manager: EntityManager) => {
        // Lấy Export với tất cả quan hệ cần thiết
        const exportData = await manager.findOne(Export, {
          where: { id: exportID },
          relations: ['detail_export', 'detail_export.detail_import', 'order'],
        });

        // Kiểm tra Export có tồn tại không
        if (!exportData) {
          throw new NotFoundException(
            `Export với ID ${exportID} không tồn tại`,
          );
        }

        // Kiểm tra detail_export
        const detail_export = exportData.detail_export;
        if (!detail_export || detail_export.length === 0) {
          throw new NotFoundException(
            `Export ${exportID} không có detail export nào`,
          );
        }

        // Kiểm tra order
        const order = exportData.order;
        if (!order) {
          throw new NotFoundException(`Export ${exportID} không có order nào`);
        }

        // Kiểm tra trạng thái order
        const type = order.order_status;
        if (
          type !== order_status.DELIVERED &&
          type !== order_status.FAILED_DELIVERY
        ) {
          throw new BadRequestException(
            `Chỉ có ${getStatusKeyByEnumType(
              order_status.DELIVERED,
              order_status,
            )} và ${getStatusKeyByEnumType(
              order_status.FAILED_DELIVERY,
              order_status,
            )} mới có thể cập nhật quantity sold`,
          );
        }

        // Cập nhật quantity_sold cho tất cả DetailImport
        const detailImportsToUpdate = detail_export.map((item) => {
          const detailImport = item.detail_import;
          if (!detailImport) {
            throw new NotFoundException(
              `Detail export ${item.id} không có detail import nào`,
            );
          }
          if (type === order_status.DELIVERED) {
            if (isReturnRequest) {
              detailImport.quantity_sold -= item.quantity_export;
            } else {
              detailImport.quantity_sold += item.quantity_export;
            }
          } else if (type === order_status.FAILED_DELIVERY) {
            detailImport.quantity_sold -= item.quantity_export;
          }
          return detailImport;
        });

        // Lưu tất cả DetailImport trong một lần
        const savedData = await manager.save(
          DetailImport,
          detailImportsToUpdate,
        );

        // Trả về kết quả
        return {
          status: 200,
          message: 'Update quantity sold success',
          data: savedData.map((di) => ({
            id: di.id,
            quantity_sold: di.quantity_sold,
          })),
        };
      };

      if (!baseManager) {
        return await managerRepo.transaction(async (manager) => {
          return await updateQuantity(manager);
        });
      } else {
        return await updateQuantity(managerRepo);
      }
    } catch (e) {
      throw e;
    }
  }
}
