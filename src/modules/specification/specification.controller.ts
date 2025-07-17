import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-route';
import { Tag } from 'src/constants/api-tag.enum';

@Controller('specification')
@ApiTags(Tag.SPECIFICATION)
@Public()
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post()
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationService.create(createSpecificationDto);
  }

  @Get()
  @ApiOperation({
    summary: "Lấy tất cả danh sách thông số kỹ thuật"
  })


  async findAll(){
    return await this.specificationService.findAll();
  }

  @Get(":productId")
  @ApiOperation({
    summary: "Lấy tất cả danh sách thông số kỹ thuật theo id sản phẩm"
  })
  @ApiParam({
    name: "productId",
    description: "ID sản phẩm",
    required: true,
  })
  async findByProductId(@Param("productId", ParseUUIDPipe) productId: string) {
    return await this.specificationService.findByProductId(productId);
  }
}
