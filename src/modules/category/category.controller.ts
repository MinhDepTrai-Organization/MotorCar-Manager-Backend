import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/decorators/public-route';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import {
  CategoryResponseDto,
  CreateResponseCategoryDto,
} from './dto/response-category';
import { Category } from './entities/category.entity';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import QueryCategoryDto from './dto/query-category.dto';

@Public()
@ApiTags(Tag.CATEGORY)
@Controller('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary:
      'parentCategoryId :Nếu tạo  danh mục cha, giá trị là null. Nếu là danh mục con  thì thêm Id thằng cha đó. ',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Successfully fetched products.',
    type: CreateResponseCategoryDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  @ResponseMessage('Tạo category thành công')
  async create(@Body() category: CreateCategoryDto) {
    return this.categoryService.createCategory(category);
  }

  @ApiOperation({
    summary: 'Lấy danh sách category ',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched All products.',
    type: [CategoryResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found .' })
  @Get()
  @Public()
  async findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.getCategories(query);
  }

  @ApiOperation({
    summary: 'Lọc danh mục không bị xóa mềm',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Successfully fetched products.',
    type: [CategoryResponseDto],
  })
  @Public()
  @Get('active')
  async findAllActive() {
    return this.categoryService.findAllActive();
  }

  @ApiResponse({
    status: 404,
    description: 'Category not found with the provided ID.',
  })
  @ApiOperation({
    summary: 'Lấy category theo id ',
  })
  @ApiOkResponse({
    status: 200,
    type: CategoryResponseDto,
  })
  @ApiParam({
    example: 'd1803da5-0aba-4c63-b792-bcd23ec6a4e7',
    name: 'id',
  })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
  @ApiOperation({ summary: 'get all category con theo tên cha ' })
  @Get('name/:name')
  @Public()
  async findOneByname(@Param('name') name: string) {
    return this.categoryService.getCategoriesByName(name);
  }
  @Patch(':id')
  @ApiOperation({
    summary:
      'Update a category by ID , ParentCategoryID có thể null, có thể truyền id cha nó hoặc không . có thể thay đổi description ',
  }) // Mô tả ngắn về chức năng API
  @ApiParam({
    name: 'id',
    description: 'ID of the category to update',
    type: String,
    required: true,
    example: 'b7b5cf58-2302-4647-9d7f-af7066ab8ee4',
  }) // Định nghĩa tham số `id` trong URL
  @ApiBody({
    description: 'Data to update the category',
    type: UpdateCategoryDto, // DTO được sử dụng cho body
  }) // Định nghĩa dữ liệu gửi lê'
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu gửi lên không hợp lệ',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục với ID đã cung cấp',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi máy chủ nội bộ',
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
  //Endpoint xóa danh mục

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @ApiOperation({
    summary: 'Xóa mềm thành công thì deletedAt trả về khác null  ',
  })
  // Xóa mềm danh mục
  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string) {
    return this.categoryService.softDelete(id);
  }

  // Khôi phục danh mục đã xóa mềm
  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return this.categoryService.restore(id);
  }
}
