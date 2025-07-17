import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BaseService } from '../Base/Base.service';
import { ResponseBlogCategoryDto } from './dto/response-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { getRelations, transformDto } from 'src/helpers/transformObjectDto';
import { Blog } from '../blog/entities/blog.entity';
import QueryBlogCategoryDto from './dto/query-blog-category.dto';
import { isUUID } from 'class-validator';
import {
  convertDate,
  convertToTimeStampPostgres,
} from 'src/helpers/datetime.format';
import { DATE_FORMAT } from 'src/constants';
import { SortOrder } from 'src/constants/sortOrder.enum';
@Injectable()
export class BlogCategoriesService extends BaseService<
  BlogCategory,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  ResponseBlogCategoryDto
> {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCategoryRepo: Repository<BlogCategory>,
  ) {
    super(
      blogCategoryRepo,
      CreateBlogCategoryDto,
      UpdateBlogCategoryDto,
      ResponseBlogCategoryDto,
      'BlogCategory',
    );
  }

  async findAllBlogCategory(query: QueryBlogCategoryDto) {
    try {
      const { current = 1, pageSize = 10, sortOrder, ...filters } = query;
      const start = (current - 1) * pageSize;
      const queryBuilder = this.blogCategoryRepo
        .createQueryBuilder('blogCategory')
        .leftJoinAndSelect('blogCategory.blogs', 'blogNew');

      if (filters.blogId) {
        queryBuilder.andWhere('blogNew.id = :blogId', {
          blogId: filters.blogId,
        });
      }

      if (filters.search && filters.search.trim() !== '') {
        const searchInput = filters.search.trim();
        const queryParam: Record<string, any> = {
          search: `%${searchInput}%`,
        };
        const conditions: string[] = [];
        if (isUUID(searchInput)) {
          conditions.push('blogCategory.id = :searchExact');
          queryParam.searchExact = searchInput;
        }

        conditions.push(
          `blogCategory.name ILIKE :search OR blogCategory.description ILIKE :search OR blogCategory.slug ILIKE :search`,
        );
        const resultCondition = `(${conditions.join(' OR ')})`;
        queryBuilder.andWhere(resultCondition, queryParam);
      }

      if (filters.status !== undefined) {
        queryBuilder.andWhere('blogCategory.deleteAt = :status', {
          status: filters.status ? Not(IsNull()) : IsNull(),
        });
      }

      if (filters.created_from && filters.created_to) {
        const from = convertToTimeStampPostgres(filters.created_from);
        const to = convertToTimeStampPostgres(filters.created_to);
        if (from < to) {
          queryBuilder.andWhere(
            'blogCategory.createdAt BETWEEN :from AND :to',
            {
              from,
              to,
            },
          );
        } else {
          throw new BadRequestException(
            'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
          );
        }
      }
      const [blogCategories, total] = await queryBuilder
        .orderBy(
          `blogCategory.updatedAt`,
          sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
        )
        .skip(start)
        .take(pageSize)
        .distinct(false)
        .getManyAndCount();
      const total_page = Math.ceil(total / pageSize);
      const sortedBlogCategories = blogCategories.map((blogCategory) =>
        transformDto(ResponseBlogCategoryDto, blogCategory),
      );
      return {
        status: 200,
        message: 'Blog categories found successfully',
        data: {
          totalPage: total_page,
          totalRecord: total,
          current,
          pageSize,
          data: sortedBlogCategories,
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
  ): Promise<{
    status: number;
    message: string;
    data: ResponseBlogCategoryDto;
  }> {
    return await super.findOneBy(prop, value, relations);
  }

  async update(
    id: string,
    dto: UpdateBlogCategoryDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseBlogCategoryDto;
  }> {
    try {
      const blogCategory = await this.blogCategoryRepo.findOne({
        where: {
          id,
        },
        relations: ['blogs'],
      });
      if (!blogCategory) {
        throw new NotFoundException('Blog category not found');
      }
      const { blogIds } = dto;

      if (blogIds && blogIds.length > 0) {
        const blogs = await this.blogCategoryRepo.manager
          .getRepository(Blog)
          .find({
            where: {
              id: In(blogIds),
            },
          });
        if (blogs.length !== blogIds.length) {
          throw new BadRequestException('Some blog ids are invalid');
        }
        blogCategory.blogs = blogs;
      }

      const updatedBlogCategory = await this.blogCategoryRepo.save({
        ...blogCategory,
        ...dto,
      });
      const sortedBlogCategory = transformDto(
        ResponseBlogCategoryDto,
        updatedBlogCategory,
      );
      return {
        status: 200,
        message: 'Blog category updated successfully',
        data: sortedBlogCategory,
      };
    } catch (e) {
      throw e;
    }
  }

  async create(dto: CreateBlogCategoryDto): Promise<{
    status: number;
    message: string;
    data: ResponseBlogCategoryDto;
  }> {
    return await super.create(dto);
  }

  async remove(id: string): Promise<{
    status: boolean;
    message: string;
    data: ResponseBlogCategoryDto;
  }> {
    return await super.remove(id);
  }
}
