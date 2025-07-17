import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { In, IsNull, Repository, QueryFailedError } from 'typeorm';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { extractPublicId } from 'cloudinary-build-url';
import { Warehouse } from '../warehouse/entities/warehouse.entity';

import { Skus } from '../skus/entities/skus.entity';
import { OptionValue } from '../option_value/entities/option_value.entity';
import { DetailImport } from '../detail_import/entities/detail_import.entity';
import { Option } from '../option/entities/option.entity';
import { Import } from '../import/entities/import.entity';
import { CreateProductVariantDto } from './dto/create-product-variants.dto';
import { EnumProductSortBy, ProductQuery } from './dto/FindProductDto.dto';
import { Specification } from '../specification/entities/specification.entity';
import {
  CreateSkusDto,
  VariantCombinationDto,
} from '../skus/dto/create-skus.dto';
import { UpdateProdutVariantDto } from './dto/update-product-variants.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ProductType } from 'src/constants';

export type OptionValueUserPageResponseType = {
  name: string;
  values: [value: string, option_value_ids: string[]][];
};

export type ProductUserPageResponseType = {
  id: string;
  title: string;
  description: string;
  images: string[];
  type: ProductType;
  brand: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  specifications: Specification[];
  optionValues?: OptionValueUserPageResponseType[];
  totalStock?: number;
  totalSold?: number;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(OptionValue)
    private optionValueRepository: Repository<OptionValue>,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
  ) {}

  async findAllBySearch(query: ProductQuery) {
    try {
      const {
        categoryID,
        current = 1,
        pageSize = 10,
        brandID,
        price_min,
        price_max,
        search,
        type,
        status,
        sort_by = EnumProductSortBy.UPDATED_AT_DESC,
      } = query;
      let allCategoryIds: string[] | undefined;
      if (categoryID) {
        const categories = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.children', 'children')
          .leftJoinAndSelect('children.children', 'grandchildren')
          .where('category.id = :categoryID', {
            categoryID: `${categoryID}`,
          })
          .getOne();
        if (!categories)
          throw new NotFoundException(`Không tìm thấy danh mục #${categoryID}`);
        allCategoryIds = [
          ...new Set([
            categories.id,
            ...categories.children.map((child) => child.id),
            ...categories.children.flatMap((child) =>
              child.children.map((gc) => gc.id),
            ),
          ]),
        ];
      }
      const skip = (current - 1) * pageSize;

      const queryBuilder = this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.skus', 'skus')
        .leftJoinAndSelect('skus.detail_import', 'detail_import')
        .leftJoinAndSelect('detail_import.warehouse', 'warehouse')
        .leftJoinAndSelect('skus.optionValue', 'optionValue')
        .leftJoinAndSelect('optionValue.option', 'option')
        .leftJoinAndSelect('product.specifications', 'specifications')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.category', 'category')
        .take(pageSize)
        .skip(skip)
        .withDeleted();

      // Điều kiện tìm kiếm theo tên
      if (search?.trim()) {
        queryBuilder.andWhere('product.title ILIKE :search', {
          search: `%${search.trim()}%`,
        });
      }

      // Điều kiện lọc giá dựa trên skus.price_sold
      if (price_min && price_max) {
        queryBuilder.andWhere(
          'skus.price_sold BETWEEN :price_min AND :price_max',
          {
            price_min,
            price_max,
          },
        );
      } else if (price_min && !price_max) {
        queryBuilder.andWhere('skus.price_sold >= :price_min', { price_min });
      } else if (!price_min && price_max) {
        queryBuilder.andWhere('skus.price_sold <= :price_max', { price_max });
      }

      // Điều kiện lọc theo danh mục
      if (categoryID && allCategoryIds && allCategoryIds.length > 0) {
        queryBuilder.andWhere('product.category_id IN (:...allCategoryIds)', {
          allCategoryIds,
        });
      }

      // Lọc theo thương hiệu
      if (brandID) {
        queryBuilder.andWhere('product.brand_id = :brandID', { brandID });
      }

      // Lọc theo type
      if (type) {
        queryBuilder.andWhere('product.type = :type', { type });
      }

      // Lọc theo trạng thái (status)
      if (status !== undefined) {
        queryBuilder.andWhere(
          status
            ? 'product.deletedAt IS NOT NULL'
            : 'product.deletedAt IS NULL',
        );
      }

      if (sort_by) {
        switch (sort_by) {
          case EnumProductSortBy.CREATED_AT_DESC:
            queryBuilder.orderBy('product.createdAt', 'DESC');
            break;
          case EnumProductSortBy.UPDATED_AT_DESC:
            queryBuilder.orderBy('product.updatedAt', 'DESC');
            break;
          case EnumProductSortBy.BEST_SELLING:
            // Sắp xếp theo tổng số lượng đã bán
            queryBuilder
              .addSelect(
                `(SELECT SUM(di.quantity_sold)
                      FROM detail_import di
                      JOIN skus s ON di.skus_id = s.id
                      WHERE s.product_id = product.id)`,
                'total_sold',
              )
              .orderBy('total_sold', 'DESC');
            break;
          case EnumProductSortBy.PRICE_ASC:
            queryBuilder.orderBy('skus.price_sold', 'ASC');
            break;
          case EnumProductSortBy.PRICE_DESC:
            queryBuilder.orderBy('skus.price_sold', 'DESC');
            break;
        }
      }

      const [products, total] = await queryBuilder.getManyAndCount();

      let resultData = [];

      await Promise.all(
        products.map(async (p) => {
          const product_id = p.id;
          const { totalStock, totalSKU } = (
            await this.getProductStockByID(product_id)
          ).data;
          resultData.push({
            products: p,
            totalStock,
            totalSKU,
          });
        }),
      );

      const totalPages = Math.ceil(total / pageSize);
      return {
        pagination: {
          currentPage: current,
          pageSize: pageSize,
          totalProducts: total,
          totalPages: totalPages || 0,
        },
        data: resultData,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductStockByID(id: string) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['skus', 'skus.detail_import'],
        withDeleted: true,
      });

      if (!product) {
        throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
      }

      const totalSKU = product.skus.length || 0;
      const totalStock = product.skus.reduce((sum, sku) => {
        const skuStock = sku.detail_import.reduce(
          (sum, current) => sum + current.quantity_remaining,
          0,
        );
        return sum + skuStock;
      }, 0);
      return {
        status: 200,
        message: 'Lấy thông tin tồn kho thành công',
        data: {
          totalStock,
          totalSKU,
        },
      };
    } catch (e) {
      throw e;
    }
  }
  async remove(id: string) {
    try {
      // Tìm sản phẩm theo ID
      await this.productsRepository.manager.transaction(async (manager) => {
        const product = await manager.findOne(Products, {
          where: { id },
          withDeleted: true,
          relations: [
            'skus',
            'skus.detail_import',
            'skus.detail_import.import',
          ],
        });

        // Kiểm tra nếu sản phẩm không tồn tại
        if (!product) {
          throw new NotFoundException(`Product with ID "${id}" not found.`);
        }

        // Xóa ảnh trên Cloudinary
        if (product.images && product.images.length > 0) {
          for (const element of product.images) {
            if (element) {
              try {
                await this.cloudinaryService.removeFile(
                  extractPublicId(element),
                );
              } catch (cloudError: any) {
                console.error(`Error removing file on Cloudinary}`, cloudError);
                // Có thể ném lỗi nếu cần thiết hoặc tiếp tục xử lý
                throw new Error(
                  'Có lỗi xảy ra khi xóa ảnh sản phẩm trên Cloudinary: ' +
                    cloudError?.message || 'Unknown error',
                );
              }
            }
          }
        }
        // Xóa sản phẩm
        await manager.remove(product);

        // Xóa các import nếu ko còn detail_import nào liên kết
        const importIdsToDelete = new Set<string>();
        product.skus.forEach((sku) => {
          sku.detail_import.forEach((detail) => {
            if (detail.import && detail.import.id) {
              importIdsToDelete.add(detail.import.id);
            }
          });
        });
        if (importIdsToDelete.size > 0) {
          const imports = await manager.find(Import, {
            where: { id: In(Array.from(importIdsToDelete)) },
          });
          for (const imp of imports) {
            const details = await manager.find(DetailImport, {
              where: { import: { id: imp.id } },
            });
            if (details.length === 0) {
              await manager.remove(imp);
            }
          }
        }
      });

      return {
        status: 200,
        message: 'Xóa sản phẩm thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async calculateStock(product) {
    let totalStock = 0; // Tổng tồn kho của toàn bộ sản phẩm

    const skusWithStock = product.skus.map((sku) => {
      let skuStock = sku.detail_import.reduce((sum, detail) => {
        return sum + (detail.quantity_import - detail.quantity_sold);
      }, 0);

      totalStock += skuStock; // Cộng dồn vào tổng sản phẩm

      return {
        ...sku,
        total_stock: skuStock, // Thêm số lượng tồn vào từng sku
      };
    });

    return {
      ...product,
      skus: skusWithStock, // Gán lại danh sách skus có tồn kho
      total_stock: totalStock, // Tổng tồn kho của toàn bộ sản phẩm
    };
  }
  // lấy ra option value

  //// Tìm sản phẩm theo ID
  async findOne(id: string) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: [
          'skus',
          'skus.detail_import',
          'skus.detail_import.warehouse',
          'skus.optionValue',
          'skus.optionValue.option',
          'specifications',
          'brand',
          'category',
        ],
        withDeleted: true,
      });
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found.`);
      }

      const totalSold = product.skus.reduce((sum, sku) => {
        return (
          sum +
          sku.detail_import.reduce(
            (detailSum, detail) => detailSum + detail.quantity_sold,
            0,
          )
        );
      }, 0);
      const totalStock = product.skus.reduce((sum, sku) => {
        return (
          sum +
          sku.detail_import.reduce(
            (detailSum, detail) => detailSum + detail.quantity_remaining,
            0,
          )
        );
      }, 0);

      const result = {
        ...product,
        totalSold,
        totalStock,
      };

      return {
        status: 200,
        message: 'Lấy thông tin sản phẩm thành công',
        data: result,
      };
    } catch (e) {
      throw e;
    }
  }

  async createProductVariant(
    dataProductVariant: CreateProductVariantDto,
    user,
  ) {
    const { skus, brand_id, category_id, specifications, ...productData } =
      dataProductVariant;

    // Tìm kiếm danh mục
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Tìm kiếm thương hiệu
    const brand = await this.brandRepository.findOne({
      where: { id: brand_id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    try {
      return await this.productsRepository.manager.transaction(
        async (manager) => {
          // Tạo sản phẩm trước để có product_id
          const newProduct = manager.create(Products, {
            ...productData,
            category,
            brand,
          });
          const saveProduct = await manager.save(newProduct);

          // Kiểm tra và tạo thông số kỹ thuật (nếu có)
          let savespecifications = [];
          if (specifications && specifications.length > 0) {
            // Kiểm tra trùng lặp name và value trong specifications
            const duplicateSpec = Object.entries(
              specifications?.reduce(
                (acc, spec) => {
                  const key = `${spec.name}:${spec.value}`;
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            )
              ?.filter(([_, count]) => count > 1)
              ?.map(([key]) => key.split(':')[0]); // Lấy tên thông số bị trùng lặp

            if (duplicateSpec.length > 0) {
              throw new ConflictException(
                `Thông số ${duplicateSpec.join(', ')} đã bị trùng lặp`,
              );
            }

            // Tạo và lưu specifications
            const newSpecifications = specifications.map((spec) =>
              manager.create(Specification, {
                ...spec,
                product: saveProduct,
              }),
            );
            savespecifications = await manager.save(newSpecifications);

            // Cập nhật sản phẩm với specifications
            saveProduct.specifications = savespecifications;
            await manager.save(saveProduct);
          }

          // Chuẩn hóa skus: Tạo biến thể mặc định nếu skus rỗng hoặc không được cung cấp
          const effectiveSkus =
            skus && skus.length > 0
              ? skus
              : [
                  {
                    masku: '',
                    barcode: '',
                    name: 'Sản phẩm mặc định',
                    image: '',
                    price_sold: 0,
                    price_compare: 0,
                    detail_import: [],
                    variant_combinations: [],
                  } as CreateSkusDto,
                ];

          // Kiểm tra trùng lặp masku và barcode
          const maskus = skus.map((item) => item.masku).filter(Boolean);
          const barcodes = skus.map((item) => item.barcode).filter(Boolean);
          const existingSkus = await manager.find(Skus, {
            where: [{ masku: In(maskus) }, { barcode: In(barcodes) }],
          });

          const existingMasku = new Set(existingSkus.map((item) => item.masku));
          const existingBarcode = new Set(
            existingSkus.map((item) => item.barcode),
          );
          const duplicateMasku = skus.filter(
            (item) => item.masku && existingMasku.has(item.masku),
          );
          const duplicateBarcode = skus.filter(
            (item) => item.barcode && existingBarcode.has(item.barcode),
          );

          if (duplicateMasku.length > 0) {
            throw new ConflictException(
              `Mã SKU ${duplicateMasku.map((item) => item.masku).join(', ')} đã tồn tại`,
            );
          }
          if (duplicateBarcode.length > 0) {
            throw new ConflictException(
              `Barcode ${duplicateBarcode.map((item) => item.barcode).join(', ')} đã tồn tại`,
            );
          }

          // Tạo Skus, VariantValue và DetailImport
          const skusImage = [];
          for (const item of effectiveSkus) {
            const skus_name =
              item.variant_combinations?.reduce((acc, cur) => {
                const optionValue = cur.value || '';
                return acc ? `${acc} / ${optionValue}` : optionValue;
              }, '') || 'Mặc định';
            const newSku = manager.create(Skus, {
              masku: item.masku || '',
              barcode: item.barcode || '',
              image: item.image || '',
              name: skus_name,
              price_sold: item.price_sold || 0,
              price_compare: item.price_compare || 0,
              product: saveProduct,
            });
            const saveNewSKU = await manager.save(newSku);
            skusImage.push(saveNewSKU.image);
            // Tạo OptionValue (nếu có)
            if (item.variant_combinations?.length) {
              const validVariants = item.variant_combinations.filter(
                (variant) => variant !== null && variant !== undefined,
              );
              // Lọc trùng
              const uniqueMap = new Map<string, VariantCombinationDto>();
              for (const variant of validVariants) {
                const key = `${variant.option_id}:${variant.value}`;
                if (!uniqueMap.has(key)) {
                  uniqueMap.set(key, variant);
                }
              }
              const uniqueVariants = Array.from(uniqueMap.values());
              const optionIds = uniqueVariants.map(
                (variant) => variant.option_id,
              );
              const options = await manager.find(Option, {
                where: { id: In(optionIds) },
              });
              const optionsMap = new Map(options.map((o) => [o.id, o]));
              const notFoundOptions = optionIds.filter(
                (id) => !optionsMap.has(id),
              );
              if (notFoundOptions.length > 0) {
                throw new NotFoundException(
                  `Không tìm thấy Option với ID: ${notFoundOptions.join(', ')}`,
                );
              }
              if (uniqueVariants.length > 0) {
                const OptionValues = uniqueVariants.map((variant) =>
                  manager.create(OptionValue, {
                    option: optionsMap.get(variant.option_id),
                    value: variant.value,
                    skus: saveNewSKU,
                  }),
                );
                await manager.save(OptionValues);
              }
            }

            // Tạo DetailImport
            const warehouseIds = item.detail_import.map((i) => i.warehouse_id);
            const warehouses = await manager.find(Warehouse, {
              where: { id: In(warehouseIds) },
            });
            const warehousesMap = new Map(warehouses.map((w) => [w.id, w]));
            const notFoundWarehouses = warehouseIds.filter(
              (id) => !warehousesMap.has(id),
            );

            if (notFoundWarehouses.length > 0) {
              throw new NotFoundException(
                `Không tìm thấy Warehouse với ID: ${notFoundWarehouses.join(', ')}`,
              );
            }

            // Tạo bản ghi nhập hàng
            const createImport = manager.create(Import, {
              note: 'Nhập hàng khi tạo sản phẩm',
              // user,
            });
            const saveImport = await manager.save(createImport);

            // Tạo DetailImport cho từng kho
            const newDetailImports =
              item.detail_import.map((detail) => {
                const warehouse = warehousesMap.get(detail.warehouse_id);
                const lotName =
                  detail.lot_name ||
                  `${productData.title} ${skus_name ? '- ' + skus_name : ''} - ${warehouse.name} - ${dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss')}`;
                return manager.create(DetailImport, {
                  warehouse,
                  quantity_import: detail.quantity_import,
                  quantity_remaining: detail.quantity_import,
                  quantity_sold: 0,
                  price_import: detail.price_import,
                  skus: saveNewSKU,
                  import: saveImport,
                  lot_name: lotName,
                });
              }) || [];
            await manager.save(newDetailImports);
          }

          if (saveProduct?.images?.length === 0) {
            saveProduct.images = skusImage;
            await manager.save(saveProduct);
          }

          return {
            status: 201,
            message: 'Sản phẩm được tạo thành công',
            data: {
              ...saveProduct,
              specifications: savespecifications,
              skus: effectiveSkus.map((item) => ({
                ...item,
                detail_import: item.detail_import || [],
              })),
            },
          };
        },
      );
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '23505') {
          // Mã lỗi PostgreSQL cho duplicate key
          const constraintName = e.driverError.constraint;
          if (constraintName === 'UQ_warehouse_lot_skus') {
            throw new ConflictException('Tên lô đã bị trùng lặp');
          }
        }
      }
      throw e;
    }
  }

  async updateProductVariant(
    productId: string,
    dataProductVariant: UpdateProdutVariantDto,
    user,
  ) {
    const { brand_id, category_id, specifications, ...productData } =
      dataProductVariant;
    // Find the existing product
    const existingProduct = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['specifications'],
      withDeleted: true,
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Find category
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Find brand
    const brand = await this.brandRepository.findOne({
      where: { id: brand_id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    try {
      return await this.productsRepository.manager.transaction(
        async (manager) => {
          const existingImages = existingProduct.images || [];
          if (existingImages.length > 0) {
            const existingImagesPublicId = existingImages.map((image) =>
              extractPublicId(image),
            );
            await this.cloudinaryService.removeFiles(existingImagesPublicId);
          }
          // Update product data
          manager.merge(Products, existingProduct, {
            ...productData,
            category,
            brand,
          });
          const updatedProduct = await manager.save(existingProduct);

          // Handle specifications
          if (specifications && specifications.length > 0) {
            // Check for duplicate specifications
            const duplicateSpec = Object.entries(
              specifications?.reduce(
                (acc, spec) => {
                  const key = `${spec.name}:${spec.value}`;
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            )
              ?.filter(([_, count]) => count > 1)
              ?.map(([key]) => key.split(':')[0]);

            if (duplicateSpec.length > 0) {
              throw new ConflictException(
                `Thông số ${duplicateSpec.join(', ')} đã bị trùng lặp`,
              );
            }

            // Remove old specifications
            await manager.delete(Specification, { product: { id: productId } });

            // Create and save new specifications
            const newSpecifications = specifications.map((spec) =>
              manager.create(Specification, {
                ...spec,
                product: updatedProduct,
              }),
            );
            const savedSpecifications = await manager.save(newSpecifications);

            // Update product with new specifications
            updatedProduct.specifications = savedSpecifications;
            await manager.save(updatedProduct);
          } else {
            // If no specifications provided, remove existing ones
            await manager.delete(Specification, { product: { id: productId } });
          }

          return {
            status: 200,
            message: 'Sản phẩm được cập nhật thành công',
            data: updatedProduct,
          };
        },
      );
    } catch (e) {
      throw e;
    }
  }

  async uploadImage(image: Express.Multer.File) {
    const folder = 'Product/';
    const uploadResult = await this.cloudinaryService.uploadFile(image, folder);

    return {
      public_id: uploadResult.public_id,
      url: uploadResult.url,
    };
  }

  async uploadMultiImage(
    files: {
      files?: Express.Multer.File[];
      backgrounds?: Express.Multer.File[];
    },
    folder?: string,
  ) {
    const allFiles = [...(files.files || []), ...(files.backgrounds || [])];

    try {
      const uploadResults = await this.cloudinaryService.uploadFiles(
        allFiles,
        folder,
      );

      const fileUrls = uploadResults.map((result) => ({
        public_id: result.public_id,
        url: result.url,
      }));

      return {
        status: 200,
        message: 'Files uploaded successfully',
        data: fileUrls,
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }
  // Xóa mềm sản phẩm
  async softDeleteProduct(id: string) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productsRepository.softDelete(id); // Xóa mềm
      // Trả về thông báo thành công

      // Nếu sản phẩm đã bị xóa mềm, không cần thực hiện lại
      if (product.deletedAt) {
        throw new BadRequestException('Product is already deleted');
      }

      return {
        status: 201,
        message: 'Product successfully soft deleted',
      };
    } catch (error) {
      throw error;
    }
  }

  // Khôi phục sản phẩm đã xóa mềm
  async restoreProduct(id: string) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!product) {
        throw new NotFoundException('Product not found or not deleted');
      }

      if (!product.deletedAt) {
        throw new BadRequestException('Product is not deleted');
      }

      await this.productsRepository.restore(id);

      return {
        status: 201,
        message: 'Product successfully restored',
      };
    } catch (error) {
      throw error;
    }
  }
  // Lấy danh sách sản phẩm chưa bị xóa mềm
  async getActiveProducts() {
    return this.productsRepository.find({ where: { deletedAt: null } });
  }
  // Tìm SKU theo optionValue ID

  async getSKU_byOptionValueID(optionValueID: string): Promise<Skus> {
    const optionValue = await this.optionValueRepository.findOne({
      where: { id: optionValueID },
      relations: ['skus', 'skus.optionValue'],
    });

    if (!optionValue) {
      throw new NotFoundException(
        `OptionValue with ID ${optionValueID} not found`,
      );
    }

    if (!optionValue.skus) {
      throw new NotFoundException(
        `SKU for OptionValue ID ${optionValueID} not found`,
      );
    }

    return optionValue.skus;
  }

  async sendMailAdmin_ResponseCustomer(infoContact_OfCustomer) {
    const emailAdmin = 'ngodinhphuoc100@gmail.com';
    this.mailerService.sendMail({
      to: emailAdmin, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Information Contact Of Customer ✔', // Subject line

      template: '../contactPrice',
      context: {
        name: infoContact_OfCustomer.name ?? infoContact_OfCustomer.email,
        email: infoContact_OfCustomer.email,
        phone: infoContact_OfCustomer.phone,
        note: infoContact_OfCustomer.note,
      },
    });

    this.mailerService.sendMail({
      to: infoContact_OfCustomer.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Response Customer ✔', // Subject line

      template: '../thankyou',
      context: {},
    });
    return infoContact_OfCustomer;
  }

  async getBestSellingProducts(type: ProductType = ProductType.CAR) {
    try {
      const products = await this.productsRepository.find({
        where: { type, deletedAt: IsNull() },
        relations: ['skus', 'skus.detail_import'],
      });

      const totalSoldPerProduct = products.map((product) => {
        const totalSold =
          product.skus.reduce((sum, sku) => {
            return (
              sum +
              sku.detail_import.reduce(
                (detailSum, detail) => detailSum + detail.quantity_sold,
                0,
              )
            );
          }, 0) || 0;
        return {
          product,
          totalSold,
        };
      });

      const sortedProducts = totalSoldPerProduct.sort(
        (a, b) => b.totalSold - a.totalSold,
      );

      const top_5_products = sortedProducts
        .slice(0, 5)
        .map((item) => item.product);

      return {
        status: 200,
        message: 'Lấy sản phẩm bán chạy thành công',
        data: top_5_products,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductUserPageID(id: string) {
    try {
      const products = await this.productsRepository.findOne({
        where: { id },
        relations: [
          'skus',
          'skus.optionValue',
          'skus.optionValue.option',
          'specifications',
          'skus.detail_import',
          'brand',
          'category',
        ],
        withDeleted: true,
      });
      if (!products) {
        throw new NotFoundException(`Product with ID "${id}" not found.`);
      }

      const optionValues: OptionValueUserPageResponseType[] = [];
      products.skus.forEach((sku) => {
        sku.optionValue.forEach((optionValue) => {
          const optionName = optionValue.option.name;
          const existingOption = optionValues.find(
            (opt) => opt.name === optionName,
          );
          if (existingOption) {
            const existingValue = existingOption.values.find(
              (v) => v[0] === optionValue.value,
            );
            if (existingValue) {
              existingValue[1].push(optionValue.id);
            } else {
              existingOption.values.push([optionValue.value, [optionValue.id]]);
            }
          } else {
            const newOption: OptionValueUserPageResponseType = {
              name: optionName,
              values: [[optionValue.value, [optionValue.id]]],
            };
            optionValues.push(newOption);
          }
        });
      });
      const totalStock = products.skus.reduce((sum, sku) => {
        const skuStock = sku.detail_import.reduce(
          (detailSum, detail) => detailSum + detail.quantity_remaining,
          0,
        );
        return sum + skuStock;
      }, 0);

      const totalSold = products.skus.reduce((sum, sku) => {
        const skuSold = sku.detail_import.reduce(
          (detailSum, detail) => detailSum + detail.quantity_sold,
          0,
        );
        return sum + skuSold;
      }, 0);
      const productResponse: ProductUserPageResponseType = {
        id: products.id,
        title: products.title,
        description: products.decodeDescription(products.description),
        images: products.images || [],
        type: products.type,
        brand: {
          id: products.brand.id,
          name: products.brand.name,
        },
        category: {
          id: products.category.id,
          name: products.category.name,
        },
        specifications: products.specifications || [],
        optionValues,
        totalStock,
        totalSold,
      };

      return {
        status: 200,
        message: 'Lấy thông tin sản phẩm thành công',
        data: productResponse,
      };
    } catch (e) {
      throw e;
    }
  }
}
