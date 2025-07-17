import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

export const sortObject = (
  obj: object,
  orderKeyArray: string[] = [],
): object => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid object provided for sorting');
  }
  if (!orderKeyArray || orderKeyArray.length === 0)
    throw new Error('Please provide an array of keys to sort the objects');
  const invalidKeys = Object.keys(obj).filter(
    (k) => !orderKeyArray.includes(k),
  );
  if (invalidKeys.length > 0)
    throw new Error(
      `The following keys do not exist in the object: ${invalidKeys.join(', ')}`,
    );
  return Object.fromEntries(
    Object.entries(obj).sort(
      ([keyA], [keyB]) =>
        orderKeyArray.indexOf(keyA) - orderKeyArray.indexOf(keyB),
    ),
  );
};

export const getDtoKeys = <T>(dto: new () => T): string[] => {
  return Object.keys(
    plainToInstance(dto, {}, { excludeExtraneousValues: true }),
  );
};

export const transformDto = <T>(dto: new () => T, obj: object): T => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid object provided for transforming');
  }
  const transformDto = plainToInstance(dto, obj, {
    excludeExtraneousValues: true,
  });

  if (!transformDto || Object.keys(transformDto).length === 0) {
    throw new Error(
      'Invalid DTO: No @Expose() properties found or empty object Dto',
    );
  }

  const orderData = sortObject(transformDto as object, getDtoKeys(dto));
  return orderData as T;
};

export const getRelations = <T>(repo: Repository<T>): string[] => {
  if (!repo) {
    throw new Error('Repository is undefined or null');
  }
  const metadata = repo.metadata;

  if (!metadata) {
    throw new Error(`Metadata not found for Entity in repository`);
  }
  return metadata.relations.map((relation) => relation.propertyName);
};
