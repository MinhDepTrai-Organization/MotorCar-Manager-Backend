import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Brand } from '../brand/entities/brand.entity';
import QueryCategoryDto, {
  CategoryResponseType,
} from './dto/query-category.dto';
import { SortOrder } from 'src/constants/sortOrder.enum';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async createCategory(categories) {
    try {
      console.log(categories);
      const { name, parentCategoryId, description, slug } = categories;
      const category = new Category();
      category.name = name;
      category.description = description;
      category.slug = slug;

      if (parentCategoryId) {
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: parentCategoryId }, // Thay thế cách truyền trực tiếp ID
        });

        if (parentCategory) {
          category.parentCategory = parentCategory;
        } else {
          throw new NotFoundException('Parent category not found');
        }
      }

      // Lưu danh mục mới
      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error('Error creating category:', error);

      // Xử lý lỗi khi không tìm thấy danh mục cha
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Trường hợp lỗi server hoặc lỗi khác
      throw new InternalServerErrorException(
        'An error occurred while creating the category',
      );
    }
  }

  async getCategories(query: QueryCategoryDto) {
    try {
      const {
        pageSize = 10,
        current = 1,
        sortOrder = SortOrder.DESC,
        responseType = CategoryResponseType.TREE,
        ...filters
      } = query;
      const categories =
        await this.categoryRepository.createQueryBuilder('category');

      if (responseType === CategoryResponseType.TREE) {
        categories
          .leftJoinAndSelect('category.children', 'children')
          .leftJoinAndSelect('children.children', 'grandchildren')
          .where('category.parentCategory IS NULL');
      }
      if (filters.search) {
        const search = filters.search.trim();
        if (isUUID(search)) {
          categories.andWhere('category.id = :id', { id: search });
        } else {
          categories.andWhere(
            '(category.name ILIKE :search OR category.slug ILIKE :search OR category.description ILIKE :search)',
            {
              search: `%${search}%`,
            },
          );
        }
      }

      if (filters.type) {
        categories.andWhere('category.type = :type', {
          type: filters.type,
        });
      }

      if (filters.status !== undefined) {
        if (filters.status) {
          categories.andWhere('category.deletedAt IS NULL');
        } else {
          categories.andWhere('category.deletedAt IS NOT NULL');
        }
      }

      const [data, total] = await categories
        .orderBy(
          'category.updatedAt',
          sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
        )
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        status: 200,
        message: 'Lấy categories thành công',
        data: {
          data: data,
          meta: {
            total,
            pageSize,
            current,
            totalPages,
          },
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.parentCategory', 'parentCategory') // Lấy danh mục cha
        .leftJoinAndSelect('category.children', 'children') // Lấy danh mục con
        .leftJoinAndSelect('children.children', 'grandchildren') // Lấy danh mục con nhỏ hơn

        .where('category.id = :id', { id })
        .getOne();

      // Nếu không tìm thấy category, ném lỗi
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục với ID này.');
      }

      // Gắn các danh mục con nhỏ hơn vào đúng con
      category.children.forEach((child) => {
        child.children = child.children.filter((grandchild) => grandchild); // Loại bỏ các con nhỏ hơn không có
      });

      return {
        status: 200,
        message: 'Lấy dữ liệu thành công',
        data: category,
      };
    } catch (error) {
      console.error('Error fetching category:', error);

      // Nếu lỗi là NotFoundException, ném lỗi này đi
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Ném lỗi chung nếu có lỗi khác
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi khi lấy danh mục. Vui lòng thử lại sau.',
      );
    }
  }
  async getCategoriesByName(name: string): Promise<Category[]> {
    try {
      if (!name) {
        return []; // Trả về mảng rỗng nếu không có name
      }

      // Tìm danh mục theo tên với toán tử LIKE
      return await this.categoryRepository.find({
        where: {
          name: Like(`%${name}%`), // Tìm kiếm với toán tử LIKE
        },
        relations: ['children'], // Đảm bảo bạn dùng đúng tên trường quan hệ
        //, 'product'
      });
    } catch (error) {
      console.error('Error while searching categories by name:', error);

      // Ném lỗi nếu có lỗi trong quá trình tìm kiếm
      throw new InternalServerErrorException(
        'An error occurred while searching for categories',
      );
    }
  }

  // Phương thức cập nhật danh mục
  async updateCategory(
    id: string,
    updateCategoryDto: any,
  ): Promise<{ message: string; data?: Category }> {
    try {
      // Tìm danh mục cần cập nhật
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['children'],
      });
      //return category;
      if (!category) {
        // Thay vì ném ra exception, trả về lỗi với HttpException
        throw new NotFoundException('Không tìm thấy danh mục với ID này.');
      }
      // Cập nhật thông tin danh mục
      category.name = updateCategoryDto.name || category.name;
      // Cập nhật thông tin danh mục
      category.description =
        updateCategoryDto.description || category.description;
      category.slug = updateCategoryDto.slug || category.slug;
      // Nếu có parentCategoryId, chúng ta sẽ cập nhật mối quan hệ cha-con
      if (updateCategoryDto.parentCategoryId) {
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentCategoryId },
        });
        if (parentCategory) {
          category.parentCategory = parentCategory;
        } else {
          throw new NotFoundException('Parent Category not found');
        }
      } else {
        category.parentCategory = null;
      }

      // Lưu lại thay đổi

      const updatedCategory = await this.categoryRepository.save(category);
      return {
        message: 'Cập nhật thành công ',
        data: updatedCategory,
      };
    } catch (error) {
      throw error;
    }
  }
  // Phương thức xóa danh mục
  async deleteCategory(id: string) {
    try {
      // Tìm danh mục cần xóa
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['children', 'product'], // Tải cả sản phẩm và danh mục con nếu có
      });

      // Nếu không tìm thấy danh mục, ném lỗi
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      // Xóa danh mục
      await this.categoryRepository.remove(category);

      // Trả về thông báo xóa thành công
      return { message: 'Category deleted successfully' };
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình xóa, ném lỗi Server Error
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Xóa mềm danh mục
  async softDelete(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id }, // Sử dụng `where` để tìm kiếm theo id
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.deletedAt = new Date(); // Đánh dấu xóa mềm
    return this.categoryRepository.save(category); // Lưu lại thay đổi
  }

  // Khôi phục danh mục đã xóa mềm
  async restore(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id }, // Sử dụng `where` để tìm kiếm theo id
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.deletedAt === null) {
      throw new BadRequestException('Category has not been soft-deleted'); // Danh mục chưa bị xóa mềm
    }

    category.deletedAt = null; // Khôi phục lại trạng thái xóa
    return this.categoryRepository.save(category); // Lưu lại thay đổi
  }

  // Lọc danh mục không bị xóa mềm
  async findAllActive(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children') // Lấy danh mục con
      .leftJoinAndSelect('children.children', 'grandchildren') // Lấy danh mục con nhỏ hơn
      .where('category.deletedAt IS NULL') // Điều kiện lọc danh mục chưa bị xóa mềm
      .getMany(); // Lấy tất cả danh mục (danh sách) không bị xóa mềm
  }
}
