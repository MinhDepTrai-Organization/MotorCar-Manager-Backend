import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OptionalValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return value;
    }

    const { metatype, data } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    switch (metatype) {
      case Number:
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
          throw new BadRequestException(`${data} must be a integer number`);
        }
        return numValue;
      case String:
        return String(value);
      case Boolean:
        if (value === 'true' || value === '1' || value === 1) return true;
        if (value === 'false' || value === '0' || value === 0) return false;
        throw new BadRequestException(`${data} must be a boolean value`);
      case Object:
        if (typeof value === 'object') return value;
        if (typeof value === 'string')
          try {
            return JSON.parse(value);
          } catch (e) {
            throw new BadRequestException(
              `${data} must be a object, expected valid json`,
            );
          }
        throw new BadRequestException(`${data} must be a object`);
      case Array:
        if (Array.isArray(value)) return value;
        throw new BadRequestException(`${data} must be a array`);
      default:
        return value;
    }
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
