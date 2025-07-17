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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Public } from 'src/decorators/public-route';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';

import { Tag } from 'src/constants/api-tag.enum';
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
import { UploadImageReponseDto } from '../blog/dto/response-blog';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
@ApiTags(Tag.Branch)
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({
    status: 201,
    description: 'Branch created successfully',
    schema: {
      example: {
        message: 'Branch created successfully',
        data: {
          id: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
          name: 'Chi nhánh A',
          address: '123 Đường ABC, TP.HCM',
          managername: 'Nguyễn Văn A',
          logo: 'logo.png',
          wareHouses: [
            {
              id: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
              name: 'Kho miền Bắc',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all branches with pagination' })
  @ApiQuery({ name: 'current', required: false, description: 'Current page' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of records per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of branches fetched successfully',
    schema: {
      example: {
        total: 2,
        page: 1,
        pageSize: 10,
        data: [
          {
            id: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
            name: 'Chi nhánh A',
            address: '123 Đường ABC, TP.HCM',
            managername: 'Nguyễn Văn A',
            logo: 'logo.png',
          },
          {
            id: '9f5d9c8a-2b9a-45e7-933e-7e1c3a7f8b4d',
            name: 'Chi nhánh B',
            address: '456 Đường XYZ, Hà Nội',
            managername: 'Trần Thị B',
            logo: 'logo_b.png',
          },
        ],
      },
    },
  })
  @ResponseMessage('Lấy danh sách thành công')
  findAll(@Query() paginationQuery) {
    return this.branchService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({
    name: 'id',
    example: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
  })
  @ApiResponse({
    status: 200,
    description: 'Branch details fetched successfully',
    schema: {
      example: {
        id: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
        name: 'Chi nhánh A',
        address: '123 Đường ABC, TP.HCM',
        managername: 'Nguyễn Văn A',
        logo: 'logo.png',
        wareHouses: [
          {
            id: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
            name: 'Kho miền Bắc',
          },
        ],
      },
    },
  })
  @ResponseMessage('Lấy Chi nhánh thành công')
  @ApiResponse({ status: 404, description: 'Branch not found' })
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update branch by ID' })
  @ApiParam({
    name: 'id',
    example: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
  })
  @ApiResponse({
    status: 200,
    description: 'Branch updated successfully',
    schema: {
      example: {
        message:
          'Branch with ID 2a2bebe7-131b-4a2b-8342-b030c6ce4cee has been successfully updated.',
        updatedBranch: {
          id: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
          name: 'Chi nhánh A (Updated)',
          address: '456 Đường XYZ, Hà Nội',
          managername: 'Nguyễn Văn A',
          logo: 'logo_updated.png',
          wareHouses: [
            {
              id: '9f5d9c8a-2b9a-45e7-933e-7e1c3a7f8b4d',
              name: 'Kho miền Nam',
            },
          ],
        },
      },
    },
  })
  @ResponseMessage('Cập nhật Chi nhánh thành công')
  @ApiResponse({ status: 404, description: 'Branch not found' })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch by ID' })
  @ApiParam({
    name: 'id',
    example: '2a2bebe7-131b-4a2b-8342-b030c6ce4cee',
  })
  @ApiResponse({
    status: 200,
    description: 'Branch deleted successfully',
    schema: {
      example: {
        message:
          'Branch with ID 2a2bebe7-131b-4a2b-8342-b030c6ce4cee has been successfully deleted.',
      },
    },
  })
  @ResponseMessage('Xóa chi nhánh thành công')
  @ApiResponse({ status: 404, description: 'Branch not found' })
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }

  // swapper ảnh

  @ApiOperation({ summary: 'upload picture inside Branch' })
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
  @ResponseMessage('Tạo ảnh thành công')
  uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
  ) {
    return this.branchService.uploadImage(image);
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'update Branch thumbnail' })
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
  @ApiNotFoundResponse({ description: "Can't find branch" })
  @ApiForbiddenResponse({ description: 'Only author can update branch' })
  @Public()
  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Cập nhật ảnh thành công')
  updateThumbnail(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.branchService.updateThumbnail(id, file);
  }
}
