import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { IHeaders, ITokenPayload, User } from '@project/core';

export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

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

export const getRabbitMQConnectionString = ({
  user,
  password,
  host,
  port,
}): string => {
  return `amqp://${user}:${password}@${host}:${port}`;
};

export const unique = <T>(items: T[]): T[] => {
  return Array.from(new Set(items));
};

export const getToken = (headers: IHeaders): string =>
  headers.authorization.split(' ')[1];

export const getSkipPages = (page?: number, limit?: number) =>
  page && limit ? (page - 1) * limit : undefined;

export const calculatePage = (totalCount: number, limit: number): number => {
  return Math.ceil(totalCount / limit);
};

export const parseTime = (time: string): TimeAndUnit => {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);

  if (!match) {
    throw new Error(`[parseTime] Bad time string: ${time}`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, 10);

  if (isNaN(value)) {
    throw new Error(`[parseTime] Can't parse value count. Result is NaN.`);
  }

  const unit = unitRaw as DateTimeUnit;

  return { value, unit };
};

export const createJWTPayload = (user: User): ITokenPayload => {
  return {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
