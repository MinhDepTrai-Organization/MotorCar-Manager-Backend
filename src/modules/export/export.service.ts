import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateExportDto,
  CreateExportOrderDto,
  CreateMultipleExportDto,
} from './dto/create-export.dto';
import { UpdateExportDto } from './dto/update-export.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailExport } from '../detail_export/entities/detail_export.entity';
import {
  DataSource,
  EntityManager,
  In,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Export } from './entities/export.entity';
import { DetailImport } from '../detail_import/entities/detail_import.entity';
import { Import } from '../import/entities/import.entity';
import { Order } from '../order/entities/order.entity';
import { order_status } from 'src/constants/order_status.enum';
import QueryExportDto from './dto/query-export-dto';
import { convertToTimeStampPostgres } from 'src/helpers/datetime.format';
import { filterEmptyFields } from 'src/helpers/utils';
import { DetailImportService } from '../detail_import/detail_import.service';
import { UserValidationType } from 'src/auth/strategy/jwt.strategy';
import { RoleEnum } from 'src/constants/role.enum';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(DetailExport)
    private readonly detailExportRepo: Repository<DetailExport>,
    @InjectRepository(Export)
    private readonly exportRepo: Repository<Export>,
    private readonly dataSource: DataSource,
    @InjectRepository(DetailImport)
    private readonly DetailImportRepo: Repository<DetailImport>,

    @InjectRepository(Import)
    private readonly ImportRepo: Repository<Import>,
    private readonly detailImportService: DetailImportService,
  ) {}

  async mergeExportBySku(detailExport: any[], wareHouse_Import: string) {
    const mergedResult = [];

    // Dùng Map để gom nhóm theo skus_id
    const skuMap = new Map<string, any>();

    for (const item of detailExport) {
      const { skus_id, quantity_export, detail_import_id, warehouse_id } = item;
      const quantity = parseInt(quantity_export, 10);

      // Lấy thông tin nhập kho từ DB
      const detailImport = await this.DetailImportRepo.findOne({
        where: { id: detail_import_id },
      });

      if (detailImport) {
        if (skuMap.has(skus_id)) {
          // Nếu đã có sku thì cộng dồn số lượng
          const existingItem = skuMap.get(skus_id);
          existingItem.quantity_export += quantity;
        } else {
          // Nếu chưa có thì thêm mới vào map
          skuMap.set(skus_id, {
            skus_id,
            quantity_export: quantity,
            price_import: detailImport.price_import,
            warehouse_id: wareHouse_Import || warehouse_id,
          });
        }
      }
    }

    // Chuyển Map thành mảng
    skuMap.forEach((value) => mergedResult.push(value));

    return mergedResult;
  }

  // tạo phiếu xuất
  async create(createExportDto: CreateExportDto, user) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { note, detail_export, warehouse_id_import } = createExportDto;

      const createExport = this.exportRepo.create({
        note,
        user: user,
      });
      const saveExport = await queryRunner.manager.save(createExport);
      const savedDetails = [];

      for (const detail of detail_export) {
        const newDetail = this.detailExportRepo.create({
          quantity_export: detail.quantity_export,
          skus: { id: detail.skus_id },
          wareHouse: { id: detail.warehouse_id },
          detail_import: { id: detail.detail_import_id },
          export: saveExport,
        });

        const savedDetail = await queryRunner.manager.save(newDetail);
        savedDetails.push(savedDetail);
      }

      const mergedExport = await this.mergeExportBySku(
        detail_export,
        warehouse_id_import,
      );

      const newImport = await queryRunner.manager.save(
        this.ImportRepo.create({
          note,
          user,
        }),
      );

      const validDetails = [];
      const errors = [];

      if (Array.isArray(mergedExport)) {
        for (const detail of mergedExport) {
          try {
            const newImportDetail = this.DetailImportRepo.create({
              skus: { id: detail.skus_id },
              quantity_import: detail.quantity_export,
              price_import: detail.price_import,
              warehouse: { id: detail.warehouse_id },
              import: newImport,
            });

            const savedImportDetail =
              await queryRunner.manager.save(newImportDetail);
            validDetails.push(savedImportDetail);
          } catch (error) {
            errors.push({ detail, error });
            await queryRunner.rollbackTransaction();
            return {
              message: 'Có lỗi xảy ra khi nhập kho, đã rollback!',
              errors,
            };
          }
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: 200,
        data: saveExport,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Lỗi trong quá trình luân chuyển kho: ');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryDto: QueryExportDto) {
    try {
      const { current = 1, pageSize = 10, sortOrder, ...filters } = queryDto;
      const skip = (current - 1) * pageSize;
      const take = pageSize;

      const queryBuilder = this.exportRepo
        .createQueryBuilder('export')
        .leftJoinAndSelect('export.detail_export', 'detail_export')
        .leftJoinAndSelect('detail_export.skus', 'skus')
        .leftJoinAndSelect('skus.product', 'product')
        .leftJoinAndSelect('detail_export.detail_import', 'detail_import')
        .leftJoinAndSelect('detail_export.wareHouse', 'warehouses');

      if (filters.search) {
        queryBuilder.andWhere(
          '(export.note ILIKE :search OR export.id::text ILIKE :search)',
          {
            search: `%${filters.search}%`,
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
          'export.createdAt BETWEEN :start_date AND :end_date',
          {
            start_date: from,
            end_date: to,
          },
        );
      }

      if (filters.warehouse_id) {
        queryBuilder.andWhere('warehouses.id = :warehouse_id', {
          warehouse_id: filters.warehouse_id,
        });
      }

      if (filters.product_id) {
        queryBuilder.andWhere('product.id = :product_id', {
          product_id: filters.product_id,
        });
      }

      if (filters.skus_id) {
        queryBuilder.andWhere('skus.id = :skus_id', {
          skus_id: filters.skus_id,
        });
      }

      const [data, total] = await queryBuilder
        .orderBy('export.updatedAt', 'DESC')
        .skip(skip)
        .take(take)
        .select([
          'export',
          'detail_export',
          'skus',
          'product',
          'warehouses',
          'detail_import',
        ])
        .getManyAndCount();

      const totalPage = Math.ceil(total / pageSize);
      return {
        status: 200,
        message: 'Lấy danh sách phiếu xuất thành công',
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
    const exportbyId = await this.exportRepo.findOne({
      where: { id: id },
      relations: ['user', 'detail_export', 'detail_export.detail_import'],
    });
    if (!exportbyId) {
      throw new NotFoundException(`Không tìm thấy export với ID: ${id}`);
    }
    return exportbyId;
  }

  async remove(id: string) {
    try {
      const exportRecord = await this.exportRepo.findOne({
        where: { id: id },
      });
      if (!exportRecord) {
        throw new NotFoundException(`Không tìm thấy phiếu xuất với ID: ${id}`);
      }
      await this.exportRepo.remove(exportRecord);
      return {
        status: 200,
        message: 'Xóa phiếu xuất thành công',
      };
    } catch (e) {
      throw e;
    }
  }
  // tạo phiếu xuất đơn hàng
  async createExportOrder(
    createExportDto: CreateExportOrderDto,
    user: any,
    baseManager?: EntityManager,
  ) {
    const managerRepo = baseManager || this.exportRepo.manager;
    try {
      if (!baseManager) {
        return await managerRepo.transaction(async (manager) => {
          return await this.executeExportOrder(createExportDto, user, manager);
        });
      } else {
        return await this.executeExportOrder(
          createExportDto,
          user,
          managerRepo,
        );
      }
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const contraintName = e.driverError.constraint;
        if (contraintName === 'export_order') {
          throw new BadRequestException('Đơn hàng đã được xuất kho');
        }
      }
      throw e;
    }
  }

  async executeExportOrder(
    createExportDto: CreateExportOrderDto,
    user: UserValidationType,
    manager: EntityManager,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Bạn chưa đăng nhập hoặc không có quyền truy cập',
      );
    }

    if (
      user.role !== RoleEnum.ADMIN &&
      user.role !== RoleEnum.WAREHOUSE_MANAGER
    ) {
      throw new UnauthorizedException(
        'Bạn không có quyền thực hiện thao tác này',
      );
    }
    const { note, detail_export, order_id } = createExportDto;
    const order = await manager.findOne(Order, {
      where: { id: order_id },
      relations: [
        'orderDetails',
        'orderDetails.skus',
        'orderDetails.skus.detail_import',
      ],
    });
    if (!order)
      throw new BadRequestException(
        'Không tìm thấy đơn hàng với ID: ' + order_id,
      );

    if (order.order_status !== order_status.CONFIRMED) {
      throw new BadRequestException(
        'Đơn hàng chưa được xác nhận, không thể xuất kho',
      );
    }

    // Tạo Map để tra cứu số lượng yêu cầu từ orderDetails theo skus_id
    const orderDetailQuantityMap = new Map<string, number>();
    order.orderDetails.forEach((orderDetail) => {
      orderDetailQuantityMap.set(orderDetail.skus.id, orderDetail.quantity);
    });

    // Tạo Map để tra cứu tổng số lượng xuất kho từ detail export theo skus_id
    const exportQuantityMap = new Map<string, number>();
    detail_export.forEach((detail) => {
      const quantity = exportQuantityMap.get(detail.skus_id) || 0;
      exportQuantityMap.set(detail.skus_id, quantity + detail.quantity_export);
    });

    // Kiểm tra số lượng xuất kho có khớp với số lượng yêu cầu từ orderDetails không
    for (const [skus_id, exportQty] of exportQuantityMap) {
      const orderQuantity = orderDetailQuantityMap.get(skus_id);
      if (!orderQuantity) {
        throw new BadRequestException(
          `SKU #${skus_id} không tồn tại trong đơn hàng`,
        );
      }
      if (exportQty !== orderQuantity) {
        throw new BadRequestException(
          `Số lượng xuất (${exportQty}) cho SKU ${skus_id} không khớp với số lượng yêu cầu (${orderQuantity}) trong đơn hàng`,
        );
      }
    }

    // Kiểm tra chi tiết nhập kho
    const detail_import_ids = [
      ...new Set(detail_export.map((d) => d.detail_import_id)),
    ];

    if (detail_import_ids.length !== detail_export.length) {
      throw new BadRequestException(`Chi tiết nhập kho không được trùng lặp`);
    }
    const ware_house_ids = detail_export.map((d) => d.warehouse_id);
    const skus_ids = detail_export.map((detail) => detail.skus_id);

    // Lấy ra các chi tiết nhập kho hợp lệ
    const detail_imports = await manager.find(DetailImport, {
      where: {
        id: In(detail_import_ids),
        skus: { id: In(skus_ids) },
        warehouse: { id: In(ware_house_ids) },
      },
      relations: ['skus', 'warehouse'],
    });
    const detail_import_Map = new Map(detail_imports.map((d) => [d.id, d]));

    // Kiểm tra chi tiết nhập kho có hợp lệ không
    detail_export.forEach((detail) => {
      const detail_import = detail_import_Map.get(detail.detail_import_id);
      if (
        !detail_import ||
        detail_import.id !== detail.detail_import_id ||
        detail_import.skus.id !== detail.skus_id ||
        detail_import.warehouse.id !== detail.warehouse_id
      ) {
        throw new BadRequestException(
          `Không tìm thấy chi tiết nhập kho với ID #${detail.detail_import_id} hoặc không khớp với SKU #${detail.skus_id} hoặc kho #${detail.warehouse_id}`,
        );
      }

      const remainingQty = detail_import.quantity_remaining;
      const exportQty = detail.quantity_export;
      if (remainingQty < exportQty) {
        throw new BadRequestException(
          `Số lượng xuất kho ${exportQty} vượt quá số lượng tồn kho ${remainingQty}`,
        );
      }

      detail_import.quantity_remaining -= exportQty;
    });

    // Lưu phiếu xuất
    const saveExport = await manager.save(
      manager.create(Export, {
        note,
        // user: user,
        order: order,
      }),
    );

    // Lưu chi tiết xuất kho
    for (const detail of detail_export) {
      const newDetail = manager.create(DetailExport, {
        quantity_export: detail.quantity_export,
        skus: { id: detail.skus_id },
        wareHouse: { id: detail.warehouse_id },
        detail_import: { id: detail.detail_import_id },
        export: saveExport,
      });

      await manager.save(newDetail);
    }

    // Cập nhật quantity_remaining trong DetailImport
    await Promise.all(
      detail_export.map((detail) =>
        manager.update(
          DetailImport,
          { id: detail.detail_import_id },
          {
            quantity_remaining: detail_import_Map.get(detail.detail_import_id)
              .quantity_remaining,
          },
        ),
      ),
    );

    order.order_status = order_status.EXPORTED;
    await manager.save(order);

    return {
      status: 200,
      message: 'Tạo phiếu xuất thành công',
      data: saveExport,
    };
  }

  async createManyExport(
    createExportDto: CreateMultipleExportDto,
    user: UserValidationType,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Bạn chưa đăng nhập hoặc không có quyền truy cập',
      );
    }

    if (
      user.role !== RoleEnum.ADMIN &&
      user.role !== RoleEnum.WAREHOUSE_MANAGER
    ) {
      throw new UnauthorizedException(
        'Bạn không có quyền thực hiện thao tác này',
      );
    }
    const { note, detail_export } = createExportDto;

    try {
      return await this.exportRepo.manager.transaction(async (manager) => {
        // 1. Lấy danh sách order_id duy nhất và kiểm tra đơn hàng
        const orderIds = [
          ...new Set(detail_export.map((detail) => detail.order_id)),
        ];
        const orders = await manager.find(Order, {
          where: { id: In(orderIds), order_status: order_status.CONFIRMED },
          relations: ['orderDetails', 'orderDetails.skus'],
        });

        if (orders.length !== orderIds.length) {
          const missingOrders = orderIds.filter(
            (id) => !orders.some((order) => order.id === id),
          );
          throw new BadRequestException(
            `Không tìm thấy hoặc đơn hàng ${missingOrders.join(', ')} chưa được xác nhận`,
          );
        }

        // 2. Tạo Map cho orderDetails để tra cứu nhanh
        const orderDetailMap = new Map<string, Map<string, number>>();
        for (const order of orders) {
          const skuQuantityMap = new Map<string, number>();
          order.orderDetails.forEach((detail) => {
            skuQuantityMap.set(detail.skus.id, detail.quantity);
          });
          orderDetailMap.set(order.id, skuQuantityMap);
        }

        // 3. Tính tổng số lượng xuất kho theo order_id và skus_id
        const exportQuantityMap = new Map<string, number>();
        detail_export.forEach((detail) => {
          const key = `${detail.order_id}_${detail.skus_id}`;
          exportQuantityMap.set(
            key,
            (exportQuantityMap.get(key) || 0) + detail.quantity_export,
          );
        });

        // 4. Kiểm tra số lượng xuất kho so với yêu cầu
        for (const [key, exportQty] of exportQuantityMap) {
          const [orderId, skusId] = key.split('_');
          const skuQuantityMap = orderDetailMap.get(orderId);
          const orderQty = skuQuantityMap?.get(skusId) || 0;
          if (!orderQty) {
            throw new BadRequestException(
              `SKU #${skusId} không tồn tại trong đơn hàng ${orderId}`,
            );
          }
          if (exportQty !== orderQty) {
            throw new BadRequestException(
              `Số lượng xuất (${exportQty}) cho SKU ${skusId} không khớp với yêu cầu (${orderQty}) trong đơn hàng ${orderId}`,
            );
          }
        }

        // 5. Kiểm tra chi tiết nhập kho
        const detailImportIds = [
          ...new Set(detail_export.map((d) => d.detail_import_id)),
        ];

        const detailImports = await manager.find(DetailImport, {
          where: { id: In(detailImportIds) },
          relations: ['skus', 'warehouse'],
          select: ['id', 'quantity_remaining', 'skus', 'warehouse'],
        });

        const detailImportMap = new Map(
          detailImports.map((d) => [
            d.id,
            {
              quantity_remaining: d.quantity_remaining,
              skus_id: d.skus.id,
              warehouse_id: d.warehouse.id,
            },
          ]),
        );

        // 6. Kiểm tra tính hợp lệ và cập nhật quantity_remaining
        const detailExportEntities = detail_export.map((detail) => {
          const detailImport = detailImportMap.get(detail.detail_import_id);
          if (
            !detailImport ||
            detailImport.skus_id !== detail.skus_id ||
            detailImport.warehouse_id !== detail.warehouse_id
          ) {
            throw new BadRequestException(
              `Chi tiết nhập kho #${detail.detail_import_id} không khớp với SKU #${detail.skus_id} hoặc kho #${detail.warehouse_id}`,
            );
          }

          if (detailImport.quantity_remaining < detail.quantity_export) {
            throw new BadRequestException(
              `Số lượng xuất kho ${detail.quantity_export} vượt quá tồn kho ${detailImport.quantity_remaining} cho chi tiết nhập kho #${detail.detail_import_id}`,
            );
          }

          detailImport.quantity_remaining -= detail.quantity_export;

          return {
            quantity_export: detail.quantity_export,
            skus: { id: detail.skus_id },
            wareHouse: { id: detail.warehouse_id },
            detail_import: { id: detail.detail_import_id },
          };
        });

        // 7. Tạo các phiếu xuất
        const saveExportMap = new Map<string, Export>();
        for (const order of orders) {
          if (order.order_status !== order_status.CONFIRMED) {
            throw new BadRequestException(
              `Chỉ có thể xuất kho cho đơn hàng đã xác nhận`,
            );
          }
          const exportEntity = manager.create(Export, {
            note,
            order: { id: order.id },
            // user: { id: user.id },
          });

          const savedExport = await manager.save(exportEntity);
          saveExportMap.set(savedExport.id, savedExport);

          // Gán export_id cho các chi tiết xuất kho liên quan
          const relatedDetails = detailExportEntities
            .filter(
              (detail, index) => detail_export[index].order_id === order.id,
            )
            .map((detail) => ({
              ...detail,
              export: { id: savedExport.id },
            }));

          await manager.insert(DetailExport, relatedDetails);
        }

        // 8. Cập nhật quantity_remaining trong DetailImport
        const updatePromises = Array.from(detailImportMap.entries()).map(
          ([id, { quantity_remaining }]) =>
            manager.update(DetailImport, { id }, { quantity_remaining }),
        );
        await Promise.all(updatePromises);

        const exportedOrder = orders.map((order) => ({
          ...order,
          order_status: order_status.EXPORTED,
        }));
        await manager.save(Order, exportedOrder);

        // 9. Trả về kết quả
        return {
          status: 200,
          message: 'Tạo phiếu xuất hàng thành công',
          data: Array.from(saveExportMap.values()),
        };
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        const contraintName = error.driverError.constraint;
        if (contraintName === 'export_order') {
          throw new BadRequestException('Đơn hàng đã được xuất kho');
        }
      }
      throw error;
    }
  }

  // async UpdateExport(id: string, detail_Export: UpdateExportDto, user) {
  //   try {
  //     const { note, export_details } = detail_Export;
  //     return await this.exportRepo.manager.transaction(
  //       async (manager: EntityManager) => {
  //         const exisingExport = await manager.findOne(Export, {
  //           where: { id: id },
  //           relations: ['detail_export', 'detail_export.detail_import'],
  //         });
  //         if (!exisingExport) {
  //           throw new NotFoundException(
  //             `Không tìm thấy phiếu xuất với ID: ${id}`,
  //           );
  //         }

  //         const detail_import_ids = detail_Export.export_details.map(
  //           (item) => item.detail_import_id,
  //         );

  //         const detail_imports = await manager.find(DetailImport, {
  //           where: { id: In(detail_import_ids) },
  //           relations: ['skus', 'warehouse'],
  //         });

  //         if (detail_imports.length !== detail_Export.export_details.length) {
  //           const missingDetailImportIds = detail_import_ids.filter(
  //             (id) => !detail_imports.some((detail) => detail.id === id),
  //           );
  //           const missingDetailImportsLotName = detail_imports
  //             .filter((id) => missingDetailImportIds.includes(id.id))
  //             .map((detail) => detail.lot_name);
  //           throw new NotFoundException(
  //             `Không tìm thấy Lô hàng: ${missingDetailImportsLotName.join(',')}`,
  //           );
  //         }

  //         const detail_import_map = new Map(
  //           detail_imports.map((detail) => [detail.id, detail]),
  //         );

  //         const existingDetailExports = exisingExport.detail_export;

  //         const existingDetailExportMap = new Map(
  //           existingDetailExports.map((detail) => [detail.id, detail]),
  //         );

  //         const detailExportToDelete = existingDetailExports.filter(
  //           (detail) =>
  //             !export_details.some(
  //               (newDetail) => newDetail.detail_export_id === detail.id,
  //             ),
  //         );

  //         if (detailExportToDelete.length > 0) {
  //           await manager.remove(DetailExport, detailExportToDelete);
  //         }
  //         const updatedExport = manager.create(Export, {
  //           ...exisingExport,
  //           note: note ? note : exisingExport.note,
  //           // user: user,
  //         });
  //         const savedExport = await manager.save(updatedExport);
  //         const updateDetailExports = export_details.map((detail) => {
  //           const existingDetailExport = existingDetailExportMap.get(
  //             detail.detail_export_id,
  //           );
  //           const detailImport = detail_import_map.get(detail.detail_import_id);
  //           if (
  //             !detailImport ||
  //             detailImport.skus.id !== existingDetailExport.skus.id ||
  //             detailImport.warehouse.id !== existingDetailExport.wareHouse.id
  //           ) {
  //             throw new BadRequestException(
  //               `Chi tiết nhập kho không hợp lệ cho SKU #${existingDetailExport.skus.id} và kho #${existingDetailExport.wareHouse.id}`,
  //             );
  //           }
  //           if (existingDetailExport) {
  //             return {
  //               ...existingDetailExport,
  //               quantity_export: detail.quantity_export,
  //             };
  //           } else {
  //             return manager.create(DetailExport, {
  //               quantity_export: detail.quantity_export,
  //               skus: { id: detailImport.skus.id },
  //               wareHouse: { id: detailImport.warehouse.id },
  //               detail_import: { id: detailImport.id },
  //               export: savedExport,
  //             });
  //           }
  //         });
  //         await manager.save(DetailExport, updateDetailExports);

  //         const exportAfterUpdate = await manager.findOne(Export, {
  //           where: { id: id },
  //           relations: ['detail_export', 'detail_export.detail_import'],
  //         });
  //         const exportDetails = exportAfterUpdate.detail_export;
  //         const totalQuantityExport = exportDetails.reduce(
  //           (total, detail) => total + detail.quantity_export,
  //           0,
  //         );
  //         const updateDetailImportsQuantity = export_details.map((detail) => {
  //           const detailImport = detail_import_map.get(detail.detail_import_id);
  //           if (detailImport) {
  //             detailImport.quantity_remaining =
  //               detailImport.quantity_import - totalQuantityExport;
  //           }
  //           return detailImport;
  //         });
  //         await manager.save(DetailImport, updateDetailImportsQuantity);
  //         return {
  //           status: 200,
  //           message: 'Cập nhật phiếu xuất thành công',
  //           data: exportAfterUpdate,
  //         };
  //       },
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async UpdateExport(id: string, detail_Export: UpdateExportDto, user: any) {
    const { note, export_details } = detail_Export;

    try {
      return await this.exportRepo.manager.transaction(
        async (manager: EntityManager) => {
          // 1. Tìm phiếu xuất
          const existingExport = await manager.findOne(Export, {
            where: { id },
            relations: [
              'detail_export',
              'detail_export.skus',
              'detail_export.wareHouse',
              'detail_export.detail_import',
            ],
          });
          if (!existingExport) {
            throw new NotFoundException(
              `Không tìm thấy phiếu xuất với ID: ${id}`,
            );
          }

          // 2. Kiểm tra chi tiết nhập kho
          const detailImportIds = [
            ...new Set(export_details.map((item) => item.detail_import_id)),
          ];
          const detailImports = await manager.find(DetailImport, {
            where: { id: In(detailImportIds) },
            relations: ['skus', 'warehouse'],
            select: [
              'id',
              'quantity_remaining',
              'quantity_import',
              'skus',
              'warehouse',
            ],
          });

          if (detailImports.length !== detailImportIds.length) {
            const missingIds = detailImportIds.filter(
              (id) => !detailImports.some((detail) => detail.id === id),
            );
            throw new NotFoundException(
              `Không tìm thấy chi tiết nhập kho với ID: ${missingIds.join(', ')}`,
            );
          }

          const detailImportMap = new Map(
            detailImports.map((detail) => [
              detail.id,
              {
                quantity_remaining: detail.quantity_remaining,
                quantity_import: detail.quantity_import, // Thêm quantity_import
                skus_id: detail.skus.id,
                warehouse_id: detail.warehouse.id,
              },
            ]),
          );

          // 3. Tạo Map cho DetailExport hiện có
          const existingDetailExportMap = new Map(
            existingExport.detail_export.map((detail) => [
              detail.id,
              {
                id: detail.id,
                quantity_export: detail.quantity_export,
                detail_import_id: detail.detail_import.id,
              },
            ]),
          );

          // 4. Xử lý xóa DetailExport không còn trong DTO
          const detailExportToDelete = existingExport.detail_export.filter(
            (detail) =>
              !export_details.some(
                (newDetail) => newDetail.detail_export_id === detail.id,
              ),
          );
          for (const detail of detailExportToDelete) {
            const detailImport = detailImportMap.get(detail.detail_import.id);
            if (detailImport) {
              detailImport.quantity_remaining += detail.quantity_export; // Hoàn lại số lượng tồn kho
            }
          }

          // 5. Kiểm tra và chuẩn bị cập nhật/tạo DetailExport
          const updateDetailExports = export_details.map((detail) => {
            const existingDetailExport = existingDetailExportMap.get(
              detail.detail_export_id,
            );
            const detailImport = detailImportMap.get(detail.detail_import_id);

            if (!detailImport) {
              throw new BadRequestException(
                `Chi tiết nhập kho #${detail.detail_import_id} không tồn tại`,
              );
            }

            const quantityDelta = existingDetailExport
              ? detail.quantity_export - existingDetailExport.quantity_export
              : detail.quantity_export;

            if (detailImport.quantity_remaining < quantityDelta) {
              throw new BadRequestException(
                `Số lượng xuất kho ${detail.quantity_export} vượt quá tồn kho ${detailImport.quantity_remaining} cho chi tiết nhập kho #${detail.detail_import_id}`,
              );
            }

            detailImport.quantity_remaining -= quantityDelta;

            if (existingDetailExport) {
              return {
                ...existingDetailExport,
                quantity_export: detail.quantity_export,
                detail_import: { id: detail.detail_import_id },
              };
            } else {
              return manager.create(DetailExport, {
                quantity_export: detail.quantity_export,
                skus: { id: detailImport.skus_id },
                wareHouse: { id: detailImport.warehouse_id },
                detail_import: { id: detail.detail_import_id },
                export: { id },
              });
            }
          });

          // 6. Cập nhật Export
          const updatedExport = manager.create(Export, {
            ...existingExport,
            note: note ?? existingExport.note,
            // user: { id: user.id },
          });
          await manager.save(updatedExport);

          // 7. Xóa DetailExport không cần thiết
          if (detailExportToDelete.length > 0) {
            await manager.remove(DetailExport, detailExportToDelete);
          }

          // 8. Lưu DetailExport
          await manager.save(DetailExport, updateDetailExports);

          // 9. Cập nhật quantity_remaining trong DetailImport
          const updateDetailImports = Array.from(detailImportMap.entries())
            .filter(
              ([_, detail]) =>
                detail.quantity_remaining !== detail.quantity_import,
            )
            .map(([id, detail]) => ({
              id,
              quantity_remaining: detail.quantity_remaining,
            }));
          await manager.update(
            DetailImport,
            { id: In(updateDetailImports.map((d) => d.id)) },
            { quantity_remaining: () => 'quantity_remaining' },
          );

          // 10. Trả về kết quả
          return {
            status: 200,
            message: 'Cập nhật phiếu xuất thành công',
            data: {
              ...updatedExport,
              detail_export: updateDetailExports.map((detail) => {
                const detailImport = detailImportMap.get(
                  detail.detail_import.id,
                );
                return {
                  id: detail.id,
                  quantity_export: detail.quantity_export,
                  skus: { id: detailImport.skus_id },
                  wareHouse: { id: detailImport.warehouse_id },
                  detail_import: detail.detail_import,
                };
              }),
            },
          };
        },
      );
    } catch (e) {
      throw e;
    }
  }
}
