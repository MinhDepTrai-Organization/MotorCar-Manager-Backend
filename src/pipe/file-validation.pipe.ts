import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  ALLOWED_MIME_TYPES,
  ERROR_MESSAGES,
  MAX_FILE_SIZE,
} from 'src/constants/file-upload-validate';
@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Express.Multer.File[] | Express.Multer.File {
    var files: Express.Multer.File[];
    if (value instanceof Array) files = value;
    else files = value ? [value] : [];

    if (!Array.isArray(files)) {
      throw new BadRequestException('Input must be an array of image files');
    }
    if (files.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.FILE_REQUIRED);
    }

    files.forEach((file) => {
      this.isValidFile(file);
    });

    if (files.length === 1) return files[0];
    return files;
  }

  private isValidFile(value: any): void {
    if (!value || !value.mimetype || !value.size)
      throw new BadRequestException('Invalid Multer file object');
    if (!ALLOWED_MIME_TYPES.includes(value.mimetype))
      throw new BadRequestException(ERROR_MESSAGES.INVALID_FILE_TYPE);
    if (value.size > MAX_FILE_SIZE)
      throw new BadRequestException(ERROR_MESSAGES.FILE_TOO_LARGE);
  }
}
