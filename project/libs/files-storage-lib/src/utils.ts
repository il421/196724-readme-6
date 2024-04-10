import { Request } from 'express';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';

export const filename = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  callback(null, path(file));
};

export const path = (file: Express.Multer.File): string =>
  `${randomUUID()}.${extension(file.mimetype)}`;
