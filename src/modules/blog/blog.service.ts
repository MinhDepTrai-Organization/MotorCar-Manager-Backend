import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Brackets, QueryFailedError, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BaseService } from '../Base/Base.service';
import { ResponseBlogDto } from './dto/response-blog';
import { plainToInstance } from 'class-transformer';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';
import { getDtoKeys, sortObject } from 'src/helpers/transformObjectDto';
import { Customer } from '../customers/entities/customer.entity';
import { BlogPaginationQueryDto } from './dto/PaginationQueryBlog.dto';
import { isUUID } from 'class-validator';
import { convertToTimeStampPostgres } from 'src/helpers/datetime.format';

@Injectable()
export class BlogService extends BaseService<
  Blog,
  CreateBlogDto,
  UpdateBlogDto,
  ResponseBlogDto
> {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(BlogCategory)
    private blogCategoryRepository: Repository<BlogCategory>,
    cloudinaryService: CloudinaryService,
  ) {
    super(
      blogRepository,
      CreateBlogDto,
      UpdateBlogDto,
      ResponseBlogDto,
      'Blog',
      cloudinaryService,
    );
  }

  async findAllByParams(
    queryParams?: BlogPaginationQueryDto,
    relations?: string[],
  ) {
    try {
      const { current, pageSize, sortOrder, search, ...filters } = queryParams;
      const offset = (current - 1) * pageSize;
      const limit = pageSize;
      const queryBuilder = this.blogRepository
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.blogCategory', 'blogCategory')
        .leftJoinAndSelect('blog.customer', 'customer')
        .skip(offset)
        .take(limit);

      if (search) {
        const searchInput = search.trim();
        if (isUUID(searchInput)) {
          queryBuilder.andWhere('blog.id = :searchExact', {
            searchExact: searchInput,
          });
        } else {
          queryBuilder.andWhere(
            '(blog.title ILIKE :search or blog.content ILIKE :search or blog.slug ILIKE :search)',
            { search: `%${searchInput.trim()}%` },
          );
        }
      }

      if (filters.blog_category_id) {
        queryBuilder.andWhere('blog.blogCategoryId = :blogCategoryId', {
          blogCategoryId: filters.blog_category_id,
        });
      }

      if (filters.created_from && filters.created_to) {
        const from = convertToTimeStampPostgres(filters.created_from);
        const to = convertToTimeStampPostgres(filters.created_to);
        if (from < to) {
          queryBuilder.andWhere('blog.createdAt BETWEEN :from AND :to', {
            from,
            to,
          });
        } else {
          throw new BadRequestException(
            'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
          );
        }
      }

      const [blogs, totalRecord] = await queryBuilder
        .orderBy(`blog.updatedAt`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
        .getManyAndCount();

      const totalPage = Math.ceil(totalRecord / pageSize);
      const data = blogs.map((blog) =>
        plainToInstance(ResponseBlogDto, blog, {
          excludeExtraneousValues: true,
        }),
      );

      return {
        status: 200,
        message: 'Blogs found successfully',
        data: {
          meta: {
            totalRecord,
            totalPage,
            pageSize,
            current,
          },
          data: data,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async findOneBy(
    prop: string,
    value: string,
    relations?: string[],
  ): Promise<{ status: number; message: string; data: ResponseBlogDto }> {
    return await super.findOneBy(prop, value, relations);
  }

  async create(blogDto: CreateBlogDto): Promise<{
    status: number;
    message: string;
    data: ResponseBlogDto;
  }> {
    try {
      const { blogCategoryId, customerId, ...rest } = blogDto;
      const blogCategory = await this.blogCategoryRepository.findOne({
        where: { id: blogCategoryId },
      });
      if (!blogCategory) throw new NotFoundException('Blog category not found');
      const customer = await this.blogRepository.manager
        .getRepository(Customer)
        .findOne({
          where: {
            id: customerId,
          },
        });
      if (!customer) throw new NotFoundException('Customer not found');

      const newBlog = {
        ...rest,
        customer,
        blogCategory,
      };
      const blog = await this.blogRepository.save(newBlog);

      return {
        status: 200,
        message: 'Blog created successfully',
        data: plainToInstance(ResponseBlogDto, blog, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (e) {
      if (e instanceof QueryFailedError)
        throw new ConflictException('slug is unique, please try another');
      throw e;
    }
  }

  async update(
    id: string,
    blogDto: UpdateBlogDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseBlogDto;
  }> {
    try {
      const blog = await this.blogRepository.findOneBy({ id });
      if (!blog) throw new NotFoundException('Blog not found');
      const { blogCategoryId, customerId, blogImages, ...resBlog } = blogDto;
      const blogCategory = await this.blogCategoryRepository.findOneBy({
        id: blogCategoryId,
      });
      if (!blogCategory) throw new NotFoundException('Blog category not found');
      const customer = await this.blogRepository.manager
        .getRepository(Customer)
        .findOne({
          where: {
            id: customerId,
          },
        });
      if (!customer) throw new NotFoundException('Customer not found');
      if (blogImages && blogImages.length > 0) {
        const blogImagesDb = blog.blogImages;
        await this.removeFilesByPublicIds(blogImagesDb);
      }

      const updateBlog = {
        ...blog,
        ...resBlog,
        blogImages,
        customer,
        blogCategory,
      };

      const result = await this.blogRepository.save(updateBlog);

      const transformBlog = plainToInstance(ResponseBlogDto, result, {
        excludeExtraneousValues: true,
      });

      const orderData = sortObject(transformBlog, [
        ...getDtoKeys(ResponseBlogDto),
      ]) as ResponseBlogDto;
      return {
        status: 200,
        message: 'Blog updated successfully',
        data: orderData,
      };
    } catch (e) {
      if (e instanceof QueryFailedError)
        throw new ConflictException('slug is unique, please try another');
      throw e;
    }
  }

  async remove(
    id: string,
  ): Promise<{ status: boolean; message: string; data: ResponseBlogDto }> {
    return await super.remove(id);
  }
}
