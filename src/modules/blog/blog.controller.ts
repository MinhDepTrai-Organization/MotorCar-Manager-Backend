import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';
import { ResponseBlogDto } from './dto/response-blog';
import { BlogPaginationQueryDto } from './dto/PaginationQueryBlog.dto';

@ApiTags(Tag.BLOG)
@Controller('blogs')
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({
    summary: 'Get all blogs',
    description:
      'Get all blogs, search by title, content, filter by category, user name, sort by id, ',
  })
  @Public()
  @Get()
  async findAll(@Query() Params?: BlogPaginationQueryDto) {
    return await this.blogService.findAllByParams(Params);
  }

  @Get('images/folder')
  @ApiOperation({
    summary: 'Get image from blog folder',
  })
  @ApiQuery({
    type: 'string',
    name: 'folder',
    example: 'blog',
    required: false,
  })
  @ApiQuery({
    type: 'number',
    name: 'maxResults',
    example: 10,
    required: false,
  })
  async getImagesFromFolder(
    @Query('folder') folder: string = 'blog',
    @Query('maxResults') maxResults: number,
  ) {
    return await this.blogService.getImageByFolder(folder, maxResults);
  }

  @Get('images/public-id')
  @ApiOperation({
    summary: 'Get image by public id',
  })
  @ApiQuery({
    type: 'string',
    name: 'publicId',
    example: 'publicId',
    required: true,
  })
  async getImageByPublicId(@Query('publicId') publicId: string) {
    return await this.blogService.getImageByPublicId(publicId);
  }

  @ApiOperation({
    summary: 'Get blog by id',
    description: 'Get blog by id',
  })
  @Get(':id')
  @Public()
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.blogService.findOneBy('id', id, ['blogCategory']);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a blog',
    description:
      'Create a blog will all required fields are title, content(html format), blogCategoryId(UUID), slug(unique). Please upload all blog images and thumbnail image to cloud first, then add the image url to the blogImages and thumbnail field, images must be jpg, png or jpeg, and below 5mb',
  })
  @ApiBody({
    type: CreateBlogDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Blog created successfully',
    type: CreateBlogDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'blog Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'slug is unique, please try another',
  })
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.create(createBlogDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateBlogDto })
  @ApiOperation({
    summary: 'Update a blog',
    description: 'Update a blog',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return await this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a blog',
    description: 'Delete a blog',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.blogService.remove(id);
  }

  @Post('upload-image')
  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload image',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
  ) {
    return this.blogService.uploadImage('blog', image);
  }

  @Post('upload-images')
  @ApiOperation({
    summary: 'Upload multiple blog content images',
    description: 'Upload multiple blog content images',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadImages(
    @UploadedFiles(new FileValidationPipe()) images: Express.Multer.File[],
  ) {
    return this.blogService.uploadImages('folder', images);
  }
}
