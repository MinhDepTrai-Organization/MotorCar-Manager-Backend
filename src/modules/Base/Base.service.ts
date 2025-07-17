import {
  DeepPartial,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Base } from './entities/Base.entity';
import { NotFoundException } from '@nestjs/common';
import { DEFAULT_ERROR_MESSAGE } from 'src/constants/defaultErrorResponse';
import { getRelations, transformDto } from 'src/helpers/transformObjectDto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

export class BaseService<
  Entity extends Base,
  CreateDto,
  UpdateDto,
  ResponseDto,
> {
  private entityName: string;
  constructor(
    protected readonly repo: Repository<Entity>,
    private readonly createDto: new () => CreateDto,
    private readonly updateDto: new () => UpdateDto,
    private readonly responseDto: new () => ResponseDto,
    entityName: string,
    private cloudinaryService?: CloudinaryService,
  ) {
    this.entityName = entityName;
  }

  async create(dto: CreateDto) {
    try {
      const entityToSave = this.repo.create(dto as DeepPartial<Entity>);
      const savedEntity = await this.repo.save(entityToSave);
      const sortedEntity = transformDto(this.responseDto, savedEntity);
      return {
        status: 201,
        message: `${this.entityName} created successfully`,
        data: sortedEntity,
      };
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw e;
      }
      const errorMessage =
        e instanceof Error ? e.message : DEFAULT_ERROR_MESSAGE;
      throw new Error(errorMessage);
    }
  }

  // Read (Find all)
  async findAll(relations: string[] = []) {
    try {
      const entityRelations = getRelations<Entity>(this.repo);

      const customRelations =
        relations.length > 0 ? relations : entityRelations;

      const entities = await this.repo.find({
        relations: customRelations,
      });

      if (!entities || entities.length === 0)
        throw new NotFoundException(`No ${this.entityName} entity found`);

      const transformEntities = entities.map((e) =>
        transformDto(this.responseDto, e),
      );

      return transformEntities;
    } catch (e) {
      throw e;
    }
  }

  async findOneBy(prop: string, value: string, relations: string[] = []) {
    try {
      const customRelations =
        relations.length > 0 ? relations : getRelations<Entity>(this.repo);

      const whereClause: FindOptionsWhere<Entity> = {
        [prop]: value,
      } as FindOptionsWhere<Entity>;

      const entity = await this.repo.findOne({
        where: whereClause,
        relations: customRelations,
      });

      if (!entity) throw new NotFoundException(`No ${this.entityName} found`);
      const transformEntity = transformDto(this.responseDto, entity);
      return {
        status: 200,
        message: `${this.entityName} found successfully`,
        data: transformEntity,
      };
    } catch (e) {
      throw e;
    }
  }

  // Update
  async update(
    id: string,
    dto: UpdateDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseDto;
  }> {
    try {
      const entity = await this.repo.findOne({
        where: { id } as FindOptionsWhere<Entity>,
      });
      if (!entity)
        throw new NotFoundException(
          `Not found any ${this.entityName} with the given ID`,
        );
      Object.assign(entity, dto);
      const updatedEntity = await this.repo.save(entity);
      const transformEntity = transformDto(this.responseDto, updatedEntity);
      return {
        status: 200,
        message: `${this.entityName} updated successfully`,
        data: transformEntity,
      };
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw e;
      }
      const message = e instanceof Error ? e.message : DEFAULT_ERROR_MESSAGE;
      throw new Error(message);
    }
  }

  // Delete
  async remove(id: string) {
    try {
      const findEntity = await this.repo.findOneBy({
        id,
      } as FindOptionsWhere<Entity>);
      if (!findEntity) throw new NotFoundException('No such entity found');
      const result = await this.repo.delete(id);
      const response = result.affected !== 0;
      if (!response) throw new Error(`Failed to delete ${this.entityName}`);
      const transformEntity = transformDto(this.responseDto, findEntity);
      return {
        status: true,
        message: `${this.entityName} deleted successfully`,
        data: transformEntity,
      };
    } catch (e) {
      throw e;
    }
  }

  async getImageByFolder(folder: string, maxResult?: number) {
    try {
      const result = await this.cloudinaryService.getImagesByFolder({
        folder,
        maxResult,
      });
      if (!result || result.length === 0)
        throw new NotFoundException(`No image found in ${folder} folder`);
      const response = result.map((i) => ({
        public_id: i.public_id,
        url: i.url,
      }));
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getImageByPublicId(publicId: string) {
    try {
      const result = await this.cloudinaryService.getImageByPublicId(publicId);
      if (!result)
        throw new NotFoundException(
          `No image found with public id ${publicId}`,
        );
      return result.url;
    } catch (e) {
      throw e;
    }
  }

  async uploadImage(folder: string, image: Express.Multer.File) {
    try {
      const uploadResult = await this.cloudinaryService.uploadFile(
        image,
        folder,
      );

      return {
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      };
    } catch (e) {
      throw e;
    }
  }

  async uploadImages(folder: string, images: Express.Multer.File[]) {
    try {
      const uploadResults = await this.cloudinaryService.uploadFiles(
        images,
        folder,
      );
      return uploadResults.map((uploadResult) => ({
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      }));
    } catch (e) {
      throw e;
    }
  }

  async removeFileByPublicId(publicId: string) {
    try {
      const result = await this.cloudinaryService.removeFile(publicId);
      if (!result)
        throw new NotFoundException(`No file found with public id ${publicId}`);
      return true;
    } catch (e) {
      throw e;
    }
  }

  async removeFilesByPublicIds(publicIds: string[]) {
    try {
      const result = await this.cloudinaryService.removeFiles(publicIds);
      if (!result)
        throw new NotFoundException(
          `No files found with public ids ${publicIds}`,
        );
      return true;
    } catch (e) {
      throw e;
    }
  }
}
