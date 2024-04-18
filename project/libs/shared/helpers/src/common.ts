import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

export function fillDto<T, V>(
  someDto: ClassConstructor<T>,
  plainObject: V,
  options?: ClassTransformOptions
): T {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
    ...options,
  });
}

export const getMongoConnectionString = ({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase,
}): string => {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
};

export const unique = <T>(items: T[]): T[] => {
  return Array.from(new Set(items));
};
