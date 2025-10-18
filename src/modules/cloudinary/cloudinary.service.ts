import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/constants/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxFileSize) {
        throw new BadRequestException(
          `File size exceeds limit of ${maxFileSize / (1024 * 1024)}MB`,
        );
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    }).catch((error) => {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException(
        'File upload failed',
        error.message,
      );
    });
  }

  async removeFile(publicId: string): Promise<CloudinaryResponse> {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new InternalServerErrorException('File removal failed', error);
    }
  }

  async removeFiles(public_ids: string[]): Promise<CloudinaryResponse> {
    try {
      return await cloudinary.api.delete_resources(public_ids);
    } catch (error) {
      console.error('Error removing files:', error);
      throw error;
    }
  }
  // upload nhiều file
  async uploadFiles(
    files: Express.Multer.File[] | Express.Multer.File,
    folder: string = 'Product/',
  ): Promise<CloudinaryResponse[]> {
    if (!files || (Array.isArray(files) && files.length === 0))
      throw new NotFoundException('No file found in upload files cloudinary');
    if (!Array.isArray(files)) files = [files];
    const uploadPromises = files.map(async (file) => {
      try {
        return await this.uploadFile(file, folder);
      } catch (error: any) {
        console.error(
          `Failed to upload file ${file.originalname}: ${error?.message || 'Unknown error'}`,
        );
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    return results.filter((result) => result !== null) as CloudinaryResponse[];
  }

  async getImageByPublicId(publicId: string) {
    try {
      const searchOptions: any = {
        type: 'upload',
        resource_type: 'image',
      };
      const result = await cloudinary.api.resource(publicId, searchOptions);
      return result;
    } catch (e: any) {
      if (e.error && e.error.http_code === 404) {
        throw new NotFoundException(
          `No image found with public id ${publicId}`,
        );
      }
      throw e;
    }
  }

  async getImagesByFolder(params: { folder: string; maxResult?: number }) {
    try {
      const { folder, maxResult = 10 } = params;
      if (!folder) throw new Error('Folder is required');
      const searchOptions: any = {
        type: 'upload',
        resource_type: 'image',
        max_results: maxResult,
        sort_by: ['public_id', 'desc'],
        prefix: folder,
      };

      const results = await cloudinary.api.resources(searchOptions);
      return results?.resources;
    } catch (e: any) {
      if (e.error && e.error.http_code === 404) {
        throw new NotFoundException(
          `No image found in ${params.folder} folder`,
        );
      }
      throw e;
    }
  }
}
