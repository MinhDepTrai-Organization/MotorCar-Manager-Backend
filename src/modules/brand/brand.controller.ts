import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Public } from 'src/decorators/public-route';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { UploadImageReponseDto } from '../blog/dto/response-blog';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import QueryBrandDto from './dto/query-brand.dto';
@ApiTags(Tag.BRAND)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('convert-url-to-base64')
  @Public()
  async convertUrlToBase64(@Query('url') url: string) {
    const decodedUrl = decodeURIComponent(url);
    return this.brandService.convertToBase64FromUrl(decodedUrl);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully fetched products.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Public()
  @Post()
  @ResponseMessage('Tạo mới thành công')
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }
  @ApiOperation({
    summary: 'get all Brand information ..',
  })
  @ApiQuery({ name: 'current', required: false, description: 'Current page' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of record each page',
  })
  @ApiQuery({
    name: 'current',
    required: false,
    description: ' Trang hiện tại ',
    example: '',
  })
  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách thương hiệu')
  findAll(@Query() paginationQuery: QueryBrandDto) {
    return this.brandService.findAll(paginationQuery);
  }
  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thương hiệu thành công')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }
  @Public()
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thương hiệu cần cập nhật',
    required: true,
    example: '955e8e9e-657d-4f23-b2d4-3a7c2a2560c8',
  })
  @ResponseMessage('Cập nhật thương hiệu thành công')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }
  @Public()
  @Delete(':id')
  @ResponseMessage('Xóa thương hiệu thành công')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thương hiệu cần cập nhật',
    required: true,
    example: '955e8e9e-657d-4f23-b2d4-3a7c2a2560c8',
  })
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }

  @ApiOperation({ summary: 'upload picture inside Brand' })
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
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
  ) {
    return this.brandService.uploadImage(image);
  }

  @ApiOperation({ summary: 'update Brand thumbnail' })
  @ApiConsumes('multipart/form-data')
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
  @ApiCreatedResponse({
    description: 'Successfull Operation',
    type: UploadImageReponseDto,
  })
  @ApiNotFoundResponse({ description: "Can't find brand" })
  @ApiForbiddenResponse({ description: 'Only author can update brand' })
  @Public()
  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  updateThumbnail(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.brandService.updateThumbnail(id, file);
  }
}
