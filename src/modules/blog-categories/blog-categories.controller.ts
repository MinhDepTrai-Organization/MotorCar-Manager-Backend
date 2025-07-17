import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { Public } from 'src/decorators/public-route';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { QueryFailedError } from 'typeorm';
import QueryBlogCategoryDto from './dto/query-blog-category.dto';

@Controller('blog-categories')
@ApiTags(Tag.BLOG_CATEGORY)
@ApiBearerAuth()
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @ApiOperation({
    summary: 'Get all blog categories',
  })
  @Public()
  @Get()
  async findAll(@Query() query: QueryBlogCategoryDto) {
    return await this.blogCategoriesService.findAllBlogCategory(query);
  }

  @ApiOperation({
    summary: 'Get blog category by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Record found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiProperty({
    name: 'id',
    example: '84664212-d01c-4243-a37b-6d43b8d45c57',
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return await this.blogCategoriesService.findOneBy('id', id);
  }

  @Post()
  @ApiBody({ type: CreateBlogCategoryDto })
  @ApiOperation({
    summary: 'Create blog category',
    description:
      'This will create a new blog category, all required fields contain name, slug',
  })
  @ApiResponse({
    status: 201,
    description: 'Record created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request(invalid data)',
  })
  async create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    try {
      return await this.blogCategoriesService.create(createBlogCategoryDto);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BadRequestException('Slug or name already exists');
      }
      throw e;
    }
  }

  @Put(':id')
  @ApiBody({ type: UpdateBlogCategoryDto })
  @ApiOperation({
    summary: 'Update blog category',
    description:
      'This will update a blog category, all required fields contain name, slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Record updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request(invalid data)',
  })
  @ApiProperty({
    name: 'id',
    example: '84664212-d01c-4243-a37b-6d43b8d45c57',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    try {
      return this.blogCategoriesService.update(id, updateBlogCategoryDto);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BadRequestException('Slug or name already exists');
      }
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Delete blog category by id',
  })
  @ApiProperty({
    name: 'id',
    example: '84664212-d01c-4243-a37b-6d43b8d45c57',
  })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.blogCategoriesService.remove(id);
  }
}
