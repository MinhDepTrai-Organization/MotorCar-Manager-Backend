import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import CreateContactDto from './dto/create-contact.dto';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import QueryContactDto from './dto/query-contact.dto';

@Controller('contact')
@ApiTags(Tag.CONTACT)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Public()
  async getAllContacts(@Query() query: QueryContactDto) {
    return this.contactService.getAllContacts(query);
  }

  @Post()
  @Public()
  @ApiBody({
    type: CreateContactDto,
    description: 'Thông tin liên hệ',
    required: true,
  })
  async createContact(@Body() createData: CreateContactDto) {
    return this.contactService.createContact(createData);
  }

  @Patch(':id')
  @Public()
  @ApiBody({
    type: CreateContactDto,
    description: 'Cập nhật thông tin liên hệ',
    required: true,
  })
  async updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: CreateContactDto,
  ) {
    return this.contactService.updateContact(id, updateData);
  }

  @Delete(':id')
  @Public()
  async deleteContact(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.deleteContact(id);
  }
}
