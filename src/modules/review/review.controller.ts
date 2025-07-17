import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { User } from 'src/decorators/current-user';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';
@ApiTags(Tag.REVIEW)
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới đánh giá' })
  @ApiResponse({ status: 201, description: 'Đánh giá đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  create(@Body() createReviewDto: CreateReviewDto, @User() user) {
    return this.reviewService.createReview(createReviewDto, user);
  }

  @ApiOperation({
    summary: 'lấy tất cả đánh giá ',
  })
  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  // lấy giá của sản phẩm đó
  @ApiOperation({
    summary: 'lấy id  của sản phẩm đó',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của sản phẩm',
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách đánh giá theo sản phẩm thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đánh giá cho sản phẩm',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi server khi lấy đánh giá sản phẩm',
  })
  findOne(@Param('id') id: string) {
    return this.reviewService.findReviewsByProductId(id);
  }

  @ApiOperation({
    summary: 'Cập nhật review theo id review  ',
  })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của đánh giá',
    example: '321dd963-a529-415a-9b95-b3aa803ffcb7',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật đánh giá thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đánh giá với ID đã cung cấp',
  })
  @ApiResponse({ status: 500, description: 'Lỗi server khi cập nhật đánh giá' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @ApiOperation({
    summary: 'Xóa mềm review theo id ',
  })
  @ApiParam({
    name: 'id',
    example: '321dd963-a529-415a-9b95-b3aa803ffcb7',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa mềm review thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa mềm review thành công',
        data: {
          id: '321dd963-a529-415a-9b95-b3aa803ffcb7',
          deletedAt: '2025-03-09T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy review',
    schema: {
      example: {
        statusCode: 404,
        message: 'Không tìm thấy review với ID đã cung cấp',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  // Thêm nhiều ảnh
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
    return this.reviewService.uploadImages('folder/review', images);
  }
  @ApiOperation({
    summary: 'Xóa cứng review theo id review  ',
  })
  @ApiParam({
    name: 'id',
    example: '321dd963-a529-415a-9b95-b3aa803ffcb7',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa review thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa review thành công',
        data: {
          id: '321dd963-a529-415a-9b95-b3aa803ffcb7',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy review',
    schema: {
      example: {
        statusCode: 404,
        message: 'Không tìm thấy review với ID đã cung cấp',
      },
    },
  })
  @Delete('hard-delete/:id')
  removeHardReview(@Param('id') id: string) {
    return this.reviewService.removeHardReview(id);
  }
}
