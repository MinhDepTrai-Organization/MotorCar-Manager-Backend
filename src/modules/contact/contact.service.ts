import { BadRequestException, Injectable } from '@nestjs/common';
import CreateContactDto from './dto/create-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { QueryFailedError, Repository } from 'typeorm';
import QueryContactDto from './dto/query-contact.dto';
import { isUUID } from 'class-validator';
import { convertToTimeStampPostgres } from 'src/helpers/datetime.format';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async getAllContacts(query: QueryContactDto) {
    try {
      const { current = 1, pageSize = 10, ...filters } = query;
      const skip = (current - 1) * pageSize;
      const queryBuilder = this.contactRepository
        .createQueryBuilder('contact')
        .skip(skip)
        .take(pageSize)
        .orderBy('contact.updatedAt', 'DESC');

      if (filters.search) {
        const input = filters.search.trim();
        if (isUUID(input)) {
          queryBuilder.where('contact.id = :id', { id: input });
        } else {
          queryBuilder.where(
            'contact.name ILIKE :search OR contact.email ILIKE :search OR contact.phone ILIKE :search',
            { search: `%${input}%` },
          );
        }
      }

      if (filters.service) {
        queryBuilder.andWhere('contact.service = :service', {
          service: filters.service,
        });
      }

      if (filters.created_from && filters.created_to) {
        const from = convertToTimeStampPostgres(filters.created_from);
        const to = convertToTimeStampPostgres(filters.created_to);
        if (from <= to) {
          queryBuilder.andWhere('contact.createdAt BETWEEN :from AND :to', {
            from,
            to,
          });
        } else {
          throw new BadRequestException('Từ ngày không thể lớn hơn đến ngày');
        }
      }

      const [data, total] = await queryBuilder.getManyAndCount();
      const totalPage = Math.ceil(total / pageSize);
      return {
        status: 200,
        message: 'Lấy danh sách liên hệ thành công',
        data: {
          contact: data,
          meta: {
            current: current,
            pageSize: pageSize,
            total: total,
            totalPage: totalPage,
          },
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async createContact(createData: CreateContactDto) {
    try {
      const newContact = this.contactRepository.create(createData);
      const saveContact = await this.contactRepository.save(newContact);
      return {
        status: 201,
        message: 'Tạo liên hệ thành công',
        data: saveContact,
      };
    } catch (e) {
      throw e;
    }
  }

  async updateContact(id: string, updateData: CreateContactDto) {
    try {
      const existingContact = await this.contactRepository.findOne({
        where: { id: id },
      });
      if (!existingContact) {
        throw new BadRequestException('Liên hệ không tồn tại');
      }
      const updatedContact = this.contactRepository.merge(
        existingContact,
        updateData,
      );
      const saveContact = await this.contactRepository.save(updatedContact);
      return {
        status: 200,
        message: 'Cập nhật liên hệ thành công',
        data: saveContact,
      };
    } catch (e) {
      throw e;
    }
  }

  async deleteContact(id: string) {
    const existingContact = await this.contactRepository.findOne({
      where: { id: id },
    });
    if (!existingContact) {
      throw new BadRequestException('Liên hệ không tồn tại');
    }
    await this.contactRepository.delete(id);
    return {
      status: 200,
      message: 'Xoá liên hệ thành công',
    };
  }
}
