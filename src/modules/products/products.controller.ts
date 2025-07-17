import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UploadedFiles,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';
import {
  EnumProductSortBy,
  EnumProductSortByLabel,
  ProductQuery,
} from './dto/FindProductDto.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { UploadImageReponseDto } from '../blog/dto/response-blog';
import { UploadMultipleFilesDto } from './dto/UploadMultipleFilesDto.dto';
import { User } from 'src/decorators/current-user';
import { Roles } from 'src/decorators/role-route';
import { RoleEnum } from 'src/constants/role.enum';
import { CreateProductVariantDto } from './dto/create-product-variants.dto';
import { ResponseUpdateProductDto } from './dto/responseProductDto';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { SuccessResponseBodySchema } from 'src/constants/response-body-schema';
import { ProductType } from 'src/constants';
import { UpdateProdutVariantDto } from './dto/update-product-variants.dto';
import { Public } from 'src/decorators/public-route';
import { InfoContact } from './dto/info.dto';
@ApiTags(Tag.Products)
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Lấy danh sách các thuộc tính sắp xếp sản phẩm',
  })
  @Public()
  @Get('sort-by')
  getEnumProductSortBy() {
    return {
      status: 200,
      message: 'Lấy danh sách các thuộc tính sắp xếp sản phẩm thành công',
      data: Object.values(EnumProductSortBy).map((value) => ({
        value,
        label: EnumProductSortByLabel[value],
      })),
    };
  }

  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm bán chạy nhất',
  })
  @Public()
  @Get('best-selling')
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ProductType,
    description: 'Type of product (car, motorbike)',
    example: ProductType.CAR,
  })
  async getBestSellingProducts(@Query('type') type?: ProductType) {
    return await this.productsService.getBestSellingProducts(type);
  }
  @ApiOperation({
    summary: 'Tạo sản phẩm có biến thể',
    description: `Body của request \n
    {
        "type": "car" (kiểu sản phẩm, có thể là "car", "motorbike", bắt buộc),
        "slug_product": "Xe-ô-tô-vinfast ko có biến thể" (slug của sản phẩm, bắt buộc),
        "title": "Xe ô tô Vinfast ko có biến thể" (tiêu đề sản phẩm, bắt buộc),
        "description": "<p><strong>Xe máy điện VinFast...</strong></p>" (mô tả sản phẩm dưới dạng HTML, tùy chọn),
        "brand_id": "44d018c0-603f-47b0-9ea4-256fed4d9cc7" (ID thương hiệu, bắt buộc),
        "category_id": "821888a8-544c-4793-8cf3-0d1a877e15b5" (ID danh mục, bắt buộc),
        "specifications": [  (danh sách thông số kỹ thuật, tùy chọn),
          {
            "name": "Màu sắc",
            "value": "Đỏ"
          }
        ],
        "images": [    (danh sách hình ảnh sản phẩm, tùy chọn),
          "a.png",
          "b.png",
          "c.png"
        ],
        "skus": [    (mảng đối tượng chứa thông tin biến thể sản phẩm, bắt buộc),
          {
            "masku": "123",  (mã SKU, tùy chọn),
            "barcode": "12",  (barcode, tùy chọn),
            "name": "Xe VinFast",  (tên biến thể sản phẩm, tùy chọn),
            "image": "a.png",  (hình ảnh biến thể sản phẩm, tùy chọn),
            "price_sold": 2500, (giá bán của biến thể sản phẩm, tùy chọn hoặc 0),
            "price_compare": 2500, (giá so sánh của biến thể sản phẩm, tùy chọn hoặc 0),
            "variant_combinations": [    (mảng thuộc tính kết hợp tạo nên biến thể của sản phẩm, tùy chọn),
              {
                "option_id": "1ac80854-7166-41a5-bcd8-3473be9264b8",  (ID của thuộc tính, bắt buộc),
                "value": "Xanh lá"  (giá trị của thuộc tính, bắt buộc)
              }
            ],
            "detail_import": [  (mảng chi tiết nhập hàng cho biến thể sản phẩm, bắt buộc),
              {
                "warehouse_id": "74f68f7c-a9a9-41ed-a5ec-132a93051abb",  ( ID kho hàng, bắt buộc),
                "quantity_import": 1000,  (số lượng nhập, bắt buộc),
                "price_import": 2300  (giá nhập của biến thể sản phẩm, bắt buộc)
              }
            ]
          }
        ]
      }
    `,
  })
  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiBody({
    type: CreateProductVariantDto,
    description: 'Thông tin sản phẩm',
  })
  @ResponseMessage('Tạo sản phẩm thành công')
  async createProductVariant(
    @Body() product: CreateProductVariantDto,
    @User() user,
  ) {
    return this.productsService.createProductVariant(product, user);
  }

  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm',
  })
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched products.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  @ApiQuery({
    name: 'current',
    required: false,
    description: 'Current page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of records per page',
    example: 10,
  })
  @ApiQuery({
    name: 'categoryID',
    required: false,
    description: 'Filter by category ID',
    example: '12345678-1234-5678-123456789012',
  })
  @ApiQuery({
    name: 'brandID',
    required: false,
    description: 'Filter by brand ID',
    example: '12345678-1234-5678-123456789012',
  })
  @ApiQuery({
    name: 'price_min',
    required: false,
    description: 'Filter by minimum price',
    example: 1000,
  })
  @ApiQuery({
    name: 'price_max',
    required: false,
    description: 'Filter by maximum price',
    example: 500000,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by product name',
    example: 'Camry ',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Type of product',
    enum: ProductType,
    example: ProductType.CAR,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    description: 'Filter by product status',
    example: true,
  })
  findAllProductBySearch(@Query() query: ProductQuery) {
    return this.productsService.findAllBySearch(query);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của sản phẩm',
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e', // Giá trị mặc định cho ID
  })
  @Get(':id/stock')
  @ApiOperation({
    summary: 'Lấy thông tin tồn kho của sản phẩm theo id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của sản phẩm',
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin tồn kho của sản phẩm',
    schema: SuccessResponseBodySchema(200, 'Lấy thông tin tồn kho thành công', {
      totalStock: 100,
      totalSKU: 5,
    }),
  })
  @Public()
  async getProductStockByID(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.getProductStockByID(id);
  }

  /////// tìm kiếm sản phẩm theo id
  @ApiOperation({
    summary: 'Tìm kiếm sản phẩm theo id ',
  })
  @Public()
  @Get(':id')
  @ResponseMessage('Lấy sản phẩm thành công')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  /// Cập nhật sản phẩm theo id
  @ApiOperation({
    summary: 'Cập nhật sản phẩm theo id ',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của sản phẩm',
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e', // Giá trị mặc định cho ID
  })
  @ApiBody({
    type: UpdateProdutVariantDto,
    description: 'Thông tin sản phẩm',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật sản phẩm thành công',
    type: ResponseUpdateProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc thiếu thông tin cần thiết',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy sản phẩm, thương hiệu hoặc danh mục',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi server nội bộ khi cập nhật sản phẩm',
  })
  @Put(':id')
  @ResponseMessage('Cập nhật sản phẩm thành công')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProdutVariantDto,
    @User() user,
  ) {
    return this.productsService.updateProductVariant(
      id,
      updateProductDto,
      user,
    );
  }
  @Delete(':id/hard-delete')
  @ApiOperation({
    summary: 'Xóa sản phẩm vĩnh viễn theo id',
  })
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
  // xóa mềm
  @Delete(':id/soft')
  @ApiOperation({
    summary: 'Xóa mềm sản phẩm theo id',
  })
  async softDelete(@Param('id') id: string) {
    return await this.productsService.softDeleteProduct(id);
  }

  // Route để khôi phục sản phẩm đã xóa mềm
  @Patch(':id/restore')
  @ResponseMessage('Khôi phục sản phẩm thành công')
  async restore(@Param('id') id: string) {
    return this.productsService.restoreProduct(id);
  }
  // Route để lấy danh sách sản phẩm chưa bị xóa mềm
  @Get('active')
  @Public()
  @ResponseMessage('Lấy sản phẩm chưa xóa mềm thành công')
  async getActiveProducts() {
    return this.productsService.getActiveProducts();
  }

  @ApiOperation({ summary: 'upload picture inside Products' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Successfull Operation',
    type: UploadImageReponseDto,
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage1(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
  ) {
    return this.productsService.uploadImage(image);
  }

  @Post('upload/multipleImage')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 5 }, // Allows up to 5 avatar images
      { name: 'backgrounds', maxCount: 5 }, // Allows up to 5 background images
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple images (Avatar and Background)' })
  @ApiBody({
    description: 'Upload files (avatar and background images)',
    type: UploadMultipleFilesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully uploaded images',
    schema: {
      example: {
        message: 'Files uploaded successfully',
        status: 'success',
        data: {
          files: ['avatar1.jpg', 'avatar2.jpg'],
          backgrounds: ['background1.jpg'],
        },
      },
    },
  })
  async uploadMultipleFiles(
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      backgrounds?: Express.Multer.File[];
    },
    @Body()
    body: {
      folder: string;
    },
  ) {
    const { folder } = body;
    return this.productsService.uploadMultiImage(files, folder);
  }
  /////// tìm kiếm SKU  theo idoptionvalue
  @ApiOperation({
    summary: 'Tìm kiếm SKU theo id ',
  })
  @Get('getSku/:id')
  @Public()
  @ResponseMessage('Lấy SKU thành công')
  async findOneSKU_byOptionValue(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.getSKU_byOptionValueID(id);
  }

  /////// Liên hệ gửi mail về admin và phản hồi khách hàng
  @ApiOperation({
    summary: 'Liên hệ gửi mail về admin và phản hồi khách hàng ',
  })
  @Post('contact')
  @ResponseMessage('Báo giá thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất')
  async sendMailAdmin_ResponseCustomer(@Body() info: InfoContact) {
    return await this.productsService.sendMailAdmin_ResponseCustomer(info);
  }

  @ApiOperation({
    summary: 'Lấy ID trang người dùng của sản phẩm',
  })
  @Get('user-page-id/:id')
  @Public()
  @ResponseMessage('Lấy ID trang người dùng của sản phẩm thành công')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của sản phẩm (nếu có)',
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e', // Giá trị mặc định cho ID
  })
  async getProductUserPageID(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductUserPageID(id);
  }
}
